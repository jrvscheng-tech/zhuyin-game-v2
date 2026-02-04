/**
 * 生成佔位圖片的腳本
 * 在真實圖片生成前使用
 */

const fs = require('fs');
const path = require('path');

const vocabulary = [
  // 動物類
  { id: "dog", display: "狗", emoji: "🐕" },
  { id: "cat", display: "貓", emoji: "🐱" },
  { id: "bird", display: "鳥", emoji: "🐦" },
  { id: "fish", display: "魚", emoji: "🐟" },
  { id: "rabbit", display: "兔子", emoji: "🐰" },
  { id: "elephant", display: "大象", emoji: "🐘" },
  { id: "tiger", display: "老虎", emoji: "🐯" },
  { id: "bear", display: "熊", emoji: "🐻" },
  { id: "monkey", display: "猴子", emoji: "🐵" },
  { id: "pig", display: "豬", emoji: "🐷" },
  { id: "cow", display: "牛", emoji: "🐮" },
  { id: "horse", display: "馬", emoji: "🐴" },
  { id: "sheep", display: "羊", emoji: "🐑" },
  { id: "duck", display: "鴨子", emoji: "🦆" },
  { id: "chicken", display: "雞", emoji: "🐔" },
  // 食物類
  { id: "apple", display: "蘋果", emoji: "🍎" },
  { id: "banana", display: "香蕉", emoji: "🍌" },
  { id: "watermelon", display: "西瓜", emoji: "🍉" },
  { id: "rice", display: "米飯", emoji: "🍚" },
  { id: "bread", display: "麵包", emoji: "🍞" },
  { id: "cake", display: "蛋糕", emoji: "🎂" },
  { id: "icecream", display: "冰淇淋", emoji: "🍦" },
  { id: "milk", display: "牛奶", emoji: "🥛" },
  { id: "egg", display: "雞蛋", emoji: "🥚" },
  { id: "orange", display: "橘子", emoji: "🍊" },
  { id: "grape", display: "葡萄", emoji: "🍇" },
  { id: "strawberry", display: "草莓", emoji: "🍓" },
  // 日常物品
  { id: "book", display: "書", emoji: "📖" },
  { id: "pencil", display: "鉛筆", emoji: "✏️" },
  { id: "bag", display: "書包", emoji: "🎒" },
  { id: "chair", display: "椅子", emoji: "🪑" },
  { id: "table", display: "桌子", emoji: "🪑" },
  { id: "ball", display: "球", emoji: "⚽" },
  { id: "umbrella", display: "雨傘", emoji: "☂️" },
  { id: "clock", display: "時鐘", emoji: "🕐" },
  { id: "phone", display: "電話", emoji: "📞" },
  { id: "cup", display: "杯子", emoji: "🥤" },
  // 家庭類
  { id: "dad", display: "爸爸", emoji: "👨" },
  { id: "mom", display: "媽媽", emoji: "👩" },
  { id: "grandpa", display: "爺爺", emoji: "👴" },
  { id: "grandma", display: "奶奶", emoji: "👵" },
  { id: "brother", display: "哥哥", emoji: "👦" },
  { id: "sister", display: "姐姐", emoji: "👧" },
  // 自然類
  { id: "sun", display: "太陽", emoji: "☀️" },
  { id: "moon", display: "月亮", emoji: "🌙" },
  { id: "star", display: "星星", emoji: "⭐" },
  { id: "flower", display: "花", emoji: "🌸" },
  { id: "tree", display: "樹", emoji: "🌳" },
  { id: "cloud", display: "雲", emoji: "☁️" },
  { id: "rain", display: "雨", emoji: "🌧️" },
];

function generateSVG(item) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#FFF8DC"/>
      <stop offset="100%" style="stop-color:#FFE4B5"/>
    </linearGradient>
  </defs>
  <rect width="200" height="200" fill="url(#bg)" rx="20"/>
  <text x="100" y="110" font-size="80" text-anchor="middle" dominant-baseline="middle">${item.emoji}</text>
</svg>`;
}

const outputDir = path.join(__dirname, 'public', 'images');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

vocabulary.forEach(item => {
  const svg = generateSVG(item);
  const filename = `${item.id}.svg`;
  fs.writeFileSync(path.join(outputDir, filename), svg);
  console.log(`Generated: ${filename}`);
});

console.log(`\nGenerated ${vocabulary.length} placeholder images in ${outputDir}`);
