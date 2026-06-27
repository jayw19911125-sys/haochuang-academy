import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, Send, Bot, User, Sparkles, ChevronDown, Lightbulb } from "lucide-react";

interface QAPair {
  question: string;
  answer: string;
}

interface AIAssistantProps {
  chapterId: string;
  chapterTitle: string;
}

// 每章的預設問答庫
const chapterFAQs: Record<string, QAPair[]> = {
  ch1: [
    { question: "產能防禦機制具體怎麼計算？", answer: "以現有 4 人核心團隊（CEO + COO + 剪輯師 + 企劃）的實際工時為基準。每人每月可用工時約 160 小時，扣除會議、行政、培訓後，實際產出工時約 120 小時/人。4 人 = 480 小時/月。每個標準方案客戶約需 40-60 小時/月，所以最大承載量約 8-12 個標準方案客戶。超過就必須拒絕或外包。" },
    { question: "為什麼要先收錢才開工？", answer: "三個原因：(1) 現金流保護 — 小團隊沒有資本墊付，一旦客戶拖款就會影響營運。(2) 篩選客戶 — 願意先付款的客戶通常更認真、配合度更高。(3) 心理承諾 — 付了錢的客戶會更積極配合，減少來回修改的時間成本。" },
    { question: "Monday.com 和 Slack 怎麼分工？", answer: "Monday.com = 數據庫（存資料、追進度、管流程）。Slack = 通知器（即時溝通、自動提醒、快速決策）。簡單記法：要「找資料」去 Monday，要「講話」去 Slack。絕對不要在 Slack 裡存重要資料，也不要在 Monday 裡聊天。" }
  ],
  ch2: [
    { question: "心智圖怎麼用來學習？", answer: "心智圖是「全景地圖」，不是「學習教材」。用法：(1) 先看心智圖了解整體結構，知道有哪些知識點。(2) 再逐章深入學習每個分支的細節。(3) 學完後回來看心智圖，確認自己是否覆蓋了所有知識點。(4) 用心智圖做自我評估 — 哪些分支你已經掌握，哪些還需要加強。" },
    { question: "5 大知識維度的學習順序是什麼？", answer: "建議順序：(1) 企劃職位教學（基礎）→ (2) 剪輯師完整教學（技術）→ (3) 短影音代操產業知識（商業）→ (4) AI Prompt 兵器庫（效率）→ (5) Manus 自動化工作流（進階）。前三個是「必修」，後兩個是「選修但強烈建議」。" },
    { question: "新人應該先學哪個？", answer: "看你的職位：企劃 → 從第一維度開始。剪輯師 → 從第二維度開始。但無論什麼職位，第一章「好創營運底層邏輯」都是必讀的，因為你需要理解公司怎麼運作。" }
  ],
  ch3: [
    { question: "社群飛輪怎麼啟動？", answer: "社群飛輪的啟動順序：(1) 先產出 10-20 支高品質內容（累積素材庫）。(2) 觀察哪些內容有自然互動（找到受眾偏好）。(3) 加大該類型內容的產出（放大成功模式）。(4) 互動帶來更多觸及 → 觸及帶來更多粉絲 → 粉絲帶來更多互動。關鍵：前 1-2 個月是「推動期」，需要持續產出不看數據。第 3 個月開始才會看到飛輪效應。" },
    { question: "內容矩陣怎麼設計？", answer: "好創的內容矩陣公式：知識型 60% + 娛樂型 25% + 轉換型 15%。知識型 = 教觀眾東西（建立信任）。娛樂型 = 讓觀眾開心（擴大觸及）。轉換型 = 讓觀眾行動（產生營收）。不要一開始就發轉換型內容，先用知識型和娛樂型累積信任。" }
  ],
  ch4: [
    { question: "企劃 Level 1 到 Level 4 要多久？", answer: "正常進度：Level 1（1-2 週）→ Level 2（1-2 個月）→ Level 3（3-6 個月）→ Level 4（1 年以上）。但這取決於：(1) 每天實際產出量。(2) 是否有主管即時反饋。(3) 是否有用 AI 加速學習。用 AI 輔助的話，Level 1 → Level 2 可以壓縮到 2-3 週。" },
    { question: "企劃和剪輯師的協作邊界在哪？", answer: "企劃負責：選題、腳本、Hook 設計、CTA 設計、發布時間、數據分析。剪輯師負責：畫面節奏、轉場、音效、字幕樣式、色調、輸出規格。灰色地帶（需要溝通）：BGM 選擇、特效程度、影片長度。原則：企劃決定「說什麼」，剪輯師決定「怎麼呈現」。" },
    { question: "2026 年演算法最重要的指標是什麼？", answer: "2026 年 Meta 演算法三大核心指標：(1) 完播率（最重要）— 看完的人越多，推送越廣。(2) 複看率 — 重複觀看代表內容有深度價值。(3) 互動品質 — 「誰」在互動比「多少」互動更重要。Power Like（有影響力的帳號互動）價值是普通互動的 5-10 倍。" }
  ],
  ch5: [
    { question: "短影音標準工作流要多久？", answer: "好創標準工作流時間分配：選題（30 分鐘）→ 腳本（1 小時）→ 拍攝（3 小時含準備）→ 剪輯（2-4 小時）→ 審核修改（30 分鐘）→ 發布排程（15 分鐘）。總計：約 7-9 小時/支。用 AI 加速版：選題（10 分鐘）→ 腳本（20 分鐘）→ 拍攝（3 小時）→ 剪輯（1-2 小時）→ 審核（15 分鐘）→ 發布（5 分鐘）。總計：約 4-6 小時/支。" },
    { question: "一個月要產出多少支影片？", answer: "根據好創的產能防禦機制：每個客戶每月 8-12 支（標準方案）。每位企劃每月可負責 2-3 個客戶 = 16-36 支/月。每位剪輯師每月可處理 20-30 支。所以 4 人團隊的月產能上限約 30-40 支短影音。" }
  ],
  ch6: [
    { question: "CapCut 和 Premiere Pro 怎麼選？", answer: "選擇邏輯：CapCut = 快速、簡單、適合短影音（15-60 秒）。Premiere Pro = 專業、精細、適合長影片或高品質需求。好創的標準：日常短影音 → CapCut（效率優先）。品牌形象片 / 廣告素材 → Premiere Pro（品質優先）。新人建議：先學 CapCut（1 週上手），再學 Premiere Pro（1 個月熟練）。" },
    { question: "剪輯師最常犯的錯誤是什麼？", answer: "Top 5 錯誤：(1) 節奏太慢 — 前 3 秒沒有變化，觀眾直接滑走。(2) 字幕太小 — 手機觀看時看不清楚。(3) 音樂蓋過人聲 — BGM 音量應該是人聲的 20-30%。(4) 沒有「呼吸感」— 畫面切換太密集，觀眾疲勞。(5) 結尾太突然 — 沒有給 CTA 足夠的停留時間。" }
  ],
  ch7: [
    { question: "AI 能取代剪輯師嗎？", answer: "2026 年的答案：不能完全取代，但能大幅提升效率。AI 能做的：自動字幕、自動調色、自動去背、自動配樂、粗剪。AI 不能做的：節奏感判斷、情緒把控、品牌風格一致性、創意轉場。結論：AI 是「加速器」不是「替代品」。好的剪輯師 + AI = 3 倍產能。" },
    { question: "哪些 AI 功能最實用？", answer: "剪輯師必用的 AI 功能 Top 5：(1) 自動字幕（省 30 分鐘/支）。(2) 自動調色（省 15 分鐘/支）。(3) AI 去背（省 20 分鐘/支）。(4) 智能裁切（一鍵適配多平台比例）。(5) AI 配樂推薦（省 10 分鐘/支）。合計每支影片省 1-1.5 小時。" }
  ],
  ch8: [
    { question: "Manus 和 ChatGPT 有什麼不同？", answer: "核心差異：ChatGPT = 對話式 AI（你問一句它答一句）。Manus = 自動化 AI Agent（你給目標它自己完成整個流程）。使用場景：ChatGPT → 發散思考、靈感生成、快速問答。Manus → 批量生成、自動排程、系統化工作流。好創的用法：先用 ChatGPT 想點子 → 用 Claude 優化邏輯 → 用 Manus 批量執行。" },
    { question: "Manus 自動化能做到什麼程度？", answer: "Manus 在好創的應用場景：(1) 批量生成一週的內容排程（5 分鐘完成原本 2 小時的工作）。(2) 自動分析競品內容並產出報告。(3) 批量生成廣告素材變體（10 個版本同時產出）。(4) 自動化社群健檢（每週自動產出數據報告）。(5) 一鍵生成客戶提案簡報。限制：不能取代「人的判斷」，最終決策仍需要人工審核。" }
  ]
};

