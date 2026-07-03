import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { trpc } from "@/lib/trpc";
import { useDeviceId } from "@/hooks/useDeviceId";
import { CheckCircle2, XCircle, Trophy, Lock, RotateCcw, ChevronDown, Bookmark, BookmarkCheck, BookOpen, AlertCircle } from "lucide-react";

interface QuizModuleProps {
  chapterId: string;
  chapterTitle: string;
  nextChapterId?: string;
}

// 每題的批改結果（由伺服器端計分後回傳，正解只在提交後才可見）
interface QuestionResult {
  questionId: string;
  question: string;
  options: string[];
  selectedAnswer: number;
  correctAnswer: number;
  isCorrect: boolean;
  explanation: string;
}

interface QuizResult {
  success: boolean;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  passed: boolean;
  passThreshold: number;
  results: QuestionResult[];
}

const STORAGE_KEY = "haochuang-quiz-progress";
const WRONG_NOTES_KEY = "haochuang-wrong-notes";

export interface WrongNote {
  questionId: string;
  chapterId: string;
  chapterTitle: string;
  question: string;
  options: string[];
  correctIndex: number;
  userAnswer: number;
  explanation: string;
  timestamp: number;
}

export default function QuizModule({ chapterId, chapterTitle }: QuizModuleProps) {
  const deviceId = useDeviceId();
  // 題目由伺服器提供（不含正解與解析）
  const questionsQuery = trpc.learning.getQuizQuestions.useQuery(
    { chapterId },
    { staleTime: Infinity }
  );
  const submitQuizMutation = trpc.learning.submitQuiz.useMutation();
  const addWrongNoteMutation = trpc.learning.addWrongNote.useMutation();
  const [isOpen, setIsOpen] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [passed, setPassed] = useState(false);
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null);
  const [submitError, setSubmitError] = useState("");
  const [savedWrongNotes, setSavedWrongNotes] = useState<Set<string>>(new Set());
  const [showWrongNotebook, setShowWrongNotebook] = useState(false);
  const [wrongNotes, setWrongNotes] = useState<WrongNote[]>([]);

  // Load wrong notes from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(WRONG_NOTES_KEY);
    if (stored) {
      const notes: WrongNote[] = JSON.parse(stored);
      setWrongNotes(notes);
      setSavedWrongNotes(new Set(notes.map(n => n.questionId)));
    }
  }, []);

  // Save wrong note to localStorage + tRPC 後端同步（資料來自提交後的批改結果）
  const saveWrongNote = (r: QuestionResult) => {
    const stored = localStorage.getItem(WRONG_NOTES_KEY);
    const notes: WrongNote[] = stored ? JSON.parse(stored) : [];
    // 避免重複
    if (notes.some(n => n.questionId === r.questionId)) return;
    const newNote: WrongNote = {
      questionId: r.questionId,
      chapterId,
      chapterTitle,
      question: r.question,
      options: r.options,
      correctIndex: r.correctAnswer,
      userAnswer: r.selectedAnswer,
      explanation: r.explanation,
      timestamp: Date.now()
    };
    const updated = [newNote, ...notes];
    localStorage.setItem(WRONG_NOTES_KEY, JSON.stringify(updated));
    setWrongNotes(updated);
    setSavedWrongNotes(prev => { const next = new Set(Array.from(prev)); next.add(r.questionId); return next; });
    window.dispatchEvent(new Event("wrong-notes-updated"));
    // 同步到後端
    if (deviceId) {
      addWrongNoteMutation.mutate({
        deviceId,
        chapterId,
        questionId: r.questionId,
        questionText: r.question,
        options: r.options,
        correctAnswer: r.correctAnswer,
        explanation: r.explanation,
        userAnswer: r.selectedAnswer,
      });
    }
  };

  // Remove wrong note
  const removeWrongNote = (questionId: string) => {
    const stored = localStorage.getItem(WRONG_NOTES_KEY);
    const notes: WrongNote[] = stored ? JSON.parse(stored) : [];
    const updated = notes.filter(n => n.questionId !== questionId);
    localStorage.setItem(WRONG_NOTES_KEY, JSON.stringify(updated));
    setWrongNotes(updated);
    setSavedWrongNotes(prev => {
      const next = new Set(prev);
      next.delete(questionId);
      return next;
    });
    window.dispatchEvent(new Event("wrong-notes-updated"));
  };

  const questions = questionsQuery.data ?? [];
  const passThreshold = Math.ceil(questions.length * 0.8); // 80% = 4/5

  // Load progress from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const progress = JSON.parse(stored);
      if (progress[chapterId]?.passed) {
        setPassed(true);
        setQuizCompleted(true);
      }
    }
  }, [chapterId]);

  // Save pass state to localStorage（分數與是否通過皆由伺服器判定）
  const savePassState = (didPass: boolean) => {
    const stored = localStorage.getItem(STORAGE_KEY);
    const progress = stored ? JSON.parse(stored) : {};
    progress[chapterId] = { passed: didPass, timestamp: Date.now() };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    // 通知 Sidebar 更新完成狀態
    window.dispatchEvent(new Event("quiz-progress-updated"));
  };

  const handleAnswer = (optionIndex: number) => {
    setSelectedAnswer(optionIndex);
  };

  // 提交作答到伺服器批改
  const submitAnswers = async (finalAnswers: (number | null)[]) => {
    setSubmitError("");
    try {
      const result = await submitQuizMutation.mutateAsync({
        deviceId: deviceId || "unknown",
        chapterId,
        answers: questions.map((q, i) => ({
          questionId: q.id,
          selectedAnswer: finalAnswers[i] ?? -1,
        })),
      });
      setQuizResult(result);
      setPassed(result.passed);
      setQuizCompleted(true);
      savePassState(result.passed);
    } catch {
      setSubmitError("提交失敗，請檢查網路後重試");
    }
  };

  const handleNext = () => {
    if (selectedAnswer === null) return;
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = selectedAnswer;
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setSelectedAnswer(newAnswers[currentQuestion + 1] ?? null);
    } else {
      void submitAnswers(newAnswers);
    }
  };

  const handleRetry = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setAnswers([]);
    setQuizCompleted(false);
    setPassed(false);
    setQuizResult(null);
    setSubmitError("");
  };

  if (questionsQuery.isSuccess && questions.length === 0) return null;

  const wrongResults = quizResult?.results.filter(r => !r.isCorrect) ?? [];

  return (
    <div className="mt-6">
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between p-4 rounded-xl transition-all duration-300 ${
          passed
            ? "glass-card border-emerald-500/30 bg-emerald-500/5"
            : "glass-card hover:border-[#F37021]/20"
        }`}
      >
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
            passed
              ? "bg-emerald-500/20"
              : "bg-gradient-to-br from-amber-500/20 to-[#F37021]/20"
          }`}>
            {passed ? <CheckCircle2 size={16} className="text-emerald-400" /> : <Trophy size={16} className="text-amber-400" />}
          </div>
          <div className="text-left">
            <span className="text-sm font-semibold text-foreground">
              {passed ? "✅ 考核通過" : "章末考核測驗"}
            </span>
            <p className="text-[10px] text-muted-foreground">
              {passed
                ? `已通過 · 繼續學習下一章`
                : `5 題實戰情境題 · 通過 ${passThreshold || 4}/${questions.length || 5} 題即為合格`
              }
            </p>
          </div>
        </div>
        <ChevronDown size={16} className={`text-muted-foreground transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {/* Quiz Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
            className="overflow-hidden"
          >
            <div className="glass-card mt-2 p-5">
              {questionsQuery.isLoading ? (
                <p className="text-xs text-muted-foreground text-center py-4">題目載入中...</p>
              ) : !quizCompleted ? (
                <>
                  {/* Progress Bar */}
                  <div className="flex items-center gap-2 mb-5">
                    <span className="text-[10px] text-muted-foreground font-medium">
                      {currentQuestion + 1} / {questions.length}
                    </span>
                    <div className="flex-1 h-1.5 bg-border/30 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-[#F37021] rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                        transition={{ duration: 0.3 }}
                      />
                    </div>
                  </div>

                  {/* Question */}
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentQuestion}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.2 }}
                    >
                      <h4 className="text-sm font-bold text-foreground mb-4 leading-relaxed">
                        {questions[currentQuestion]?.question}
                      </h4>

                      {/* Options（作答期間不顯示對錯，提交後由伺服器批改）*/}
                      <div className="space-y-2.5">
                        {questions[currentQuestion]?.options.map((option, i) => {
                          const isSelected = selectedAnswer === i;
                          return (
                            <button
                              key={i}
                              onClick={() => handleAnswer(i)}
                              className={`w-full text-left p-3.5 rounded-lg border transition-all duration-200 ${
                                isSelected
                                  ? "border-[#F37021]/60 bg-[#F37021]/10"
                                  : "border-border/30 hover:border-[#F37021]/30 hover:bg-[#F37021]/5"
                              }`}
                            >
                              <div className="flex items-start gap-3">
                                <span className={`flex-shrink-0 w-6 h-6 rounded-md flex items-center justify-center text-[11px] font-bold ${
                                  isSelected ? "bg-[#F37021]/20 text-[#F37021]" : "bg-border/20 text-muted-foreground"
                                }`}>
                                  {String.fromCharCode(65 + i)}
                                </span>
                                <span className="text-xs text-foreground/90 leading-relaxed">{option}</span>
                                {isSelected && <CheckCircle2 size={16} className="flex-shrink-0 text-[#F37021] ml-auto" />}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </motion.div>
                  </AnimatePresence>

                  {/* 提交錯誤提示 */}
                  {submitError && (
                    <p className="mt-4 text-xs text-red-400 flex items-center gap-1">
                      <AlertCircle size={12} /> {submitError}
                    </p>
                  )}

                  {/* Next / Submit Button */}
                  {selectedAnswer !== null && (
                    <motion.button
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      onClick={handleNext}
                      disabled={submitQuizMutation.isPending}
                      className="mt-5 w-full py-3 rounded-lg bg-[#F37021] text-white text-sm font-semibold hover:bg-[#FF8C42] transition-all duration-200 active:scale-[0.97] disabled:opacity-60"
                    >
                      {submitQuizMutation.isPending
                        ? "批改中..."
                        : currentQuestion < questions.length - 1 ? "下一題 →" : "提交作答"}
                    </motion.button>
                  )}
                </>
              ) : (
                /* Results - 伺服器批改結果 */
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
                  className="py-4"
                >
                  {/* Confetti 效果（通過時） */}
                  {passed && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="absolute inset-0 pointer-events-none overflow-hidden rounded-xl"
                    >
                      {[...Array(12)].map((_, i) => (
                        <motion.div
                          key={i}
                          initial={{
                            opacity: 1,
                            y: -20,
                            x: `${Math.random() * 100}%`,
                            rotate: 0,
                            scale: Math.random() * 0.5 + 0.5
                          }}
                          animate={{
                            opacity: 0,
                            y: 200,
                            rotate: Math.random() * 360,
                          }}
                          transition={{
                            duration: 2 + Math.random(),
                            delay: Math.random() * 0.5,
                            ease: "easeOut"
                          }}
                          className={`absolute w-2 h-2 rounded-sm ${
                            ['bg-emerald-400', 'bg-amber-400', 'bg-[#F37021]', 'bg-blue-400', 'bg-violet-400'][i % 5]
                          }`}
                        />
                      ))}
                    </motion.div>
                  )}

                  {/* 結果圖示 */}
                  <div className="text-center">
                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
                      className={`w-20 h-20 rounded-2xl mx-auto mb-4 flex items-center justify-center ${
                        passed ? "bg-emerald-500/20 shadow-lg shadow-emerald-500/10" : "bg-red-500/20 shadow-lg shadow-red-500/10"
                      }`}
                    >
                      {passed
                        ? <Trophy size={36} className="text-emerald-400" />
                        : <Lock size={36} className="text-red-400" />
                      }
                    </motion.div>

                    <motion.h4
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className={`text-xl font-bold mb-2 ${passed ? "text-emerald-400" : "text-red-400"}`}
                    >
                      {passed ? "🎉 恭喜通過！" : "未通過"}
                    </motion.h4>

                    {/* 分數顯示（伺服器計分） */}
                    {quizResult && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="flex items-center justify-center gap-4 mb-2"
                      >
                        <div className="text-center">
                          <p className={`text-2xl font-black ${passed ? "text-emerald-400" : "text-red-400"}`}>
                            {quizResult.correctAnswers}
                          </p>
                          <p className="text-[10px] text-muted-foreground">答對</p>
                        </div>
                        <span className="text-muted-foreground/30 text-lg">/</span>
                        <div className="text-center">
                          <p className="text-2xl font-black text-foreground/70">{quizResult.totalQuestions}</p>
                          <p className="text-[10px] text-muted-foreground">總題數</p>
                        </div>
                      </motion.div>
                    )}

                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 }}
                      className="text-xs text-muted-foreground/70 mb-5"
                    >
                      {passed
                        ? "你已掌握本章核心知識，繼續前進吧！"
                        : `需要答對 ${quizResult?.passThreshold ?? passThreshold} 題才能通過（正確率 80%）`
                      }
                    </motion.p>
                  </div>

                  {/* 答錯題目詳細解析（正解由提交回應提供） */}
                  {!passed && wrongResults.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 }}
                      className="mt-4 space-y-3"
                    >
                      <p className="text-xs font-semibold text-red-400/80 uppercase tracking-wider mb-3">
                        ❌ 答錯題目解析
                      </p>
                      {wrongResults.map((r, i) => (
                        <motion.div
                          key={r.questionId}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.7 + i * 0.1 }}
                          className="p-3 rounded-lg bg-red-500/5 border border-red-500/15"
                        >
                          <p className="text-xs font-medium text-foreground/90 mb-1.5">
                            {r.question}
                          </p>
                          <div className="flex items-start gap-2 mb-1">
                            <span className="text-[10px] text-red-400 shrink-0">你的答案：</span>
                            <span className="text-[10px] text-red-400/80 line-through">
                              {r.selectedAnswer >= 0 ? r.options[r.selectedAnswer] : "未作答"}
                            </span>
                          </div>
                          <div className="flex items-start gap-2 mb-1.5">
                            <span className="text-[10px] text-emerald-400 shrink-0">正確答案：</span>
                            <span className="text-[10px] text-emerald-400/80">
                              {r.options[r.correctAnswer]}
                            </span>
                          </div>
                          <p className="text-[10px] text-blue-300/80 leading-relaxed">
                            💡 {r.explanation}
                          </p>
                        </motion.div>
                      ))}
                    </motion.div>
                  )}

                  {/* 錯題收錄按鈕 */}
                  {!passed && wrongResults.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.75 }}
                      className="mt-4 p-3 rounded-lg bg-amber-500/5 border border-amber-500/15"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Bookmark size={12} className="text-amber-400" />
                          <span className="text-[11px] font-semibold text-amber-400">錯題收錄</span>
                        </div>
                        <span className="text-[10px] text-muted-foreground">點擊收藏到錯題本</span>
                      </div>
                      <div className="space-y-1.5">
                        {wrongResults.map((r, i) => {
                          const isSaved = savedWrongNotes.has(r.questionId);
                          return (
                            <button
                              key={r.questionId}
                              onClick={() => isSaved ? removeWrongNote(r.questionId) : saveWrongNote(r)}
                              className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md text-left transition-all duration-200 ${
                                isSaved
                                  ? "bg-amber-500/10 border border-amber-500/30"
                                  : "bg-border/10 border border-border/20 hover:border-amber-500/30 hover:bg-amber-500/5"
                              }`}
                            >
                              {isSaved
                                ? <BookmarkCheck size={12} className="text-amber-400 shrink-0" />
                                : <Bookmark size={12} className="text-muted-foreground shrink-0" />
                              }
                              <span className={`text-[10px] truncate flex-1 ${
                                isSaved ? "text-amber-400" : "text-muted-foreground"
                              }`}>
                                Q{i + 1}. {r.question.slice(0, 30)}...
                              </span>
                              <span className="text-[9px] text-muted-foreground/50">
                                {isSaved ? "已收藏" : "收藏"}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}

                  {/* 操作按鈕 */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="mt-6 space-y-3"
                  >
                    {!passed && (
                      <button
                        onClick={handleRetry}
                        className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-[#F37021] text-white text-sm font-semibold hover:bg-[#FF8C42] transition-all duration-200 active:scale-[0.97]"
                      >
                        <RotateCcw size={14} /> 重新作答
                      </button>
                    )}
                    {passed && (
                      <div className="text-center">
                        <p className="text-[10px] text-emerald-400/60 animate-pulse">✔ 本章考核已完成</p>
                      </div>
                    )}

                    {/* 錯題本入口 */}
                    {wrongNotes.length > 0 && (
                      <button
                        onClick={() => setShowWrongNotebook(!showWrongNotebook)}
                        className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-amber-500/20 bg-amber-500/5 text-amber-400 text-xs font-medium hover:bg-amber-500/10 transition-all duration-200"
                      >
                        <BookOpen size={13} />
                        我的錯題本（{wrongNotes.length} 題）
                        <ChevronDown size={12} className={`transition-transform duration-200 ${showWrongNotebook ? "rotate-180" : ""}`} />
                      </button>
                    )}
                  </motion.div>

                  {/* 錯題本展開區塊 */}
                  <AnimatePresence>
                    {showWrongNotebook && wrongNotes.length > 0 && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
                        className="overflow-hidden"
                      >
                        <div className="mt-4 space-y-3">
                          <div className="flex items-center justify-between">
                            <p className="text-[11px] font-semibold text-amber-400 flex items-center gap-1.5">
                              <BookOpen size={12} /> 錯題本 · 集中複習
                            </p>
                            <span className="text-[10px] text-muted-foreground">
                              共 {wrongNotes.length} 題
                            </span>
                          </div>
                          <div className="space-y-2.5 max-h-[400px] overflow-y-auto pr-1">
                            {wrongNotes.map((note, idx) => (
                              <motion.div
                                key={note.questionId}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.05 }}
                                className="p-3 rounded-lg bg-amber-500/5 border border-amber-500/15 relative group"
                              >
                                <button
                                  onClick={() => removeWrongNote(note.questionId)}
                                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-red-500/10"
                                  title="移除此題"
                                >
                                  <XCircle size={12} className="text-red-400/60" />
                                </button>
                                <div className="flex items-center gap-1.5 mb-1.5">
                                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-border/20 text-muted-foreground">
                                    {note.chapterTitle.replace(/^[壹貳參肆伍陸柒捌玖拾]+、/, "").slice(0, 10)}
                                  </span>
                                  <span className="text-[9px] text-muted-foreground/50">
                                    {new Date(note.timestamp).toLocaleDateString("zh-TW", { month: "short", day: "numeric" })}
                                  </span>
                                </div>
                                <p className="text-[11px] font-medium text-foreground/90 mb-2 leading-relaxed">
                                  {note.question}
                                </p>
                                <div className="space-y-1 mb-2">
                                  {note.options.map((opt, oi) => (
                                    <div
                                      key={oi}
                                      className={`text-[10px] px-2 py-1 rounded ${
                                        oi === note.correctIndex
                                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                          : oi === note.userAnswer
                                            ? "bg-red-500/10 text-red-400/80 border border-red-500/20 line-through"
                                            : "text-muted-foreground/60"
                                      }`}
                                    >
                                      {String.fromCharCode(65 + oi)}. {opt}
                                    </div>
                                  ))}
                                </div>
                                <p className="text-[10px] text-blue-300/80 leading-relaxed bg-blue-500/5 p-2 rounded">
                                  💡 {note.explanation}
                                </p>
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
