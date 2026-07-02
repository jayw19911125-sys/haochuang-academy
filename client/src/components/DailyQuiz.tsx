import { useState, useEffect, useMemo } from "react";
import { Send, MessageCircle, Calendar, CheckCircle2, XCircle, RotateCcw, Sparkles, Clock, ChevronDown, ChevronUp, History, Eye, EyeOff, Filter } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useDeviceId } from "@/hooks/useDeviceId";

interface DailyQuestion {
  id: string;
  chapter: string;
  chapterTitle: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  difficulty: "基礎" | "進階" | "實戰";
}

// 完整題庫 50 題（涵蓋所有 14 章，難度遞進：基礎 25 + 進階 15 + 實戰 10）
const DAILY_QUIZ_POOL: DailyQuestion[] = [
  // 第 1 章：好創營運底層邏輯（5 題，全基礎）
  { id: "dq1", chapter: "ch1", chapterTitle: "好創營運底層邏輯", question: "好創的收款鐵則中，社群類專案的正確收款方式是？", options: ["50% 訂金", "執行前收當月全款", "月底結算", "完成後收款"], correctIndex: 1, explanation: "社群類專案：執行前收當月全款。網站專案才是 50% 訂金制。先收錢才開工是好創的底線。", difficulty: "基礎" },
  { id: "dq2", chapter: "ch1", chapterTitle: "好創營運底層邏輯", question: "好創的產能防禦機制中，招募中職缺應如何計入產能？", options: ["預估到職時間提前計入", "不計入，直到實際到職", "計入 50% 產能", "視情況彈性處理"], correctIndex: 1, explanation: "招募中職缺在實際到職前不得計入產能。這是防止過度承諾的底線。", difficulty: "基礎" },
  { id: "dq3", chapter: "ch1", chapterTitle: "好創營運底層邏輯", question: "好創的工具棧鎖定中，唯一的數據資料庫是？", options: ["Notion", "Google Sheets", "Monday.com", "Airtable"], correctIndex: 2, explanation: "Monday.com = 唯一數據資料庫（CRM/專案/SOP）。Slack = 唯一溝通與自動通知節點。", difficulty: "基礎" },
  { id: "dq4", chapter: "ch1", chapterTitle: "好創營運底層邏輯", question: "好創核心團隊目前有幾人？", options: ["2 人", "3 人", "4 人", "6 人"], correctIndex: 2, explanation: "好創目前是 4 人正式核心團隊：陳涵勻（CEO）、黃子權（COO）、阿韋（剪輯師）、小鑫（企劃）。", difficulty: "基礎" },
  { id: "dq5", chapter: "ch1", chapterTitle: "好創營運底層邏輯", question: "混合專案（網站 + 社群）的收款方式應該是？", options: ["一次性全款", "按項目拆分收款", "50% 訂金制", "月費制"], correctIndex: 1, explanation: "混合專案按項目拆分收款。網站部分用 50% 訂金制，社群部分用執行前全款制。", difficulty: "基礎" },

  // 第 2 章：0-100 知識全局地圖（4 題，全基礎）
  { id: "dq6", chapter: "ch2", chapterTitle: "0-100 知識全局地圖", question: "好創新人教學系統涵蓋幾個知識維度？", options: ["3 個", "4 個", "5 個", "6 個"], correctIndex: 2, explanation: "好創統一新人教學系統涵蓋 5 大知識維度，從企劃到剪輯到 AI 自動化的全局地圖。", difficulty: "基礎" },
  { id: "dq7", chapter: "ch2", chapterTitle: "0-100 知識全局地圖", question: "Level 1（認知期）的能力指標是？", options: ["能獨立完成客戶月度規劃", "能理解底層邏輯和演算法", "能提出新的內容策略", "能帶領新人進階"], correctIndex: 1, explanation: "Level 1 認知期（0-25）：理解社群行銷的底層邏輯、演算法運作原理、好創的商業模式。能回答『為什麼要這樣做』。", difficulty: "基礎" },
  { id: "dq8", chapter: "ch2", chapterTitle: "0-100 知識全局地圖", question: "Level 3（獨立期）需要達到多少分數？", options: ["25-50 分", "50-75 分", "75-100 分", "100+ 分"], correctIndex: 1, explanation: "Level 3 獨立期（50-75）：能獨立完成客戶的月度社群規劃、短影音企劃、廣告文案。不需要子權逐一審核。", difficulty: "基礎" },
  { id: "dq9", chapter: "ch2", chapterTitle: "0-100 知識全局地圖", question: "2026 年 IG Reels 最重要的指標是？", options: ["粉絲數", "完播率", "點讚數", "留言數"], correctIndex: 1, explanation: "2026 年 IG Reels 最重要指標：完播率（35% 權重）。其次是 Hook Rate（25%）、分享率（20%）。", difficulty: "基礎" },

  // 第 3 章：社群行銷閉環飛輪（4 題，全基礎）
  { id: "dq10", chapter: "ch3", chapterTitle: "社群行銷閉環飛輪", question: "好創的內容矩陣公式中，知識型內容應佔比多少？", options: ["30%", "50%", "60%", "80%"], correctIndex: 2, explanation: "知識型 60%（建立信任）+ 娛樂型 25%（擴大觸及）+ 轉換型 15%（產生營收）。", difficulty: "基礎" },
  { id: "dq11", chapter: "ch3", chapterTitle: "社群行銷閉環飛輪", question: "社群飛輪效應通常在第幾個月開始顯現？", options: ["第 1 個月", "第 3 個月", "第 6 個月", "第 12 個月"], correctIndex: 1, explanation: "前 1-2 個月是『推動期』，需要持續產出不看數據。第 3 個月開始才會看到飛輪效應。", difficulty: "基礎" },
  { id: "dq12", chapter: "ch3", chapterTitle: "社群行銷閉環飛輪", question: "社群飛輪的第一步是？", options: ["內容生產", "受眾研究", "數據分析", "社群互動"], correctIndex: 1, explanation: "飛輪 7 步驟第一步：受眾研究。用 AI 分析目標受眾的痛點、語言、行為模式。產出受眾人物誌。", difficulty: "基礎" },
  { id: "dq13", chapter: "ch3", chapterTitle: "社群行銷閉環飛輪", question: "TOFU/MOFU/BOFU 三層內容漏斗中，TOFU 代表什麼？", options: ["信任建立", "吸引", "轉換", "互動"], correctIndex: 1, explanation: "TOFU（Top of Funnel）40% 吸引 / MOFU（Middle）35% 信任 / BOFU（Bottom）25% 轉換。", difficulty: "基礎" },

  // 第 4 章：企劃職位完整教學（4 題，全基礎）
  { id: "dq14", chapter: "ch4", chapterTitle: "企劃職位完整教學", question: "2026 年 Meta 演算法最重要的三大核心指標是？", options: ["粉絲數、觸及率、點擊率", "完播率、複看率、互動品質", "按讚數、分享數、留言數", "發布頻率、內容長度、標籤數量"], correctIndex: 1, explanation: "2026 年三大核心：完播率（最重要）、複看率（決定長期推送）、互動品質（誰在互動比多少互動重要）。", difficulty: "基礎" },
  { id: "dq15", chapter: "ch4", chapterTitle: "企劃職位完整教學", question: "企劃的核心職責是？", options: ["剪輯視頻", "決定『拍什麼/為什麼拍/商業效果』", "投放廣告", "管理粉絲"], correctIndex: 1, explanation: "企劃決定『拍什麼/為什麼拍/商業效果』。剪輯師負責『怎麼拍/技術執行』。", difficulty: "基礎" },
  { id: "dq16", chapter: "ch4", chapterTitle: "企劃職位完整教學", question: "企劃在選題時應該參考什麼？", options: ["個人喜好", "競品爆款內容", "隨機選擇", "客戶要求"], correctIndex: 1, explanation: "企劃應該拆解爆款內容、分析競品策略、識別受眾痛點，然後選題。不是個人喜好。", difficulty: "基礎" },
  { id: "dq17", chapter: "ch4", chapterTitle: "企劃職位完整教學", question: "一份完整的企劃方案應該包含什麼？", options: ["只有選題", "選題 + 腳本", "選題 + 腳本 + 預期效果 + 投放策略", "只有投放策略"], correctIndex: 2, explanation: "完整企劃方案：選題（為什麼選）+ 腳本（怎麼講）+ 預期效果（目標數據）+ 投放策略（何時發）。", difficulty: "基礎" },

  // 第 5 章：短影音企劃工作流（5 題，基礎 3 + 進階 2）
  { id: "dq18", chapter: "ch5", chapterTitle: "短影音企劃工作流", question: "一支短影音的前 2 秒應該做什麼？", options: ["放品牌 Logo", "自我介紹", "用 Hook 製造好奇心或衝突感", "放背景音樂"], correctIndex: 2, explanation: "前 2 秒是黃金法則：必須用 Hook 製造好奇心或衝突感，讓觀眾停下來看。", difficulty: "基礎" },
  { id: "dq19", chapter: "ch5", chapterTitle: "短影音企劃工作流", question: "好創標準工作流中，一支短影音的總製作時間約為？", options: ["1-2 小時", "3-4 小時", "7-9 小時", "12-15 小時"], correctIndex: 2, explanation: "標準版：約 7-9 小時/支。AI 加速版：約 4-6 小時/支。主要節省在選題、腳本、剪輯環節。", difficulty: "基礎" },
  { id: "dq20", chapter: "ch5", chapterTitle: "短影音企劃工作流", question: "短影音腳本的標準格式應該包含？", options: ["只有對白", "對白 + 鏡頭", "對白 + 鏡頭 + 時長 + 音樂標記 + 字幕", "只有時長"], correctIndex: 2, explanation: "標準腳本格式：對白（說什麼）+ 鏡頭（拍什麼）+ 時長（多久）+ 音樂標記（背景音）+ 字幕（怎麼字幕）。", difficulty: "基礎" },
  { id: "dq21", chapter: "ch5", chapterTitle: "短影音企劃工作流", question: "企劃在評估腳本品質時，最重要的指標是？", options: ["字數多少", "是否有 Hook", "是否符合品牌調性", "是否包含 CTA"], correctIndex: 1, explanation: "最重要指標：是否有 Hook（前 2-3 秒能否吸引）。其次是品牌調性、CTA 清晰度。", difficulty: "進階" },
  { id: "dq22", chapter: "ch5", chapterTitle: "短影音企劃工作流", question: "如何判斷一個選題是否『值得拍』？", options: ["只看粉絲喜好", "看完播率潛力 + 商業轉化潛力 + 執行難度", "只看執行難度", "看競品有沒有拍過"], correctIndex: 1, explanation: "判斷選題價值：完播率潛力（能否吸引）+ 商業轉化潛力（能否帶貨）+ 執行難度（成本）的綜合評估。", difficulty: "進階" },

  // 第 6 章：剪輯師完整教學（4 題，全基礎）
  { id: "dq23", chapter: "ch6", chapterTitle: "剪輯師完整教學", question: "好創標準中，字幕準確率必須達到多少？", options: ["90%", "95%", "99%", "100%"], correctIndex: 2, explanation: "好創品質標準：字幕準確率必須達到 99%。AI 生成後人工校對是必要步驟。", difficulty: "基礎" },
  { id: "dq24", chapter: "ch6", chapterTitle: "剪輯師完整教學", question: "剪輯師的核心職責是？", options: ["決定拍什麼", "執行『怎麼拍/技術執行』", "投放廣告", "寫腳本"], correctIndex: 1, explanation: "剪輯師負責『怎麼拍/技術執行』。企劃決定『拍什麼/為什麼拍』。", difficulty: "基礎" },
  { id: "dq25", chapter: "ch6", chapterTitle: "剪輯師完整教學", question: "一支短影音的標準色彩分級應該達到什麼水準？", options: ["無需色彩分級", "基礎調整", "專業級色彩分級（符合品牌調性）", "隨意調整"], correctIndex: 2, explanation: "好創標準：每支短影音都需要專業級色彩分級，確保視覺風格一致、符合品牌調性。", difficulty: "基礎" },
  { id: "dq26", chapter: "ch6", chapterTitle: "剪輯師完整教學", question: "剪輯時應該優先保留什麼？", options: ["所有鏡頭", "完播率最高的段落", "最長的段落", "最新拍的素材"], correctIndex: 1, explanation: "剪輯優先保留：完播率最高的段落（觀眾停留時間最長的部分）。刪除冗長或無聊的部分。", difficulty: "基礎" },

  // 第 7 章：剪輯軟體 AI 功能（4 題，全基礎）
  { id: "dq27", chapter: "ch7", chapterTitle: "剪輯軟體 AI 功能", question: "好創日常短影音的主力剪輯工具是？", options: ["Premiere Pro", "DaVinci Resolve", "CapCut", "Final Cut Pro"], correctIndex: 2, explanation: "CapCut 是好創日常短影音的主力工具，90% 的短影音在此完成。Premiere Pro 用於高階案件。", difficulty: "基礎" },
  { id: "dq28", chapter: "ch7", chapterTitle: "剪輯軟體 AI 功能", question: "CapCut 的 AI 字幕功能準確率如何？", options: ["50-60%", "70-80%", "85-90%", "100%"], correctIndex: 2, explanation: "CapCut AI 字幕準確率約 85-90%。需要人工校對達到 99% 的好創標準。", difficulty: "基礎" },
  { id: "dq29", chapter: "ch7", chapterTitle: "剪輯軟體 AI 功能", question: "使用 AI 自動字幕後，剪輯師應該做什麼？", options: ["直接發布", "人工逐字校對", "只改明顯錯誤", "刪除字幕"], correctIndex: 1, explanation: "AI 字幕是初稿，剪輯師必須逐字校對，確保準確率達到 99%。這是不可省略的步驟。", difficulty: "基礎" },
  { id: "dq30", chapter: "ch7", chapterTitle: "剪輯軟體 AI 功能", question: "CapCut 的 AI 背景移除功能適用於？", options: ["所有場景", "室內場景", "綠幕場景", "人物特寫"], correctIndex: 0, explanation: "CapCut AI 背景移除在大多數場景都能使用，但精度因場景而異。複雜背景需要手動調整。", difficulty: "基礎" },

  // 第 8 章：Manus 自動化工作流（4 題，全基礎）
  { id: "dq31", chapter: "ch8", chapterTitle: "Manus 自動化工作流", question: "Manus 平台的核心功能是？", options: ["只做視頻剪輯", "自動化內容生成 + 工作流管理 + 發布排程", "只做社群管理", "只做數據分析"], correctIndex: 1, explanation: "Manus 是一個自動化內容生成平台，支持腳本生成、文案迭代、工作流管理、多平台發布排程。", difficulty: "基礎" },
  { id: "dq32", chapter: "ch8", chapterTitle: "Manus 自動化工作流", question: "使用 Manus 進行短影音企劃時，效率提升約為？", options: ["10-20%", "30-50%", "60-80%", "90-100%"], correctIndex: 2, explanation: "Manus 自動化可將短影音企劃效率提升 60-80%。主要節省在選題、腳本初稿、文案迭代環節。", difficulty: "基礎" },
  { id: "dq33", chapter: "ch8", chapterTitle: "Manus 自動化工作流", question: "Manus 的 Monday.com 集成主要用於？", options: ["視頻剪輯", "項目進度管理 + 自動通知", "內容發布", "數據分析"], correctIndex: 1, explanation: "Manus 與 Monday.com 集成用於項目進度管理、自動通知、任務分配、進度追蹤。", difficulty: "基礎" },
  { id: "dq34", chapter: "ch8", chapterTitle: "Manus 自動化工作流", question: "Manus 的 Slack 集成主要功能是？", options: ["視頻剪輯", "內容發布", "自動推播通知 + 工作流觸發", "數據分析"], correctIndex: 2, explanation: "Manus 與 Slack 集成用於自動推播通知、工作流觸發、團隊協作提醒。", difficulty: "基礎" },

  // 第 9 章：AI Prompt 兵器庫（4 題，基礎 2 + 進階 2）
  { id: "dq35", chapter: "ch9", chapterTitle: "AI Prompt 兵器庫", question: "好創的雙引擎工作流是指？", options: ["CapCut + Premiere Pro", "ChatGPT 發散 + Claude 收斂", "Monday.com + Slack", "Notion + Google Drive"], correctIndex: 1, explanation: "好創採用『雙引擎工作流』：ChatGPT 負責創意發散，Claude 負責邏輯審核與策略。", difficulty: "基礎" },
  { id: "dq36", chapter: "ch9", chapterTitle: "AI Prompt 兵器庫", question: "使用 ChatGPT 進行創意發散時，應該怎麼做？", options: ["只問一個問題", "多輪對話，逐步深化", "複製別人的 Prompt", "不用 Prompt，直接提問"], correctIndex: 1, explanation: "ChatGPT 發散應該進行多輪對話，逐步深化。第一輪生成初稿，第二輪優化，第三輪調整方向。", difficulty: "進階" },
  { id: "dq37", chapter: "ch9", chapterTitle: "AI Prompt 兵器庫", question: "使用 Claude 進行邏輯審核時，應該檢查什麼？", options: ["只檢查語法", "檢查邏輯一致性、事實準確性、商業可行性", "只檢查字數", "不需要檢查"], correctIndex: 1, explanation: "Claude 審核應檢查：邏輯一致性（是否自相矛盾）、事實準確性（是否有幻覺）、商業可行性（是否能執行）。", difficulty: "進階" },
  { id: "dq38", chapter: "ch9", chapterTitle: "AI Prompt 兵器庫", question: "好創禁止在 AI 工具中輸入的資訊是？", options: ["公開的市場數據", "客戶的營收數據和合約金額", "產業趨勢分析", "競品信息"], correctIndex: 1, explanation: "AI 資安底線：客戶的營收數據、合約金額、個人隱私資料、未公開商業機密絕對不能輸入任何 AI 工具。", difficulty: "基礎" },

  // 第 10 章：報到清單與第一週任務（4 題，全基礎）
  { id: "dq39", chapter: "ch10", chapterTitle: "報到清單與第一週任務", question: "新人第一天應該完成什麼？", options: ["立即開始拍視頻", "完成報到清單 + 環境熟悉 + 工具配置", "立即參與客戶項目", "只做行政工作"], correctIndex: 1, explanation: "新人第一天：完成報到清單、熟悉辦公環境、配置開發工具、了解公司文化。", difficulty: "基礎" },
  { id: "dq40", chapter: "ch10", chapterTitle: "報到清單與第一週任務", question: "新人第一週的核心任務是？", options: ["完成 10 支視頻", "學習好創的營運邏輯 + 了解產品 + 熟悉工具", "獨立管理客戶", "參與所有會議"], correctIndex: 1, explanation: "新人第一週核心任務：學習好創營運邏輯、了解產品定位、熟悉工具棧、觀摩現有案例。", difficulty: "基礎" },
  { id: "dq41", chapter: "ch10", chapterTitle: "報到清單與第一週任務", question: "新人應該在第幾週開始獨立完成任務？", options: ["第 1 週", "第 2 週", "第 3-4 週", "第 8 週"], correctIndex: 2, explanation: "新人通常在第 3-4 週開始獨立完成簡單任務。前 2 週主要是學習和觀摩。", difficulty: "基礎" },
  { id: "dq42", chapter: "ch10", chapterTitle: "報到清單與第一週任務", question: "新人應該優先學習哪個章節？", options: ["剪輯軟體", "好創營運底層邏輯", "廣告投放", "客戶管理"], correctIndex: 1, explanation: "新人應優先學習第 1 章『好創營運底層邏輯』，理解公司的商業模式和運作方式。", difficulty: "基礎" },

  // 第 11 章：私域轉化完整指南（3 題，全進階）
  { id: "dq43", chapter: "ch11", chapterTitle: "私域轉化完整指南", question: "私域轉化漏斗的第一層是？", options: ["成交", "信任建立", "公域曝光", "互動培養"], correctIndex: 2, explanation: "私域轉化漏斗 5 層：公域曝光 → 引流進私域 → 信任建立 → 互動培養 → 成交轉化。", difficulty: "進階" },
  { id: "dq44", chapter: "ch11", chapterTitle: "私域轉化完整指南", question: "私域的核心資產是？", options: ["粉絲數", "用戶郵件列表 + 微信列表 + Line 列表", "廣告預算", "內容數量"], correctIndex: 1, explanation: "私域核心資產：用戶郵件列表、微信列表、Line 列表等可直接聯繫的用戶數據。", difficulty: "進階" },
  { id: "dq45", chapter: "ch11", chapterTitle: "私域轉化完整指南", question: "從公域引流到私域的最有效方式是？", options: ["免費贈品 + 價值內容 + 社群互動", "強制要求", "只靠廣告", "沒有有效方式"], correctIndex: 0, explanation: "最有效方式：提供免費贈品（電子書、課程）+ 高價值內容 + 社群互動建立信任。", difficulty: "進階" },

  // 第 12 章：多平台差異化策略（3 題，全進階）
  { id: "dq46", chapter: "ch12", chapterTitle: "多平台差異化策略", question: "『一魚三吃』工作流的正確理解是？", options: ["同一支影片發三個平台", "同一素材根據各平台特性重新剪輯", "三個平台發不同內容", "只選一個平台深耕"], correctIndex: 1, explanation: "一魚三吃：同一素材根據 TikTok、Reels、Shorts 各自的演算法特性重新剪輯，而非直接搬運。", difficulty: "進階" },
  { id: "dq47", chapter: "ch12", chapterTitle: "多平台差異化策略", question: "TikTok 和 IG Reels 的最大差異是？", options: ["都一樣", "TikTok 重視完播率，Reels 重視互動率", "TikTok 重視粉絲，Reels 重視觸及", "沒有差異"], correctIndex: 1, explanation: "TikTok 重視完播率（推薦陌生人），Reels 重視互動率（推薦粉絲）。策略應相應調整。", difficulty: "進階" },
  { id: "dq48", chapter: "ch12", chapterTitle: "多平台差異化策略", question: "YouTube Shorts 的推薦邏輯主要基於？", options: ["粉絲數", "完播率 + 互動率 + 訂閱轉化", "視頻長度", "上傳時間"], correctIndex: 1, explanation: "YouTube Shorts 推薦邏輯：完播率 + 互動率 + 訂閱轉化。與 TikTok 類似但更看重訂閱。", difficulty: "進階" },

  // 第 13 章：AI 工具完整矩陣（3 題，全實戰）
  { id: "dq49", chapter: "ch13", chapterTitle: "AI 工具完整矩陣", question: "使用 AI 工具時，哪些資訊絕對不能輸入？", options: ["公開的市場數據", "客戶的公司名稱", "客戶的營收數據和合約金額", "產業趨勢分析"], correctIndex: 2, explanation: "AI 資安底線：客戶的營收數據、合約金額、個人隱私資料、未公開商業機密絕對不能輸入任何 AI 工具。", difficulty: "實戰" },
  { id: "dq50", chapter: "ch13", chapterTitle: "AI 工具完整矩陣", question: "好創使用 AI 工具的原則是？", options: ["無限制使用", "完全禁用", "有選擇性使用，保護客戶隱私和商業機密", "只用免費工具"], correctIndex: 2, explanation: "好創 AI 使用原則：有選擇性使用，保護客戶隱私和商業機密。不輸入敏感信息，定期更新安全政策。", difficulty: "實戰" },
  { id: "dq51", chapter: "ch13", chapterTitle: "AI 工具完整矩陣", question: "當 AI 生成的內容有誤時，應該怎麼做？", options: ["直接使用", "人工審核 + 修正 + 驗證", "刪除重新生成", "詢問客戶"], correctIndex: 1, explanation: "AI 生成內容必須經過人工審核、修正、驗證。不能直接使用，要確保準確性和商業適配性。", difficulty: "實戰" },

  // 第 14 章：2026 年演算法完整認知（3 題，全實戰）
  { id: "dq52", chapter: "ch14", chapterTitle: "2026年演算法完整認知", question: "Power Like（有影響力帳號的互動）的價值是普通互動的幾倍？", options: ["2-3 倍", "5-10 倍", "50-100 倍", "沒有差別"], correctIndex: 1, explanation: "Power Like 的價值是普通互動的 5-10 倍。演算法根據『誰』在互動來判斷內容品質。", difficulty: "實戰" },
  { id: "dq53", chapter: "ch14", chapterTitle: "2026年演算法完整認知", question: "2026 年社群演算法最看重的是？", options: ["粉絲數", "內容品質 + 用戶停留時間 + 互動品質", "發布頻率", "內容長度"], correctIndex: 1, explanation: "2026 年演算法最看重：內容品質（是否有價值）+ 用戶停留時間（完播率）+ 互動品質（誰在互動）。", difficulty: "實戰" },
  { id: "dq54", chapter: "ch14", chapterTitle: "2026年演算法完整認知", question: "如何預測下月社群趨勢？", options: ["只看歷史數據", "分析當前熱點 + 競品動向 + 用戶痛點 + 季節性因素", "隨意猜測", "不可能預測"], correctIndex: 1, explanation: "預測趨勢應綜合分析：當前熱點、競品動向、用戶痛點、季節性因素、平台政策變化。", difficulty: "實戰" },
];

