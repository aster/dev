var canvas = document.getElementById('myCanvas');
var ctx = canvas.getContext('2d');

let iceMan = {
    'height': 20,
    'width': 20,
    'color': 'white',
    'stroke': "rgba(0, 0, 255, 0.8)",
    'x': canvas.width / 2 - 20 / 2, //20 -> iceMan.width
    'y': canvas.height - 150,

    'jumpV': 20,
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

let rightPressed = false;
let leftPressed = false;

const insideRightWall = () => iceMan.x < canvas.width - iceMan.width;
const insideLeftWall = () => iceMan.x > 0;

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

function checkOnField() {

}

//床で止めてる
function checkOnScaffold() {
    if (iceMan.y + iceMan.height + 2 > canvas.height) {
        dy = 0;
        iceMan.y = canvas.height - iceMan.height - 2;
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

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawIceMan();


    checkOnField();
    checkOnScaffold();

    xAxisMove();
    checkSlide();
    checkJump();
    console.log('dy = ', dy, '  jump flag : ', iceMan.jumpFlag);

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


draw();