 var canvas = document.getElementById('myCamvas');
 var ctx = canvas.getContext('2d');
 var x = canvas.width / 2;
 var y = canvas.height - 30;
 var v = 1;
 var dx = 1;
 var dy = -1;

 var ballRadius = 10;
 var ballColor = "#0095dd";

 var paddleHeight = 10;
 var paddleWidth = 75;
 var paddleX = (canvas.width - paddleWidth) / 2;
 var paddleSpeed = 3;

 var rightPressed = false;
 var leftPressed = false;

 //block
 var brickRowCount = 3;
 var brickColumnCount = 5;
 var brickWidth = 75;
 var brickHeight = 20;
 var brickPadding = 10;
 var brickOffsetTop = 30;
 var brickOffsetLeft = 30;

 var bricks = [];
 for (let c = 0; c < brickColumnCount; c++) {
     bricks[c] = [];
     for (let r = 0; r < brickRowCount; r++) {
         bricks[c][r] = { x: 0, y: 0 };
     }
 }

 function drawBricks() {
     for (let c = 0; c < brickColumnCount; c++) {
         for (let r = 0; r < brickRowCount; r++) {
             const brickX = (c * (brickWidth + brickPadding)) + brickOffsetLeft;
             const brickY = (r * (brickHeight + brickPadding)) + brickOffsetTop;
             bricks[c][r].x = brickX;
             bricks[c][r].y = brickY;
             ctx.beginPath();
             ctx.rect(brickX, brickY, brickWidth, brickHeight);
             ctx.fillStyle = "#0095DD";
             ctx.fill();
             ctx.closePath();
         }
     }
 }

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

 function drawPaddle() {
     ctx.beginPath();
     ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
     ctx.fillStyle = "#0095dd";
     ctx.fill();
     ctx.closePath();
 }

 function draw() {
     ctx.clearRect(0, 0, canvas.width, canvas.height);
     drawBricks();
     drawBall();
     drawPaddle();
     x += dx * v;
     y += dy * v;

     //ball bounce 
     if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
         dx = -dx;
         ballColor = "#" + getRandomColor();
     };

     if (y + dy < ballRadius) {
         dy = -dy;
         ballColor = "#" + getRandomColor();

     } else if (y + dy > canvas.height - ballRadius) {
         if (x > paddleX && x < paddleX + paddleWidth) {
             dy = -dy;
             v *= 1.1;

         } else {
             alert('GAME OVER!!!');
             document.location.reload();
             clearInterval(interval);
         }
     };



     //paddle move
     if (rightPressed && paddleX < canvas.width - paddleWidth) {
         paddleX += paddleSpeed;
     } else if (leftPressed && paddleX > 0) {
         paddleX -= paddleSpeed;
     }

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

 var interval = setInterval(draw, 10);