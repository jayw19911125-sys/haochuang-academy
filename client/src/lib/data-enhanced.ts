// 增強型數據結構 - 支援 Mermaid 圖表、SVG 組件、當代敘事
// 用於 haochuangacademy 的 4 個新章節

export interface EnhancedSection {
  id: string;
  title: string;
  type: "text" | "table" | "prompt" | "steps" | "comparison" | "checklist" | "flipcard" | "glossary" | "diagram" | "insight" | "hierarchy" | "matrix";
  content: string;
  
  // 新增：視覺化圖表
  diagram?: {
    type: "mermaid" | "flowchart" | "mindmap" | "architecture" | "hierarchy";
    code: string;
    title?: string;
    description?: string;
  };
  
  // 新增：信息層級
  highlights?: {
    title: string;
    value: string | number;
    unit?: string;
    color?: string; // #4ecdc4, #FF8C42, #e94560 等
  }[];
  
  // 新增：備註提示
  notes?: {
    type: "warning" | "insight" | "tip" | "data";
    title: string;
    content: string;
    icon?: string;
  }[];
  
  // 新增：補充說明（可展開）
  expandable?: {
    title: string;
    content: string;
  }[];
  
  // 現有字段
  tableData?: { headers: string[]; rows: string[][] };
  promptData?: { model: string; purpose: string; prompt: string; example?: string };
  steps?: { title: string; description: string; ai?: string }[];
  flipCards?: { front: string; back: string }[];
  checklistItems?: string[];
  glossary?: { term: string; definition: string; example?: string }[];
}

// ============================================
// 第 11 章：私域轉化完整流程
// ============================================

