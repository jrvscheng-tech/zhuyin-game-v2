/**
 * 音效管理模組
 * 使用 Web Audio API 生成簡單的音效
 */

let audioContext = null;

/**
 * 初始化 Audio Context
 */
export function initAudio() {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
  }
  return audioContext;
}

/**
 * 播放正確音效（歡快的叮咚聲）
 */
export function playCorrectSound() {
  const ctx = initAudio();
  if (ctx.state === 'suspended') {
    ctx.resume();
  }
  
  const now = ctx.currentTime;
  
  // 第一個音符 C5
  playTone(ctx, 523.25, now, 0.15, 0.3);
  // 第二個音符 E5
  playTone(ctx, 659.25, now + 0.15, 0.15, 0.3);
  // 第三個音符 G5 (較長)
  playTone(ctx, 783.99, now + 0.3, 0.3, 0.4);
}

/**
 * 播放錯誤音效（低沉的嗡嗡聲）
 */
export function playIncorrectSound() {
  const ctx = initAudio();
  if (ctx.state === 'suspended') {
    ctx.resume();
  }
  
  const now = ctx.currentTime;
  
  // 低沉的嗡嗡聲
  playTone(ctx, 200, now, 0.3, 0.2, 'sawtooth');
}

/**
 * 播放點擊音效
 */
export function playClickSound() {
  const ctx = initAudio();
  if (ctx.state === 'suspended') {
    ctx.resume();
  }
  
  const now = ctx.currentTime;
  playTone(ctx, 800, now, 0.05, 0.1);
}

/**
 * 播放關卡完成音效（勝利號角）
 */
export function playLevelCompleteSound() {
  const ctx = initAudio();
  if (ctx.state === 'suspended') {
    ctx.resume();
  }
  
  const now = ctx.currentTime;
  
  // 勝利號角聲
  playTone(ctx, 392.00, now, 0.15, 0.3);       // G4
  playTone(ctx, 523.25, now + 0.15, 0.15, 0.3); // C5
  playTone(ctx, 659.25, now + 0.3, 0.15, 0.3);  // E5
  playTone(ctx, 783.99, now + 0.45, 0.4, 0.4);  // G5
}

/**
 * 播放拖曳開始音效
 */
export function playDragStartSound() {
  const ctx = initAudio();
  if (ctx.state === 'suspended') {
    ctx.resume();
  }
  
  const now = ctx.currentTime;
  playTone(ctx, 600, now, 0.05, 0.1);
}

/**
 * 播放放下音效
 */
export function playDropSound() {
  const ctx = initAudio();
  if (ctx.state === 'suspended') {
    ctx.resume();
  }
  
  const now = ctx.currentTime;
  playTone(ctx, 400, now, 0.08, 0.15);
}

/**
 * 播放單一音調
 * @param {AudioContext} ctx - Audio context
 * @param {number} frequency - 頻率 (Hz)
 * @param {number} startTime - 開始時間
 * @param {number} duration - 持續時間
 * @param {number} volume - 音量 (0-1)
 * @param {string} waveType - 波形類型
 */
function playTone(ctx, frequency, startTime, duration, volume = 0.3, waveType = 'sine') {
  const oscillator = ctx.createOscillator();
  const gainNode = ctx.createGain();
  
  oscillator.connect(gainNode);
  gainNode.connect(ctx.destination);
  
  oscillator.frequency.value = frequency;
  oscillator.type = waveType;
  
  // 淡入淡出
  gainNode.gain.setValueAtTime(0, startTime);
  gainNode.gain.linearRampToValueAtTime(volume, startTime + 0.02);
  gainNode.gain.linearRampToValueAtTime(0, startTime + duration);
  
  oscillator.start(startTime);
  oscillator.stop(startTime + duration);
}

/**
 * 靜音版本（用於測試）
 */
export const silentSounds = {
  playCorrectSound: () => {},
  playIncorrectSound: () => {},
  playClickSound: () => {},
  playLevelCompleteSound: () => {},
  playDragStartSound: () => {},
  playDropSound: () => {},
};
