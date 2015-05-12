/**
 *
 */

var Vector = require("./Vector");
var utils = require("./mathLib");

function Brush(x1_, y1_, x2_, y2_, vel, life, smearDuration){
  this.life = life || 100;
  this.rgbaValues = [];
  this.pixelPositions = [];

  this.angle = 0; //display angle
  this.dAngle = -Math.PI / 2; //angle for depth, perpendicular to display angle

  //Define the Pixel Brush as a line positioned
  //at (x1,y1), stretching to (x2,y2)
  var vert1 = new Vector(x1_, y1_);
  var vert2 = new Vector(x2_, y2_);

  var tempDistVec = vert2.newSub(vert1);
  this.dist = Math.floor(tempDistVec.length());

  this.changedX = false;
  this.changedY = false;

  this.vel = vel || new Vector(0, 0);
  if(!vel){
    var theta = Math.random() * Math.PI * 2;
    this.vel.x = this.maxSpeed * Math.cos(theta);
    this.vel.y = this.maxSpeed * Math.sin(theta);
  }

  this.setMaxSpeedAndForce(.9, .05);

  this.pos = vert1.getAverage(vert2);
  this.acc = new Vector(0, 0);
  this.getPixelPositions(x1_, y1_, x2_, y2_);

  this.smearing = false; //true or false pixel is smearing
  this.smearDuration = smearDuration;
  this.smearsRemaining = smearDuration; //smears remaining
}

module.exports = Brush;

Brush.prototype.resetInit = function(){
  this.originalPixels = this.brushSys.iData.data;
};

Brush.prototype.trackInit = function(xStart_, yStart_, xEnd_, yEnd_){
  if(!this.trackStart || !this.trackEnd){
    this.trackStart = new Vector(xStart_, yStart_);
    this.trackEnd = new Vector(xEnd_, yEnd_);
    this.pos = this.trackStart.clone();

    this.desiredVelVec = this.trackEnd.newSub(this.trackStart);
    this.desiredVelVec.selfNormalize();
    this.desiredVelVec.selfMul(this.maxSpeed);
    this.vel = this.desiredVelVec.clone();

    this.update();
    this.getPixelPositions();
    this.getPixels();
  }
};

Brush.prototype.setMaxSpeed = function(num){
  this.maxSpeed = num;
};

Brush.prototype.setMaxForce = function(num){
  this.maxForce = num;
};

Brush.prototype.setMaxSpeedAndForce = function(mxSpd, mxFrc){
  this.maxSpeed = mxSpd;
  this.maxForce = mxFrc;
  this.vel.limit(mxSpd);
};

Brush.prototype.setDist = function(num){
  this.dist = num;
};


/**
 * @export
 * @return {Vector}
 */

Brush.prototype.reynoldsWalk = function(){
  //set a fixed linear velocity
  var futurePos = this.vel.clone();
  futurePos.selfNormalize();
  futurePos.selfMul(1);

  //use the fixedLinearVel to calculate a futurePos
  futurePos.selfAdd(this.pos);

  //add a random vector from a circle
  var rotatingPoint = new Vector(0, 0);
  var radius = 5;
  var theta = Math.random() * Math.PI * 2;
  rotatingPoint.x = radius * Math.cos(theta);
  rotatingPoint.y = radius * Math.sin(theta);

  futurePos.selfAdd(rotatingPoint);

  //turn the futurePos vector into a desiredPos vector
  futurePos.selfSub(this.pos);
  futurePos.selfNormalize();
  futurePos.selfMul(this.maxSpeed);

  //turn the futurePos vector into a steering vector
  futurePos.selfSub(this.vel);
  var maxForceLimit = this.maxForce;
  futurePos.limit(maxForceLimit);
  return futurePos;
};


Brush.prototype.trackMove = function(){
  if(this.vel.x !== this.desiredVelVec.x
      || this.vel.y !== this.desiredVelVec.y){
    this.vel = this.desiredVelVec.clone();
  }
  if(this.trackEnd.x < this.trackStart.x){
    if(this.pos.x < this.trackEnd.x){
      this.pos = this.trackStart.clone();
    }
  }else if(this.trackEnd.x > this.trackStart.x){
    if(this.pos.x > this.trackEnd.x){
      this.pos = this.trackStart.clone();
    }
  }else if(this.trackEnd.y < this.trackStart.y){
    if(this.pos.y < this.trackEnd.y){
      this.pos = this.trackStart.clone();
    }
  }else if(this.trackEnd.y > this.trackStart.y){
    if(this.pos.y > this.trackEnd.y){
      this.pos = this.trackStart.clone();
    }
  }
};

Brush.prototype.applyForce = function(force_, factor){
  if (typeof force_ !== "undefined"){
    var force = force_.clone();
    if (typeof factor === "undefined"){
      factor = 1;
    }
    force.selfMul(factor);
    this.acc.selfAdd(force);
  }

};

Brush.prototype.randomDistModulator = function(high, low){
  if(typeof low === "undefined"){
    low = 0;
  }
  var range = high - low;
  this.dist = Math.random() * range + low;
};

Brush.prototype.speedDistModulator = function(){
  var mod = Math.abs(this.vel.x);
  if(mod > 1 / 20){
    this.dist = 20 * mod;
  }else{
    this.dist = 1;
  }
};

