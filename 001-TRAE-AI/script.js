document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    const startButton = document.getElementById('startButton');
    const scoreElement = document.getElementById('score');

    const gridSize = 20;
    const tileCount = canvas.width / gridSize;
    let snake = [
        { x: 10, y: 10 }
    ];
    let food = {
        x: Math.floor(Math.random() * tileCount),
        y: Math.floor(Math.random() * tileCount)
    };
    let dx = 0;
    let dy = 0;
    let score = 0;
    let gameInterval;
    let gameSpeed = 300;
    let isGameRunning = false;

    function drawGame() {
        clearBoard();
        moveSnake();
        drawSnake();
        drawFood();
        checkCollision();
        checkFoodCollision();
    }

    function clearBoard() {
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    function drawSnake() {
        ctx.fillStyle = '#2ecc71';
        snake.forEach(segment => {
            ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize - 2, gridSize - 2);
        });
    }

    function drawFood() {
        ctx.fillStyle = '#e74c3c';
        ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize - 2, gridSize - 2);
    }

    function moveSnake() {
        const head = { x: snake[0].x + dx, y: snake[0].y + dy };
        snake.unshift(head);
        if (!checkFoodCollision()) {
            snake.pop();
        }
    }

    function checkCollision() {
        const head = snake[0];

        // Wall collision
        if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
            gameOver();
            return;
        }

        // Self collision
        for (let i = 1; i < snake.length; i++) {
            if (head.x === snake[i].x && head.y === snake[i].y) {
                gameOver();
                return;
            }
        }
    }

    function checkFoodCollision() {
        const head = snake[0];
        if (head.x === food.x && head.y === food.y) {
            score += 10;
            scoreElement.textContent = score;
            generateFood();
            return true;
        }
        return false;
    }

    function generateFood() {
        food.x = Math.floor(Math.random() * tileCount);
        food.y = Math.floor(Math.random() * tileCount);

        // Make sure food doesn't spawn on snake
        snake.forEach(segment => {
            if (segment.x === food.x && segment.y === food.y) {
                generateFood();
            }
        });
    }

    function gameOver() {
        isGameRunning = false;
        clearInterval(gameInterval);
        startButton.textContent = 'Restart Game';
        startButton.disabled = false;
    }

    function startGame() {
        if (isGameRunning) return;

        snake = [{ x: 10, y: 10 }];
        dx = 1;
        dy = 0;
        score = 0;
        scoreElement.textContent = score;
        generateFood();
        isGameRunning = true;
        startButton.disabled = true;

        if (gameInterval) clearInterval(gameInterval);
        gameInterval = setInterval(drawGame, gameSpeed);
    }

    document.addEventListener('keydown', (event) => {
        if (!isGameRunning) return;

        switch (event.key) {
            case 'ArrowUp':
                if (dy !== 1) { dx = 0; dy = -1; }
                break;
            case 'ArrowDown':
                if (dy !== -1) { dx = 0; dy = 1; }
                break;
            case 'ArrowLeft':
                if (dx !== 1) { dx = -1; dy = 0; }
                break;
            case 'ArrowRight':
                if (dx !== -1) { dx = 1; dy = 0; }
                break;
        }
    });

    startButton.addEventListener('click', startGame);
});