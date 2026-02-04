/**
 * UI 渲染模組
 * 負責將遊戲狀態渲染到 DOM
 */

import {
  GameState,
  QuestionType,
  getCurrentQuestion,
  getLevelProgress
} from '../game/gameLogic.js';

/**
 * 渲染主選單
 */
export function renderMenu(container, onStartGame) {
  container.innerHTML = `
    <div class="flex flex-col items-center justify-center min-h-[80vh] gap-8">
      <!-- 標題 -->
      <div class="text-center animate-float">
        <h1 class="game-title mb-4">注音闖關</h1>
        <p class="text-xl text-gray-600">學習注音符號的趣味遊戲</p>
      </div>

      <!-- 遊戲角色裝飾 -->
      <div class="w-40 h-40 bg-ghibli-cream rounded-full shadow-xl flex items-center justify-center">
        <span class="text-7xl">🎨</span>
      </div>

      <!-- 遊戲說明 -->
      <div class="card max-w-md text-center">
        <h2 class="text-xl font-bold mb-3 text-gray-700">遊戲說明</h2>
        <ul class="text-left text-gray-600 space-y-2">
          <li class="flex items-center gap-2">
            <span class="text-2xl">🖼️</span>
            <span>圖像配對：把圖片拖到正確的注音</span>
          </li>
          <li class="flex items-center gap-2">
            <span class="text-2xl">✍️</span>
            <span>注音拼字：用注音卡拼出正確的字</span>
          </li>
          <li class="flex items-center gap-2">
            <span class="text-2xl">🔢</span>
            <span>注音排序：把打亂的注音排好順序</span>
          </li>
        </ul>
      </div>

      <!-- 開始按鈕 -->
      <button id="start-btn" class="btn-primary text-2xl px-12 py-4">
        開始遊戲 🚀
      </button>
    </div>
  `;

  container.querySelector('#start-btn').addEventListener('click', onStartGame);
}

/**
 * 渲染遊戲畫面
 */
export function renderGame(container, state, handlers) {
  const question = getCurrentQuestion(state);
  if (!question) return;

  const progress = getLevelProgress(state);

  container.innerHTML = `
    <div class="flex flex-col gap-6">
      <!-- 頂部狀態列 -->
      <div class="flex justify-between items-center">
        <div class="score-display">
          ⭐ ${state.score} 分
        </div>
        <div class="text-gray-600 font-bold">
          第 ${state.currentLevel} 關
        </div>
        <div class="text-gray-500">
          ${state.currentQuestionIndex + 1} / ${state.questions.length}
        </div>
      </div>

      <!-- 進度條 -->
      <div class="progress-bar">
        <div class="progress-fill" style="width: ${progress * 100}%"></div>
      </div>

      <!-- 題目區域 -->
      <div id="question-area" class="mt-4">
        <!-- 根據題型渲染不同內容 -->
      </div>
    </div>
  `;

  const questionArea = container.querySelector('#question-area');

  switch (question.type) {
    case QuestionType.IMAGE_MATCH:
      renderImageMatchQuestion(questionArea, question, handlers);
      break;
    case QuestionType.ZHUYIN_SPELL:
      renderZhuyinSpellQuestion(questionArea, question, handlers);
      break;
    case QuestionType.ZHUYIN_SORT:
      renderZhuyinSortQuestion(questionArea, question, handlers);
      break;
  }
}

/**
 * 渲染圖像配對題
 */
function renderImageMatchQuestion(container, question, handlers) {
  const imagePath = `./images/${question.vocabulary.image}`;

  container.innerHTML = `
    <div class="flex flex-col items-center gap-8">
      <h2 class="text-2xl font-bold text-gray-700">把圖片拖到正確的注音箱！</h2>

      <!-- 圖片（可拖曳）-->
      <div class="image-card card-hover cursor-grab" id="draggable-image" draggable="true">
        <img src="${imagePath}" alt="${question.vocabulary.display}"
             onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2280%22>🖼️</text></svg>'" />
        <div class="text-center py-2 text-3xl font-bold text-gray-700">
          ${question.vocabulary.display}
        </div>
      </div>

      <!-- 注音選項（放置區）-->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
        ${question.options.map(option => `
          <div class="drop-zone text-3xl font-bold" data-option="${option}">
            ${option}
          </div>
        `).join('')}
      </div>
    </div>
  `;

  setupImageMatchDragDrop(container, question, handlers);
}

/**
 * 設置圖像配對的拖放功能
 */
