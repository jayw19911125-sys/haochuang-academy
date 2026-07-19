import { useMemo, useState } from "react";
import {
  AlertTriangle,
  ArrowRight,
  BarChart3,
  Briefcase,
  CheckCircle2,
  ChevronRight,
  ClipboardCheck,
  ExternalLink,
  FileCheck2,
  Home as HomeIcon,
  Layers,
  Menu,
  Search,
  ShieldCheck,
  Sparkles,
  Workflow,
  Wrench,
  X,
} from "lucide-react";
import {
  academyNavigation,
  firstMonthDeliverables,
  learningModules,
  marketSources,
  plannerNonNegotiables,
  plannerStages,
  plannerWorkflowSteps,
  roleDefinitions,
  taiwanMarketSignals,
  toolkitItems,
  type AcademySectionId,
  type NavigationItem,
  type PlannerStage,
} from "@/lib/academyV2Data";

const STORAGE_KEY = "haochuang-academy-v2-progress";

type ProgressMap = Record<string, boolean>;

const navIconMap: Record<NavigationItem["icon"], React.ComponentType<{ size?: number; className?: string }>> = {
  home: HomeIcon,
  roles: Layers,
  planner: Briefcase,
  assessment: ClipboardCheck,
  toolkit: Wrench,
  manager: BarChart3,
};

const categoryClass: Record<string, string> = {
  共同基礎: "border-blue-500/20 bg-blue-500/10 text-blue-300",
  商業理解: "border-amber-500/20 bg-amber-500/10 text-amber-300",
  內容企劃: "border-orange-500/20 bg-orange-500/10 text-orange-300",
  短影音: "border-rose-500/20 bg-rose-500/10 text-rose-300",
  社群營運: "border-cyan-500/20 bg-cyan-500/10 text-cyan-300",
  數據: "border-emerald-500/20 bg-emerald-500/10 text-emerald-300",
  AI: "border-violet-500/20 bg-violet-500/10 text-violet-300",
  文書行政: "border-slate-500/30 bg-slate-500/10 text-slate-300",
};

function readProgress(): ProgressMap {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as ProgressMap) : {};
  } catch {
    return {};
  }
}

function saveProgress(progress: ProgressMap) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="mb-8 max-w-4xl">
      <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#F37021]">{eyebrow}</p>
      <h1 className="text-3xl font-black tracking-tight text-foreground sm:text-4xl">{title}</h1>
      <p className="mt-3 text-sm leading-7 text-muted-foreground sm:text-base">{description}</p>
    </div>
  );
}

