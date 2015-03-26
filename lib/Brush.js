/**
 *
 */

PixelBrush = function(x1_,y1_,x2_,y2_,brushSys_,type_){
  this.brushSys = brushSys_;
  if(!type_){
    this.type = "default";
  }else{
    this.type = type_;
  }

  this.rgbaValues = [];

  this.angle = 0; //display angle
  this.dAngle = -Math.PI/2; //angle for depth, perpendicular to display angle

  this.setMaxSpeedAndForce(.9,.05);

  this.pixelPositions = [];
  this.pixelLine = [];
  this.pixelRGB = [];


  //Define the Pixel Brush as a line positioned
  //at (x1,y1), stretching to (x2,y2)

  this.verts = [];
  this.verts[0] = new Vector(x1_,y1_);
  this.verts[1] = new Vector(x2_,y2_);

  var tempDistVec = this.verts[1].newSub(this.verts[0]);
  this.dist = Math.floor(tempDistVec.length());

  this.changedX = false;
  this.changedY = false;

  this.vel = new Vector(0,0);
  var theta = Math.random()*Math.PI*2;
  this.vel.x = this.maxSpeed * Math.cos(theta);
  this.vel.y = this.maxSpeed * Math.sin(theta);

  this.pos = this.verts[0].getAverage(this.verts[1]);
  this.acc = new Vector(0,0);

  this.getPixelPositions();

  this.smearing = false; //true or false pixel is smearing
  this.smearsRemaining = 5; //smears remaining

}

PixelBrush.prototype.resetInit = function(){
  this.originalPixels = this.brushSys.iData.data;
}

PixelBrush.prototype.trackInit = function(xStart_,yStart_,xEnd_,yEnd_){
  if(!this.trackStart || !this.trackEnd){
    this.trackStart = new Vector(xStart_,yStart_);
    this.trackEnd   = new Vector(xEnd_  ,yEnd_  );
    this.pos = this.trackStart.clone();

    this.desiredVelVec = this.trackEnd.newSub(this.trackStart);
    this.desiredVelVec.selfNormalize();
    this.desiredVelVec.selfMul(this.maxSpeed);
    this.vel = this.desiredVelVec.clone();

    this.update();
    this.getPixelPositions();
    this.getPixels();
  }
}

PixelBrush.prototype.setType = function(string_){
  this.type = string_;
}

PixelBrush.prototype.setMaxSpeed = function(num){
  this.maxSpeed = num;
}

PixelBrush.prototype.setMaxForce = function(num){
  this.maxForce = num;
}

PixelBrush.prototype.setMaxSpeedAndForce = function(mxSpd,mxFrc){
  this.setMaxSpeed(mxSpd);
  this.setMaxForce(mxFrc);
}

PixelBrush.prototype.setVert0_XY = function(x_,y_){
  this.verts[0].x = x_;
  this.verts[0].y = y_;
}

PixelBrush.prototype.setVert1_XY = function(x_,y_){
  this.verts[1].x = x_;
  this.verts[1].y = y_;
}

PixelBrush.prototype.setVerts_XY = function(x0_,y0_,x1_,y1_){
  this.setVert0_XY(x0_,y0_);
  this.setVert1_XY(x1_,y1_);
}

PixelBrush.prototype.setVert0_V = function(vec){
  this.verts[0].x = vec.x;
  this.verts[0].y = vec.y;
}

PixelBrush.prototype.setVert1_V = function(vec){
  this.verts[1].x = vec.x;
  this.verts[1].y = vec.y;
}

PixelBrush.prototype.setVerts_V = function(vec0,vec1){
  this.setVert0_V(vec0);
  this.setVert1_V(vec1);
}

PixelBrush.prototype.setDist = function(num){
  this.dist = num;
}


/**
 * @export
 * @return {Vector}
 */

PixelBrush.prototype.reynoldsWalk = function(){
  //set a fixed linear velocity
  var futurePos = this.vel.clone();
  futurePos.selfNormalize();
  futurePos.selfMul(1);

  //use the fixedLinearVel to calculate a futurePos
  futurePos.selfAdd(this.pos);

  //add a random vector from a circle
  var rotatingPoint = new Vector(0,0);
  var radius = 5;
  var theta = Math.random() * Math.PI*2;
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
}


