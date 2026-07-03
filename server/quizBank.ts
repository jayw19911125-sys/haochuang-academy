/**
 * 章末考核測驗題庫（僅存在於伺服器端）
 *
 * 注意：正解（correctIndex）與解析（explanation）絕不可隨題目
 * 直接送到前端。前端取題請用 learning.getQuizQuestions（已剔除正解），
 * 計分一律在伺服器端進行（learning.submitQuiz）。
 */

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

/** 前端可見的題目形態（不含正解與解析） */
export interface PublicQuizQuestion {
  id: string;
  question: string;
  options: string[];
}

export const chapterQuizzes: Record<string, QuizQuestion[]> = {
  ch1: [
    { id: "ch1-q1", question: "好創的產能防禦機制中，現有核心團隊是幾人？超出產能時應該怎麼做？", options: ["6 人，加班處理", "4 人，拒絕或外包", "3 人，招聘新人", "5 人，降低品質趕工"], correctIndex: 1, explanation: "好創核心團隊為 4 人（CEO + COO + 剪輯師 + 企劃）。超出產能時必須拒絕或外包，絕不能降低品質或假設擴張編制。" },
    { id: "ch1-q2", question: "客戶簽約社群類專案 NT$38,000 月費方案，正確的收款流程是？", options: ["先開工，月底收款", "執行前收當月全款", "收 50% 訂金開工", "完成後一次收全款"], correctIndex: 1, explanation: "社群類專案的鐵則：執行前收當月全款。網站專案才是 50% 訂金制。" },
    { id: "ch1-q3", question: "好創的工具棧中，Monday.com 和 Slack 的分工是？", options: ["Monday = 聊天，Slack = 存資料", "Monday = 數據庫，Slack = 通知器", "兩者功能相同可互換", "Monday = 外部溝通，Slack = 內部溝通"], correctIndex: 1, explanation: "Monday.com = 數據庫（存資料、追進度、管流程）。Slack = 通知器（即時溝通、自動提醒、快速決策）。絕不混用。" },
    { id: "ch1-q4", question: "一個客戶要求「先做再付款，看到成效再說」，你應該怎麼回應？", options: ["同意，先建立信任", "委婉拒絕，堅持先收款", "打折後同意", "請示 CEO 決定"], correctIndex: 1, explanation: "好創鐵則：先收錢才開工，沒有例外。這是篩選客戶的機制，願意先付款的客戶配合度更高。" },
    { id: "ch1-q5", question: "好創的招募中職缺在排程計算時應該怎麼處理？", options: ["預估到職時間，提前計入", "不計入，直到實際到職", "計入 50% 產能", "視情況彈性處理"], correctIndex: 1, explanation: "產能防禦機制明確規定：招募中職缺在實際到職前不得計入產能。這是防止過度承諾的底線。" }
  ],
  ch2: [
    { id: "ch2-q1", question: "好創學院的 5 大知識維度，建議的學習順序是？", options: ["隨意學習，沒有順序", "企劃 → 剪輯 → 產業 → AI → 自動化", "自動化 → AI → 產業 → 剪輯 → 企劃", "全部同時學習"], correctIndex: 1, explanation: "建議順序：企劃（基礎）→ 剪輯（技術）→ 產業知識（商業）→ AI Prompt（效率）→ Manus 自動化（進階）。前三個必修，後兩個選修但強烈建議。" },
    { id: "ch2-q2", question: "心智圖的正確使用方式是？", options: ["當作教材逐字學習", "先看全景，再逐章深入，學完回來自我評估", "只看一次就好", "背下所有分支"], correctIndex: 1, explanation: "心智圖是「全景地圖」不是「學習教材」。正確用法：先看整體結構 → 逐章深入 → 學完回來確認覆蓋率 → 做自我評估。" },
    { id: "ch2-q3", question: "新人（企劃職位）應該從哪個維度開始學習？", options: ["第五維度（Manus 自動化）", "第二維度（剪輯師教學）", "第一維度（企劃職位教學）", "隨便選一個"], correctIndex: 2, explanation: "企劃職位從第一維度開始。但無論什麼職位，第一章「好創營運底層邏輯」都是必讀的。" },
    { id: "ch2-q4", question: "好創全局知識地圖的「單一真實來源」是存放在哪裡？", options: ["Google Drive", "Notion", "GitHub 公開 raw 網址", "Monday.com"], correctIndex: 2, explanation: "好創的全局知識地圖以 GitHub 公開 raw 網址為唯一真實來源，確保跨平台同步一致性。" },
    { id: "ch2-q5", question: "學完一章後，最有效的驗證方式是？", options: ["重讀一遍", "做章末考核測驗", "跳到下一章", "問同事"], correctIndex: 1, explanation: "每章末尾的考核測驗是最有效的驗證方式，通過才代表真正理解，而非只是「看過」。" }
  ],
  ch3: [
    { id: "ch3-q1", question: "好創的內容矩陣公式比例是？", options: ["知識 30% + 娛樂 30% + 轉換 40%", "知識 60% + 娛樂 25% + 轉換 15%", "知識 80% + 娛樂 10% + 轉換 10%", "知識 50% + 娛樂 50%"], correctIndex: 1, explanation: "好創標準：知識型 60%（建立信任）+ 娛樂型 25%（擴大觸及）+ 轉換型 15%（產生營收）。不要一開始就發轉換型內容。" },
    { id: "ch3-q2", question: "社群飛輪效應通常在第幾個月開始顯現？", options: ["第 1 個月", "第 3 個月", "第 6 個月", "第 12 個月"], correctIndex: 1, explanation: "前 1-2 個月是「推動期」，需要持續產出不看數據。第 3 個月開始才會看到飛輪效應。" },
    { id: "ch3-q3", question: "客戶問「為什麼第一個月數據這麼差？」你應該怎麼回答？", options: ["承認失敗，提出改善方案", "解釋飛輪需要推動期，前 1-2 月是累積階段", "降價補償", "換一個策略重新開始"], correctIndex: 1, explanation: "社群飛輪的本質是「先投入再收穫」。前 1-2 個月是推動期，這是正常現象，需要提前跟客戶溝通預期。" },
    { id: "ch3-q4", question: "社群閉環飛輪的正確順序是？", options: ["轉換 → 內容 → 互動 → 觸及", "內容 → 觸及 → 互動 → 轉換 → 再投入", "廣告 → 粉絲 → 銷售", "隨機發布看哪個有效"], correctIndex: 1, explanation: "社群閉環飛輪：內容（產出）→ 觸及（被看到）→ 互動（被喜歡）→ 轉換（被購買）→ 再投入（更多內容）。" },
    { id: "ch3-q5", question: "好創在飛輪啟動期（前 2 個月）的正確做法是？", options: ["每天看數據，隨時調整策略", "持續產出高品質內容，不被數據影響", "減少產出量，觀察市場反應", "大量投放廣告加速"], correctIndex: 1, explanation: "飛輪啟動期的關鍵：持續產出不看數據。先累積 10-20 支高品質內容，觀察哪些有自然互動，再放大成功模式。" }
  ],
  ch4: [
    { id: "ch4-q1", question: "企劃 Level 1 到 Level 2 的正常進度是多久？用 AI 輔助可以壓縮到？", options: ["1 個月 / 2 週", "1-2 個月 / 2-3 週", "3 個月 / 1 個月", "6 個月 / 3 個月"], correctIndex: 1, explanation: "正常進度：Level 1 → Level 2 需要 1-2 個月。用 AI 輔助可以壓縮到 2-3 週。" },
    { id: "ch4-q2", question: "2026 年 Meta 演算法最重要的三大核心指標是？", options: ["按讚數、分享數、留言數", "完播率、複看率、互動品質", "粉絲數、觸及率、點擊率", "發布頻率、內容長度、標籤數量"], correctIndex: 1, explanation: "2026 年三大核心：完播率（最重要）、複看率（決定長期推送）、互動品質（誰在互動比多少互動重要）。" },
    { id: "ch4-q3", question: "企劃和剪輯師的協作邊界中，「說什麼」由誰決定？「怎麼呈現」由誰決定？", options: ["都由企劃決定", "企劃決定「說什麼」，剪輯師決定「怎麼呈現」", "都由剪輯師決定", "由 CEO 統一決定"], correctIndex: 1, explanation: "企劃負責選題、腳本、Hook、CTA（說什麼）。剪輯師負責畫面節奏、轉場、音效、字幕（怎麼呈現）。" },
    { id: "ch4-q4", question: "一支短影音的前 2 秒應該做什麼？", options: ["放品牌 Logo", "用 Hook 製造好奇心或衝突感", "自我介紹", "放背景音樂"], correctIndex: 1, explanation: "前 2 秒是黃金法則：必須用 Hook 製造好奇心或衝突感，讓觀眾停下來看。這是 2026 年完播率的關鍵。" },
    { id: "ch4-q5", question: "Power Like（有影響力帳號的互動）的價值是普通互動的幾倍？", options: ["2-3 倍", "5-10 倍", "50-100 倍", "沒有差別"], correctIndex: 1, explanation: "Power Like 的價值是普通互動的 5-10 倍。演算法會根據「誰」在互動來判斷內容品質，而非只看互動數量。" }
  ],
  ch5: [
    { id: "ch5-q1", question: "好創標準工作流中，一支短影音的總製作時間約為？用 AI 加速版約為？", options: ["3-4 小時 / 1-2 小時", "7-9 小時 / 4-6 小時", "12-15 小時 / 8-10 小時", "1-2 小時 / 30 分鐘"], correctIndex: 1, explanation: "標準版：約 7-9 小時/支。AI 加速版：約 4-6 小時/支。主要節省在選題、腳本、剪輯環節。" },
    { id: "ch5-q2", question: "4 人團隊的月產能上限約為多少支短影音？", options: ["10-15 支", "30-40 支", "60-80 支", "100+ 支"], correctIndex: 1, explanation: "根據產能防禦機制：每位企劃 16-36 支/月，每位剪輯師 20-30 支/月。4 人團隊月產能上限約 30-40 支。" },
    { id: "ch5-q3", question: "短影音腳本的標準結構是？", options: ["開頭 → 中間 → 結尾", "Hook → Body → CTA", "問題 → 解答 → 總結", "故事 → 轉折 → 結局"], correctIndex: 1, explanation: "好創標準腳本結構：Hook（前 2 秒抓注意力）→ Body（中段傳遞價值）→ CTA（結尾引導行動）。" },
    { id: "ch5-q4", question: "客戶要求「一個月 50 支影片」，你應該怎麼回應？", options: ["同意，加班完成", "根據產能防禦機制，說明 30-40 支是上限，超出需外包", "降低品質趕量", "增加報價後同意"], correctIndex: 1, explanation: "產能防禦機制是底線。4 人團隊月產能上限 30-40 支，超出必須拒絕或安排外包資源。" },
    { id: "ch5-q5", question: "AI 加速版工作流中，哪個環節節省最多時間？", options: ["拍攝", "選題 + 腳本", "審核", "發布排程"], correctIndex: 1, explanation: "AI 加速版主要節省「選題 + 腳本」環節：從 1.5 小時壓縮到 30 分鐘。拍攝環節無法用 AI 替代。" }
  ],
  ch6: [
    { id: "ch6-q1", question: "好創的標準是：日常短影音用什麼軟體？品牌形象片用什麼？", options: ["都用 Premiere Pro", "日常用 CapCut，品牌形象片用 Premiere Pro", "都用 CapCut", "日常用 DaVinci，品牌用 After Effects"], correctIndex: 1, explanation: "好創標準：日常短影音 → CapCut（效率優先）。品牌形象片/廣告素材 → Premiere Pro（品質優先）。" },
    { id: "ch6-q2", question: "剪輯師最常犯的 Top 1 錯誤是？", options: ["字幕太小", "節奏太慢（前 3 秒沒變化）", "音樂太大聲", "結尾太突然"], correctIndex: 1, explanation: "Top 1 錯誤：節奏太慢。前 3 秒沒有變化，觀眾直接滑走。這直接影響完播率。" },
    { id: "ch6-q3", question: "BGM 音量應該是人聲的多少百分比？", options: ["50-60%", "20-30%", "80-90%", "10-15%"], correctIndex: 1, explanation: "BGM 音量應該是人聲的 20-30%。太大會蓋過人聲，太小則缺乏氛圍感。" },
    { id: "ch6-q4", question: "新人剪輯師建議的學習順序是？", options: ["先學 Premiere Pro，再學 CapCut", "先學 CapCut（1 週上手），再學 Premiere Pro（1 個月熟練）", "只學 CapCut 就好", "三個軟體同時學"], correctIndex: 1, explanation: "建議順序：先學 CapCut（1 週上手），再學 Premiere Pro（1 個月熟練）。CapCut 入門快，能快速產出。" },
    { id: "ch6-q5", question: "剪輯時「呼吸感」是什麼意思？", options: ["影片中加入呼吸聲", "畫面切換要有適當間隔，避免觀眾疲勞", "每 10 秒暫停一次", "用慢動作"], correctIndex: 1, explanation: "「呼吸感」= 畫面切換不能太密集，要有適當的停頓和節奏變化，讓觀眾的眼睛和大腦有休息的空間。" }
  ],
  ch7: [
    { id: "ch7-q1", question: "2026 年 AI 能取代剪輯師嗎？", options: ["完全可以", "不能完全取代，但能大幅提升效率", "完全不能", "只能取代新手"], correctIndex: 1, explanation: "AI 是「加速器」不是「替代品」。AI 能做自動字幕、調色、去背、配樂、粗剪。不能做節奏感判斷、情緒把控、品牌風格一致性。" },
    { id: "ch7-q2", question: "剪輯師使用 AI 功能後，每支影片平均可以省多少時間？", options: ["15-30 分鐘", "1-1.5 小時", "3-4 小時", "5 小時以上"], correctIndex: 1, explanation: "AI 功能合計每支影片省 1-1.5 小時：自動字幕（30 分鐘）+ 自動調色（15 分鐘）+ AI 去背（20 分鐘）+ 智能裁切 + AI 配樂。" },
    { id: "ch7-q3", question: "AI 自動字幕功能主要省下什麼工作？", options: ["翻譯", "逐字打字和時間軸對齊", "字體設計", "字幕動畫"], correctIndex: 1, explanation: "AI 自動字幕省下的是「逐字打字和時間軸對齊」的工作，每支影片約省 30 分鐘。字體設計和動畫仍需人工調整。" },
    { id: "ch7-q4", question: "好的剪輯師 + AI 可以達到幾倍產能？", options: ["1.5 倍", "3 倍", "10 倍", "沒有差別"], correctIndex: 1, explanation: "好的剪輯師 + AI = 3 倍產能。這是好創解決「阿韋單點風險」的核心策略之一。" },
    { id: "ch7-q5", question: "以下哪項是 AI 目前無法替代的剪輯能力？", options: ["自動字幕生成", "節奏感判斷和情緒把控", "自動調色", "智能裁切"], correctIndex: 1, explanation: "節奏感判斷、情緒把控、品牌風格一致性、創意轉場 — 這些需要人類的審美和經驗，AI 目前無法替代。" }
  ],
  ch8: [
    { id: "ch8-q1", question: "好創的 AI 工具使用順序是？", options: ["只用 ChatGPT", "ChatGPT 發散 → Claude 收斂 → Manus 批量執行", "只用 Manus", "隨機選一個"], correctIndex: 1, explanation: "好創標準流程：ChatGPT 想點子（發散）→ Claude 優化邏輯（收斂）→ Manus 批量執行（自動化）。三者各有專長，不可互換。" },
    { id: "ch8-q2", question: "Manus 和 ChatGPT 的核心差異是？", options: ["速度不同", "ChatGPT 是對話式，Manus 是自動化 Agent", "價格不同", "語言不同"], correctIndex: 1, explanation: "ChatGPT = 對話式 AI（你問一句它答一句）。Manus = 自動化 AI Agent（你給目標它自己完成整個流程）。" },
    { id: "ch8-q3", question: "Manus 批量生成一週內容排程，原本需要 2 小時的工作可以壓縮到？", options: ["1 小時", "30 分鐘", "5 分鐘", "10 秒"], correctIndex: 2, explanation: "Manus 可以在 5 分鐘內完成原本需要 2 小時的一週內容排程工作。這是 AI 自動化的核心價值。" },
    { id: "ch8-q4", question: "Manus 自動化的限制是什麼？", options: ["不能連網", "不能取代人的判斷，最終決策需人工審核", "不能處理中文", "只能做文字工作"], correctIndex: 1, explanation: "Manus 的限制：不能取代「人的判斷」。所有自動化產出都需要人工審核後才能發布。AI 是工具，不是決策者。" },
    { id: "ch8-q5", question: "好創的 AI 資安 SOP 中，哪些資料絕對禁止貼入 AI 工具？", options: ["公開的行銷文案", "客戶個資、合約金額、內部財務數據", "已發布的社群貼文", "公開的產業報告"], correctIndex: 1, explanation: "第一級禁止：客戶個資（姓名+電話+地址）、合約金額與條件、內部財務數據、員工薪資。違反即時通報 COO。" }
  ],
  ch9: [
    { id: "ch9-q1", question: "AI Prompt 兵器庫中「武器一」是什麼？最適合用哪個 AI 模型？", options: ["短影音腳本生成器 / GPT-4o", "Meta 廣告文案生成器 / Claude 3.5 Sonnet", "內容日曆發想 / Manus", "爆款拆解分析器 / GPT-4o"], correctIndex: 1, explanation: "武器一是 Meta 廣告文案生成器，使用 Claude 3.5 Sonnet。目的是快速產出高 CTR 的導購文案初稿。" },
    { id: "ch9-q2", question: "短影音 Hook 發散引擎（武器二）要求每個 Hook 必須用什麼方式產出？", options: ["相同的表達方式", "完全不同的心理學切入點", "不同的語言", "不同的字數"], correctIndex: 1, explanation: "武器二要求產出 10 個 Hook，每個必須用「完全不同的心理學切入點」：恐懼、好奇、反差、數字衝擊、身份認同、社會證明、稀缺性、懸念、共鳴、挑釁。" },
    { id: "ch9-q3", question: "武器三（短影音腳本結構化生成器）的輸出格式有幾種？", options: ["1 種（純文字）", "2 種（純文字分鏡 + 結構化表格）", "3 種", "4 種"], correctIndex: 1, explanation: "武器三輸出兩種格式：純文字分鏡（時間碼 | 畫面 | 台詞 | 音效）和結構化表格（秒數 | 鏡頭 | 畫面描述 | 台詞 | 字幕效果 | 音效 | 備註）。" },
    { id: "ch9-q4", question: "武器四（內容日曆主題發想矩陣）的內容配比是？", options: ["導購 50% / IP 50%", "導購 40% / IP 40% / 品牌信任 20%", "全部導購型", "知識 60% / 娛樂 40%"], correctIndex: 1, explanation: "武器四的內容配比：導購型 40% + IP型 40% + 品牌信任 20%。每週 3 支，一個月 12 支完整企劃。" },
    { id: "ch9-q5", question: "武器七（Manus 批量內容生成指令）可以一次產出多少支腳本變體？", options: ["3 支", "9 支", "27 支", "50 支"], correctIndex: 2, explanation: "武器七可以根據 3 個主題，各生成 9 支變體（不同心理切入點 × 不同表達風格 × 不同時長），共 27 支。" }
  ],
  ch10: [
    { id: "ch10-q1", question: "新人報到第一天必須完成的事項中，不包含以下哪一項？", options: ["註冊 ChatGPT Plus + Claude Pro", "開始接客戶專案", "設定 Monday.com 帳號", "加入 Slack 所有相關頻道"], correctIndex: 1, explanation: "第一天是「認識環境」，不是「開始工作」。必須完成：讀手冊、設定帳號、加入頻道、註冊 AI 工具。接客戶專案是第二週以後的事。" },
    { id: "ch10-q2", question: "企劃職位新人第一週的作業中，「拆解 10 支爆款短影音」應該用哪個 Prompt 武器？", options: ["武器一（廣告文案）", "武器二（Hook 發散）", "武器六（爆款拆解分析器）", "武器七（批量生成）"], correctIndex: 2, explanation: "武器六（爆款拆解分析器）專門用於系統化拆解爆款影片，提取可複製的成功元素。新人第一週就是要用這個武器拆 10 支。" },
    { id: "ch10-q3", question: "剪輯師新人第一週必須完成的練習作品，素材從哪裡來？", options: ["自己拍攝", "公司提供的素材", "網路下載", "客戶提供"], correctIndex: 1, explanation: "新人第一週的練習作品使用「公司提供的素材」，不需要自己拍攝。這確保新人專注在剪輯技術本身。" },
    { id: "ch10-q4", question: "新人第一週作業完成後，應該向誰提交獲得回饋？", options: ["CEO 涵勻", "COO 子權（企劃）/ 子權+阿韋（剪輯）", "同事互評", "自己檢查就好"], correctIndex: 1, explanation: "企劃新人向子權（COO）提交作業。剪輯新人向子權 + 阿韋提交作品。回饋是成長的關鍵。" },
    { id: "ch10-q5", question: "新人報到第一天必讀的手冊章節是？", options: ["參（飛輪系統）+ 肆（企劃教學）", "壹（底層邏輯）+ 貳（知識地圖）", "伍（短影音工作流）", "玖（AI Prompt）"], correctIndex: 1, explanation: "第一天必讀：壹（底層邏輯）+ 貳（知識地圖）。這兩章是所有後續學習的基礎，必須先懂公司運作邏輯。" }
  ],
  ch11: [
    { id: "ch11-q1", question: "私域轉化漏斗的第一層是什麼？核心指標是？", options: ["私域引流 / 引流率", "公域曝光 / 觸及率、完播率、Hook Rate", "信任建立 / 開信率", "轉換變現 / 轉換率"], correctIndex: 1, explanation: "第一層是「公域曝光」：短影音/Reels/Shorts 吸引目標受眾注意力。核心指標：觸及率、完播率、Hook Rate。" },
    { id: "ch11-q2", question: "引流率目標應該設定在多少以上？", options: ["> 1%", "> 3%", "> 10%", "> 20%"], correctIndex: 1, explanation: "引流率目標 > 3%。從公域到私域的轉化，3% 是及格線。低於這個數字代表 CTA 設計有問題。" },
    { id: "ch11-q3", question: "在台灣市場，哪個平台的引流率最高？", options: ["TikTok（1-3%）", "IG Reels（2-5%）", "LINE OA（5-15%）", "Facebook（2-4%）"], correctIndex: 2, explanation: "LINE OA 在台灣市場引流率最高（5-15%），因為台灣人習慣使用 LINE，「加好友送禮」的誘因效果極強。" },
    { id: "ch11-q4", question: "私域轉化的第三層「信任建立」的核心指標是？", options: ["粉絲數 > 10000", "開信率 > 30%、互動率 > 10%", "轉換率 > 5%", "分享率 > 20%"], correctIndex: 1, explanation: "第三層「信任建立」的核心指標：開信率 > 30%、互動率 > 10%。在私域持續提供價值才能建立信任。" },
    { id: "ch11-q5", question: "私域轉化的第五層「復購裂變」的目標復購率是多少？", options: ["> 10%", "> 30%", "> 50%", "> 80%"], correctIndex: 1, explanation: "第五層目標：復購率 > 30%、推薦率 > 10%。老客戶復購 + 推薦新客戶，形成自動增長飛輪。" }
  ],
  ch12: [
    { id: "ch12-q1", question: "TikTok 的演算法邏輯是什麼導向？", options: ["社交導向（粉絲優先）", "興趣導向（不看粉絲數）", "搜尋導向（關鍵字優先）", "時間導向（最新優先）"], correctIndex: 1, explanation: "TikTok = 興趣導向（不看粉絲數）。這意味著新帳號也能爆，只要內容夠好。" },
    { id: "ch12-q2", question: "YouTube Shorts 的 SEO 價值相比 TikTok 如何？", options: ["相同", "YouTube Shorts 高（搜尋長尾），TikTok 低（內容消失快）", "TikTok 更高", "兩者都沒有 SEO 價值"], correctIndex: 1, explanation: "YouTube Shorts SEO 價值高（搜尋長尾），TikTok SEO 價值低（內容消失快）。知識型內容優先放 Shorts。" },
    { id: "ch12-q3", question: "「一魚三吃」工作流中，TikTok 版本的最佳時長和節奏是？", options: ["60 秒、慢節奏", "15-30 秒、快節奏（每 1.2 秒切鏡）", "30-60 秒、中等節奏", "5-10 秒、極快節奏"], correctIndex: 1, explanation: "TikTok 版本：15-30 秒快節奏，前 1 秒直接進入衝突點，每 1.2 秒切一次鏡頭，結尾用反轉或懸念。" },
    { id: "ch12-q4", question: "IG Reels 的演算法是什麼導向？適合什麼風格？", options: ["興趣導向 / 真實粗糙", "社交導向（粉絲優先）/ 美感質感", "搜尋導向 / 知識型", "時間導向 / 即時性"], correctIndex: 1, explanation: "IG Reels = 社交導向（粉絲優先），適合美感質感、中等節奏。受眾年齡 22-38 歲為主。" },
    { id: "ch12-q5", question: "三大平台中，哪個平台的 Hook 風格應該是「問題/數據/教學」？", options: ["TikTok", "IG Reels", "YouTube Shorts", "Facebook"], correctIndex: 2, explanation: "YouTube Shorts 的 Hook 風格是「問題/數據/教學」，因為它是搜尋導向，受眾年齡 25-45 歲，偏好知識型內容。" }
  ],
  ch13: [
    { id: "ch13-q1", question: "AI 工具分工矩陣中，「腦力激盪 / 發散思考」最適合用哪個工具？", options: ["Claude", "ChatGPT", "Manus", "Midjourney"], correctIndex: 1, explanation: "ChatGPT 最擅長自由聯想、大量產出，適合腦力激盪和發散思考。效率提升 3-5 倍。" },
    { id: "ch13-q2", question: "三步驟 AI 工作流的正確順序是？", options: ["Manus → Claude → ChatGPT", "Claude → ChatGPT → Manus", "ChatGPT 發散 → Claude 收斂 → Manus 批量生成", "三者同時使用"], correctIndex: 2, explanation: "正確順序：ChatGPT 發散（20-50 個原始想法）→ Claude 收斂（篩選出 5 個精選方向）→ Manus 批量生成（15 支完整腳本）。" },
    { id: "ch13-q3", question: "AI 資安 SOP 中，哪些資料屬於「第二級：需處理」（可貼但需脫敏）？", options: ["客戶帳號密碼", "客戶名稱改為代號、金額改為範圍", "公開的市場資訊", "已發布的內容"], correctIndex: 1, explanation: "第二級（需處理）：客戶名稱改為代號（如『A 客戶』）、具體金額改為範圍（如『月費 3-5 萬』）、聯絡方式全部移除。" },
    { id: "ch13-q4", question: "AI 工具安全等級中，Manus 被分類為哪一級？", options: ["C 級（禁止使用）", "B 級（只能處理第三級資料）", "A 級（可處理第二級資料）", "特級（可處理所有資料）"], correctIndex: 2, explanation: "Manus = A 級（企業級加密），可處理第二級資料。ChatGPT、Claude = B 級，只能處理第三級資料。" },
    { id: "ch13-q5", question: "SEO 內容生產最適合用哪個工具組合？效率提升多少倍？", options: ["ChatGPT 單獨使用 / 3 倍", "Manus + Claude / 5-8 倍", "Midjourney + GPT / 2 倍", "Claude 單獨使用 / 4 倍"], correctIndex: 1, explanation: "SEO 內容最佳組合：Manus 研究 + Claude 撰寫，效率提升 5-8 倍。Manus 負責關鍵字研究和競品分析，Claude 負責高品質寫作。" }
  ],
  ch14: [
    { id: "ch14-q1", question: "2026 年演算法中，完播率的權重佔比是多少？", options: ["10%", "20%", "30%", "50%"], correctIndex: 2, explanation: "完播率權重 30%，是所有指標中最高的。它決定初始推送力度（前 500 人看到後的表現）。" },
    { id: "ch14-q2", question: "複看率的及格線和優秀線分別是多少？", options: ["> 5% / > 20%", "> 20% / > 50%", "> 30% / > 60%", "> 10% / > 30%"], correctIndex: 1, explanation: "複看率及格線 > 20%，優秀線 > 50%。複看率決定 72 小時後是否繼續推送，是長期流量的關鍵。" },
    { id: "ch14-q3", question: "2026 年演算法中，「互動品質」的判斷標準是什麼？", options: ["互動數量越多越好", "誰在互動比有多少人互動更重要", "只看按讚數", "只看留言數"], correctIndex: 1, explanation: "2026 年演算法看「誰在互動」比「有多少人互動」更重要。目標客群和意見領袖的互動 = 演算法加分；機器人和互讚群 = 演算法扣分。" },
    { id: "ch14-q4", question: "影片 0-2 秒的目標是什麼？失敗原因通常是？", options: ["建立期待 / 沒有懸念", "抓住注意力 / 開頭太慢、沒有衝突", "情感高潮 / 平鋪直敘", "複看設計 / 結尾太突然"], correctIndex: 1, explanation: "0-2 秒目標：抓住注意力。技巧：視覺衝擊/爭議問題/反直覺數據。失敗原因：開頭太慢、沒有衝突。" },
    { id: "ch14-q5", question: "以下哪種互動會被演算法扣分？", options: ["目標客群留言", "意見領袖互動", "互讚群互動（短時間大量相同帳號互動）", "真實用戶分享"], correctIndex: 2, explanation: "互讚群互動 = 演算法扣分。判斷標準：短時間大量相同帳號互動。絕對不參加互讚群，這會殺死帳號。" }
  ]
};

export function getChapterQuiz(chapterId: string): QuizQuestion[] {
  return chapterQuizzes[chapterId] ?? [];
}

export function toPublicQuestion(q: QuizQuestion): PublicQuizQuestion {
  return { id: q.id, question: q.question, options: q.options };
}