function setupImageMatchDragDrop(container, question, handlers) {
  const draggable = container.querySelector('#draggable-image');
  const dropZones = container.querySelectorAll('.drop-zone');

  draggable.addEventListener('dragstart', (e) => {
    e.dataTransfer.setData('text/plain', 'image');
    draggable.classList.add('dragging');
    handlers.onDragStart?.();
  });

  draggable.addEventListener('dragend', () => {
    draggable.classList.remove('dragging');
  });

  dropZones.forEach(zone => {
    zone.addEventListener('dragover', (e) => {
      e.preventDefault();
      zone.classList.add('drag-over');
    });

    zone.addEventListener('dragleave', () => {
      zone.classList.remove('drag-over');
    });

    zone.addEventListener('drop', (e) => {
      e.preventDefault();
      zone.classList.remove('drag-over');
      const selectedOption = zone.dataset.option;
      handlers.onAnswer?.(selectedOption);
    });
  });

  // 支援觸控
  setupTouchDragDrop(draggable, dropZones, handlers);
}

/**
 * 渲染注音拼字題
 */
function renderZhuyinSpellQuestion(container, question, handlers) {
  const imagePath = `./images/${question.vocabulary.image}`;

  container.innerHTML = `
    <div class="flex flex-col items-center gap-6">
      <h2 class="text-2xl font-bold text-gray-700">把注音卡拖到空格中！</h2>

      <!-- 圖片和空格 -->
      <div class="flex items-center gap-6">
        <div class="image-card w-32">
          <img src="${imagePath}" alt="${question.vocabulary.display}"
               onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2280%22>🖼️</text></svg>'" />
        </div>

        <div class="flex gap-2" id="spell-slots">
          ${Array(question.slots).fill(0).map((_, i) => `
            <div class="drop-zone w-20 h-20 text-3xl" data-slot="${i}"></div>
          `).join('')}
        </div>
      </div>

      <!-- 注音卡片 -->
      <div class="flex flex-wrap justify-center gap-3" id="zhuyin-cards">
        ${question.options.map((zhuyin, i) => `
          <div class="zhuyin-card" draggable="true" data-zhuyin="${zhuyin}" data-index="${i}">
            ${zhuyin}
          </div>
        `).join('')}
      </div>

      <!-- 確認按鈕 -->
      <button id="check-spell-btn" class="btn-primary mt-4" disabled>
        確認答案 ✓
      </button>
    </div>
  `;

  setupZhuyinSpellDragDrop(container, question, handlers);
}

/**
 * 設置注音拼字的拖放功能
 */
function setupZhuyinSpellDragDrop(container, question, handlers) {
  const cards = container.querySelectorAll('.zhuyin-card');
  const slots = container.querySelectorAll('.drop-zone');
  const checkBtn = container.querySelector('#check-spell-btn');
  const slotContents = new Array(question.slots).fill(null);

  cards.forEach(card => {
    card.addEventListener('dragstart', (e) => {
      e.dataTransfer.setData('text/plain', card.dataset.zhuyin);
      e.dataTransfer.setData('index', card.dataset.index);
      card.classList.add('dragging');
      handlers.onDragStart?.();
    });

    card.addEventListener('dragend', () => {
      card.classList.remove('dragging');
    });
  });

  slots.forEach(slot => {
    slot.addEventListener('dragover', (e) => {
      e.preventDefault();
      slot.classList.add('drag-over');
    });

    slot.addEventListener('dragleave', () => {
      slot.classList.remove('drag-over');
    });

    slot.addEventListener('drop', (e) => {
      e.preventDefault();
      slot.classList.remove('drag-over');

      const zhuyin = e.dataTransfer.getData('text/plain');
      const cardIndex = e.dataTransfer.getData('index');
      const slotIndex = parseInt(slot.dataset.slot);

      // 如果這個位置已經有內容，移除它
      if (slotContents[slotIndex]) {
        const oldCard = container.querySelector(`[data-index="${slotContents[slotIndex].index}"]`);
        if (oldCard) {
          oldCard.style.visibility = 'visible';
          oldCard.style.opacity = '1';
        }
      }

      // 放入新內容
      slotContents[slotIndex] = { zhuyin, index: cardIndex };
      slot.textContent = zhuyin;

      // 隱藏被拖曳的卡片
      const draggedCard = container.querySelector(`[data-index="${cardIndex}"]`);
      if (draggedCard) {
        draggedCard.style.visibility = 'hidden';
        draggedCard.style.opacity = '0';
      }

      handlers.onDrop?.();

      // 檢查是否所有空格都填滿了
      const allFilled = slotContents.every(s => s !== null);
      checkBtn.disabled = !allFilled;
    });

    // 點擊空格可以移除內容
    slot.addEventListener('click', () => {
      const slotIndex = parseInt(slot.dataset.slot);
      if (slotContents[slotIndex]) {
        const cardIndex = slotContents[slotIndex].index;
        const card = container.querySelector(`[data-index="${cardIndex}"]`);
        if (card) {
          card.style.visibility = 'visible';
          card.style.opacity = '1';
        }
        slotContents[slotIndex] = null;
        slot.textContent = '';
        checkBtn.disabled = true;
      }
    });
  });

  checkBtn.addEventListener('click', () => {
    const answer = slotContents.map(s => s?.zhuyin || '');
    handlers.onAnswer?.(answer);
  });
}

