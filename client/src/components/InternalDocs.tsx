import { useState } from "react";
import { Shield, FileSignature, X, Copy, Check, ChevronDown, ChevronUp, AlertTriangle, FileText } from "lucide-react";

interface DocSection {
  id: string;
  title: string;
  icon: React.ReactNode;
  color: string;
  content: string[];
}

const aiSecuritySOP: DocSection = {
  id: "ai-security",
  title: "AI 使用資安 SOP",
  icon: <Shield size={20} />,
  color: "from-red-500 to-rose-600",
  content: [
    "## 核心原則：AI 是工具，不是保險箱",
    "",
    "### 🔴 第一級禁止（絕對不可貼入 AI）",
    "- 客戶的帳號密碼、API Key、Token",
    "- 客戶的財務數據（營收、利潤、成本結構）",
    "- 客戶的未公開商業計畫",
    "- 員工的身分證字號、銀行帳號",
    "- 任何合約中標註「機密」的內容",
    "",
    "### 🟠 第二級限制（需脫敏後才可使用）",
    "- 客戶品牌名稱 → 改為「A 品牌」「B 客戶」",
    "- 具體 KPI 數字 → 改為「月觸及 X 萬」",
    "- 內部流程細節 → 只描述邏輯，不寫工具名",
    "- 員工姓名 → 改為職稱（如「剪輯師」「企劃」）",
    "",
    "### 🟢 第三級開放（可直接使用）",
    "- 公開的行銷知識、演算法趨勢",
    "- 通用的文案結構、腳本模板",
    "- 已發布的社群貼文（公開內容）",
    "- 產業報告、市場數據（已公開來源）",
    "",
    "### AI 工具使用分級",
    "",
    "| 等級 | 工具 | 可處理資料 | 備註 |",
    "|------|------|-----------|------|",
    "| A 級（最安全） | Manus | 第二、三級資料 | 企業級加密，資料不外流 |",
    "| B 級（標準） | ChatGPT / Claude / Gemini | 僅第三級資料 | 可能用於模型訓練 |",
    "| C 級（禁止） | 不明來源 AI 工具 | 禁止使用 | 資料安全無保障 |",
    "",
    "### 實戰判斷題（自我檢查）",
    "",
    "**Q1：** 客戶給了一份 Excel，裡面有本月廣告花費和 ROAS，我想用 ChatGPT 分析趨勢。",
    "**正確做法：** ❌ 不可直接貼入。需先脫敏：移除客戶名稱，數字改為相對比例。",
    "",
    "**Q2：** 我想用 AI 幫我寫一封給客戶的報告信。",
    "**正確做法：** ⚠️ 可以，但客戶名稱改為代號，具體數字用 X 代替，完成後再手動填入。",
    "",
    "**Q3：** 我想用 Manus 批量生成 30 則社群貼文。",
    "**正確做法：** ✅ 可以。Manus 為 A 級工具，且社群貼文屬第三級開放資料。",
    "",
    "**Q4：** 客戶的 IG 帳號密碼存在 Notion，我想複製到 AI 請它幫我排程。",
    "**正確做法：** ❌ 絕對禁止。帳號密碼屬第一級禁止資料，任何 AI 工具都不可使用。",
    "",
    "**Q5：** 我想用 AI 分析競品的公開社群貼文表現。",
    "**正確做法：** ✅ 完全可以。公開貼文屬第三級開放資料。",
    "",
    "### 違反後果",
    "- 第一次：口頭警告 + 重新培訓",
    "- 第二次：書面警告 + 暫停 AI 工具使用權限 7 天",
    "- 第三次：依勞基法處理",
    "",
    "### 發現洩漏時的補救流程",
    "1. 立即停止使用該 AI 工具",
    "2. 截圖保留證據",
    "3. 10 分鐘內通報 COO（子權）",
    "4. 評估影響範圍",
    "5. 通知受影響客戶（如有必要）",
    "6. 更換所有可能外洩的密碼/Token",
  ],
};