const STORAGE_KEY = "haochuang-daily-quiz";
const SLACK_CHANNEL_ID = "C0ATK171BU5"; // #all-共同成長

interface HistoryEntry {
  date: string;
  questionId: string;
  correct: boolean;
  selectedIndex?: number;
}

interface DailyQuizState {
  lastDate: string;
  todayQuestionId: string;
  answered: boolean;
  selectedIndex: number | null;
  sentToSlack: boolean;
  history: HistoryEntry[];
}

type FilterType = "all" | "correct" | "incorrect" | "unanswered";

function getTodayKey(): string {
  // 使用台灣時區 (UTC+8) 確保日期正確
  const now = new Date();
  const taiwanOffset = 8 * 60; // UTC+8 in minutes
  const utcMinutes = now.getTime() / 60000 + now.getTimezoneOffset();
  const taiwanTime = new Date((utcMinutes + taiwanOffset) * 60000);
  return taiwanTime.toISOString().split("T")[0];
}

function getQuestionForDate(dateStr: string): DailyQuestion {
  const dateNum = parseInt(dateStr.replace(/-/g, ""), 10);
  const questionIdx = dateNum % DAILY_QUIZ_POOL.length;
  return DAILY_QUIZ_POOL[questionIdx];
}

function getDailyQuizState(): DailyQuizState {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const state = JSON.parse(stored);
      if (state.lastDate === getTodayKey()) return state;
      // New day — carry over history, reset today's state
      const today = getTodayKey();
      const todayQuestion = getQuestionForDate(today);
      return {
        lastDate: today,
        todayQuestionId: todayQuestion.id,
        answered: false,
        selectedIndex: null,
        sentToSlack: false,
        history: state.history || [],
      };
    }
  } catch {}
  
  const today = getTodayKey();
  const todayQuestion = getQuestionForDate(today);
  
  return {
    lastDate: today,
    todayQuestionId: todayQuestion.id,
    answered: false,
    selectedIndex: null,
    sentToSlack: false,
    history: [],
  };
}

