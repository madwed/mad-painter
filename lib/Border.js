
module.exports = Border;

Border = function(){
	//function of X or Y
	this.orientation = undefined;
}

Border.prototype.defineEdges = function(topEdge,bottomEdge){
	var orientation = topEdge.orientation;
	if(orientation != bottomEdge.orientation)
		console.log("Edge orientations don't match!");
		return;
	this.orientation = orientation;
	var top = topEdge.values.keys();
	var topKeys = top.keys().sort();
	var bottom = bottomEdge.values.keys();
	var bottomKeys = bottom.keys().sort();
	if((topKeys[0] != bottomKeys[0]) || (topKeys.length != bottomKeys.length))
		console.log("Edges don't form a closed system!");
		return;
	var bounds = {};
	topKeys.forEach(function(key){
		bounds[key] = [bottom[key],top[key]];
	});
	bounds["start"] = topKeys[0];
	bounds["end"] = topKeys[topKeys.length-1];
	this.bounds = bounds;
}

Border.prototype.checking = function(brushes_){
	var orientation = this.orientation;
	if(orientation == "default"){
		this.checkDefault(brushes_);
	}else if(orientation == "x"){
		this.check(brushes_,0,1);
	}else{
		this.check(brushes_,1,0);
	}
}

Border.prototype.checkDefault = function(brushes_){

}

Border.prototype.check = function(brushes_,interval,bound){
	var bounds = this.bounds;
	var start = bounds["start"];
	var end = bounds["end"];
	brushes_.forEach(function(brush){
		var vert1 = brush.pixelPositions[0];
		var vert2 = brush.pixelPositions[brush.pixelPositions.length-1];
		var interval1 = vert1[interval];
		var interval2 = vert2[interval];
		var out1 = (interval1 > end || interval1 < start) ? true : false;
		var out2 = (interval2 > end || interval2 < start) ? true : false;
		if((interval1 > end && interval2 > end) || (interval1 < start && interval2 < start)){
			//flip in interval direction
			continue;
		}
		var bound1 = vert1[bound];
		var bound2 = vert2[bound];

	});
}