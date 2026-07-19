export type AcademySectionId =
  | "overview"
  | "roles"
  | "planner"
  | "assessment"
  | "toolkit"
  | "manager";

export type RoleId = "ceo" | "coo" | "planner" | "editor";

export interface NavigationItem {
  id: AcademySectionId;
  label: string;
  description: string;
  icon: "home" | "roles" | "planner" | "assessment" | "toolkit" | "manager";
}

export interface RoleDefinition {
  id: RoleId;
  title: string;
  owner: string;
  mission: string;
  outcomes: string[];
  decisionRights: string[];
  escalation: string[];
}

export interface PlannerStage {
  month: 1 | 3 | 6;
  title: string;
  headline: string;
  standard: string;
  autonomyBoundary: string;
  evidence: string[];
  gates: {
    label: string;
    target: string;
  }[];
  mustNotHappen: string[];
}

export interface LearningModule {
  id: string;
  title: string;
  category:
    | "共同基礎"
    | "商業理解"
    | "內容企劃"
    | "短影音"
    | "社群營運"
    | "數據"
    | "AI"
    | "文書行政";
  requiredByMonth: 1 | 3 | 6;
  outcome: string;
  evidence: string;
}

export interface ToolkitItem {
  title: string;
  owner: string;
  system: "Monday" | "Notion" | "Drive / NAS" | "Slack" | "LINE OA" | "GitHub";
  purpose: string;
  doneDefinition: string;
}

export interface PlannerWorkflowStep {
  phase: string;
  title: string;
  purpose: string;
  tools: string;
  output: string;
  doneDefinition: string;
}

export interface DeliverableGroup {
  title: string;
  description: string;
  deliverables: string[];
}

export const academyNavigation: NavigationItem[] = [
  { id: "overview", label: "我的工作學習台", description: "今天該做什麼、目前在哪一階段", icon: "home" },
  { id: "roles", label: "職務與權責", description: "誰對什麼結果負責", icon: "roles" },
  { id: "planner", label: "企劃完整養成路徑", description: "第 1 個月跑通全流程，第 6 個月承接 3 案", icon: "planner" },
  { id: "assessment", label: "1／3／6 個月考核", description: "以實際工作證據驗證能力", icon: "assessment" },
  { id: "toolkit", label: "工作武器庫", description: "工具、模板、SOP 與完成標準", icon: "toolkit" },
  { id: "manager", label: "主管檢視", description: "風險、回饋與下一步", icon: "manager" },
];

export const roleDefinitions: RoleDefinition[] = [
  {
    id: "ceo",
    title: "CEO／執行長",
    owner: "陳涵勻",
    mission: "決定好創往哪裡走、服務誰、如何獲利，並維護最重要的品牌與客戶關係。",
    outcomes: ["公司方向與優先順序清楚", "重要客戶與合作關係穩定", "重大商業承諾可獲利且可交付"],
    decisionRights: ["公司定位與品牌方向", "重大合作與資源配置", "高風險客戶與重大商業談判"],
    escalation: ["重大現金流風險", "重大客訴或品牌危機", "非標準高額支出與人事決策"],
  },
  {
    id: "coo",
    title: "COO／營運長",
    owner: "黃子權 Dennis",
    mission: "讓每一個商業承諾，都能在合理成本、合理工時與合理品質下完成。",
    outcomes: ["專案準時且品質穩定", "毛利與產能可控", "流程、工具與知識持續沉澱"],
    decisionRights: ["專案排程與工作分配", "標準範圍內品質退件", "SOP、工具治理與一般外包調度"],
    escalation: ["重大價格或服務方向變更", "終止重要客戶", "重大人事、法務與品牌風險"],
  },
  {
    id: "planner",
    title: "商業內容企劃／社群營運",
    owner: "小鑫／未來企劃",
    mission: "把客戶的商業目標，轉成可執行的社群策略、內容系統與穩定交付。",
    outcomes: [
      "客戶商業、受眾與市場判斷有依據",
      "社群全案與單線企劃皆能獨立執行",
      "圖文、輪播、文案與短影音都能形成可交付內容",
      "各平台月度內容矩陣、排程與數據改善完整",
      "AI 專案、SKILL、文件與版本可重複使用",
    ],
    decisionRights: ["已核准策略下的題材與腳本", "標準內容日曆與一般社群操作", "不改變範圍的一般內容調整"],
    escalation: ["新增範圍或額外成本", "保證流量／業績要求", "法律、醫療、財務或重大爭議內容", "預估延遲或素材不足"],
  },
  {
    id: "editor",
    title: "拍攝剪輯／內容交付",
    owner: "阿韋／剪輯夥伴",
    mission: "把企劃意圖與素材，轉成觀眾願意看完、符合品牌標準且準時交付的成品。",
    outcomes: ["技術品質與版本正確", "節奏、字幕、聲音與畫面達標", "素材、專案檔與成品安全可追溯"],
    decisionRights: ["一般切鏡與節奏微調", "不改變商業意圖的視覺與聲音優化", "標準規格內的輸出方式"],
    escalation: ["素材不足或腳本無法執行", "授權、成本或期限異常", "原始檔損壞、遺失或修改超出範圍"],
  },
];

