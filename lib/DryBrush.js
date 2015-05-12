//sampleRate is the number of iterations that pass before the bristle arrangement is shuffled
//dryness is a percentage (0-100) used to calculate the likelihood a particular bristle is "down"

var Brush = require("./Brush");
var Vector = require("./Vector");
var utils = require("./mathLib");

function DryBrush(x1_, y1_, x2_, y2_, vel, life, smearDuration, sampleRate, dryness){
	var vert1 = new Vector(x1_, y1_);
	var vert2 = new Vector(x2_, y2_);
  	var tempDistVec = vert2.newSub(vert1);
  	this.dist = Math.floor(tempDistVec.length());
	this.dryness = dryness;
	this.bristleDown = [];
	this.calculateMarkingBristles();
	Brush.call(this, x1_, y1_, x2_, y2_, vel, life, smearDuration);
	this.sampleRate = sampleRate;
	this.sampleCount = sampleRate;
}

module.exports = DryBrush;

DryBrush.prototype = Object.create(Brush.prototype,{
	constructor:{
		value:DryBrush
	}
});

DryBrush.prototype.calculateMarkingBristles = function(){
	var dryness = this.dryness;
	for(var i = 0; i < Math.floor(this.dist); i++){
		var dry = (Math.random() * 100 + utils.EPSILON) < dryness;
		if(dry){
			this.bristleDown[i] = false;
		}else{
			this.bristleDown[i] = true;
		}
	}
}

DryBrush.prototype.getPixelPositions = function(vert1X, vert1Y, vert2X, vert2Y){
	if(this.sampleCount <= 0){
		this.calculateMarkingBristles();
		this.sampleCount = this.sampleRate;
	}else{
		this.sampleCount--;
	}

  var dx = (vert2X - vert1X) / this.dist;
  var dy = (vert2Y - vert1Y) / this.dist;

  var bristleDown = this.bristleDown;
  for (var gPi = 0; gPi < Math.floor(this.dist); gPi++){
  	if(bristleDown[gPi]){
  		this.pixelPositions[gPi] = [vert1X + dx * gPi, vert1Y + dy * gPi];
  	}
  }
}

