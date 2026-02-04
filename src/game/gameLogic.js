/**
 * 遊戲核心邏輯模組
 * 純函數設計，易於測試
 */

import { getRandomVocabulary } from '../data/vocabulary.js';

/**
 * 遊戲狀態類型
 */
export const GameState = {
  MENU: 'menu',
  PLAYING: 'playing',
  QUESTION_RESULT: 'question_result',
  LEVEL_COMPLETE: 'level_complete',
  GAME_OVER: 'game_over',
};

/**
 * 題型
 */
export const QuestionType = {
  IMAGE_MATCH: 'image_match',      // 圖像配對
  ZHUYIN_SPELL: 'zhuyin_spell',    // 注音拼字
  ZHUYIN_SORT: 'zhuyin_sort',      // 注音排序
};

/**
 * 建立初始遊戲狀態
 */
export function createInitialState() {
  return {
    gameState: GameState.MENU,
    score: 0,
    currentLevel: 0,
    currentQuestionIndex: 0,
    questions: [],
    usedVocabularyIds: [],
    lastAnswerCorrect: null,
  };
}

/**
 * 生成一個關卡的題目
 * 每關：圖像配對×3 + 注音拼字×2 + 注音排序×1
 */
export function generateLevelQuestions(usedIds = []) {
  const questions = [];
  const levelUsedIds = [...usedIds];
  
  // 圖像配對 × 3
  for (let i = 0; i < 3; i++) {
    const vocab = getRandomVocabulary(1, levelUsedIds)[0];
    if (!vocab) break;
    levelUsedIds.push(vocab.id);
    
    // 取得干擾選項（其他注音）
    const distractors = getRandomVocabulary(3, [vocab.id])
      .map(v => v.zhuyin.join(''));
    
    questions.push({
      type: QuestionType.IMAGE_MATCH,
      vocabulary: vocab,
      options: shuffleArray([vocab.zhuyin.join(''), ...distractors]),
      correctAnswer: vocab.zhuyin.join(''),
    });
  }
  
  // 注音拼字 × 2
  for (let i = 0; i < 2; i++) {
    const vocab = getRandomVocabulary(1, levelUsedIds)[0];
    if (!vocab) break;
    levelUsedIds.push(vocab.id);
    
    // 將注音打散並加入一些干擾
    const correctZhuyin = [...vocab.zhuyin];
    const distractorZhuyin = generateDistractorZhuyin(2);
    
    questions.push({
      type: QuestionType.ZHUYIN_SPELL,
      vocabulary: vocab,
      options: shuffleArray([...correctZhuyin, ...distractorZhuyin]),
      correctAnswer: correctZhuyin,
      slots: correctZhuyin.length,
    });
  }
  
  // 注音排序 × 1
  const sortVocab = getRandomVocabulary(1, levelUsedIds)[0];
  if (sortVocab) {
    levelUsedIds.push(sortVocab.id);
    
    questions.push({
      type: QuestionType.ZHUYIN_SORT,
      vocabulary: sortVocab,
      options: shuffleArray([...sortVocab.zhuyin]),
      correctAnswer: sortVocab.zhuyin,
    });
  }
  
  return {
    questions,
    usedIds: levelUsedIds,
  };
}

/**
 * 生成干擾用的注音符號
 */
export function generateDistractorZhuyin(count) {
  const allZhuyin = [
    'ㄅ', 'ㄆ', 'ㄇ', 'ㄈ', 'ㄉ', 'ㄊ', 'ㄋ', 'ㄌ',
    'ㄍ', 'ㄎ', 'ㄏ', 'ㄐ', 'ㄑ', 'ㄒ', 'ㄓ', 'ㄔ',
    'ㄕ', 'ㄖ', 'ㄗ', 'ㄘ', 'ㄙ', 'ㄧ', 'ㄨ', 'ㄩ',
    'ㄚ', 'ㄛ', 'ㄜ', 'ㄝ', 'ㄞ', 'ㄟ', 'ㄠ', 'ㄡ',
    'ㄢ', 'ㄣ', 'ㄤ', 'ㄥ', 'ㄦ',
  ];
  
  const shuffled = shuffleArray([...allZhuyin]);
  return shuffled.slice(0, count);
}

