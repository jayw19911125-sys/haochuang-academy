import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  BookOpen, Zap, Film, Target, Brain, BarChart3, 
  ChevronRight, Copy, Check, Menu, X, ExternalLink,
  Layers, Rocket, Users, Clock, ArrowRight, Sparkles
} from "lucide-react";
import Sidebar from "@/components/Sidebar";
import HeroSection from "@/components/HeroSection";
import ChapterSection from "@/components/ChapterSection";
import MilestoneTracker from "@/components/MilestoneTracker";
import CaseLibrary from "@/components/CaseLibrary";
import LearningTimeTracker from "@/components/LearningTimeTracker";
import { chapters } from "@/lib/data";

export default function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeChapter, setActiveChapter] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const mainRef = useRef<HTMLDivElement>(null);

  const handleScroll = useCallback(() => {
    if (!mainRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = mainRef.current;
    const progress = scrollTop / (scrollHeight - clientHeight);
    setScrollProgress(Math.min(progress, 1));
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
        onChapterSelect={(idx) => {
          setActiveChapter(idx);
          setSidebarOpen(false);
        }}
        progress={scrollProgress}
      />

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
            <ChapterSection 
              key={chapter.id} 
              chapter={chapter} 
              index={idx}
              onVisible={() => setActiveChapter(idx)}
            />
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
    </div>
  );
}
