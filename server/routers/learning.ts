import { z } from "zod";
import { eq, and, desc, sql } from "drizzle-orm";
import { router, publicProcedure } from "../_core/trpc";
import { getDb } from "../db";
import {
  chapterProgress,
  quizAttempts,
  wrongNotes,
  xpTransactions,
  userBadges,
  badgeDefinitions,
  dailyQuizRecords,
  learningTimeLogs,
  users,
} from "../../drizzle/schema";

// XP 規則
const XP_RULES = {
  chapter_read: 50,
  quiz_pass: 200,
  quiz_perfect: 100,
  daily_quiz: 50,
  daily_login: 10,
  streak_7: 100,
  streak_30: 500,
  streak_100: 2000,
  all_chapters: 1000,
  first_login: 100,
};

// 台灣時區日期字串
function getTaiwanDateStr(): string {
  return new Date().toLocaleDateString("zh-TW", {
    timeZone: "Asia/Taipei",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).replace(/\//g, "-");
}

export const learningRouter = router({
  // ─── 章節進度 ───────────────────────────────────────
  
  // 取得用戶所有章節進度
  getChapterProgress: publicProcedure
    .input(z.object({ deviceId: z.string() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];
      
      const progress = await db
        .select()
        .from(chapterProgress)
        .where(eq(chapterProgress.deviceId, input.deviceId))
        .orderBy(chapterProgress.chapterId);
      
      return progress;
    }),

  // 標記章節已讀
  markChapterRead: publicProcedure
    .input(z.object({
      deviceId: z.string(),
      chapterId: z.string(),
      chapterTitle: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) return { success: false };

      const existing = await db
        .select()
        .from(chapterProgress)
        .where(and(
          eq(chapterProgress.deviceId, input.deviceId),
          eq(chapterProgress.chapterId, input.chapterId)
        ))
        .limit(1);

      if (existing.length > 0 && existing[0].isRead) {
        return { success: true, alreadyRead: true };
      }

      await db.insert(chapterProgress).values({
        deviceId: input.deviceId,
        chapterId: input.chapterId,
        chapterTitle: input.chapterTitle,
        isRead: true,
        readAt: new Date(),
        isUnlocked: true,
        unlockedAt: new Date(),
      }).onDuplicateKeyUpdate({
        set: {
          isRead: true,
          readAt: new Date(),
        }
      });

      return { success: true };
    }),

  // 更新閱讀時間
  updateReadTime: publicProcedure
    .input(z.object({
      deviceId: z.string(),
      chapterId: z.string(),
      seconds: z.number().min(0).max(3600),
    }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) return { success: false };

      const today = getTaiwanDateStr();

      await db.insert(learningTimeLogs).values({
        deviceId: input.deviceId,
        chapterId: input.chapterId,
        logDate: today,
        totalSeconds: input.seconds,
        sessionCount: 1,
      }).onDuplicateKeyUpdate({
        set: {
          totalSeconds: sql`total_seconds + ${input.seconds}`,
          sessionCount: sql`session_count + 1`,
        }
      });

      return { success: true };
    }),

  // ─── 測驗 ───────────────────────────────────────────

  // 提交測驗成績
  submitQuiz: publicProcedure
    .input(z.object({
      deviceId: z.string(),
      chapterId: z.string(),
      score: z.number().min(0).max(100),
      totalQuestions: z.number(),
      correctAnswers: z.number(),
      passed: z.boolean(),
      timeTakenSeconds: z.number().optional(),
      answers: z.array(z.object({
        questionId: z.string(),
        selectedAnswer: z.number(),
        correctAnswer: z.number(),
        isCorrect: z.boolean(),
      })).optional(),
    }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) return { success: false, xpEarned: 0 };

      // 取得嘗試次數
      const prevAttempts = await db
        .select({ count: sql<number>`count(*)` })
        .from(quizAttempts)
        .where(and(
          eq(quizAttempts.deviceId, input.deviceId),
          eq(quizAttempts.chapterId, input.chapterId)
        ));
      
      const attemptNumber = (prevAttempts[0]?.count ?? 0) + 1;
      
      // 計算 XP
      let xpEarned = 0;
      if (input.passed) {
        // 首次通過才給 XP
        const prevPassed = await db
          .select()
          .from(chapterProgress)
          .where(and(
            eq(chapterProgress.deviceId, input.deviceId),
            eq(chapterProgress.chapterId, input.chapterId)
          ))
          .limit(1);
        
        if (!prevPassed[0]?.quizPassed) {
          xpEarned += XP_RULES.quiz_pass;
          if (input.score === 100) xpEarned += XP_RULES.quiz_perfect;
        }
      }

      // 記錄本次嘗試
      await db.insert(quizAttempts).values({
        deviceId: input.deviceId,
        chapterId: input.chapterId,
        attemptNumber,
        score: input.score,
        totalQuestions: input.totalQuestions,
        correctAnswers: input.correctAnswers,
        passed: input.passed,
        timeTakenSeconds: input.timeTakenSeconds,
        answers: input.answers,
        xpEarned,
      });

      // 更新章節進度
      if (input.passed) {
        await db.insert(chapterProgress).values({
          deviceId: input.deviceId,
          chapterId: input.chapterId,
          isRead: true,
          quizPassed: true,
          quizScore: input.score,
          quizAttempts: attemptNumber,
          lastQuizAt: new Date(),
          isUnlocked: true,
          isCompleted: true,
          completedAt: new Date(),
        }).onDuplicateKeyUpdate({
          set: {
            quizPassed: true,
            quizScore: sql`GREATEST(quiz_score, ${input.score})`,
            quizAttempts: sql`quiz_attempts + 1`,
            lastQuizAt: new Date(),
            isCompleted: true,
            completedAt: new Date(),
          }
        });
      } else {
        await db.insert(chapterProgress).values({
          deviceId: input.deviceId,
          chapterId: input.chapterId,
          isRead: true,
          quizAttempts: 1,
          lastQuizAt: new Date(),
          isUnlocked: true,
        }).onDuplicateKeyUpdate({
          set: {
            quizAttempts: sql`quiz_attempts + 1`,
            lastQuizAt: new Date(),
          }
        });
      }

      return { success: true, xpEarned, attemptNumber };
    }),

  // 取得測驗歷史
  getQuizHistory: publicProcedure
    .input(z.object({
      deviceId: z.string(),
      chapterId: z.string().optional(),
    }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];

      const conditions = [eq(quizAttempts.deviceId, input.deviceId)];
      if (input.chapterId) {
        conditions.push(eq(quizAttempts.chapterId, input.chapterId));
      }

      return db
        .select()
        .from(quizAttempts)
        .where(and(...conditions))
        .orderBy(desc(quizAttempts.createdAt))
        .limit(50);
    }),

  // ─── 錯題本 ─────────────────────────────────────────

  // 新增錯題
  addWrongNote: publicProcedure
    .input(z.object({
      deviceId: z.string(),
      chapterId: z.string(),
      questionId: z.string(),
      questionText: z.string(),
      options: z.array(z.string()),
      correctAnswer: z.number(),
      explanation: z.string().optional(),
      userAnswer: z.number().optional(),
    }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) return { success: false };

      await db.insert(wrongNotes).values({
        deviceId: input.deviceId,
        chapterId: input.chapterId,
        questionId: input.questionId,
        questionText: input.questionText,
        options: input.options,
        correctAnswer: input.correctAnswer,
        explanation: input.explanation,
        userAnswer: input.userAnswer,
      }).onDuplicateKeyUpdate({
        set: {
          reviewCount: sql`review_count + 1`,
          lastReviewedAt: new Date(),
          isMastered: false,
        }
      });

      return { success: true };
    }),

  // 取得錯題本
  getWrongNotes: publicProcedure
    .input(z.object({ deviceId: z.string() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];

      return db
        .select()
        .from(wrongNotes)
        .where(and(
          eq(wrongNotes.deviceId, input.deviceId),
          eq(wrongNotes.isMastered, false)
        ))
        .orderBy(desc(wrongNotes.createdAt));
    }),

  // 標記錯題已掌握
  masterWrongNote: publicProcedure
    .input(z.object({
      deviceId: z.string(),
      questionId: z.string(),
    }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) return { success: false };

      await db
        .update(wrongNotes)
        .set({ isMastered: true, masteredAt: new Date() })
        .where(and(
          eq(wrongNotes.deviceId, input.deviceId),
          eq(wrongNotes.questionId, input.questionId)
        ));

      return { success: true };
    }),

  // ─── 每日一題 ────────────────────────────────────────

  // 記錄每日一題作答
  submitDailyQuiz: publicProcedure
    .input(z.object({
      deviceId: z.string(),
      quizDate: z.string(),
      questionId: z.string(),
      questionText: z.string().optional(),
      selectedAnswer: z.number(),
      correctAnswer: z.number(),
      isCorrect: z.boolean(),
    }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) return { success: false, xpEarned: 0 };

      const xpEarned = input.isCorrect ? XP_RULES.daily_quiz : 0;

      await db.insert(dailyQuizRecords).values({
        deviceId: input.deviceId,
        quizDate: input.quizDate,
        questionId: input.questionId,
        questionText: input.questionText,
        selectedAnswer: input.selectedAnswer,
        correctAnswer: input.correctAnswer,
        isCorrect: input.isCorrect,
        isAnswered: true,
        answeredAt: new Date(),
        xpEarned,
      }).onDuplicateKeyUpdate({
        set: {
          selectedAnswer: input.selectedAnswer,
          isCorrect: input.isCorrect,
          isAnswered: true,
          answeredAt: new Date(),
          xpEarned,
        }
      });

      return { success: true, xpEarned };
    }),

  // 取得每日一題歷史
  getDailyQuizHistory: publicProcedure
    .input(z.object({
      deviceId: z.string(),
      limit: z.number().min(1).max(100).default(50),
    }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];

      return db
        .select()
        .from(dailyQuizRecords)
        .where(eq(dailyQuizRecords.deviceId, input.deviceId))
        .orderBy(desc(dailyQuizRecords.quizDate))
        .limit(input.limit);
    }),

  // ─── 學習統計 ────────────────────────────────────────

  // 取得用戶學習統計摘要
  getLearningStats: publicProcedure
    .input(z.object({ deviceId: z.string() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return null;

      // 章節完成數
      const completedChapters = await db
        .select({ count: sql<number>`count(*)` })
        .from(chapterProgress)
        .where(and(
          eq(chapterProgress.deviceId, input.deviceId),
          eq(chapterProgress.quizPassed, true)
        ));

      // 總學習時間
      const totalTime = await db
        .select({ total: sql<number>`sum(total_seconds)` })
        .from(learningTimeLogs)
        .where(eq(learningTimeLogs.deviceId, input.deviceId));

      // 每日一題統計
      const dailyStats = await db
        .select({
          total: sql<number>`count(*)`,
          correct: sql<number>`sum(case when is_correct = 1 then 1 else 0 end)`,
        })
        .from(dailyQuizRecords)
        .where(and(
          eq(dailyQuizRecords.deviceId, input.deviceId),
          eq(dailyQuizRecords.isAnswered, true)
        ));

      // 測驗平均分
      const quizStats = await db
        .select({
          avgScore: sql<number>`avg(score)`,
          totalAttempts: sql<number>`count(*)`,
        })
        .from(quizAttempts)
        .where(eq(quizAttempts.deviceId, input.deviceId));

      return {
        chaptersCompleted: completedChapters[0]?.count ?? 0,
        totalLearningSeconds: totalTime[0]?.total ?? 0,
        dailyQuizTotal: dailyStats[0]?.total ?? 0,
        dailyQuizCorrect: dailyStats[0]?.correct ?? 0,
        avgQuizScore: Math.round(quizStats[0]?.avgScore ?? 0),
        totalQuizAttempts: quizStats[0]?.totalAttempts ?? 0,
      };
    }),

  // 公開排行榜（前台用，不需要管理員權限）
  getLeaderboard: publicProcedure
    .input(z.object({ limit: z.number().min(1).max(50).default(20) }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];

      // 從三個表各自取得所有活躍 device（避免遗漏只有測驗或時間的學員）
      const [progressDevices, quizDevices, timeDevices] = await Promise.all([
        db.select({ deviceId: chapterProgress.deviceId }).from(chapterProgress).groupBy(chapterProgress.deviceId),
        db.select({ deviceId: quizAttempts.deviceId }).from(quizAttempts).groupBy(quizAttempts.deviceId),
        db.select({ deviceId: learningTimeLogs.deviceId }).from(learningTimeLogs).groupBy(learningTimeLogs.deviceId),
      ]);

      // 合併所有 deviceId
      const allDeviceIds = Array.from(new Set([
        ...progressDevices.map(d => d.deviceId ?? ""),
        ...quizDevices.map(d => d.deviceId ?? ""),
        ...timeDevices.map(d => d.deviceId ?? ""),
      ].filter(Boolean)));

      if (allDeviceIds.length === 0) return [];

      // 章節完成統計
      const progressStats = await db
        .select({
          deviceId: chapterProgress.deviceId,
          chaptersCompleted: sql<number>`sum(case when quiz_passed = 1 then 1 else 0 end)`,
          lastActivity: sql<Date>`max(updated_at)`,
        })
        .from(chapterProgress)
        .groupBy(chapterProgress.deviceId);

      // 測驗統計
      const quizStats = await db
        .select({
          deviceId: quizAttempts.deviceId,
          avgScore: sql<number>`avg(score)`,
          passedCount: sql<number>`sum(case when passed = 1 then 1 else 0 end)`,
        })
        .from(quizAttempts)
        .groupBy(quizAttempts.deviceId);

      // 學習時間
      const timeStats = await db
        .select({
          deviceId: learningTimeLogs.deviceId,
          totalSeconds: sql<number>`sum(total_seconds)`,
        })
        .from(learningTimeLogs)
        .groupBy(learningTimeLogs.deviceId);

      const progressMap = new Map(progressStats.map(p => [p.deviceId ?? "", p]));
      const quizMap = new Map(quizStats.map(q => [q.deviceId ?? "", q]));
      const timeMap = new Map(timeStats.map(t => [t.deviceId ?? "", t]));

      const entries = allDeviceIds.map(deviceId => {
        const progress = progressMap.get(deviceId);
        const quiz = quizMap.get(deviceId);
        const time = timeMap.get(deviceId);
        const chaptersCompleted = progress?.chaptersCompleted ?? 0;
        const avgScore = quiz?.avgScore ?? 0;
        const totalSeconds = time?.totalSeconds ?? 0;

        // 綜合評分（與管理後台一致）
        const compositeScore = Math.round(
          (chaptersCompleted / 14) * 40 +
          (avgScore / 100) * 30 +
          Math.min(totalSeconds / 3600, 10) * 2
        );

        return {
          deviceId,
          chaptersCompleted,
          progressPercent: Math.round((chaptersCompleted / 14) * 100),
          avgQuizScore: Math.round(avgScore),
          quizPassedCount: quiz?.passedCount ?? 0,
          totalLearningSeconds: totalSeconds,
          compositeScore,
          lastActivity: progress?.lastActivity ?? null,
        };
      });

      // 按綜合評分排序
      entries.sort((a, b) => b.compositeScore - a.compositeScore);

      return entries.slice(0, input.limit).map((e, i) => ({ ...e, rank: i + 1 }));
    }),
});