const contractTemplate: DocSection = {
  id: "contract",
  title: "服務合約模板",
  icon: <FileSignature size={20} />,
  color: "from-blue-500 to-indigo-600",
  content: [
    "## 好創整合行銷 — 服務合約模板",
    "",
    "### 第一條：服務內容",
    "",
    "**社群行銷服務：**",
    "- 每月 X 則貼文（含文案 + 視覺設計）",
    "- 每月 X 支短影音（含企劃 + 拍攝 + 剪輯）",
    "- 社群帳號日常維護與互動管理",
    "- 月度成效報告",
    "",
    "**短影音代操服務：**",
    "- 每月 X 支短影音（15-60 秒）",
    "- 含企劃、腳本、拍攝、剪輯、字幕",
    "- 多平台發布（IG Reels / TikTok / YouTube Shorts）",
    "- A/B 測試與優化建議",
    "",
    "**廣告投放服務：**",
    "- Meta 廣告帳戶管理",
    "- 每月廣告素材製作 X 組",
    "- 受眾設定與優化",
    "- 週報 + 月報",
    "",
    "**網站建置服務：**",
    "- 響應式網站設計與開發",
    "- SEO 基礎優化",
    "- 內容管理系統建置",
    "- 上線後 30 天免費維護",
    "",
    "### 第二條：費用與支付方式",
    "",
    "| 服務類型 | 計費方式 | 支付時間 |",
    "|---------|---------|---------|",
    "| 月費制服務 | 每月 NT$ _____ | 每月 1 日前支付當月全款 |",
    "| 單次專案 | 總價 NT$ _____ | 簽約時支付 50% 訂金，驗收後支付 50% 尾款 |",
    "| 廣告投放 | 管理費 + 廣告預算 | 管理費月付，廣告預算依平台規定 |",
    "",
    "**付款方式：** 銀行轉帳 / PayNow 電子發票",
    "",
    "### 第三條：服務期間與終止",
    "",
    "- 合約期間：自 ___年___月___日 起至 ___年___月___日 止",
    "- 提前終止：任一方需提前 30 天書面通知",
    "- 已支付費用：按比例退還未執行部分",
    "- 廣告預算：已投放部分不予退還",
    "",
    "### 第四條：保密與知識產權",
    "",
    "- 雙方對合作期間知悉的商業機密負有保密義務",
    "- 好創製作的素材，著作權歸屬依以下規則：",
    "  - 客戶已付清全款 → 著作權歸客戶所有",
    "  - 客戶未付清款項 → 著作權歸好創所有",
    "- 好創保留將作品放入作品集的權利（脫敏後）",
    "",
    "### 第五條：成效與責任",
    "",
    "- 好創承諾按約定品質與數量交付服務",
    "- 社群成效受演算法、市場等不可控因素影響",
    "- 好創不保證特定的粉絲數、觸及率或銷售額",
    "- 好創承諾持續優化策略，並在月報中說明調整方向",
    "",
    "### 第六條：風險與免責",
    "",
    "- 因客戶延遲提供素材導致的延期，不計入好創責任",
    "- 因平台政策變更導致的服務調整，雙方協商解決",
    "- 不可抗力事件（天災、疫情、政策變更）免除雙方責任",
    "",
    "### 簽署",
    "",
    "甲方（客戶）：_____________ 日期：___/___/___",
    "",
    "乙方（好創整合行銷）：_____________ 日期：___/___/___",
  ],
};

