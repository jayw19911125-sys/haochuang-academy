import { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Copy, Check, ChevronDown } from "lucide-react";
import type { ChapterContent, Section } from "@/lib/data";
import AIAssistant from "@/components/AIAssistant";
import QuizModule from "@/components/QuizModule";

interface ChapterSectionProps {
  chapter: ChapterContent;
  index: number;
  onVisible: () => void;
}

export default function ChapterSection({ chapter, index, onVisible }: ChapterSectionProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) onVisible(); },
      { threshold: 0.3, rootMargin: "-10% 0px -60% 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [onVisible]);

  return (
    <motion.div
      ref={ref}
      id={chapter.id}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, delay: 0.1, ease: [0.23, 1, 0.32, 1] }}
      className="py-16 first:pt-8"
    >
      {/* Chapter Header */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-3">
          <div 
            className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-bold"
            style={{ backgroundColor: chapter.color, boxShadow: `0 0 15px ${chapter.color}40` }}
          >
            {index + 1}
          </div>
          <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-medium">
            {chapter.audience}
          </span>
        </div>
        <h2 
          className="font-black text-foreground leading-tight tracking-tight"
          style={{ fontSize: "clamp(1.5rem, 4vw, 2.25rem)" }}
        >
          {chapter.title}
        </h2>
        <p className="mt-2 text-muted-foreground" style={{ fontSize: "clamp(0.8rem, 2vw, 0.95rem)" }}>
          {chapter.subtitle}
        </p>
      </div>

      {/* Sections */}
      <div className="space-y-8">
        {chapter.sections.map((section, sIdx) => (
          <SectionRenderer key={section.id} section={section} delay={sIdx * 0.05} />
        ))}
      </div>

      {/* YouTube 教學影片 - 如果有設定則顯示 */}
      {chapter.videoId && (
        <div className="mt-10 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div 
              className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm"
              style={{ backgroundColor: chapter.color, boxShadow: `0 0 12px ${chapter.color}40` }}
            >
              ▶
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-medium block">
                教學影片
              </span>
              {chapter.videoTitle && (
                <span className="text-sm font-semibold text-foreground">{chapter.videoTitle}</span>
              )}
            </div>
          </div>
          <div className="relative w-full rounded-xl overflow-hidden glass-card" style={{ paddingBottom: '56.25%' }}>
            <iframe
              className="absolute top-0 left-0 w-full h-full"
              src={`https://www.youtube.com/embed/${chapter.videoId}?rel=0&modestbranding=1`}
              title={chapter.videoTitle || `${chapter.title} 教學影片`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      )}

      {/* AI 學習助手 - 每章底部 */}
      <AIAssistant chapterId={chapter.id} chapterTitle={chapter.title} />

      {/* 考核測驗 - 每章最底部 */}
      <QuizModule chapterId={chapter.id} chapterTitle={chapter.title} />
    </motion.div>
  );
}

function SectionRenderer({ section, delay }: { section: Section; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay, ease: [0.23, 1, 0.32, 1] }}
    >
      {section.title && (
        <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-[#F37021]" />
          {section.title}
        </h3>
      )}
      
      {section.content && section.type !== "prompt" && (
        <div className="text-sm text-muted-foreground leading-relaxed mb-4 whitespace-pre-line">
          {section.content.split(/\*\*(.*?)\*\*/).map((part, i) => 
            i % 2 === 1 ? <strong key={i} className="text-foreground font-semibold">{part}</strong> : part
          )}
        </div>
      )}

      {section.type === "table" && section.tableData && <TableBlock data={section.tableData} />}
      {section.type === "comparison" && section.tableData && <TableBlock data={section.tableData} />}
      {section.type === "prompt" && section.promptData && <PromptBlock data={section.promptData} />}
      {section.type === "steps" && section.steps && <StepsBlock steps={section.steps} />}
      {section.type === "flipcard" && section.flipCards && <FlipCardBlock cards={section.flipCards} />}
      {section.type === "checklist" && section.checklistItems && <ChecklistBlock items={section.checklistItems} />}
      {section.type === "image" && section.imageData && <ImageBlock data={section.imageData} />}
    </motion.div>
  );
}

