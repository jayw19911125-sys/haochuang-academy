import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, Send, X, MessageCircle, Copy, CheckCircle2, Film, Sparkles } from "lucide-react";

interface AIAssistantProps {
  chapterId: string;
  chapterTitle: string;
}

interface Message {
  role: "user" | "assistant";
  content: string;
}

// 每章的 FAQ 知識庫
const chapterFAQs: Record<string, { q: string; a: string }[]> = {
  ch1: [
    { q: "好創的收款鐵則是什麼？", a: "先收錢才開工，沒有例外。社群類專案：執行前收當月全款。網站專案：收 50% 訂金開工，驗收無誤收 50% 尾款。混合專案：按項目拆分。" },
    { q: "產能防禦機制怎麼運作？", a: "所有專案排程、產出量、定價推演，強制以「4 人核心團隊」現有承載力為計算底層。超出產能時必須拒絕或外包，絕不降低品質或假設擴張。" },
    { q: "好創的工具棧有哪些？", a: "Monday.com（CRM/專案/SOP 數據庫）、Slack（溝通/通知器）、Notion（知識庫）、Google Drive（檔案）、GitHub（全局知識地圖）、Manus（AI 自動化）。" },
    { q: "好創的核心服務有哪些？", a: "網站架設、SEO/AIO/GEO、短影音、商業攝影、廣告投放、品牌視覺、社群行銷。高階形象影片非主力，大型案採統包整合逐案拆帳。" }
  ],
  ch2: [
    { q: "心智圖怎麼使用？", a: "先看全景了解 5 大維度 → 逐章深入學習 → 學完回來自我評估覆蓋率 → 做章末考核測驗驗證理解程度。" },
    { q: "5 大知識維度是什麼？", a: "1. 企劃職位教學（Level 1-4）2. 剪輯師完整教學（CapCut/Premiere/DaVinci）3. 短影音代操產業知識 4. AI Prompt 兵器庫 5. Manus 自動化工作流" },
    { q: "建議的學習順序？", a: "企劃（基礎）→ 剪輯（技術）→ 產業知識（商業）→ AI Prompt（效率）→ Manus 自動化（進階）。前三個必修，後兩個選修但強烈建議。" }
  ],
  ch3: [
    { q: "社群飛輪效應是什麼？", a: "內容（產出）→ 觸及（被看到）→ 互動（被喜歡）→ 轉換（被購買）→ 再投入（更多內容）。前 1-2 個月是推動期，第 3 個月開始顯現。" },
    { q: "內容矩陣比例是什麼？", a: "知識型 60%（建立信任）+ 娛樂型 25%（擴大觸及）+ 轉換型 15%（產生營收）。不要一開始就發轉換型內容。" },
    { q: "飛輪啟動期該怎麼做？", a: "持續產出高品質內容，不被數據影響。先累積 10-20 支高品質內容，觀察哪些有自然互動，再放大成功模式。" }
  ],
  ch4: [
    { q: "企劃的 Level 進階標準？", a: "Level 1（執行者）→ Level 2（策略者）→ Level 3（操盤手）→ Level 4（商業顧問）。正常 1-2 個月升一級，AI 輔助可壓縮到 2-3 週。" },
    { q: "2026 演算法最重要的指標？", a: "完播率（最重要）、複看率（決定長期推送）、互動品質（誰在互動比多少互動重要）。Power Like 價值是普通互動的 5-10 倍。" },
    { q: "企劃和剪輯的協作邊界？", a: "企劃負責「說什麼」：選題、腳本、Hook、CTA。剪輯師負責「怎麼呈現」：畫面節奏、轉場、音效、字幕。" }
  ],
  ch5: [
    { q: "一支短影音的標準製作時間？", a: "標準版：約 7-9 小時/支。AI 加速版：約 4-6 小時/支。主要節省在選題、腳本、剪輯環節。拍攝環節無法用 AI 替代。" },
    { q: "4 人團隊月產能上限？", a: "約 30-40 支/月。超出必須拒絕或安排外包資源，這是產能防禦機制的底線。" },
    { q: "腳本標準結構是什麼？", a: "Hook（前 2 秒抓注意力）→ Body（中段傳遞價值）→ CTA（結尾引導行動）。每段都有明確的目的和設計原則。" }
  ],
  ch6: [
    { q: "日常短影音用什麼軟體？", a: "日常短影音 → CapCut（效率優先，1 週上手）。品牌形象片/廣告素材 → Premiere Pro（品質優先，1 個月熟練）。" },
    { q: "剪輯最常犯的錯誤？", a: "Top 1：節奏太慢（前 3 秒沒變化）。Top 2：BGM 太大聲（應為人聲的 20-30%）。Top 3：缺乏呼吸感（畫面切換太密集）。" }
  ],
  ch7: [
    { q: "AI 能取代剪輯師嗎？", a: "不能完全取代。AI 能做：自動字幕、調色、去背、配樂、粗剪。不能做：節奏感判斷、情緒把控、品牌風格一致性、創意轉場。好的剪輯師 + AI = 3 倍產能。" },
    { q: "AI 每支影片省多少時間？", a: "合計省 1-1.5 小時：自動字幕（30 分鐘）+ 自動調色（15 分鐘）+ AI 去背（20 分鐘）+ 智能裁切 + AI 配樂。" }
  ],
  ch8: [
    { q: "AI 工具使用順序？", a: "ChatGPT 想點子（發散）→ Claude 優化邏輯（收斂）→ Manus 批量執行（自動化）。三者各有專長，不可互換。" },
    { q: "Manus 和 ChatGPT 的差異？", a: "ChatGPT = 對話式 AI（你問一句它答一句）。Manus = 自動化 AI Agent（你給目標它自己完成整個流程）。Manus 5 分鐘完成原本 2 小時的排程工作。" },
    { q: "AI 資安底線是什麼？", a: "絕對禁止貼入：客戶個資、合約金額、內部財務數據、員工薪資。違反即時通報 COO。" }
  ]
};

