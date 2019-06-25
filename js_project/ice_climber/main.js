var canvas = document.getElementById('myCanvas');
var ctx = canvas.getContext('2d');

let mouseAxis = [0, 0];
let mouseState = false;

//for game start -----------------------------
{
    let fillCount = 0;
    let climber = ["C", "L", "I", "M", "B", "E", "R"];
    let Height = [310, 310, 310, 310, 310, 310, 310];
    let marginCh = 50;
    const reducer = (accumulator, currentValue) => accumulator + currentValue;
    let gsColor = "#ccc";

    function drawTitle() {
        ctx.fillStyle = "#00ffff";
        fillCount < 255 ? fillCount += 5 : 1;
        fillColor = "#" + fillCount.toString(16) + "ffff";

        ctx.font = "80px Comic Sans MS";
        ctx.fillStyle = fillColor;
        ctx.strokeStyle = "blue";
        ctx.fillText("ICE", 50, 100);
        ctx.strokeText("ICE", 50, 100);

        ctx.font = "80px Comic Sans MS";
        ctx.fillStyle = "#963";
        ctx.strokeStyle = "000";
        for (let cnt = 0; cnt < 7; cnt++) {
            marginCh = cnt == 3 ? 46 : 50;
            ctx.fillText(climber[cnt], 80 + cnt * marginCh, Height[cnt]);
            ctx.strokeText(climber[cnt], 80 + cnt * marginCh, Height[cnt]);
        }
        let upHeight = Math.floor(Math.random() * 7);
        Height[upHeight] > 180 && fillColor == "#ffffff" ? Height[upHeight] -= 5 : 1;

        if (Height.reduce(reducer) == 1260) {
            ctx.fillStyle = "black";
            ctx.strokeStyle = "black";
            ctx.font = "15px Arial black";
            ctx.fillText("↖click here", 350, 310);
            ctx.strokeText("↖click here", 350, 310);

            //mouse over & click => next state
            if (120 < mouseAxis[0] && mouseAxis[0] < 410 && 267 < mouseAxis[1] && mouseAxis[1] < 296) {

                gsColor = "#333";

                if (mouseState) {
                    mouseState = false;
                    nextState();
                }
            } else gsColor = "#ccc";

            ctx.fillStyle = gsColor;
            ctx.strokeStyle = gsColor;
            ctx.font = "40px Arial black";
            ctx.fillText("GAME START", 90, 280);
            ctx.strokeText("GAME START", 90, 280);
        }
    }
}

//オブジェクトたち-----------------------------
let iceMan = {
    'height': 20,
    'width': 20,
    'color': 'white',
    'stroke': "rgba(0, 0, 255, 0.5)",
    //'x': canvas.width / 2 - 20 / 2, //20 -> iceMan.width
    //'y': canvas.height - 150,
    'x': 70,
    'y': 260,

    'jumpV': 25,
    'jumpAc': 0.8,
    'jumpFlag': false,

    'xV': 2,
    'slideV': 0,
    'slideVMax': 3,
    'slideAc': 0.9,
    'rightSlideFlag': false,
    'leftSlideFlag': false,
}

let dx = 0;
let dy = 2;
const dyMax = 10;
const ac = 1.25;

let needle = {
    'width': 10,
    'height': 0, //max 20
    'count': 50,
    'margin': 1,
}

let scaffolds = {
    'x': 0,
    'y': canvas.height - 80,
    'height': 10,
    'interval': canvas.height / 4,
    'holeWidth': canvas.width / 5,
    'holeNum': 1,
    'holeX': 0,
    'entity': [], //  [btmX1,btmX2,btmY][btmX1,btmX2,btmY][]...
    'onFlag': false,

}

let hatenaBlock = {
    'x': 430,
    'y': 20,
    'width': 35,
    'height': 35,
    'color': "#f8d300",
}
let img = new Image();
img.src = 'img/hatena_block.jpeg';

let rightPressed = false;
let leftPressed = false;

const insideRightWall = () => iceMan.x < canvas.width - iceMan.width;
const insideLeftWall = () => iceMan.x > 0;

const startTime = Date.now();
let score = 0;
let lives = '♥♥♥';

function initScaffolds() {
    for (let c = 0; c < 4; c++) {
        const min = scaffolds.holeWidth / 2;
        scaffolds.holeX = Math.floor(Math.random() * (canvas.width - scaffolds.holeWidth + 1 - min) + min);
        for (let r = 0; r < 1; r++) {
            let btmX1 = scaffolds.holeX - scaffolds.holeWidth / 2;
            let btmX2 = btmX1 + scaffolds.holeWidth;
            let btmY = scaffolds.y - c * scaffolds.interval;
            //-------+        +-------------
            //       |        |
            //------btmX1    btmX2--------------
            //     btmY
            scaffolds.entity.push([btmX1, btmX2, btmY]);
        }
    }
}


