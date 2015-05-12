var utils = require("./mathLib");

function Vector(x_, y_){
  this.x = x_;
  this.y = y_;
  return this;
}

module.exports = Vector;

Vector.prototype.selfAdd = function(vec){
  this.x += vec.x;
  this.y += vec.y;
  return this;
}

Vector.prototype.selfAddXY = function(x_, y_){
  this.x += x_;
  this.y += y_;
  return this;
}

Vector.prototype.newAdd = function(vec){
  var tempVec = new Vector(this.x + vec.x, this.y + vec.y);
  return tempVec;
}

Vector.prototype.newAddXY = function(x_, y_){
  var tempVec = new Vector(this.x + x_, this.y + y_);
  return tempVec;
}

Vector.prototype.selfSub = function(vec){
  this.x -= vec.x;
  this.y -= vec.y;
  return this;
}

Vector.prototype.selfSubXY = function(x_, y_){
  this.x -= x_;
  this.y -= y_;
  return this;
}

Vector.prototype.newSub = function(vec){
  var tempVec = new Vector(0, 0);
  tempVec.x = this.x - vec.x;
  tempVec.y = this.y - vec.y;
  return tempVec;
}

Vector.prototype.newSubXY = function(x_, y_){
  var tempVec = new Vector(this.x - x_, this.y - y_);
  return tempVec;
}

Vector.prototype.selfMul = function(num){
  this.x *= num;
  this.y *= num;
  return this;
}

Vector.prototype.selfNormalize = function(){
  var length = this.length();
  if(length >= utils.EPSILON){
    var inv_length = 1.0 / length;
        this.x *= inv_length;
        this.y *= inv_length;
  }
  return length;
}

Vector.prototype.limit = function(limit_){
  var length = this.length();
  if (length > limit_){
    //Normalize()
    if (length >= utils.EPSILON)
      {
              var inv_length = 1.0 / length;
              this.x *= inv_length;
              this.y *= inv_length;
      }
    //SelfMul()
    this.x *= limit_;
    this.y *= limit_;

    return this;
  } else{
    return this;
  }

}

Vector.prototype.getAverage = function(vec){
  var tempVec = new Vector(this.x + vec.x, this.y + vec.y);
  tempVec.selfMul(0.5);
  return tempVec;
}

Vector.prototype.lengthSqrd = function(){
  return ((this.x * this.x) + (this.y * this.y));
}

Vector.prototype.length = function(){
  return Math.sqrt((this.x * this.x) + (this.y * this.y));
}

Vector.prototype.clone = function(){
  return new Vector(this.x, this.y);
}