/**
 * 詞彙資料測試
 */

import { describe, it, expect } from 'vitest';
import {
  vocabulary,
  getVocabularyByCategory,
  getRandomVocabulary,
  getVocabularyById,
  getCategories,
} from './vocabulary.js';

describe('vocabulary', () => {
  it('should have 50 vocabulary items', () => {
    expect(vocabulary.length).toBe(50);
  });
  
  it('should have all required fields', () => {
    vocabulary.forEach(v => {
      expect(v.id).toBeDefined();
      expect(v.image).toBeDefined();
      expect(v.zhuyin).toBeDefined();
      expect(Array.isArray(v.zhuyin)).toBe(true);
      expect(v.zhuyin.length).toBeGreaterThan(0);
      expect(v.display).toBeDefined();
      expect(v.category).toBeDefined();
    });
  });
  
  it('should have unique ids', () => {
    const ids = vocabulary.map(v => v.id);
    const uniqueIds = new Set(ids);
    
    expect(uniqueIds.size).toBe(vocabulary.length);
  });
  
  it('should have valid categories', () => {
    const validCategories = ['animal', 'food', 'daily', 'family', 'nature'];
    
    vocabulary.forEach(v => {
      expect(validCategories).toContain(v.category);
    });
  });
});

describe('getVocabularyByCategory', () => {
  it('should return vocabulary for specific category', () => {
    const animals = getVocabularyByCategory('animal');
    
    expect(animals.length).toBeGreaterThan(0);
    animals.forEach(v => {
      expect(v.category).toBe('animal');
    });
  });
  
  it('should return empty array for unknown category', () => {
    const unknown = getVocabularyByCategory('unknown');
    
    expect(unknown).toEqual([]);
  });
});

describe('getRandomVocabulary', () => {
  it('should return correct number of items', () => {
    const items = getRandomVocabulary(5);
    
    expect(items.length).toBe(5);
  });
  
  it('should exclude specified ids', () => {
    const excludeIds = ['dog', 'cat', 'bird'];
    const items = getRandomVocabulary(10, excludeIds);
    
    items.forEach(v => {
      expect(excludeIds).not.toContain(v.id);
    });
  });
  
  it('should return unique items', () => {
    const items = getRandomVocabulary(20);
    const ids = items.map(v => v.id);
    const uniqueIds = new Set(ids);
    
    expect(uniqueIds.size).toBe(items.length);
  });
  
  it('should return all available if requested more than available', () => {
    const excludeIds = vocabulary.slice(0, 45).map(v => v.id);
    const items = getRandomVocabulary(10, excludeIds);
    
    expect(items.length).toBeLessThanOrEqual(5);
  });
});

describe('getVocabularyById', () => {
  it('should return vocabulary for valid id', () => {
    const dog = getVocabularyById('dog');
    
    expect(dog).toBeDefined();
    expect(dog.id).toBe('dog');
    expect(dog.display).toBe('狗');
  });
  
  it('should return undefined for invalid id', () => {
    const unknown = getVocabularyById('unknown');
    
    expect(unknown).toBeUndefined();
  });
});

describe('getCategories', () => {
  it('should return all unique categories', () => {
    const categories = getCategories();
    
    expect(categories).toContain('animal');
    expect(categories).toContain('food');
    expect(categories).toContain('daily');
    expect(categories).toContain('family');
    expect(categories).toContain('nature');
  });
  
  it('should return unique values only', () => {
    const categories = getCategories();
    const uniqueCategories = new Set(categories);
    
    expect(uniqueCategories.size).toBe(categories.length);
  });
});