export const chapter11Enhanced = {
  id: "ch11",
  title: "拾壹、私域轉化完整流程",
  subtitle: "短影音 → 私訊 → 私域 → 成交的自動化系統",
  icon: "Zap",
  color: "#4ecdc4",
  audience: "企劃 + 營運",
  sections: [
    {
      id: "ch11-s1",
      title: "私域平台選擇矩陣",
      type: "matrix",
      content: "根據客戶類型選擇合適的私域平台。沒有絕對最優，只有最適配。",
      
      highlights: [
        { title: "最高轉換率", value: "課程平台", color: "#10b981" },
        { title: "最高滲透率", value: "LINE OA", color: "#3b82f6" },
        { title: "最強社群", value: "Skool", color: "#f59e0b" }
      ],
      
      diagram: {
        type: "matrix",
        code: `
          graph TB
            A["客戶類型"] --> B["一般消費品"]
            A --> C["社群/IP"]
            A --> D["高客單價"]
            A --> E["VIP 客戶"]
            
            B --> F["LINE OA<br/>月費 $0-3000<br/>轉換率 ★★★★☆"]
            C --> G["Skool<br/>月費 $0-5000<br/>社群感 ★★★★★"]
            D --> H["課程平台<br/>月費 $500-2000<br/>自動化 ★★★★★"]
            E --> I["私有群組<br/>月費 $0<br/>掌控度 ★★★★★"]
        `
      },
      
      tableData: {
        headers: ["平台", "最適客戶", "月費", "自動化", "優勢"],
        rows: [
          ["LINE OA", "消費品、餐飲", "$0-3000", "★★★★☆", "台灣滲透率最高"],
          ["Skool", "社群、IP", "$0-5000", "★★★☆☆", "社群氛圍強"],
          ["課程平台", "高客單價", "$500-2000", "★★★★★", "漏斗最清晰"],
          ["私有群組", "VIP 客戶", "$0", "★★☆☆☆", "完全掌控"]
        ]
      },
      
      notes: [
        {
          type: "insight",
          title: "核心洞察",
          content: "沒有最優平台，只有最適配的選擇。選錯平台，轉換率直接砍半。",
          icon: "💡"
        },
        {
          type: "data",
          title: "2026 年數據",
          content: "LINE OA 用戶在台灣已達 2100 萬，LINE 私訊轉換率比 Facebook 高 3.5 倍。",
          icon: "📊"
        }
      ],
      
      expandable: [
        {
          title: "為什麼 LINE OA 在台灣最強？",
          content: "1. 滲透率最高（台灣 LINE 用戶 2100 萬）\n2. 轉換率最穩定（私訊互動率 15-25%）\n3. 自動化成熟（官方 API 完整）\n4. 成本最低（免費開通）\n5. 用戶習慣最好（不會被當垃圾訊息）"
        },
        {
          title: "什麼時候選 Skool？",
          content: "當你的客戶是「社群型消費者」時：\n- 喜歡在社群中互動、討論\n- 願意為社群氛圍付費\n- 需要「社群歸屬感」而非單純產品\n- 例：知識型 IP、線上社群、品牌粉絲社群"
        }
      ]
    },
    
    {
      id: "ch11-s2",
      title: "6 層轉化漏斗 - 完整路徑",
      type: "diagram",
      content: "從短影音到成交的完整路徑。每層的轉換率都有明確目標。",
      
      highlights: [
        { title: "第 1 層目標", value: "50%", unit: "完播率", color: "#4ecdc4" },
        { title: "第 6 層目標", value: "30%", unit: "復購率", color: "#10b981" },
        { title: "整體轉換率", value: "0.25-0.75%", unit: "短影音→成交", color: "#FF8C42" }
      ],
      
      diagram: {
        type: "flowchart",
        code: `
          graph TD
            A["短影音曝光<br/>1000+ 觀看<br/>完播率 ≥50%"] -->|互動率 3%| B["留言轉私訊<br/>30+ 留言<br/>CTA 有效"]
            B -->|進群率 60%| C["私訊進私域<br/>18+ 人進群<br/>誘因清晰"]
            C -->|活躍度 40%| D["私域培育<br/>7+ 人互動<br/>價值提供"]
            D -->|轉換率 15%| E["轉換機會<br/>2-3 人購買<br/>產品推薦"]
            E -->|復購率 30%| F["復購與推薦<br/>1 人復購<br/>1 人推薦"]
            
            style A fill:#4ecdc4,stroke:#2a9d8f,color:#fff
            style B fill:#4ecdc4,stroke:#2a9d8f,color:#fff
            style C fill:#4ecdc4,stroke:#2a9d8f,color:#fff
            style D fill:#FF8C42,stroke:#e67e22,color:#fff
            style E fill:#FF8C42,stroke:#e67e22,color:#fff
            style F fill:#10b981,stroke:#059669,color:#fff
        `
      },
      
      notes: [
        {
          type: "warning",
          title: "最常見的失敗點",
          content: "第 2 層卡住（留言轉私訊）。原因：CTA 不清楚、沒有誘因、回覆太慢。",
          icon: "⚠️"
        },
        {
          type: "tip",
          title: "快速優化方案",
          content: "在第 2 層加入「免費資源」誘因（PDF、模板、清單），進群率可從 40% 跳到 70%。",
          icon: "🚀"
        }
      ],
      
      steps: [
        {
          title: "第 1 層：短影音曝光",
          description: "目標：完播率 ≥ 50%，月度 1000+ 觀看\n\n核心：Hook 強度決定一切。前 3 秒沒吸引力，再好的內容也白搭。",
          ai: "AI 生成 10+ 個不同 Hook 進行 A/B 測試，自動篩選最強 Hook"
        },
        {
          title: "第 2 層：留言轉私訊",
          description: "目標：互動率 ≥ 3%（留言 + 分享），月度 30+ 條有效留言\n\n核心：CTA 必須清晰。「私訊我」不如「私訊『進群』領免費清單」。",
          ai: "AI 測試 20+ 種 CTA 文案，找出最高互動率的版本"
        },
        {
          title: "第 3 層：私訊進私域",
          description: "目標：私訊轉私域加入率 ≥ 60%，月度 18+ 人進群\n\n核心：回覆速度 < 1 分鐘。用戶私訊後如果 5 分鐘沒回，進群率直接砍半。",
          ai: "AI 自動回覆 + 自動邀請連結，0 延遲進群"
        },
        {
          title: "第 4 層：私域培育",
          description: "目標：活躍度 ≥ 40%（每週互動），月度 7+ 人參與互動\n\n核心：內容頻率 + 價值提供。每週 2-3 次推送，每次都要有實質價值。",
          ai: "AI 根據用戶行為自動推薦內容，自動分類用戶（冷/溫/熱）"
        },
        {
          title: "第 5 層：轉換機會",
          description: "目標：轉換率 ≥ 15%（進私域的人中），月度 2-3 人購買\n\n核心：時機 + 信任。不是硬賣，而是在用戶最需要時出現。",
          ai: "AI 分析用戶行為，精準推薦最適合的產品 + 最佳轉換時機"
        },
        {
          title: "第 6 層：復購與推薦",
          description: "目標：復購率 ≥ 30%、推薦率 ≥ 20%，月度 1 人復購、1 人推薦\n\n核心：客後服務 + 社群維繫。買完不是結束，而是新的開始。",
          ai: "AI 自動發送客後關懷、推薦激勵訊息、復購提醒"
        }
      ]
    },
    
    {
      id: "ch11-s3",
      title: "LINE OA 自動化配置 - 實戰指南",
      type: "text",
      content: "從 0 到 1 建立完整的 LINE OA 自動化系統。不需要技術背景，只需要 30 分鐘。",
      
      notes: [
        {
          type: "insight",
          title: "為什麼要自動化？",
          content: "手動回覆 = 轉換率砍半。自動化 = 24/7 無縫服務 + 一致的用戶體驗。",
          icon: "⚡"
        }
      ],
      
      expandable: [
        {
          title: "第一步：基礎設定（5 分鐘）",
          content: "1. 建立 LINE OA 帳號（官方網站免費開通）\n2. 升級為 LINE Business Manager（需驗證）\n3. 連接官方帳號 API（取得 Channel ID + Access Token）\n4. 在 Monday.com 中記錄 API 金鑰（作為唯一真實來源）"
        },
        {
          title: "第二步：自動化流程設定（15 分鐘）",
          content: "1. 用戶私訊「進群\" → 自動回覆邀請連結\n2. 用戶點擊連結 → 自動加入 LINE 社群\n3. 加入後 → 自動發送歡迎訊息 + 免費資源\n4. 每週定時推送 → 精選內容 + 限時優惠\n5. 用戶互動 → 自動分類（冷/溫/熱）"
        },
        {
          title: "第三步：數據追蹤（10 分鐘）",
          content: "1. 在 Monday.com 建立看板追蹤每個階段的轉換率\n2. 每週分析瓶頸（哪一層掉最多人？）\n3. 每週優化 CTA（測試新的文案）\n4. 每月產出轉化漏斗報告（給客戶看）"
        }
      ]
    }
  ]
};

