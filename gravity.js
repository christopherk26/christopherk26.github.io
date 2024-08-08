var prevScore = 0;
var topScore = 0;
var gameOver = true;
var timeRemaining = 60;

class Vec
{
  constructor(x = 0, y = 0)
  {
    this.x = x;
    this.y = y;
  }
}

class Rect
{
  constructor(w, h)
  {
    this.pos = new Vec();
    this.size = new Vec(w, h);
  }
  get left()
  {
    return this.pos.x - this.size.x / 2;
  }
  get right()
  {
    return this.pos.x + this.size.x / 2;
  }
  get top()
  {
    return this.pos.y - this.size.y / 2;
  }
  get bottom()
  {
    return this.pos.y + this.size.y / 2;
  }
}

class Box extends Rect
{
  constructor()
  {
    super(30,30);
    this.vel = new Vec();
  }
}
class Food extends Rect
{
  constructor()
  {
    super(10,10);
    this.vel = new Vec();
  }
}
class Main
{
  constructor(canvas)
  {
    this._canvas = canvas;
    this._context = canvas.getContext('2d');
    this.box = new Box();
    this.box.pos.x = this._canvas.width/2;
    this.box.pos.y = this._canvas.height - this.box.size.x/2;
    this.box.vel.x = 0;
    this.box.vel.y = 0;
    this.food = new Food();
    this.food.pos.x = this._canvas.width/2;
    this.food.pos.y = this._canvas.height/2;
    this.food.vel.x = 0;
    this.food.vel.y = 0;
    

      
    let lastTime;
    const callback = (millis) => {
        if (lastTime) {
          this.update((millis - lastTime) / 1000);
        }
        lastTime = millis;
        requestAnimationFrame(callback);
      };
      callback();
  }

draw(){
    this._context.fillStyle = '#000000';
    this._context.fillRect(0,0, this._canvas.width, this._canvas.height);
    this.drawBox(this.box);
    this.drawFood(this.food);
  }
  
  drawBox(rect){
    this._context.fillStyle = '#ffffff';
    this._context.fillRect(rect.left, rect.top, rect.size.x, rect.size.y);
    }
  drawFood(rect){
    this._context.fillStyle = '#ffffff';
    this._context.fillRect(rect.left, rect.top, rect.size.x, rect.size.y);
    }

update(dt) {
  
    displayResults();
   if (gameOver === false){
    timeRemaining = timeRemaining - 0.01666666;
    displayResults();
   }
  if (timeRemaining <= 1){
   gameOver = true;
   this.box.vel.x = 0;
   this.box.vel.y = 0;
   this.food.vel.x = 0;
   this.food.vel.y = 0;
   }
   
  
  this.box.pos.y += (this.box.vel.y * dt);
  this.box.pos.x += (this.box.vel.x * dt);
  this.food.pos.y += (this.food.vel.y * dt);
  this.food.pos.x += (this.food.vel.x * dt);
     
    if(gameOver === false){
    this.box.vel.y += (15);
   this.food.vel.y += (15);
  var foodSpeed = 150;
  var VecScale = ( ((this.box.pos.x-this.food.pos.x)**2 + (this.box.pos.y-this.food.pos.y)**2) )**0.5/foodSpeed;
  this.food.vel.x = (this.box.pos.x-this.food.pos.x)/Math.abs(VecScale);
  this.food.vel.y = (this.box.pos.y-this.food.pos.y)/Math.abs(VecScale);
  
  //console.log(VecScale);
  //console.log(this.food.vel.y);
  //console.log(this.food.vel.x);
  console.log(((this.food.vel.x)**2 + (this.food.vel.y)**2)**0.5);
    }
// this.food.vel.y = (this.box.pos.y - this.food.pos.y);
// this.food.vel.x = (this.box.pos.x - this.food.pos.x);
    
    if (prevScore > topScore){
     topScore = prevScore;
    }
    /////////
    if(this.box.bottom > this.food.top && this.box.top < this.food.bottom && this.box.right > this.food.left && this.box.left < this.food.right ) {
      randomFoodPos();
      prevScore += 1;
    }
    
    if(this.box.right > this._canvas.width - 5) {
      this.box.vel.x = -1* Math.abs(this.box.vel.x);
    }
     if(this.box.left < 0) {
      this.box.vel.x = Math.abs(this.box.vel.x);
    }
  
    if(this.box.top < 0) {
      this.box.vel.y = Math.abs(this.box.vel.y);
    }
    if(this.box.bottom > this._canvas.height){
     this.box.pos.y =  this._canvas.height - this.box.size.x/2;
     this.box.vel.y = -1* (Math.abs(this.box.vel.y * 0.8));
     this.box.vel.x = (this.box.vel.x * 0.8);
    }
    //////////
    if(this.food.right > this._canvas.width - 5 || this.food.left < 0) {
      this.food.vel.x = -this.food.vel.x;
    }
  
    if(this.food.top < 0) {
      this.food.vel.y = -this.food.vel.y;
    }
    if(this.food.bottom > this._canvas.height){
     this.food.pos.y =  this._canvas.height - this.food.size.x/2;
     this.food.vel.y = -(this.food.vel.y * 0.8);
     this.food.vel.x = (this.food.vel.x * 0.8);
    }
    ///////////
    if (gameOver === false){
     document.onkeydown = checkKey;
    }else{
      document.onkeydown = null;
      }
      
    
    this.draw();
    
  }
}

