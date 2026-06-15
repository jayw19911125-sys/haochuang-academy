export interface ChapterContent {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  color: string;
  audience: string;
  sections: Section[];
}

export interface Section {
  id: string;
  title: string;
  type: "text" | "table" | "prompt" | "steps" | "comparison" | "checklist" | "flipcard";
  content: string;
  tableData?: { headers: string[]; rows: string[][] };
  promptData?: { model: string; purpose: string; prompt: string; example?: string };
  steps?: { title: string; description: string; ai?: string }[];
  flipCards?: { front: string; back: string }[];
  checklistItems?: string[];
}

export const chapters: ChapterContent[] = [
  {
    id: "ch1",
    title: "壹、好創營運底層邏輯",
    subtitle: "在學任何技術之前，先理解公司怎麼運作",
    icon: "Layers",
    color: "#F37021",
    audience: "全員必讀",
    sections: [
      {
        id: "ch1-s1",
        title: "三大鐵則",
        type: "flipcard",
        content: "",
        flipCards: [
          {
            front: "鐵則一：產能防禦機制",
            back: "所有排程、產出量、定價推演，強制以「涵勻 + 子權 + 阿韋」3 人承載力為計算底層。嚴禁假設 4-6 人編制。任何超出 3 人產能的方案，必須先確認外包資源才能執行。"
          },
          {
            front: "鐵則二：先收錢才開工",
            back: "網站專案：50% 訂金開工，驗收無誤收 50% 尾款。社群類專案：執行前收當月全款。混合專案：按項目拆分收款。沒有例外。"
          },
          {
            front: "鐵則三：工具棧鎖定",
            back: "Monday.com = 唯一數據資料庫（CRM/專案/SOP）。Slack = 唯一溝通與自動通知節點。所有流程交接、AI 工作流、SOP 輸出，預設這兩個工具。"
          }
        ]
      },
      {
        id: "ch1-s2",
        title: "組織架構",
        type: "table",
        content: "好創是一個 3 人核心團隊，每個人的邊界非常清楚：",
        tableData: {
          headers: ["角色", "姓名", "職責範圍", "不做什麼"],
          rows: [
            ["CEO", "涵勻", "最高決策、頂級客戶維繫", "不干預執行細節"],
            ["COO", "子權 / Dennis", "營運總控、策略裁奪、AI 導入", "不做剪輯"],
            ["正職剪輯", "阿韋", "內部核心剪輯執行", "不做企劃決策"],
            ["外部 SEO/投手", "瓦吉", "SEO 與廣告投放", "非編制內"],
            ["外部 KOL/公關", "起吉", "KOL 與公關合作", "非編制內"]
          ]
        }
      },
      {
        id: "ch1-s3",
        title: "核心服務一覽",
        type: "table",
        content: "好創的服務是整合式的，不接單點案件：",
        tableData: {
          headers: ["服務項目", "定位", "交付物", "AI 加持後的效率"],
          rows: [
            ["社群行銷", "主力服務", "內容日曆 + 貼文 + Reels", "效率提升 200%"],
            ["短影音", "核心武器", "導購型/IP型/廣告投放型", "腳本生成 → 15 分鐘"],
            ["網站架設", "基礎建設", "WordPress / 客製化網站", "AI 輔助設計"],
            ["SEO/AIO/GEO", "長期佈局", "關鍵字排名 + AI 搜尋優化", "文章產出 3 天→2 小時"],
            ["廣告投放", "付費加速", "Meta / Google Ads", "文案迭代 30+ 版/次"],
            ["商業攝影", "素材生產", "產品攝影 + 形象照", "—"],
            ["品牌視覺", "識別系統", "Logo + VI + 品牌規範", "—"]
          ]
        }
      }
    ]
  },
  {
    id: "ch2",
    title: "貳、0-100 知識全局地圖",
    subtitle: "從完全不懂到獨當一面的四個階段",
    icon: "Target",
    color: "#FF8C42",
    audience: "全員必讀",
    sections: [
      {
        id: "ch2-s1",
        title: "四個學習階段",
        type: "steps",
        content: "每個階段都有明確的能力指標與作業要求：",
        steps: [
          {
            title: "Level 1：認知期（0-25）",
            description: "理解社群行銷的底層邏輯、演算法運作原理、好創的商業模式。能回答「為什麼要這樣做」。",
            ai: "用 ChatGPT 整理學習筆記，用 Claude 驗證理解是否正確"
          },
          {
            title: "Level 2：模仿期（25-50）",
            description: "能拆解爆款內容、套用框架產出初稿、使用 AI 工具輔助。能獨立完成「有模板可循」的任務。",
            ai: "用 AI 批量拆解爆款、用 Prompt 生成初稿、用 Manus 自動化重複工作"
          },
          {
            title: "Level 3：獨立期（50-75）",
            description: "能獨立完成客戶的月度社群規劃、短影音企劃、廣告文案。不需要子權逐一審核。",
            ai: "用 AI 做競品分析、用 Manus 產出月報、用 AI 做 A/B 測試文案"
          },
          {
            title: "Level 4：創造期（75-100）",
            description: "能提出新的內容策略、發現市場機會、帶領外包團隊。能回答「接下來應該做什麼」。",
            ai: "用 AI 做市場趨勢分析、用 Manus 建立自動化工作流、用 AI 訓練新人"
          }
        ]
      },
      {
        id: "ch2-s2",
        title: "2026 演算法權重表",
        type: "table",
        content: "理解演算法是所有社群工作的基礎。以下是 2026 年各平台的核心指標：",
        tableData: {
          headers: ["平台", "最重要指標", "及格線", "好創目標", "權重"],
          rows: [
            ["IG Reels", "完播率", "≥ 40%", "≥ 55%", "35%"],
            ["IG Reels", "Hook Rate（前3秒）", "≥ 25%", "≥ 40%", "25%"],
            ["IG Reels", "分享率", "≥ 2%", "≥ 5%", "20%"],
            ["IG Reels", "留言率", "≥ 1%", "≥ 3%", "10%"],
            ["IG Reels", "儲存率", "≥ 3%", "≥ 6%", "10%"],
            ["TikTok", "完播率", "≥ 50%", "≥ 65%", "40%"],
            ["TikTok", "重播率", "≥ 10%", "≥ 20%", "20%"],
            ["Meta Ads", "Hook Rate", "≥ 25%", "≥ 35%", "—"],
            ["Meta Ads", "ROAS", "≥ 2.0", "≥ 3.5", "—"],
            ["Meta Ads", "CTR", "≥ 1.5%", "≥ 3%", "—"]
          ]
        }
      }
    ]
  },
  {
    id: "ch3",
    title: "參、社群行銷閉環飛輪",
    subtitle: "7 步驟形成永不停止的增長引擎",
    icon: "Rocket",
    color: "#F37021",
    audience: "企劃為主",
    sections: [
      {
        id: "ch3-s1",
        title: "飛輪 7 步驟",
        type: "steps",
        content: "社群行銷不是「發完就結束」，而是一個閉環系統。每一步的產出都是下一步的燃料：",
        steps: [
          { title: "步驟 1：受眾研究", description: "用 AI 分析目標受眾的痛點、語言、行為模式。產出受眾人物誌。", ai: "Manus 自動掃描 Reddit/PTT/Dcard 提取真實痛點語言" },
          { title: "步驟 2：內容策略", description: "根據受眾痛點，規劃 TOFU/MOFU/BOFU 三層內容漏斗。", ai: "Claude 生成內容矩陣，按漏斗階段分配主題" },
          { title: "步驟 3：內容生產", description: "用 AI 生成初稿 → 人工審核調整 → 拍攝/剪輯 → 發布。", ai: "Manus 批量生成腳本 + 文案，人工只做最終判斷" },
          { title: "步驟 4：發布排程", description: "按最佳時段發布，多平台同步。", ai: "Manus 根據歷史數據推薦最佳發布時間" },
          { title: "步驟 5：社群互動", description: "回覆留言、私訊互動、社群經營。建立真實連結。", ai: "AI 生成回覆建議，人工決定是否使用" },
          { title: "步驟 6：數據分析", description: "追蹤核心指標，找出 Top/Bottom 表現內容。", ai: "Manus 自動抓取 Meta 數據，產出視覺化月報" },
          { title: "步驟 7：優化迭代", description: "根據數據調整策略，回到步驟 1。飛輪越轉越快。", ai: "AI 分析趨勢，提出下月優化方向" }
        ]
      },
      {
        id: "ch3-s2",
        title: "內容配比公式",
        type: "table",
        content: "好創的標準內容配比，確保既有流量又有轉換：",
        tableData: {
          headers: ["內容類型", "佔比", "目的", "範例"],
          rows: [
            ["TOFU（漏斗頂部）", "40%", "吸引新受眾、增加觸及", "趨勢話題、教學、迷因"],
            ["MOFU（漏斗中部）", "35%", "建立信任、展示專業", "案例分享、幕後花絮、Q&A"],
            ["BOFU（漏斗底部）", "25%", "促進轉換、導購", "產品展示、限時優惠、見證"]
          ]
        }
      }
    ]
  },
  {
    id: "ch4",
    title: "肆、短影音企劃工作流",
    subtitle: "導購型 / IP型 / 廣告投放型的完整 SOP",
    icon: "Film",
    color: "#FF8C42",
    audience: "企劃 + 剪輯",
    sections: [
      {
        id: "ch4-s1",
        title: "三種短影音類型對比",
        type: "table",
        content: "好創的短影音分為三種類型，各有不同的策略與執行方式：",
        tableData: {
          headers: ["維度", "導購型", "IP 型", "廣告投放型"],
          rows: [
            ["目的", "直接轉換（購買/預約）", "建立人設、累積粉絲", "付費觸及、快速測試"],
            ["時長", "15-30 秒", "30-60 秒", "15-30 秒"],
            ["節奏", "快（1.2 秒/鏡頭）", "中（2.5 秒/鏡頭）", "極快（1 秒/鏡頭）"],
            ["Hook 風格", "痛點直擊 / 數字衝擊", "故事開場 / 懸念", "視覺衝擊 / 反差"],
            ["CTA", "明確行動指令", "追蹤/互動引導", "點擊連結/立即購買"],
            ["KPI", "轉換率 ≥ 2%", "追蹤增長 ≥ 5%/月", "ROAS ≥ 2.5"],
            ["AI 輔助", "F01 文案生成器", "Hook 發散引擎", "A/B 素材迭代"]
          ]
        }
      },
      {
        id: "ch4-s2",
        title: "腳本結構：Hook → Body → CTA",
        type: "text",
        content: "所有短影音都遵循 Hook-Body-CTA 三段式結構。這不是建議，是鐵則。\n\n**Hook（前 3 秒）：** 決定生死。觀眾在 0.5 秒內決定要不要繼續看。必須產生「認知衝突」或「情緒觸發」。\n\n**Body（中段）：** 兌現 Hook 的承諾。用最少的時間傳遞最核心的價值。每 3-5 秒必須有一個「資訊節點」防止觀眾離開。\n\n**CTA（最後 3 秒）：** 告訴觀眾「現在該做什麼」。導購型要明確（「點擊下方連結」），IP 型要柔性（「追蹤看更多」）。"
      },
      {
        id: "ch4-s3",
        title: "企劃 8 步標準流程",
        type: "steps",
        content: "",
        steps: [
          { title: "1. 接收需求", description: "確認客戶本月主推、目標受眾、預算、KPI", ai: "Manus 自動整理客戶 Brief" },
          { title: "2. 競品拆解", description: "找 5 支同產業爆款，拆解 Hook/節奏/CTA", ai: "Manus 批量拆解 + 產出分析報告" },
          { title: "3. 主題發想", description: "根據受眾痛點 × 產品賣點，交叉產出主題", ai: "Claude 用矩陣法一次產出 12 個主題" },
          { title: "4. 腳本撰寫", description: "用 Hook-Body-CTA 結構寫出完整分鏡表", ai: "Claude 產出雙格式（純文字 + 結構化表格）" },
          { title: "5. 內部審核", description: "子權確認商業邏輯、阿韋確認可執行性", ai: "—" },
          { title: "6. 拍攝執行", description: "按分鏡表拍攝，確保素材完整", ai: "Manus 產出拍攝 Checklist" },
          { title: "7. 剪輯交付", description: "阿韋按施工藍圖剪輯，多平台輸出", ai: "Manus 產出剪輯施工藍圖" },
          { title: "8. 數據追蹤", description: "發布後 48 小時追蹤核心指標", ai: "Manus 自動抓取數據 + 產出快報" }
        ]
      }
    ]
  },
  {
    id: "ch5",
    title: "伍、剪輯師完整教學",
    subtitle: "從素材接收到多平台輸出的標準 SOP",
    icon: "Film",
    color: "#F37021",
    audience: "剪輯師",
    sections: [
      {
        id: "ch5-s1",
        title: "剪輯師的核心價值",
        type: "text",
        content: "你不是「按照指令剪片的工具人」。你的核心價值是：\n\n1. **把企劃的商業意圖，轉化為觀眾願意看完的視覺體驗**\n2. **用節奏控制觀眾的注意力，讓 Hook Rate 和完播率達標**\n3. **善用 AI 工具消滅重複性勞動，把時間留給創意判斷**"
      },
      {
        id: "ch5-s2",
        title: "工具棧",
        type: "table",
        content: "",
        tableData: {
          headers: ["工具", "定位", "使用佔比", "AI 功能"],
          rows: [
            ["剪映 PRO（CapCut）", "主力剪輯", "90%", "自動字幕、AI 去背、智能剪切、文字轉語音"],
            ["Premiere Pro v26", "品牌形象影片", "5-10%", "Object Mask、Generative Extend、Enhanced Speech"],
            ["DaVinci Resolve 20", "精密調色", "5%", "Magic Mask、IntelliScript、UltraNR 降噪"],
            ["Canva Pro", "封面/圖卡", "—", "AI 生成、智能調整尺寸"],
            ["Manus", "自動化助手", "—", "批量字幕校對、素材配對、腳本解析"]
          ]
        }
      },
      {
        id: "ch5-s3",
        title: "剪輯 8 步 SOP",
        type: "steps",
        content: "",
        steps: [
          { title: "1. 接收素材", description: "在 Monday.com 確認任務 → 下載素材 → 閱讀腳本確認商業意圖", ai: "Manus 自動解析腳本，產出「素材對照清單」" },
          { title: "2. 素材整理", description: "按腳本分鏡順序分類標記", ai: "CapCut 智能場景識別，30 分鐘 → 10 分鐘" },
          { title: "3. 粗剪", description: "前 3 秒決定生死。節奏 > 完美。按 Hook-Body-CTA 排列。", ai: "人工判斷為主，這是剪輯師最核心的價值" },
          { title: "4. 字幕生成", description: "AI 自動字幕 → 人工校對（台灣用語、專有名詞、斷句）→ 套用品牌模板", ai: "CapCut AI 準確率 95%，人工校對至 99%" },
          { title: "5. 音樂/音效", description: "導購型 120-140 BPM / IP 型 80-100 BPM / 廣告型開頭衝擊音效", ai: "CapCut 智能推薦 + 自動卡點 + 音量智能調節" },
          { title: "6. 特效/轉場", description: "同場景硬切、場景切換快速縮放、重點強調定格+放大", ai: "品牌色應用：字幕底色=品牌主色" },
          { title: "7. 精剪/調色", description: "確認時長、衝擊力、字幕正確、BGM 音量、CTA 清楚", ai: "CapCut 一鍵濾鏡 / DaVinci AI 調色" },
          { title: "8. 輸出/交付", description: "9:16（1080×1920）+ 1:1（1080×1080）+ 16:9（如需）→ 上傳 Drive → Monday 更新 → Slack 通知", ai: "CapCut 一次輸出三種尺寸" }
        ]
      },
      {
        id: "ch5-s4",
        title: "節奏感訓練方法",
        type: "checklist",
        content: "每天練習以下項目，2 週內建立節奏直覺：",
        checklistItems: [
          "每天拆解 3 支爆款短影音（記錄每個鏡頭的秒數）",
          "觀察切鏡頻率：導購型 1.2 秒/鏡頭，IP 型 2.5 秒/鏡頭",
          "用 BGM 的節拍點作為切鏡依據",
          "練習「無聲剪輯」：只看畫面節奏，不聽聲音",
          "對比自己的作品與爆款的「資訊密度」差異"
        ]
      }
    ]
  },
  {
    id: "ch6",
    title: "陸、Manus 自動化工作流",
    subtitle: "降本增效的秘密武器 + 新服務變現",
    icon: "Zap",
    color: "#FF8C42",
    audience: "全員必讀",
    sections: [
      {
        id: "ch6-s1",
        title: "Manus 效率對比",
        type: "table",
        content: "Manus 不只是「問問題的 AI」，它是能執行多步驟任務的自動化代理：",
        tableData: {
          headers: ["應用場景", "傳統做法", "Manus 自動化", "效率提升"],
          rows: [
            ["月度內容日曆", "企劃 4 小時手動規劃", "分析產業+競品+節日，一次產出整月", "4h → 15min"],
            ["競品分析報告", "手動截圖+整理+分析", "自動掃描競品社群，產出結構化報告", "1天 → 30min"],
            ["短影音腳本批量", "企劃逐一撰寫", "用好創 Prompt 一次生成 27 支變體", "3天 → 2h"],
            ["客戶月報", "手動抓數據+做圖表", "自動抓取 Meta 數據，產出視覺化報告", "半天 → 20min"],
            ["廣告文案 A/B", "手動寫 5-10 版", "批量生成 30+ 版文案", "2h → 10min"],
            ["SEO 文章", "研究+撰寫 3-5 天", "深度研究+產出 3000 字文章", "3天 → 2h"],
            ["新人教學手冊", "手動整理 1-2 週", "掃描知識庫+網路研究+產出完整手冊", "2週 → 4h"]
          ]
        }
      },
      {
        id: "ch6-s2",
        title: "新服務產品（利益最大化）",
        type: "comparison",
        content: "Manus 讓好創能在不增加人力的情況下，提供過去需要 5-6 人才能做到的服務深度：",
        tableData: {
          headers: ["新服務", "內容", "報價空間", "成本", "毛利率"],
          rows: [
            ["AI 內容矩陣月費（基礎）", "月產 27 支短影音", "25,000/月", "人力 8h/月", "75%+"],
            ["AI 內容矩陣月費（旗艦）", "27支+月報+廣告優化+SEO", "65,000/月", "人力 20h/月", "70%+"],
            ["AI 社群健檢報告", "完整帳號分析+30天建議", "5,000-8,000（一次性）", "Manus 30min + 人工 30min", "90%+"],
            ["AI 廣告素材工廠", "每月 30+ 組廣告素材", "加購 8,000/月", "Manus + 人工篩選 2h/月", "85%+"]
          ]
        }
      }
    ]
  },
  {
    id: "ch7",
    title: "柒、AI Prompt 兵器庫",
    subtitle: "8 大武器，複製貼上即可使用",
    icon: "Brain",
    color: "#F37021",
    audience: "全員必讀",
    sections: [
      {
        id: "ch7-s1",
        title: "武器一：Meta 廣告文案生成器（F01）",
        type: "prompt",
        content: "",
        promptData: {
          model: "Claude 3.5 Sonnet",
          purpose: "快速產出高 CTR 的導購文案初稿",
          prompt: `【角色】你是一位頂尖的 Meta 廣告文案師，擅長用最少的字數達到最高的 CTR。你深知 Meta 廣告的前 3 行決定生死。
【上下文】
- 產品/服務：[填入]
- 目標受眾的痛點：[填入]
- 痛點導致的後果：[填入]
- 我們的解法：[填入]
- CTA 目標：[填入]
【格式要求】
- 產出 5 個版本
- 每版結構：Hook（1句）→ 痛點放大（2句）→ 解法（1句）→ CTA（1句）
- 總字數不超過 150 字
- 使用台灣繁體中文，口語化但不低俗`,
          example: "客戶：天晴藝術諮商室，痛點：「情緒壓力大但不知道找誰聊」"
        }
      },
      {
        id: "ch7-s2",
        title: "武器二：短影音 Hook 發散引擎",
        type: "prompt",
        content: "",
        promptData: {
          model: "GPT-4o",
          purpose: "一次生成 10+ 個完全不同心理切入點的 Hook",
          prompt: `【角色】你是短影音 Hook 專家，擅長從不同心理學角度切入同一個主題。
【主題】[填入這支影片要講什麼]
【目標受眾】[填入]
【影片類型】[導購型/IP型/廣告投放型]
【要求】
1. 產出 10 個 Hook，每個必須用「完全不同的心理切入點」
2. 切入點類型包含但不限於：恐懼、好奇、反差、數字衝擊、身份認同、社會證明、稀缺性、懸念、共鳴、挑釁
3. 每個 Hook 標註：使用的心理學原理、預估 Hook Rate、拍攝難度（1-5）
4. 所有 Hook 必須在 3 秒內說完
5. 使用台灣網感語氣`,
          example: "客戶：床研所，主題：「為什麼你的床墊讓你越睡越累」"
        }
      },
      {
        id: "ch7-s3",
        title: "武器三：短影音腳本結構化生成器",
        type: "prompt",
        content: "",
        promptData: {
          model: "Claude 3.5 Sonnet",
          purpose: "輸出阿韋能直接用的雙格式分鏡表",
          prompt: `【角色】你是好創整合行銷的資深企劃，負責產出剪輯師能直接執行的腳本。
【影片資訊】
- 類型：[導購型/IP型/廣告投放型]
- 時長：[15/30/60 秒]
- 主題：[填入]
- 產品/服務：[填入]
- 目標 KPI：[填入]
【輸出格式 1：純文字分鏡】
逐秒描述：時間碼 | 畫面 | 台詞/字幕 | 音效/配樂
【輸出格式 2：結構化表格】
| 秒數 | 鏡頭 | 畫面描述 | 台詞 | 字幕效果 | 音效 | 備註 |
【要求】
- Hook 必須在前 3 秒完成
- 每 3-5 秒必須有一個資訊節點
- 標註哪些字幕需要放大/加特效
- 標註 BGM 建議（BPM + 風格）`,
          example: "客戶：床研所，類型：導購型，時長：30秒，主題：「記憶棉床墊的 3 個選購陷阱」"
        }
      },
      {
        id: "ch7-s4",
        title: "武器四：內容日曆主題發想矩陣",
        type: "prompt",
        content: "",
        promptData: {
          model: "GPT-4o / Claude 皆可",
          purpose: "一次產出一個月 12 篇貼文主題",
          prompt: `【角色】你是好創整合行銷的資深企劃。請為以下客戶規劃下個月的短影音內容日曆。
【客戶資訊】
- 品牌：[客戶名稱]
- 產業：[產業類型]
- 目標受眾：[受眾描述]
- 本月主推：[主推產品/服務]
【要求】
1. 產出 12 支短影音的完整企劃（每週 3 支）
2. 配比：導購型 40% / IP型 40% / 品牌信任 20%
3. 每支包含：主題、Hook（3 個版本）、Body 大綱、CTA、預估時長
4. 參考當月台灣社群趨勢與節日
5. 所有 Hook 必須使用台灣網感語氣
【輸出格式】
Markdown 表格：日期 | 類型 | 主題 | Hook 1/2/3 | Body 摘要 | CTA | 時長`,
          example: "任何客戶皆適用"
        }
      },
      {
        id: "ch7-s5",
        title: "武器五：剪輯施工藍圖生成器",
        type: "prompt",
        content: "",
        promptData: {
          model: "Claude 3.5 Sonnet",
          purpose: "讓剪輯師拿到腳本後，立即有完整的執行藍圖",
          prompt: `請解析以下短影音腳本，產出「剪輯施工藍圖」：

[貼上腳本]

【輸出要求】
1. 逐秒時間軸對照表（秒數 | 畫面描述 | 字幕內容 | 音效/配樂指示）
2. 素材需求清單（需要哪些鏡頭、哪些角度）
3. 字幕樣式建議（哪些字要放大、哪些要加特效）
4. 節奏建議（BPM 建議、切鏡頻率）
5. 預估剪輯時間
6. 品牌色應用位置（哪裡用品牌主色、哪裡用輔色）`,
          example: "剪輯師專用，搭配武器三的輸出使用"
        }
      },
      {
        id: "ch7-s6",
        title: "武器六：爆款拆解分析器",
        type: "prompt",
        content: "",
        promptData: {
          model: "GPT-4o",
          purpose: "系統化拆解爆款影片，提取可複製的元素",
          prompt: `【角色】你是短影音數據分析師，擅長從爆款影片中提取可複製的成功元素。
【影片資訊】
- 影片連結或描述：[填入]
- 觀看數：[填入]
- 互動數據（如有）：[填入]
【分析維度】
1. Hook 分析：前 3 秒用了什麼技巧？為什麼有效？
2. 節奏分析：平均鏡頭長度？切鏡頻率？
3. 字幕設計：字體、大小、位置、特效
4. 音樂/音效：BPM、風格、音效時機
5. CTA 設計：放在哪裡？用什麼方式？
6. 可複製元素：哪些元素可以直接套用到好創的客戶？
7. 好創應用建議：具體怎麼用在哪個客戶身上？`,
          example: "每天拆解 3 支爆款時使用"
        }
      },
      {
        id: "ch7-s7",
        title: "武器七：Manus 批量內容生成指令",
        type: "prompt",
        content: "",
        promptData: {
          model: "Manus（Claude 底層）",
          purpose: "一次性產出大量內容變體",
          prompt: `請為 [客戶名稱] 批量生成以下內容：

【任務】
1. 根據以下 3 個主題，各生成 9 支短影音腳本變體（共 27 支）
2. 每支腳本包含：Hook（3版）、Body、CTA
3. 變體維度：不同心理切入點 × 不同表達風格 × 不同時長

【主題】
1. [主題 A]
2. [主題 B]  
3. [主題 C]

【客戶背景】
- 品牌：[填入]
- 受眾：[填入]
- 語氣：[填入]

【輸出格式】
結構化 Markdown，每支腳本獨立區塊，含元數據標籤（類型/時長/切入點/難度）`,
          example: "月初一次性產出整月內容矩陣"
        }
      },
      {
        id: "ch7-s8",
        title: "武器八：數據分析與優化建議",
        type: "prompt",
        content: "",
        promptData: {
          model: "Manus（Claude 底層）",
          purpose: "自動分析社群數據，產出可執行的優化建議",
          prompt: `請分析 [客戶名稱] 本月的社群表現數據：

【數據】（透過 Meta Marketing MCP 抓取，或手動貼入）
- 本月發布內容數量：[填入]
- 平均觸及：[填入]
- 平均互動率：[填入]
- 最佳表現 Top 3：[填入]
- 最差表現 Bottom 3：[填入]

【分析要求】
1. Top 3 成功原因分析（從 Hook/主題/時段/格式 四個維度）
2. Bottom 3 失敗原因分析（同上四維度）
3. 下月優化方向（具體到「做什麼」而非「應該怎樣」）
4. 內容配比調整建議
5. 發布時段優化建議
6. 競品動態摘要（如有數據）

【輸出格式】
- 視覺化表格 + 文字分析
- 語氣：專業但易懂（客戶是老闆，不是行銷人）`,
          example: "每月底產出客戶月報時使用"
        }
      }
    ]
  },
  {
    id: "ch8",
    title: "捌、Meta 廣告投放基礎",
    subtitle: "企劃必須理解的投放邏輯與指標",
    icon: "BarChart3",
    color: "#FF8C42",
    audience: "企劃為主",
    sections: [
      {
        id: "ch8-s1",
        title: "核心指標及格線",
        type: "table",
        content: "企劃不需要親自操作投放，但必須理解這些指標，才能產出「投手能用」的素材：",
        tableData: {
          headers: ["指標", "定義", "及格線", "好創目標", "低於及格線怎麼辦"],
          rows: [
            ["Hook Rate", "前 3 秒觀看率", "≥ 25%", "≥ 35%", "換 Hook，不是換整支影片"],
            ["完播率", "看完整支的比例", "≥ 40%", "≥ 55%", "檢查中段是否有「斷崖」"],
            ["CTR", "點擊率", "≥ 1.5%", "≥ 3%", "檢查 CTA 是否夠明確"],
            ["ROAS", "廣告投資報酬率", "≥ 2.0", "≥ 3.5", "檢查受眾是否精準"],
            ["CPM", "每千次曝光成本", "≤ $300", "≤ $200", "檢查素材品質分數"],
            ["頻率", "同一人看到幾次", "≤ 3", "≤ 2.5", "素材疲勞，需要新素材"]
          ]
        }
      },
      {
        id: "ch8-s2",
        title: "廣告疲勞偵測",
        type: "text",
        content: "**疲勞信號：** 當一組廣告的 CTR 連續 3 天下降 > 20%，或頻率超過 3，代表素材已經疲勞。\n\n**好創的應對 SOP：**\n1. 用「武器四」的 Manus Prompt，批量生成 10 組新 Hook\n2. 保留原始 Body 和 CTA，只換前 3 秒\n3. 用 ABO（Ad Set Budget Optimization）結構測試\n4. 48 小時後看數據，保留 Hook Rate ≥ 25% 的版本\n\n**關鍵認知：** 廣告投放不是「設定好就不管」，而是「持續餵新素材」。企劃的價值就是持續產出高品質素材。"
      }
    ]
  },
  {
    id: "ch9",
    title: "玖、報到清單與第一週任務",
    subtitle: "新人入職後的具體行動步驟",
    icon: "Users",
    color: "#F37021",
    audience: "新人",
    sections: [
      {
        id: "ch9-s1",
        title: "第一天",
        type: "checklist",
        content: "",
        checklistItems: [
          "閱讀本手冊壹（底層邏輯）+ 貳（知識地圖）",
          "設定 Monday.com 帳號，熟悉看板結構",
          "加入 Slack 所有相關頻道",
          "設定 Google Drive 存取權限",
          "註冊 ChatGPT Plus + Claude Pro（公司帳號）"
        ]
      },
      {
        id: "ch9-s2",
        title: "第一週（企劃）",
        type: "checklist",
        content: "",
        checklistItems: [
          "完成本手冊參（飛輪系統）+ 肆（短影音工作流）閱讀",
          "拆解 10 支爆款短影音（用武器六的 Prompt）",
          "用武器二產出 10 個 Hook（任選一個主題）",
          "用武器三產出 1 份完整腳本",
          "向子權提交以上作業，獲得回饋"
        ]
      },
      {
        id: "ch9-s3",
        title: "第一週（剪輯師）",
        type: "checklist",
        content: "",
        checklistItems: [
          "完成本手冊伍（剪輯師教學）完整閱讀",
          "熟悉 CapCut AI 功能（自動字幕、去背、卡點）",
          "用武器五產出 1 份剪輯施工藍圖",
          "完成 1 支練習短影音（用公司提供的素材）",
          "向子權/阿韋提交作品，獲得回饋"
        ]
      }
    ]
  }
];
