import { useState, useEffect, useMemo } from "react";
import { Send, MessageCircle, Calendar, CheckCircle2, XCircle, RotateCcw, Sparkles, Clock } from "lucide-react";

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

// 每日一題題庫（從各章精選）
const DAILY_QUIZ_POOL: DailyQuestion[] = [
  { id: "dq1", chapter: "ch1", chapterTitle: "好創營運底層邏輯", question: "好創的收款鐵則中，社群類專案的正確收款方式是？", options: ["50% 訂金", "執行前收當月全款", "月底結算", "完成後收款"], correctIndex: 1, explanation: "社群類專案：執行前收當月全款。網站專案才是 50% 訂金制。先收錢才開工是好創的底線。", difficulty: "基礎" },
  { id: "dq2", chapter: "ch3", chapterTitle: "社群行銷閉環飛輪", question: "好創的內容矩陣公式中，知識型內容應佔比多少？", options: ["30%", "50%", "60%", "80%"], correctIndex: 2, explanation: "知識型 60%（建立信任）+ 娛樂型 25%（擴大觸及）+ 轉換型 15%（產生營收）。", difficulty: "基礎" },
  { id: "dq3", chapter: "ch4", chapterTitle: "企劃職位完整教學", question: "2026 年 Meta 演算法最重要的三大核心指標是？", options: ["粉絲數、觸及率、點擊率", "完播率、複看率、互動品質", "按讚數、分享數、留言數", "發布頻率、內容長度、標籤數量"], correctIndex: 1, explanation: "2026 年三大核心：完播率（最重要）、複看率（決定長期推送）、互動品質（誰在互動比多少互動重要）。", difficulty: "進階" },
  { id: "dq4", chapter: "ch5", chapterTitle: "短影音企劃工作流", question: "一支短影音的前 2 秒應該做什麼？", options: ["放品牌 Logo", "自我介紹", "用 Hook 製造好奇心或衝突感", "放背景音樂"], correctIndex: 2, explanation: "前 2 秒是黃金法則：必須用 Hook 製造好奇心或衝突感，讓觀眾停下來看。", difficulty: "基礎" },
  { id: "dq5", chapter: "ch6", chapterTitle: "剪輯師完整教學", question: "好創標準中，字幕準確率必須達到多少？", options: ["90%", "95%", "99%", "100%"], correctIndex: 2, explanation: "好創品質標準：字幕準確率必須達到 99%。AI 生成後人工校對是必要步驟。", difficulty: "基礎" },
  { id: "dq6", chapter: "ch7", chapterTitle: "剪輯軟體 AI 功能", question: "好創日常短影音的主力剪輯工具是？", options: ["Premiere Pro", "DaVinci Resolve", "CapCut", "Final Cut Pro"], correctIndex: 2, explanation: "CapCut 是好創日常短影音的主力工具，90% 的短影音在此完成。Premiere Pro 用於高階案件。", difficulty: "基礎" },
  { id: "dq7", chapter: "ch9", chapterTitle: "AI Prompt 兵器庫", question: "好創的雙引擎工作流是指？", options: ["CapCut + Premiere Pro", "ChatGPT 發散 + Claude 收斂", "Monday.com + Slack", "Notion + Google Drive"], correctIndex: 1, explanation: "好創採用「雙引擎工作流」：ChatGPT 負責創意發散，Claude 負責邏輯審核與策略。", difficulty: "進階" },
  { id: "dq8", chapter: "ch11", chapterTitle: "私域轉化完整指南", question: "私域轉化漏斗的第一層是？", options: ["成交", "信任建立", "公域曝光", "互動培養"], correctIndex: 2, explanation: "私域轉化漏斗 5 層：公域曝光 → 引流進私域 → 信任建立 → 互動培養 → 成交轉化。", difficulty: "進階" },
  { id: "dq9", chapter: "ch12", chapterTitle: "多平台差異化策略", question: "「一魚三吃」工作流的正確理解是？", options: ["同一支影片發三個平台", "同一素材根據各平台特性重新剪輯", "三個平台發不同內容", "只選一個平台深耕"], correctIndex: 1, explanation: "一魚三吃：同一素材根據 TikTok、Reels、Shorts 各自的演算法特性重新剪輯，而非直接搬運。", difficulty: "實戰" },
  { id: "dq10", chapter: "ch13", chapterTitle: "AI 工具完整矩陣", question: "使用 AI 工具時，哪些資訊絕對不能輸入？", options: ["公開的市場數據", "客戶的公司名稱", "客戶的營收數據和合約金額", "產業趨勢分析"], correctIndex: 2, explanation: "AI 資安底線：客戶的營收數據、合約金額、個人隱私資料、未公開商業機密絕對不能輸入任何 AI 工具。", difficulty: "實戰" },
  { id: "dq11", chapter: "ch14", chapterTitle: "2026年演算法完整認知", question: "Power Like（有影響力帳號的互動）的價值是普通互動的幾倍？", options: ["2-3 倍", "5-10 倍", "50-100 倍", "沒有差別"], correctIndex: 1, explanation: "Power Like 的價值是普通互動的 5-10 倍。演算法根據「誰」在互動來判斷內容品質。", difficulty: "進階" },
  { id: "dq12", chapter: "ch1", chapterTitle: "好創營運底層邏輯", question: "好創的產能防禦機制中，招募中職缺應如何計入產能？", options: ["預估到職時間提前計入", "不計入，直到實際到職", "計入 50% 產能", "視情況彈性處理"], correctIndex: 1, explanation: "招募中職缺在實際到職前不得計入產能。這是防止過度承諾的底線。", difficulty: "基礎" },
  { id: "dq13", chapter: "ch5", chapterTitle: "短影音企劃工作流", question: "好創標準工作流中，一支短影音的總製作時間約為？", options: ["1-2 小時", "3-4 小時", "7-9 小時", "12-15 小時"], correctIndex: 2, explanation: "標準版：約 7-9 小時/支。AI 加速版：約 4-6 小時/支。主要節省在選題、腳本、剪輯環節。", difficulty: "進階" },
  { id: "dq14", chapter: "ch3", chapterTitle: "社群行銷閉環飛輪", question: "社群飛輪效應通常在第幾個月開始顯現？", options: ["第 1 個月", "第 3 個月", "第 6 個月", "第 12 個月"], correctIndex: 1, explanation: "前 1-2 個月是「推動期」，需要持續產出不看數據。第 3 個月開始才會看到飛輪效應。", difficulty: "實戰" },
];