//draw functions -----------------------------
function drawIceMan() {
    ctx.beginPath();
    ctx.rect(iceMan.x, iceMan.y, iceMan.width, iceMan.height);
    ctx.fillStyle = iceMan.color;
    ctx.strokeStyle = iceMan.stroke;
    ctx.fill();
    ctx.stroke();
    ctx.closePath();
}

function drawScaffolds() {
    for (let c = 0; c < 3; c++) {
        let topY = scaffolds.entity[c][2] - scaffolds.height;
        for (let n = 0; n < 1; n++) {
            ctx.beginPath();
            ctx.rect(0, topY, scaffolds.entity[c][0], scaffolds.height);
            ctx.rect(scaffolds.entity[c][1], topY, canvas.width - scaffolds.entity[c][1], scaffolds.height);
            ctx.fillStyle = 'gray';
            ctx.strokeStyle = 'black';
            ctx.fill();
            ctx.stroke();
            ctx.closePath();

        }
    }
}

function drawNeedles() {
    for (let r = 0; r < needle.count; r++) {
        ctx.beginPath();
        ctx.moveTo(r * needle.width + 1, canvas.height);
        ctx.lineTo(r * needle.width + needle.width / 2, canvas.height - needle.height);
        ctx.lineTo(r * needle.width + needle.width - 1, canvas.height);
        ctx.closePath();
        ctx.strokeStyle = 'black';
        ctx.stroke();
        ctx.fillStyle = 'gray';
        ctx.fill();
    }
}

function growNeedle() {
    if (needle.height < 21) {
        needle.height += 0.3;
    } else {
        //tutorial end
        nextState();
    }
}

function getNowTime() {
    return Date.now() - startTime;
}

function drawScore() {
    ctx.font = "16px Comic Sans MS";
    ctx.fillStyle = "magenta";
    ctx.fillText("SCORE: " + score, 8, 20);
}

function drawLives() {
    ctx.font = "16px Comic Sans MS";
    ctx.fillStyle = "magenta";
    ctx.fillText("LIVES: " + lives, 8, 45);
}

function drawOperation() {
    ctx.fillStyle = "black";
    ctx.strokeStyle = "black";
    ctx.font = "14px Comic Sans MS";
    ctx.fillText("  JUMP : [space]", 350, 270);
    ctx.fillText("   LEFT : ←", 351, 290);
    ctx.fillText("RIGHT : →", 352, 310);
}

function drawStartButton() {
    hatenaBlock.x = scaffolds.entity[2][0] + scaffolds.holeWidth / 2 - hatenaBlock.width / 2;
    ctx.drawImage(img, hatenaBlock.x, hatenaBlock.y, hatenaBlock.width, hatenaBlock.height);
}



//functions for iceMan moving-----------------------------
function xAxisMove() {
    if (rightPressed && insideRightWall()) {
        iceMan.x += iceMan.xV;
    } else if (leftPressed && insideLeftWall()) {
        iceMan.x -= iceMan.xV;
    }
}

function checkSlide() {
    if (iceMan.rightSlideFlag && insideRightWall()) {
        iceMan.slideV = iceMan.slideVMax;
    } else if (iceMan.leftSlideFlag && insideLeftWall()) {
        iceMan.slideV = -iceMan.slideVMax;
    }

    //slide
    if (Math.abs(iceMan.slideV) > 0.0001 && insideRightWall() && insideLeftWall()) {
        iceMan.slideV *= iceMan.slideAc;
        iceMan.x += iceMan.slideV;

    } else iceMan.slideV = 0; //initialize
}

function checkJump() {
    if (iceMan.jumpFlag) {
        if (dy == 0) dy = -iceMan.jumpV;
        dy *= iceMan.jumpAc;

        //ジャンプの頂点から落ちてる間
        if (dy > -1) {
            dy = -dy;
            iceMan.jumpFlag = false;
        }
    }
}

//床で止めてる
function checkFieldCollition() {
    if (iceMan.y + iceMan.height + 2 > canvas.height) {
        dy = 0;
        iceMan.y = canvas.height - iceMan.height - 2;
        console.log(iceMan.y);
    }
}

function checkScaffoldCollition() {
    for (let scafN = 0; scafN < 4; scafN++) {
        //check collition to scaffold btm
        if (dy <= -1 && notBetweenHole(scafN, "T")) {
            dy = 1; //drop
        }

        //check collition to scaffols top
        if (dy > 0 && notBetweenHole(scafN, "B")) {
            dy = 0; //stop on scaffold
            iceMan.y = scaffolds.entity[scafN][2] - scaffolds.height - iceMan.height;
            scaffolds.onFlag = true;
        }

        //check drop hole
        if (scaffolds.onFlag && dy == 0 && betweenHole(scafN)) {
            dy = 2;
            scaffolds.onFlag = false;
            console.log('on hole');
        }
    }
}

