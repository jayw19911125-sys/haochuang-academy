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
  type: "text" | "table" | "prompt" | "steps" | "comparison" | "checklist" | "flipcard" | "glossary" | "image";
  content: string;
  tableData?: { headers: string[]; rows: string[][] };
  promptData?: { model: string; purpose: string; prompt: string; example?: string };
  steps?: { title: string; description: string; ai?: string }[];
  flipCards?: { front: string; back: string }[];
  checklistItems?: string[];
  glossary?: { term: string; definition: string; example?: string }[];
  imageData?: { url: string; alt: string; caption?: string; width?: string; height?: string };
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
            back: "所有排程、產出量、定價推演，強制以「涵勻 + 子權 + 阿韋」3 人承載力為計算底層。嚴禁假設 4-6 人編制。任何超出 3 人產能的方案，必須先確認外包資源才能執行。\n\n【具體例子】\n- 月接 5 個「標準方案」客戶 = 月產 60 支短影音 = 超出 3 人產能 → 必須拒絕或外包\n- 月接 3 個「標準方案」客戶 = 月產 36 支短影音 = 在承載範圍內 → 可接"
          },
          {
            front: "鐵則二：先收錢才開工",
            back: "網站專案：50% 訂金開工，驗收無誤收 50% 尾款。社群類專案：執行前收當月全款。混合專案：按項目拆分收款。沒有例外。\n\n【具體例子】\n- 客戶簽約 NT$38,000 月費方案 → 發票當月 → 收款確認 → 才開始企劃\n- 網站專案報價 NT$100,000 → 簽約後收 NT$50,000 → 開工 → 驗收後收 NT$50,000"
          },
          {
            front: "鐵則三：工具棧鎖定",
            back: "Monday.com = 唯一數據資料庫（CRM/專案/SOP）。Slack = 唯一溝通與自動通知節點。所有流程交接、AI 工作流、SOP 輸出，預設這兩個工具。\n\n【具體例子】\n- 客戶資訊 → Monday.com 客戶卡\n- 專案進度 → Monday.com 專案看板\n- 日常溝通 → Slack 頻道\n- 自動通知 → Slack bot（不用 Email）"
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
        id: "ch2-s0",
        title: "核心知識點全景圖",
        type: "image",
        content: "好創新人教學系統的完整知識架構，涵蓋企劃、剪輯、AI 自動化、Manus 工作流的所有核心知識點。",
        imageData: {
          url: "https://d2xsxph8kpxj0f.cloudfront.net/310519663065041882/AXapHhDJFofYFuSSWpHADU/mindmap_core_knowledge-PQozBDHAy7wuXLsWzk3Ssh.webp",
          alt: "好創核心知識點心智圖",
          caption: "5 大知識維度 × 4 個 Level × 完整的企業級新人教學系統"
        }
      },
      {
        id: "ch2-s1",
        title: "四個學習階段",
        type: "steps",
        content: "每個階段都有明確的能力指標與作業要求：",
        steps: [
          {
            title: "Level 1：認知期（0-25）",
            description: "理解社群行銷的底層邏輯、演算法運作原理、好創的商業模式。能回答「為什麼要這樣做」。\n\n【具體判定】\n- 能解釋「為什麼 Hook Rate 比完播率更重要」\n- 能說出 IG Reels 的 4 個核心權重\n- 能區分「導購型」vs「IP型」短影音的差異",
            ai: "用 ChatGPT 整理學習筆記，用 Claude 驗證理解是否正確"
          },
          {
            title: "Level 2：模仿期（25-50）",
            description: "能拆解爆款內容、套用框架產出初稿、使用 AI 工具輔助。能獨立完成「有模板可循」的任務。\n\n【具體判定】\n- 能用武器六拆解 5 支爆款，找出成功因素\n- 能用武器二產出 10 個不同 Hook\n- 能用武器三產出完整腳本（企劃審核後可用）",
            ai: "用 AI 批量拆解爆款、用 Prompt 生成初稿、用 Manus 自動化重複工作"
          },
          {
            title: "Level 3：獨立期（50-75）",
            description: "能獨立完成客戶的月度社群規劃、短影音企劃、廣告文案。不需要子權逐一審核。\n\n【具體判定】\n- 能獨立管理 1 個客戶的完整月度內容日曆\n- 能產出 12 支短影音腳本且 80% 通過率\n- 能提出「為什麼這個主題會爆」的理由",
            ai: "用 AI 做競品分析、用 Manus 產出月報、用 AI 做 A/B 測試文案"
          },
          {
            title: "Level 4：創造期（75-100）",
            description: "能提出新的內容策略、發現市場機會、帶領外包團隊。能回答「接下來應該做什麼」。\n\n【具體判定】\n- 能獨立管理 3+ 個客戶的策略與執行\n- 能預測下月社群趨勢並規劃內容\n- 能帶領新人從 L1 進階到 L2",
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
            ["IG Reels", "完播率（Completion Rate）", "≥ 40%", "≥ 55%", "35%"],
            ["IG Reels", "Hook Rate（前3秒）", "≥ 25%", "≥ 40%", "25%"],
            ["IG Reels", "分享率（Share Rate）", "≥ 2%", "≥ 5%", "20%"],
            ["IG Reels", "留言率（Comment Rate）", "≥ 1%", "≥ 3%", "10%"],
            ["IG Reels", "儲存率（Save Rate）", "≥ 3%", "≥ 6%", "10%"],
            ["TikTok", "完播率", "≥ 50%", "≥ 65%", "40%"],
            ["TikTok", "重播率（Replay Rate）", "≥ 10%", "≥ 20%", "20%"],
            ["Meta Ads", "Hook Rate", "≥ 25%", "≥ 35%", "—"],
            ["Meta Ads", "ROAS（投資報酬率）", "≥ 2.0", "≥ 3.5", "—"],
            ["Meta Ads", "CTR（點擊率）", "≥ 1.5%", "≥ 3%", "—"]
          ]
        }
      },
      {
        id: "ch2-s3",
        title: "術語速查表",
        type: "glossary",
        content: "",
        glossary: [
          {
            term: "Hook Rate（鉤子率）",
            definition: "影片前 3 秒的完播率。決定觀眾是否繼續看。",
            example: "一支影片有 1000 次觀看，其中 300 人看完前 3 秒 = Hook Rate 30%"
          },
          {
            term: "Completion Rate（完播率）",
            definition: "觀眾看完整支影片的比例。",
            example: "一支 30 秒影片，1000 人點進，500 人看完 = 完播率 50%"
          },
          {
            term: "ROAS（Return on Ad Spend）",
            definition: "廣告投資報酬率。每花 1 元廣告費賺回多少元。",
            example: "花 NT$1000 投放廣告，賺回 NT$3500 = ROAS 3.5"
          },
          {
            term: "CTR（Click Through Rate）",
            definition: "點擊率。看到廣告的人中，有多少人點擊。",
            example: "廣告被 10000 人看到，100 人點擊 = CTR 1%"
          },
          {
            term: "CPM（Cost Per Mille）",
            definition: "每千次曝光成本。投放廣告每被 1000 人看到要花多少錢。",
            example: "投放 NT$1000，被 5000 人看到 = CPM NT$200"
          },
          {
            term: "TOFU / MOFU / BOFU",
            definition: "漏斗三層。TOFU=吸引新人，MOFU=建立信任，BOFU=促進轉換。",
            example: "TOFU 內容：趨勢話題（40%）/ MOFU：案例分享（35%）/ BOFU：限時優惠（25%）"
          }
        ]
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
          { title: "步驟 1：受眾研究", description: "用 AI 分析目標受眾的痛點、語言、行為模式。產出受眾人物誌。\n\n【具體做法】用 Claude 分析 Reddit/PTT/Dcard 上的真實留言，提取受眾的「原始語言」（他們怎麼說話）", ai: "Manus 自動掃描 Reddit/PTT/Dcard 提取真實痛點語言" },
          { title: "步驟 2：內容策略", description: "根據受眾痛點，規劃 TOFU/MOFU/BOFU 三層內容漏斗。\n\n【具體配比】TOFU 40% 吸引 / MOFU 35% 信任 / BOFU 25% 轉換", ai: "Claude 生成內容矩陣，按漏斗階段分配主題" },
          { title: "步驟 3：內容生產", description: "用 AI 生成初稿 → 人工審核調整 → 拍攝/剪輯 → 發布。\n\n【品質檢查】初稿通過率應 ≥ 60%（否則 Prompt 需調整）", ai: "Manus 批量生成腳本 + 文案，人工只做最終判斷" },
          { title: "步驟 4：發布排程", description: "按最佳時段發布，多平台同步。\n\n【最佳時段】IG Reels 通常 18:00-22:00 / TikTok 通常 19:00-23:00（台灣時區）", ai: "Manus 根據歷史數據推薦最佳發布時間" },
          { title: "步驟 5：社群互動", description: "回覆留言、私訊互動、社群經營。建立真實連結。\n\n【回覆時間】發布後 1 小時內回覆 ≥ 80% 的留言", ai: "AI 生成回覆建議，人工決定是否使用" },
          { title: "步驟 6：數據分析", description: "追蹤核心指標，找出 Top/Bottom 表現內容。\n\n【每週檢查】完播率、Hook Rate、互動率、轉換率", ai: "Manus 自動抓取 Meta 數據，產出視覺化月報" },
          { title: "步驟 7：優化迭代", description: "根據數據調整策略，回到步驟 1。飛輪越轉越快。\n\n【具體調整】如果 Hook Rate < 25%，下週換新 Hook 類型", ai: "AI 分析趨勢，提出下月優化方向" }
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
    title: "肆、企劃職位完整教學",
    subtitle: "從定位、工作流、到協作邊界的完整指南",
    icon: "Briefcase",
    color: "#FF8C42",
    audience: "企劃職位",
    sections: [
      {
        id: "ch4-s1",
        title: "企劃的定位宣言",
        type: "text",
        content: "你不是「寫文案的」，也不是「發貼文的」。\n\n**你是「商業結果的設計師」。**\n\n你的核心價值是：\n1. **把客戶的商業目標，轉化為觀眾願意看、願意分享、願意購買的內容**\n2. **用數據驅動決策，確保每支內容都有明確的 KPI**\n3. **用 AI 工具消滅重複勞動，把時間留給策略思考**\n\n如果你只是「照著模板寫文案」，那你可以被 AI 替代。如果你能「看出市場機會、預測爆款、設計轉換漏斗」，那你就無可替代。"
      },
      {
        id: "ch4-s2",
        title: "企劃日常工作流 SOP",
        type: "steps",
        content: "一個月的企劃工作分為三個階段：",
        steps: [
          {
            title: "第一週：月初規劃（Planning）",
            description: "確認客戶本月主推、競品分析、主題發想、內容日曆產出\n\n【具體產出】\n- 客戶 Brief 文件\n- 月度內容日曆（12 支短影音 + 8 篇圖文）\n- 12 支短影音的完整腳本",
            ai: "用武器四一次產出整月內容矩陣"
          },
          {
            title: "第二、三週：執行期（Execution）",
            description: "跟進拍攝、審核腳本、與剪輯師協作、發布排程\n\n【每日檢查清單】\n- 今日有無新素材需要審核\n- 明日是否有排定發布\n- 本週是否有客戶反饋需要回應",
            ai: "用 Manus 自動排程、自動提醒"
          },
          {
            title: "第四週：數據優化（Optimization）",
            description: "分析本月表現、找出爆款因素、產出客戶月報、規劃下月調整\n\n【具體產出】\n- 月報（Top 3 爆款分析 + Bottom 3 失敗分析）\n- 下月優化方向（具體到「做什麼」）",
            ai: "用武器八自動產出月報與優化建議"
          }
        ]
      },
      {
        id: "ch4-s3",
        title: "企劃 vs 剪輯師的協作邊界",
        type: "table",
        content: "企劃和剪輯師必須清楚各自的責任邊界，才能高效協作：",
        tableData: {
          headers: ["工作項目", "企劃責任", "剪輯師責任", "協作方式"],
          rows: [
            ["腳本撰寫", "100% 企劃", "0%", "企劃用武器三產出雙格式腳本"],
            ["素材需求清單", "100% 企劃", "0%", "企劃明確列出「需要什麼鏡頭」"],
            ["拍攝執行", "監督", "執行（如需）", "企劃確認素材符合腳本"],
            ["粗剪", "0%", "100% 剪輯師", "剪輯師按腳本排列素材"],
            ["字幕設計", "企劃決定「哪些字要放大」", "剪輯師執行", "企劃在腳本中標註"],
            ["音樂/音效", "企劃建議 BPM", "剪輯師選曲+卡點", "企劃：「120-140 BPM」/ 剪輯師：「用這首歌」"],
            ["特效/轉場", "0%", "100% 剪輯師", "剪輯師按品牌風格執行"],
            ["最終審核", "企劃審核商業邏輯", "剪輯師審核技術細節", "都通過才能發布"]
          ]
        }
      },
      {
        id: "ch4-s4",
        title: "企劃常見問題 Q&A",
        type: "text",
        content: "**Q1：為什麼我產出的腳本通過率只有 40%？**\nA：你的 Prompt 可能不夠精準。試試：(1) 加入更多客戶背景資訊，(2) 提供過去爆款的例子，(3) 明確說出「禁止什麼」。通過率應該 ≥ 60%。\n\n**Q2：客戶說「我想要病毒式爆款」，怎麼回應？**\nA：直接說：「爆款沒有公式，但我們能做的是『每支內容都有 80% 的機率達到及格線』。」然後展示你過去的數據。\n\n**Q3：我拆解了 10 支爆款，但還是不知道為什麼它們會爆？**\nA：你可能只看了「表面」。試試用武器六的 Prompt，系統化地分析 Hook、節奏、心理學、視覺設計四個維度。\n\n**Q4：短影音腳本應該多詳細？**\nA：詳細到「剪輯師拿著腳本就能直接剪輯，不用問你任何問題」。包括：時間碼、鏡頭描述、字幕內容、音效指示、特效位置。\n\n**Q5：怎麼知道我已經達到 Level 3？**\nA：當你能獨立管理 1 個客戶的完整月度內容，且 80% 的內容通過率，且能主動提出「下月應該做什麼」。"
      }
    ]
  },
  {
    id: "ch5",
    title: "伍、短影音企劃工作流",
    subtitle: "導購型 / IP型 / 廣告投放型的完整 SOP",
    icon: "Film",
    color: "#FF8C42",
    audience: "企劃 + 剪輯",
    sections: [
      {
        id: "ch5-s1",
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
        id: "ch5-s2",
        title: "腳本結構：Hook → Body → CTA",
        type: "text",
        content: "所有短影音都遵循 Hook-Body-CTA 三段式結構。這不是建議，是鐵則。\n\n**Hook（前 3 秒）：** 決定生死。觀眾在 0.5 秒內決定要不要繼續看。必須產生「認知衝突」或「情緒觸發」。\n\n【具體例子】\n- 痛點直擊：「你的床墊讓你越睡越累」（引發共鳴）\n- 數字衝擊：「3 個月瘦 15 公斤」（引發好奇）\n- 反差：「我用 100 元的工具做出 10000 元的效果」（引發驚訝）\n\n**Body（中段）：** 兌現 Hook 的承諾。用最少的時間傳遞最核心的價值。每 3-5 秒必須有一個「資訊節點」防止觀眾離開。\n\n【具體例子】\n- 秒 3-6：解釋問題\n- 秒 6-9：提出解法\n- 秒 9-12：展示效果\n- 秒 12-15：社會證明（客戶見證）\n\n**CTA（最後 3 秒）：** 告訴觀眾「現在該做什麼」。導購型要明確（「點擊下方連結」），IP 型要柔性（「追蹤看更多」）。\n\n【具體例子】\n- 導購型：「現在點擊下方連結，享受 7 折優惠」\n- IP 型：「想看更多秘訣嗎？追蹤我吧」\n- 廣告投放型：「立即購買，限時 24 小時」"
      },
      {
        id: "ch5-s3",
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
    id: "ch6",
    title: "陸、剪輯師完整教學",
    subtitle: "從素材接收到多平台輸出的標準 SOP",
    icon: "Scissors",
    color: "#F37021",
    audience: "剪輯師",
    sections: [
      {
        id: "ch6-s1",
        title: "剪輯師的核心價值",
        type: "text",
        content: "你不是「按照指令剪片的工具人」。你的核心價值是：\n\n1. **把企劃的商業意圖，轉化為觀眾願意看完的視覺體驗**\n2. **用節奏控制觀眾的注意力，讓 Hook Rate 和完播率達標**\n3. **善用 AI 工具消滅重複性勞動，把時間留給創意判斷**\n\n如果你只是「機械式地按時間碼剪輯」，那你可以被 AI 替代。如果你能「感受節奏、判斷何時切鏡、知道什麼時候該加特效」，那你就無可替代。"
      },
      {
        id: "ch6-s2",
        title: "工具棧與 AI 功能對比",
        type: "table",
        content: "每個工具有不同的優勢。選對工具，效率提升 50%：",
        tableData: {
          headers: ["工具", "定位", "使用佔比", "核心 AI 功能", "何時使用"],
          rows: [
            ["剪映 PRO（CapCut）", "主力剪輯", "90%", "自動字幕、AI 去背、智能剪切、文字轉語音", "所有短影音"],
            ["Premiere Pro v26", "品牌形象影片", "5-10%", "Object Mask、Generative Extend、Enhanced Speech", "30+ 秒的品牌影片"],
            ["DaVinci Resolve 20", "精密調色", "5%", "Magic Mask、IntelliScript、UltraNR 降噪", "需要專業調色的內容"],
            ["Canva Pro", "封面/圖卡", "—", "AI 生成、智能調整尺寸", "影片封面、社群圖卡"],
            ["Manus", "自動化助手", "—", "批量字幕校對、素材配對、腳本解析", "大量內容時的自動化"]
          ]
        }
      },
      {
        id: "ch6-s3",
        title: "剪輯 8 步 SOP",
        type: "steps",
        content: "",
        steps: [
          { title: "1. 接收素材", description: "在 Monday.com 確認任務 → 下載素材 → 閱讀腳本確認商業意圖", ai: "Manus 自動解析腳本，產出「素材對照清單」" },
          { title: "2. 素材整理", description: "按腳本分鏡順序分類標記", ai: "CapCut 智能場景識別，30 分鐘 → 10 分鐘" },
          { title: "3. 粗剪", description: "前 3 秒決定生死。節奏 > 完美。按 Hook-Body-CTA 排列。", ai: "人工判斷為主，這是剪輯師最核心的價值" },
          { title: "4. 字幕生成", description: "AI 自動字幕 → 人工校對（台灣用語、專有名詞、斷句）→ 套用品牌模板", ai: "CapCut AI 準確率 95%，人工校對至 99%" },
          { title: "5. 音樂/音效", description: "導購型 120-140 BPM / IP 型 80-100 BPM / 廣告型開頭衝擊音效", ai: "CapCut 智能推薦 + 自動卡點 + 音量智能調節" },
          { title: "6. 特效/轉場", description: "同場景硬切、場景切換快速縮放、重點強調定格+放大", ai: "品牌色應用：字幕底色=品牌主色（愛馬仕橘）" },
          { title: "7. 精剪/調色", description: "確認時長、衝擊力、字幕正確、BGM 音量、CTA 清楚", ai: "CapCut 一鍵濾鏡 / DaVinci AI 調色" },
          { title: "8. 輸出/交付", description: "9:16（1080×1920）+ 1:1（1080×1080）+ 16:9（如需）→ 上傳 Drive → Monday 更新 → Slack 通知", ai: "CapCut 一次輸出三種尺寸" }
        ]
      },
      {
        id: "ch6-s4",
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
    id: "ch7",
    title: "柒、剪輯軟體 AI 功能完全操作指南",
    subtitle: "CapCut / Premiere Pro / DaVinci Resolve 三套最新 AI 功能詳解",
    icon: "Zap",
    color: "#FF8C42",
    audience: "剪輯師",
    sections: [
      {
        id: "ch7-s1",
        title: "CapCut（剪映 PRO）AI 功能完全指南",
        type: "flipcard",
        content: "",
        flipCards: [
          {
            front: "AI 自動字幕（Auto Captions）",
            back: "【功能】自動辨識語音，產出字幕\n【步驟】\n1. 導入影片 → 點擊「字幕」\n2. 選擇「自動生成字幕」\n3. 選擇語言（繁體中文）\n4. 等待 AI 處理（通常 30 秒-2 分鐘）\n5. 人工校對（台灣用語、專有名詞）\n【效率】手動打字 30 分鐘 → AI 自動 2 分鐘 + 校對 5 分鐘 = 7 分鐘\n【準確率】95%（需人工校對最後 5%）"
          },
          {
            front: "AI 智能去背（Background Removal）",
            back: "【功能】一鍵去除背景，無需綠幕\n【步驟】\n1. 選擇素材 → 點擊「效果」\n2. 搜尋「去背」或「Background Removal」\n3. 點擊套用\n4. 調整邊緣柔和度（Feather）\n【使用場景】人物特寫、產品展示、需要換背景的內容\n【效率】傳統去背 20 分鐘 → AI 去背 30 秒\n【品質】95% 滿意度（邊緣可能需微調）"
          },
          {
            front: "AI 自動卡點（Auto Beat Sync）",
            back: "【功能】自動偵測音樂節拍，在節拍點切鏡\n【步驟】\n1. 導入音樂 → 點擊「音樂」\n2. 選擇「自動卡點」\n3. AI 自動分析節拍\n4. 手動微調（如需要）\n【使用場景】導購型短影音、節奏感強的內容\n【效率】手動卡點 15 分鐘 → AI 自動 1 分鐘 + 微調 3 分鐘 = 4 分鐘\n【成功率】80%（部分複雜節拍需手動調整）"
          },
          {
            front: "文字轉語音（Text to Speech）",
            back: "【功能】用 AI 聲音朗讀文字\n【步驟】\n1. 點擊「文字」→ 輸入文字\n2. 選擇「文字轉語音」\n3. 選擇聲音（男/女/不同口音）\n4. 調整語速（0.5x - 2x）\n5. 生成語音\n【使用場景】教學型內容、旁白、CTA 朗讀\n【效率】錄音 10 分鐘 → AI 文字轉語音 1 分鐘\n【品質】自然度 85%（適合旁白，不適合故事性內容）"
          },
          {
            front: "AI 配樂推薦（Smart Music Selection）",
            back: "【功能】根據影片內容推薦配樂\n【步驟】\n1. 上傳影片 → 點擊「音樂」\n2. 選擇「AI 推薦」\n3. AI 分析影片內容，推薦 5-10 首配樂\n4. 選擇喜歡的配樂\n【使用場景】所有短影音\n【效率】手動選曲 20 分鐘 → AI 推薦 2 分鐘\n【品質】推薦準確率 70%（最後選擇權在人工）"
          },
          {
            front: "AI 一鍵調色（Auto Color Grading）",
            back: "【功能】根據影片風格自動調色\n【步驟】\n1. 選擇素材 → 點擊「效果」\n2. 選擇「調色」或「濾鏡」\n3. 點擊「AI 調色」\n4. 選擇風格（電影感、清爽、暖色等）\n5. 套用\n【使用場景】所有短影音\n【效率】手動調色 15 分鐘 → AI 調色 1 分鐘\n【品質】80% 滿意度（可能需微調飽和度、對比度）"
          }
        ]
      },
      {
        id: "ch7-s2",
        title: "Premiere Pro v26 AI 功能完全指南",
        type: "flipcard",
        content: "",
        flipCards: [
          {
            front: "Object Mask（物體遮罩）",
            back: "【功能】AI 自動追蹤物體，產出精確遮罩\n【步驟】\n1. 導入素材 → 新增調整圖層\n2. 點擊「效果」→ 搜尋「Object Mask\"\n3. 選擇要追蹤的物體\n4. AI 自動追蹤整個片段\n5. 可套用效果（模糊、色彩調整等）\n【使用場景】需要突出某個物體、背景模糊、物體特效\n【效率】手動遮罩 1 小時 → AI Object Mask 5 分鐘\n【準確率】95%（複雜背景可能需微調）"
          },
          {
            front: "Generative Extend（AI 畫面延伸）",
            back: "【功能】AI 自動延伸畫面，補足缺失的邊框\n【步驟】\n1. 選擇素材 → 點擊「效果\"\n2. 搜尋「Generative Extend\"\n3. 選擇延伸方向（上/下/左/右）\n4. 設定延伸像素數\n5. 點擊「生成\"\n【使用場景】需要改變畫面比例、補足邊框\n【效率】手動補框 30 分鐘 → AI 生成 2 分鐘\n【品質】80% 滿意度（邊緣可能有痕跡）"
          },
          {
            front: "Enhanced Speech（語音增強）",
            back: "【功能】AI 自動增強語音品質，降低背景雜音\n【步驟】\n1. 選擇音頻軌 → 點擊「音頻效果\"\n2. 搜尋「Enhanced Speech\"\n3. 選擇強度（輕/中/強）\n4. 套用\n【使用場景】室內拍攝、有背景雜音的內容\n【效率】手動降噪 20 分鐘 → AI 增強 1 分鐘\n【品質】85% 滿意度（可能影響語音自然度）"
          },
          {
            front: "Auto Reframe（一鍵多平台輸出）",
            back: "【功能】自動為不同平台重新構圖（16:9 → 9:16 → 1:1）\n【步驟】\n1. 完成編輯 → 點擊「文件\"\n2. 選擇「Auto Reframe\"\n3. 選擇目標尺寸（9:16 / 1:1 / 等）\n4. AI 自動調整構圖，確保主體不被裁切\n5. 輸出\n【使用場景】一支影片多平台發布\n【效率】手動改尺寸 30 分鐘 × 3 種 = 90 分鐘 → AI 自動 5 分鐘\n【品質】90% 滿意度（可能需微調主體位置）"
          },
          {
            front: "Audio Remix（AI 音樂長度調整）",
            back: "【功能】AI 自動調整音樂長度，不改變音質\n【步驟】\n1. 選擇音樂軌 → 點擊「音頻效果\"\n2. 搜尋「Audio Remix\"\n3. 設定目標長度（例如 30 秒）\n4. 選擇風格保留（節奏/旋律）\n5. 生成\n【使用場景】音樂太短或太長，需要調整\n【效率】手動剪接+淡出 15 分鐘 → AI 自動 1 分鐘\n【品質】85% 滿意度（可能有不自然的接點）"
          }
        ]
      },
      {
        id: "ch7-s3",
        title: "DaVinci Resolve 20 AI 功能完全指南",
        type: "flipcard",
        content: "",
        flipCards: [
          {
            front: "Magic Mask（AI 魔法遮罩）",
            back: "【功能】AI 自動偵測物體邊界，產出精確遮罩\n【步驟】\n1. 導入素材 → 進入「Fusion\" 頁籤\n2. 新增「Mask\" 節點\n3. 選擇「Magic Mask\"\n4. 在物體上點擊，AI 自動追蹤\n5. 套用效果（模糊、調色等）\n【使用場景】精密調色、物體特效、背景分離\n【效率】手動遮罩 2 小時 → AI Magic Mask 10 分鐘\n【準確率】98%（最精確的 AI 遮罩工具）"
          },
          {
            front: "IntelliScript（腳本自動建立時間軸）",
            back: "【功能】根據腳本自動建立時間軸和標記\n【步驟】\n1. 導入腳本文件（.txt 或 .pdf）\n2. 點擊「IntelliScript\"\n3. AI 解析腳本，自動建立時間軸\n4. 標記每個場景、對白、音效\n5. 手動微調\n【使用場景】多場景影片、訪談型內容\n【效率】手動標記 1 小時 → AI 自動 5 分鐘\n【準確率】80%（複雜腳本需手動調整）"
          },
          {
            front: "AI Animated Subtitles（動態字幕）",
            back: "【功能】自動生成帶動畫效果的字幕\n【步驟】\n1. 導入影片 → 進入「Fusion\" 頁籤\n2. 新增「Text\" 節點\n3. 選擇「AI Animated Subtitles\"\n4. 輸入字幕內容\n5. 選擇動畫風格（淡入/滑入/縮放等）\n6. 生成\n【使用場景】教學型內容、強調重點、品牌字幕\n【效率】手動做字幕動畫 30 分鐘 → AI 自動 2 分鐘\n【品質】90% 滿意度（可自訂動畫參數）"
          },
          {
            front: "UltraNR（AI 深度降噪）",
            back: "【功能】AI 深度學習降噪，保留語音清晰度\n【步驟】\n1. 選擇音頻軌 → 進入「Fusion\" 頁籤\n2. 新增「Audio\" 節點\n3. 選擇「UltraNR\"\n4. 調整強度（0-100）\n5. 套用\n【使用場景】室外拍攝、風聲、背景雜音\n【效率】手動降噪 1 小時 → AI UltraNR 5 分鐘\n【品質】95% 滿意度（業界最佳降噪效果）"
          },
          {
            front: "Film Look Creator（電影質感一鍵生成）",
            back: "【功能】AI 根據經典電影風格自動調色\n【步驟】\n1. 進入「Color\" 頁籤\n2. 點擊「Film Look Creator\"\n3. 選擇電影風格（Kodak / Fujifilm / 等）\n4. 選擇年代（60s / 80s / 現代）\n5. AI 自動套用調色\n【使用場景】品牌形象影片、高級內容\n【效率】手動調色 1 小時 → AI 生成 1 分鐘\n【品質】90% 滿意度（可微調飽和度、對比度）"
          }
        ]
      }
    ]
  },
  {
    id: "ch8",
    title: "捌、Manus 自動化工作流",
    subtitle: "降本增效的秘密武器 + 新服務變現",
    icon: "Zap",
    color: "#FF8C42",
    audience: "全員必讀",
    sections: [
      {
        id: "ch8-s1",
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
      }
    ]
  },
  {
    id: "ch9",
    title: "玖、AI Prompt 兵器庫",
    subtitle: "8 大武器，複製貼上即可使用",
    icon: "Brain",
    color: "#F37021",
    audience: "全員必讀",
    sections: [
      {
        id: "ch9-s1",
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
        id: "ch9-s2",
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
        id: "ch9-s3",
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
        id: "ch9-s4",
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
        id: "ch9-s5",
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
        id: "ch9-s6",
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
        id: "ch9-s7",
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
        id: "ch9-s8",
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
    id: "ch10",
    title: "拾、報到清單與第一週任務",
    subtitle: "新人入職後的具體行動步驟",
    icon: "Users",
    color: "#F37021",
    audience: "新人",
    sections: [
      {
        id: "ch10-s1",
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
        id: "ch10-s2",
        title: "第一週（企劃）",
        type: "checklist",
        content: "",
        checklistItems: [
          "完成本手冊參（飛輪系統）+ 肆（企劃教學）閱讀",
          "拆解 10 支爆款短影音（用武器六的 Prompt）",
          "用武器二產出 10 個 Hook（任選一個主題）",
          "用武器三產出 1 份完整腳本",
          "向子權提交以上作業，獲得回饋"
        ]
      },
      {
        id: "ch10-s3",
        title: "第一週（剪輯師）",
        type: "checklist",
        content: "",
        checklistItems: [
          "完成本手冊伍（剪輯師教學）+ 柒（AI 功能指南）完整閱讀",
          "熟悉 CapCut AI 功能（自動字幕、去背、卡點）",
          "用武器五產出 1 份剪輯施工藍圖",
          "完成 1 支練習短影音（用公司提供的素材）",
          "向子權/阿韋提交作品，獲得回饋"
        ]
      }
    ]
  }
];
