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
  this.smearAwayDark(this.chargeBrushes(this.getMarks()));

}

//Get Brushes' pixelPositions (x,y coords) and rgba values
//Convert x,y coords to imageData pixel values
BrushManager.prototype.getMarks = function(){
  var marks = {pixels:[], rGBAs:[]};
  this.brushes.forEach(function(brush,index){
	  var bristlePositions = brush.pixelPositions;
	  marks.rGBAs[index] = brush.rgbaValues;
	  var pixels = [];
	  bristlePositions.forEach(function(bristle){
		  pixels.push(getPixel(bristle[0],bristle[1]));
	  });
	  marks.pixels[index] = pixels;
  });
  return marks;
}

BrushManager.prototype.chargeBrushes = function(marks){
	this.brushes.forEach(function(brush,index){
		if(!brush.smearing){
			brush.rgbaValues = this.getCanvasRGBAs(marks.pixels[index]);
		}
	},this);
	return marks;
}

//Gathers Canvas RGBAs (includes transparent pixels)
BrushManager.prototype.getCanvasRGBAs = function(pixels){
	var rGBAs = [], data = this.iData;
	pixels.forEach(function(pixel){
		rGBAs.push(data[pixel],data[pixel+1],data[pixel+2],data[pixel+3]);
	});
	return rGBAs
}

//Apply rgba values to pixels in this.iData
BrushManager.prototype.applyMarks = function(marks){
	var data = this.iData;
	for(var mark=0; mark < marks.pixels.length; mark++){
		var rGBAs = marks.rGBAs[mark];
		var rgbaEntries = rGBAs.length;
		var pixels = marks.pixels[mark];
		for(var index = 0; index < pixels.length; index++){
			var rgbaIndex = index % (rgbaEntries/4) * 4;
			var pixel = pixels[index];
			data[pixel  ] = rGBAs[rgbaIndex  ];
			data[pixel+1] = rGBAs[rgbaIndex+1];
			data[pixel+2] = rGBAs[rgbaIndex+2];
			data[pixel+3] = rGBAs[rgbaIndex+3];
		}
	}
	return marks;
}

BrushManager.prototype.smearAntiTransparent = function(marks){
	var data = this.iData;
	for (var mark=0; mark < marks.pixels.length; mark++){
		var rGBAs = marks.rGBAs[mark];
		var rgbaEntries = rGBAs.length;
		var pixels = marks.pixels[mark];
		for(var index = 0; index < pixels.length; index++){
			var rgbaIndex = index % (rgbaEntries/4) * 4;
			var pixel = pixels[index];
			if(data[pixel+3] == 0)
			{
				data[pixel  ] = rGBAs[rgbaIndex  ];
				data[pixel+1] = rGBAs[rgbaIndex+1];
				data[pixel+2] = rGBAs[rgbaIndex+2];
				data[pixel+3] = rGBAs[rgbaIndex+3];
			}
		}
	}
	return marks;
}

BrushManager.prototype.smearAwayDark = function(marks){
	var data = this.iData;
	for (var mark=0; mark < marks.pixels.length; mark++){
		var rGBAs = marks.rGBAs[mark];
		var rgbaEntries = rGBAs.length;
		var pixels = marks.pixels[mark];
		for(var index = 0; index < pixels.length; index++){
			var rgbaIndex = index % (rgbaEntries/4) * 4;
			var pixel = pixels[index];
			if((data[pixel  ] < rGBAs[rgbaIndex])
			|| (data[pixel+1] < rGBAs[rgbaIndex+1])
			|| (data[pixel+2] < rGBAs[rgbaIndex+2]))
			{
				data[pixel  ] = rGBAs[rgbaIndex  ];
				data[pixel+1] = rGBAs[rgbaIndex+1];
				data[pixel+2] = rGBAs[rgbaIndex+2];
				data[pixel+3] = rGBAs[rgbaIndex+3];
			}
		}
	}
	return marks;
}


