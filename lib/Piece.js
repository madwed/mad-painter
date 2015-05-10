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
var Brush = require("./Brush");
var BrushManager = require("./BrushManager");
var DryBrush = require("./DryBrush");
var Vector = require("./Vector");
var addHTML = require("./elementAdder");

function Piece(){
  this.width = 150;
  this.height = 100;
  this.x = 0;
  this.y = 0;
  this.addingBrush = false;
}

module.exports = Piece;

Piece.prototype.init = function(canvas_){
  this.canvas = canvas_;
  this.width = width = canvas_.width;
  this.height = height = canvas_.height;
  this.ctx = canvas_.getContext("2d");
  this.imgData = this.ctx.getImageData(0, 0, this.width, this.height);
  this.managers = [];
};

Piece.prototype.initUI = function(){
  //Add uiCanvas, clicking canvas
  var canvasBox = this.canvas.parentNode;
  var uiCanvas = addHTML("CANVAS", {id: "uiCanvas", class: "canvas", width: this.width, height: this.height});
  this.uiCanvas = canvasBox.appendChild(uiCanvas);
  this.uictx = this.uiCanvas.getContext("2d");
  //Adding UI buttons
  var container = canvasBox.parentNode;
  var buttons = addHTML("DIV", {id: "buttons"});
  //Color Selector
  var swatch = addHTML("DIV", {id: "swatch", class: "ui-widget-content ui-corner-all"});
  buttons.appendChild(swatch);
  var colors = addHTML("DIV", {id: "colors"});
  var red = addHTML("DIV", {id: "red"}), green = addHTML("DIV", {id: "green"}), blue = addHTML("DIV", {id: "blue"}), alpha = addHTML("DIV", {id: "alpha"});
  colors.appendChild(red); colors.appendChild(green); colors.appendChild(blue); colors.appendChild(alpha);
  buttons.appendChild(colors);
  //Randomness Selector
  var rand = addHTML("DIV", {id: "rand"});
  var randUnder = addHTML("P", {class: "title"}, "randomize under color values");
  var randOver = addHTML("P", {class: "title"}, "randomize over color values");
  var randOff = addHTML("P", {class: "title"}, "don't randomize");
  var randUnderInput = addHTML("INPUT", {name: "random", value: "down", type: "radio"});
  randUnder.appendChild(randUnderInput);
  var randOverInput = addHTML("INPUT", {name: "random", value: "up", type: "radio"});
  randOver.appendChild(randOverInput);
  var randOffInput = addHTML("INPUT", {name: "random", value: "no", type: "radio", checked: "checked"});
  randOff.appendChild(randOffInput);
  rand.appendChild(randUnder); rand.appendChild(randOver); rand.appendChild(randOff);
  buttons.appendChild(rand);
  //Brush Properties
  var brush = addHTML("DIV", {id: "brush"});
  var brushProperties = addHTML("DIV", {id: "brushProperties"});
  //Brush Props
  var brushProps = addHTML("DIV", {id: "brushProps"});
  var strokeLength = addHTML("P", {class: "title"}, "stroke length");
  var life = addHTML("DIV", {id: "life"});
  var smearLength = addHTML("P", {class: "title"}, "smear length");
  var smear = addHTML("DIV", {id: "smear"});
  var brushWidth = addHTML("P", {class: "title"}, "brush width");
  var size = addHTML("DIV", {id: "size"});
  brushProps.appendChild(strokeLength); brushProps.appendChild(life); brushProps.appendChild(smearLength);
  brushProps.appendChild(smear); brushProps.appendChild(brushWidth); brushProps.appendChild(size);
  brushProperties.appendChild(brushProps);
  //Brush Spins
  var brushSpins = addHTML("DIV", {id: "brushSpins"});
  var p1 = document.createElement("P");
  var lifeSpin = addHTML("INPUT", {id: "lifeSpin"});
  var p2 = document.createElement("P");
  var smearSpin = addHTML("INPUT", {id: "smearSpin"});
  var p3 = document.createElement("P");
  var sizeSpin = addHTML("INPUT", {id: "sizeSpin"});
  brushSpins.appendChild(p1); brushSpins.appendChild(lifeSpin); brushSpins.appendChild(p2);
  brushSpins.appendChild(smearSpin); brushSpins.appendChild(p3); brushSpins.appendChild(sizeSpin);
  brushProperties.appendChild(brushSpins);
  brush.appendChild(brushProperties);
  //Brush Type
  var brushTypeLabel = addHTML("LABEL", {for: "brushType"}, "Select a brush");
  brush.appendChild(brushTypeLabel);
  var brushTypeSelect = addHTML("SELECT", {name: "brushType", id: "brushType"});
  var wet = addHTML("OPTION", {selected: "selected"}, "Wet");
  var dry = addHTML("OPTION", {}, "Dry");
  brushTypeSelect.appendChild(wet); brushTypeSelect.appendChild(dry);
  brush.appendChild(brushTypeSelect);
  buttons.appendChild(brush);
  //Managers
  var managersWrapper = addHTML("DIV", {id: "managers-wrapper"});
  var managers = addHTML("DIV", {id: "managers"});
  var h3Blend = addHTML("H3", {}, "blend");
  managers.appendChild(h3Blend);
  var blend = document.createElement("DIV");
  var blendDefault = addHTML("P", {}, "default");
  var blendDefaultInput = addHTML("INPUT", {name: "action", value: "blend default", type: "radio"});
  blendDefault.appendChild(blendDefaultInput);
  blend.appendChild(blendDefault);
  var blendBW = addHTML("P", {}, "b/w");
  var blendBWInput = addHTML("INPUT", {name: "action", value: "blend b/w", type: "radio"});
  blendBW.appendChild(blendBWInput);
  blend.appendChild(blendBW);
  managers.appendChild(blend);

  var h3Smear = addHTML("H3", {}, "smear");
  managers.appendChild(h3Smear);

  var smear = document.createElement("DIV");
  var smearAll = addHTML("P", {}, "all");
  var smearAllInput = addHTML("INPUT", {name: "action", value: "smear default", type: "radio"});
  smearAll.appendChild(smearAllInput);
  smear.appendChild(blendDefault);

  var smearOpaque = addHTML("P", {}, "opaque");
  var smearOpaqueInput = addHTML("INPUT", {name: "action", value: "smear opaque", type: "radio", checked: "checked"});
  smearOpaque.appendChild(smearOpaqueInput);
  smear.appendChild(smearOpaque);

  var smearAntiTransparent = addHTML("P", {}, "antiTransparent");
  var smearAntiTransparentInput = addHTML("INPUT", {name: "action", value: "smear antiTransparent", type: "radio"});
  smearAntiTransparent.appendChild(smearAntiTransparentInput);
  smear.appendChild(smearAntiTransparent);

  var smearAwayDark = addHTML("P", {}, "awayDark");
  var smearAwayDarkInput = addHTML("INPUT", {name: "action", value: "smear awayDark", type: "radio"});
  smearAwayDark.appendChild(smearAwayDarkInput);
  smear.appendChild(smearAwayDark);
  var smearAwayLight = addHTML("P", {}, "awayLight");
  var smearAwayLightInput = addHTML("INPUT", {name: "action", value: "smear awayLight", type: "radio"});
  smearAwayLight.appendChild(smearAwayLightInput);
  smear.appendChild(smearAwayLight);
  managers.appendChild(smear);
  managersWrapper.appendChild(managers);
  buttons.appendChild(managersWrapper);
  container.appendChild(buttons);

  this.actions = document.getElementsByName("action");
  this.randoms = document.getElementsByName("random");

  console.log("UI Deployed");

  function refreshSwatch() {
    var red = $("#red").slider("value"),
      green = $("#green").slider("value"),
      blue = $("#blue").slider("value"),
      alpha = $("#alpha").slider("value");
    $( "#swatch" ).css("background-color", "rgba(" + red + ", " + green + ", " + blue + ", " + alpha / 255 + ")");
  }

  $(function() {
    //Color Picker
    $("#red, #green, #blue, #alpha").slider({
      orientation: "horizontal",
      range: "min",
      max: 255,
      value: 255,
      slide: refreshSwatch,
      change: refreshSwatch
    });
    $("#red").slider("value", 255);
    $("#green").slider("value", 140);
    $("#blue").slider("value", 60);

    //Brush width, smearSampleRate, strokeLength
    $("#size, #smear, #life").slider({
      orientation: "horizontal",
      range: "min",
      max: 300,
      min: 1,
      value: 30
    });
    $("#smear, #life").slider("option", "max", 1000);
    $("#size").on("slide", function(_, ui){$("#sizeSpin").spinner("value", ui.value); });
    $("#smear").on("slide", function(_, ui){$("#smearSpin").spinner("value", ui.value); });
    $("#life").on("slide", function(_, ui){$("#lifeSpin").spinner("value", ui.value); });

    //Accompanying spinners
    $("#sizeSpin, #smearSpin, #lifeSpin").spinner({
      max: 300,
      min: 1
    });
    $("#sizeSpin, #smearSpin, #lifeSpin").spinner("value", 30);
    $("#smearSpin, #lifeSpin").spinner("option", "max", 1000);
    $("#sizeSpin").on("spin", function(_, ui){$("#size").slider("value", ui.value); });
    $("#smearSpin").on("spin", function(_, ui){$("#smear").slider("value", ui.value); });
    $("#lifeSpin").on("spin", function(_, ui){$("#life").slider("value", ui.value); });

    //BrushType, ie wet, dry
    $("#brushType").selectmenu();

    //Managers
    $("#managers").accordion({
      active: 1,
      animate: "swing",
      collapsible: true,
      heightStyle: "content",
      icons: {"header": "ui-icon-blank", "activeHeader": "ui-icon-triangle-1-se"}
    });
  });
};