export const plannerNonNegotiables = [
  {
    title: "自主學習能力",
    copy:
      "這不是加分項，是企劃最基本的工作能力。平台規則、工具、產業與受眾每天都在變；遇到不會的問題，只等待主管教、沒有先搜尋、驗證與測試，就不可能在好創獨立承接案件。",
    proof:
      "每週至少完成 1 次有效學習閉環：提出問題 → 找可信來源 → 整理成自己的理解 → 實際測試 → 套用到案件 → 留下可複用筆記、模板或 SKILL。",
  },
  {
    title: "文書行政能力",
    copy:
      "企劃不是只負責想創意。市場資料、會議紀錄、排程、檔名、版本、素材需求、客戶回饋、核准狀態與下一步做不好，就沒有資格說自己能獨立。",
    proof:
      "所有工作必須可追溯、可接手、可驗收：Owner、期限、狀態、正式檔案、決策紀錄、客戶核准、風險與下一步完整，任何成員能在 10 分鐘內接手。",
  },
];

export const plannerWorkflowSteps: PlannerWorkflowStep[] = [
  {
    phase: "01",
    title: "接案資訊與服務範圍確認",
    purpose: "先確認客戶買的是社群全案、短影音單線、圖文單線、顧問或其他組合，避免做錯範圍。",
    tools: "Monday、報價／合約正本、LINE OA、會議紀錄模板",
    output: "專案 Brief、服務範圍、交付量、時程、窗口、核准流程與不能承諾事項",
    doneDefinition: "企劃能清楚說出客戶買了什麼、沒買什麼、誰核准、何時交付。",
  },
  {
    phase: "02",
    title: "市場調查與產業理解",
    purpose: "理解產業現況、需求季節、消費趨勢、常見話題、限制與機會。",
    tools: "Perplexity／Comet／網路搜尋、平台搜尋、NotebookLM、來源紀錄表",
    output: "市場概況、關鍵趨勢、消費情境、風險與可切入機會",
    doneDefinition: "每個判斷都有來源、日期與可信度，不把 AI 猜測當事實。",
  },
  {
    phase: "03",
    title: "客戶商業診斷",
    purpose: "先懂客戶怎麼賺錢，才知道內容要帶來什麼結果。",
    tools: "客戶診斷表、訪談、既有數據、ChatGPT／Claude／Gemini 輔助整理",
    output: "產品／服務、客單價、毛利、成交流程、主要獲客來源、轉換節點、回購與商業限制",
    doneDefinition: "能說出社群內容與客戶營收之間的實際連結。",
  },
  {
    phase: "04",
    title: "受眾診斷與購買旅程",
    purpose: "辨識誰會買、何時會需要、為何不買，以及他們真正使用的語言。",
    tools: "客戶訪談、評論／留言／論壇、社群聆聽、受眾分析模板",
    output: "核心受眾、情境、痛點、慾望、疑慮、決策因素、原始語料與購買旅程",
    doneDefinition: "內容不是憑空想像，而是能對應受眾真實問題與決策階段。",
  },
  {
    phase: "05",
    title: "競品與標竿分析",
    purpose: "找出市場已經怎麼做、哪裡擁擠、哪裡仍有差異化空間。",
    tools: "IG／FB／Threads／TikTok／YouTube 搜尋、廣告資料庫、競品拆解表",
    output: "直接競品、間接競品、標竿帳號、內容柱、形式、頻率、熱門題材、轉換方式與空缺",
    doneDefinition: "不只是收藏連結，必須產出可執行的差異化建議。",
  },
  {
    phase: "06",
    title: "全案策略與單線策略判斷",
    purpose: "理解完整社群閉環與單一服務線的差異，避免用短影音思維處理所有問題。",
    tools: "策略模板、漏斗圖、服務範圍、客戶商業診斷",
    output: "社群全案藍圖，或短影音／圖文／LINE OA 等單線策略與其上下游接口",
    doneDefinition: "能說明每條服務線負責什麼、不負責什麼，以及如何接回整體商業目標。",
  },
  {
    phase: "07",
    title: "平台角色與內容分工",
    purpose: "為每個平台設定角色，而不是把同一份內容直接複製貼上。",
    tools: "平台帳號現況、歷史數據、平台規範、內容分工表",
    output: "IG、Facebook、Threads、TikTok、YouTube Shorts、LINE OA 的角色、受眾、形式、頻率與 CTA",
    doneDefinition: "每個平台都有明確任務與差異化，不做無目的搬運。",
  },
  {
    phase: "08",
    title: "一個月內容矩陣與排程",
    purpose: "把策略轉成一整月可執行、可協作、可追蹤的內容系統。",
    tools: "內容矩陣模板、Monday、行事曆、AI 專案、SKILL",
    output: "六平台各自的一個月內容矩陣、內容柱、漏斗階段、形式、日期、Owner、素材與 CTA",
    doneDefinition: "每一則內容都有商業目的、受眾、平台理由、交付格式與截止日。",
  },
  {
    phase: "09",
    title: "圖文、輪播、文案與短影音製作",
    purpose: "能把同一策略轉成不同內容形式，而不是只會寫短影音腳本。",
    tools: "Canva、品牌模板、文案框架、腳本模板、CapCut／DaVinci、AI 輔助",
    output: "單圖貼文、輪播圖、貼文文案、Threads 文案、LINE OA 訊息、短影音題材與施工級腳本",
    doneDefinition: "內容可直接進入設計、拍攝、剪輯、發布與驗收。",
  },
  {
    phase: "10",
    title: "內部審核、客戶核准與版本控制",
    purpose: "把錯誤擋在發布前，確保每次修改都有紀錄與正確版本。",
    tools: "審核清單、Monday、Drive／NAS、LINE OA、版本命名規則",
    output: "內部審核紀錄、客戶核准、修改清單、定稿版本與發布狀態",
    doneDefinition: "沒有未核准內容誤發、沒有版本混亂、沒有口頭決策失蹤。",
  },
  {
    phase: "11",
    title: "發布、互動與社群營運",
    purpose: "內容發布後仍要管理留言、私訊、社群反應與轉換入口。",
    tools: "各平台後台、LINE OA、互動話術、危機升級規則",
    output: "發布紀錄、留言／私訊處理、FAQ、重要反饋、潛在名單與異常回報",
    doneDefinition: "公開內容與客戶互動皆有準時處理，重要訊號會回寫正式系統。",
  },
  {
    phase: "12",
    title: "數據回顧與下一輪優化",
    purpose: "不只報表，而是找出下一輪該停止、延續、放大或測試什麼。",
    tools: "平台 Insights、報表模板、試算表、AI 分析但需人工驗證",
    output: "Top／Bottom 分析、內容柱表現、平台差異、商業訊號、下一月調整清單",
    doneDefinition: "每項調整都有數據或客戶反饋依據，並寫進下月內容矩陣。",
  },
  {
    phase: "13",
    title: "知識沉澱與 AI 資產化",
    purpose: "讓成功方法不只存在個人腦中，轉成團隊可重複使用的資產。",
    tools: "Notion、GitHub、AI 專案、SKILL、Prompt／QA 模板",
    output: "案例拆解、SOP、模板、AI 專案、SKILL、版本紀錄與失敗教訓",
    doneDefinition: "其他人可重複執行，且知道輸入、步驟、輸出、品質檢查與錯誤處理。",
  },
];

