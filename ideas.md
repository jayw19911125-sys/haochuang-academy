# 好創學院｜互動式教學系統 — 設計方向

## 三個設計方向

### 方向一：「暗夜指揮所」— Military Command Center
- **簡介：** 深色背景搭配霓虹色高亮，模擬軍事指揮中心的數據面板感。資訊密度高、層次分明，適合內部工具的「專業感」。
- **機率：** 0.03

### 方向二：「知識星圖」— Knowledge Constellation
- **簡介：** 以深空為背景，各章節如星座般散佈，點擊後展開為完整知識模組。強調探索感與連結性，適合知識地圖的視覺隱喻。
- **機率：** 0.05

### 方向三：「工匠書房」— Craftsman's Study
- **簡介：** 暖色調、紙質紋理、手工感排版，模擬一本精裝工具書被攤開在桌上的感覺。強調「可信賴的知識」與「沉浸式閱讀」。
- **機率：** 0.02

---

## ✅ 選定方向：「暗夜指揮所」— Military Command Center

### Design Movement
**Cyberpunk Dashboard / Data-Dense Dark UI** — 融合 Bloomberg Terminal 的資訊密度與 Figma 的現代感，打造「高效內部工具」的視覺語言。

### Core Principles
1. **資訊密度優先：** 每一屏都有高密度的可操作資訊，不浪費空間
2. **層次感分明：** 用光影、邊框、透明度建立清晰的視覺層級
3. **動態回饋：** 每個互動都有即時、精確的視覺回饋
4. **模組化結構：** 所有內容區塊都是獨立的「面板」，可展開/收合

### Color Philosophy
- **品牌主色：** 愛馬仕橘 Hermès Orange（#F37021 / oklch(0.68 0.19 45)）— 好創的核心識別色
- **主背景：** 極深的暖灰色（oklch(0.12 0.01 50)）— 長時間閱讀不刺眼，暖調呼應品牌橘
- **面板背景：** 半透明深色（oklch(0.16 0.008 50 / 85%)）— 層次感
- **次強調色：** 暖白金（oklch(0.85 0.06 80)）— 次要標記
- **成功色：** 翡翠綠（oklch(0.7 0.18 155)）— 完成狀態
- **文字色：** 高對比暖白（oklch(0.93 0.005 60)）
- **Glassmorphism 面板：** backdrop-blur + 半透明邊框 + 品牌橘微光

### Layout Paradigm
- **左側固定導航欄：** 章節目錄，帶進度指示器
- **主內容區：** 卡片式面板佈局，支援展開/收合
- **右側浮動面板：** 快速參考（Prompt 複製、工具連結）
- **頂部狀態列：** 學習進度、當前章節、Notion 連結

### Signature Elements
1. **發光邊框（Glow Border）：** 面板邊緣帶有微弱的電光藍發光效果
2. **進度粒子動畫：** 完成章節時，粒子從完成點向下一章節流動
3. **代碼區塊風格的 Prompt 展示：** 所有 AI Prompt 都以終端機風格展示，帶一鍵複製

### Interaction Philosophy
- 所有展開/收合都有 spring 物理動畫（framer-motion）
- 滑鼠懸停時面板微微「浮起」（translateY + shadow）
- 點擊 Prompt 區塊時有「複製成功」的脈衝動畫
- 側邊欄章節切換時有 slide + fade 組合過渡

### Animation
- **進入動畫：** stagger 30ms，從 opacity:0 + translateY:12px 進入
- **面板展開：** spring(stiffness: 300, damping: 30)
- **懸停效果：** 160ms ease-out，translateY(-2px) + boxShadow 增強
- **頁面切換：** 200ms fade + 100ms slide
- **進度條：** 線性動畫，帶發光效果

### Typography System
- **標題字體：** Noto Sans TC 700 — 清晰有力
- **正文字體：** Noto Sans TC 400 — 可讀性最佳
- **代碼/Prompt：** JetBrains Mono — 技術感
- **H1：** clamp(28px, 5vw, 42px)
- **H2：** clamp(22px, 4vw, 32px)
- **正文：** clamp(14px, 2.5vw, 16px)

### Brand Essence
好創學院：為整合行銷團隊打造的 AI 驅動知識作戰系統 — 專業、高效、可執行。
**個性形容詞：** 精準、高效、科技感

### Brand Voice
- 標題語氣：直接、動詞開頭、不囉嗦（例：「掌握飛輪，啟動閉環」）
- CTA 語氣：命令式、帶緊迫感（例：「立即複製這段 Prompt」）
- 禁止：「歡迎來到」、「讓我們一起」、「開始你的旅程」

### Wordmark & Logo
- 好創學院的 Logo：一個抽象的「H」字形，由電路板線條構成，帶電光藍發光
- Favicon：簡化版的電路「H」

### Signature Brand Color
**愛馬仕橘 #F37021 / oklch(0.68 0.19 45)** — 好創的品牌識別色，出現在所有按鈕、邊框高亮、進度條、CTA 元素上。

### 頂級前端設計技術應用清單
1. **Glassmorphism（玻璃擬態）：** 所有卡片使用 backdrop-blur + 半透明背景 + 微光邊框
2. **Bento Grid Layout：** 不對稱網格佈局，模仿 Apple 風格的資訊展示
3. **Gradient Mesh：** 背景使用多色漸層網格，品牌橘為主調
4. **Micro-interactions：** 所有按鈕、卡片、連結都有精緻的懸停/點擊回饋
5. **Scroll-triggered Animations：** 滾動時觸發元素進入動畫（IntersectionObserver）
6. **Animated Borders：** 卡片邊框帶有流動的漸層動畫（conic-gradient rotation）
7. **Glow Effects：** 品牌橘的發光效果用於重要元素
8. **Smooth Page Transitions：** 頁面切換使用 Framer Motion layoutId
9. **Parallax Scrolling：** 背景元素與前景有不同的滾動速度
10. **Progressive Disclosure：** 內容漸進式展開，不一次壓垮新人
11. **Responsive clamp()：** 所有尺寸使用 clamp() 動態計算
12. **Custom Scrollbar：** 自定義滾動條，品牌橘色
13. **Animated SVG Icons：** 圖標帶有入場動畫
14. **Noise Texture Overlay：** 微噪點紋理增加質感
15. **Spotlight Effect：** 滑鼠跟隨的聚光燈效果
