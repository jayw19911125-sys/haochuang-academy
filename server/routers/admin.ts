import { z } from "zod";
import { eq, and, or, desc, sql, gte, lte, count, gt, isNull, inArray } from "drizzle-orm";
import { router, publicProcedure, adminProcedure } from "../_core/trpc";
import { getDb } from "../db";
import { computeCompositeScore } from "@shared/compositeScore";
import {
  chapterProgress,
  quizAttempts,
  wrongNotes,
  dailyQuizRecords,
  learningTimeLogs,
  leaderboardSnapshots,
  announcements,
} from "../../drizzle/schema";

// 管理員授權：所有 admin procedures 一律使用 adminProcedure，
// 由 OAuth session（ctx.user.role === "admin"）驗證。

export const adminRouter = router({
  // ─── 全員學習概覽 ────────────────────────────────────

  // 取得所有學員的學習摘要
  getAllLearnersOverview: adminProcedure
    .query(async () => {
      const db = await getDb();
      if (!db) return { error: "DB unavailable", data: [] };

      // 取得所有有學習記錄的 deviceId
      const devices = await db
        .select({
          deviceId: chapterProgress.deviceId,
          chaptersCompleted: sql<number>`sum(case when quiz_passed = 1 then 1 else 0 end)`,
          chaptersRead: sql<number>`sum(case when is_read = 1 then 1 else 0 end)`,
          lastActivity: sql<Date>`max(updated_at)`,
        })
        .from(chapterProgress)
        .groupBy(chapterProgress.deviceId)
        .orderBy(desc(sql`max(updated_at)`));

      // 取得每個 device 的測驗統計
      const quizStats = await db
        .select({
          deviceId: quizAttempts.deviceId,
          totalAttempts: sql<number>`count(*)`,
          avgScore: sql<number>`avg(score)`,
          passedCount: sql<number>`sum(case when passed = 1 then 1 else 0 end)`,
        })
        .from(quizAttempts)
        .groupBy(quizAttempts.deviceId);

      // 取得每個 device 的學習時間
      const timeStats = await db
        .select({
          deviceId: learningTimeLogs.deviceId,
          totalSeconds: sql<number>`sum(total_seconds)`,
        })
        .from(learningTimeLogs)
        .groupBy(learningTimeLogs.deviceId);

      // 取得每日一題統計
      const dailyStats = await db
        .select({
          deviceId: dailyQuizRecords.deviceId,
          totalAnswered: sql<number>`count(*)`,
          correctCount: sql<number>`sum(case when is_correct = 1 then 1 else 0 end)`,
        })
        .from(dailyQuizRecords)
        .where(eq(dailyQuizRecords.isAnswered, true))
        .groupBy(dailyQuizRecords.deviceId);

      // 合併資料
      const quizMap = new Map(quizStats.map(q => [q.deviceId, q]));
      const timeMap = new Map(timeStats.map(t => [t.deviceId, t]));
      const dailyMap = new Map(dailyStats.map(d => [d.deviceId, d]));

      const data = devices.map((d, index) => {
        const quiz = quizMap.get(d.deviceId ?? "");
        const time = timeMap.get(d.deviceId ?? "");
        const daily = dailyMap.get(d.deviceId ?? "");
        
        const chaptersCompleted = d.chaptersCompleted ?? 0;
        const avgScore = quiz?.avgScore ?? 0;
        const totalSeconds = time?.totalSeconds ?? 0;
        const dailyCorrect = daily?.correctCount ?? 0;
        const dailyTotal = daily?.totalAnswered ?? 0;
        
        // 綜合評分（與排行榜一致，共用 shared/compositeScore）
        const compositeScore = computeCompositeScore({
          chaptersCompleted,
          avgQuizScore: avgScore,
          totalLearningSeconds: totalSeconds,
          dailyQuizCorrect: dailyCorrect,
          dailyQuizAnswered: dailyTotal,
        });

        return {
          rank: index + 1,
          deviceId: d.deviceId ?? "unknown",
          chaptersCompleted,
          chaptersRead: d.chaptersRead ?? 0,
          progressPercent: Math.round((chaptersCompleted / 14) * 100),
          avgQuizScore: Math.round(avgScore),
          totalQuizAttempts: quiz?.totalAttempts ?? 0,
          quizPassedCount: quiz?.passedCount ?? 0,
          totalLearningSeconds: totalSeconds,
          totalLearningHours: Math.round(totalSeconds / 360) / 10,
          dailyQuizAnswered: dailyTotal,
          dailyQuizCorrect: dailyCorrect,
          dailyQuizAccuracy: dailyTotal > 0 ? Math.round((dailyCorrect / dailyTotal) * 100) : 0,
          compositeScore,
          lastActivity: d.lastActivity,
        };
      });

      // 按綜合評分排序並更新 rank
      data.sort((a, b) => b.compositeScore - a.compositeScore);
      data.forEach((d, i) => { d.rank = i + 1; });

      return { error: null, data };
    }),

  // ─── 章節完成率統計 ──────────────────────────────────

  getChapterCompletionStats: adminProcedure
    .query(async () => {
      const db = await getDb();
      if (!db) return [];

      const stats = await db
        .select({
          chapterId: chapterProgress.chapterId,
          chapterTitle: chapterProgress.chapterTitle,
          totalLearners: sql<number>`count(distinct device_id)`,
          readCount: sql<number>`sum(case when is_read = 1 then 1 else 0 end)`,
          passedCount: sql<number>`sum(case when quiz_passed = 1 then 1 else 0 end)`,
          avgScore: sql<number>`avg(case when quiz_score is not null then quiz_score else null end)`,
          avgAttempts: sql<number>`avg(quiz_attempts)`,
        })
        .from(chapterProgress)
        .groupBy(chapterProgress.chapterId, chapterProgress.chapterTitle)
        .orderBy(chapterProgress.chapterId);

      return stats.map(s => ({
        ...s,
        avgScore: Math.round(s.avgScore ?? 0),
        avgAttempts: Math.round((s.avgAttempts ?? 0) * 10) / 10,
        readRate: s.totalLearners > 0 ? Math.round((s.readCount / s.totalLearners) * 100) : 0,
        passRate: s.totalLearners > 0 ? Math.round((s.passedCount / s.totalLearners) * 100) : 0,
      }));
    }),

  // ─── 測驗難題分析 ────────────────────────────────────

  getHardQuestions: adminProcedure
    .query(async () => {
      const db = await getDb();
      if (!db) return [];

      // 從錯題本統計最常被收藏的題目
      const hardQuestions = await db
        .select({
          questionId: wrongNotes.questionId,
          questionText: wrongNotes.questionText,
          chapterId: wrongNotes.chapterId,
          wrongCount: sql<number>`count(*)`,
          explanation: wrongNotes.explanation,
        })
        .from(wrongNotes)
        .groupBy(wrongNotes.questionId, wrongNotes.questionText, wrongNotes.chapterId, wrongNotes.explanation)
        .orderBy(desc(sql`count(*)`))
        .limit(20);

      return hardQuestions;
    }),

  // ─── 每日活躍度趨勢 ──────────────────────────────────

  getDailyActivityTrend: adminProcedure
    .input(z.object({
      days: z.number().min(7).max(90).default(30),
    }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];

      const trend = await db
        .select({
          date: learningTimeLogs.logDate,
          activeLearners: sql<number>`count(distinct device_id)`,
          totalSeconds: sql<number>`sum(total_seconds)`,
          sessionCount: sql<number>`sum(session_count)`,
        })
        .from(learningTimeLogs)
        .groupBy(learningTimeLogs.logDate)
        .orderBy(desc(learningTimeLogs.logDate))
        .limit(input.days);

      return trend.reverse(); // 從舊到新排序
    }),

  // ─── 每日一題參與率 ──────────────────────────────────

  getDailyQuizParticipation: adminProcedure
    .input(z.object({
      days: z.number().min(7).max(90).default(30),
    }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];

      const participation = await db
        .select({
          date: dailyQuizRecords.quizDate,
          participants: sql<number>`count(distinct device_id)`,
          correctCount: sql<number>`sum(case when is_correct = 1 then 1 else 0 end)`,
          totalAnswered: sql<number>`count(*)`,
        })
        .from(dailyQuizRecords)
        .where(eq(dailyQuizRecords.isAnswered, true))
        .groupBy(dailyQuizRecords.quizDate)
        .orderBy(desc(dailyQuizRecords.quizDate))
        .limit(input.days);

      return participation.reverse().map(p => ({
        ...p,
        accuracy: p.totalAnswered > 0 
          ? Math.round((p.correctCount / p.totalAnswered) * 100) 
          : 0,
      }));
    }),

  // ─── 公告管理 ────────────────────────────────────────

  // 取得所有公告
  getAnnouncements: adminProcedure
    .query(async () => {
      const db = await getDb();
      if (!db) return [];

      return db
        .select()
        .from(announcements)
        .orderBy(desc(announcements.isPinned), desc(announcements.createdAt))
        .limit(50);
    }),

  // 建立公告
  createAnnouncement: adminProcedure
    .input(z.object({
      title: z.string().min(1).max(200),
      content: z.string().min(1),
      type: z.enum(["info", "warning", "success", "urgent"]).default("info"),
      isPinned: z.boolean().default(false),
      targetRole: z.enum(["all", "user", "admin"]).default("all"),
      expiresAt: z.string().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) return { success: false };

      await db.insert(announcements).values({
        title: input.title,
        content: input.content,
        type: input.type,
        isPinned: input.isPinned,
        targetRole: input.targetRole,
        expiresAt: input.expiresAt ? new Date(input.expiresAt) : undefined,
        createdBy: ctx.user.id,
      });

      return { success: true };
    }),

  // 刪除/停用公告
  toggleAnnouncement: adminProcedure
    .input(z.object({
      id: z.number(),
      isActive: z.boolean(),
    }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) return { success: false };

      await db
        .update(announcements)
        .set({ isActive: input.isActive })
        .where(eq(announcements.id, input.id));

      return { success: true };
    }),

  // ─── 取得公告（前台用，公開）─────────────────────────

  getActiveAnnouncements: publicProcedure
    .query(async () => {
      const db = await getDb();
      if (!db) return [];

      const now = new Date();

      return db
        .select()
        .from(announcements)
        .where(and(
          eq(announcements.isActive, true),
          inArray(announcements.targetRole, ["all", "user"]),
          or(
            isNull(announcements.expiresAt),
            gt(announcements.expiresAt, now),
          ),
        ))
        .orderBy(desc(announcements.isPinned), desc(announcements.createdAt))
        .limit(5);
    }),

  // ─── CSV 匯出 ────────────────────────────────────────

  // 匯出學員完整學習記錄為 CSV
  exportLearnersCsv: adminProcedure
    .input(z.object({
      dateFrom: z.string().optional(), // ISO date string, e.g. "2024-01-01"
      dateTo: z.string().optional(),   // ISO date string, e.g. "2024-12-31"
    }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return { error: "DB unavailable", csv: "" };

      // 日期範圍轉換（包含終止日當天 23:59:59）
      const fromTs = input.dateFrom ? new Date(input.dateFrom).getTime() : null;
      const toTs = input.dateTo ? new Date(input.dateTo + "T23:59:59").getTime() : null;

      // 建立日期範圍横幅標籤（加入 CSV 標頭說明用）
      const dateRangeLabel = fromTs || toTs
        ? `（範圍：${input.dateFrom ?? "不限"} ~ ${input.dateTo ?? "不限"}）`
        : "";

      // 從四個表各自取得日期範圍內活躍 device
      const buildDateFilter = (col: any) => {
        const conditions = [];
        if (fromTs) conditions.push(gte(col, new Date(fromTs)));
        if (toTs) conditions.push(lte(col, new Date(toTs)));
        return conditions.length > 0 ? and(...conditions) : undefined;
      };

      const [progressDevices, quizDevices, timeDevices, dailyDevices] = await Promise.all([
        (() => {
          const q = db.select({ deviceId: chapterProgress.deviceId }).from(chapterProgress);
          const f = buildDateFilter(chapterProgress.updatedAt);
          return (f ? q.where(f) : q).groupBy(chapterProgress.deviceId);
        })(),
        (() => {
          const q = db.select({ deviceId: quizAttempts.deviceId }).from(quizAttempts);
          const f = buildDateFilter(quizAttempts.createdAt);
          return (f ? q.where(f) : q).groupBy(quizAttempts.deviceId);
        })(),
        (() => {
          const q = db.select({ deviceId: learningTimeLogs.deviceId }).from(learningTimeLogs);
          const f = buildDateFilter(learningTimeLogs.createdAt);
          return (f ? q.where(f) : q).groupBy(learningTimeLogs.deviceId);
        })(),
        (() => {
          const q = db.select({ deviceId: dailyQuizRecords.deviceId }).from(dailyQuizRecords);
          const f = buildDateFilter(dailyQuizRecords.createdAt);
          return (f ? q.where(f) : q).groupBy(dailyQuizRecords.deviceId);
        })(),
      ]);

      const allDeviceIds = Array.from(new Set([
        ...progressDevices.map(d => d.deviceId ?? ""),
        ...quizDevices.map(d => d.deviceId ?? ""),
        ...timeDevices.map(d => d.deviceId ?? ""),
        ...dailyDevices.map(d => d.deviceId ?? ""),
      ].filter(Boolean)));

      if (allDeviceIds.length === 0) return { error: null, csv: `無資料${dateRangeLabel}` };

      // 各表統計（同樣加日期範圍篩選）
      const progressDateFilter = buildDateFilter(chapterProgress.updatedAt);
      const quizDateFilter = buildDateFilter(quizAttempts.createdAt);
      const timeDateFilter = buildDateFilter(learningTimeLogs.createdAt);
      const dailyDateFilter = buildDateFilter(dailyQuizRecords.createdAt);

      const [progressStats, quizStats, timeStats, dailyStats] = await Promise.all([
        (progressDateFilter
          ? db.select({
              deviceId: chapterProgress.deviceId,
              chaptersCompleted: sql<number>`sum(case when quiz_passed = 1 then 1 else 0 end)`,
              chaptersRead: sql<number>`sum(case when is_read = 1 then 1 else 0 end)`,
              lastActivity: sql<Date>`max(updated_at)`,
            }).from(chapterProgress).where(progressDateFilter)
          : db.select({
              deviceId: chapterProgress.deviceId,
              chaptersCompleted: sql<number>`sum(case when quiz_passed = 1 then 1 else 0 end)`,
              chaptersRead: sql<number>`sum(case when is_read = 1 then 1 else 0 end)`,
              lastActivity: sql<Date>`max(updated_at)`,
            }).from(chapterProgress)
        ).groupBy(chapterProgress.deviceId),

        (quizDateFilter
          ? db.select({
              deviceId: quizAttempts.deviceId,
              totalAttempts: sql<number>`count(*)`,
              avgScore: sql<number>`avg(score)`,
              passedCount: sql<number>`sum(case when passed = 1 then 1 else 0 end)`,
            }).from(quizAttempts).where(quizDateFilter)
          : db.select({
              deviceId: quizAttempts.deviceId,
              totalAttempts: sql<number>`count(*)`,
              avgScore: sql<number>`avg(score)`,
              passedCount: sql<number>`sum(case when passed = 1 then 1 else 0 end)`,
            }).from(quizAttempts)
        ).groupBy(quizAttempts.deviceId),

        (timeDateFilter
          ? db.select({
              deviceId: learningTimeLogs.deviceId,
              totalSeconds: sql<number>`sum(total_seconds)`,
            }).from(learningTimeLogs).where(timeDateFilter)
          : db.select({
              deviceId: learningTimeLogs.deviceId,
              totalSeconds: sql<number>`sum(total_seconds)`,
            }).from(learningTimeLogs)
        ).groupBy(learningTimeLogs.deviceId),

        (dailyDateFilter
          ? db.select({
              deviceId: dailyQuizRecords.deviceId,
              totalAnswered: sql<number>`count(*)`,
              correctCount: sql<number>`sum(case when is_correct = 1 then 1 else 0 end)`,
            }).from(dailyQuizRecords).where(and(eq(dailyQuizRecords.isAnswered, true), dailyDateFilter))
          : db.select({
              deviceId: dailyQuizRecords.deviceId,
              totalAnswered: sql<number>`count(*)`,
              correctCount: sql<number>`sum(case when is_correct = 1 then 1 else 0 end)`,
            }).from(dailyQuizRecords).where(eq(dailyQuizRecords.isAnswered, true))
        ).groupBy(dailyQuizRecords.deviceId),
      ]);

      const progressMap = new Map(progressStats.map((p: typeof progressStats[0]) => [p.deviceId ?? "", p]));
      const quizMap = new Map(quizStats.map((q: typeof quizStats[0]) => [q.deviceId ?? "", q]));
      const timeMap = new Map(timeStats.map((t: typeof timeStats[0]) => [t.deviceId ?? "", t]));
      const dailyMap = new Map(dailyStats.map((d: typeof dailyStats[0]) => [d.deviceId ?? "", d]));

      // 建立 CSV
      const headers = [
        "裝置 ID",
        "綜合評分",
        "章節完成數",
        "章節閱讀數",
        "進度%",
        "測驗平均分",
        "測驗通過數",
        "測驗嘗試次數",
        "學習總時間(小時)",
        "每日一題已作答",
        "每日一題正確率%",
        "最後活躍時間",
      ];

      const rows = allDeviceIds.map(deviceId => {
        const p = progressMap.get(deviceId);
        const q = quizMap.get(deviceId);
        const t = timeMap.get(deviceId);
        const d = dailyMap.get(deviceId);

        const chaptersCompleted = p?.chaptersCompleted ?? 0;
        const avgScore = q?.avgScore ?? 0;
        const totalSeconds = t?.totalSeconds ?? 0;
        const dailyCorrect = d?.correctCount ?? 0;
        const dailyTotal = d?.totalAnswered ?? 0;

        const compositeScore = computeCompositeScore({
          chaptersCompleted,
          avgQuizScore: avgScore,
          totalLearningSeconds: totalSeconds,
          dailyQuizCorrect: dailyCorrect,
          dailyQuizAnswered: dailyTotal,
        });

        const lastActivity = p?.lastActivity
          ? new Date(p.lastActivity).toLocaleDateString("zh-TW")
          : "-";

        return [
          deviceId,
          compositeScore,
          chaptersCompleted,
          p?.chaptersRead ?? 0,
          Math.round((chaptersCompleted / 14) * 100),
          Math.round(avgScore),
          q?.passedCount ?? 0,
          q?.totalAttempts ?? 0,
          Math.round(totalSeconds / 360) / 10,
          dailyTotal,
          dailyTotal > 0 ? Math.round((dailyCorrect / dailyTotal) * 100) : 0,
          lastActivity,
        ];
      });

      // 按綜合評分排序
      rows.sort((a, b) => (b[1] as number) - (a[1] as number));

      const csvLines = [
        headers.join(","),
        ...rows.map(row => row.map(v => `"${v}"`).join(",")),
      ];

      return { error: null, csv: csvLines.join("\n") };
    }),
});
