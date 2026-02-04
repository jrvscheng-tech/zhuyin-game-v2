/**
 * 題庫資料 - 50 個詞彙
 * 每個詞彙包含：id, image, zhuyin, display, category
 */
export const vocabulary = [
  // 動物類 (animals) - 15 items
  { id: "dog", image: "dog.svg", zhuyin: ["ㄍㄡˇ"], display: "狗", category: "animal" },
  { id: "cat", image: "cat.svg", zhuyin: ["ㄇㄠ"], display: "貓", category: "animal" },
  { id: "bird", image: "bird.svg", zhuyin: ["ㄋㄧㄠˇ"], display: "鳥", category: "animal" },
  { id: "fish", image: "fish.svg", zhuyin: ["ㄩˊ"], display: "魚", category: "animal" },
  { id: "rabbit", image: "rabbit.svg", zhuyin: ["ㄊㄨˋ", "ㄗˇ"], display: "兔子", category: "animal" },
  { id: "elephant", image: "elephant.svg", zhuyin: ["ㄉㄚˋ", "ㄒㄧㄤˋ"], display: "大象", category: "animal" },
  { id: "tiger", image: "tiger.svg", zhuyin: ["ㄌㄠˇ", "ㄏㄨˇ"], display: "老虎", category: "animal" },
  { id: "bear", image: "bear.svg", zhuyin: ["ㄒㄩㄥˊ"], display: "熊", category: "animal" },
  { id: "monkey", image: "monkey.svg", zhuyin: ["ㄏㄡˊ", "ㄗˇ"], display: "猴子", category: "animal" },
  { id: "pig", image: "pig.svg", zhuyin: ["ㄓㄨ"], display: "豬", category: "animal" },
  { id: "cow", image: "cow.svg", zhuyin: ["ㄋㄧㄡˊ"], display: "牛", category: "animal" },
  { id: "horse", image: "horse.svg", zhuyin: ["ㄇㄚˇ"], display: "馬", category: "animal" },
  { id: "sheep", image: "sheep.svg", zhuyin: ["ㄧㄤˊ"], display: "羊", category: "animal" },
  { id: "duck", image: "duck.svg", zhuyin: ["ㄧㄚ", "ㄗˇ"], display: "鴨子", category: "animal" },
  { id: "chicken", image: "chicken.svg", zhuyin: ["ㄐㄧ"], display: "雞", category: "animal" },

  // 食物類 (food) - 12 items
  { id: "apple", image: "apple.svg", zhuyin: ["ㄆㄧㄥˊ", "ㄍㄨㄛˇ"], display: "蘋果", category: "food" },
  { id: "banana", image: "banana.svg", zhuyin: ["ㄒㄧㄤ", "ㄐㄧㄠ"], display: "香蕉", category: "food" },
  { id: "watermelon", image: "watermelon.svg", zhuyin: ["ㄒㄧ", "ㄍㄨㄚ"], display: "西瓜", category: "food" },
  { id: "rice", image: "rice.svg", zhuyin: ["ㄇㄧˇ", "ㄈㄢˋ"], display: "米飯", category: "food" },
  { id: "bread", image: "bread.svg", zhuyin: ["ㄇㄧㄢˋ", "ㄅㄠ"], display: "麵包", category: "food" },
  { id: "cake", image: "cake.svg", zhuyin: ["ㄉㄢˋ", "ㄍㄠ"], display: "蛋糕", category: "food" },
  { id: "icecream", image: "icecream.svg", zhuyin: ["ㄅㄧㄥ", "ㄑㄧˊ", "ㄌㄧㄣˊ"], display: "冰淇淋", category: "food" },
  { id: "milk", image: "milk.svg", zhuyin: ["ㄋㄧㄡˊ", "ㄋㄞˇ"], display: "牛奶", category: "food" },
  { id: "egg", image: "egg.svg", zhuyin: ["ㄐㄧ", "ㄉㄢˋ"], display: "雞蛋", category: "food" },
  { id: "orange", image: "orange.svg", zhuyin: ["ㄐㄩˊ", "ㄗˇ"], display: "橘子", category: "food" },
  { id: "grape", image: "grape.svg", zhuyin: ["ㄆㄨˊ", "ㄊㄠˊ"], display: "葡萄", category: "food" },
  { id: "strawberry", image: "strawberry.svg", zhuyin: ["ㄘㄠˇ", "ㄇㄟˊ"], display: "草莓", category: "food" },

  // 日常物品 (daily) - 10 items
  { id: "book", image: "book.svg", zhuyin: ["ㄕㄨ"], display: "書", category: "daily" },
  { id: "pencil", image: "pencil.svg", zhuyin: ["ㄑㄧㄢ", "ㄅㄧˇ"], display: "鉛筆", category: "daily" },
  { id: "bag", image: "bag.svg", zhuyin: ["ㄕㄨ", "ㄅㄠ"], display: "書包", category: "daily" },
  { id: "chair", image: "chair.svg", zhuyin: ["ㄧˇ", "ㄗˇ"], display: "椅子", category: "daily" },
  { id: "table", image: "table.svg", zhuyin: ["ㄓㄨㄛ", "ㄗˇ"], display: "桌子", category: "daily" },
  { id: "ball", image: "ball.svg", zhuyin: ["ㄑㄧㄡˊ"], display: "球", category: "daily" },
  { id: "umbrella", image: "umbrella.svg", zhuyin: ["ㄩˇ", "ㄙㄢˇ"], display: "雨傘", category: "daily" },
  { id: "clock", image: "clock.svg", zhuyin: ["ㄕˊ", "ㄓㄨㄥ"], display: "時鐘", category: "daily" },
  { id: "phone", image: "phone.svg", zhuyin: ["ㄉㄧㄢˋ", "ㄏㄨㄚˋ"], display: "電話", category: "daily" },
  { id: "cup", image: "cup.svg", zhuyin: ["ㄅㄟ", "ㄗˇ"], display: "杯子", category: "daily" },

  // 家庭類 (family) - 6 items
  { id: "dad", image: "dad.svg", zhuyin: ["ㄅㄚˋ", "ㄅㄚ˙"], display: "爸爸", category: "family" },
  { id: "mom", image: "mom.svg", zhuyin: ["ㄇㄚ", "ㄇㄚ˙"], display: "媽媽", category: "family" },
  { id: "grandpa", image: "grandpa.svg", zhuyin: ["ㄧㄝˊ", "ㄧㄝ˙"], display: "爺爺", category: "family" },
  { id: "grandma", image: "grandma.svg", zhuyin: ["ㄋㄞˇ", "ㄋㄞ˙"], display: "奶奶", category: "family" },
  { id: "brother", image: "brother.svg", zhuyin: ["ㄍㄜ", "ㄍㄜ˙"], display: "哥哥", category: "family" },
  { id: "sister", image: "sister.svg", zhuyin: ["ㄐㄧㄝˇ", "ㄐㄧㄝ˙"], display: "姐姐", category: "family" },

  // 自然類 (nature) - 7 items
  { id: "sun", image: "sun.svg", zhuyin: ["ㄊㄞˋ", "ㄧㄤˊ"], display: "太陽", category: "nature" },
  { id: "moon", image: "moon.svg", zhuyin: ["ㄩㄝˋ", "ㄌㄧㄤˋ"], display: "月亮", category: "nature" },
  { id: "star", image: "star.svg", zhuyin: ["ㄒㄧㄥ", "ㄒㄧㄥ˙"], display: "星星", category: "nature" },
  { id: "flower", image: "flower.svg", zhuyin: ["ㄏㄨㄚ"], display: "花", category: "nature" },
  { id: "tree", image: "tree.svg", zhuyin: ["ㄕㄨˋ"], display: "樹", category: "nature" },
  { id: "cloud", image: "cloud.svg", zhuyin: ["ㄩㄣˊ"], display: "雲", category: "nature" },
  { id: "rain", image: "rain.svg", zhuyin: ["ㄩˇ"], display: "雨", category: "nature" },
];

/**
 * 取得特定類別的詞彙
 */
export function getVocabularyByCategory(category) {
  return vocabulary.filter(v => v.category === category);
}

/**
 * 隨機取得 n 個詞彙
 */
export function getRandomVocabulary(n, excludeIds = []) {
  const available = vocabulary.filter(v => !excludeIds.includes(v.id));
  const shuffled = [...available].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, n);
}

/**
 * 根據 ID 取得詞彙
 */
export function getVocabularyById(id) {
  return vocabulary.find(v => v.id === id);
}

/**
 * 取得所有類別
 */
export function getCategories() {
  return [...new Set(vocabulary.map(v => v.category))];
}
