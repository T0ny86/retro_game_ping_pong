"use strict";
// /** @type {CanvasRenderingContext2D} */
// the line below help the VSC to know what is the context is ! , the canvas element belongs to HTML
// without this line, everything will work well, but without intellisense in VSC
/** @type {HTMLCanvasElement} */
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
//const theGradient = ctx.createLinearGradient(0, 0,0, 0);

const scorePanel = document.getElementById("score");

const btn = document.getElementById("btn");
/* ----constants ---- */
const PI = 2 * Math.PI;
const BALL_RADIUS = 20;

const BALL_COLOR = "#C86400";
const FLOOR_COLOR = "#005C01";
const PADEL_COLOR = "#870000";

let canvasH = canvas.height;
let canvasW = canvas.width;

let ball = { x: canvasW / 2, y: canvasW / 2, r: BALL_RADIUS };
let padel = { h: 100, w: 20 };
let leftPadel = { x: 0 + 2, y: canvasH / 2 - padel.h / 2 };
let rightPadel = { x: canvasW - padel.w - 2, y: canvasH / 2 - padel.h / 2 };

/* ---- initialization */
let dx = 3;
let dy = 2;
let incSpeed = 0.0;
let score = 0,
  hits = 0;

// create explosion sound
let pingSound = document.createElement("audio");
pingSound.src = "./ping.wav";
pingSound.setAttribute("controls", "none");
pingSound.setAttribute("preload", "auto");
pingSound.style.display = "none";
pingSound.volume = 0.5;
scorePanel.append(pingSound);

/* ---- controlling init */

function mouseContorling() {
  document.addEventListener("mousemove", (e) => {
    //console.log(e)
    leftPadel.y = e.clientY;
  });
}

function drawBall() {
  ctx.beginPath();
  ctx.fillStyle = BALL_COLOR;
  ctx.arc(ball.x, ball.y, ball.r, 0, PI, false);
  ctx.fill();
  ctx.closePath();
}

function drawRightPadel() {
  ctx.beginPath();
  ctx.fillStyle = PADEL_COLOR;
  ctx.rect(rightPadel.x, rightPadel.y, padel.w, padel.h);
  ctx.fill();
  ctx.closePath();
}

function drawLeftPadel() {
  ctx.beginPath();
  ctx.fillStyle = PADEL_COLOR;
  ctx.rect(leftPadel.x, leftPadel.y, padel.w, padel.h);
  ctx.fill();
  ctx.closePath();
}

function collisionDetection() {
  /* calc collision for canvas borders */
  if (
    ball.x + ball.r > canvasW ||
    ball.x - ball.r < 0 ||
    ball.x + ball.r > rightPadel.x
  ) {
    pingSound.play();
    incSpeed += 0.1;
    dx = -(dx + incSpeed);
  }
  if (ball.y + ball.r > canvasH || ball.y - ball.r < 0) {
    dy = -dy;
  }
  /* calc collision with padels */
  // if (ball.x + ball.r > rightPadel.x) {
  //   dx = -dx;
  // }
  if (
    ball.x - ball.r <= leftPadel.x + padel.w &&
    ball.y - ball.r >= leftPadel.y &&
    ball.y + ball.r <= leftPadel.y + padel.h
  ) {
    dx = -dx;
    score += 1;
    pingSound.play();
  }
}
function recordsUpdate() {
  scorePanel.innerText = `Socre: ${score}`;
  // if(incSpeed >= 1){
  //   alert("you are hero")
  // }
  if (score >= 10) {
    // player won
    alert("you are hero");
  }
}
function drawStadium() {
  ctx.beginPath();
  ctx.fillStyle = FLOOR_COLOR;
  ctx.setLineDash([10, 15]);
  ctx.moveTo(canvasW / 2, 0);
  ctx.lineTo(canvasW / 2, canvasH);
  ctx.stroke();
  ctx.closePath;
  ctx.beginPath();
  ctx.arc(canvasW / 2, canvasH / 2, 60, 0, PI);
  ctx.stroke();
  ctx.closePath();
}
function gameLoop() {
  collisionDetection();
  mouseContorling();
  ctx.clearRect(0, 0, canvasW, canvasH);
  drawStadium();
  ball.x += dx;
  ball.y += dy;
  rightPadel.y = ball.y - padel.h / 2;
  drawBall();
  drawRightPadel();
  drawLeftPadel();
  recordsUpdate();
  requestAnimationFrame(gameLoop);
}

window.requestAnimationFrame(gameLoop);