// ============================================
// 第 12 章：B2B vs B2C 社群策略
// ============================================

export const chapter12Enhanced = {
  id: "ch12",
  title: "拾貳、B2B vs B2C 社群策略",
  subtitle: "2026 年兩大戰場的差異化打法",
  icon: "BarChart3",
  color: "#a29bfe",
  audience: "企劃 + 營運",
  sections: [
    {
      id: "ch12-s1",
      title: "B2B 戰場：LinkedIn 對話窗廣告",
      type: "diagram",
      content: "2026 年 LinkedIn 最新功能。對話窗廣告無需離開平台，轉換率比傳統廣告高 40-60%。",
      
      highlights: [
        { title: "轉換率提升", value: "40-60%", color: "#10b981" },
        { title: "成本下降", value: "30-40%", color: "#3b82f6" },
        { title: "自動化程度", value: "80%", color: "#FF8C42" }
      ],
      
      diagram: {
        type: "flowchart",
        code: `
          graph LR
            A["傳統廣告"] -->|點擊| B["跳轉外站"]
            B -->|流失率 60%| C["轉換成本 $8-15"]
            
            D["對話窗廣告"] -->|點擊| E["私訊對話"]
            E -->|留存率 90%| F["轉換成本 $5-10"]
            
            G["AI 聊天機器人"] -->|自動審核| H["資格篩選"]
            H -->|效率 5 倍| I["人工只需審核 20%"]
            
            style A fill:#e94560,stroke:#c41e3a,color:#fff
            style C fill:#e94560,stroke:#c41e3a,color:#fff
            style D fill:#10b981,stroke:#059669,color:#fff
            style F fill:#10b981,stroke:#059669,color:#fff
        `
      },
      
      notes: [
        {
          type: "data",
          title: "2026 年 LinkedIn 數據",
          content: "對話窗廣告已被 Fortune 500 企業採用，轉換率平均提升 45%，成本下降 35%。",
          icon: "📊"
        },
        {
          type: "tip",
          title: "B2B 最強組合",
          content: "LinkedIn 對話窗廣告 + AI 聊天機器人 + 自動資格審核 = 轉換率 ↑ 50%、成本 ↓ 40%、效率 ↑ 10 倍",
          icon: "🎯"
        }
      ]
    },
    
    {
      id: "ch12-s2",
      title: "B2C 戰場：短影音平台對比",
      type: "matrix",
      content: "三大短影音平台 2026 年的核心差異。選錯平台，效果相差 10 倍。",
      
      highlights: [
        { title: "最高完播率", value: "TikTok", unit: "≥ 65%", color: "#FF8C42" },
        { title: "最穩定轉換", value: "IG Reels", unit: "≥ 55%", color: "#3b82f6" },
        { title: "最長期價值", value: "YouTube Shorts", unit: "≥ 55%", color: "#10b981" }
      ],
      
      tableData: {
        headers: ["平台", "完播率目標", "最佳時段", "核心優勢", "適合產業"],
        rows: [
          ["TikTok", "≥ 65%", "19:00-23:00", "創意爆發、年輕受眾", "快消、美妝、服飾"],
          ["IG Reels", "≥ 55%", "18:00-22:00", "品牌調性、視覺一致", "高端、生活風格"],
          ["YouTube Shorts", "≥ 55%", "20:00-23:00", "教育性、長期價值", "知識、B2B、教育"]
        ]
      },
      
      notes: [
        {
          type: "insight",
          title: "台灣市場現狀",
          content: "TikTok 用戶最年輕（15-25 歲），IG Reels 用戶最有消費力（25-40 歲），YouTube Shorts 用戶最忠誠（35+ 歲）。",
          icon: "👥"
        }
      ]
    },
    
    {
      id: "ch12-s3",
      title: "成本與 ROI 對比",
      type: "text",
      content: "基於 4 人團隊的實際成本數據。B2B 和 B2C 的投資回報完全不同。",
      
      highlights: [
        { title: "B2B 月度成本", value: "$4,650-9,650", color: "#a29bfe" },
        { title: "B2C 月度成本", value: "$2,000-3,000", unit: "人力", color: "#4ecdc4" },
        { title: "B2B ROI", value: "1:3-10", color: "#10b981" },
        { title: "B2C ROI", value: "1:5-15", color: "#10b981" }
      ],
      
      tableData: {
        headers: ["項目", "B2B（月度）", "B2C（月度）", "差異"],
        rows: [
          ["人力成本", "$3,000-5,000", "$2,000-3,000", "B2B 更高"],
          ["工具成本", "$500-1,000", "$300-600", "B2B 工具更貴"],
          ["廣告投放", "$1,000-2,500", "$500-1,400", "B2B 投放更多"],
          ["月度營收", "$10,000-50,000", "$5,000-30,000", "B2B 客單價高"],
          ["ROI", "1:3-10", "1:5-15", "B2C 轉換更穩"]
        ]
      },
      
      notes: [
        {
          type: "warning",
          title: "常見誤區",
          content: "很多公司以為 B2C 更賺錢。實際上 B2B 的客單價高 5-10 倍，但轉換周期長 2-3 個月。",
          icon: "💰"
        }
      ],
      
      expandable: [
        {
          title: "B2B 為什麼客單價高？",
          content: "B2B 客戶是企業決策者，購買決策涉及預算、ROI、長期合作。所以客單價通常是 $10,000-100,000+，而 B2C 通常是 $100-5,000。"
        },
        {
          title: "B2C 為什麼轉換更快？",
          content: "B2C 客戶是個人消費者，購買決策快（衝動購買）。所以轉換周期是 3-7 天，而 B2B 是 30-90 天。"
        }
      ]
    }
  ]
};