export default function InternalDocs({ onClose }: { onClose: () => void }) {
  const [activeDoc, setActiveDoc] = useState<string>("ai-security");
  const [copiedSection, setCopiedSection] = useState<string | null>(null);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    "ai-security": true,
    "contract": true,
  });

  const docs = [aiSecuritySOP, contractTemplate];
  const currentDoc = docs.find(d => d.id === activeDoc) || docs[0];

  const handleCopy = (content: string[], docTitle: string) => {
    const text = content.join("\n");
    navigator.clipboard.writeText(text).then(() => {
      setCopiedSection(docTitle);
      setTimeout(() => setCopiedSection(null), 2000);
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      
      {/* Modal */}
      <div className="relative w-full max-w-4xl max-h-[85vh] bg-background/95 backdrop-blur-xl border border-border/30 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg">
              <FileText size={20} className="text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-foreground">內部文件</h2>
              <p className="text-xs text-muted-foreground">好創整合行銷 — 機密文件，禁止外流</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-border/20 hover:bg-border/40 flex items-center justify-center transition-colors"
          >
            <X size={16} className="text-muted-foreground" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-border/30 px-6">
          {docs.map((doc) => (
            <button
              key={doc.id}
              onClick={() => setActiveDoc(doc.id)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-all duration-200 ${
                activeDoc === doc.id
                  ? "border-[#F37021] text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {doc.icon}
              <span>{doc.title}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Warning Banner */}
          <div className="mb-6 p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3">
            <AlertTriangle size={18} className="text-amber-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-foreground">機密文件提醒</p>
              <p className="text-xs text-muted-foreground mt-1">
                本文件僅供好創內部員工使用，禁止截圖、轉發或分享給任何外部人員。
              </p>
            </div>
          </div>

          {/* Copy Button */}
          <div className="flex justify-end mb-4">
            <button
              onClick={() => handleCopy(currentDoc.content, currentDoc.title)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-border/20 hover:bg-border/40 text-xs text-muted-foreground hover:text-foreground transition-all"
            >
              {copiedSection === currentDoc.title ? (
                <>
                  <Check size={12} className="text-emerald-400" />
                  <span className="text-emerald-400">已複製</span>
                </>
              ) : (
                <>
                  <Copy size={12} />
                  <span>複製全文</span>
                </>
              )}
            </button>
          </div>

          {/* Document Content */}
          <div className="prose prose-sm prose-invert max-w-none">
            {currentDoc.content.map((line, idx) => {
              if (line.startsWith("## ")) {
                return (
                  <h2 key={idx} className="text-xl font-bold text-foreground mt-6 mb-4 pb-2 border-b border-border/30">
                    {line.replace("## ", "")}
                  </h2>
                );
              }
              if (line.startsWith("### ")) {
                return (
                  <h3 key={idx} className="text-base font-semibold text-foreground mt-5 mb-3">
                    {line.replace("### ", "")}
                  </h3>
                );
              }
              if (line.startsWith("**Q")) {
                return (
                  <p key={idx} className="text-sm font-semibold text-foreground mt-3 mb-1">
                    {line.replace(/\*\*/g, "")}
                  </p>
                );
              }
              if (line.startsWith("**正確做法：**")) {
                const isCorrect = line.includes("✅");
                const isWarning = line.includes("⚠️");
                const bgColor = isCorrect ? "bg-emerald-500/10 border-emerald-500/30" : isWarning ? "bg-amber-500/10 border-amber-500/30" : "bg-red-500/10 border-red-500/30";
                return (
                  <p key={idx} className={`text-sm p-2.5 rounded-lg border ${bgColor} mb-3`}>
                    {line.replace("**正確做法：** ", "")}
                  </p>
                );
              }
              if (line.startsWith("| ")) {
                // Table row
                const cells = line.split("|").filter(c => c.trim());
                const isHeader = idx < currentDoc.content.length - 1 && currentDoc.content[idx + 1]?.startsWith("|---");
                const isSeparator = line.includes("---");
                if (isSeparator) return null;
                return (
                  <div key={idx} className={`grid gap-2 py-2 px-3 text-xs ${isHeader ? "font-semibold text-foreground bg-border/10 rounded-t-lg" : "text-muted-foreground border-b border-border/10"}`} style={{ gridTemplateColumns: `repeat(${cells.length}, minmax(0, 1fr))` }}>
                    {cells.map((cell, cellIdx) => (
                      <span key={cellIdx} className="truncate">{cell.trim()}</span>
                    ))}
                  </div>
                );
              }
              if (line.startsWith("- ")) {
                return (
                  <li key={idx} className="text-sm text-muted-foreground ml-4 mb-1.5 list-disc">
                    {line.replace("- ", "").replace(/\*\*/g, "")}
                  </li>
                );
              }
              if (line.startsWith("  - ")) {
                return (
                  <li key={idx} className="text-sm text-muted-foreground ml-8 mb-1 list-circle">
                    {line.replace("  - ", "")}
                  </li>
                );
              }
              if (line === "") {
                return <div key={idx} className="h-2" />;
              }
              return (
                <p key={idx} className="text-sm text-muted-foreground mb-2">
                  {line.replace(/\*\*/g, "")}
                </p>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border/30 flex items-center justify-between">
          <p className="text-[10px] text-muted-foreground">
            最後更新：2026/06/28 · 版本 1.0
          </p>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-[#F37021] hover:bg-[#F37021]/90 text-white text-sm font-medium transition-colors"
          >
            關閉
          </button>
        </div>
      </div>
    </div>
  );
}
