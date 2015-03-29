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

Piece.prototype.uiAddBrush = function(action,what,x,y){
  var type = undefined;
  if(action == "smear"){
    switch (what){
      case "opaque":
        type = function(marks,self){self.smearOpaque(marks,self);};
        break;
      case "antiTransparent":
        type = function(marks,self){self.smearAntiTransparent(marks,self);};
        break;
      case "awayLight":
        type = function(marks,self){self.smearAwayLight(marks,self);};
        break;
      case "awayLight":
        type = function(marks,self){self.smearAwayLight(marks,self);};
        break;
      case "awayDark":
        type = function(marks,self){self.smearAwayDark(marks,self);};
        break;
      default:
        type = function(marks,self){self.smearAll(marks,self);};
    }
  }else if(action == "blend"){
    switch (what){
      case "b/w":
        type = function(marks,self){self.blendBlackOrWhite(marks,self);};
        break;
      default:
        type = function(marks,self){self.blend(marks,self);};
    }
  }

  var exists = undefined;
  var managers = this.managers;
  for(var index = 0; index < managers.length; index++){
    if(managers[index].type == type){
      exists = index;
      break;
    }
  }
  if(exists){

  }
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
