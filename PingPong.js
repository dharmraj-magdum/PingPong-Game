const gameBoard = document.querySelector("#gameBoard");
const scoreText = document.querySelector("#scoreText");
const resetBtn = document.querySelector("#resetBtn");
//canvas context
const ctx = gameBoard.getContext("2d");
const gameWidth = gameBoard.width;
const gameHeight = gameBoard.height;
//theme color varibles
const boardBackground = "#558833";
const paddle1Color = "#323299";
const paddle2Color = "#993232";
const paddleBorder = "#444";
const ballColor = "#FBFA88";
const ballBorderColor = "666";
//game variables
const ballRadius = 12;
const paddleSpeed = 50;
let intervalID;
let ballSpeed;
let ballX;
let ballY;
let ballXDirection;
let ballYDirection;
let player1Score;
let player2Score;
let paddle1;
let paddle2;

//add essential listeners
window.addEventListener("keydown", changeDirection);
resetBtn.addEventListener("click", resetGame);

function gameStart() {
	resetBtn.textContent = "Restart";
	createBall();
	nextTick();
}
function nextTick() {
	intervalID = setInterval(() => {
		clearBoard();
		drawPaddles();
		moveBall();
		drawBall(ballX, ballY);
		checkCollision();
	}, 20);
}
function clearBoard() {
	ctx.fillStyle = boardBackground;
	ctx.fillRect(0, 0, gameWidth, gameHeight);
}
function drawPaddles() {
	ctx.strokeStyle = paddleBorder;

	ctx.fillStyle = paddle1Color;
	ctx.fillRect(paddle1.x, paddle1.y, paddle1.width, paddle1.height);
	ctx.strokeRect(paddle1.x, paddle1.y, paddle1.width, paddle1.height);

	ctx.fillStyle = paddle2Color;
	ctx.fillRect(paddle2.x, paddle2.y, paddle2.width, paddle2.height);
	ctx.strokeRect(paddle2.x, paddle2.y, paddle2.width, paddle2.height);
}
function createBall() {
	//initial speed
	ballSpeed = 3;
	//make random directions
	if (Math.round(Math.random()) == 1) {
		ballXDirection = 1;
	} else {
		ballXDirection = -1;
	}
	if (Math.round(Math.random()) == 1) {
		ballYDirection = Math.random() * 1;
	} else {
		ballYDirection = Math.random() * -1;
	}
	ballX = gameWidth / 2;
	ballY = gameHeight / 2;
	drawBall(ballX, ballY);
}
function moveBall() {
	ballX += ballSpeed * ballXDirection;
	ballY += ballSpeed * ballYDirection;
}
function drawBall(ballX, ballY) {
	ctx.fillStyle = ballColor;
	ctx.strokeStyle = ballBorderColor;
	ctx.lineWidth = 2;
	ctx.beginPath();
	ctx.arc(ballX, ballY, ballRadius, 0, 2 * Math.PI);
	ctx.stroke();
	ctx.fill();
}
function checkCollision() {
	//rebound from top and bottom
	if (ballY <= 0 + ballRadius) {
		ballYDirection *= -1;
	}
	if (ballY >= gameHeight - ballRadius) {
		ballYDirection *= -1;
	}
	//check x-directional collision
	if (ballX <= 0) {
		player2Score += 1;
		createBall();
		updateScore();
		return;
	}
	if (ballX >= gameWidth) {
		player1Score += 1;
		createBall();
		updateScore();
		return;
	}
	//if ball is inbetn paadle and wall(if ball gets stuck)
	//ballX inbetn screen and pad+radius(+r bcz cuase x is at centre)
	//ballY inbet paddle and top/bottom screen
	//it migth get continious rebound there
	if (ballX <= paddle1.x + paddle1.width + ballRadius) {
		if (ballY > paddle1.y && ballY < paddle1.y + paddle1.height) {
			//move it away
			ballX = paddle1.x + paddle1.width + ballRadius; //
			//so shift direction
			ballXDirection *= -1;
			ballSpeed += 0.3;
		}
	}
	if (ballX >= paddle2.x - ballRadius) {
		if (ballY > paddle2.y && ballY < paddle2.y + paddle2.height) {
			ballX = paddle2.x - ballRadius;
			ballXDirection *= -1;
			ballSpeed += 0.3;
		}
	}
}
/////
const paddle1Up = 87;
const paddle1Down = 83;
const paddle2Up = 38;
const paddle2Down = 40;
function changeDirection(event) {
	const keyPressed = event.keyCode;
	switch (keyPressed) {
		case paddle1Up:
			if (paddle1.y > 0) {
				paddle1.y -= paddleSpeed;
			}
			break;
		case paddle1Down:
			if (paddle1.y < gameHeight - paddle1.height) {
				paddle1.y += paddleSpeed;
			}
			break;
		case paddle2Up:
			if (paddle2.y > 0) {
				paddle2.y -= paddleSpeed;
			}
			break;
		case paddle2Down:
			if (paddle2.y < gameHeight - paddle2.height) {
				paddle2.y += paddleSpeed;
			}
			break;
	}
}
function updateScore() {
	if (player1Score >= 10 || player2Score >= 10) {
		clearBoard();
		drawPaddles();
		running = false;
		//stop ticks
		clearInterval(intervalID);
		//display winner
		ctx.font = "30px MV Boli";
		ctx.fillStyle = "#FAFAFA";
		ctx.textAlign = "center";
		if (player1Score >= 10) {
			ctx.fillText(
				"PLAYER 1 (BLUE) WINS!!",
				gameWidth / 2,
				gameHeight / 2
			);
		} else {
			ctx.fillText(
				"PLAYER 2 (RED) WINS!!",
				gameWidth / 2,
				gameHeight / 2
			);
		}
	}
	scoreText.textContent = `${player1Score} : ${player2Score}`;
}
function resetGame() {
	//reset
	clearInterval(intervalID);
	player1Score = 0;
	player2Score = 0;
	//create and set initial position of paddles
	paddle1 = {
		width: 25,
		height: 100,
		x: 0,
		y: 0,
	};
	paddle2 = {
		width: 25,
		height: 100,
		x: gameWidth - 25,
		y: gameHeight - 100,
	};
	ballX = 0;
	ballY = 0;
	ballXDirection = 0;
	ballYDirection = 0;
	updateScore();
	gameStart();
}