function saveDailyQuizState(state: DailyQuizState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  const month = d.getMonth() + 1;
  const day = d.getDate();
  const weekdays = ["日", "一", "二", "三", "四", "五", "六"];
  const weekday = weekdays[d.getDay()];
  return `${month}/${day} (${weekday})`;
}

function getPastDays(count: number): string[] {
  const days: string[] = [];
  for (let i = 1; i <= count; i++) {
    const now = new Date(Date.now() - i * 86400000);
    const taiwanOffset = 8 * 60;
    const utcMinutes = now.getTime() / 60000 + now.getTimezoneOffset();
    const taiwanTime = new Date((utcMinutes + taiwanOffset) * 60000);
    days.push(taiwanTime.toISOString().split("T")[0]);
  }
  return days;
}

interface DailyQuizProps {
  onSendToSlack?: (message: string) => void;
}

export default function DailyQuiz({ onSendToSlack }: DailyQuizProps) {
  const deviceId = useDeviceId();
  const submitDailyMutation = trpc.learning.submitDailyQuiz.useMutation();
  const [state, setState] = useState<DailyQuizState>(getDailyQuizState());
  const [sending, setSending] = useState(false);
  const [sendSuccess, setSendSuccess] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [expandedHistoryId, setExpandedHistoryId] = useState<string | null>(null);
  const [historyFilter, setHistoryFilter] = useState<FilterType>("all");

  const todayQuestion = useMemo(() => {
    return DAILY_QUIZ_POOL.find(q => q.id === state.todayQuestionId) || DAILY_QUIZ_POOL[0];
  }, [state.todayQuestionId]);

  const handleAnswer = (idx: number) => {
    if (state.answered) return;
    const isCorrect = idx === todayQuestion.correctIndex;
    const newState: DailyQuizState = {
      ...state,
      answered: true,
      selectedIndex: idx,
      history: [...state.history, { date: state.lastDate, questionId: todayQuestion.id, correct: isCorrect, selectedIndex: idx }],
    };
    setState(newState);
    saveDailyQuizState(newState);
    // 同步到後端
    if (deviceId) {
      submitDailyMutation.mutate({
        deviceId,
        quizDate: state.lastDate,
        questionId: todayQuestion.id,
        questionText: todayQuestion.question,
        selectedAnswer: idx,
        correctAnswer: todayQuestion.correctIndex,
        isCorrect,
      });
    }
  };

  const handleSendToSlack = async () => {
    setSending(true);
    try {
      const difficultyEmoji = todayQuestion.difficulty === "基礎" ? "🟢" : todayQuestion.difficulty === "進階" ? "🟡" : "🔴";
      const message = `📝 *好創學院｜每日一題* (${getTodayKey()})\n\n${difficultyEmoji} 難度：${todayQuestion.difficulty}｜章節：${todayQuestion.chapterTitle}\n\n> ${todayQuestion.question}\n\nA. ${todayQuestion.options[0]}\nB. ${todayQuestion.options[1]}\nC. ${todayQuestion.options[2]}\nD. ${todayQuestion.options[3]}\n\n_💡 答案稍後公佈，先想想再看！_\n\n||答案：${"ABCD"[todayQuestion.correctIndex]}. ${todayQuestion.options[todayQuestion.correctIndex]}\n\n📖 解析：${todayQuestion.explanation}||`;
      
      if (onSendToSlack) {
        onSendToSlack(message);
        const newState = { ...state, sentToSlack: true };
        setState(newState);
        saveDailyQuizState(newState);
        setSendSuccess(true);
        setTimeout(() => setSendSuccess(false), 3000);
      } else {
        // 無回調時提示用戶功能尚未連接
        alert("Slack 推播功能需要管理員配置。請聯繫子權開啟此功能。");
      }
    } catch (err) {
      console.error("Failed to send to Slack:", err);
    } finally {
      setSending(false);
    }
  };

  // Calculate streak
  const correctStreak = useMemo(() => {
    let streak = 0;
    const sorted = [...state.history].reverse();
    for (const entry of sorted) {
      if (entry.correct) streak++;
      else break;
    }
    return streak;
  }, [state.history]);

  const totalAnswered = state.history.length;
  const totalCorrect = state.history.filter(h => h.correct).length;
  const accuracy = totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : 0;

  // Generate history entries (過去 50 天，顯示哪些被作答）
  const historyEntries = useMemo(() => {
    const pastDays = getPastDays(50);
    return pastDays.map(dateStr => {
      const question = getQuestionForDate(dateStr);
      const historyRecord = state.history.find(h => h.date === dateStr);
      return {
        date: dateStr,
        question,
        answered: !!historyRecord,
        correct: historyRecord?.correct || false,
        selectedIndex: historyRecord?.selectedIndex,
      };
    });
  }, [state.history]);

  // Apply filter to history entries
  const filteredHistoryEntries = useMemo(() => {
    return historyEntries.filter(entry => {
      if (historyFilter === "all") return true;
      if (historyFilter === "correct") return entry.answered && entry.correct;
      if (historyFilter === "incorrect") return entry.answered && !entry.correct;
      if (historyFilter === "unanswered") return !entry.answered;
      return true;
    });
  }, [historyEntries, historyFilter]);

  const filterStats = useMemo(() => {
    return {
      all: historyEntries.length,
      correct: historyEntries.filter(e => e.answered && e.correct).length,
      incorrect: historyEntries.filter(e => e.answered && !e.correct).length,
      unanswered: historyEntries.filter(e => !e.answered).length,
    };
  }, [historyEntries]);

  return (
    <div className="glass-card rounded-xl overflow-hidden">
      {/* Header */}
      <div className="p-5 border-b border-border/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg" style={{ boxShadow: '0 0 12px rgba(139,92,246,0.3)' }}>
              <Sparkles size={18} className="text-white" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-foreground">每日一題</h3>
              <p className="text-[10px] text-muted-foreground">
                {getTodayKey()} · 難度：
                <span className={`font-medium ${
                  todayQuestion.difficulty === "基礎" ? "text-emerald-400" :
                  todayQuestion.difficulty === "進階" ? "text-amber-400" : "text-red-400"
                }`}>
                  {todayQuestion.difficulty}
                </span>
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {correctStreak > 0 && (
              <div className="px-2 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20">
                <span className="text-[10px] font-mono text-emerald-400">🔥 連對 {correctStreak} 題</span>
              </div>
            )}
            {totalAnswered > 0 && (
              <div className="px-2 py-1 rounded-md bg-blue-500/10 border border-blue-500/20">
                <span className="text-[10px] font-mono text-blue-400">正確率 {accuracy}%</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Question */}
      <div className="p-5">
        <div className="mb-1">
          <span className="text-[10px] text-muted-foreground/70 uppercase tracking-wider">
            來自：{todayQuestion.chapterTitle}
          </span>
        </div>
        <p className="text-sm font-medium text-foreground leading-relaxed mb-4">
          {todayQuestion.question}
        </p>

        {/* Options */}
        <div className="space-y-2">
          {todayQuestion.options.map((option, idx) => {
            const isSelected = state.selectedIndex === idx;
            const isCorrect = idx === todayQuestion.correctIndex;
            const showResult = state.answered;
            
            let optionStyle = "border-border/30 hover:border-border/60 hover:bg-background/30";
            if (showResult) {
              if (isCorrect) {
                optionStyle = "border-emerald-500/50 bg-emerald-500/10";
              } else if (isSelected && !isCorrect) {
                optionStyle = "border-red-500/50 bg-red-500/10";
              } else {
                optionStyle = "border-border/20 opacity-50";
              }
            }
            
            return (
              <button
                key={idx}
                onClick={() => handleAnswer(idx)}
                disabled={state.answered}
                className={`w-full text-left px-4 py-3 rounded-lg border transition-all duration-200 flex items-center gap-3 ${optionStyle} ${
                  !state.answered ? "cursor-pointer" : "cursor-default"
                }`}
              >
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 ${
                  showResult && isCorrect ? "bg-emerald-500 text-white" :
                  showResult && isSelected && !isCorrect ? "bg-red-500 text-white" :
                  "bg-border/30 text-muted-foreground"
                }`}>
                  {"ABCD"[idx]}
                </span>
                <span className={`text-xs ${
                  showResult && isCorrect ? "text-emerald-400 font-medium" :
                  showResult && isSelected && !isCorrect ? "text-red-400" :
                  "text-foreground"
                }`}>
                  {option}
                </span>
                {showResult && isCorrect && <CheckCircle2 size={14} className="ml-auto text-emerald-400" />}
                {showResult && isSelected && !isCorrect && <XCircle size={14} className="ml-auto text-red-400" />}
              </button>
            );
          })}
        </div>

        {/* Explanation (shown after answering) */}
        {state.answered && (
          <div className="mt-4 p-4 rounded-lg bg-background/50 border border-border/20">
            <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-1.5">解析</p>
            <p className="text-xs text-foreground leading-relaxed">
              {todayQuestion.explanation}
            </p>
          </div>
        )}

        {/* Slack Send Button */}
        <div className="mt-5 pt-4 border-t border-border/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageCircle size={14} className="text-muted-foreground" />
              <span className="text-[10px] text-muted-foreground">
                推播到 Slack #all-共同成長
              </span>
            </div>
            <button
              onClick={handleSendToSlack}
              disabled={sending || state.sentToSlack}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-medium transition-all duration-200 ${
                state.sentToSlack
                  ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                  : sendSuccess
                  ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                  : "bg-violet-500/10 text-violet-400 border border-violet-500/30 hover:bg-violet-500/20"
              } disabled:opacity-50`}
            >
              {state.sentToSlack ? (
                <>
                  <CheckCircle2 size={11} />
                  已推播
                </>
              ) : sending ? (
                <>
                  <Clock size={11} className="animate-spin" />
                  發送中...
                </>
              ) : (
                <>
                  <Send size={11} />
                  推播今日題目
                </>
              )}
            </button>
          </div>
          {state.sentToSlack && (
            <p className="text-[9px] text-emerald-400/70 mt-2 pl-6">
              今日題目已推播至 Slack，團隊成員可在頻道中看到並討論
            </p>
          )}
        </div>
      </div>

      {/* History Section */}
      <div className="border-t border-border/20">
        <button
          onClick={() => setShowHistory(!showHistory)}
          className="w-full px-5 py-4 flex items-center justify-between hover:bg-background/20 transition-colors"
        >
          <div className="flex items-center gap-2.5">
            <History size={15} className="text-violet-400" />
            <span className="text-xs font-medium text-foreground">歷史題目回顧</span>
            <span className="text-[10px] text-muted-foreground">
              (過去 50 天 · 已答 {state.history.length} 題)
            </span>
          </div>
          {showHistory ? (
            <ChevronUp size={14} className="text-muted-foreground" />
          ) : (
            <ChevronDown size={14} className="text-muted-foreground" />
          )}
        </button>

        {showHistory && (
          <div className="px-5 pb-5 space-y-2">
            {/* Stats Summary */}
            <div className="grid grid-cols-4 gap-2 mb-4">
              <div className="p-3 rounded-lg bg-background/30 border border-border/20 text-center">
                <p className="text-lg font-black font-mono text-foreground">{totalAnswered}</p>
                <p className="text-[9px] text-muted-foreground">已答題數</p>
              </div>
              <div className="p-3 rounded-lg bg-background/30 border border-border/20 text-center">
                <p className="text-lg font-black font-mono text-emerald-400">{totalCorrect}</p>
                <p className="text-[9px] text-muted-foreground">答對題數</p>
              </div>
              <div className="p-3 rounded-lg bg-background/30 border border-border/20 text-center">
                <p className="text-lg font-black font-mono text-red-400">{filterStats.incorrect}</p>
                <p className="text-[9px] text-muted-foreground">答錯題數</p>
              </div>
              <div className="p-3 rounded-lg bg-background/30 border border-border/20 text-center">
                <p className="text-lg font-black font-mono text-blue-400">{accuracy}%</p>
                <p className="text-[9px] text-muted-foreground">正確率</p>
              </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-2 mb-4 overflow-x-auto">
              {(["all", "correct", "incorrect", "unanswered"] as FilterType[]).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setHistoryFilter(filter)}
                  className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-[10px] font-medium transition-all whitespace-nowrap ${
                    historyFilter === filter
                      ? filter === "correct"
                        ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                        : filter === "incorrect"
                        ? "bg-red-500/20 text-red-400 border border-red-500/40"
                        : filter === "unanswered"
                        ? "bg-amber-500/20 text-amber-400 border border-amber-500/40"
                        : "bg-violet-500/20 text-violet-400 border border-violet-500/40"
                      : "bg-border/20 text-muted-foreground border border-border/30 hover:border-border/50"
                  }`}
                >
                  {filter === "all" && `全部 (${filterStats.all})`}
                  {filter === "correct" && `✓ 答對 (${filterStats.correct})`}
                  {filter === "incorrect" && `✗ 答錯 (${filterStats.incorrect})`}
                  {filter === "unanswered" && `— 未答 (${filterStats.unanswered})`}
                </button>
              ))}
            </div>

            {/* History List */}
            <div className="space-y-1.5">
              {filteredHistoryEntries.map((entry) => {
                const isExpanded = expandedHistoryId === entry.date;
                const difficultyColor = entry.question.difficulty === "基礎" ? "text-emerald-400" :
                  entry.question.difficulty === "進階" ? "text-amber-400" : "text-red-400";
                
                return (
                  <div key={entry.date} className="rounded-lg border border-border/20 overflow-hidden">
                    {/* History Item Header */}
                    <button
                      onClick={() => setExpandedHistoryId(isExpanded ? null : entry.date)}
                      className="w-full px-4 py-3 flex items-center gap-3 hover:bg-background/20 transition-colors"
                    >
                      {/* Date */}
                      <div className="flex-shrink-0 w-16">
                        <span className="text-[10px] font-mono text-muted-foreground">
                          {formatDate(entry.date)}
                        </span>
                      </div>

                      {/* Status Indicator */}
                      <div className="flex-shrink-0">
                        {entry.answered ? (
                          entry.correct ? (
                            <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center">
                              <CheckCircle2 size={12} className="text-emerald-400" />
                            </div>
                          ) : (
                            <div className="w-5 h-5 rounded-full bg-red-500/20 flex items-center justify-center">
                              <XCircle size={12} className="text-red-400" />
                            </div>
                          )
                        ) : (
                          <div className="w-5 h-5 rounded-full bg-border/30 flex items-center justify-center">
                            <span className="text-[8px] text-muted-foreground">—</span>
                          </div>
                        )}
                      </div>

                      {/* Question Preview */}
                      <div className="flex-1 min-w-0 text-left">
                        <p className="text-[11px] text-foreground truncate">
                          {entry.question.question}
                        </p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className={`text-[9px] font-medium ${difficultyColor}`}>
                            {entry.question.difficulty}
                          </span>
                          <span className="text-[9px] text-muted-foreground/60">·</span>
                          <span className="text-[9px] text-muted-foreground/70">
                            {entry.question.chapterTitle}
                          </span>
                        </div>
                      </div>

                      {/* Expand Icon */}
                      <div className="flex-shrink-0">
                        {isExpanded ? (
                          <ChevronUp size={12} className="text-muted-foreground" />
                        ) : (
                          <ChevronDown size={12} className="text-muted-foreground" />
                        )}
                      </div>
                    </button>

                    {/* Expanded Content */}
                    {isExpanded && (
                      <div className="px-4 pb-4 pt-1 border-t border-border/10 bg-background/20">
                        {/* Full Question */}
                        <p className="text-xs font-medium text-foreground leading-relaxed mb-3">
                          {entry.question.question}
                        </p>

                        {/* Options with correct/incorrect marking */}
                        <div className="space-y-1.5 mb-3">
                          {entry.question.options.map((option, idx) => {
                            const isCorrectOption = idx === entry.question.correctIndex;
                            const wasSelected = entry.answered && entry.selectedIndex === idx;
                            
                            let style = "border-border/15 text-muted-foreground";
                            if (isCorrectOption) {
                              style = "border-emerald-500/40 bg-emerald-500/5 text-emerald-400";
                            } else if (wasSelected && !isCorrectOption) {
                              style = "border-red-500/40 bg-red-500/5 text-red-400";
                            }
                            
                            return (
                              <div
                                key={idx}
                                className={`flex items-center gap-2.5 px-3 py-2 rounded-md border ${style}`}
                              >
                                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold flex-shrink-0 ${
                                  isCorrectOption ? "bg-emerald-500 text-white" :
                                  wasSelected ? "bg-red-500 text-white" :
                                  "bg-border/30 text-muted-foreground"
                                }`}>
                                  {"ABCD"[idx]}
                                </span>
                                <span className="text-[11px]">{option}</span>
                                {isCorrectOption && <CheckCircle2 size={11} className="ml-auto text-emerald-400" />}
                                {wasSelected && !isCorrectOption && <XCircle size={11} className="ml-auto text-red-400" />}
                              </div>
                            );
                          })}
                        </div>

                        {/* Explanation */}
                        <div className="p-3 rounded-md bg-violet-500/5 border border-violet-500/15">
                          <p className="text-[9px] font-medium text-violet-400 uppercase tracking-wider mb-1">詳細解析</p>
                          <p className="text-[11px] text-foreground/90 leading-relaxed">
                            {entry.question.explanation}
                          </p>
                        </div>

                        {/* Answer Status */}
                        {!entry.answered && (
                          <div className="mt-2 p-2 rounded-md bg-amber-500/5 border border-amber-500/15">
                            <p className="text-[9px] text-amber-400">
                              ⚠️ 你當天未作答此題
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Empty State */}
            {filteredHistoryEntries.length === 0 && (
              <div className="py-6 text-center">
                <Calendar size={24} className="mx-auto text-muted-foreground/30 mb-2" />
                <p className="text-xs text-muted-foreground">
                  {historyFilter === "all" && "尚無歷史紀錄"}
                  {historyFilter === "correct" && "沒有答對的題目"}
                  {historyFilter === "incorrect" && "沒有答錯的題目"}
                  {historyFilter === "unanswered" && "所有題目都已作答"}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
