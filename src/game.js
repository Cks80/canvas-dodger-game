const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const startBtn = document.getElementById("startBtn");
const scoreDisplay = document.getElementById("scoreDisplay");

// 遊戲狀態
let lastTime = 0;
let spawnTimer = 0;
let spawnInterval = 800; // 毫秒：敵人生成間隔
let enemies = [];
let score = 0;
let isRunning = false;

// 鍵盤輸入狀態
const keys = {
  left: false,
  right: false,
};

// 玩家設定
const player = {
  x: canvas.width / 2 - 20,
  y: canvas.height - 60,
  width: 40,
  height: 40,
  speed: 260, // 每秒 px
};

// 敵人類別
class Enemy {
  constructor(x, size, speed) {
    this.x = x;
    this.y = -size;
    this.size = size;
    this.speed = speed;
  }

  update(dt) {
    this.y += this.speed * dt;
  }

  draw(ctx) {
    ctx.save();
    ctx.fillStyle = "#f97316";
    ctx.shadowColor = "#fb923c";
    ctx.shadowBlur = 10;
    ctx.fillRect(this.x, this.y, this.size, this.size);
    ctx.restore();
  }

  isOutOfScreen() {
    return this.y > canvas.height + this.size;
  }
}

// 初始化 & 重置遊戲
function resetGame() {
  enemies = [];
  score = 0;
  spawnTimer = 0;
  lastTime = 0;
  player.x = canvas.width / 2 - player.width / 2;
  player.y = canvas.height - 60;
  updateScoreText();
}

// 敵人生成
function spawnEnemy() {
  const minSize = 24;
  const maxSize = 56;
  const size = randomRange(minSize, maxSize);

  const x = randomRange(0, canvas.width - size);

  const baseSpeed = 120;
  const speedBonus = Math.min(score * 3, 220); // 分數越高，越快，但有限制
  const speed = baseSpeed + speedBonus + Math.random() * 30;

  enemies.push(new Enemy(x, size, speed));
}

// 更新分數顯示
function updateScoreText() {
  scoreDisplay.textContent = `得分：${Math.floor(score)}`;
}

// 遊戲主迴圈
function gameLoop(timestamp) {
  if (!isRunning) return;

  if (!lastTime) lastTime = timestamp;
  const delta = timestamp - lastTime; // 毫秒
  const dt = delta / 1000; // 轉換為秒
  lastTime = timestamp;

  update(dt, delta);
  draw();

  requestAnimationFrame(gameLoop);
}

// 更新遊戲邏輯
function update(dt, deltaMs) {
  // 更新玩家位置
  let dir = 0;
  if (keys.left) dir -= 1;
  if (keys.right) dir += 1;
  player.x += dir * player.speed * dt;

  // 邊界檢查
  if (player.x < 0) player.x = 0;
  if (player.x + player.width > canvas.width) {
    player.x = canvas.width - player.width;
  }

  // 敵人生成計時
  spawnTimer += deltaMs;
  if (spawnTimer >= spawnInterval) {
    spawnEnemy();
    spawnTimer = 0;

    // 隨時間稍微縮短間隔（最低 300ms）
    spawnInterval = Math.max(300, spawnInterval - 10);
  }

  // 更新敵人
  enemies.forEach((enemy) => enemy.update(dt));

  // 刪除離開畫面的敵人
  enemies = enemies.filter((enemy) => !enemy.isOutOfScreen());

  // 碰撞判定
  for (let enemy of enemies) {
    if (checkCollisionRect(
      player.x,
      player.y,
      player.width,
      player.height,
      enemy.x,
      enemy.y,
      enemy.size,
      enemy.size
    )) {
      endGame();
      return;
    }
  }

  // 根據存活時間加分
  score += dt * 10;
  updateScoreText();
}

// 繪製畫面
function draw() {
  // 清除畫面
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // 畫玩家
  ctx.save();
  ctx.fillStyle = "#38bdf8";
  ctx.shadowColor = "#0ea5e9";
  ctx.shadowBlur = 12;
  ctx.fillRect(player.x, player.y, player.width, player.height);
  ctx.restore();

  // 畫敵人
  enemies.forEach((enemy) => enemy.draw(ctx));
}

// 矩形碰撞判定（AABB）
function checkCollisionRect(ax, ay, aw, ah, bx, by, bw, bh) {
  return (
    ax < bx + bw &&
    ax + aw > bx &&
    ay < by + bh &&
    ay + ah > by
  );
}

// 遊戲結束
function endGame() {
  isRunning = false;
  startBtn.disabled = false;
  startBtn.textContent = "重新開始";

  // 顯示簡單的結束文字
  ctx.save();
  ctx.fillStyle = "rgba(15,23,42,0.78)";
  ctx.fillRect(40, canvas.height / 2 - 60, canvas.width - 80, 120);

  ctx.fillStyle = "#e5e7eb";
  ctx.font = "20px 'Microsoft JhengHei', system-ui";
  ctx.textAlign = "center";
  ctx.fillText("遊戲結束", canvas.width / 2, canvas.height / 2 - 10);
  ctx.font = "16px 'Microsoft JhengHei', system-ui";
  ctx.fillText(`最終得分：${Math.floor(score)}`, canvas.width / 2, canvas.height / 2 + 22);
  ctx.restore();
}

// 工具：隨機區間
function randomRange(min, max) {
  return Math.random() * (max - min) + min;
}

// 鍵盤事件監聽
window.addEventListener("keydown", (e) => {
  if (e.code === "ArrowLeft" || e.code === "KeyA") {
    keys.left = true;
  } else if (e.code === "ArrowRight" || e.code === "KeyD") {
    keys.right = true;
  }
});

window.addEventListener("keyup", (e) => {
  if (e.code === "ArrowLeft" || e.code === "KeyA") {
    keys.left = false;
  } else if (e.code === "ArrowRight" || e.code === "KeyD") {
    keys.right = false;
  }
});

// 開始按鈕
startBtn.addEventListener("click", () => {
  resetGame();
  isRunning = true;
  startBtn.disabled = true;
  startBtn.textContent = "遊戲進行中...";
  requestAnimationFrame(gameLoop);
});