Piece.prototype.addManager = function(manager, width_, height_){
  var width_ = width_ || this.width;
  var height_ = height_ || this.height;

  this.managers.push(manager);
  this.managers[this.managers.length - 1].frameOnCanvas(this.imgData.data, width_, height_);
};

Piece.prototype.uiAddBrush = function(action, how, brush, x, y, vel, random){
  var markType;
  var name = "";
  if(action === "smear"){
    switch (how){
      case "opaque":
        markType = function(marks){this.smearOpaque(marks); };
        break;
      case "antiTransparent":
        markType = function(marks){this.smearAntiTransparent(marks); };
        break;
      case "awayLight":
        markType = function(marks){this.smearAwayLight(marks); };
        break;
      case "awayDark":
        markType = function(marks){this.smearAwayDark(marks); };
        break;
      default:
        markType = function(marks){this.smearAll(marks); };
        how = "all";
    }
  }else if(action === "blend"){
    switch (how){
      case "b/w":
        markType = function(marks){this.blendBlackOrWhite(marks); };
        name = "blendBW";
        break;
      default:
        markType = function(marks){this.blend(marks); };
        name = "blendDefault";
    }
  }
  var brushType;
  if(brush === "Dry"){
    brushType = function(){return this.getMarks(); };
  }else if(brush === "Wet"){
    brushType = function(){return this.getMarksNoGaps(); };
  }
  name = action + " " + how + " " + brush;

  var exists;
  var managers = this.managers;

  for(var index = 0; index < managers.length; index++){
    if(managers[index].name === name){
      exists = index;
      break;
    }
  }
  var manager;
  if(typeof exists === "number"){
    manager = managers[exists];
  }else{
    this.addManager(new BrushManager(markType, brushType, name));
    manager = managers[this.managers.length - 1];
  }
  var size = $("#size").slider("value");
  if(brush === "Wet"){
    manager.addBrush(new Brush(x - size / 2, y, x + size / 2, y, vel, $("#life").slider("value"), $("#smear").slider("value")));
  }else if(brush === "Dry"){
    manager.addBrush(new DryBrush(x - size / 2, y, x + size / 2, y, vel, $("#life").slider("value"), $("#smear").slider("value"), 1000, 75));
  }
  var newBrush = manager.brushes[manager.brushes.length - 1];
  newBrush.setMaxSpeedAndForce(.5, .01);
  newBrush.rgbaValues = [$("#red").slider("value"), $("#green").slider("value"), $("#blue").slider("value"), $("#alpha").slider("value")];
};

