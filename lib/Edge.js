
module.exports = Edge;

Edge = function(){
	this.orientation = undefined;	
}

Edge.prototype.init = function(orientation){
	this.orientation = orientation;
	this.path = {};
}

Edge.prototype.addLine = function(x1,y1,x2,y2){
	var run, runStart, riseStart, dRise, runCap;
	if(this.orientation = 'x'){
		run = x2-x1, runStart = x1, riseStart = y1;
		dRise = (y2-y1) / run;
		runCap = x2;
	}else{
		run = y2-y1, runStart = y1, riseStart = x1;
		dRise = (x2-x1) / run;
		runCap = y2;		
	}
	var points = this.path;
	for(var i = 0; i < Math.abs(run); i++){
		points[runStart+i] = riseStart + i * dRise; 
	}
}