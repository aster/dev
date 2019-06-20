var canvas = document.getElementById('myCanvas');
var ctx = canvas.getContext('2d');

let iceMan = {
    'height': 20,
    'width': 20,
    'color': 'white',
    'stroke': "rgba(0, 0, 255, 0.8)",
    'dropV': 2,
    'x': canvas.width / 2 - 20 / 2, //20 -> iceMan.width
    'y': canvas.height - 150,
    'xV': 7,
}

//let x = canvas.width / 2 - iceMan.width / 2;
//let y = canvas.height - 150;
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

    //-----------------------
    iceMan.x += dx;
    iceMan.y += checkMaxAcceleration();

    //iceman x axis move
    if (rightPressed && iceMan.x < canvas.width - iceMan.width) {
        iceMan.x += iceMan.xV;
    } else if (leftPressed && iceMan.x > 0) {
        iceMan.x -= iceMan.xV;
    }

    requestAnimationFrame(draw);
}


document.addEventListener("keydown", KeyDownHandler, false);
document.addEventListener("keyup", KeyUpHandler, false);

function KeyDownHandler(e) {
    if (e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = true;
    } else if (e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = true;
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