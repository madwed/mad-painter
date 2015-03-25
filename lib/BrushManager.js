/**
 *
 */

var BrushManager = function(){
  this.brushes = [];
  this.runMethods = {};
  this.runMethods["default"] = function(brush_){brush_.run()};

}


//This function frames the portion of the Piece by which
//the BrushManager is bounded. It also points the BrushManager
//to the Piece's imgData.
BrushManager.prototype.frameOnCanvas = function(imgData_,width_,height_){
  this.iData = imgData_;
  this.width = width_;
  this.height = height_;
}

BrushManager.prototype.addBrush = function(brush_){
  this.brushes.push(brush_);
}

BrushManager.prototype.addRunMethod = function(type_,func_){
  this.runMethods[type_] = func_;
}

BrushManager.prototype.run = function(){
  for(var i=0; i<this.brushes.length;i++){

    this.brushes[i].runManager();

  }
  this.applyBrushes();

}

//Get a Brush's iData pixel values from the Brush's pixels' coordinates
BrushManager.prototype.getBrushPixels = function(brush_){
  var pixels = [];
  var bristlePositions = brush_.pixelPositions;
  for(var i = 0; i < bristlePositions.length; i++){
    pixels[i] = getPixel(bristlePositions[i][0],bristlePositions[i][1]);
  }
  return pixels;
}

BrushManager.prototype.giveBrushRGBAValues = function(brush_){

}

//Apply rgba values to pixels in this.iData
BrushManager.prototype.applyRGBAtoPixels = function(pixels_,rgbaValues_){
  var rgbaEntries = rgbaValues_.length;
  var data = this.iData
  for(var index = 0; index < pixels_.length; index++){
    var rgbaIndex = index % (rgbaEntries/4);
    var pixel = pixels_[index];
    data[pixel  ] = rgbaValues_[rgbaIndex*4  ];
    data[pixel+1] = rgbaValues_[rgbaIndex*4+1];
    data[pixel+2] = rgbaValues_[rgbaIndex*4+2];
    data[pixel+3] = rgbaValues_[rgbaIndex*4+3];
  }
}

//Run through the brushes to apply them to this.iData
BrushManager.prototype.applyBrushes = function(){
  for(var i = this.brushes.length; i--;){
    var brush = this.brushes[i];
    this.applyRGBAtoPixels(this.getBrushPixels(brush),brush.rgbaValues);
  }
}
