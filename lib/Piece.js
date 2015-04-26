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
var Brush = require('./Brush');
var BrushManager = require('./BrushManager');
var DryBrush = require('./DryBrush');
var Vector = require('./Vector');

module.exports = Piece;

function Piece(){
  this.width= 150;
  this.height= 100;
  this.x = 0;
  this.y = 0;
  this.addingBrush = false;
}

Piece.prototype.init = function(canvas_){
  this.canvas = canvas_;
  this.width = width = canvas_.width;
  this.height = height = canvas_.height;
  this.ctx = canvas_.getContext('2d');
  this.imgData = this.ctx.getImageData(0,0,this.width,this.height);
  this.managers = [];
}

Piece.prototype.initUI = function(actions,randoms){
  this.actions = actions, this.randoms = randoms;
  //Add uiCanvas, clicking canvas
  var canvasBox = this.canvas.parentNode;
  var uiCanvas = document.createElement('CANVAS');
  uiCanvas.id = 'uiCanvas';
  uiCanvas.className = 'canvas';
  uiCanvas.width = this.width;
  uiCanvas.height = this.height;
  this.uiCanvas = canvasBox.appendChild(uiCanvas);
  this.uictx = this.uiCanvas.getContext('2d');
  //Adding UI buttons
  var container = canvasBox.parentNode;
  var buttons = document.createElement('DIV'); buttons.id = 'buttons';
  
  //Color Selector
  var swatch = document.createElement('DIV'); swatch.id = 'swatch';
  swatch.className = 'ui-widget-content ui-corner-all';
  buttons.appendChild(swatch);
  var colors = document.createElement('DIV'); colors.id = 'colors';
  var red = document.createElement('DIV'); var green = document.createElement('DIV'); var blue = document.createElement('DIV'); var alpha = document.createElement('DIV');
  red.id = 'red'; green.id = 'green'; blue.id = 'blue'; alpha.id = 'alpha';
  colors.appendChild(red); colors.appendChild(green); colors.appendChild(blue); colors.appendChild(alpha);
  buttons.appendChild(colors);
  //Randomness Selector
  var rand = document.createElement('DIV'); rand.id = 'rand';
  var randUnder = document.createElement('P');
  var randOver = document.createElement('P');
  var randOff = document.createElement('P');
  randUnder.className = 'title'; randOver.className = 'title'; randOff.className = 'title';
  randUnder.textContent = "randomize under color values <input name='random' value='down' type='radio'>";
  randOver.textContent = "randomize over color values <input name='random' value='up' type='radio'>";
  randOff.textContent = "don't randomize <input name='random' value='no' type='radio' checked='checked'>";
  rand.appendChild(randUnder); rand.appendChild(randOver); rand.appendChild(randOff);
  buttons.appendChild(rand);
  //Brush Properties
  var brush = document.createElement('DIV'); brush.id = 'brush';
  var brushProperties = document.createElement('DIV'); brushProperties.id = 'brushProperties';
  //Brush Props
  var brushProps = document.createElement('DIV'); brushProps.id = 'brushProps';
  var strokeLength = document.createElement('P'); strokeLength.className = 'title'; strokeLength.textContent = 'stroke length';
  var life = document.createElement('P'); life.id = 'life';
  var smearLength = document.createElement('P'); smearLength.className = 'title'; smearLength.textContent = 'smear length';
  var smear = document.createElement('P'); smear.id = 'smear';
  var brushWidth = document.createElement('P'); brushWidth.className = 'title'; brushWidth.textContent = 'brush width';
  var size = document.createElement('P');  size.id = 'size';
  brushProps.appendChild(strokeLength); brushProps.appendChild(life); brushProps.appendChild(smearLength); 
  brushProps.appendChild(smear); brushProps.appendChild(brushWidth); brushProps.appendChild(size);
  brushProperties.appendChild(brushProps);
  //Brush Spins
  var brushSpins = document.createElement('DIV'); brushSpins.id = 'brushSpins';
  var p1 = document.createElement('P'); p1.className = 'title';
  var lifeSpin = document.createElement('INPUT'); lifeSpin.id = 'lifeSpin';
  var p2 = document.createElement('P'); p2.className = 'title';
  var smearSpin = document.createElement('INPUT'); smearSpin.id = 'smearSpin';
  var p3 = document.createElement('P'); p3.className = 'title';
  var sizeSpin = document.createElement('INPUT'); sizeSpin.id = 'sizeSpin';
  brushSpins.appendChild(lifeSpin); brushSpins.appendChild(p1); brushSpins.appendChild(smearSpin);
  brushSpins.appendChild(p2); brushSpins.appendChild(sizeSpin); brushSpins.appendChild(p3);
  brushProperties.appendChild(brushSpins);
  brush.appendChild(brushProperties);
  //Brush Type
  var brushTypeLabel = document.createElement('LABEL');
  var btlAttr = document.createAttribute('for');
  btlAttr.value = 'brushType';
  brushTypeLabel.setAttributeNode(btlAttr);
  brushTypeLabel.textContent = 'Select a brush';
  brush.appendChild(brushTypeLabel);
  var brushTypeSelect = document.createElement('SELECT');
  var btsAttr = document.createAttribute('name');
  btsAttr.value = 'brushType';
  brushTypeSelect.setAttributeNode(btsAttr);
  brushTypeSelect.id = 'brushType';
  var wet = document.createElement('OPTION');
  var dry = document.createElement('OPTION');
  var brushOptionsAttr = document.createAttribute('selectd');
  brushOptionsAttr.value = 'selected';
  wet.setAttributeNode(brushOptionsAttr);
  wet.textContent = 'Wet';
  dry.textContent = 'Dry';
  brushTypeSelect.appendChild(wet); brushTypeSelect.appendChild(dry);
  brush.appendChild(brushTypeSelect);
  buttons.appendChild(brush);


  container.appendChild(buttons);


}

