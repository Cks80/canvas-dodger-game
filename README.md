# Canvas 躲避小遊戲 (canvas-dodger-game)

一個使用 HTML5 Canvas 與原生 JavaScript 打造的簡單躲避小遊戲。  
玩家操控底部的小方塊左右移動，躲避從上方不斷掉落的障礙物，存活時間越長、得分越高。

---

## 🎮 遊戲玩法

- 使用鍵盤：
  - `←` / `A`：向左移動
  - `→` / `D`：向右移動
- 點擊「開始遊戲」按鈕開始
- 躲避從上方掉落的方塊
- 撞到障礙物遊戲結束，可以重新開始

---

## 🧱 功能特色

- 純前端，無需後端即可直接部署在 GitHub Pages
- 使用 `requestAnimationFrame` 建立流暢的遊戲迴圈
- 根據時間自動生成敵方障礙物
- 簡單碰撞判定與分數系統

---

## 🗂 專案結構

```
canvas-dodger-game/
├─ index.html      # 遊戲主頁面
├─ style.css       # 基本樣式
└─ src/
   └─ game.js      # 遊戲邏輯 (Canvas、玩家、敵人、碰撞判定等)
```