export const firstMonthDeliverables: DeliverableGroup[] = [
  {
    title: "研究與診斷包",
    description: "不是簡單填表，而是完成一個真實或高擬真案件的商業判斷。",
    deliverables: [
      "1 份市場調查與產業機會報告，含來源、日期、可信度與風險",
      "1 份競品／標竿分析，至少涵蓋 5 個帳號與可執行差異化",
      "1 份客戶商業診斷：產品、客單、毛利、成交、獲客、回購、限制",
      "1 份受眾診斷：情境、痛點、慾望、疑慮、原始語料與購買旅程",
    ],
  },
  {
    title: "策略與矩陣包",
    description: "必須理解社群行銷全案與單線服務，不得只會短影音。",
    deliverables: [
      "1 份社群行銷全案藍圖，含曝光、信任、互動、轉換、回購與私域",
      "1 份單線服務策略：短影音、圖文或 LINE OA 任選一線，明確寫出上下游接口",
      "完成 IG、Facebook、Threads、TikTok、YouTube Shorts、LINE OA 六平台各自的一個月內容矩陣",
      "每個平台矩陣包含內容柱、漏斗階段、形式、日期、CTA、素材、Owner 與再利用方式",
    ],
  },
  {
    title: "內容產製包",
    description: "第一個月必須實際做出跨形式內容，不只會寫題材。",
    deliverables: [
      "至少 4 則單圖貼文：含視覺構圖、圖中文字、貼文文案與 CTA",
      "至少 2 組輪播圖，每組至少 6 頁，具封面、敘事、重點、轉折與 CTA",
      "至少 8 則完整社群文案，涵蓋教育、品牌、互動、轉換四種目的",
      "至少 12 個短影音題材，至少 6 支達施工級腳本標準",
      "至少 6 則 Threads 文案與 2 則 LINE OA 訊息",
      "完成拍攝確認、素材需求、剪輯交接、發布檢查與基礎互動處理",
    ],
  },
  {
    title: "AI 與 SKILL 資產包",
    description: "AI 不是問答工具，必須變成可重複執行的專案與能力。",
    deliverables: [
      "建立 1 個客戶 AI 專案：背景、來源、品牌規則、受眾、禁忌、常用任務與 QA",
      "建立至少 1 個可執行 SKILL：明確輸入、步驟、輸出格式、品質檢查、錯誤處理與版本",
      "用 AI 專案或 SKILL 實際完成一次市場研究、內容矩陣、文案或腳本任務",
      "留下人工查證、修正紀錄與前後工時比較，禁止把 AI 原稿直接交付",
    ],
  },
  {
    title: "專案與行政包",
    description: "能不能獨立，最後看的是整個案件有沒有被穩定管理。",
    deliverables: [
      "在 Monday 完整建立案件、任務、Owner、期限、依賴、狀態與交付連結",
      "完成會議紀錄、決策紀錄、客戶回饋、核准狀態與下一步",
      "Drive／NAS 檔名、資料夾、版本與正式成品正確",
      "Slack 討論的重要結果已寫回 Monday／Notion／Drive",
      "完成 1 次發布後數據回顧，提出下一輪具體調整",
    ],
  },
];