// 通用問答（適用於所有章節）
const generalFAQs: QAPair[] = [
  { question: "這章的重點是什麼？", answer: "請回到章節頂部查看「subtitle」描述，那就是本章的核心重點。每章都圍繞一個核心能力展開，建議先理解整體結構再深入細節。" },
  { question: "我看不懂怎麼辦？", answer: "三個建議：(1) 先跳過，繼續往下看，有時候後面的內容會幫助理解前面的。(2) 用 ChatGPT 把你看不懂的段落貼進去，請它用更簡單的方式解釋。(3) 在 Slack 的 #學習討論 頻道提問，COO 或其他同事會回答。" },
  { question: "學完這章要多久？", answer: "每章建議學習時間：快速瀏覽 = 15-20 分鐘。深度學習 = 1-2 小時。實作練習 = 額外 2-4 小時。建議：第一遍快速瀏覽，標記不懂的地方。第二遍深度學習，搭配實作。" }
];

export default function AIAssistant({ chapterId, chapterTitle }: AIAssistantProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: "user" | "assistant"; content: string }[]>([]);
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const chapterQAs = chapterFAQs[chapterId] || [];
  const allQAs = [...chapterQAs, ...generalFAQs];

  const suggestedQuestions = chapterQAs.length > 0 
    ? chapterQAs.slice(0, 3).map(q => q.question)
    : generalFAQs.slice(0, 3).map(q => q.question);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleAsk = (question: string) => {
    if (!question.trim()) return;

    // Add user message
    setMessages(prev => [...prev, { role: "user", content: question }]);
    setInputValue("");

    // Find answer
    const matchedQA = allQAs.find(qa => 
      qa.question === question || 
      qa.question.includes(question) || 
      question.includes(qa.question.slice(0, 10))
    );

    // Simulate typing delay
    setTimeout(() => {
      if (matchedQA) {
        setMessages(prev => [...prev, { role: "assistant", content: matchedQA.answer }]);
      } else {
        setMessages(prev => [...prev, { 
          role: "assistant", 
          content: `關於「${question}」，建議你：\n\n1. 重新閱讀本章相關段落，答案可能就在內容中。\n2. 點擊下方的預設問題，看看是否有相關的解答。\n3. 如果還是不懂，在 Slack #學習討論 頻道提問，COO 會親自回答。\n\n💡 提示：試試點擊下方的建議問題，我有更完整的回答。` 
        }]);
      }
    }, 500);
  };

  return (
    <div className="mt-8">
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between p-4 rounded-xl transition-all duration-300 ${
          isOpen 
            ? "glass-card border-[#F37021]/30" 
            : "glass-card hover:border-[#F37021]/20"
        }`}
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500/20 to-[#F37021]/20 flex items-center justify-center">
            <Bot size={16} className="text-[#F37021]" />
          </div>
          <div className="text-left">
            <span className="text-sm font-semibold text-foreground">AI 學習助手</span>
            <p className="text-[10px] text-muted-foreground">針對本章內容提問，即時獲得解答</p>
          </div>
        </div>
        <ChevronDown size={16} className={`text-muted-foreground transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {/* Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
            className="overflow-hidden"
          >
            <div className="glass-card mt-2 overflow-hidden">
              {/* Messages Area */}
              <div className="max-h-80 overflow-y-auto p-4 space-y-3">
                {messages.length === 0 && (
                  <div className="text-center py-6">
                    <Sparkles size={24} className="mx-auto text-[#F37021]/40 mb-3" />
                    <p className="text-sm text-muted-foreground">有什麼關於「{chapterTitle.replace(/^[壹貳參肆伍陸柒捌玖拾百千]+、/, "")}」的問題嗎？</p>
                    <p className="text-[10px] text-muted-foreground/60 mt-1">點擊下方建議問題，或自行輸入</p>
                  </div>
                )}

                {messages.map((msg, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className={`flex gap-2.5 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    {msg.role === "assistant" && (
                      <div className="flex-shrink-0 w-6 h-6 rounded-md bg-[#F37021]/10 flex items-center justify-center mt-0.5">
                        <Bot size={12} className="text-[#F37021]" />
                      </div>
                    )}
                    <div className={`max-w-[80%] px-3.5 py-2.5 rounded-xl text-xs leading-relaxed ${
                      msg.role === "user" 
                        ? "bg-[#F37021]/15 text-foreground rounded-br-sm" 
                        : "bg-border/20 text-foreground/90 rounded-bl-sm"
                    }`}>
                      <p className="whitespace-pre-line">{msg.content}</p>
                    </div>
                    {msg.role === "user" && (
                      <div className="flex-shrink-0 w-6 h-6 rounded-md bg-border/30 flex items-center justify-center mt-0.5">
                        <User size={12} className="text-muted-foreground" />
                      </div>
                    )}
                  </motion.div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Suggested Questions */}
              <div className="px-4 pb-3 flex flex-wrap gap-1.5">
                {suggestedQuestions.map((q, i) => (
                  <button
                    key={i}
                    onClick={() => handleAsk(q)}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[10px] font-medium bg-border/15 text-muted-foreground hover:text-foreground hover:bg-[#F37021]/10 hover:text-[#F37021] transition-all duration-200 border border-border/20 hover:border-[#F37021]/30"
                  >
                    <Lightbulb size={10} />
                    {q.length > 20 ? q.slice(0, 20) + "..." : q}
                  </button>
                ))}
              </div>

              {/* Input Area */}
              <div className="px-4 pb-4">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter" && !e.nativeEvent.isComposing) handleAsk(inputValue); }}
                    placeholder="輸入你的問題..."
                    className="flex-1 px-3.5 py-2.5 rounded-lg bg-border/20 border border-border/30 text-xs text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-[#F37021]/50 focus:ring-1 focus:ring-[#F37021]/20 transition-all"
                  />
                  <button
                    onClick={() => handleAsk(inputValue)}
                    disabled={!inputValue.trim()}
                    className="px-3.5 py-2.5 rounded-lg bg-[#F37021] text-white text-xs font-medium hover:bg-[#FF8C42] disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200 active:scale-95"
                  >
                    <Send size={14} />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
