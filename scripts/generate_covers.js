import fs from 'fs';
import path from 'path';

const coversDir = path.join(process.cwd(), 'public', 'assets', 'images', 'covers');
if (!fs.existsSync(coversDir)) {
  fs.mkdirSync(coversDir, { recursive: true });
}

const books = [
  { isbn: "9788131973530", title: "Sound Book (Variant 1)", category: "Board Books", color1: "#F5B719", color2: "#1A1F2B", icon: "🎵" },
  { isbn: "9788131973523", title: "Sound Book (Variant 2)", category: "Board Books", color1: "#20AC69", color2: "#11151E", icon: "🔊" },
  { isbn: "9788131973516", title: "Sound Book (Variant 3)", category: "Board Books", color1: "#3C6EE6", color2: "#1A1F2B", icon: "🎶" },
  { isbn: "9788131970270", title: "Touch and Feel (V1)", category: "Board Books", color1: "#F0534C", color2: "#1A1F2B", icon: "🖐️" },
  { isbn: "9788131970287", title: "Touch and Feel (V2)", category: "Board Books", color1: "#F5B719", color2: "#11151E", icon: "🧸" },
  { isbn: "9788131939901", title: "Touch n Feel Board", category: "Board Books", color1: "#20AC69", color2: "#1A1F2B", icon: "🐾" },
  { isbn: "9788131970195", title: "Feel & Fit — Animals", category: "Board Books", color1: "#3C6EE6", color2: "#11151E", icon: "🦁" },
  { isbn: "9788131970201", title: "Feel & Fit — Shapes", category: "Board Books", color1: "#F0534C", color2: "#1A1F2B", icon: "🔺" },
  { isbn: "9788131970218", title: "Feel & Fit — Counting", category: "Board Books", color1: "#F5B719", color2: "#1A1F2B", icon: "🔢" },
  { isbn: "9788131943809", title: "My First Eva Book", category: "Board Books", color1: "#20AC69", color2: "#11151E", icon: "🛁" },
  { isbn: "9788131954072", title: "Rub & Smell — Flowers", category: "Board Books", color1: "#F0534C", color2: "#1A1F2B", icon: "🌸" },
  { isbn: "9788131954065", title: "Rub & Smell — Veggies", category: "Board Books", color1: "#3C6EE6", color2: "#11151E", icon: "🥕" },

  // Extra items for full category coverage
  { isbn: "9780143455111", title: "Visual Encyclopedia for Kids", category: "Educational", color1: "#3C6EE6", color2: "#1A1F2B", icon: "🔬" },
  { isbn: "9780143455222", title: "The Little Prince (Illustrated)", category: "Children's", color1: "#F5B719", color2: "#11151E", icon: "👑" },
  { isbn: "9780143455333", title: "School Science Lab Companion", category: "School Books", color1: "#20AC69", color2: "#1A1F2B", icon: "🧪" },
  { isbn: "9780143455444", title: "Oxford Student Atlas & Reference", category: "Reference", color1: "#1A1F2B", color2: "#3C6EE6", icon: "🗺️" },
  { isbn: "9780143455555", title: "1000 Activity & Puzzle Book", category: "Activity Books", color1: "#F0534C", color2: "#F5B719", icon: "🧩" },
  { isbn: "9780143455666", title: "Deluxe Hardcover Classic Fiction", category: "Fiction", color1: "#1A1F2B", color2: "#F0534C", icon: "📖" },
  { isbn: "9780143455777", title: "The Art of Curiosity", category: "Non-Fiction", color1: "#20AC69", color2: "#3C6EE6", icon: "💡" },
  { isbn: "9780143455888", title: "Pastel Journal & Gel Pen Set", category: "Stationery", color1: "#F5B719", color2: "#F0534C", icon: "✏️" },
  { isbn: "9780143455999", title: "Premium Wooden Bookmark & Gift Set", category: "Gift Items", color1: "#3C6EE6", color2: "#20AC69", icon: "🎁" }
];

function generateSVG(book) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 560" width="400" height="560">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${book.color2}"/>
      <stop offset="100%" stop-color="#0E121B"/>
    </linearGradient>
    <linearGradient id="accent" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="${book.color1}"/>
      <stop offset="100%" stop-color="${book.color1}DD"/>
    </linearGradient>
    <filter id="shadow">
      <feDropShadow dx="0" dy="10" stdDeviation="15" flood-color="#000" flood-opacity="0.4"/>
    </filter>
  </defs>

  <!-- Background Cover Frame -->
  <rect width="400" height="560" rx="16" fill="url(#bg)" />

  <!-- Spine Simulation Line -->
  <rect x="0" y="0" width="16" height="560" rx="4" fill="#000000" opacity="0.3"/>
  <line x1="16" y1="0" x2="16" y2="560" stroke="#FFFFFF" stroke-opacity="0.15" stroke-width="2"/>

  <!-- Geometric 4-Quadrant Top Header Accent -->
  <rect x="340" y="24" width="18" height="18" fill="#F5B719" rx="3"/>
  <rect x="362" y="24" width="18" height="18" fill="#20AC69" rx="3"/>
  <rect x="340" y="46" width="18" height="18" fill="#F0534C" rx="3"/>
  <rect x="362" y="46" width="18" height="18" fill="#3C6EE6" rx="3"/>

  <!-- Brand Badge Top Left -->
  <rect x="36" y="28" width="140" height="28" rx="14" fill="#FFFFFF" fill-opacity="0.1"/>
  <text x="106" y="47" font-family="Arial, sans-serif" font-size="11" font-weight="700" fill="#FFFFFF" text-anchor="middle" letter-spacing="1.5">BOOK AFFAIR</text>

  <!-- Central Icon Frame -->
  <g filter="url(#shadow)">
    <circle cx="200" cy="200" r="70" fill="url(#accent)" />
    <text x="200" y="222" font-size="64" text-anchor="middle">${book.icon}</text>
  </g>

  <!-- Title Section -->
  <rect x="36" y="310" width="328" height="180" rx="12" fill="#FFFFFF" fill-opacity="0.05" stroke="#FFFFFF" stroke-opacity="0.1" />
  
  <text x="200" y="355" font-family="Georgia, serif" font-size="22" font-weight="bold" fill="#FFFFFF" text-anchor="middle">${book.title}</text>
  <text x="200" y="388" font-family="Arial, sans-serif" font-size="13" font-weight="600" fill="${book.color1}" text-anchor="middle" letter-spacing="1">${book.category.toUpperCase()}</text>
  
  <line x1="120" y1="410" x2="280" y2="410" stroke="#FFFFFF" stroke-opacity="0.2" stroke-width="1"/>

  <text x="200" y="440" font-family="Arial, sans-serif" font-size="11" fill="#A0AEC0" text-anchor="middle">ISBN: ${book.isbn}</text>
  
  <!-- Footer Quality Seal -->
  <rect x="36" y="505" width="328" height="30" rx="6" fill="${book.color1}" fill-opacity="0.2"/>
  <text x="200" y="525" font-family="Georgia, serif" font-style="italic" font-size="12" fill="#FFFFFF" text-anchor="middle">Chennai Independent Book Store</text>
</svg>`;
}

books.forEach(b => {
  const filePath = path.join(coversDir, `${b.isbn}.jpg`);
  fs.writeFileSync(filePath, generateSVG(b));
});

console.log(`Generated ${books.length} cover SVGs in public/assets/images/covers/`);