export const plannerStages: PlannerStage[] = [
  {
    month: 1,
    title: "第 1 個月｜全流程獨立執行",
    headline: "完整跑通社群企劃全流程，能獨立執行 1 個標準案件",
    standard:
      "在已定價、已定服務範圍與既有 SOP 下，必須理解社群行銷全案與單線服務，完成市場調查、競品分析、客戶商業診斷、受眾診斷、平台策略、六平台月度內容矩陣、圖文、輪播、文案、短影音、AI 專案、SKILL、排程、交接、發布、互動與基礎數據優化。主管可以審核，但不應逐步教他每一步怎麼做。",
    autonomyBoundary:
      "可以獨立執行標準案件的完整企劃流程；價格、合約、重大客訴、範圍外需求、敏感產業與高風險內容仍需往上核准。",
    evidence: [
      "完成研究與診斷包：市場、競品、商業、受眾與購買旅程",
      "完成 1 份社群全案藍圖與 1 份單線服務策略",
      "完成六平台各自的一個月內容矩陣與跨平台再利用規則",
      "完成單圖、輪播、完整文案、Threads、LINE OA 與短影音內容樣本",
      "完成至少 12 個短影音題材，至少 6 支為可拍攝施工級腳本",
      "建立 1 個可實際使用的客戶 AI 專案",
      "建立至少 1 個通過驗收的 SKILL，並用於實際任務",
      "跑通 Brief → 研究 → 策略 → 內容 → 審核 → 拍攝／剪輯交接 → 發布 → 數據 → 優化",
      "Monday、Notion、Drive／NAS、Slack、LINE OA 的紀錄與版本完整",
      "完成 1 份基礎數據回顧並把改善寫進下一輪內容",
    ],
    gates: [
      { label: "全流程完成度", target: "13 個企劃階段全部跑通，不得只完成內容產出" },
      { label: "準時率", target: "≥ 95%" },
      { label: "主管一次審核可用率", target: "≥ 80%" },
      { label: "重大漏件／錯版／誤發", target: "0 次" },
      { label: "市場與競品研究", target: "有來源、有日期、有結論、有可執行建議" },
      { label: "跨平台矩陣", target: "六平台各有角色、節奏、形式與 CTA" },
      { label: "AI 專案", target: "至少 1 個可重複使用且有 QA 規則" },
      { label: "SKILL", target: "至少 1 個已在真實任務執行並留版本" },
      { label: "自主學習", target: "每週至少 1 次完整學習閉環並實際應用" },
      { label: "文書行政", target: "任何成員可在 10 分鐘內接手" },
      { label: "風險回報", target: "風險發生前主動提出，不等主管追問" },
    ],
    mustNotHappen: [
      "只會短影音，不懂圖文、輪播、文案、平台營運與社群全案",
      "只會填內容日曆，卻不懂客戶商業、受眾、漏斗與轉換路徑",
      "把同一份內容無差異搬到所有平台",
      "市場或競品分析只有截圖與連結，沒有結論和策略",
      "AI 只停留在聊天與複製貼上，沒有專案、SKILL、QA 與版本",
      "客戶回饋、核准、檔案版本或下一步只存在聊天與個人腦中",
      "因不會工具而停止工作，卻沒有先搜尋、測試、紀錄與求助",
    ],
  },
  {
    month: 3,
    title: "第 3 個月｜策略整合與專業進階",
    headline: "能獨立整合策略、內容形式、平台、數據與 AI 工作流",
    standard:
      "能穩定管理 1–2 個標準案件，獨立完成社群全案或多條內容線；能從商業與受眾出發整合圖文、輪播、文案、短影音、平台營運、數據與 AI，不只是把第一個月流程重複做，而是能提升品質、效率、判斷與客戶溝通。",
    autonomyBoundary:
      "主管改為抽查與重大節點審核；可主持一般內容會議、主動調整內容與流程，仍不得自行承諾價格、額外服務或無法控制的成效。",
    evidence: [
      "獨立完成至少 2 種產業的市場、競品、商業與受眾分析",
      "能設計社群全案、短影音單線、圖文單線與私域接口",
      "能為 1–2 個案件穩定維持六平台內容矩陣、交付與版本",
      "能從數據找出 Top／Bottom 內容的具體原因與商業意義",
      "能主持客戶內容會議、整理決策、管理修改與辨識追加需求",
      "建立至少 2 個可重複使用的 AI 專案、SKILL、模板或 SOP",
      "至少完成 1 次內容系統或工作流優化，能證明節省工時或降低錯誤",
      "能主動提出客戶沒指定但具有商業價值的機會",
    ],
    gates: [
      { label: "準時率", target: "≥ 95%" },
      { label: "一次審核可用率", target: "≥ 85%" },
      { label: "案件管理", target: "可穩定管理 1–2 案，無需主管逐步追蹤" },
      { label: "跨形式能力", target: "圖文、輪播、文案、短影音與平台營運皆可獨立完成或正確交接" },
      { label: "數據改善", target: "每月提出至少 3 個具體且有依據的調整" },
      { label: "AI 資產", target: "至少 2 項可由團隊重複使用的專案／SKILL／SOP" },
      { label: "自主學習", target: "每月形成至少 1 份團隊可複用知識" },
      { label: "文書行政", target: "不需主管追蹤即可維持完整紀錄、版本與交接" },
    ],
    mustNotHappen: [
      "只會套公式，無法解釋策略為何適合此客戶",
      "把 AI 產出直接交付，沒有查證、改寫、品牌校準與品質控管",
      "只關注觀看數，不看詢問、名單、轉換、回購與客戶商業結果",
      "多案件並行時靠記憶工作，沒有排程、版本與風險管理",
      "只會做內容，卻無法主持會議、管理修改或處理一般客戶問題",
    ],
  },
  {
    month: 6,
    title: "第 6 個月｜多案主責與穩定交付",
    headline: "可獨立承接並穩定管理 3 件以上案件",
    standard:
      "能同時管理至少 3 個標準型案件，從需求理解、研究、策略、跨平台矩陣、圖文、輪播、文案、短影音、拍攝、剪輯交接、客戶溝通、發布、數據到改善形成完整閉環；Dennis 不需要逐項追蹤或替其收尾。",
    autonomyBoundary:
      "對標準案件的企劃結果負責，可主動安排內容、協調資源、主持會議與改善流程；報價、合約、重大範圍變更、高風險客訴與資源超載仍由 CEO／COO 決策。",
    evidence: [
      "連續至少 2 個月穩定管理 3 件以上案件",
      "每案皆有完整研究、策略、六平台矩陣、內容資產、回饋、版本與數據回顧",
      "能在衝突發生前調整優先順序並提出資源方案",
      "能獨立主持客戶內容會議、內部交接與一般修改協調",
      "至少建立 1 套能量化降低工時、錯誤或重工的流程改善",
      "能帶一名新人完成基本任務，或完成可被接手的完整交接",
      "三案並行期間仍維持自主學習、文書行政與知識沉澱標準",
    ],
    gates: [
      { label: "案件數", target: "≥ 3 件並行，連續至少 2 個月" },
      { label: "準時率", target: "≥ 95%" },
      { label: "一次審核可用率", target: "≥ 85%" },
      { label: "重大漏件／錯版／誤發", target: "0 次" },
      { label: "主管收尾", target: "非例行、僅重大案件介入" },
      { label: "客戶管理", target: "可獨立主持一般會議、管理核准與修改" },
      { label: "改善成果", target: "至少 1 項可量化效率或品質改善" },
      { label: "客戶與團隊信任", target: "可直接作為標準案件第一責任人" },
    ],
    mustNotHappen: [
      "案件一多就失去版本、期限、核准狀態或客戶回饋控制",
      "把忙當成延遲、漏件與品質下降的理由",
      "形成只有自己知道的單點作業方式",
      "未確認產能就對客戶承諾額外工作",
      "需要 Dennis 固定追進度、重寫內容、補文件或替其處理一般客戶溝通",
    ],
  },
];

