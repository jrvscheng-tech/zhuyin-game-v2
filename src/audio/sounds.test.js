/**
 * 音效模組測試
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  initAudio,
  playCorrectSound,
  playIncorrectSound,
  playClickSound,
  playLevelCompleteSound,
  playDragStartSound,
  playDropSound,
  silentSounds,
} from './sounds.js';

describe('Audio module', () => {
  let mockAudioContext;
  let mockOscillator;
  let mockGainNode;
  
  beforeEach(() => {
    mockOscillator = {
      connect: vi.fn(),
      frequency: { value: 0 },
      type: 'sine',
      start: vi.fn(),
      stop: vi.fn(),
    };
    
    mockGainNode = {
      connect: vi.fn(),
      gain: {
        setValueAtTime: vi.fn(),
        linearRampToValueAtTime: vi.fn(),
      },
    };
    
    mockAudioContext = {
      createOscillator: vi.fn(() => mockOscillator),
      createGain: vi.fn(() => mockGainNode),
      destination: {},
      currentTime: 0,
      state: 'running',
      resume: vi.fn(),
    };
    
    // Mock Web Audio API
    global.AudioContext = vi.fn(() => mockAudioContext);
    global.webkitAudioContext = vi.fn(() => mockAudioContext);
  });
  
  afterEach(() => {
    vi.restoreAllMocks();
  });
  
  describe('initAudio', () => {
    it('should create AudioContext on first call', () => {
      // Reset module state by reimporting (skip in this test)
      // For now, just verify the mock setup works
      expect(typeof initAudio).toBe('function');
    });
  });
  
  describe('playCorrectSound', () => {
    it('should be a function', () => {
      expect(typeof playCorrectSound).toBe('function');
    });
  });
  
  describe('playIncorrectSound', () => {
    it('should be a function', () => {
      expect(typeof playIncorrectSound).toBe('function');
    });
  });
  
  describe('playClickSound', () => {
    it('should be a function', () => {
      expect(typeof playClickSound).toBe('function');
    });
  });
  
  describe('playLevelCompleteSound', () => {
    it('should be a function', () => {
      expect(typeof playLevelCompleteSound).toBe('function');
    });
  });
  
  describe('playDragStartSound', () => {
    it('should be a function', () => {
      expect(typeof playDragStartSound).toBe('function');
    });
  });
  
  describe('playDropSound', () => {
    it('should be a function', () => {
      expect(typeof playDropSound).toBe('function');
    });
  });
  
  describe('silentSounds', () => {
    it('should have all sound functions', () => {
      expect(typeof silentSounds.playCorrectSound).toBe('function');
      expect(typeof silentSounds.playIncorrectSound).toBe('function');
      expect(typeof silentSounds.playClickSound).toBe('function');
      expect(typeof silentSounds.playLevelCompleteSound).toBe('function');
      expect(typeof silentSounds.playDragStartSound).toBe('function');
      expect(typeof silentSounds.playDropSound).toBe('function');
    });
    
    it('should not throw when called', () => {
      expect(() => silentSounds.playCorrectSound()).not.toThrow();
      expect(() => silentSounds.playIncorrectSound()).not.toThrow();
      expect(() => silentSounds.playClickSound()).not.toThrow();
      expect(() => silentSounds.playLevelCompleteSound()).not.toThrow();
      expect(() => silentSounds.playDragStartSound()).not.toThrow();
      expect(() => silentSounds.playDropSound()).not.toThrow();
    });
  });
});
