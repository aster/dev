var canvas = document.getElementById('myCanvas');
var ctx = canvas.getContext('2d');

let iceMan = {
    'height': 20,
    'width': 20,
    'color': 'white',
    'stroke': "rgba(0, 0, 255, 0.8)",
    'dropV': 2,
}

let x = canvas.width / 2 - iceMan.width / 2;
let y = canvas.height - 150;
let dx = 0;
let dy = 2;
const dyMax = 10;
const ac = 1.05;

function drawIceMan() {
    ctx.beginPath();
    ctx.rect(x, y, iceMan.width, iceMan.height);
    ctx.fillStyle = iceMan.color;
    ctx.strokeStyle = iceMan.stroke;
    ctx.fill();
    ctx.stroke();
    ctx.closePath();

}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawIceMan();

    //床で止めてる
    if (y + iceMan.height + 3 > canvas.height) {
        dy = 0;
    }

    //-----------------------
    x += dx;

    if (dy < dyMax) dy *= ac;
    y += dy;
    requestAnimationFrame(draw);
}

draw();