export const learningModules: LearningModule[] = [
  { id: "common-1", title: "好創商業模式、服務項目與收付款邊界", category: "共同基礎", requiredByMonth: 1, outcome: "知道公司賣什麼、不賣什麼、全案與單線差在哪裡、如何收款與何時不能開工。", evidence: "能依 3 個模擬案件判斷服務範圍、開工條件與風險。" },
  { id: "common-2", title: "社群行銷全案與單線服務架構", category: "共同基礎", requiredByMonth: 1, outcome: "理解曝光、信任、互動、轉換、私域、回購的完整閉環，以及短影音、圖文、LINE OA 等單線如何接入。", evidence: "完成 1 張全案流程圖與 1 份單線上下游接口說明。" },
  { id: "common-3", title: "企劃 13 階段完整流程", category: "文書行政", requiredByMonth: 1, outcome: "從 Brief 到知識沉澱完整跑通，不只會寫內容。", evidence: "以一個案件逐階段提交輸入、輸出、工具、Owner 與完成標準。" },
  { id: "common-4", title: "工具分工與資料正本", category: "文書行政", requiredByMonth: 1, outcome: "知道 Monday、Notion、Drive／NAS、Slack、LINE OA、GitHub 各自放什麼。", evidence: "完成一件任務的建立、交付、紀錄、核准與通知。" },
  { id: "research-1", title: "市場調查與產業趨勢", category: "商業理解", requiredByMonth: 1, outcome: "能找最新市場資料、判斷來源可信度並轉成機會與風險。", evidence: "完成含來源、日期、可信度與建議的市場報告。" },
  { id: "research-2", title: "競品、間接競品與標竿帳號分析", category: "商業理解", requiredByMonth: 1, outcome: "能拆出內容柱、形式、節奏、轉換與市場空缺。", evidence: "至少分析 5 個帳號，提出可執行差異化。" },
  { id: "planner-1", title: "客戶商業診斷", category: "商業理解", requiredByMonth: 1, outcome: "理解產品、客單、毛利、成交方式、獲客來源、轉換、回購與限制。", evidence: "完成商業診斷並能說明內容如何連到營收。" },
  { id: "planner-2", title: "受眾診斷、原始語料與購買旅程", category: "商業理解", requiredByMonth: 1, outcome: "辨識受眾情境、痛點、慾望、疑慮、決策因素與真實語言。", evidence: "完成受眾診斷、語料庫與購買旅程圖。" },
  { id: "planner-3", title: "平台角色與差異化經營", category: "社群營運", requiredByMonth: 1, outcome: "理解 IG、Facebook、Threads、TikTok、YouTube Shorts、LINE OA 各自負責什麼。", evidence: "完成六平台角色、形式、頻率、受眾與 CTA 分工表。" },
  { id: "planner-4", title: "內容策略、內容柱與漏斗設計", category: "內容企劃", requiredByMonth: 1, outcome: "把商業目標轉成曝光、教育、信任、互動、轉換與回購內容。", evidence: "完成內容策略與每個內容柱的商業理由。" },
  { id: "planner-5", title: "六平台一個月內容矩陣", category: "內容企劃", requiredByMonth: 1, outcome: "為六個平台完成一個月差異化排程與再利用規則。", evidence: "每個平台都有內容柱、形式、日期、CTA、素材、Owner 與漏斗階段。" },
  { id: "content-1", title: "社群文案基本功", category: "內容企劃", requiredByMonth: 1, outcome: "能寫標題、正文、資訊層級、品牌語氣、互動設計與 CTA。", evidence: "至少 8 則完整文案，涵蓋教育、品牌、互動與轉換。" },
  { id: "content-2", title: "單圖貼文企劃與視覺 Brief", category: "內容企劃", requiredByMonth: 1, outcome: "能規劃圖中文字、構圖、素材、層級與貼文配合。", evidence: "至少 4 則可直接交設計或在 Canva 完成的單圖貼文。" },
  { id: "content-3", title: "輪播圖結構與敘事", category: "內容企劃", requiredByMonth: 1, outcome: "能設計封面、滑動理由、頁面節奏、重點與 CTA。", evidence: "至少 2 組、每組 6 頁以上的完整輪播。" },
  { id: "short-1", title: "短影音題材、Hook、腳本與拍攝設計", category: "短影音", requiredByMonth: 1, outcome: "產出可拍、可剪、可驗收的施工級腳本。", evidence: "至少 12 個題材、6 支施工級腳本與拍攝需求。" },
  { id: "ops-1", title: "發布、互動、私訊與 LINE OA 基礎營運", category: "社群營運", requiredByMonth: 1, outcome: "內容發布後能處理互動、FAQ、潛在名單與異常升級。", evidence: "完成發布清單、回覆規則、Threads 文案與 LINE OA 訊息。" },
  { id: "admin-1", title: "專案排程、會議紀錄、核准與版本管理", category: "文書行政", requiredByMonth: 1, outcome: "不用主管追問，也能維持任務、檔案、回饋與下一步完整。", evidence: "以真實案件證明任何成員都能在 10 分鐘內接手。" },
  { id: "ai-1", title: "AI 工具選擇、查證與品質治理", category: "AI", requiredByMonth: 1, outcome: "依任務、資料敏感度與輸出需求選工具，不把 AI 猜測當事實。", evidence: "完成一份工具選擇矩陣與至少 3 次查證／修正紀錄。" },
  { id: "ai-2", title: "客戶 AI 專案建立", category: "AI", requiredByMonth: 1, outcome: "把客戶背景、來源、品牌規則、受眾、禁忌、常用任務與 QA 集中管理。", evidence: "建立 1 個可實際使用且能被他人接手的 AI 專案。" },
  { id: "ai-3", title: "SKILL 設計、建立與驗收", category: "AI", requiredByMonth: 1, outcome: "把重複工作變成具有輸入、流程、輸出、QA、錯誤處理與版本的 SKILL。", evidence: "至少 1 個 SKILL 在真實任務成功執行並留下測試紀錄。" },
  { id: "learning-1", title: "自主學習與資訊驗證", category: "AI", requiredByMonth: 1, outcome: "能自行發現知識缺口、找來源、測試、應用與沉澱。", evidence: "每週完成一個學習閉環，至少一項改善實際工作。" },
  { id: "data-1", title: "基礎數據判讀與下一輪優化", category: "數據", requiredByMonth: 1, outcome: "能看懂基本平台數據並提出具體下一步。", evidence: "完成一次 Top／Bottom 回顧與下月調整。" },
  { id: "advanced-1", title: "跨形式整合與內容系統設計", category: "內容企劃", requiredByMonth: 3, outcome: "能整合圖文、輪播、文案、短影音、互動與私域，而非各做各的。", evidence: "完成一個跨形式內容主題系列與再利用系統。" },
  { id: "advanced-2", title: "多產業策略遷移", category: "商業理解", requiredByMonth: 3, outcome: "能依不同產業重新研究與設計，不機械套用舊模板。", evidence: "完成至少 2 種產業的策略與執行證據。" },
  { id: "advanced-3", title: "客戶內容會議與需求邊界", category: "商業理解", requiredByMonth: 3, outcome: "能主持會議、整理決策、辨識追加需求與風險。", evidence: "獨立完成會議、紀錄、確認、修改管理與後續排程。" },
  { id: "advanced-4", title: "數據診斷、假設與測試", category: "數據", requiredByMonth: 3, outcome: "從數據與反饋提出假設，設計下一輪內容測試。", evidence: "完成至少 3 個有依據的改善實驗。" },
  { id: "advanced-5", title: "AI 工作流與 SKILL 組合", category: "AI", requiredByMonth: 3, outcome: "把研究、矩陣、內容、QA 與報告串成穩定工作流。", evidence: "建立至少 2 項團隊可重複使用的 AI 資產並量化效益。" },
  { id: "advanced-6", title: "品質、效率與商業機會判斷", category: "共同基礎", requiredByMonth: 3, outcome: "不只把事情做完，能提升品質、減少重工並主動提出機會。", evidence: "至少完成 1 項流程改善與 1 項客戶機會提案。" },
  { id: "scale-1", title: "三案並行與資源管理", category: "文書行政", requiredByMonth: 6, outcome: "同時管理 3 件以上案件仍不漏球、不延遲、不失去版本。", evidence: "連續 2 個月達成三案並行標準。" },
  { id: "scale-2", title: "案件第一責任人與客戶管理", category: "商業理解", requiredByMonth: 6, outcome: "可作為一般標準案件的第一責任人，主持會議與協調交付。", evidence: "3 案皆有完整客戶、內容、核准、交付與改善紀錄。" },
  { id: "scale-3", title: "流程改善、知識沉澱與帶人", category: "AI", requiredByMonth: 6, outcome: "讓下一次工作更快、更穩定，並能交接或帶新人。", evidence: "完成至少一項有量化成果的 SOP、模板、自動化或帶教成果。" },
];

