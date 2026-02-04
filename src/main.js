/**
 * 主應用程式入口
 */

import './style.css';
import { 
  createInitialState, 
  startLevel, 
  answerQuestion, 
  nextQuestion,
  GameState 
} from './game/gameLogic.js';
import { 
  renderMenu, 
  renderGame, 
  renderQuestionResult, 
  renderLevelComplete,
  showSparkles 
} from './ui/renderer.js';
import {
  playCorrectSound,
  playIncorrectSound,
  playClickSound,
  playLevelCompleteSound,
  playDragStartSound,
  playDropSound,
} from './audio/sounds.js';

// 遊戲狀態
let gameState = createInitialState();

// DOM 容器
const app = document.getElementById('app');

/**
 * 根據遊戲狀態渲染畫面
 */
function render() {
  switch (gameState.gameState) {
    case GameState.MENU:
      renderMenu(app, handleStartGame);
      break;
      
    case GameState.PLAYING:
      renderGame(app, gameState, {
        onAnswer: handleAnswer,
        onDragStart: handleDragStart,
        onDrop: handleDrop,
      });
      break;
      
    case GameState.QUESTION_RESULT:
      renderQuestionResult(app, gameState, {
        onNext: handleNextQuestion,
      });
      break;
      
    case GameState.LEVEL_COMPLETE:
      renderLevelComplete(app, gameState, {
        onNextLevel: handleNextLevel,
        onMenu: handleBackToMenu,
      });
      break;
  }
}

/**
 * 處理開始遊戲
 */
function handleStartGame() {
  playClickSound();
  gameState = startLevel(gameState, 1);
  render();
}

/**
 * 處理回答問題
 */
function handleAnswer(answer) {
  gameState = answerQuestion(gameState, answer);
  
  if (gameState.lastAnswerCorrect) {
    playCorrectSound();
    // 顯示閃爍特效
    const rect = app.getBoundingClientRect();
    showSparkles(app, rect.width / 2, rect.height / 2);
  } else {
    playIncorrectSound();
  }
  
  render();
}

/**
 * 處理下一題
 */
function handleNextQuestion() {
  playClickSound();
  gameState = nextQuestion(gameState);
  
  if (gameState.gameState === GameState.LEVEL_COMPLETE) {
    playLevelCompleteSound();
  }
  
  render();
}

/**
 * 處理下一關
 */
function handleNextLevel() {
  playClickSound();
  gameState = startLevel(gameState, gameState.currentLevel + 1);
  render();
}

/**
 * 處理返回主選單
 */
function handleBackToMenu() {
  playClickSound();
  gameState = createInitialState();
  render();
}

/**
 * 處理拖曳開始
 */
function handleDragStart() {
  playDragStartSound();
}

/**
 * 處理放置
 */
function handleDrop() {
  playDropSound();
}

// 初始渲染
render();
