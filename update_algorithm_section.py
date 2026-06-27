#!/usr/bin/env python3
"""
更新 data.ts：在第四章新增「2026年 Meta 演算法認知」section
"""

import re

# 讀取 data.ts
with open('/home/ubuntu/haochuang-academy/client/src/lib/data.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# 新增的 section 內容
new_section_algorithm = '''      {
        id: "ch4-s4",
        title: "2026年 Meta 演算法完整認知",
        type: "text",
        content: "**2026年的演算法不再只看『有多少人互動』，而是看『什麼樣的人互動』和『人是否看完』。**\\n\\n三個核心指標已經改變了遊戲規則：\\n\\n**1. 完播率（Completion Rate）- 權重 30%**\\n- 定義：看完整支影片的人數 / 總觀看人數\\n- 及格線：> 50% | 優秀線：> 80%\\n- 如何提升：前 2 秒視覺衝擊、中間 3-15 秒節奏變化、結尾 15-30 秒情感高潮\\n\\n**2. 複看率（Rewatch Rate）- 權重 25%**\\n- 定義：看第二次的人數 / 總觀看人數\\n- 及格線：> 20% | 優秀線：> 50%\\n- 如何提升：設計『值得看第二次』的內容（教育、故事、對比、懸念）\\n\\n**3. 互動品質（Interaction Quality）- 權重 25%**\\n- 定義：誰在互動比有多少人互動更重要\\n- 垃圾互動 = 演算法扣分（機器人、互讚群、垃圾帳號）\\n- 精準互動 = 演算法加分（目標客群、意見領袖）\\n\\n**企劃的新職責：**\\n1. 設計『前 2 秒黃金法則』的 Hook\\n2. 設計『節奏防滑』的中段內容\\n3. 設計『複看率』的結尾 CTA\\n4. 預測『互動品質』（誰會看、誰會互動）\\n5. 追蹤『完播率、複看率、互動品質』三個指標\\n\\n詳細內容見 GitHub 的 `meta_algorithm_complete_2026.md`。"
      },
      {
        id: "ch4-s5",
        title: "企劃常見問題 Q&A（2026年版）",
        type: "text",
        content: "**Q1：為什麼我產出的腳本通過率只有 40%？**\\nA：你的 Prompt 可能不夠精準。試試：(1) 加入更多客戶背景資訊，(2) 提供過去爆款的例子，(3) 明確說出『禁止什麼』。通過率應該 ≥ 60%。\\n\\n**Q2：客戶說『我想要病毒式爆款』，怎麼回應？**\\nA：直接說：『爆款沒有公式，但我們能做的是每支內容都有 80% 的機率達到及格線。』然後展示你過去的數據。\\n\\n**Q3：我拆解了 10 支爆款，但還是不知道為什麼它們會爆？**\\nA：你可能只看了『表面』。試試用武器六的 Prompt，系統化地分析 Hook、節奏、心理學、視覺設計四個維度。\\n\\n**Q4：短影音腳本應該多詳細？**\\nA：詳細到『剪輯師拿著腳本就能直接剪輯，不用問你任何問題』。包括：時間碼、鏡頭描述、字幕內容、音效指示、特效位置。\\n\\n**Q5：怎麼知道我已經達到 Level 3？**\\nA：當你能獨立管理 1 個客戶的完整月度內容，且 80% 的內容通過率，且能主動提出『下月應該做什麼』。\\n\\n**Q6：完播率 70%、複看率 30% 算好嗎？**\\nA：中等。及格但不優秀。建議提升完播率到 80%（加快節奏、增加視覺變化），提升複看率到 50%（設計值得看第二次的內容）。\\n\\n**Q7：我的內容有 1000 個按讚，但完播率只有 40%，為什麼演算法不推送？**\\nA：因為 Meta 現在不看按讚數，看完播率。1000 個按讚（垃圾互動）= 演算法不看。完播率 40% = 演算法評分差。\\n\\n**Q8：怎麼吸引精準互動，避免垃圾互動？**\\nA：(1) 在內容中提到目標客群的痛點，(2) 在 CTA 中明確說『誰應該看』，(3) 在標籤中使用精準關鍵字，(4) 不參加互讚群、不購買假粉絲。"
      }'''

# 找到第四章的結束位置（找 ch4-s4 之後的 ]）
# 先找到 ch4-s3 的結束
pattern = r'(      \},\s+\{\s+id: "ch4-s4",)'
replacement = new_section_algorithm + r'\n    ]\n  },\n  {\n    id: "ch5",'

# 實際上，我們需要找到 ch4 的 sections 陣列結束的位置
# 找到 "ch4-s3" 之後的 "}" 和 "]"
match = re.search(r'(id: "ch4-s3".*?\n      \}\n    \]\n  \},)', content, re.DOTALL)

if match:
    # 找到了 ch4 的結束位置
    old_ch4_end = match.group(1)
    new_ch4_end = old_ch4_end.replace(
        '}\n    ]\n  },',
        '      },\n' + new_section_algorithm + '\n    ]\n  },'
    )
    content = content.replace(old_ch4_end, new_ch4_end)
    
    # 寫回 data.ts
    with open('/home/ubuntu/haochuang-academy/client/src/lib/data.ts', 'w', encoding='utf-8') as f:
        f.write(content)
    
    print("✅ 成功更新 data.ts：新增『2026年 Meta 演算法認知』section")
else:
    print("❌ 找不到 ch4-s3 的結束位置，請手動檢查")
