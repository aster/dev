 var canvas = document.getElementById('myCamvas');
 var ctx = canvas.getContext('2d');
 var x = canvas.width / 2;
 var y = canvas.height - 30;
 var v = 1;
 var dx = 1 * v;
 var dy = -1 * v;
 var ballRadius = 10;
 var ballColor = "#0095dd";

 function getRandomColor() {
     let tmp = Math.random() * (parseInt('FFFFFF', 16) - 1) + 1;
     return Math.floor(tmp).toString(16);
 }

 function drawBall() {
     ctx.beginPath();
     ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
     ctx.fillStyle = ballColor;
     ctx.fill();
     ctx.closePath();
 }

 function draw() {
     ctx.clearRect(0, 0, canvas.width, canvas.height);
     drawBall();
     x += dx;
     y += dy;

     if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
         dx = -dx;
         ballColor = "#" + getRandomColor();
     };

     if (y + dy > canvas.height - ballRadius || y + dy < ballRadius) {
         dy = -dy;
         ballColor = "#" + getRandomColor();
     };

     //    console.log(ballColor);


 }

 setInterval(draw, 10);