Piece.prototype.addManager = function(manager,width_,height_){
  var width_ = width || this.width;
  var height_ = height_ || this.height;

  this.managers.push(manager);
  this.managers[this.managers.length-1].frameOnCanvas(this.imgData.data,width_,height_);
}

Piece.prototype.uiAddBrush = function(action,how,brush,x,y,vel,random){
  var markType = undefined;
  var name = "";
  if(action == "smear"){
    switch (how){
      case "opaque":
        markType = function(marks,self){self.smearOpaque(marks,self);};
        break;
      case "antiTransparent":
        markType = function(marks,self){self.smearAntiTransparent(marks,self);};
        break;
      case "awayLight":
        markType = function(marks,self){self.smearAwayLight(marks,self);};
        break;
      case "awayDark":
        markType = function(marks,self){self.smearAwayDark(marks,self);};
        break;
      default:
        markType = function(marks,self){self.smearAll(marks,self);};
        how = "all";
    }
  }else if(action == "blend"){
    switch (how){
      case "b/w":
        markType = function(marks,self){self.blendBlackOrWhite(marks,self);};
        name = "blendBW";
        break;
      default:
        markType = function(marks,self){self.blend(marks,self);};
        name = "blendDefault";
    }
  }
  var brushType = undefined;
  if(brush == "Dry"){
    brushType = function(self){return self.getMarks(self);}
  }else if(brush == "Wet"){
    brushType = function(self){return self.getMarksNoGaps(self);}
  }
  name = action + " " + how + " " + brush;

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
    this.addManager(new BrushManager(markType,brushType,name));
    manager = managers[this.managers.length-1];
  }
  var size = $('#size').slider('value');
  if(brush == "Wet"){
    manager.addBrush(new Brush(x-size/2,y,x+size/2,y,vel,$('#life').slider('value'),$('#smear').slider('value')));
  }else if(brush == "Dry"){
    manager.addBrush(new DryBrush(x-size/2,y,x+size/2,y,vel,$('#life').slider('value'),$('#smear').slider('value'),1000,75));
  }
  var newBrush = manager.brushes[manager.brushes.length-1];
  newBrush.setMaxSpeedAndForce(.5,.01);
  newBrush.rgbaValues = [$('#red').slider('value'),$('#green').slider('value'),$('#blue').slider('value'),$('#alpha').slider('value')];
}

Piece.prototype.clickInterface = function(){
  var self = this;
  var canvas = this.canvas;
  $("#save").button().off("click").on("click",function(){
    Save(canvas,"stillLife","jpg");
    return false;
  });
  $("#clear").button().off("click").on("click",function(event){
    var w = self.canvas.width, h = self.canvas.height;
    self.ctx.clearRect(0,0,w,h);
    self.imgData = self.ctx.getImageData(0,0,w,h);
    self.managers.forEach(function(manager){
      manager.frameOnCanvas(self.imgData,w,h);
    })
    return false;
  });

  
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
      var brushType = $('#brushType').selectmenu('instance').buttonText[0].innerText;
      self.uiAddBrush(method[0],method[1],brushType,self.x,self.y,vel,random);  
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