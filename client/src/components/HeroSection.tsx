import { motion } from "framer-motion";
import { Sparkles, ArrowDown } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden px-4">
      {/* Gradient Mesh Background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#F37021]/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-[#FF8C42]/8 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: "1s" }} />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-[#F37021]/5 rounded-full blur-[80px] animate-pulse" style={{ animationDelay: "2s" }} />
      </div>

      {/* Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(243,112,33,0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(243,112,33,0.3) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px"
        }}
      />

      {/* Content */}
      <div className="relative z-10 text-center max-w-3xl mx-auto">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#F37021]/30 bg-[#F37021]/5 backdrop-blur-sm mb-8"
        >
          <Sparkles size={14} className="text-[#F37021]" />
          <span className="text-xs font-medium text-[#F37021]">內部機密 · v3.1 · 2026.06</span>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.23, 1, 0.32, 1] }}
          className="text-foreground font-black leading-[1.1] tracking-tight"
          style={{ fontSize: "clamp(2rem, 7vw, 4rem)" }}
        >
          好創學院
          <br />
          <span className="bg-gradient-to-r from-[#F37021] to-[#FF8C42] bg-clip-text text-transparent">
            新人完整教學系統
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25, ease: [0.23, 1, 0.32, 1] }}
          className="mt-6 text-muted-foreground leading-relaxed max-w-xl mx-auto"
          style={{ fontSize: "clamp(0.875rem, 2.5vw, 1.125rem)" }}
        >
          涵蓋社群行銷閉環飛輪、短影音企劃與剪輯、AI 自動化工作流、
          <br className="hidden sm:block" />
          Meta 廣告投放 — 從 0 到 100 的完整知識地圖
        </motion.p>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4, ease: [0.23, 1, 0.32, 1] }}
          className="mt-10 grid grid-cols-3 gap-4 max-w-md mx-auto"
        >
          {[
            { value: "14", label: "章節" },
            { value: "8", label: "AI Prompt" },
            { value: "60%", label: "效率提升" }
          ].map((stat, i) => (
            <div key={i} className="glass-card px-4 py-3">
              <div className="text-xl font-black text-[#F37021]">{stat.value}</div>
              <div className="text-[10px] text-muted-foreground uppercase tracking-wider mt-0.5">{stat.label}</div>
            </div>
          ))}
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <ArrowDown size={20} className="text-muted-foreground/50" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