// 通用 FAQ
const generalFAQs: { q: string; a: string }[] = [
  { q: "好創的定位是什麼？", a: "整合行銷、內容營運、IP 經營、商業結果導向的「可擴張內容營運公司」。拒絕單點接案。" },
  { q: "新人第一天該做什麼？", a: "1. 讀完第一章（好創營運底層邏輯）2. 看心智圖了解全景 3. 設定 Monday.com 和 Slack 帳號 4. 開始第一章考核測驗" }
];

// 短影音腳本專屬提問
const scriptPrompts: { label: string; question: string }[] = [
  { label: "Hook 設計", question: "幫我設計 5 個不同風格的短影音 Hook（前 2 秒），要能讓觀眾停下來看" },
  { label: "腳本結構", question: "幫我寫一支 30 秒短影音的完整腳本，包含 Hook、Body、CTA 三段結構" },
  { label: "CTA 設計", question: "幫我設計 3 種不同的 CTA（行動呼籲），要能引導觀眾留言或私訊" },
  { label: "選題發想", question: "根據好創的內容矩陣（知識 60% + 娛樂 25% + 轉換 15%），幫我發想本週 5 支影片的選題" },
  { label: "反差 Hook", question: "幫我用「反差感」設計 3 個 Hook，要製造好奇心讓觀眾想看下去" },
  { label: "完播率優化", question: "這支影片的完播率只有 30%，幫我分析可能的原因，並給出改善建議" }
];