const STORAGE_KEY = "haochuang-daily-quiz";
const SLACK_CHANNEL_ID = "C0ATK171BU5"; // #all-共同成長

interface DailyQuizState {
  lastDate: string;
  todayQuestionId: string;
  answered: boolean;
  selectedIndex: number | null;
  sentToSlack: boolean;
  history: { date: string; questionId: string; correct: boolean }[];
}

function getTodayKey(): string {
  return new Date().toISOString().split("T")[0];
}

function getDailyQuizState(): DailyQuizState {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const state = JSON.parse(stored);
      if (state.lastDate === getTodayKey()) return state;
    }
  } catch {}
  
  // Generate today's question (deterministic based on date)
  const today = getTodayKey();
  const dateNum = parseInt(today.replace(/-/g, ""), 10);
  const questionIdx = dateNum % DAILY_QUIZ_POOL.length;
  
  return {
    lastDate: today,
    todayQuestionId: DAILY_QUIZ_POOL[questionIdx].id,
    answered: false,
    selectedIndex: null,
    sentToSlack: false,
    history: [],
  };
}

function saveDailyQuizState(state: DailyQuizState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

interface DailyQuizProps {
  onSendToSlack?: (message: string) => void;
}

export default function DailyQuiz({ onSendToSlack }: DailyQuizProps) {
  const [state, setState] = useState<DailyQuizState>(getDailyQuizState());
  const [sending, setSending] = useState(false);
  const [sendSuccess, setSendSuccess] = useState(false);

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
      history: [...state.history, { date: state.lastDate, questionId: todayQuestion.id, correct: isCorrect }],
    };
    setState(newState);
    saveDailyQuizState(newState);
  };

  const handleSendToSlack = async () => {
    setSending(true);
    try {
      // Format message for Slack
      const difficultyEmoji = todayQuestion.difficulty === "基礎" ? "🟢" : todayQuestion.difficulty === "進階" ? "🟡" : "🔴";
      const message = `📝 *好創學院｜每日一題* (${getTodayKey()})\n\n${difficultyEmoji} 難度：${todayQuestion.difficulty}｜章節：${todayQuestion.chapterTitle}\n\n> ${todayQuestion.question}\n\nA. ${todayQuestion.options[0]}\nB. ${todayQuestion.options[1]}\nC. ${todayQuestion.options[2]}\nD. ${todayQuestion.options[3]}\n\n_💡 答案稍後公佈，先想想再看！_\n\n||答案：${"ABCD"[todayQuestion.correctIndex]}. ${todayQuestion.options[todayQuestion.correctIndex]}\n\n📖 解析：${todayQuestion.explanation}||`;
      
      if (onSendToSlack) {
        onSendToSlack(message);
      }
      
      const newState = { ...state, sentToSlack: true };
      setState(newState);
      saveDailyQuizState(newState);
      setSendSuccess(true);
      setTimeout(() => setSendSuccess(false), 3000);
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
    </div>
  );
}