Piece.prototype.clickInterface = function(){
  var self = this;
  var canvas = this.canvas;
  $("#save").button().off("click").on("click", function(){
    save(canvas, "stillLife", "jpg");
    return false;
  });
  $("#clear").button().off("click").on("click", function(event){
    var w = self.canvas.width, h = self.canvas.height;
    self.ctx.clearRect(0, 0, w, h);
    self.imgData = self.ctx.getImageData(0, 0, w, h);
    self.managers.forEach(function(manager){
      manager.frameOnCanvas(self.imgData, w, h);
    });
    return false;
  });

  var uiCanvas = this.uiCanvas;
  $("#uiCanvas").off("click").on("click", function(event){
    var eventDoc, doc, body, pageX, pageY;

    event = event || window.event; // IE-ism

    // If pageX/Y aren't available and clientX/Y are,
    // calculate pageX/Y - logic taken from jQuery.
    // (This is to support old IE)
    if (event.pageX === null && event.clientX !== null) {
        eventDoc = (event.target && event.target.ownerDocument) || document;
        doc = eventDoc.documentElement;
        body = eventDoc.body;

        event.pageX = event.clientX +
          (doc && doc.scrollLeft || body && body.scrollLeft || 0) -
          (doc && doc.clientLeft || body && body.clientLeft || 0);
        event.pageY = event.clientY +
          (doc && doc.scrollTop || body && body.scrollTop || 0) -
          (doc && doc.clientTop || body && body.clientTop || 0 );
    }
    var rect = self.canvas.getBoundingClientRect(), root = document.documentElement;
    var x = Math.round((event.pageX - rect.left) / (rect.right - rect.left) * uiCanvas.width);
    var y = Math.round((event.pageY - rect.top) / (rect.bottom - rect.top) * uiCanvas.height);
    if(!self.addingBrush){
      self.x = x;
      self.y = y;
      self.addingBrush = true;
    }else{
      self.uictx.clearRect(0, 0, self.uiCanvas.width, self.uiCanvas.height);
      self.addingBrush = false;
      var vel = new Vector(x - self.x, y - self.y);
      var method = ["smear", "default"];
      var random = "no";
      var actions = self.actions;
      var randoms = self.randoms;
      for(var action = 0; action < actions.length; action++){
        if(actions[action].checked){
          method = actions[action].value.split(" ");
          break;
        }
      }
      for(var rIndex = 0; rIndex < randoms.length; rIndex++){
        if(randoms[rIndex].checked){
          random = randoms[rIndex].value;
          break;
        }
      }
      var brushType = $("#brushType").selectmenu("instance").buttonText[0].innerText;
      self.uiAddBrush(method[0], method[1], brushType, self.x, self.y, vel, random);
    }
  });
  $("#uiCanvas").on("mousemove", function(event) {
    var eventDoc, doc, body, pageX, pageY;

    event = event || window.event; // IE-ism

    // If pageX/Y aren't available and clientX/Y are,
    // calculate pageX/Y - logic taken from jQuery.
    // (This is to support old IE)
    if (event.pageX === null && event.clientX !== null) {
        eventDoc = (event.target && event.target.ownerDocument) || document;
        doc = eventDoc.documentElement;
        body = eventDoc.body;

        event.pageX = event.clientX +
          (doc && doc.scrollLeft || body && body.scrollLeft || 0) -
          (doc && doc.clientLeft || body && body.clientLeft || 0);
        event.pageY = event.clientY +
          (doc && doc.scrollTop || body && body.scrollTop || 0) -
          (doc && doc.clientTop || body && body.clientTop || 0);
    }

        // Use event.pageX / event.pageY here
    var rect = self.canvas.getBoundingClientRect(), root = document.documentElement;
    self.mx = (event.pageX - rect.left) / (rect.right - rect.left) * uiCanvas.width;
    self.my = (event.pageY - rect.top) / (rect.bottom - rect.top) * uiCanvas.height;
  });

  if(self.addingBrush){
      var ctx = self.uictx;
      ctx.clearRect(0, 0, self.uiCanvas.width, self.uiCanvas.height);
      ctx.beginPath();
      ctx.strokeStyle = "gray";
      ctx.lineWidth = 1;
      ctx.moveTo(this.x, this.y);
      ctx.lineTo(this.mx, this.my);
      ctx.stroke();
  }
};


Piece.prototype.run = function(){
  this.managers.forEach(function(manager){
    manager.run();
  });
  this.ctx.putImageData(this.imgData, 0, 0);
};

function randomizeColorsDown(rgba){
  var r = Math.random() * rgba[0];
  var g = Math.random() * rgba[1];
  var b = Math.random() * rgba[2];
  var a = Math.random() * rgba[3];
  return [r, g, b, a];
}

function randomizeColorsUp(rgba){
  var r = Math.random() * (255 - rgba[0]) + rgba[0];
  var g = Math.random() * (255 - rgba[1]) + rgba[1];
  var b = Math.random() * (255 - rgba[2]) + rgba[2];
  var a = Math.random() * (255 - rgba[3]) + rgba[3];
  return [r, g, b, a];
}