/**
 * 渲染注音排序題
 */
function renderZhuyinSortQuestion(container, question, handlers) {
  const imagePath = `./images/${question.vocabulary.image}`;

  container.innerHTML = `
    <div class="flex flex-col items-center gap-6">
      <h2 class="text-2xl font-bold text-gray-700">把注音按正確順序排好！</h2>

      <!-- 圖片提示 -->
      <div class="flex items-center gap-4">
        <div class="image-card w-32">
          <img src="${imagePath}" alt="${question.vocabulary.display}"
               onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2280%22>🖼️</text></svg>'" />
        </div>
        <div class="text-4xl font-bold text-gray-700">${question.vocabulary.display}</div>
      </div>

      <!-- 排序區域 -->
      <div class="flex flex-wrap justify-center gap-3" id="sort-area">
        ${question.options.map((zhuyin, i) => `
          <div class="zhuyin-card" draggable="true" data-zhuyin="${zhuyin}" data-position="${i}">
            ${zhuyin}
          </div>
        `).join('')}
      </div>

      <!-- 確認按鈕 -->
      <button id="check-sort-btn" class="btn-primary mt-4">
        確認順序 ✓
      </button>
    </div>
  `;

  setupZhuyinSortDragDrop(container, question, handlers);
}

/**
 * 設置注音排序的拖放功能
 */
function setupZhuyinSortDragDrop(container, question, handlers) {
  const sortArea = container.querySelector('#sort-area');
  const checkBtn = container.querySelector('#check-sort-btn');

  let draggedItem = null;

  sortArea.addEventListener('dragstart', (e) => {
    if (e.target.classList.contains('zhuyin-card')) {
      draggedItem = e.target;
      e.target.classList.add('dragging');
      handlers.onDragStart?.();
    }
  });

  sortArea.addEventListener('dragend', (e) => {
    if (e.target.classList.contains('zhuyin-card')) {
      e.target.classList.remove('dragging');
      draggedItem = null;
    }
  });

  sortArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    const afterElement = getDragAfterElement(sortArea, e.clientX);
    if (draggedItem) {
      if (afterElement) {
        sortArea.insertBefore(draggedItem, afterElement);
      } else {
        sortArea.appendChild(draggedItem);
      }
    }
  });

  checkBtn.addEventListener('click', () => {
    const cards = sortArea.querySelectorAll('.zhuyin-card');
    const order = Array.from(cards).map(card => card.dataset.zhuyin);
    handlers.onAnswer?.(order);
  });
}

/**
 * 取得拖曳後應該插入的位置
 */
function getDragAfterElement(container, x) {
  const draggableElements = [...container.querySelectorAll('.zhuyin-card:not(.dragging)')];

  return draggableElements.reduce((closest, child) => {
    const box = child.getBoundingClientRect();
    const offset = x - box.left - box.width / 2;

    if (offset < 0 && offset > closest.offset) {
      return { offset, element: child };
    } else {
      return closest;
    }
  }, { offset: Number.NEGATIVE_INFINITY }).element;
}

/**
 * 設置觸控拖放（行動裝置支援）
 */
