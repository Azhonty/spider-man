// Настройка холста
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
canvas.width = 800;
canvas.height = 400;

// Загрузка изображений
const heroImg = new Image();
heroImg.src = "hero.png"; 
const enemyImg = new Image();
enemyImg.src = "enemy.png"; 

// Настройка игрока
const player = {
    x: 50,
    y: canvas.height - 100,
    width: 50,
    height: 75,
    dy: 0,
    gravity: 0.5,
    jumpStrength: -12,
    jumping: false
};

// Настройка врагов
const enemies = [];
const enemyWidth = 50;
const enemyHeight = 75;
const enemySpeed = 4;
let spawnInterval = 2000; // Интервал появления врагов
let lastSpawnTime = 0;

// Очки
let score = 0;

// Состояние игры
let gameOver = false;

// Управление игроком
document.addEventListener("keydown", (event) => {
    if (event.code === "Space" && !player.jumping && !gameOver) {
        player.dy = player.jumpStrength;
        player.jumping = true;
    }
});

// Функция обновления игры
function update() {
    if (gameOver) return;

    // Обновление позиции игрока
    player.dy += player.gravity;
    player.y += player.dy;

    // Проверка столкновения с землёй
    if (player.y + player.height > canvas.height) {
        player.y = canvas.height - player.height;
        player.dy = 0;
        player.jumping = false;
    }

    // Обновление врагов
    for (let i = enemies.length - 1; i >= 0; i--) {
        enemies[i].x -= enemySpeed;

        // Проверка столкновения с игроком
        if (
            player.x < enemies[i].x + enemyWidth &&
            player.x + player.width > enemies[i].x &&
            player.y < enemies[i].y + enemyHeight &&
            player.y + player.height > enemies[i].y
        ) {
            gameOver = true;
        }

        // Удаление врагов за пределами экрана
        if (enemies[i].x + enemyWidth < 0) {
            enemies.splice(i, 1);
            score++;
        }
    }

    // Создание новых врагов
    const currentTime = Date.now();
    if (currentTime - lastSpawnTime > spawnInterval) {
        enemies.push({
            x: canvas.width,
            y: canvas.height - enemyHeight,
            width: enemyWidth,
            height: enemyHeight
        });
        lastSpawnTime = currentTime;
    }
}

// Функция отрисовки игры
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Рисуем игрока
    ctx.drawImage(heroImg, player.x, player.y, player.width, player.height);

    // Рисуем врагов
    enemies.forEach((enemy) => {
        ctx.drawImage(enemyImg, enemy.x, enemy.y, enemy.width, enemy.height);
    });

    // Отображение счёта
    ctx.fillStyle = "black";
    ctx.font = "20px Arial";
    ctx.fillText(`Score: ${score}`, 10, 30);

    // Отображение экрана Game Over
    if (gameOver) {
        ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = "white";
        ctx.font = "40px Arial";
        ctx.textAlign = "center";
        ctx.fillText("GAME OVER", canvas.width / 2, canvas.height / 2 - 20);

        ctx.font = "20px Arial";
        ctx.fillText("Press R to Restart", canvas.width / 2, canvas.height / 2 + 20);
    }
}

// Сброс игры
function resetGame() {
    score = 0;
    gameOver = false;
    player.y = canvas.height - player.height;
    player.dy = 0;
    enemies.length = 0;
    lastSpawnTime = 0;
}

// Обработчик для рестарта игры
document.addEventListener("keydown", (event) => {
    if (event.code === "KeyR" && gameOver) {
        resetGame();
    }
});

// Основной игровой цикл
function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

// Запуск игры
gameLoop();
