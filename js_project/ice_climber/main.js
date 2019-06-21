var canvas = document.getElementById('myCanvas');
var ctx = canvas.getContext('2d');

let iceMan = {
    'height': 20,
    'width': 20,
    'color': 'white',
    'stroke': "rgba(0, 0, 255, 0.5)",
    'x': canvas.width / 2 - 20 / 2, //20 -> iceMan.width
    'y': canvas.height - 150,

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
    'height': 20,
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

let rightPressed = false;
let leftPressed = false;

const insideRightWall = () => iceMan.x < canvas.width - iceMan.width;
const insideLeftWall = () => iceMan.x > 0;

const startTime = Date.now();
let score = 0;
let lives = '♥♥♥';

function initScaffolds() {
    for (let c = 0; c < 4; c++) {
        scaffolds.holeX = Math.floor(Math.random() * (canvas.width - scaffolds.holeWidth + 1));
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

function drawIceMan() {
    ctx.beginPath();
    ctx.rect(iceMan.x, iceMan.y, iceMan.width, iceMan.height);
    ctx.fillStyle = iceMan.color;
    ctx.strokeStyle = iceMan.stroke;
    ctx.fill();
    ctx.stroke();
    ctx.closePath();
}

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

        //ジャンプの頂点
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
    //足場の上で止まってたら落ちる 足場無いときだけ
    if (scaffolds.onFlag && dy == 0) {
        //dy = 2;
        scaffolds.onFlag = false;
    }

    for (let scafN = 0; scafN < 4; scafN++) {
        //check collition to scaffold btm
        if (dy <= -1 && notBetweenHole(scafN, "T")) {
            dy = 1; //drop
            iceMan.jumpFlag = false; //drop
        }

        //check collition to scaffols top
        if (dy > 0 && notBetweenHole(scafN, "B")) {
            dy = 0; //stop on scaffold
            iceMan.y = scaffolds.entity[scafN][2] - scaffolds.height - iceMan.height;
            scaffolds.onFlag = true;
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

function getNowTime() {
    return Date.now() - startTime;
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

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
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

    //-----------------------
    iceMan.x += dx;
    iceMan.y += checkMaxAcceleration();

    requestAnimationFrame(draw);
}


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

initScaffolds();
draw();