function setupTouchDragDrop(draggable, dropZones, handlers) {
  let clone = null;
  let startX, startY;

  draggable.addEventListener('touchstart', (e) => {
    const touch = e.touches[0];
    startX = touch.clientX;
    startY = touch.clientY;

    clone = draggable.cloneNode(true);
    clone.style.position = 'fixed';
    clone.style.zIndex = '1000';
    clone.style.pointerEvents = 'none';
    clone.style.opacity = '0.8';
    clone.style.transform = 'scale(0.8)';
    document.body.appendChild(clone);

    handlers.onDragStart?.();
  });

  draggable.addEventListener('touchmove', (e) => {
    if (!clone) return;
    e.preventDefault();

    const touch = e.touches[0];
    clone.style.left = `${touch.clientX - 50}px`;
    clone.style.top = `${touch.clientY - 50}px`;

    // 檢查是否在放置區上方
    dropZones.forEach(zone => {
      const rect = zone.getBoundingClientRect();
      if (touch.clientX >= rect.left && touch.clientX <= rect.right &&
        touch.clientY >= rect.top && touch.clientY <= rect.bottom) {
        zone.classList.add('drag-over');
      } else {
        zone.classList.remove('drag-over');
      }
    });
  });

  draggable.addEventListener('touchend', (e) => {
    if (!clone) return;

    const touch = e.changedTouches[0];

    dropZones.forEach(zone => {
      zone.classList.remove('drag-over');
      const rect = zone.getBoundingClientRect();
      if (touch.clientX >= rect.left && touch.clientX <= rect.right &&
        touch.clientY >= rect.top && touch.clientY <= rect.bottom) {
        handlers.onAnswer?.(zone.dataset.option);
      }
    });

    if (clone.parentNode) {
      clone.parentNode.removeChild(clone);
    }
    clone = null;
  });
}

/**
 * 渲染題目結果畫面
 */
export function renderQuestionResult(container, state, handlers) {
  const question = getCurrentQuestion(state);
  const isCorrect = state.lastAnswerCorrect;

  container.innerHTML = `
    <div class="flex flex-col items-center justify-center min-h-[60vh] gap-8">
      <!-- 結果圖示 -->
      <div class="text-9xl ${isCorrect ? 'animate-bounce-in' : 'animate-shake'}">
        ${isCorrect ? '🎉' : '😢'}
      </div>

      <!-- 結果文字 -->
      <div class="text-center">
        <h2 class="text-4xl font-bold ${isCorrect ? 'text-green-500' : 'text-orange-500'} mb-4">
          ${isCorrect ? '答對了！' : '再試一次！'}
        </h2>
        <p class="text-2xl text-gray-600">
          ${question.vocabulary.display}（${question.vocabulary.zhuyin.join('')}）
        </p>
      </div>

      <!-- 分數顯示 -->
      ${isCorrect ? `
        <div class="score-display text-2xl">
          +${getQuestionScore(question.type)} 分
        </div>
      ` : ''}

      <!-- 繼續按鈕 -->
      <button id="next-btn" class="btn-primary text-xl">
        ${isCorrect ? '下一題 →' : '繼續 →'}
      </button>
    </div>
  `;

  container.querySelector('#next-btn').addEventListener('click', handlers.onNext);
}

/**
 * 取得題型分數
 */
function getQuestionScore(type) {
  const scores = {
    [QuestionType.IMAGE_MATCH]: 10,
    [QuestionType.ZHUYIN_SPELL]: 20,
    [QuestionType.ZHUYIN_SORT]: 30,
  };
  return scores[type] || 10;
}

/**
 * 渲染關卡完成畫面
 */
export function renderLevelComplete(container, state, handlers) {
  container.innerHTML = `
    <div class="flex flex-col items-center justify-center min-h-[80vh] gap-8">
      <!-- 慶祝動畫 -->
      <div class="text-9xl animate-bounce-in">
        🏆
      </div>

      <!-- 完成訊息 -->
      <div class="text-center">
        <h2 class="game-title mb-4">關卡完成！</h2>
        <p class="text-2xl text-gray-600">第 ${state.currentLevel} 關</p>
      </div>

      <!-- 分數統計 -->
      <div class="card text-center p-8">
        <div class="text-5xl font-bold text-yellow-500 mb-2">
          ${state.score} 分
        </div>
        <p class="text-gray-500">總得分</p>
      </div>

      <!-- 按鈕區 -->
      <div class="flex gap-4">
        <button id="next-level-btn" class="btn-primary text-xl">
          下一關 🚀
        </button>
        <button id="menu-btn" class="btn-secondary text-xl">
          回主選單
        </button>
      </div>
    </div>
  `;

  container.querySelector('#next-level-btn').addEventListener('click', handlers.onNextLevel);
  container.querySelector('#menu-btn').addEventListener('click', handlers.onMenu);
}

/**
 * 顯示閃爍特效
 */
export function showSparkles(container, x, y) {
  for (let i = 0; i < 5; i++) {
    const sparkle = document.createElement('div');
    sparkle.className = 'sparkle text-2xl animate-sparkle';
    sparkle.textContent = ['✨', '⭐', '🌟', '💫'][Math.floor(Math.random() * 4)];
    sparkle.style.left = `${x + (Math.random() - 0.5) * 100}px`;
    sparkle.style.top = `${y + (Math.random() - 0.5) * 100}px`;
    container.appendChild(sparkle);

    setTimeout(() => sparkle.remove(), 600);
  }
}