PixelBrush.prototype.trackMove = function(){
  if(this.vel.x != this.desiredVelVec.x
      || this.vel.y != this.desiredVelVec.y){
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
}

PixelBrush.prototype.applyForce = function(force_,factor){
  if (typeof force_ != "undefined"){
    var force = force_.clone();
    if (typeof factor == "undefined"){
      factor = 1;
    }
    force.selfMul(factor);
    this.acc.selfAdd(force);
  }

}

PixelBrush.prototype.randomDistModulator = function(high,low){
  if(typeof low === "undefined"){
    low = 0;
  }
  var range = high - low;
  this.dist = Math.random()*range + low;
}

PixelBrush.prototype.speedDistModulator = function(){
  var mod = Math.abs(this.vel.x);
  if(mod > 1/20){
    this.dist = 20*mod;
  }else{
    this.dist = 1;
  }
}

PixelBrush.prototype.update = function(){
  this.vel.limit(this.maxSpeed);
  this.pos.selfAdd(this.vel);
  this.vel.selfAdd(this.acc);
  this.acc.selfMul(0);

  var a = Math.atan2(this.vel.y,this.vel.x)+Math.PI/2;
  this.angle = a;
  this.dAngle = a - Math.PI/2;

  var x0 = Math.cos(this.angle) * this.dist / 2;
  var y0 = Math.sin(this.angle) * this.dist / 2;

  if((x0 * x0 / 2) < EPSILON){
    x0 = 0;
  }
  if((y0 * y0 / 2) < EPSILON){
    y0 = 0;
  }

  this.setVerts_XY(this.pos.x + x0, this.pos.y + y0,
      this.pos.x - x0, this.pos.y - y0);
}

PixelBrush.prototype.clearPixelPositions = function(){
  this.pixelPositions = [];
}

PixelBrush.prototype.getPixelPositions = function(){
  var dx = (this.verts[1].x - this.verts[0].x)/this.dist;
  var dy = (this.verts[1].y - this.verts[0].y)/this.dist;

  for (var gPi=0;gPi<Math.floor(this.dist);gPi++){
    this.pixelPositions[gPi] = [this.verts[0].x+dx*gPi,this.verts[0].y+dy*gPi];
  }
}

PixelBrush.prototype.getPixelPositionsDepth = function(num_){
  var dx = (this.verts[1].x - this.verts[0].x)/this.dist;
  var dy = (this.verts[1].y - this.verts[0].y)/this.dist;
  var bx = -Math.cos(this.dAngle);
  var by = -Math.sin(this.dAngle);

  for (var depth=0;depth<num_*this.dist;depth+=this.dist){
    for (var gPi=0;gPi<Math.floor(this.dist);gPi++){
      this.pixelPositions[gPi+depth] = [this.verts[0].x+dx*gPi+bx*depth/Math.floor(this.dist),
                                        this.verts[0].y+dy*gPi+by*depth/Math.floor(this.dist)];
    }
  }

}


PixelBrush.prototype.getPixelsNoGap = function(verts_){
  var dx = (this.verts[1].x - this.verts[0].x)/this.dist;
  var dy = (this.verts[1].y - this.verts[0].y)/this.dist;
  var xSign = sign(dx);
  var ySign = sign(dy);
  var lineIndex = 1;

  if(Math.abs(dx)>Math.abs(dy)){
    this.pixelLine[0] = getPixel(this.pixelPositions[0][0],this.pixelPositions[0][1]);
    for (var gPi=1;gPi<this.pixelPositions.length;gPi++){
      if(Math.floor(this.pixelPositions[gPi-1][1]) > Math.floor(this.pixelPositions[gPi][1])
          || Math.floor(this.pixelPositions[gPi-1][1]) < Math.floor(this.pixelPositions[gPi][1])){
        this.pixelLine[lineIndex] = getPixel(this.pixelPositions[gPi][0],this.pixelPositions[gPi-1][1]);
        lineIndex++;
      }
      this.pixelLine[lineIndex] = getPixel(this.pixelPositions[gPi][0],this.pixelPositions[gPi][1]);
      lineIndex++;
    }
  }else{
    this.pixelLine[0] = getPixel(this.pixelPositions[0][0],this.pixelPositions[0][1]);
    for (var gPi=1;gPi<this.pixelPositions.length;gPi++){
      if(Math.floor(this.pixelPositions[gPi-1][0]) > Math.floor(this.pixelPositions[gPi][0])
          || Math.floor(this.pixelPositions[gPi-1][0]) < Math.floor(this.pixelPositions[gPi][0])){
        this.pixelLine[lineIndex] = getPixel(this.pixelPositions[gPi-1][0],this.pixelPositions[gPi][1]);
        lineIndex++;
      }
      this.pixelLine[lineIndex] = getPixel(this.pixelPositions[gPi][0],this.pixelPositions[gPi][1]);
      lineIndex++;
    }
  }

}


PixelBrush.prototype.getPixelRGBFromCenter = function(){
  var centerPixel = Math.ceil(this.dist/2);
  if(this.pixelLine[centerPixel] === -1){
    for(var pixInLine = 0; pixInLine < this.pixelLine.length; pixInLine++){
      this.pixelRGB[pixInLine*4  ] = 0;
      this.pixelRGB[pixInLine*4+1] = 0;
      this.pixelRGB[pixInLine*4+2] = 0;
      this.pixelRGB[pixInLine*4+3] = 0;
    }
  }else{
    var r = this.brushSys.iData.data[this.pixelLine[centerPixel]*4  ];
    var g = this.brushSys.iData.data[this.pixelLine[centerPixel]*4+1];
    var b = this.brushSys.iData.data[this.pixelLine[centerPixel]*4+2];
    var a = this.brushSys.iData.data[this.pixelLine[centerPixel]*4+3];
    for(var pixInLine = 0; pixInLine < this.pixelLine.length; pixInLine++){
      this.pixelRGB[pixInLine*4  ] = r;
      this.pixelRGB[pixInLine*4+1] = g;
      this.pixelRGB[pixInLine*4+2] = b;
      this.pixelRGB[pixInLine*4+3] = a;
    }
  }
}

PixelBrush.prototype.getPixelRGBFromSinglePixel = function(singlePixel){
  var centerPixel = Math.ceil(this.dist/2);
  if(this.pixelLine[singlePixel] === -1){
    for(var pixInLine = 0; pixInLine < this.pixelLine.length; pixInLine++){
      this.pixelRGB[pixInLine*4  ] = 0;
      this.pixelRGB[pixInLine*4+1] = 0;
      this.pixelRGB[pixInLine*4+2] = 0;
      this.pixelRGB[pixInLine*4+3] = 0;
    }
  }else{
    var r = this.brushSys.iData.data[this.pixelLine[singlePixel]*4  ];
    var g = this.brushSys.iData.data[this.pixelLine[singlePixel]*4+1];
    var b = this.brushSys.iData.data[this.pixelLine[singlePixel]*4+2];
    var a = this.brushSys.iData.data[this.pixelLine[singlePixel]*4+3];
    for(var pixInLine = 0; pixInLine < this.pixelLine.length; pixInLine++){
      this.pixelRGB[pixInLine*4  ] = r;
      this.pixelRGB[pixInLine*4+1] = g;
      this.pixelRGB[pixInLine*4+2] = b;
      this.pixelRGB[pixInLine*4+3] = a;
    }
  }
}

PixelBrush.prototype.putPixelRGB = function(pixInLine){
  if(this.pixelLine[pixInLine] === -1){
    return;
  }else if (this.pixelRGB[pixInLine*4+3] === 0){
    return;
  }else{
    this.brushSys.iData.data[this.pixelLine[pixInLine]*4  ] = this.pixelRGB[pixInLine*4  ];
    this.brushSys.iData.data[this.pixelLine[pixInLine]*4+1] = this.pixelRGB[pixInLine*4+1];
    this.brushSys.iData.data[this.pixelLine[pixInLine]*4+2] = this.pixelRGB[pixInLine*4+2];
    this.brushSys.iData.data[this.pixelLine[pixInLine]*4+3] = this.pixelRGB[pixInLine*4+3];
  }
}

PixelBrush.prototype.putPixelRGBFromCenter = function(){
  var centerPixel = Math.ceil(this.dist/2);
  if(this.pixelLine[centerPixel] === -1){
    return;
  }else if (this.pixelRGB[centerPixel*4+3] === 0){
    return;
  }else{
    var r = this.pixelRGB[centerPixel*4  ];
    var g = this.pixelRGB[centerPixel*4+1];
    var b = this.pixelRGB[centerPixel*4+2];
    var a = this.pixelRGB[centerPixel*4+3];
    for(var pixInLine = 0; pixInLine < this.pixelLine.length; pixInLine++){
      this.brushSys.iData.data[this.pixelLine[pixInLine]*4  ] = r;
      this.brushSys.iData.data[this.pixelLine[pixInLine]*4+1] = g;
      this.brushSys.iData.data[this.pixelLine[pixInLine]*4+2] = b;
      this.brushSys.iData.data[this.pixelLine[pixInLine]*4+3] = a;
    }
  }
}

PixelBrush.prototype.putPixelRGBFromSinglePixel = function(singlePixel){
  if(this.pixelLine[singlePixel] === -1){
    return;
  }else if (this.pixelRGB[singlePixel*4+3] === 0){
    return;
  }else{
    var r = this.brushSys.iData.data[this.pixelLine[singlePixel]*4  ];
    var g = this.brushSys.iData.data[this.pixelLine[singlePixel]*4+1];
    var b = this.brushSys.iData.data[this.pixelLine[singlePixel]*4+2];
    var a = this.brushSys.iData.data[this.pixelLine[singlePixel]*4+3];
    for(var pixInLine = 0; pixInLine < this.pixelLine.length; pixInLine++){
      this.brushSys.iData.data[this.pixelLine[pixInLine]*4  ] = r;
      this.brushSys.iData.data[this.pixelLine[pixInLine]*4+1] = g;
      this.brushSys.iData.data[this.pixelLine[pixInLine]*4+2] = b;
      this.brushSys.iData.data[this.pixelLine[pixInLine]*4+3] = a;
    }
  }
}

PixelBrush.prototype.putPixelRGBRGB = function(r_,g_,b_,a_){
  for(var pixInLine = 0; pixInLine < this.pixelLine.length; pixInLine++){
    this.brushSys.iData.data[this.pixelLine[pixInLine]*4  ] = r_;
    this.brushSys.iData.data[this.pixelLine[pixInLine]*4+1] = g_;
    this.brushSys.iData.data[this.pixelLine[pixInLine]*4+2] = b_;
    this.brushSys.iData.data[this.pixelLine[pixInLine]*4+3] = a_;
  }
}

PixelBrush.prototype.putPixelRGBfromRGBArray = function(rgbArray){
  var rgbEntryCount = rgbArray.length/4;
  for(var pixInLine = 0; pixInLine < this.pixelLine.length; pixInLine++){
    var rgbEntry = pixInLine%rgbEntryCount;
    this.brushSys.iData.data[this.pixelLine[pixInLine]*4  ] = rgbArray[rgbEntry*4  ];
    this.brushSys.iData.data[this.pixelLine[pixInLine]*4+1] = rgbArray[rgbEntry*4+1];
    this.brushSys.iData.data[this.pixelLine[pixInLine]*4+2] = rgbArray[rgbEntry*4+2];
    this.brushSys.iData.data[this.pixelLine[pixInLine]*4+3] = rgbArray[rgbEntry*4+3];
  }
}

PixelBrush.prototype.setPixelRGB = function(pixInLine,r_,g_,b_,a_){
  this.pixelRGB[pixInLine*4  ] = r_;
  this.pixelRGB[pixInLine*4+1] = g_;
  this.pixelRGB[pixInLine*4+2] = b_;
  this.pixelRGB[pixInLine*4+3] = a_;
}

PixelBrush.prototype.setPixelLineRGB = function(r_,g_,b_,a_){
  var pixRGB = this.pixelRGB;
  for(var i = this.pixelLine.length; i; i--){
    pixRGB[i*4  ] = r_;
    pixRGB[i*4+1] = g_;
    pixRGB[i*4+2] = b_;
    pixRGB[i*4+3] = a_;
  }
}





PixelBrush.prototype.posEndlessCanvas = function(){
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
}

PixelBrush.prototype.vertsOverEdges = function(){
  if(this.changedX === false){
    if(this.verts[0].x < 0
        && this.verts[1].x < 0){
      this.pos.x = width + Math.abs(this.pos.x);
      this.changedX = true;
      this.clearPixelRGB();
    }else if(this.verts[0].x > width
        && this.verts[1].x > width){
      this.pos.x = 0 - (this.pos.x - width);
      this.changedX = true;
      this.clearPixelRGB();
    }
  }
  if(this.changedY === false){
    if(this.verts[0].y < 0
        && this.verts[1].y < 0){
      this.pos.y = height + Math.abs(this.pos.y);
      this.changedY = true;
      this.clearPixelRGB();
    }else if(this.verts[0].y > height
        && this.verts[1].y > height){
      this.pos.y = 0 - (this.pos.y - height);
      this.changedY = true;
      this.clearPixelRGB();
    }
  }
}

PixelBrush.prototype.vertsBackOnCanvas = function(){
  if(this.changedX === true){
    this.posEndlessCanvas();
    if((this.verts[0].x > 0 && this.verts[0].x < width)
        || (this.verts[1].x > 0 && this.verts[1].x < width)){
      this.changedX = false;
    }
  }
  if(this.changedY === true){
    this.posEndlessCanvas();
    if((this.verts[0].y > 0 && this.verts[0].y < height)
        || (this.verts[1].y > 0 && this.verts[1].y < height)){
      this.changedY = false;
    }
  }
}

PixelBrush.prototype.vertsEndlessCanvas = function(){
  this.vertsOverEdges();
  this.vertsBackOnCanvas();
}

PixelBrush.prototype.pixelOperations = function(){
  this.update();
  this.clearPixelPositions();
  this.getPixelPositions();
}

PixelBrush.prototype.randomColor = function(range){
  for (var grPi=0;grPi<this.pixelLine.length;grPi++){
    if(this.pixelLine[grPi]>=0){
      this.brushSys.iData.data[this.pixelLine[grPi]*4    ] = 150;
      this.brushSys.iData.data[this.pixelLine[grPi]*4 + 1] = Math.floor(Math.random() * range)/2;
      this.brushSys.iData.data[this.pixelLine[grPi]*4 + 2] = Math.floor(Math.random() * range);
      this.brushSys.iData.data[this.pixelLine[grPi]*4 + 3] = 255;
    }
  }
}


PixelBrush.prototype.reset = function(){
  for(var resetPix=0;resetPix<this.pixelLine.length;resetPix++){
    var pixR = this.pixelLine[resetPix]*4;
    var pixG = this.pixelLine[resetPix]*4+1;
    var pixB = this.pixelLine[resetPix]*4+2;
    var pixA = this.pixelLine[resetPix]*4+3;
    this.brushSys.iData.data[pixR] = this.originalPixels[pixR];
    this.brushSys.iData.data[pixG] = this.originalPixels[pixG];
    this.brushSys.iData.data[pixB] = this.originalPixels[pixB];
    this.brushSys.iData.data[pixA] = this.originalPixels[pixA];
  }
}

PixelBrush.prototype.clearPixelRGB = function(){
  this.smearing = false;
  this.setPixelRGB(0,0,0,0);
}

PixelBrush.prototype.isItSmearing = function(){
  if(this.smearing == true){
    this.smearsRemaining--;
    if(!(this.smearsRemaining))
    	this.smearing = false;
  } else{
    this.smearing = true;
    this.smearsRemaining = 5;
  }
}


PixelBrush.prototype.smearAgainstLight = function(){
  for (var pix=0;pix<this.pixelLine.length;pix++){
    if(this.smearingArray[pix]){
      if((this.brushSys.iData.data[this.pixelLine[pix]*4    ] >= this.pixelRGB[pix*4  ])
          || (this.brushSys.iData.data[this.pixelLine[pix]*4+1] >= this.pixelRGB[pix*4+1])
          || (this.brushSys.iData.data[this.pixelLine[pix]*4+2] >= this.pixelRGB[pix*4+2])
          || (this.brushSys.iData.data[this.pixelLine[pix]*4+3] === 0))
      {
        this.putPixelRGB(pix);
      }

      this.smearCount[pix]--;
      if(this.smearCount[pix]==0){
        this.smearingArray[pix] = false;
      }
    }

  }
}

PixelBrush.prototype.smearLightOrDark = function(){
  var vPosOrNeg = Math.random() - .5;
  if(vPosOrNeg >= 0){
    this.smearAgainstDark();
  }else{
    this.smearAgainstLight();
  }
}

PixelBrush.prototype.blend = function(){
  for (var pix=0;pix<this.pixelLine.length;pix++){
    if(this.smearingArray[pix]){

      //Red pixel
      var pixRVal = this.pixelLine[pix]*4;
      this.brushSys.iData.data[pixRVal] = Math.floor(
            (this.brushSys.iData.data[pixRVal]
            + this.pixelRGB[pix*4  ])
            / 2);

      //Green pixel
      var pixGVal = this.pixelLine[pix]*4+1;
      this.brushSys.iData.data[pixGVal] = Math.floor(
            (this.brushSys.iData.data[pixGVal]
            + this.pixelRGB[pix*4 + 1])
            / 2);

      //Blue pixel
      var pixBVal = this.pixelLine[pix]*4+2;
      this.brushSys.iData.data[pixBVal] = Math.floor(
          (this.brushSys.iData.data[pixBVal]
          + this.pixelRGB[pix*4 + 2])
          / 2);

      this.smearCount[pix]--;
      if(this.smearCount[pix]==0){
        this.smearingArray[pix] = false;
      }
    }

  }
}
//Blend black or white from clear
PixelBrush.prototype.blendBlackOrWhite = function(){
  if(this.vel.x > this.vel.y){
    for (var pix=0;pix<this.pixelLine.length;pix++){
      if(this.smearingArray[pix]){

        //Red pixel
        var pixRVal = this.pixelLine[pix]*4;
        this.brushSys.iData.data[pixRVal] = Math.floor(
              (this.brushSys.iData.data[pixRVal]
              *2.1	)
              / 2);

        //Green pixel
        var pixGVal = this.pixelLine[pix]*4+1;
        this.brushSys.iData.data[pixGVal] = Math.floor(
              (this.brushSys.iData.data[pixGVal]
              * 2.1)
              / 2);

        //Blue pixel
        var pixBVal = this.pixelLine[pix]*4+2;
        this.brushSys.iData.data[pixBVal] = Math.floor(
            (this.brushSys.iData.data[pixBVal]
            *2.1)
            / 2);

        this.smearCount[pix]--;
        if(this.smearCount[pix]==0){
          this.smearingArray[pix] = false;
        }
      }
    }

  }else{
    for (var pix=0;pix<this.pixelLine.length;pix++){
      if(this.smearingArray[pix]){

        //Red pixel
        var pixRVal = this.pixelLine[pix]*4;
        this.brushSys.iData.data[pixRVal] = Math.floor(
            (this.brushSys.iData.data[pixRVal]
            *1.9)
            / 2);

        //Green pixel
        var pixGVal = this.pixelLine[pix]*4+1;
        this.brushSys.iData.data[pixGVal] = Math.floor(
            (this.brushSys.iData.data[pixGVal]
            *1/9)
            / 2);

        //Blue pixel
        var pixBVal = this.pixelLine[pix]*4+2;
        this.brushSys.iData.data[pixBVal] = Math.floor(
            (this.brushSys.iData.data[pixBVal]
            *1.9)
            / 2);

        this.smearCount[pix]--;
        if(this.smearCount[pix]==0){
          this.smearingArray[pix] = false;
        }
      }
    }
  }
}

PixelBrush.prototype.blendOrSmear = function(num_){
  if(num_){
    var vPosOrNeg = num_;
  }else{
    var vPosOrNeg = Math.random() - .5;
  }
  if(vPosOrNeg >= .75){
    this.smear();
  }else{
    this.blend();
  }
}

PixelBrush.prototype.blendOrSmearLightOrDark = function(){
  var vPosOrNeg = Math.random() - .5;
  if(vPosOrNeg >= 0){
    this.blend();
  }else{
    this.smearLightOrDark(vPosOrNeg);
  }
}

PixelBrush.prototype.run = function(){
  this.randomColor(255);
  var f = this.reynoldsWalk();
  this.applyForce(f,.02);

  this.pixelOperations();
  //this.randomDistModulator(100,40);


  this.vertsEndlessCanvas();
}

PixelBrush.prototype.runManager = function(){
  this.brushSys.runMethods[this.type](this);
}