//加速と最大速度制限
function checkMaxAcceleration() {
    if (!iceMan.jumpFlag) {
        if (dy < dyMax) {
            return dy *= ac;
        } else {
            return dy = dyMax;
        }
    } else return dy;
}


//無いと上に吹っ飛んでく
function setJumpFlag() {
    if (dy > 0) iceMan.jumpFlag = false; //drop
}

//引数は下から数えた足場の数:0~2
// TOP or BOTTOM
function notBetweenHole(num, TorB) {
    let checkXAxis = iceMan.x > scaffolds.entity[num][0] && iceMan.x + iceMan.width < scaffolds.entity[num][1];

    let checkSurface = (TorB == "T") ? iceMan.y : iceMan.y + iceMan.height;
    let checkYAxis = scaffolds.entity[num][2] > checkSurface && checkSurface > scaffolds.entity[num][2] - scaffolds.height;

    if (checkYAxis && !checkXAxis) {
        return true;
    } else return false;
}

//引数は下から数えた足場の数:0~2
function betweenHole(num) {
    const margin = 2;
    let checkXAxis = iceMan.x > scaffolds.entity[num][0] && iceMan.x + iceMan.width < scaffolds.entity[num][1];
    let checkSurface = iceMan.y + iceMan.height;
    let checkYAxis = scaffolds.entity[num][2] > checkSurface && checkSurface > scaffolds.entity[num][2] - scaffolds.height - margin;

    if (checkYAxis && checkXAxis) {
        return true;
    } else {
        return false;
    }
}

function checkBoxCollition() {
    if (hatenaBlock.x - iceMan.width < iceMan.x && iceMan.x < hatenaBlock.x + hatenaBlock.width) {
        if (hatenaBlock.y + hatenaBlock.height > iceMan.y) {
            console.log('touch');

            return true;
        }
    } else return false;

}


//for state transition------------------------------
let nowState = "start";

function gameStart() {
    drawTitle();
}

function gameTutorial() {

    drawIceMan();
    drawScaffolds();
    drawStartButton();

    if (checkBoxCollition()) {
        drawNeedles();
        growNeedle();

    } else {
        drawOperation();
        xAxisMove();
        checkSlide();
        checkJump();

        checkFieldCollition();
        checkScaffoldCollition();

        //この下は弄らない-----------------
        setJumpFlag();
        iceMan.x += dx;
        iceMan.y += checkMaxAcceleration();
    }
}

function gamePlaying() {

    drawIceMan();
    drawNeedles();
    drawScaffolds();
    drawLives();
    drawScore();

    score = Math.ceil(getNowTime() / 1000);

    xAxisMove();
    checkSlide();
    checkJump();

    checkFieldCollition();
    checkScaffoldCollition();

    //この下は弄らない-----------------
    setJumpFlag();
    iceMan.x += dx;
    iceMan.y += checkMaxAcceleration();
}

function gameEnd() {

}

function nextState() {
    if (nowState == "start") nowState = "tutorial";
    else if (nowState == "tutorial") nowState = "playing";
    else if (nowState == "playing") nowState = "end";
}

//main function----------------------------
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    switch (nowState) {
        case "start":
            gameStart();
            break;
        case "tutorial":
            gameTutorial();
            break;
        case "playing":
            gamePlaying();
            break;
        case "end":
            gameEnd();
            break;
    }

    requestAnimationFrame(draw);
}

//function for mouse--------------------------------------- 
document.addEventListener('mousemove', getMouseAxis);
document.addEventListener('mousedown', getMouseDown);
document.addEventListener('mouseup', getMouseUp);

function getMouseAxis(e) {
    mouseAxis[0] = e.clientX;
    mouseAxis[1] = e.clientY;
    console.log("mouseAxis: ", mouseAxis);
}

function getMouseDown() {
    mouseState = true;
}

function getMouseUp() {
    mouseState = false;
}

//functions for key input------------------------------ 
document.addEventListener("keydown", KeyDownHandler, false);
document.addEventListener("keyup", KeyUpHandler, false);

function KeyDownHandler(e) {
    if (e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = true;
        iceMan.rightSlideFlag = true;
    } else if (e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = true;
        iceMan.leftSlideFlag = true;
    } else if (e.key == ' ' && dy == 0) {
        iceMan.jumpFlag = true;
    }
}

function KeyUpHandler(e) {
    if (e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = false;
        iceMan.rightSlideFlag = false;
    } else if (e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = false;
        iceMan.leftSlideFlag = false;
    }
}

//start program!----------------------------------------
initScaffolds();
draw();