// ============================================
// 第 13 章：AI 短影音工具矩陣
// ============================================

export const chapter13Enhanced = {
  id: "ch13",
  title: "拾參、AI 短影音工具矩陣",
  subtitle: "12 款工具詳細對比 + 智能選擇決策樹",
  icon: "Brain",
  color: "#FF8C42",
  audience: "企劃 + 剪輯",
  sections: [
    {
      id: "ch13-s1",
      title: "工具選擇決策樹 - 根據需求推薦",
      type: "diagram",
      content: "根據你的需求，自動推薦最適合的工具。不需要全部買，只需要 2-3 個核心工具。",
      
      diagram: {
        type: "mindmap",
        code: `
          mindmap
            root((AI 短影音工具))
              快速產量
                日產 10+ 支
                  ShortGenius
                  VEED.IO
                  Quso
              長轉短
                YouTube → 短片
                  OpusClip
                  Klap
                  2Short AI
              多語言
                50+ 語言支援
                  Klap
                  Synthesia
                  VEED.IO
              虛擬主播
                AI 人物
                  Synthesia
                  2Short AI
              無臉影片
                純素材
                  SendShort
                  CapCut
              專業剪輯
                複雜編輯
                  Adobe Premiere
                  CapCut Pro
        `
      },
      
      notes: [
        {
          type: "insight",
          title: "2026 年最優配置",
          content: "不要買 12 個工具。買 3 個就夠：ShortGenius（快速產量）+ OpusClip（長轉短）+ CapCut（最後調整）。",
          icon: "🎯"
        }
      ]
    },
    
    {
      id: "ch13-s2",
      title: "12 款工具成本對比 - 找到最優解",
      type: "table",
      content: "根據月度產量選擇最經濟的工具組合。成本差異可達 10 倍。",
      
      highlights: [
        { title: "最便宜", value: "CapCut", unit: "$0-120/月", color: "#10b981" },
        { title: "最高效", value: "ShortGenius", unit: "$1-3/支", color: "#FF8C42" },
        { title: "最專業", value: "Adobe Premiere", unit: "$55-85/月", color: "#a29bfe" }
      ],
      
      tableData: {
        headers: ["工具", "月費", "月產量", "成本/支", "評分"],
        rows: [
          ["ShortGenius", "$99-299", "100+", "$1-3", "⭐⭐⭐⭐⭐"],
          ["OpusClip", "$49-199", "50+", "$1-4", "⭐⭐⭐⭐☆"],
          ["Klap", "$29-99", "30+", "$1-3", "⭐⭐⭐⭐☆"],
          ["Quso", "$79-199", "80+", "$1-2.5", "⭐⭐⭐⭐☆"],
          ["2Short AI", "$39-99", "40+", "$1-2.5", "⭐⭐⭐⭐☆"],
          ["Synthesia", "$60-480", "20+", "$3-24", "⭐⭐⭐⭐☆"],
          ["VEED.IO", "$25-120", "60+", "$0.4-2", "⭐⭐⭐☆☆"],
          ["SendShort", "$49-149", "50+", "$1-3", "⭐⭐⭐☆☆"],
          ["CapCut", "$0-120", "100+", "$0-1.2", "⭐⭐⭐⭐⭐"],
          ["Adobe Premiere", "$55-85", "30+", "$2-3", "⭐⭐⭐⭐⭐"],
          ["Descript", "$24-120", "50+", "$0.5-2.4", "⭐⭐⭐⭐☆"],
          ["Runway", "$12-120", "40+", "$0.3-3", "⭐⭐⭐⭐☆"]
        ]
      },
      
      notes: [
        {
          type: "data",
          title: "2026 年市場數據",
          content: "CapCut 仍是最便宜的選擇（免費版就很強），但 ShortGenius 的自動化程度最高（省時間 = 省成本）。",
          icon: "📊"
        }
      ]
    },
    
    {
      id: "ch13-s3",
      title: "2026 年最優混合策略：70/30 配置",
      type: "text",
      content: "不要 100% AI，也不要 100% 人工。最優解是 70% AI 自動化 + 30% 人工精製。",
      
      highlights: [
        { title: "互動率提升", value: "35-45%", color: "#10b981" },
        { title: "成本下降", value: "50-70%", color: "#3b82f6" },
        { title: "月度產量", value: "↑ 10 倍", color: "#FF8C42" }
      ],
      
      notes: [
        {
          type: "insight",
          title: "為什麼是 70/30？",
          content: "70% AI = 快速迭代、大量測試、找出爆款。30% 人工 = 質量把控、品牌調性、最終決策。",
          icon: "⚡"
        },
        {
          type: "tip",
          title: "實戰配置",
          content: "月度 30 支短影音：20 支 AI 生成（ShortGenius）+ 10 支人工精製（CapCut）。成本 $200-400/月，產量 30 支/月，成本/支 $7-13。",
          icon: "🎯"
        }
      ],
      
      expandable: [
        {
          title: "70% AI 自動化 - 具體做法",
          content: "1. 用 ShortGenius 一次產出 20 支短影音（1 小時）\n2. 用 AI 自動生成文案、字幕、配音\n3. 用 AI 自動 A/B 測試（測試 5 個 Hook 版本）\n4. 自動排程發布（根據最佳時段）\n5. 自動收集數據（追蹤完播率、互動率）"
        },
        {
          title: "30% 人工精製 - 具體做法",
          content: "1. 篩選 AI 生成的 20 支中最有潛力的 10 支\n2. 用 CapCut 進行最後微調（色調、字幕位置、音樂）\n3. 加入品牌元素（Logo、色彩、字體）\n4. 質量檢查（確保符合品牌調性）\n5. 發布到主要頻道（作為「旗艦內容」）"
        }
      ]
    }
  ]
};

