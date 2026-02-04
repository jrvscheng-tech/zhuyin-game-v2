/**
 * 遊戲邏輯測試
 */

import { describe, it, expect, beforeEach } from 'vitest';
import {
  createInitialState,
  startLevel,
  answerQuestion,
  nextQuestion,
  getCurrentQuestion,
  getLevelProgress,
  calculateScore,
  checkImageMatchAnswer,
  checkZhuyinSpellAnswer,
  checkZhuyinSortAnswer,
  generateDistractorZhuyin,
  shuffleArray,
  GameState,
  QuestionType,
} from './gameLogic.js';

describe('createInitialState', () => {
  it('should return initial game state with menu state', () => {
    const state = createInitialState();
    
    expect(state.gameState).toBe(GameState.MENU);
    expect(state.score).toBe(0);
    expect(state.currentLevel).toBe(0);
    expect(state.currentQuestionIndex).toBe(0);
    expect(state.questions).toEqual([]);
    expect(state.usedVocabularyIds).toEqual([]);
    expect(state.lastAnswerCorrect).toBeNull();
  });
});

describe('startLevel', () => {
  it('should start a new level with questions', () => {
    const initialState = createInitialState();
    const state = startLevel(initialState, 1);
    
    expect(state.gameState).toBe(GameState.PLAYING);
    expect(state.currentLevel).toBe(1);
    expect(state.currentQuestionIndex).toBe(0);
    expect(state.questions.length).toBe(6); // 3 + 2 + 1
    expect(state.lastAnswerCorrect).toBeNull();
  });
  
  it('should generate correct question types', () => {
    const initialState = createInitialState();
    const state = startLevel(initialState, 1);
    
    const imageMatchCount = state.questions.filter(q => q.type === QuestionType.IMAGE_MATCH).length;
    const spellCount = state.questions.filter(q => q.type === QuestionType.ZHUYIN_SPELL).length;
    const sortCount = state.questions.filter(q => q.type === QuestionType.ZHUYIN_SORT).length;
    
    expect(imageMatchCount).toBe(3);
    expect(spellCount).toBe(2);
    expect(sortCount).toBe(1);
  });
  
  it('should track used vocabulary ids', () => {
    const initialState = createInitialState();
    const state = startLevel(initialState, 1);
    
    expect(state.usedVocabularyIds.length).toBe(6);
  });
});

describe('answerQuestion', () => {
  let playingState;
  
  beforeEach(() => {
    const initialState = createInitialState();
    playingState = startLevel(initialState, 1);
  });
  
  it('should update score when answer is correct', () => {
    const question = getCurrentQuestion(playingState);
    const correctAnswer = question.correctAnswer;
    
    const newState = answerQuestion(playingState, correctAnswer);
    
    expect(newState.score).toBeGreaterThan(0);
    expect(newState.lastAnswerCorrect).toBe(true);
    expect(newState.gameState).toBe(GameState.QUESTION_RESULT);
  });
  
  it('should not add score when answer is incorrect', () => {
    const wrongAnswer = 'ㄒㄒㄒ';
    
    const newState = answerQuestion(playingState, wrongAnswer);
    
    expect(newState.score).toBe(0);
    expect(newState.lastAnswerCorrect).toBe(false);
    expect(newState.gameState).toBe(GameState.QUESTION_RESULT);
  });
});

describe('nextQuestion', () => {
  it('should advance to next question', () => {
    const initialState = createInitialState();
    let state = startLevel(initialState, 1);
    state = answerQuestion(state, 'wrong');
    state = nextQuestion(state);
    
    expect(state.currentQuestionIndex).toBe(1);
    expect(state.gameState).toBe(GameState.PLAYING);
    expect(state.lastAnswerCorrect).toBeNull();
  });
  
  it('should complete level after all questions', () => {
    const initialState = createInitialState();
    let state = startLevel(initialState, 1);
    
    // Answer all questions
    for (let i = 0; i < state.questions.length; i++) {
      state = answerQuestion(state, 'any');
      if (i < state.questions.length - 1) {
        state = nextQuestion(state);
      }
    }
    state = nextQuestion(state);
    
    expect(state.gameState).toBe(GameState.LEVEL_COMPLETE);
  });
});

describe('getCurrentQuestion', () => {
  it('should return current question', () => {
    const initialState = createInitialState();
    const state = startLevel(initialState, 1);
    
    const question = getCurrentQuestion(state);
    
    expect(question).not.toBeNull();
    expect(question.type).toBeDefined();
    expect(question.vocabulary).toBeDefined();
    expect(question.options).toBeDefined();
  });
  
  it('should return null when no questions', () => {
    const state = createInitialState();
    
    const question = getCurrentQuestion(state);
    
    expect(question).toBeNull();
  });
});

describe('getLevelProgress', () => {
  it('should return 0 when no questions', () => {
    const state = createInitialState();
    
    const progress = getLevelProgress(state);
    
    expect(progress).toBe(0);
  });
  
  it('should return correct progress', () => {
    const initialState = createInitialState();
    let state = startLevel(initialState, 1);
    
    // First question
    expect(getLevelProgress(state)).toBeCloseTo(1/6, 2);
    
    // Move to second question
    state = answerQuestion(state, 'any');
    state = nextQuestion(state);
    expect(getLevelProgress(state)).toBeCloseTo(2/6, 2);
  });
});