export const toolkitItems: ToolkitItem[] = [
  { title: "客戶／商機主檔", owner: "業務／COO", system: "Monday", purpose: "記錄商機、客戶、案件、Owner、期限與狀態。", doneDefinition: "每個案件有唯一 Owner、下一步與截止日。" },
  { title: "專案任務與排程", owner: "案件主責企劃", system: "Monday", purpose: "管理研究、矩陣、圖文、腳本、拍攝、剪輯、發布、互動與月報節點。", doneDefinition: "每項任務有狀態、期限、依賴、核准與交付連結。" },
  { title: "SOP、教材與職務知識", owner: "COO／各職務 Owner", system: "Notion", purpose: "保存可重複使用的規則、流程與教學。", doneDefinition: "標示 Owner、適用範圍、最後更新與正式狀態。" },
  { title: "正式素材與成品", owner: "企劃／剪輯", system: "Drive / NAS", purpose: "保存原始素材、設計檔、專案檔、成品、合約與正式文件。", doneDefinition: "依命名規則存放，其他人可立即找到正確版本。" },
  { title: "內部討論與卡點", owner: "所有成員", system: "Slack", purpose: "討論、通知、提出風險與留下決策脈絡。", doneDefinition: "重要結果須寫回 Monday／Notion／Drive，不讓 Slack 成為資料黑洞。" },
  { title: "客戶正式窗口", owner: "指定窗口", system: "LINE OA", purpose: "對客戶確認需求、回饋、核准與重要通知。", doneDefinition: "影響範圍、期限或交付的內容須同步回正式系統。" },
  { title: "AI 專案、SKILL 與系統版本", owner: "COO／職務 Owner", system: "GitHub", purpose: "保存程式碼、AI 規則、SKILL、Schema、QA 與版本紀錄。", doneDefinition: "重大變更可追溯、可測試、可審核、可回復。" },
];