// ============================================
// 第 14 章：廣告投放最新迭代
// ============================================

export const chapter14Enhanced = {
  id: "ch14",
  title: "拾肆、廣告投放最新迭代",
  subtitle: "2026 年 Meta + Google 廣告投放的最新策略",
  icon: "Rocket",
  color: "#F37021",
  audience: "企劃 + 營運",
  sections: [
    {
      id: "ch14-s1",
      title: "Meta 深層漏斗優化（DFO）- 2026 新功能",
      type: "diagram",
      content: "深層漏斗優化是 Meta 2026 年推出的新功能。不再只優化轉換，而是優化整個漏斗的每一層。",
      
      highlights: [
        { title: "轉換率提升", value: "20-40%", color: "#10b981" },
        { title: "CPA 下降", value: "15-25%", color: "#3b82f6" },
        { title: "ROAS 提升", value: "1.5-2 倍", color: "#FF8C42" }
      ],
      
      diagram: {
        type: "flowchart",
        code: `
          graph TD
            A["Awareness 層<br/>優化：觸及 + 完播率"] -->|優化信號| B["Consideration 層<br/>優化：點擊 + 加購率"]
            B -->|優化信號| C["Conversion 層<br/>優化：購買 + 復購率"]
            
            D["傳統方式<br/>只優化 Conversion"] -.->|結果：轉換率 5%| E["效果有限"]
            
            F["DFO 方式<br/>三層同時優化"] -->|結果：轉換率 8-10%| G["效果翻倍"]
            
            style A fill:#4ecdc4,stroke:#2a9d8f,color:#fff
            style B fill:#FF8C42,stroke:#e67e22,color:#fff
            style C fill:#10b981,stroke:#059669,color:#fff
            style G fill:#10b981,stroke:#059669,color:#fff,stroke-width:3px
        `
      },
      
      notes: [
        {
          type: "data",
          title: "2026 年 Meta 官方數據",
          content: "採用 DFO 的廣告主，轉換率平均提升 28%，CPA 下降 20%。",
          icon: "📊"
        },
        {
          type: "tip",
          title: "DFO 的核心邏輯",
          content: "不是「只優化最後一步」，而是「優化整個漏斗」。每一層都有瓶頸，找到瓶頸才能真正提升轉換。",
          icon: "🎯"
        }
      ]
    },
    
    {
      id: "ch14-s2",
      title: "AI 廣告創意自動化 - 100+ 變體自動測試",
      type: "table",
      content: "2026 年 AI 廣告創意已成熟。自動化測試 100+ 廣告變體，成本下降 13-25%。",
      
      highlights: [
        { title: "廣告變體", value: "100+", unit: "/月", color: "#FF8C42" },
        { title: "A/B 測試", value: "3-5 天", unit: "vs 2-3 週", color: "#10b981" },
        { title: "成本下降", value: "13-25%", color: "#3b82f6" }
      ],
      
      tableData: {
        headers: ["方式", "手動創意", "AI 自動化", "效率提升"],
        rows: [
          ["廣告變體", "5-10 個/月", "100+ 個/月", "↑ 10-20 倍"],
          ["A/B 測試", "2-3 週", "3-5 天", "↑ 4-7 倍"],
          ["成本", "$2000-5000", "$1500-3750", "↓ 13-25%"],
          ["勝率", "30-40%", "50-60%", "↑ 20-30%"]
        ]
      },
      
      notes: [
        {
          type: "insight",
          title: "AI 廣告創意的邏輯",
          content: "AI 不是「創意替代品」，而是「創意放大器」。人工出 1 個創意，AI 生成 100 個變體，自動測試找出最強的。",
          icon: "🤖"
        }
      ]
    },
    
    {
      id: "ch14-s3",
      title: "12 週完整執行計劃 - 從 0 到 ROI 3.5",
      type: "steps",
      content: "從系統建立到規模化的完整路徑。12 週達到 ROAS 3.5 的具體步驟。",
      
      highlights: [
        { title: "第 1-4 週", value: "建立期", unit: "ROAS 1.0-1.5", color: "#4ecdc4" },
        { title: "第 5-8 週", value: "成長期", unit: "ROAS 2.0-2.5", color: "#FF8C42" },
        { title: "第 9-12 週", value: "規模期", unit: "ROAS 3.0-3.5", color: "#10b981" }
      ],
      
      steps: [
        {
          title: "第 1-4 週：建立期 - 測試基礎",
          description: "目標：找到最優廣告素材 + 受眾組合\n\n【具體任務】\n- 製作 5 個廣告素材\n- 設定 DFO 三層漏斗\n- 測試 3-5 個受眾群體\n- 每日監控 ROAS\n\n【預期結果】\n- ROAS 1.0-1.5（可能虧損）\n- 找到 1-2 個表現最好的素材\n- 識別最有效的受眾",
          ai: "AI 生成 20+ 廣告文案變體、自動 A/B 測試"
        },
        {
          title: "第 5-8 週：成長期 - 擴大預算",
          description: "目標：擴大預算 20-30%，提升 ROAS\n\n【具體任務】\n- 擴大預算 20-30%\n- 測試新的廣告素材\n- 優化受眾定位\n- 調整 DFO 參數\n\n【預期結果】\n- ROAS 2.0-2.5（開始盈利）\n- 找到 3-5 個穩定的素材\n- 受眾成本下降 15-20%",
          ai: "AI 自動優化預算分配、自動生成新素材"
        },
        {
          title: "第 9-12 週：規模期 - 達到目標",
          description: "目標：達到 ROAS 3.0-3.5\n\n【具體任務】\n- 預算增加 50%\n- 測試新的轉換事件\n- 建立自動化優化規則\n- 準備下季度計劃\n\n【預期結果】\n- ROAS 3.0-3.5（穩定盈利）\n- 月度營收達到目標\n- 建立可複製的系統",
          ai: "AI 完全自動化優化、自動生成月報"
        }
      ],
      
      notes: [
        {
          type: "warning",
          title: "最常見的失敗",
          content: "第 1-4 週虧損後就放棄。實際上虧損是正常的，因為你在測試。堅持到第 5-8 週才會開始盈利。",
          icon: "⚠️"
        },
        {
          type: "tip",
          title: "加速達到 ROAS 3.5 的秘訣",
          content: "不要等 12 週。如果第 4 週 ROAS 已經 1.5，可以在第 5 週直接擴大預算 50%。好的素材會自動放大效果。",
          icon: "🚀"
        }
      ]
    }
  ]
};

export default {
  chapter11Enhanced,
  chapter12Enhanced,
  chapter13Enhanced,
  chapter14Enhanced
};