/**
 * 檢查圖像配對答案
 */
export function checkImageMatchAnswer(question, selectedAnswer) {
  return selectedAnswer === question.correctAnswer;
}

/**
 * 檢查注音拼字答案
 */
export function checkZhuyinSpellAnswer(question, userAnswer) {
  if (!Array.isArray(userAnswer) || userAnswer.length !== question.correctAnswer.length) {
    return false;
  }
  
  return userAnswer.every((char, index) => char === question.correctAnswer[index]);
}

/**
 * 檢查注音排序答案
 */
export function checkZhuyinSortAnswer(question, userOrder) {
  if (!Array.isArray(userOrder) || userOrder.length !== question.correctAnswer.length) {
    return false;
  }
  
  return userOrder.every((char, index) => char === question.correctAnswer[index]);
}

/**
 * 計算得分
 */
export function calculateScore(isCorrect, questionType) {
  if (!isCorrect) return 0;
  
  const scores = {
    [QuestionType.IMAGE_MATCH]: 10,
    [QuestionType.ZHUYIN_SPELL]: 20,
    [QuestionType.ZHUYIN_SORT]: 30,
  };
  
  return scores[questionType] || 10;
}

/**
 * 更新遊戲狀態 - 開始新關卡
 */
export function startLevel(state, levelNumber = 1) {
  const { questions, usedIds } = generateLevelQuestions(state.usedVocabularyIds);
  
  return {
    ...state,
    gameState: GameState.PLAYING,
    currentLevel: levelNumber,
    currentQuestionIndex: 0,
    questions,
    usedVocabularyIds: usedIds,
    lastAnswerCorrect: null,
  };
}

/**
 * 更新遊戲狀態 - 回答問題
 */
export function answerQuestion(state, answer) {
  const currentQuestion = state.questions[state.currentQuestionIndex];
  if (!currentQuestion) return state;
  
  let isCorrect = false;
  
  switch (currentQuestion.type) {
    case QuestionType.IMAGE_MATCH:
      isCorrect = checkImageMatchAnswer(currentQuestion, answer);
      break;
    case QuestionType.ZHUYIN_SPELL:
      isCorrect = checkZhuyinSpellAnswer(currentQuestion, answer);
      break;
    case QuestionType.ZHUYIN_SORT:
      isCorrect = checkZhuyinSortAnswer(currentQuestion, answer);
      break;
  }
  
  const scoreGained = calculateScore(isCorrect, currentQuestion.type);
  
  return {
    ...state,
    score: state.score + scoreGained,
    lastAnswerCorrect: isCorrect,
    gameState: GameState.QUESTION_RESULT,
  };
}

/**
 * 更新遊戲狀態 - 進入下一題
 */
export function nextQuestion(state) {
  const nextIndex = state.currentQuestionIndex + 1;
  
  if (nextIndex >= state.questions.length) {
    return {
      ...state,
      gameState: GameState.LEVEL_COMPLETE,
    };
  }
  
  return {
    ...state,
    currentQuestionIndex: nextIndex,
    gameState: GameState.PLAYING,
    lastAnswerCorrect: null,
  };
}

/**
 * 取得目前題目
 */
export function getCurrentQuestion(state) {
  return state.questions[state.currentQuestionIndex] || null;
}

/**
 * 取得關卡進度 (0-1)
 */
export function getLevelProgress(state) {
  if (state.questions.length === 0) return 0;
  return (state.currentQuestionIndex + 1) / state.questions.length;
}

/**
 * 洗牌演算法 (Fisher-Yates)
 */
export function shuffleArray(array) {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}
