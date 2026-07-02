# 好創學院 TODO

## 已完成功能

- [x] 基礎 LMS 架構（章節、測驗、排行榜、每日一題）
- [x] 前端 UI（Sidebar、HeroSection、ChapterSection、QuizModule、DailyQuiz、MilestoneTracker、CaseLibrary、LearningTimeTracker、Leaderboard）
- [x] 後端 learning router（章節進度、測驗記錄、錯題本、每日一題、學習時間、排行榜）
- [x] 後端 admin router（學員總覽、章節統計、難題分析、每日一題參與率、公告管理）
- [x] 資料庫 schema（chapterProgress, quizAttempts, wrongNotes, dailyQuizRecords, learningTimeLogs, leaderboardSnapshots, announcements）
- [x] useDeviceId hook（localStorage 匿名識別，無需登入）
- [x] QuizModule 前後端整合（tRPC 同步到 DB）
- [x] DailyQuiz 前後端整合（tRPC 同步到 DB）
- [x] YouTube 影片嵌入架構（ChapterContent.videoId + ChapterSection 渲染）
- [x] 管理員後台頁面（/admin 路由，密碼保護）
  - [x] 學員總覽（排名、進度、評分、可展開詳情）
  - [x] 章節完成率統計
  - [x] 難題分析（最常錯的題目）
  - [x] 公告管理（新增、停用/啟用）
- [x] 前台公告顯示（getActiveAnnouncements）
- [x] 伺服器正常運行（dotenv 已安裝）

## 待辦事項

- [ ] 在 data.ts 各章節加入實際 YouTube videoId（需子權提供影片連結）
- [x] 設定 ADMIN_PASSWORD 環境變數（值僅存於環境變數，勿寫入文件）
- [x] LearningTimeTracker 前後端整合（雙軌並行：localStorage + tRPC 同步）
- [x] Leaderboard 改用後端真實資料（雙軌：有後端資料時自動切換即時資料）
- [x] 強化 LearningTimeTracker 後端同步：加入 visibilitychange flush，避免切換標籤頁時遷失記錄
- [x] 修正 getLeaderboard 聚合邏輯：合併三表所有活躍 device，避免遷漏學員
- [ ] MilestoneTracker 前後端整合（待子權確認需求）

## 新需求（2026-07-02）

- [x] MilestoneTracker 後端整合：DB schema + API + 前端雙軌同步（跨裝置不遷失）
- [x] 管理後台 CSV 匯出：所有學員進度 + 測驗成績下載為 CSV
