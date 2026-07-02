import {
  int,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  varchar,
  boolean,
  float,
  json,
  index,
  uniqueIndex,
} from "drizzle-orm/mysql-core";

// ─────────────────────────────────────────────
// 1. 用戶表（核心）
// ─────────────────────────────────────────────
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  // 學員附加資訊
  displayName: varchar("displayName", { length: 100 }),
  department: varchar("department", { length: 100 }),  // 職位/部門
  avatarUrl: text("avatarUrl"),
  isActive: boolean("isActive").default(true).notNull(),
  // 學習統計快取（避免每次計算）
  totalXp: int("totalXp").default(0).notNull(),
  currentLevel: int("currentLevel").default(1).notNull(),
  currentStreak: int("currentStreak").default(0).notNull(),
  longestStreak: int("longestStreak").default(0).notNull(),
  lastActiveDate: timestamp("lastActiveDate"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// ─────────────────────────────────────────────
// 2. 章節學習進度表
// ─────────────────────────────────────────────
export const chapterProgress = mysqlTable(
  "chapter_progress",
  {
    id: int("id").autoincrement().primaryKey(),
    userId: int("userId"),
    deviceId: varchar("deviceId", { length: 128 }),
    chapterId: varchar("chapterId", { length: 20 }).notNull(), // e.g. "ch1", "ch2"
    chapterTitle: varchar("chapterTitle", { length: 200 }),
    // 閱讀狀態
    isRead: boolean("isRead").default(false).notNull(),
    readAt: timestamp("readAt"),
    readTimeSeconds: int("readTimeSeconds").default(0).notNull(), // 累計閱讀秒數
    // 測驗狀態
    quizPassed: boolean("quizPassed").default(false).notNull(),
    quizScore: int("quizScore"),           // 最高分（0-100）
    quizAttempts: int("quizAttempts").default(0).notNull(), // 嘗試次數
    lastQuizAt: timestamp("lastQuizAt"),
    // 解鎖狀態
    isUnlocked: boolean("isUnlocked").default(false).notNull(),
    unlockedAt: timestamp("unlockedAt"),
    // 完成狀態
    isCompleted: boolean("isCompleted").default(false).notNull(),
    completedAt: timestamp("completedAt"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  (table) => ({
    userChapterIdx: uniqueIndex("user_chapter_idx").on(table.deviceId, table.chapterId),
    userIdx: index("user_idx").on(table.deviceId),
  })
);

export type ChapterProgress = typeof chapterProgress.$inferSelect;
export type InsertChapterProgress = typeof chapterProgress.$inferInsert;

// ─────────────────────────────────────────────
// 3. 測驗成績記錄表（每次作答詳細記錄）
// ─────────────────────────────────────────────
export const quizAttempts = mysqlTable(
  "quiz_attempts",
  {
    id: int("id").autoincrement().primaryKey(),
    userId: int("userId"),
    deviceId: varchar("deviceId", { length: 128 }),
    chapterId: varchar("chapterId", { length: 20 }).notNull(),
    attemptNumber: int("attemptNumber").notNull(), // 第幾次嘗試
    score: int("score").notNull(),           // 分數（0-100）
    totalQuestions: int("totalQuestions").notNull(),
    correctAnswers: int("correctAnswers").notNull(),
    passed: boolean("passed").notNull(),
    timeTakenSeconds: int("timeTakenSeconds"),
    // 每題詳細作答（JSON 存儲）
    answers: json("answers"), // [{ questionId, selectedAnswer, correctAnswer, isCorrect }]
    xpEarned: int("xpEarned").default(0).notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  (table) => ({
    userIdx: index("qa_user_idx").on(table.deviceId),
    chapterIdx: index("qa_chapter_idx").on(table.chapterId),
  })
);

export type QuizAttempt = typeof quizAttempts.$inferSelect;
export type InsertQuizAttempt = typeof quizAttempts.$inferInsert;

// ─────────────────────────────────────────────
// 4. 錯題收藏表
// ─────────────────────────────────────────────
export const wrongNotes = mysqlTable(
  "wrong_notes",
  {
    id: int("id").autoincrement().primaryKey(),
    userId: int("userId"),
    deviceId: varchar("deviceId", { length: 128 }),
    chapterId: varchar("chapterId", { length: 20 }).notNull(),
    questionId: varchar("questionId", { length: 50 }).notNull(),
    questionText: text("questionText").notNull(),
    options: json("options").notNull(),       // string[]
    correctAnswer: int("correctAnswer").notNull(),
    explanation: text("explanation"),
    userAnswer: int("userAnswer"),
    isMastered: boolean("isMastered").default(false).notNull(), // 已掌握可移除
    masteredAt: timestamp("masteredAt"),
    reviewCount: int("reviewCount").default(0).notNull(),
    lastReviewedAt: timestamp("lastReviewedAt"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  (table) => ({
    userIdx: index("wn_user_idx").on(table.deviceId),
    uniqueQuestion: uniqueIndex("wn_unique_q").on(table.deviceId, table.questionId),
  })
);

export type WrongNote = typeof wrongNotes.$inferSelect;
export type InsertWrongNote = typeof wrongNotes.$inferInsert;

// ─────────────────────────────────────────────
// 5. XP 積分交易記錄表
// ─────────────────────────────────────────────
export const xpTransactions = mysqlTable(
  "xp_transactions",
  {
    id: int("id").autoincrement().primaryKey(),
    userId: int("userId"),
    deviceId: varchar("deviceId", { length: 128 }),
    amount: int("amount").notNull(),          // 正數=獲得，負數=消耗
    reason: mysqlEnum("reason", [
      "chapter_read",       // 閱讀章節 +50
      "quiz_pass",          // 通過測驗 +200
      "quiz_perfect",       // 滿分通過 +100 bonus
      "daily_quiz",         // 每日一題答對 +50
      "daily_login",        // 每日登入 +10
      "streak_7",           // 連續 7 天 +100
      "streak_30",          // 連續 30 天 +500
      "streak_100",         // 連續 100 天 +2000
      "all_chapters",       // 完成全部章節 +1000
      "first_login",        // 首次登入 +100
      "admin_adjust",       // 管理員手動調整
    ]).notNull(),
    description: text("description"),
    referenceId: varchar("referenceId", { length: 50 }), // 關聯的 chapterId 或 quizAttemptId
    balanceAfter: int("balanceAfter").notNull(), // 交易後總 XP
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  (table) => ({
    userIdx: index("xp_user_idx").on(table.deviceId),
    createdAtIdx: index("xp_created_idx").on(table.createdAt),
  })
);

export type XpTransaction = typeof xpTransactions.$inferSelect;
export type InsertXpTransaction = typeof xpTransactions.$inferInsert;

// ─────────────────────────────────────────────
// 6. 徽章定義表（系統預設徽章清單）
// ─────────────────────────────────────────────
export const badgeDefinitions = mysqlTable("badge_definitions", {
  id: int("id").autoincrement().primaryKey(),
  badgeKey: varchar("badgeKey", { length: 50 }).notNull().unique(), // e.g. "first_chapter"
  name: varchar("name", { length: 100 }).notNull(),
  description: text("description"),
  icon: varchar("icon", { length: 50 }),      // lucide icon name
  color: varchar("color", { length: 20 }),    // tailwind color class
  xpReward: int("xpReward").default(0).notNull(),
  // 觸發條件
  triggerType: mysqlEnum("triggerType", [
    "chapter_count",    // 完成 N 章
    "quiz_score",       // 測驗達到分數
    "streak_days",      // 連續學習天數
    "xp_total",         // 累積 XP
    "daily_quiz_count", // 每日一題答對數
    "manual",           // 管理員手動頒發
  ]).notNull(),
  triggerValue: int("triggerValue"),          // 觸發條件的數值
  isActive: boolean("isActive").default(true).notNull(),
  sortOrder: int("sortOrder").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type BadgeDefinition = typeof badgeDefinitions.$inferSelect;
export type InsertBadgeDefinition = typeof badgeDefinitions.$inferInsert;

// ─────────────────────────────────────────────
// 7. 用戶已獲得徽章表
// ─────────────────────────────────────────────
export const userBadges = mysqlTable(
  "user_badges",
  {
    id: int("id").autoincrement().primaryKey(),
    userId: int("userId"),
    deviceId: varchar("deviceId", { length: 128 }),
    badgeKey: varchar("badgeKey", { length: 50 }).notNull(),
    earnedAt: timestamp("earnedAt").defaultNow().notNull(),
    xpAwarded: int("xpAwarded").default(0).notNull(),
    isNew: boolean("isNew").default(true).notNull(), // 未讀提示
  },
  (table) => ({
    userIdx: index("ub_user_idx").on(table.deviceId),
    uniqueBadge: uniqueIndex("ub_unique").on(table.deviceId, table.badgeKey),
  })
);

export type UserBadge = typeof userBadges.$inferSelect;
export type InsertUserBadge = typeof userBadges.$inferInsert;

// ─────────────────────────────────────────────
// 8. 每日一題作答記錄表
// ─────────────────────────────────────────────
export const dailyQuizRecords = mysqlTable(
  "daily_quiz_records",
  {
    id: int("id").autoincrement().primaryKey(),
    userId: int("userId"),
    deviceId: varchar("deviceId", { length: 128 }),
    quizDate: varchar("quizDate", { length: 10 }).notNull(), // "2026-07-01"（台灣時區）
    questionId: varchar("questionId", { length: 50 }).notNull(),
    questionText: text("questionText"),
    selectedAnswer: int("selectedAnswer"),
    correctAnswer: int("correctAnswer").notNull(),
    isCorrect: boolean("isCorrect"),
    isAnswered: boolean("isAnswered").default(false).notNull(),
    answeredAt: timestamp("answeredAt"),
    xpEarned: int("xpEarned").default(0).notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  (table) => ({
    userDateIdx: uniqueIndex("dqr_user_date").on(table.deviceId, table.quizDate),
    userIdx: index("dqr_user_idx").on(table.deviceId),
    dateIdx: index("dqr_date_idx").on(table.quizDate),
  })
);

export type DailyQuizRecord = typeof dailyQuizRecords.$inferSelect;
export type InsertDailyQuizRecord = typeof dailyQuizRecords.$inferInsert;

// ─────────────────────────────────────────────
// 9. 學習時間追蹤表（每日彙總）
// ─────────────────────────────────────────────
export const learningTimeLogs = mysqlTable(
  "learning_time_logs",
  {
    id: int("id").autoincrement().primaryKey(),
    userId: int("userId"),
    deviceId: varchar("deviceId", { length: 128 }),
    logDate: varchar("logDate", { length: 10 }).notNull(), // "2026-07-01"
    chapterId: varchar("chapterId", { length: 20 }),
    totalSeconds: int("totalSeconds").default(0).notNull(),
    sessionCount: int("sessionCount").default(0).notNull(), // 幾次進入
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  (table) => ({
    userDateIdx: uniqueIndex("ltl_user_date_chapter").on(
      table.deviceId,
      table.logDate,
      table.chapterId
    ),
    userIdx: index("ltl_user_idx").on(table.deviceId),
  })
);

export type LearningTimeLog = typeof learningTimeLogs.$inferSelect;
export type InsertLearningTimeLog = typeof learningTimeLogs.$inferInsert;

// ─────────────────────────────────────────────
// 10. 公告表（管理員發布）
// ─────────────────────────────────────────────
export const announcements = mysqlTable("announcements", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 200 }).notNull(),
  content: text("content").notNull(),
  type: mysqlEnum("type", ["info", "warning", "success", "urgent"]).default("info").notNull(),
  isPinned: boolean("isPinned").default(false).notNull(),
  isActive: boolean("isActive").default(true).notNull(),
  targetRole: mysqlEnum("targetRole", ["all", "user", "admin"]).default("all").notNull(),
  expiresAt: timestamp("expiresAt"),
  createdBy: int("createdBy").notNull(), // userId
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Announcement = typeof announcements.$inferSelect;
export type InsertAnnouncement = typeof announcements.$inferInsert;

// ─────────────────────────────────────────────
// 11. 排行榜快照表（定期計算，避免即時計算過慢）
// ─────────────────────────────────────────────
export const leaderboardSnapshots = mysqlTable(
  "leaderboard_snapshots",
  {
    id: int("id").autoincrement().primaryKey(),
    userId: int("userId"),
    deviceId: varchar("deviceId", { length: 128 }),
    displayName: varchar("displayName", { length: 100 }),
    snapshotDate: varchar("snapshotDate", { length: 10 }).notNull(), // "2026-07-01"
    totalXp: int("totalXp").default(0).notNull(),
    chaptersCompleted: int("chaptersCompleted").default(0).notNull(),
    averageQuizScore: float("averageQuizScore").default(0).notNull(),
    totalLearningSeconds: int("totalLearningSeconds").default(0).notNull(),
    currentStreak: int("currentStreak").default(0).notNull(),
    compositeScore: float("compositeScore").default(0).notNull(), // 綜合評分
    rank: int("rank"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  (table) => ({
    userDateIdx: uniqueIndex("ls_user_date").on(table.deviceId, table.snapshotDate),
    dateIdx: index("ls_date_idx").on(table.snapshotDate),
  })
);

export type LeaderboardSnapshot = typeof leaderboardSnapshots.$inferSelect;
export type InsertLeaderboardSnapshot = typeof leaderboardSnapshots.$inferInsert;