function TableBlock({ data }: { data: { headers: string[]; rows: string[][] } }) {
  return (
    <div className="glass-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border/30">
              {data.headers.map((h, i) => (
                <th key={i} className="px-4 py-3 text-left text-[11px] uppercase tracking-wider text-[#F37021] font-semibold whitespace-nowrap">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.rows.map((row, rIdx) => (
              <tr key={rIdx} className="border-b border-border/10 last:border-0 hover:bg-[#F37021]/5 transition-colors">
                {row.map((cell, cIdx) => (
                  <td key={cIdx} className={`px-4 py-3 ${cIdx === 0 ? "font-medium text-foreground" : "text-muted-foreground"}`}>
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function PromptBlock({ data }: { data: { model: string; purpose: string; prompt: string; example?: string } }) {
  const [copied, setCopied] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(data.prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="glass-card overflow-hidden">
      {/* Header */}
      <div className="px-5 py-3 border-b border-border/20 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-[10px] px-2 py-0.5 rounded bg-[#F37021]/10 text-[#F37021] font-mono font-medium">
            {data.model}
          </span>
          <span className="text-xs text-muted-foreground">{data.purpose}</span>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium
            bg-[#F37021]/10 text-[#F37021] hover:bg-[#F37021]/20 transition-all duration-200
            active:scale-95"
        >
          {copied ? <Check size={12} /> : <Copy size={12} />}
          {copied ? "已複製" : "複製"}
        </button>
      </div>

      {/* Prompt Content */}
      <div className="relative">
        <div className={`prompt-block m-0 rounded-none border-0 border-l-0 ${!expanded ? "max-h-48 overflow-hidden" : ""}`}>
          <pre className="whitespace-pre-wrap text-foreground/90 leading-relaxed">{data.prompt}</pre>
        </div>
        {!expanded && (
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[oklch(0.1_0.005_50)] to-transparent" />
        )}
      </div>

      {/* Expand / Example */}
      <div className="px-5 py-3 border-t border-border/20 flex items-center justify-between">
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
        >
          <ChevronDown size={14} className={`transition-transform ${expanded ? "rotate-180" : ""}`} />
          {expanded ? "收合" : "展開完整 Prompt"}
        </button>
        {data.example && (
          <span className="text-[10px] text-muted-foreground/70">
            範例：{data.example}
          </span>
        )}
      </div>
    </div>
  );
}

function StepsBlock({ steps }: { steps: { title: string; description: string; ai?: string }[] }) {
  return (
    <div className="space-y-3">
      {steps.map((step, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -10 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.05, duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
          className="glass-card p-4 group"
        >
          <div className="flex gap-4">
            {/* Step Number */}
            <div className="flex-shrink-0">
              <div className="w-8 h-8 rounded-full border-2 border-[#F37021]/40 flex items-center justify-center text-xs font-bold text-[#F37021] group-hover:bg-[#F37021]/10 transition-colors">
                {i + 1}
              </div>
            </div>
            {/* Content */}
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-semibold text-foreground">{step.title}</h4>
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{step.description}</p>
              {step.ai && (
                <div className="mt-2 flex items-start gap-1.5">
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#F37021]/10 text-[#F37021] font-medium whitespace-nowrap mt-0.5">AI</span>
                  <span className="text-[11px] text-[#FF8C42]/80">{step.ai}</span>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

function FlipCardBlock({ cards }: { cards: { front: string; back: string }[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {cards.map((card, i) => (
        <FlipCard key={i} front={card.front} back={card.back} />
      ))}
    </div>
  );
}

function FlipCard({ front, back }: { front: string; back: string }) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div 
      className="flip-card h-48 cursor-pointer"
      onClick={() => setFlipped(!flipped)}
    >
      <div className={`flip-card-inner ${flipped ? "flipped" : ""}`} style={{ transform: flipped ? "rotateY(180deg)" : "rotateY(0)" }}>
        {/* Front */}
        <div className="flip-card-front glass-card flex items-center justify-center p-5 text-center">
          <div>
            <div className="text-sm font-bold text-foreground">{front}</div>
            <div className="text-[10px] text-muted-foreground mt-3">點擊翻轉 →</div>
          </div>
        </div>
        {/* Back */}
        <div className="flip-card-back glass-card flex items-center justify-center p-5 border border-[#F37021]/30" style={{ background: "oklch(0.14 0.015 45 / 90%)" }}>
          <p className="text-xs text-foreground/90 leading-relaxed">{back}</p>
        </div>
      </div>
    </div>
  );
}

function ChecklistBlock({ items }: { items: string[] }) {
  const [checked, setChecked] = useState<boolean[]>(new Array(items.length).fill(false));

  const toggle = (idx: number) => {
    setChecked(prev => {
      const next = [...prev];
      next[idx] = !next[idx];
      return next;
    });
  };

  return (
    <div className="glass-card p-4 space-y-2">
      {items.map((item, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -10 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.03 }}
          className="flex items-start gap-3 group cursor-pointer"
          onClick={() => toggle(i)}
        >
          <div className={`
            flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center
            transition-all duration-200
            ${checked[i] 
              ? "bg-[#F37021] border-[#F37021]" 
              : "border-border/50 group-hover:border-[#F37021]/50"
            }
          `}>
            {checked[i] && <Check size={12} className="text-white" />}
          </div>
          <span className={`text-sm transition-all duration-200 ${checked[i] ? "text-muted-foreground line-through" : "text-foreground"}`}>
            {item}
          </span>
        </motion.div>
      ))}
      <div className="pt-2 border-t border-border/20 mt-3">
        <span className="text-[10px] text-muted-foreground">
          {checked.filter(Boolean).length} / {items.length} 已完成
        </span>
      </div>
    </div>
  );
}


function ImageBlock({ data }: { data: { url: string; alt: string; caption?: string; width?: string; height?: string } }) {
  return (
    <div className="glass-card p-4 overflow-hidden">
      <div className="relative rounded-lg overflow-hidden border border-[#F37021]/20">
        <div className="absolute inset-0 bg-gradient-to-br from-[#F37021]/5 to-transparent pointer-events-none z-10" />
        <img
          src={data.url}
          alt={data.alt}
          className="w-full h-auto max-h-[600px] object-contain"
          style={{ width: data.width || '100%', height: data.height || 'auto' }}
        />
      </div>
      {data.caption && (
        <p className="text-xs text-muted-foreground text-center mt-3 italic">{data.caption}</p>
      )}
    </div>
  );
}
