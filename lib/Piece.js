/**
 * @Isaac Madwed
 */

/*
 * Pieces hold and run managers.
 * You may only add managers to a Piece's
 * manager array.
 * They are a convenience object to help manage
 * different kinds of managers (and their agents)
 * from the top level.
 * You can also access the imgData directly
 * to apply it to multiple canvases.
 */

var Piece = function(){
  this.width= 150;
  this.height= 100;
}

Piece.prototype.init = function(canvas_){
  this.width = width = canvas_.width;
  this.height = height = canvas_.height;
  this.ctx = canvas_.getContext('2d');
  this.imgData = this.ctx.getImageData(0,0,this.width,this.height);
  this.managers = [];
}

Piece.prototype.addManager = function(manager,width_,height_){
  if(!width_) var width_ = this.width;
  if(!height_) var height_ = this.height;

  this.managers.push(manager);
  this.managers[this.managers.length-1].frameOnCanvas(this.imgData.data,width_,height_);
}

Piece.prototype.run = function(){
  this.managers.forEach(function(manager){
    manager.run();
  });
  this.ctx.putImageData(this.imgData,0,0);
}

function getPixel(x_,y_){
  if (x_ < 0 || y_ < 0 || x_ > width || y_ > height){
    return -1;
  }else{
    return (Math.floor(x_) * 4 + width * Math.floor(y_)*4);
  }
}
