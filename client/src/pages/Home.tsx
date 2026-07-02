import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  BookOpen, Zap, Film, Target, Brain, BarChart3, 
  ChevronRight, Copy, Check, Menu, X, ExternalLink,
  Layers, Rocket, Users, Clock, ArrowRight, Sparkles, ChevronUp
} from "lucide-react";
import Sidebar from "@/components/Sidebar";
import HeroSection from "@/components/HeroSection";
import ChapterSection from "@/components/ChapterSection";
import MilestoneTracker from "@/components/MilestoneTracker";
import CaseLibrary from "@/components/CaseLibrary";
import LearningTimeTracker from "@/components/LearningTimeTracker";
import InternalDocs from "@/components/InternalDocs";
import Leaderboard from "@/components/Leaderboard";
import DailyQuiz from "@/components/DailyQuiz";
import GraduationCelebration from "@/components/GraduationCelebration";
import { chapters } from "@/lib/data";
import { useAuth } from "@/_core/hooks/useAuth";

export default function Home() {
  // The userAuth hooks provides authentication state
  // To implement login/logout functionality, simply call logout() or redirect to getLoginUrl()
  let { user, loading, error, isAuthenticated, logout } = useAuth();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeChapter, setActiveChapter] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showDocs, setShowDocs] = useState(false);
  const [userSelectedChapter, setUserSelectedChapter] = useState<number | null>(null);
  const [chapterCompletion, setChapterCompletion] = useState<Record<string, boolean>>({});
  const [showGraduation, setShowGraduation] = useState(false);
  const prevCompletionCountRef = useRef(0);
  const mainRef = useRef<HTMLDivElement>(null);

  // 讀取 localStorage 中的考核完成狀態
  useEffect(() => {
    const loadCompletion = () => {
      const stored = localStorage.getItem("haochuang-quiz-progress");
      if (stored) {
        const progress = JSON.parse(stored);
        const completion: Record<string, boolean> = {};
        Object.keys(progress).forEach(key => {
          if (progress[key]?.passed) completion[key] = true;
        });
        setChapterCompletion(completion);
      }
    };
    loadCompletion();
    // 監聽 storage 變化（同頁面內用 custom event）
    const handleStorageChange = () => {
      loadCompletion();
    };
    window.addEventListener("quiz-progress-updated", handleStorageChange);
    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("quiz-progress-updated", handleStorageChange);
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  // 監控進度是否達到 100%，觸發慶祝動畫
  useEffect(() => {
    const completedCount = Object.values(chapterCompletion).filter(Boolean).length;
    const totalChapters = 14;
    // 只有從非 100% 變到 100% 才觸發（避免每次刷新都彈出）
    if (completedCount === totalChapters && prevCompletionCountRef.current < totalChapters) {
      // 檢查是否已經慶祝過
      const celebrated = localStorage.getItem("haochuang-graduation-celebrated");
      if (!celebrated) {
        setTimeout(() => setShowGraduation(true), 500);
        localStorage.setItem("haochuang-graduation-celebrated", "true");
      }
    }
    prevCompletionCountRef.current = completedCount;
  }, [chapterCompletion]);

  const [showScrollTop, setShowScrollTop] = useState(false);
  const scrollLockRef = useRef(false);

  const handleScroll = useCallback(() => {
    if (!mainRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = mainRef.current;
    const progress = scrollTop / (scrollHeight - clientHeight);
    setScrollProgress(Math.min(progress, 1));
    setShowScrollTop(scrollTop > 600);
    // 只在非鎖定狀態下清除手動選擇
    if (!scrollLockRef.current) {
      setUserSelectedChapter(null);
    }
  }, []);

  useEffect(() => {
    const el = mainRef.current;
    if (!el) return;
    el.addEventListener("scroll", handleScroll, { passive: true });
    return () => el.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  return (
    <div className="h-screen flex overflow-hidden noise-overlay gradient-mesh-bg">
      {/* Progress Bar - Top */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <div className="progress-bar">
          <div 
            className="progress-bar-fill" 
            style={{ width: `${scrollProgress * 100}%` }} 
          />
        </div>
      </div>

      {/* Mobile Menu Button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="fixed top-4 left-4 z-50 lg:hidden glass-card p-2"
        aria-label="Toggle menu"
      >
        {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar */}
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)}
        activeChapter={activeChapter}
        chapterCompletion={chapterCompletion}
        onChapterSelect={(idx) => {
          setActiveChapter(idx);
          setUserSelectedChapter(idx);
          setSidebarOpen(false);
          scrollLockRef.current = true;
          // 滾動到對應章節，考慮 sticky tracker 高度
          setTimeout(() => {
            const element = document.getElementById(`chapter-${chapters[idx]?.id}`);
            if (element && mainRef.current) {
              const offset = element.offsetTop - 80; // sticky tracker height offset
              mainRef.current.scrollTo({ top: offset, behavior: 'smooth' });
            }
            // 滾動完成後解鎖
            setTimeout(() => { scrollLockRef.current = false; }, 800);
          }, 100);
        }}
        onShowDocs={() => setShowDocs(true)}
        progress={scrollProgress}
      />

      {/* Internal Docs Modal */}
      {showDocs && <InternalDocs onClose={() => setShowDocs(false)} />}

      {/* Main Content */}
      <main 
        ref={mainRef}
        className="flex-1 overflow-y-auto scroll-smooth lg:ml-72"
      >
        <HeroSection />
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-32">
          {/* Learning Time Tracker - Fixed at top of content */}
          <div className="mb-8 sticky top-2 z-30">
            <LearningTimeTracker
              currentChapterId={chapters[activeChapter]?.id || "ch1"}
              currentChapterTitle={chapters[activeChapter]?.title || ""}
            />
          </div>
          {chapters.map((chapter, idx) => (
            <div key={chapter.id} id={`chapter-${chapter.id}`}>
              <ChapterSection 
                chapter={chapter} 
                index={idx}
                onVisible={() => {
                  // 只在用戶沒有主動選擇時才更新
                  if (userSelectedChapter === null) {
                    setActiveChapter(idx);
                  }
                }}
              />
            </div>
          ))}

          {/* 新人 30 天里程碑 */}
          <div id="milestone" className="py-16">
            <div className="mb-10">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-bold bg-gradient-to-br from-emerald-500 to-teal-600" style={{ boxShadow: '0 0 15px rgba(16,185,129,0.4)' }}>
                  ★
                </div>
                <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-medium">
                  全員必修
                </span>
              </div>
              <h2 className="font-black text-foreground leading-tight tracking-tight" style={{ fontSize: 'clamp(1.5rem, 4vw, 2.25rem)' }}>
                新人 30 天里程碑
              </h2>
              <p className="mt-2 text-muted-foreground" style={{ fontSize: 'clamp(0.8rem, 2vw, 0.95rem)' }}>
                互動式進度追蹤系統 — 每週目標 + 自我評估核取清單
              </p>
            </div>
            <MilestoneTracker />
          </div>

          {/* 每日一題 */}
          <div id="daily-quiz" className="py-16">
            <div className="mb-10">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-bold bg-gradient-to-br from-violet-500 to-purple-600" style={{ boxShadow: '0 0 15px rgba(139,92,246,0.4)' }}>
                  📝
                </div>
                <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-medium">
                  每日練習
                </span>
              </div>
              <h2 className="font-black text-foreground leading-tight tracking-tight" style={{ fontSize: 'clamp(1.5rem, 4vw, 2.25rem)' }}>
                每日一題
              </h2>
              <p className="mt-2 text-muted-foreground" style={{ fontSize: 'clamp(0.8rem, 2vw, 0.95rem)' }}>
                每天一題實戰情境題 — 答完可推播到 Slack 讓團隊一起討論
              </p>
            </div>
            <DailyQuiz />
          </div>

          {/* 新人考核排行榜 */}
          <div id="leaderboard" className="py-16">
            <div className="mb-10">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-bold bg-gradient-to-br from-amber-500 to-orange-600" style={{ boxShadow: '0 0 15px rgba(245,158,11,0.4)' }}>
                  🏆
                </div>
                <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-medium">
                  團隊激勵
                </span>
              </div>
              <h2 className="font-black text-foreground leading-tight tracking-tight" style={{ fontSize: 'clamp(1.5rem, 4vw, 2.25rem)' }}>
                新人考核排行榜
              </h2>
              <p className="mt-2 text-muted-foreground" style={{ fontSize: 'clamp(0.8rem, 2vw, 0.95rem)' }}>
                綜合評分系統 — 學習進度 × 測驗成績 × 學習時間 × 連續天數
              </p>
            </div>
            <Leaderboard />
          </div>

          {/* 實戰案例庫 */}
          <div id="case-library" className="py-16">
            <div className="mb-10">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-bold bg-gradient-to-br from-amber-500 to-orange-600" style={{ boxShadow: '0 0 15px rgba(245,158,11,0.4)' }}>
                  ☆
                </div>
                <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-medium">
                  全員參考
                </span>
              </div>
              <h2 className="font-black text-foreground leading-tight tracking-tight" style={{ fontSize: 'clamp(1.5rem, 4vw, 2.25rem)' }}>
                實戰案例庫
              </h2>
              <p className="mt-2 text-muted-foreground" style={{ fontSize: 'clamp(0.8rem, 2vw, 0.95rem)' }}>
                分類標籤 + 搜尋篩選 — 從真實案例中學習過去的成功經驗
              </p>
            </div>
            <CaseLibrary />
          </div>
        </div>

        {/* Footer */}
        <footer className="border-t border-border/30 py-8 px-6 text-center">
          <p className="text-muted-foreground text-sm">
            好創整合行銷 © 2026 — 內部機密文件，禁止外流
          </p>
          <div className="mt-3 flex items-center justify-center gap-4">
            <a 
              href="https://app.notion.com/p/38097a06fae5814caf78e93a99dcc243"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
            >
              <ExternalLink size={12} /> Notion 同步版
            </a>
          </div>
        </footer>
      </main>

      {/* Scroll to Top */}
      {showScrollTop && (
        <button
          onClick={() => mainRef.current?.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-6 right-6 z-40 w-10 h-10 rounded-full bg-[#F37021] text-white shadow-lg flex items-center justify-center hover:bg-[#FF8C42] transition-all duration-200 active:scale-95"
          style={{ boxShadow: '0 4px 20px rgba(243,112,33,0.3)' }}
          aria-label="回到頂部"
        >
          <ChevronUp size={20} />
        </button>
      )}

      {/* 全螢幕慶祝動畫 - 進度 100% 時觸發 */}
      <GraduationCelebration 
        show={showGraduation} 
        onClose={() => setShowGraduation(false)} 
      />
    </div>
  );
}