describe('calculateScore', () => {
  it('should return 10 for correct image match', () => {
    expect(calculateScore(true, QuestionType.IMAGE_MATCH)).toBe(10);
  });
  
  it('should return 20 for correct zhuyin spell', () => {
    expect(calculateScore(true, QuestionType.ZHUYIN_SPELL)).toBe(20);
  });
  
  it('should return 30 for correct zhuyin sort', () => {
    expect(calculateScore(true, QuestionType.ZHUYIN_SORT)).toBe(30);
  });
  
  it('should return 0 for incorrect answer', () => {
    expect(calculateScore(false, QuestionType.IMAGE_MATCH)).toBe(0);
    expect(calculateScore(false, QuestionType.ZHUYIN_SPELL)).toBe(0);
    expect(calculateScore(false, QuestionType.ZHUYIN_SORT)).toBe(0);
  });
});

describe('checkImageMatchAnswer', () => {
  it('should return true for correct answer', () => {
    const question = {
      correctAnswer: 'ㄍㄡˇ',
    };
    
    expect(checkImageMatchAnswer(question, 'ㄍㄡˇ')).toBe(true);
  });
  
  it('should return false for incorrect answer', () => {
    const question = {
      correctAnswer: 'ㄍㄡˇ',
    };
    
    expect(checkImageMatchAnswer(question, 'ㄇㄠ')).toBe(false);
  });
});

describe('checkZhuyinSpellAnswer', () => {
  it('should return true for correct order', () => {
    const question = {
      correctAnswer: ['ㄆㄧㄥˊ', 'ㄍㄨㄛˇ'],
    };
    
    expect(checkZhuyinSpellAnswer(question, ['ㄆㄧㄥˊ', 'ㄍㄨㄛˇ'])).toBe(true);
  });
  
  it('should return false for wrong order', () => {
    const question = {
      correctAnswer: ['ㄆㄧㄥˊ', 'ㄍㄨㄛˇ'],
    };
    
    expect(checkZhuyinSpellAnswer(question, ['ㄍㄨㄛˇ', 'ㄆㄧㄥˊ'])).toBe(false);
  });
  
  it('should return false for wrong length', () => {
    const question = {
      correctAnswer: ['ㄆㄧㄥˊ', 'ㄍㄨㄛˇ'],
    };
    
    expect(checkZhuyinSpellAnswer(question, ['ㄆㄧㄥˊ'])).toBe(false);
  });
  
  it('should return false for non-array', () => {
    const question = {
      correctAnswer: ['ㄆㄧㄥˊ'],
    };
    
    expect(checkZhuyinSpellAnswer(question, 'ㄆㄧㄥˊ')).toBe(false);
  });
});

describe('checkZhuyinSortAnswer', () => {
  it('should return true for correct order', () => {
    const question = {
      correctAnswer: ['ㄅㄚˋ', 'ㄅㄚ˙'],
    };
    
    expect(checkZhuyinSortAnswer(question, ['ㄅㄚˋ', 'ㄅㄚ˙'])).toBe(true);
  });
  
  it('should return false for wrong order', () => {
    const question = {
      correctAnswer: ['ㄅㄚˋ', 'ㄅㄚ˙'],
    };
    
    expect(checkZhuyinSortAnswer(question, ['ㄅㄚ˙', 'ㄅㄚˋ'])).toBe(false);
  });
});

describe('generateDistractorZhuyin', () => {
  it('should generate correct number of distractors', () => {
    const distractors = generateDistractorZhuyin(3);
    
    expect(distractors.length).toBe(3);
  });
  
  it('should return valid zhuyin characters', () => {
    const validZhuyin = [
      'ㄅ', 'ㄆ', 'ㄇ', 'ㄈ', 'ㄉ', 'ㄊ', 'ㄋ', 'ㄌ',
      'ㄍ', 'ㄎ', 'ㄏ', 'ㄐ', 'ㄑ', 'ㄒ', 'ㄓ', 'ㄔ',
      'ㄕ', 'ㄖ', 'ㄗ', 'ㄘ', 'ㄙ', 'ㄧ', 'ㄨ', 'ㄩ',
      'ㄚ', 'ㄛ', 'ㄜ', 'ㄝ', 'ㄞ', 'ㄟ', 'ㄠ', 'ㄡ',
      'ㄢ', 'ㄣ', 'ㄤ', 'ㄥ', 'ㄦ',
    ];
    
    const distractors = generateDistractorZhuyin(5);
    
    distractors.forEach(d => {
      expect(validZhuyin).toContain(d);
    });
  });
});

describe('shuffleArray', () => {
  it('should return array of same length', () => {
    const original = [1, 2, 3, 4, 5];
    const shuffled = shuffleArray(original);
    
    expect(shuffled.length).toBe(original.length);
  });
  
  it('should contain all original elements', () => {
    const original = [1, 2, 3, 4, 5];
    const shuffled = shuffleArray(original);
    
    original.forEach(item => {
      expect(shuffled).toContain(item);
    });
  });
  
  it('should not modify original array', () => {
    const original = [1, 2, 3, 4, 5];
    const copy = [...original];
    shuffleArray(original);
    
    expect(original).toEqual(copy);
  });
});
