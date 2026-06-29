# 好創學院 UI/UX 全面審查報告

## 審查標準：台灣頂尖 UI/UX 設計工程師視角

---

## P0 級缺陷（功能性斷裂 — 立即修復）

| # | 缺陷 | 位置 | 影響 |
|---|------|------|------|
| 1 | **章節 9-14 無考核測驗** | QuizModule.tsx | 題庫只定義 ch1-ch8，後 6 章無法考核，排行榜數據不完整 |
| 2 | **排行榜 localStorage key 不匹配** | Leaderboard.tsx vs QuizModule.tsx | 排行榜讀取 `haochuang-quiz-ch1` 格式，但 QuizModule 存 `haochuang-quiz-progress` 單一物件，導致排行榜永遠顯示 0 分 |
| 3 | **Slack 推播假成功** | DailyQuiz.tsx L215-235 | `handleSendToSlack` 無論是否有回調都顯示成功 UI，欺騙用戶 |
| 4 | **「下一章已解鎖」無實際鎖定機制** | QuizModule.tsx | 通過測驗後顯示「下一章已解鎖」但從未有任何章節被鎖定，文案誤導 |
| 5 | **手機端 Sidebar 漢堡選單位置被 LearningTimeTracker sticky 遮擋** | Home.tsx + Sidebar | 手機端左上角漢堡按鈕 z-index 50，但 sticky tracker z-30，滾動後可能互相干擾 |

## P1 級缺陷（體驗嚴重降級 — 本次修復）

| # | 缺陷 | 位置 | 影響 |
|---|------|------|------|
| 6 | **Hero 區塊過高（85vh）浪費首屏空間** | HeroSection.tsx | 電腦端首屏只看到標題和統計數字，無法引導用戶向下探索 |
| 7 | **手機端 Hero 統計卡片文字過小** | HeroSection.tsx | 375px 下 stats grid 3 列擠壓，數字和標籤幾乎不可讀 |
| 8 | **LearningTimeTracker sticky 在手機端佔據過多空間** | LearningTimeTracker.tsx | 手機端 sticky 元素佔據 ~60px 高度，壓縮閱讀空間 |
| 9 | **每日一題日期邏輯使用 UTC** | DailyQuiz.tsx L121-123 | `toISOString().split('T')[0]` 使用 UTC 時間，台灣用戶在 00:00-08:00 之間會看到「昨天」的題目 |
| 10 | **章節滾動定位偏移** | Home.tsx | `scrollIntoView({ block: 'start' })` 未考慮 sticky tracker 高度，章節標題被遮擋 |
| 11 | **Sidebar 底部連結被截斷** | Sidebar.tsx | `h-[calc(100vh-200px)]` 計算不精確，底部 ThemeToggle 和 Notion 連結在小螢幕可能被截斷 |
| 12 | **手機端無法存取 Sidebar 底部功能** | Sidebar.tsx | 暗色模式切換、Notion 連結在手機端可能超出可視範圍 |
| 13 | **IntersectionObserver onVisible 頻繁觸發** | ChapterSection.tsx | 每次滾動都重新觸發 onVisible，handleScroll 中 setUserSelectedChapter(null) 導致用戶點擊後滾動一點就失效 |

## P2 級缺陷（體驗粗糙 — 建議修復）

| # | 缺陷 | 位置 | 影響 |
|---|------|------|------|
| 14 | **glass-card hover 效果在觸控裝置無意義** | index.css | 手機端 hover 狀態會「黏住」，造成視覺混亂 |
| 15 | **FlipCard 手機端高度固定 h-48** | ChapterSection.tsx | 內容過長時文字溢出 |
| 16 | **表格在手機端水平滾動無提示** | ChapterSection.tsx TableBlock | 用戶不知道可以左右滑動 |
| 17 | **Prompt 展開/收合動畫缺失** | ChapterSection.tsx PromptBlock | max-h 切換無過渡動畫，突然跳變 |
| 18 | **排行榜「新增成員」按鈕在手機端位置不佳** | Leaderboard.tsx | 可能與其他元素重疊 |
| 19 | **每日一題篩選標籤在手機端可能換行** | DailyQuiz.tsx | 4 個標籤在 375px 下可能擠壓 |
| 20 | **缺少 loading skeleton** | 全局 | 組件首次渲染時無骨架屏，直接跳出內容 |
| 21 | **缺少 scroll-to-top 按鈕** | Home.tsx | 長頁面無法快速回到頂部 |
| 22 | **Footer 過於簡陋** | Home.tsx | 只有一行文字和一個連結，缺乏專業感 |

## P3 級缺陷（打磨細節）

| # | 缺陷 | 位置 | 影響 |
|---|------|------|------|
| 23 | **缺少 prefers-reduced-motion 支援** | 全局動畫 | 無障礙性不足 |
| 24 | **Sidebar 章節列表無完成狀態指示** | Sidebar.tsx | 無法一眼看出哪些章節已完成 |
| 25 | **缺少鍵盤快捷鍵** | 全局 | 無法用 ↑↓ 切換章節 |
| 26 | **AI 學習助手無實際功能** | AIAssistant.tsx | 只是 UI 殼，無後端支撐 |

---

## 本次修復範圍（P0 + P1 核心項目）

1. 修復排行榜 localStorage key 匹配問題
2. 修復 Slack 推播假成功問題
3. 移除「下一章已解鎖」誤導文案
4. 修復日期邏輯為台灣時區
5. 降低 Hero 高度，優化首屏效率
6. 修復手機端統計卡片可讀性
7. 優化 LearningTimeTracker 手機端佔用空間
8. 修復章節滾動定位偏移（考慮 sticky 高度）
9. 修復 Sidebar 底部截斷問題
10. 優化 IntersectionObserver 邏輯避免頻繁觸發
11. 新增 scroll-to-top 按鈕
12. 手機端 hover 狀態處理
