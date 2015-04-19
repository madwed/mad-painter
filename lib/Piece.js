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

Piece = function(){
  this.width= 150;
  this.height= 100;
  this.x = 0;
  this.y = 0;
  this.addingBrush = false;
}

Piece.prototype.init = function(canvas_,uiCanvas_,actions,randoms){
  this.canvas = canvas_, this.uiCanvas = uiCanvas_;
  this.actions = actions, this.randoms = randoms;
  this.width = width = canvas_.width;
  this.height = height = canvas_.height;
  this.ctx = canvas_.getContext('2d');
  this.uictx = uiCanvas_.getContext('2d');
  this.imgData = this.ctx.getImageData(0,0,this.width,this.height);
  this.managers = [];
}

Piece.prototype.addManager = function(manager,width_,height_){
  var width_ = width || this.width;
  var height_ = height_ || this.height;

  this.managers.push(manager);
  this.managers[this.managers.length-1].frameOnCanvas(this.imgData.data,width_,height_);
}

Piece.prototype.uiAddBrush = function(action,what,x,y,vel,random){
  var type = undefined;
  var name = "";
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
      case "awayDark":
        type = function(marks,self){self.smearAwayDark(marks,self);};
        break;
      default:
        type = function(marks,self){self.smearAll(marks,self);};
        what = "all";
    }
    name = action + "_" + what;
  }else if(action == "blend"){
    switch (what){
      case "b/w":
        type = function(marks,self){self.blendBlackOrWhite(marks,self);};
        name = "blendBW";
        break;
      default:
        type = function(marks,self){self.blend(marks,self);};
        name = "blendDefault";
    }
  }

  var exists = undefined;
  var managers = this.managers;

  for(var index = 0; index < managers.length; index++){
    if(managers[index].name == name){
      exists = index;
      break;
    }
  }
  var manager;
  if(typeof exists == "number"){
    manager = managers[exists];
  }else{
    this.addManager(new BrushManager(type,name));
    manager = managers[this.managers.length-1];
  }
  var size = $('#size').slider('value');
  manager.addBrush(new Brush(x-size/2,y,x+size/2,y,vel,$('#life').slider('value'),$('#smear').slider('value')));
  var newBrush = manager.brushes[manager.brushes.length-1];
  newBrush.setMaxSpeedAndForce(.5,.01);
  newBrush.rgbaValues = [$('#red').slider('value'),$('#green').slider('value'),$('#blue').slider('value'),$('#alpha').slider('value')];
}

Piece.prototype.clickInterface = function(){
  var self = this;
  var uiCanvas = this.uiCanvas;
  uiCanvas.onclick = function(event){
    var dot, eventDoc, doc, body, pageX, pageY;

    event = event || window.event; // IE-ism

    // If pageX/Y aren't available and clientX/Y are,
    // calculate pageX/Y - logic taken from jQuery.
    // (This is to support old IE)
    if (event.pageX == null && event.clientX != null) {
        eventDoc = (event.target && event.target.ownerDocument) || document;
        doc = eventDoc.documentElement;
        body = eventDoc.body;

        event.pageX = event.clientX +
          (doc && doc.scrollLeft || body && body.scrollLeft || 0) -
          (doc && doc.clientLeft || body && body.clientLeft || 0);
        event.pageY = event.clientY +
          (doc && doc.scrollTop  || body && body.scrollTop  || 0) -
          (doc && doc.clientTop  || body && body.clientTop  || 0 );
    }
    var rect = self.canvas.getBoundingClientRect(), root = document.documentElement;
    var x = Math.round((event.pageX - rect.left)/(rect.right-rect.left)*uiCanvas.width);
    var y = Math.round((event.pageY - rect.top) /(rect.bottom-rect.top)*uiCanvas.height);
    if(!self.addingBrush){
      self.x = x;
      self.y = y;
      self.addingBrush = true;
    }else{
      self.uictx.clearRect(0,0,self.uiCanvas.width,self.uiCanvas.height);
      self.addingBrush = false;
      var vel = new Vector(x-self.x,y-self.y);
      var method = ["smear","default"];
      var random = "no";
      var actions = self.actions;
      var randoms = self.randoms;
      for(var action=0; action < actions.length; action++){
        if(actions[action].checked){
          method = actions[action].value.split(" ");
          break;
        }
      }
      for(var rIndex=0; rIndex < randoms.length; rIndex++){
        if(randoms[rIndex].checked){
          random = randoms[rIndex].value;
          break;
        }
      }
      self.uiAddBrush(method[0],method[1],self.x,self.y,vel,random);  
    }
  }
  uiCanvas.onmousemove = function(event) {
    var dot, eventDoc, doc, body, pageX, pageY;

    event = event || window.event; // IE-ism

    // If pageX/Y aren't available and clientX/Y are,
    // calculate pageX/Y - logic taken from jQuery.
    // (This is to support old IE)
    if (event.pageX == null && event.clientX != null) {
        eventDoc = (event.target && event.target.ownerDocument) || document;
        doc = eventDoc.documentElement;
        body = eventDoc.body;

        event.pageX = event.clientX +
          (doc && doc.scrollLeft || body && body.scrollLeft || 0) -
          (doc && doc.clientLeft || body && body.clientLeft || 0);
        event.pageY = event.clientY +
          (doc && doc.scrollTop  || body && body.scrollTop  || 0) -
          (doc && doc.clientTop  || body && body.clientTop  || 0 );
    }

        // Use event.pageX / event.pageY here
    var rect = self.canvas.getBoundingClientRect(), root = document.documentElement;
    self.mx = (event.pageX - rect.left)/(rect.right-rect.left)*uiCanvas.width;
    self.my = (event.pageY - rect.top) /(rect.bottom-rect.top)*uiCanvas.height;
  }

  if(self.addingBrush){
      var ctx = self.uictx;
      ctx.clearRect(0,0,self.uiCanvas.width,self.uiCanvas.height);
      ctx.beginPath();
      ctx.strokeStyle = 'gray';
      ctx.lineWidth = 1;
      ctx.moveTo(this.x,this.y);
      ctx.lineTo(this.mx,this.my);
      ctx.stroke();
  }
}


Piece.prototype.run = function(){
  this.managers.forEach(function(manager){
    manager.run();
  });
  this.ctx.putImageData(this.imgData,0,0);
  this.clickInterface();
}

function getPixel(x_,y_){
  if (x_ < 0 || y_ < 0 || x_ > width || y_ > height){
    return undefined;
  }else{
    return (Math.floor(x_) * 4 + width * Math.floor(y_)*4);
  }
}

function randomizeColorsDown(rgba){
  var r = Math.random() * rgba[0]; 
  var g = Math.random() * rgba[1]; 
  var b = Math.random() * rgba[2]; 
  var a = Math.random() * rgba[3];
  return [r,g,b,a];   
}

function randomizeColorsUp(rgba){
  var r = Math.random() * (255 - rgba[0]) + rgba[0]; 
  var g = Math.random() * (255 - rgba[1]) + rgba[1]; 
  var b = Math.random() * (255 - rgba[2]) + rgba[2]; 
  var a = Math.random() * (255 - rgba[3]) + rgba[3];
  return [r,g,b,a];
}