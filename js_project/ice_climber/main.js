var canvas = document.getElementById('myCanvas');
var ctx = canvas.getContext('2d');

let iceMan = {
    'height': 20,
    'width': 20,
    'color': 'white',
    'stroke': "rgba(0, 0, 255, 0.8)",
    'x': canvas.width / 2 - 20 / 2, //20 -> iceMan.width
    'y': canvas.height - 150,
    'dropV': 2,
    'xV': 3,
    'slideV': 0,
    'slideVMax': 3,
    'slideAc': 0.9,
    'leftSlideFlag': false,
    'rightSlideFlag': false,
}

let dx = 0;
let dy = 2;
const dyMax = 10;
const ac = 1.08;

let rightPressed = false;
let leftPressed = false;

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
    if (rightPressed && iceMan.x < canvas.width - iceMan.width) {
        iceMan.x += iceMan.xV;
    } else if (leftPressed && iceMan.x > 0) {
        iceMan.x -= iceMan.xV;
    }
}

function checkSlide() {
    if (iceMan.leftSlideFlag) {
        iceMan.slideV = -iceMan.slideVMax;
        iceMan.leftSlideFlag = false;

    } else if (iceMan.rightSlideFlag) {
        iceMan.slideV = iceMan.slideVMax;
        iceMan.rightSlideFlag = false;
    }

    //slide
    if (Math.abs(iceMan.slideV) > 0.0001) {
        iceMan.slideV *= iceMan.slideAc;
        iceMan.x += iceMan.slideV;

    } else iceMan.slideV = 0;
}

function jump() {

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

//最大速度制限
function checkMaxAcceleration() {
    if (dy < dyMax) {
        return dy *= ac;
    } else {
        return dy = dyMax;
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawIceMan();


    checkOnField();
    checkOnScaffold();

    xAxisMove();
    checkSlide();

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
    }
}

function KeyUpHandler(e) {
    if (e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = false;
    } else if (e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = false;
    }
}


draw();