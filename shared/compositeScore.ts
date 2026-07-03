/**
 * 綜合評分（排行榜與管理後台共用的唯一計分公式）
 *
 * 四個組成：
 * 1. 章節完成度：(完成章節數 / 總章節數) * 40
 * 2. 測驗平均分：(平均分 / 100) * 30
 * 3. 學習時間：min(總秒數 / 3600, 10) * 2（上限 10 小時，共 20 分）
 * 4. 每日一題正確率：(正確率 %) * 0.1（共 10 分）
 */

export const TOTAL_CHAPTERS = 14;

export interface CompositeScoreInput {
  /** 已完成（測驗通過）章節數 */
  chaptersCompleted: number;
  /** 測驗平均分（0-100） */
  avgQuizScore: number;
  /** 學習總秒數 */
  totalLearningSeconds: number;
  /** 每日一題答對數（無資料時傳 0） */
  dailyQuizCorrect?: number;
  /** 每日一題已作答數（無資料時傳 0） */
  dailyQuizAnswered?: number;
}

export function computeCompositeScore({
  chaptersCompleted,
  avgQuizScore,
  totalLearningSeconds,
  dailyQuizCorrect = 0,
  dailyQuizAnswered = 0,
}: CompositeScoreInput): number {
  const dailyAccuracy =
    dailyQuizAnswered > 0 ? (dailyQuizCorrect / dailyQuizAnswered) * 100 : 0;

  return Math.round(
    (chaptersCompleted / TOTAL_CHAPTERS) * 40 +
      (avgQuizScore / 100) * 30 +
      Math.min(totalLearningSeconds / 3600, 10) * 2 +
      dailyAccuracy * 0.1,
  );
}