export const taiwanMarketSignals = [
  "2026 年台灣社群與影音企劃職缺，已普遍要求從主題、腳本、拍攝、剪輯到成效優化的完整執行，而不只是排貼文。",
  "圖文、輪播、文案、短影音、社群互動、平台排程與基礎行政，仍是企劃實務基本盤；只會其中一種形式不足以支撐整案。",
  "市場調查、競品分析、平台趨勢與數據優化，已被大量行銷職缺列為日常責任，企劃不能只靠直覺。",
  "AI 使用正在變成基本能力，但企業真正需要的是能把 AI 變成專案、工作流、SKILL、文件與可驗證成果的人。",
];

export const marketSources = [
  { label: "104 社群企劃職缺市場（2026-07）", url: "https://www.104.com.tw/jobs/search/?keyword=%E7%A4%BE%E7%BE%A4%E4%BC%81%E5%8A%83" },
  { label: "104 影音企劃職缺市場（2026）", url: "https://www.104.com.tw/jobs/search/?jobcat=2013002021" },
  { label: "104 市場調查／內容行銷職缺", url: "https://www.104.com.tw/jobs/search/?area=6001001000&jobcat=2004001004%2C2004001010%2C2004001005" },
  { label: "104 競品分析相關職缺", url: "https://www.104.com.tw/jobs/search?edu=1&keyword=%E7%AB%B6%E5%93%81%E5%88%86%E6%9E%90" },
];