function NonNegotiables() {
  return (
    <section className="overflow-hidden rounded-2xl border border-[#F37021]/30 bg-[#F37021]/[0.06]">
      <div className="border-b border-[#F37021]/20 px-5 py-4 sm:px-6">
        <div className="flex items-center gap-3">
          <ShieldCheck className="text-[#F37021]" size={22} />
          <div>
            <h2 className="font-bold text-foreground">企劃不可妥協的基本能力</h2>
            <p className="mt-1 text-xs text-muted-foreground">
              自主學習與文書行政不是加分項，是所有企劃技能成立的前提。
            </p>
          </div>
        </div>
      </div>
      <div className="grid gap-px bg-border/20 lg:grid-cols-2">
        {plannerNonNegotiables.map((item, index) => (
          <article key={item.title} className="bg-background/70 p-5 sm:p-6">
            <div className="mb-4 flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#F37021] text-sm font-black text-white">
                {index + 1}
              </span>
              <h3 className="text-lg font-black text-foreground">{item.title}</h3>
            </div>
            <p className="text-sm leading-7 text-muted-foreground">{item.copy}</p>
            <div className="mt-4 border-l-2 border-[#F37021] pl-4">
              <p className="text-xs font-semibold text-foreground">驗證方式</p>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">{item.proof}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function StageSummary({ stage }: { stage: PlannerStage }) {
  return (
    <article className="rounded-2xl border border-border/40 bg-background/60 p-5 sm:p-6">
      <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
        <div className="max-w-3xl">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#F37021]">{stage.title}</p>
          <h3 className="mt-2 text-2xl font-black tracking-tight text-foreground">{stage.headline}</h3>
          <p className="mt-3 text-sm leading-7 text-muted-foreground">{stage.standard}</p>
        </div>
        <div className="min-w-64 rounded-xl border border-border/30 bg-border/[0.08] p-4">
          <p className="text-xs font-bold text-foreground">授權與邊界</p>
          <p className="mt-2 text-xs leading-6 text-muted-foreground">{stage.autonomyBoundary}</p>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div>
          <h4 className="mb-3 text-sm font-bold text-foreground">必須提出的工作證據</h4>
          <ul className="space-y-2.5">
            {stage.evidence.map((item) => (
              <li key={item} className="flex gap-3 text-sm leading-6 text-muted-foreground">
                <CheckCircle2 className="mt-0.5 shrink-0 text-emerald-400" size={17} />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-bold text-foreground">不可發生</h4>
          <ul className="space-y-2.5">
            {stage.mustNotHappen.map((item) => (
              <li key={item} className="flex gap-3 text-sm leading-6 text-muted-foreground">
                <AlertTriangle className="mt-0.5 shrink-0 text-amber-400" size={17} />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-6 overflow-hidden rounded-xl border border-border/30">
        <div className="grid grid-cols-[1fr_1.6fr] bg-border/10 px-4 py-2 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
          <span>考核維度</span>
          <span>通過標準</span>
        </div>
        {stage.gates.map((gate) => (
          <div key={gate.label} className="grid grid-cols-[1fr_1.6fr] border-t border-border/20 px-4 py-3 text-sm">
            <span className="font-medium text-foreground">{gate.label}</span>
            <span className="text-muted-foreground">{gate.target}</span>
          </div>
        ))}
      </div>
    </article>
  );
}

function OverviewSection({
  progress,
  onNavigate,
}: {
  progress: ProgressMap;
  onNavigate: (section: AcademySectionId) => void;
}) {
  const completed = Object.values(progress).filter(Boolean).length;
  const percentage = Math.round((completed / learningModules.length) * 100);
  const nextModule = learningModules.find((module) => !progress[module.id]);

  return (
    <>
      <section className="relative overflow-hidden border-b border-border/30 px-5 pb-10 pt-12 sm:px-8 lg:px-12 lg:pt-16">
        <div className="pointer-events-none absolute -right-16 -top-20 h-72 w-72 rounded-full bg-[#F37021]/10 blur-3xl" />
        <div className="relative max-w-5xl">
          <p className="text-sm font-semibold text-[#F37021]">好創學院 2.1</p>
          <h1 className="mt-3 max-w-4xl text-4xl font-black leading-tight tracking-[-0.04em] text-foreground sm:text-5xl lg:text-6xl">
            不是看完教材，
            <br />
            是要完整跑通案件。
          </h1>
          <p className="mt-5 max-w-4xl text-sm leading-7 text-muted-foreground sm:text-base">
            企劃第 1 個月要跑通社群企劃全流程、完成跨平台內容與 AI 資產；第 3 個月進入策略整合與專業進階；
            第 6 個月可穩定主責 3 件以上案件。考核只看真實工作證據，不看口號。
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <button
              onClick={() => onNavigate("planner")}
              className="inline-flex items-center gap-2 rounded-lg bg-[#F37021] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#FF8C42]"
            >
              查看完整企劃流程 <ArrowRight size={16} />
            </button>
            <button
              onClick={() => onNavigate("assessment")}
              className="inline-flex items-center gap-2 rounded-lg border border-border/50 bg-background/60 px-5 py-3 text-sm font-bold text-foreground transition hover:bg-border/10"
            >
              查看考核標準 <ClipboardCheck size={16} />
            </button>
          </div>
        </div>
      </section>

      <div className="space-y-8 px-5 py-8 sm:px-8 lg:px-12">
        <NonNegotiables />

        <section className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
          <article className="rounded-2xl border border-border/40 bg-background/60 p-5 sm:p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.15em] text-muted-foreground">我的能力進度</p>
                <p className="mt-2 text-3xl font-black text-foreground">{percentage}%</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#F37021]/10 text-[#F37021]">
                <FileCheck2 size={24} />
              </div>
            </div>
            <div className="mt-5 h-2 overflow-hidden rounded-full bg-border/20">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#F37021] to-[#FFB347] transition-all"
                style={{ width: `${percentage}%` }}
              />
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              已完成 {completed}／{learningModules.length} 個能力模組。勾選只是自我追蹤，正式通過仍須提交真實工作證據。
            </p>
          </article>

          <article className="rounded-2xl border border-border/40 bg-background/60 p-5 sm:p-6">
            <p className="text-xs font-bold uppercase tracking-[0.15em] text-muted-foreground">下一個建議行動</p>
            {nextModule ? (
              <>
                <h2 className="mt-3 text-xl font-black text-foreground">{nextModule.title}</h2>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{nextModule.outcome}</p>
                <button
                  onClick={() => onNavigate("planner")}
                  className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-[#F37021] hover:text-[#FF8C42]"
                >
                  查看模組與證據要求 <ChevronRight size={16} />
                </button>
              </>
            ) : (
              <>
                <h2 className="mt-3 text-xl font-black text-foreground">知識模組已完成</h2>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">下一步是提交真實案件證據並接受主管評核。</p>
              </>
            )}
          </article>
        </section>

        <section>
          <div className="mb-5">
            <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#F37021]">第一個月核心交付</p>
            <h2 className="mt-2 text-2xl font-black text-foreground">五個成果包，少一包都不算獨立</h2>
          </div>
          <div className="grid gap-4 xl:grid-cols-2">
            {firstMonthDeliverables.map((group) => (
              <article key={group.title} className="rounded-2xl border border-border/40 bg-background/60 p-5">
                <h3 className="text-lg font-black text-foreground">{group.title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{group.description}</p>
                <ul className="mt-4 space-y-2.5">
                  {group.deliverables.map((item) => (
                    <li key={item} className="flex gap-3 text-sm leading-6 text-muted-foreground">
                      <CheckCircle2 className="mt-0.5 shrink-0 text-emerald-400" size={16} />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <section>
          <div className="mb-5">
            <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#F37021]">成長階段</p>
            <h2 className="mt-2 text-2xl font-black text-foreground">企劃 1／3／6 個月路徑</h2>
          </div>
          <div className="grid gap-4 xl:grid-cols-3">
            {plannerStages.map((stage) => (
              <article key={stage.month} className="rounded-2xl border border-border/40 bg-background/60 p-5">
                <p className="text-xs font-bold text-[#F37021]">{stage.title}</p>
                <h3 className="mt-2 text-lg font-black leading-7 text-foreground">{stage.headline}</h3>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">{stage.standard}</p>
                <button
                  onClick={() => onNavigate("assessment")}
                  className="mt-5 inline-flex items-center gap-1 text-xs font-bold text-foreground hover:text-[#F37021]"
                >
                  展開通過標準 <ChevronRight size={15} />
                </button>
              </article>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}

function RolesSection() {
  return (
    <div className="px-5 py-10 sm:px-8 lg:px-12">
      <SectionHeading
        eyebrow="責任不能模糊"
        title="好創職務與權責"
        description="一個人可以兼任多項職能，但每個結果必須有唯一主責人。"
      />
      <div className="grid gap-4 xl:grid-cols-2">
        {roleDefinitions.map((role) => (
          <article key={role.id} className="rounded-2xl border border-border/40 bg-background/60 p-5 sm:p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-black text-foreground">{role.title}</h2>
                <p className="mt-1 text-xs font-semibold text-[#F37021]">{role.owner}</p>
              </div>
              <Layers className="text-muted-foreground" size={20} />
            </div>
            <p className="mt-4 text-sm leading-7 text-muted-foreground">{role.mission}</p>
            <div className="mt-5 grid gap-5 md:grid-cols-3">
              <div>
                <p className="mb-2 text-xs font-bold text-foreground">最終結果</p>
                <ul className="space-y-2 text-xs leading-5 text-muted-foreground">
                  {role.outcomes.map((item) => <li key={item}>• {item}</li>)}
                </ul>
              </div>
              <div>
                <p className="mb-2 text-xs font-bold text-foreground">可自行決定</p>
                <ul className="space-y-2 text-xs leading-5 text-muted-foreground">
                  {role.decisionRights.map((item) => <li key={item}>• {item}</li>)}
                </ul>
              </div>
              <div>
                <p className="mb-2 text-xs font-bold text-foreground">必須升級</p>
                <ul className="space-y-2 text-xs leading-5 text-muted-foreground">
                  {role.escalation.map((item) => <li key={item}>• {item}</li>)}
                </ul>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

function PlannerSection({
  progress,
  onToggle,
}: {
  progress: ProgressMap;
  onToggle: (id: string) => void;
}) {
  const [query, setQuery] = useState("");
  const [month, setMonth] = useState<1 | 3 | 6>(1);

  const modules = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return learningModules.filter(
      (module) =>
        module.requiredByMonth <= month &&
        (!normalized ||
          module.title.toLowerCase().includes(normalized) ||
          module.outcome.toLowerCase().includes(normalized) ||
          module.category.toLowerCase().includes(normalized)),
    );
  }, [month, query]);

  return (
    <div className="px-5 py-10 sm:px-8 lg:px-12">
      <SectionHeading
        eyebrow="完整能力養成"
        title="企劃不是只會想題材"
        description="第一個月就必須跑通市場、商業、受眾、競品、策略、六平台矩陣、圖文、輪播、文案、短影音、AI 專案、SKILL、行政、發布與數據。"
      />
      <NonNegotiables />

      <section className="mt-8">
        <div className="mb-5 flex items-center gap-3">
          <Workflow className="text-[#F37021]" size={22} />
          <div>
            <h2 className="text-xl font-black text-foreground">企劃 13 階段完整流程</h2>
            <p className="mt-1 text-xs text-muted-foreground">每一階段都有目的、工具、輸出與完成標準。</p>
          </div>
        </div>
        <div className="space-y-3">
          {plannerWorkflowSteps.map((step) => (
            <article key={step.phase} className="grid gap-4 rounded-2xl border border-border/40 bg-background/60 p-5 xl:grid-cols-[70px_1fr_1fr]">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#F37021]/10 font-black text-[#F37021]">
                {step.phase}
              </div>
              <div>
                <h3 className="font-black text-foreground">{step.title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{step.purpose}</p>
                <p className="mt-3 text-xs leading-5 text-muted-foreground"><span className="font-bold text-foreground">工具：</span>{step.tools}</p>
              </div>
              <div className="rounded-xl border border-border/30 bg-border/[0.06] p-4">
                <p className="text-xs font-bold text-foreground">必須產出</p>
                <p className="mt-2 text-xs leading-6 text-muted-foreground">{step.output}</p>
                <p className="mt-3 text-xs font-bold text-emerald-400">完成標準</p>
                <p className="mt-1 text-xs leading-6 text-muted-foreground">{step.doneDefinition}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-10">
        <div className="mb-5 grid gap-3 lg:grid-cols-[1fr_auto]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="搜尋能力、工具、產出或證據"
              className="w-full rounded-xl border border-border/40 bg-background/60 py-3 pl-10 pr-4 text-sm text-foreground outline-none transition focus:border-[#F37021]/60"
            />
          </div>
          <div className="flex rounded-xl border border-border/40 bg-background/60 p-1">
            {([1, 3, 6] as const).map((value) => (
              <button
                key={value}
                onClick={() => setMonth(value)}
                className={`rounded-lg px-4 py-2 text-xs font-bold transition ${
                  month === value ? "bg-[#F37021] text-white" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {value} 個月內
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-4 xl:grid-cols-2">
          {modules.map((module) => {
            const done = Boolean(progress[module.id]);
            return (
              <article
                key={module.id}
                className={`rounded-2xl border p-5 transition ${
                  done ? "border-emerald-500/30 bg-emerald-500/[0.06]" : "border-border/40 bg-background/60"
                }`}
              >
                <div className="flex items-start gap-4">
                  <button
                    onClick={() => onToggle(module.id)}
                    aria-label={`切換 ${module.title} 完成狀態`}
                    className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md border transition ${
                      done
                        ? "border-emerald-400 bg-emerald-400 text-slate-950"
                        : "border-border/60 text-transparent hover:border-[#F37021]"
                    }`}
                  >
                    <CheckCircle2 size={15} />
                  </button>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`rounded-md border px-2 py-1 text-[10px] font-bold ${categoryClass[module.category]}`}>
                        {module.category}
                      </span>
                      <span className="text-[10px] font-bold text-muted-foreground">{module.requiredByMonth} 個月內</span>
                    </div>
                    <h3 className="mt-3 text-lg font-black text-foreground">{module.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">{module.outcome}</p>
                    <div className="mt-4 border-l-2 border-border/60 pl-3">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">工作證據</p>
                      <p className="mt-1 text-xs leading-5 text-foreground/80">{module.evidence}</p>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}

function AssessmentSection() {
  return (
    <div className="px-5 py-10 sm:px-8 lg:px-12">
      <SectionHeading
        eyebrow="真實工作驗證"
        title="1／3／6 個月考核"
        description="階段名稱只描述能力與責任，不使用對外比較或刺激性標語；內部管理者可用市場基準校準，但員工看到的是清楚、專業、可證明的標準。"
      />
      <div className="space-y-5">
        {plannerStages.map((stage) => <StageSummary key={stage.month} stage={stage} />)}
      </div>
    </div>
  );
}

function ToolkitSection() {
  return (
    <div className="px-5 py-10 sm:px-8 lg:px-12">
      <SectionHeading
        eyebrow="工作系統"
        title="工具不是目的，資料正本不能重複"
        description="好創學院負責教學、入口與能力驗證；正式客戶、任務、文件與版本仍回到各自的正本系統。"
      />
      <div className="overflow-hidden rounded-2xl border border-border/40">
        <div className="hidden grid-cols-[1fr_0.8fr_1.4fr_1.4fr] bg-border/10 px-5 py-3 text-xs font-bold text-muted-foreground lg:grid">
          <span>項目</span><span>系統／Owner</span><span>用途</span><span>完成標準</span>
        </div>
        {toolkitItems.map((item) => (
          <article key={item.title} className="grid gap-3 border-t border-border/20 bg-background/60 p-5 first:border-t-0 lg:grid-cols-[1fr_0.8fr_1.4fr_1.4fr]">
            <h3 className="font-bold text-foreground">{item.title}</h3>
            <div className="text-xs leading-5 text-muted-foreground">
              <p className="font-bold text-[#F37021]">{item.system}</p>
              <p>{item.owner}</p>
            </div>
            <p className="text-sm leading-6 text-muted-foreground">{item.purpose}</p>
            <p className="text-sm leading-6 text-foreground/80">{item.doneDefinition}</p>
          </article>
        ))}
      </div>
    </div>
  );
}

function ManagerSection() {
  const checks = [
    "他是否能在沒有逐步提醒下，完整跑通 13 階段企劃流程？",
    "他是否真的懂社群全案與單線，而不是只會短影音？",
    "他是否能獨立完成市場、競品、商業、受眾與購買旅程分析？",
    "他是否能完成六平台一個月內容矩陣，且不是複製貼上？",
    "他是否能產出圖文、輪播、文案、短影音與基本社群營運？",
    "他是否建立可實際使用的 AI 專案與 SKILL，而不只是問 AI？",
    "他的文書、排程、核准與版本是否能讓其他人快速接手？",
    "他是否持續自主學習，並把新知轉成案件改善與團隊資產？",
    "他是否提前發現風險，而不是出事後才說？",
    "第 6 個月時，Dennis 是否仍需固定替他追進度、重寫與收尾？",
  ];

  return (
    <div className="px-5 py-10 sm:px-8 lg:px-12">
      <SectionHeading
        eyebrow="主管使用"
        title="考核工作能力，不考表演"
        description="不要用閱讀時間、答題數或看起來很忙判定能力。只看案件結果、工作證據、獨立性、可交接性與改善能力。"
      />

      <div className="grid gap-4 xl:grid-cols-2">
        {checks.map((item, index) => (
          <article key={item} className="flex gap-4 rounded-2xl border border-border/40 bg-background/60 p-5">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#F37021]/10 text-xs font-black text-[#F37021]">
              {index + 1}
            </span>
            <p className="text-sm font-medium leading-7 text-foreground">{item}</p>
          </article>
        ))}
      </div>

      <section className="mt-8 rounded-2xl border border-border/40 bg-background/60 p-5 sm:p-6">
        <div className="flex items-center gap-3">
          <Sparkles className="text-[#F37021]" size={20} />
          <h2 className="text-lg font-black text-foreground">台灣市場校準訊號</h2>
        </div>
        <ul className="mt-5 space-y-3">
          {taiwanMarketSignals.map((signal) => (
            <li key={signal} className="flex gap-3 text-sm leading-7 text-muted-foreground">
              <CheckCircle2 className="mt-1 shrink-0 text-emerald-400" size={16} />
              <span>{signal}</span>
            </li>
          ))}
        </ul>
        <div className="mt-5 flex flex-wrap gap-3">
          {marketSources.map((source) => (
            <a
              key={source.url}
              href={source.url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border border-border/40 bg-border/[0.06] px-3 py-2 text-xs font-bold text-muted-foreground transition hover:text-foreground"
            >
              {source.label} <ExternalLink size={13} />
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}

export default function AcademyV2Corrected() {
  const [activeSection, setActiveSection] = useState<AcademySectionId>("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [progress, setProgress] = useState<ProgressMap>(() => readProgress());

  const handleNavigate = (section: AcademySectionId) => {
    setActiveSection(section);
    setSidebarOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleToggle = (id: string) => {
    setProgress((current) => {
      const next = { ...current, [id]: !current[id] };
      saveProgress(next);
      return next;
    });
  };

  const renderSection = () => {
    switch (activeSection) {
      case "roles":
        return <RolesSection />;
      case "planner":
        return <PlannerSection progress={progress} onToggle={handleToggle} />;
      case "assessment":
        return <AssessmentSection />;
      case "toolkit":
        return <ToolkitSection />;
      case "manager":
        return <ManagerSection />;
      default:
        return <OverviewSection progress={progress} onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <button
        onClick={() => setSidebarOpen((open) => !open)}
        className="fixed left-4 top-4 z-50 flex h-10 w-10 items-center justify-center rounded-xl border border-border/40 bg-background/90 shadow-lg backdrop-blur lg:hidden"
        aria-label="切換導覽"
      >
        {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
      </button>

      {sidebarOpen ? (
        <button
          className="fixed inset-0 z-30 bg-black/60 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-label="關閉導覽"
        />
      ) : null}

      <aside
        className={`fixed inset-y-0 left-0 z-40 w-72 border-r border-border/30 bg-background/95 backdrop-blur transition-transform lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="border-b border-border/30 p-6">
          <p className="text-xl font-black tracking-tight text-foreground">好創學院</p>
          <p className="mt-1 text-xs text-muted-foreground">工作、成長與能力驗證系統 v2.1</p>
        </div>
        <nav className="space-y-1 p-3">
          {academyNavigation.map((item) => {
            const Icon = navIconMap[item.icon];
            const active = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavigate(item.id)}
                className={`w-full rounded-xl border px-3 py-3 text-left transition ${
                  active
                    ? "border-[#F37021]/30 bg-[#F37021]/10"
                    : "border-transparent hover:border-border/30 hover:bg-border/[0.06]"
                }`}
              >
                <div className="flex items-start gap-3">
                  <Icon className={active ? "text-[#F37021]" : "text-muted-foreground"} size={18} />
                  <div>
                    <p className={`text-sm font-bold ${active ? "text-foreground" : "text-muted-foreground"}`}>{item.label}</p>
                    <p className="mt-1 text-[10px] leading-4 text-muted-foreground/70">{item.description}</p>
                  </div>
                </div>
              </button>
            );
          })}
        </nav>
      </aside>

      <main className="min-h-screen lg:ml-72">{renderSection()}</main>
    </div>
  );
}