Brush.prototype.update = function(){
  this.life--;
  this.vel.limit(this.maxSpeed);
  this.pos.selfAdd(this.vel);
  this.vel.selfAdd(this.acc);
  this.acc.selfMul(0);

  var angle = Math.atan2(this.vel.y, this.vel.x) + Math.PI / 2;
  this.angle = angle;
  this.dAngle = angle - Math.PI / 2;

  var x0 = Math.cos(angle) * this.dist / 2;
  var y0 = Math.sin(angle) * this.dist / 2;

  if((x0 * x0 / 2) < utils.EPSILON){
    x0 = 0;
  }
  if((y0 * y0 / 2) < utils.EPSILON){
    y0 = 0;
  }
  this.getPixelPositions(this.pos.x + x0, this.pos.y + y0, this.pos.x - x0, this.pos.y - y0);
};

Brush.prototype.getPixelPositions = function(vert1X, vert1Y, vert2X, vert2Y){
  var dx = (vert2X - vert1X) / this.dist;
  var dy = (vert2Y - vert1Y) / this.dist;

  for (var gPi = 0; gPi < Math.floor(this.dist); gPi++){
    this.pixelPositions[gPi] = [vert1X + dx * gPi, vert1Y + dy * gPi];
  }
};

Brush.prototype.getPixelPositionsDepth = function(vert1X, vert1Y, vert2X, vert2Y, num_){
  var brushWidth = Math.floor(this.dist);
  var dx = (vert2X - vert1X) / brushWidth;
  var dy = (vert2Y - vert1Y) / brushWidth;
  var bx = -Math.cos(this.dAngle);
  var by = -Math.sin(this.dAngle);

  for (var depth = 0; depth < num_ * brushWidth; depth += brushWidth){
    for (var gPi = 0; gPi < brushWidth; gPi++){
      this.pixelPositions[gPi + depth] = [vert1X + dx * gPi + bx * depth / brushWidth,
                                        vert1Y + dy * gPi + by * depth / brushWidth];
    }
  }
};

Brush.prototype.posEndlessCanvas = function(){
  if(this.pos.x < -this.dist){
    this.pos.x = width + this.dist;
  }else if(this.pos.x > width + this.dist){
    this.pos.x = -this.dist;
  }
  if(this.pos.y < -this.dist){
    this.pos.y = height + this.dist;

  }else if(this.pos.y > height + this.dist){
    this.pos.y = -this.dist;
  }
};

Brush.prototype.vertsOverEdges = function(){
  var start = this.pixelPositions[0];
  var end = this.pixelPositions[this.pixelPositions.length - 1];
  if(this.changedX === false){
    if(start[0] < 0
        && end[0] < 0){
      this.pos.x = width + Math.abs(this.pos.x);
      this.changedX = true;
      this.clearPixelRGB();
    }else if(start[0] > width
        && end[0] > width){
      this.pos.x = 0 - (this.pos.x - width);
      this.changedX = true;
      this.clearPixelRGB();
    }
  }
  if(this.changedY === false){
    if(start[1] < 0
        && end[1] < 0){
      this.pos.y = height + Math.abs(this.pos.y);
      this.changedY = true;
      this.clearPixelRGB();
    }else if(start[1] > height
        && end[1] > height){
      this.pos.y = 0 - (this.pos.y - height);
      this.changedY = true;
      this.clearPixelRGB();
    }
  }
};

Brush.prototype.vertsBackOnCanvas = function(){
  var start = this.pixelPositions[0];
  var end = this.pixelPositions[this.pixelPositions.length - 1];
  if(this.changedX === true){
    this.clearPixelRGB();
    this.posEndlessCanvas();
    if((start[0] > 0 && start[0] < width)
        || (end[1] > 0 && end[0] < width)){
      this.changedX = false;
    }
  }
  if(this.changedY === true){
    this.clearPixelRGB();
    this.posEndlessCanvas();
    if((start[1] > 0 && start[1] < height)
        || (end[1] > 0 && end[1] < height)){
      this.changedY = false;
    }
  }
};

Brush.prototype.vertsEndlessCanvas = function(){
  this.vertsOverEdges();
  this.vertsBackOnCanvas();
};


Brush.prototype.reset = function(){
  for(var resetPix = 0; resetPix < this.pixelLine.length; resetPix++){
    var pixR = this.pixelLine[resetPix] * 4;
    var pixG = this.pixelLine[resetPix] * 4 + 1;
    var pixB = this.pixelLine[resetPix] * 4 + 2;
    var pixA = this.pixelLine[resetPix] * 4 + 3;
    this.brushSys.iData.data[pixR] = this.originalPixels[pixR];
    this.brushSys.iData.data[pixG] = this.originalPixels[pixG];
    this.brushSys.iData.data[pixB] = this.originalPixels[pixB];
    this.brushSys.iData.data[pixA] = this.originalPixels[pixA];
  }
};

Brush.prototype.clearPixelRGB = function(){
  this.smearing = false;
  this.rgbaValues = [];
};

Brush.prototype.isItSmearing = function(){
  if(this.smearing === true){
    this.smearsRemaining--;
    if(!(this.smearsRemaining)){
      this.smearing = false;
    }
  } else{
    this.smearing = true;
    this.smearsRemaining = this.smearDuration;
  }
};


Brush.prototype.run = function(){
  var f = this.reynoldsWalk();
  this.applyForce(f, .01);

  this.update();
  this.isItSmearing();
  this.posEndlessCanvas();
};
