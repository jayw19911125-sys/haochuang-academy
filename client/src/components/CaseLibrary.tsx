import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Tag, TrendingUp, Eye, Heart, Share2, Filter, X, Target, Zap } from "lucide-react";

interface CaseStudy {
  id: string;
  title: string;
  client: string;
  industry: string;
  platform: "Instagram" | "TikTok" | "YouTube" | "Facebook" | "多平台";
  type: "品牌曝光" | "導購轉換" | "粉絲增長" | "互動提升" | "私域引流";
  result: string;
  metrics: { label: string; value: string; change?: string }[];
  strategy: string;
  aiTools: string[];
  duration: string;
  tags: string[];
}

const caseStudies: CaseStudy[] = [
  {
    id: "case-1",
    title: "餐飲品牌 Reels 爆款系列",
    client: "高雄某連鎖餐飲（已脫敏）",
    industry: "餐飲",
    platform: "Instagram",
    type: "品牌曝光",
    result: "單支 Reels 觸及 120 萬，帶動門店來客數增加 35%",
    metrics: [
      { label: "觸及人數", value: "1,200,000", change: "+580%" },
      { label: "互動率", value: "8.7%", change: "+320%" },
      { label: "完播率", value: "72%", change: "+45%" },
      { label: "門店來客", value: "+35%", change: "vs 上月" }
    ],
    strategy: "運用「反差感 Hook」+ 美食 ASMR + 限時優惠 CTA。前 2 秒用「老闆說這道菜再賣就要虧錢了」製造好奇心，中段展示料理過程的療癒畫面，結尾用「只有看到這支影片的人才有」製造稀缺感。",
    aiTools: ["ChatGPT 生成 30 個 Hook 變體", "Claude 優化腳本邏輯", "Manus 批量生成一週排程"],
    duration: "2 週",
    tags: ["Hook 設計", "ASMR", "限時優惠", "反差感"]
  },
  {
    id: "case-2",
    title: "電商品牌 TikTok 導購",
    client: "台灣某保養品牌（已脫敏）",
    industry: "美妝保養",
    platform: "TikTok",
    type: "導購轉換",
    result: "ROAS 4.8，單月廣告營收 NT$280 萬",
    metrics: [
      { label: "ROAS", value: "4.8", change: "+160%" },
      { label: "廣告營收", value: "NT$2.8M", change: "單月" },
      { label: "CPA", value: "NT$89", change: "-42%" },
      { label: "轉換率", value: "3.2%", change: "+85%" }
    ],
    strategy: "採用「素人真實體驗」形式，不用精緻畫面，用 iPhone 手持拍攝。Hook 用「我媽問我最近皮膚怎麼變好的」引發共鳴，中段展示使用過程和 Before/After，結尾直接導購連結。投放時用 Advantage+ 自動優化受眾。",
    aiTools: ["ChatGPT 分析競品廣告文案", "Claude 撰寫 A/B 測試版本", "Manus 自動生成素材變體"],
    duration: "1 個月",
    tags: ["素人感", "Before/After", "Advantage+", "低 CPA"]
  },
  {
    id: "case-3",
    title: "個人 IP 粉絲增長計畫",
    client: "高雄某健身教練（已脫敏）",
    industry: "健身",
    platform: "多平台",
    type: "粉絲增長",
    result: "3 個月從 2,000 粉增長到 15,000 粉",
    metrics: [
      { label: "粉絲增長", value: "+13,000", change: "3 個月" },
      { label: "平均觸及", value: "50,000", change: "/支" },
      { label: "私訊詢問", value: "120+", change: "/月" },
      { label: "課程轉換", value: "28 人", change: "新學員" }
    ],
    strategy: "建立「知識型 + 娛樂型」雙軌內容矩陣。知識型（60%）：用「你以為 vs 事實」的反差結構教健身知識。娛樂型（40%）：用健身房日常的搞笑片段吸引新受眾。每週 5 支影片，TikTok 首發 → Reels 二發 → Shorts 三發。",
    aiTools: ["ChatGPT 生成選題矩陣", "Claude 優化知識型腳本", "Manus 批量排程三平台"],
    duration: "3 個月",
    tags: ["個人 IP", "雙軌矩陣", "多平台分發", "知識型"]
  },
  {
    id: "case-4",
    title: "B2B 企業 LinkedIn 互動提升",
    client: "台灣某 SaaS 公司（已脫敏）",
    industry: "科技",
    platform: "Facebook",
    type: "互動提升",
    result: "貼文互動率從 0.8% 提升到 5.2%",
    metrics: [
      { label: "互動率", value: "5.2%", change: "+550%" },
      { label: "留言數", value: "45+", change: "/篇" },
      { label: "分享數", value: "28+", change: "/篇" },
      { label: "詢問轉換", value: "12 筆", change: "/月" }
    ],
    strategy: "從「公司新聞型」轉為「產業觀點型」內容。每篇貼文用「爭議性觀點」開頭引發討論，中段用數據佐證，結尾用開放式問題邀請留言。搭配員工帳號互動放大觸及。",
    aiTools: ["ChatGPT 生成產業觀點", "Claude 撰寫數據分析", "Manus 排程 + 互動監控"],
    duration: "2 個月",
    tags: ["B2B", "觀點型", "互動設計", "員工放大"]
  },
  {
    id: "case-5",
    title: "美業品牌私域引流系統",
    client: "高雄某美甲連鎖（已脫敏）",
    industry: "美業",
    platform: "Instagram",
    type: "私域引流",
    result: "LINE 好友從 800 增長到 3,200，回購率提升 40%",
    metrics: [
      { label: "LINE 好友", value: "+2,400", change: "4 個月" },
      { label: "回購率", value: "68%", change: "+40%" },
      { label: "客單價", value: "NT$1,800", change: "+25%" },
      { label: "月營收", value: "+NT$180K", change: "增量" }
    ],
    strategy: "建立「公域吸引 → 私域沉澱 → 轉換變現」三段式閉環。公域用「美甲教學 + 作品展示」吸引新粉，每支影片結尾用「私訊領取色卡」引導加 LINE。LINE 內用分眾標籤 + 自動化訊息推送促進回購。",
    aiTools: ["ChatGPT 設計引流話術", "Claude 建立分眾標籤邏輯", "Manus 自動化 LINE 推送排程"],
    duration: "4 個月",
    tags: ["私域", "LINE 引流", "分眾推送", "回購"]
  }
];