const canvas = document.getElementById('mainCanvas');
const STUFF = new Main(canvas);


      
function checkKey(e) {

    e = e || window.event;

    if (e.keyCode == '87') {
      STUFF.box.vel.y = STUFF.box.vel.y -400;
      
    }
    else if (e.keyCode == '65') {
      STUFF.box.vel.x = STUFF.box.vel.x -400;
    }
    else if (e.keyCode == '83') {
      STUFF.box.vel.y = STUFF.box.vel.y +150;
    }
    else if (e.keyCode == '68') {
      STUFF.box.vel.x = STUFF.box.vel.x +150;
    }

  }
  
  
function displayResults(){
  if(STUFF.box.pos.y <= STUFF._canvas.height){
document.getElementById("Results").innerHTML = "Score: " + prevScore + " Top Score: " + topScore + " Time Remaining: " + Math.floor(timeRemaining);
  }
}
var startButton = document.getElementById('startButton');
var resetButton = document.getElementById('resetButton');
startButton.addEventListener("click", startGame);
resetButton.addEventListener("click", resetGame);


function resetGame(){

  prevScore = 0;
  gameOver = true;
  timeRemaining = 60;
  displayResults();
    STUFF.box.pos.x = STUFF._canvas.width/2;
    STUFF.box.pos.y = STUFF._canvas.height - STUFF.box.size.x/2;
    STUFF.box.vel.x = 0;
    STUFF.box.vel.y = 0;
    STUFF.food.pos.x = STUFF._canvas.width/2;
    STUFF.food.pos.y = STUFF._canvas.height/2;
    STUFF.food.vel.x = 0;
    STUFF.food.vel.y = 0;
}
function startGame(){
  if(timeRemaining === 60){
  prevScore = 0;
  gameOver = false;
  timeRemaining = 61;
  }
}

function randomFoodPos(){
  STUFF.food.pos.x = Math.floor(Math.random() * STUFF._canvas.width/2)+STUFF._canvas.width/4;
  STUFF.food.pos.y = Math.floor(Math.random() * STUFF._canvas.height/2)+STUFF._canvas.width/4;
 STUFF.food.vel.x = Math.floor(Math.random() * STUFF._canvas.width);
 STUFF.food.vel.y = Math.floor(Math.random() * STUFF._canvas.height);
}