export default function AIAssistant({ chapterId, chapterTitle }: AIAssistantProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [showScriptPrompts, setShowScriptPrompts] = useState(false);

  const faqs = [...(chapterFAQs[chapterId] || []), ...generalFAQs];

  const handleAsk = (question: string) => {
    if (!question.trim()) return;
    
    const userMsg: Message = { role: "user", content: question };
    
    // Find matching FAQ
    const match = faqs.find(f => 
      question.includes(f.q) || f.q.includes(question) ||
      question.split("").filter(c => f.q.includes(c)).length > question.length * 0.5
    );

    // Check script prompts
    const scriptMatch = scriptPrompts.find(sp => question === sp.question);

    let answer: string;
    if (match) {
      answer = match.a;
    } else if (scriptMatch) {
      answer = getScriptAnswer(scriptMatch.label);
    } else {
      answer = `關於「${question}」的問題，建議你：\n\n1. 查看本章相關段落的詳細說明\n2. 使用上方的「建議問題」按鈕獲取精準回答\n3. 如果是實戰問題，可以參考「實戰案例庫」中的類似案例\n\n💡 提示：AI 學習助手的回答基於好創內部知識庫，如需更深入的指導，請直接詢問 COO。`;
    }

    const assistantMsg: Message = { role: "assistant", content: answer };
    setMessages(prev => [...prev, userMsg, assistantMsg]);
    setInputValue("");
  };

  const getScriptAnswer = (type: string): string => {
    const answers: Record<string, string> = {
      "Hook 設計": "以下是 5 種不同風格的 Hook 設計：\n\n1. 【反差型】「老闆說這個月業績再不好就要收掉了...結果」\n2. 【疑問型】「為什麼 90% 的人做短影音都失敗？因為他們忽略了這一點」\n3. 【數據型】「我用這個方法，7 天內觸及從 500 變成 50,000」\n4. 【痛點型】「你是不是也覺得拍了很多影片但都沒人看？」\n5. 【稀缺型】「這個技巧我只跟付費學員講，今天免費分享」\n\n💡 設計原則：前 2 秒必須製造「好奇心」或「衝突感」，讓觀眾的大腦產生「接下來呢？」的反應。",
      "腳本結構": "30 秒短影音完整腳本模板：\n\n【Hook（0-2 秒）】\n「你知道為什麼你的影片都沒人看嗎？」\n→ 目的：製造好奇心，阻止滑走\n\n【Body（3-22 秒）】\n「因為 90% 的人都犯了這三個錯誤：\n第一，前 3 秒沒有變化\n第二，節奏太慢觀眾等不了\n第三，沒有給觀眾一個看完的理由」\n→ 目的：傳遞價值，維持注意力\n\n【CTA（23-30 秒）】\n「如果你想知道怎麼解決，留言『教我』我私訊你完整攻略」\n→ 目的：引導行動，產生互動\n\n💡 記住：每一秒都要有存在的理由，刪掉所有「廢話」。",
      "CTA 設計": "3 種不同風格的 CTA：\n\n1. 【互動型 CTA】\n「你覺得哪個方法最有效？留言 1 或 2 告訴我」\n→ 適合：提升互動率、增加留言數\n\n2. 【私訊型 CTA】\n「想要完整的模板？私訊我『模板』免費領取」\n→ 適合：私域引流、收集潛在客戶\n\n3. 【追蹤型 CTA】\n「追蹤我，下一支教你更進階的技巧」\n→ 適合：粉絲增長、建立期待感\n\n💡 原則：一支影片只放一個 CTA，多了觀眾會選擇困難。",
      "選題發想": "本週 5 支影片選題（按內容矩陣分配）：\n\n【知識型 × 3】\n1. 「2026 年 IG 演算法最重要的 3 個指標（你可能只知道 1 個）」\n2. 「為什麼你的完播率只有 20%？3 個馬上能改的技巧」\n3. 「AI 工具怎麼用才對？好創內部的 3 步驟流程」\n\n【娛樂型 × 1】\n4. 「行銷公司的日常 vs 客戶以為的日常（反差搞笑）」\n\n【轉換型 × 1】\n5. 「我們幫客戶做到 ROAS 4.8 的真實案例拆解（限時分享）」\n\n💡 排程建議：週一三五發知識型，週二發娛樂型，週四發轉換型。",
      "反差 Hook": "3 個「反差感」Hook 設計：\n\n1. 【期望 vs 現實】\n「客戶說預算無上限...結果報價單一出」\n→ 利用「期望落差」製造好奇心\n\n2. 【常識 vs 真相】\n「大家都說要每天發文才有流量，但真相是...」\n→ 挑戰「常識」引發認知衝突\n\n3. 【Before vs After】\n「這個帳號一個月前只有 200 粉，現在...」\n→ 用「數據反差」證明可能性\n\n💡 反差感的本質：打破觀眾的預期，讓大腦產生「不對勁」的感覺，從而想知道答案。",
      "完播率優化": "完播率只有 30% 的可能原因：\n\n【問題診斷】\n1. 前 2 秒沒有 Hook → 觀眾直接滑走\n2. 3-10 秒節奏太慢 → 觀眾失去耐心\n3. 內容與 Hook 不符 → 觀眾覺得被騙\n4. 影片太長（超過觀眾預期）→ 中途離開\n5. 沒有「看完的理由」→ 缺乏懸念\n\n【改善建議】\n1. 重新設計 Hook：用反差/疑問/數據開頭\n2. 加快前 10 秒節奏：每 2-3 秒一個畫面變化\n3. 在 50% 處加入「轉折」：讓觀眾產生新的好奇心\n4. 結尾用「彩蛋」設計：讓觀眾想看到最後\n5. 控制在 15-30 秒：先做短的，驗證有效再做長的\n\n💡 目標：完播率 > 50% 才算及格，> 70% 才有機會被推薦。"
    };
    return answers[type] || "請參考本章相關段落的詳細說明。";
  };

  const handleCopyMessage = (content: string, index: number) => {
    navigator.clipboard.writeText(content);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="mt-6">
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 rounded-xl glass-card hover:border-[#F37021]/20 transition-all duration-300"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#F37021]/20 to-purple-500/20 flex items-center justify-center">
            <Bot size={16} className="text-[#F37021]" />
          </div>
          <div className="text-left">
            <span className="text-sm font-semibold text-foreground">AI 學習助手</span>
            <p className="text-[10px] text-muted-foreground">針對「{chapterTitle}」的問題隨時提問</p>
          </div>
        </div>
        <MessageCircle size={16} className={`text-muted-foreground transition-transform duration-200 ${isOpen ? "text-[#F37021]" : ""}`} />
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
            <div className="glass-card mt-2 p-4">
              {/* Script Prompts Toggle */}
              <div className="mb-3">
                <button
                  onClick={() => setShowScriptPrompts(!showScriptPrompts)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-medium transition-all duration-200 ${
                    showScriptPrompts
                      ? "bg-purple-500/15 text-purple-400 border border-purple-500/30"
                      : "bg-border/20 text-muted-foreground hover:text-foreground border border-border/30"
                  }`}
                >
                  <Film size={12} />
                  短影音腳本專屬提問
                </button>
              </div>

              {/* Script Prompt Buttons */}
              <AnimatePresence>
                {showScriptPrompts && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden mb-3"
                  >
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 p-3 rounded-lg bg-purple-500/5 border border-purple-500/10">
                      {scriptPrompts.map((sp) => (
                        <button
                          key={sp.label}
                          onClick={() => handleAsk(sp.question)}
                          className="flex items-center gap-1.5 px-2.5 py-2 rounded-md text-[10px] font-medium bg-purple-500/10 text-purple-300 hover:bg-purple-500/20 hover:text-purple-200 transition-all duration-200 active:scale-[0.97]"
                        >
                          <Sparkles size={10} />
                          {sp.label}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Suggested Questions */}
              {messages.length === 0 && (
                <div className="mb-4">
                  <p className="text-[10px] text-muted-foreground/70 mb-2">建議問題：</p>
                  <div className="flex flex-wrap gap-1.5">
                    {(chapterFAQs[chapterId] || generalFAQs).slice(0, 4).map((faq, i) => (
                      <button
                        key={i}
                        onClick={() => handleAsk(faq.q)}
                        className="px-2.5 py-1.5 rounded-md text-[10px] bg-border/20 text-muted-foreground hover:text-foreground hover:bg-border/30 transition-all duration-200 active:scale-[0.97]"
                      >
                        {faq.q}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Messages */}
              {messages.length > 0 && (
                <div className="max-h-80 overflow-y-auto space-y-3 mb-4 pr-1">
                  {messages.map((msg, i) => (
                    <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                      <div className={`relative group max-w-[85%] px-3.5 py-2.5 rounded-xl text-[11px] leading-relaxed ${
                        msg.role === "user"
                          ? "bg-[#F37021]/15 text-foreground rounded-br-sm"
                          : "bg-border/15 text-foreground/90 rounded-bl-sm"
                      }`}>
                        <div className="whitespace-pre-wrap">{msg.content}</div>
                        
                        {/* Copy Button for assistant messages */}
                        {msg.role === "assistant" && (
                          <button
                            onClick={() => handleCopyMessage(msg.content, i)}
                            className={`absolute -bottom-1 -right-1 p-1.5 rounded-md transition-all duration-200 ${
                              copiedIndex === i
                                ? "bg-emerald-500/20 text-emerald-400"
                                : "bg-border/30 text-muted-foreground/50 opacity-0 group-hover:opacity-100 hover:text-foreground"
                            }`}
                          >
                            {copiedIndex === i ? <CheckCircle2 size={11} /> : <Copy size={11} />}
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Input */}
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
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
