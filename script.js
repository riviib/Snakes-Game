// ===== GET ELEMENTS =====
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const menu = document.getElementById("menu");
const gameOverScreen = document.getElementById("gameOver");
const finalScore = document.getElementById("finalScore");

const startBtn = document.getElementById("startBtn");
const retryBtn = document.getElementById("retryBtn");
const menuBtn = document.getElementById("menuBtn");

const speedSelect = document.getElementById("speedSelect");
const obstacleSelect = document.getElementById("obstacleSelect");


// ===== GAME VARIABLES =====
const box = 20;

let snake;
let food;
let direction;
let gameInterval;
let speed;
let obstacles = [];
let obstacleCount = 0;
let openMouth = false;
let score = 0;


// ===== START BUTTON =====
startBtn.onclick = () => {
    startGame();
};


// ===== RETRY BUTTON =====
retryBtn.onclick = () => {
    startGame();
};


// ===== MENU BUTTON =====
menuBtn.onclick = () => {
    if(gameInterval) clearInterval(gameInterval);      // stop old loop
    document.getElementById("gameContainer").style.display = "none";  // hide canvas
    gameOverScreen.style.display = "none";            // hide game over
    menu.style.display = "flex";                      // show menu
};


// ===== START GAME FUNCTION =====
function startGame() {
    // stop any previous game loop
    if(gameInterval) clearInterval(gameInterval);

    // show container and canvas
    const gameContainer = document.getElementById("gameContainer");
    gameContainer.style.display = "flex";
    canvas.style.display = "block";

    // hide other screens
    menu.style.display = "none";
    gameOverScreen.style.display = "none";

    // reset snake & variables
    snake = [{x:10, y:10}];
    direction = "RIGHT";
    score = 0;

    speed = parseInt(speedSelect.value);
    obstacleCount = parseInt(obstacleSelect.value);

    generateObstacles();
    placeFood();

    // clear canvas
    ctx.clearRect(0,0,canvas.width,canvas.height);

    // start game loop
    gameInterval = setInterval(draw, speed);
}


// ===== PLACE FOOD =====
function placeFood(){
    food = {
        x: Math.floor(Math.random()* (canvas.width/box)),
        y: Math.floor(Math.random()* (canvas.height/box))
    };
}


// ===== GENERATE OBSTACLES =====
function generateObstacles(){

    obstacles = [];

    for(let i=0;i<obstacleCount;i++){

        obstacles.push({
            x: Math.floor(Math.random()* (canvas.width/box)),
            y: Math.floor(Math.random()* (canvas.height/box))
        });

    }
}


// ===== DRAW SNAKE HEAD =====
function drawSnakeHead(x,y){

    // head
    ctx.fillStyle = "limegreen";
    ctx.beginPath();
    ctx.arc(x+box/2,y+box/2,box/2,0,Math.PI*2);
    ctx.fill();

    // eyes
    ctx.fillStyle = "black";

    if(direction==="RIGHT"){
        ctx.fillRect(x+14,y+5,3,3);
        ctx.fillRect(x+14,y+12,3,3);
    }

    if(direction==="LEFT"){
        ctx.fillRect(x+3,y+5,3,3);
        ctx.fillRect(x+3,y+12,3,3);
    }

    if(direction==="UP"){
        ctx.fillRect(x+5,y+3,3,3);
        ctx.fillRect(x+12,y+3,3,3);
    }

    if(direction==="DOWN"){
        ctx.fillRect(x+5,y+14,3,3);
        ctx.fillRect(x+12,y+14,3,3);
    }

    // mouth
    if(openMouth){

        ctx.strokeStyle="red";
        ctx.beginPath();

        if(direction==="RIGHT"){
            ctx.moveTo(x+18,y+8);
            ctx.lineTo(x+20,y+12);
        }

        if(direction==="LEFT"){
            ctx.moveTo(x+2,y+8);
            ctx.lineTo(x,y+12);
        }

        if(direction==="UP"){
            ctx.moveTo(x+8,y+2);
            ctx.lineTo(x+12,y);
        }

        if(direction==="DOWN"){
            ctx.moveTo(x+8,y+18);
            ctx.lineTo(x+12,y+20);
        }

        ctx.stroke();
    }
}


// ===== DRAW FUNCTION =====
function draw(){

    ctx.fillStyle="black";
    ctx.fillRect(0,0,canvas.width,canvas.height);


    // obstacles
    ctx.fillStyle="gray";

    obstacles.forEach(o=>{
        ctx.fillRect(o.x*box,o.y*box,box,box);
    });


    // food
    ctx.fillStyle="red";
    ctx.beginPath();
    ctx.arc(food.x*box+10,food.y*box+10,8,0,Math.PI*2);
    ctx.fill();


    // snake
    snake.forEach((segment,index)=>{

        if(index===0){

            drawSnakeHead(segment.x*box,segment.y*box);

        }else{

            ctx.fillStyle="green";

            ctx.beginPath();
            ctx.arc(segment.x*box+10,segment.y*box+10,8,0,Math.PI*2);
            ctx.fill();

        }

    });


    // move
    let headX=snake[0].x;
    let headY=snake[0].y;

    if(direction==="RIGHT") headX++;
    if(direction==="LEFT") headX--;
    if(direction==="UP") headY--;
    if(direction==="DOWN") headY++;


    // collision wall
    if(headX<0 || headY<0 || headX>=canvas.width/box || headY>=canvas.height/box){

        gameOver();
        return;

    }


    // collision self
    for(let s of snake){

        if(headX===s.x && headY===s.y){

            gameOver();
            return;

        }

    }


    // collision obstacles
    for(let o of obstacles){

        if(headX===o.x && headY===o.y){

            gameOver();
            return;

        }

    }


    // eat food
    if(headX===food.x && headY===food.y){

        snake.unshift({x:headX,y:headY});
        score++;
        placeFood();

    }else{

        snake.pop();
        snake.unshift({x:headX,y:headY});

    }

    openMouth=!openMouth;

    ctx.fillStyle = "white";
    ctx.font = "20px Arial";
    ctx.fillText("Score: " + score, 10, 25);
}


// ===== GAME OVER =====
function gameOver() {
    // stop loop
    clearInterval(gameInterval);

    // hide container only (canvas stays visible inside)
    document.getElementById("gameContainer").style.display = "none";

    // show game over
    finalScore.textContent = "Score: " + score;
    gameOverScreen.style.display = "flex";
}


// ===== CONTROLS =====
document.addEventListener("keydown",(event)=>{

    if(event.key==="ArrowRight" && direction!=="LEFT") direction="RIGHT";
    if(event.key==="ArrowLeft" && direction!=="RIGHT") direction="LEFT";
    if(event.key==="ArrowUp" && direction!=="DOWN") direction="UP";
    if(event.key==="ArrowDown" && direction!=="UP") direction="DOWN";

});