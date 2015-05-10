//Run Browserify on this file to build

var Piece = require('./lib/Piece');
var BrushManager = require('./lib/BrushManager');
var DryBrush = require('./lib/DryBrush');
var Brush = require('./lib/Brush');
var Vector = require('./lib/Vector');
window.onload = function() {
  var canvas1 = document.getElementById('canvas1');
  bigMan = new Piece();
  bigMan.init(canvas1);
  var brushMan = new BrushManager(function(marks){return this.smearOpaque(marks);}
    , function(){return this.getMarksNoGaps(); });
  bigMan.addManager(brushMan);
  for(var i = 0; i < 100; i++){
    var pos = Math.random() * 800;
    brushMan.addBrush(new Brush(pos,pos,pos+35*Math.random(),pos+15,new Vector(Math.random()-.5,Math.random()-.5),Infinity,Infinity,20,Math.random()*100));
    var newBrush = brushMan.brushes[brushMan.brushes.length-1];
    newBrush.setMaxSpeedAndForce(5,.01);
    newBrush.rgbaValues = [255,255,Math.random()*255,255];
  }

  var brushMan1 = new BrushManager(function(marks){return this.convertToBW(marks);}
    , function(){return this.getMarks(); });
  bigMan.addManager(brushMan1);
  for(var i = 0; i < 300; i++){
    var pos = Math.random() * 800;
    brushMan1.addBrush(new DryBrush(pos,pos,pos+15,pos+15,new Vector(Math.random()-.5,Math.random()-.5),Infinity,Infinity,20,Math.random()*100));
    var newBrush = brushMan1.brushes[brushMan1.brushes.length-1];
    newBrush.setMaxSpeedAndForce(5,.01);
    newBrush.rgbaValues = [Math.random()*255,0,Math.random()*255,255];
  }


  

  now();
}

now = function(){

  var animloop;

  (animloop = function() {
    var animloop_id;
    animloop_id = requestAnimationFrame(animloop);
    bigMan.run();
    

  })();
};