const platforms = ["全部", "Instagram", "TikTok", "YouTube", "Facebook", "多平台"];
const types = ["全部", "品牌曝光", "導購轉換", "粉絲增長", "互動提升", "私域引流"];
const industries = ["全部", "餐飲", "美妝保養", "健身", "科技", "美業"];

export default function CaseLibrary() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPlatform, setSelectedPlatform] = useState("全部");
  const [selectedType, setSelectedType] = useState("全部");
  const [selectedIndustry, setSelectedIndustry] = useState("全部");
  const [expandedCase, setExpandedCase] = useState<string | null>(null);

  const filteredCases = useMemo(() => {
    return caseStudies.filter(c => {
      const matchSearch = searchQuery === "" || 
        c.title.includes(searchQuery) || 
        c.strategy.includes(searchQuery) ||
        c.tags.some(t => t.includes(searchQuery));
      const matchPlatform = selectedPlatform === "全部" || c.platform === selectedPlatform;
      const matchType = selectedType === "全部" || c.type === selectedType;
      const matchIndustry = selectedIndustry === "全部" || c.industry === selectedIndustry;
      return matchSearch && matchPlatform && matchType && matchIndustry;
    });
  }, [searchQuery, selectedPlatform, selectedType, selectedIndustry]);

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedPlatform("全部");
    setSelectedType("全部");
    setSelectedIndustry("全部");
  };

  const hasActiveFilters = searchQuery || selectedPlatform !== "全部" || selectedType !== "全部" || selectedIndustry !== "全部";

  return (
    <div className="space-y-6">
      {/* Search & Filter Bar */}
      <div className="glass-card p-4 space-y-4">
        {/* Search */}
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="搜尋案例（關鍵字、策略、標籤...）"
            className="w-full pl-9 pr-4 py-2.5 rounded-lg bg-border/20 border border-border/30 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-[#F37021]/50 focus:ring-1 focus:ring-[#F37021]/20 transition-all"
          />
        </div>

        {/* Filter Tabs */}
        <div className="space-y-3">
          {/* Platform */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium w-10">平台</span>
            {platforms.map(p => (
              <button
                key={p}
                onClick={() => setSelectedPlatform(p)}
                className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-all duration-200 ${
                  selectedPlatform === p 
                    ? "bg-[#F37021]/15 text-[#F37021] border border-[#F37021]/30" 
                    : "text-muted-foreground hover:text-foreground hover:bg-border/20 border border-transparent"
                }`}
              >
                {p}
              </button>
            ))}
          </div>

          {/* Type */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium w-10">類型</span>
            {types.map(t => (
              <button
                key={t}
                onClick={() => setSelectedType(t)}
                className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-all duration-200 ${
                  selectedType === t 
                    ? "bg-[#F37021]/15 text-[#F37021] border border-[#F37021]/30" 
                    : "text-muted-foreground hover:text-foreground hover:bg-border/20 border border-transparent"
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Industry */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium w-10">產業</span>
            {industries.map(ind => (
              <button
                key={ind}
                onClick={() => setSelectedIndustry(ind)}
                className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-all duration-200 ${
                  selectedIndustry === ind 
                    ? "bg-[#F37021]/15 text-[#F37021] border border-[#F37021]/30" 
                    : "text-muted-foreground hover:text-foreground hover:bg-border/20 border border-transparent"
                }`}
              >
                {ind}
              </button>
            ))}
          </div>
        </div>

        {/* Active Filters Clear */}
        {hasActiveFilters && (
          <div className="flex items-center justify-between pt-2 border-t border-border/20">
            <span className="text-[11px] text-muted-foreground">
              找到 {filteredCases.length} 個案例
            </span>
            <button
              onClick={clearFilters}
              className="flex items-center gap-1 text-[11px] text-[#F37021] hover:text-[#FF8C42] transition-colors"
            >
              <X size={12} /> 清除篩選
            </button>
          </div>
        )}
      </div>

      {/* Case Cards */}
      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {filteredCases.map((cs, idx) => (
            <motion.div
              key={cs.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3, delay: idx * 0.05 }}
              className="glass-card overflow-hidden"
            >
              {/* Case Header */}
              <button
                onClick={() => setExpandedCase(expandedCase === cs.id ? null : cs.id)}
                className="w-full p-5 text-left hover:bg-border/5 transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-[#F37021]/10 text-[#F37021]">
                        {cs.platform}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-blue-500/10 text-blue-400">
                        {cs.type}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-green-500/10 text-green-400">
                        {cs.industry}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-foreground">{cs.title}</h4>
                    <p className="text-[11px] text-muted-foreground mt-1">{cs.client} · {cs.duration}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-xs font-bold text-green-400">{cs.result.split("，")[0]}</p>
                  </div>
                </div>

                {/* Metrics Preview */}
                <div className="grid grid-cols-4 gap-2 mt-4">
                  {cs.metrics.map((m, i) => (
                    <div key={i} className="text-center p-2 rounded-lg bg-border/10">
                      <div className="text-[10px] text-muted-foreground">{m.label}</div>
                      <div className="text-xs font-bold text-foreground mt-0.5">{m.value}</div>
                      {m.change && <div className="text-[9px] text-green-400">{m.change}</div>}
                    </div>
                  ))}
                </div>
              </button>

              {/* Expanded Content */}
              <AnimatePresence>
                {expandedCase === cs.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 pb-5 space-y-4 border-t border-border/20 pt-4">
                      {/* Strategy */}
                      <div>
                        <h5 className="text-xs font-semibold text-foreground mb-2 flex items-center gap-1.5">
                          <Target size={12} className="text-[#F37021]" /> 策略拆解
                        </h5>
                        <p className="text-[11px] text-muted-foreground leading-relaxed">{cs.strategy}</p>
                      </div>

                      {/* AI Tools Used */}
                      <div>
                        <h5 className="text-xs font-semibold text-foreground mb-2 flex items-center gap-1.5">
                          <Zap size={12} className="text-purple-400" /> AI 工具應用
                        </h5>
                        <div className="space-y-1.5">
                          {cs.aiTools.map((tool, i) => (
                            <div key={i} className="flex items-center gap-2 text-[11px] text-muted-foreground">
                              <div className="w-1 h-1 rounded-full bg-purple-400" />
                              {tool}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Tags */}
                      <div className="flex items-center gap-1.5 flex-wrap pt-2 border-t border-border/10">
                        <Tag size={10} className="text-muted-foreground" />
                        {cs.tags.map(tag => (
                          <span key={tag} className="px-2 py-0.5 rounded text-[9px] bg-border/20 text-muted-foreground">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </AnimatePresence>

        {filteredCases.length === 0 && (
          <div className="glass-card p-8 text-center">
            <Search size={24} className="mx-auto text-muted-foreground/30 mb-3" />
            <p className="text-sm text-muted-foreground">沒有找到符合條件的案例</p>
            <button onClick={clearFilters} className="text-xs text-[#F37021] mt-2 hover:underline">
              清除所有篩選
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
