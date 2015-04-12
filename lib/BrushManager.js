/**
 *
 */

BrushManager = function(markMethod,name){
  	this.brushes = [];
  	this.type = markMethod || this.smearOpaque;
  	this.name = name || "smear_opaque";
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

BrushManager.prototype.run = function(){
	this.checkDeath();
  	for(var i=0; i<this.brushes.length;i++){
  		this.brushes[i].run();
  	}
  	var self = this;
  	var markMethod = self.type;
   	markMethod(this.chargeBrushes(this.getMarksNoGaps()),this);
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

BrushManager.prototype.getMarksNoGaps = function(){
  var marks = {pixels:[], rGBAs:[]};
  this.brushes.forEach(function(brush,index){
	  var bristlePositions = brush.pixelPositions;
	  marks.rGBAs[index] = brush.rgbaValues;
	  var pixels = [], bristles = bristlePositions.length;
	  var dx = Math.abs((bristlePositions[bristles-1][0] - bristlePositions[0][0])/bristles);
	  var dy = Math.abs((bristlePositions[bristles-1][1] - bristlePositions[0][1])/bristles);
	  if(dx > dy){
	  	pixels.push(getPixel(bristlePositions[0][0],bristlePositions[0][1]));
	  	for (var bristle = 1; bristle < bristles; bristle++){
	  		var oldY = Math.floor(bristlePositions[bristle-1][1]);
	  		var newY = Math.floor(bristlePositions[bristle  ][1]);
	  		var x = bristlePositions[bristle][0]
    		if(oldY != newY){
        		pixels.push(getPixel(x,oldY));
      		}
      		pixels.push(getPixel(x,newY));
   		}
	  }else{
	  	pixels.push(getPixel(bristlePositions[0][0],bristlePositions[0][1]));
	  	for (var bristle = 1; bristle < bristles; bristle++){
	  		var oldX = Math.floor(bristlePositions[bristle-1][0]);
	  		var newX = Math.floor(bristlePositions[bristle  ][0]);
	  		var y = bristlePositions[bristle][1]
    		if(oldX != newX){
        		pixels.push(getPixel(oldX,y));
      		}
      		pixels.push(getPixel(newX,y));
   		}
	  }
	  marks.pixels[index] = pixels;
  });
  return marks;
}

BrushManager.prototype.checkDeath = function(){
	var brushes = this.brushes;
	brushes.forEach(function(brush,index){
		if(brush.life < 1){
			brushes.splice(index,1);
		}
	});
}

BrushManager.prototype.chargeBrushes = function(marks){
	this.brushes.forEach(function(brush,index){
		if(!brush.smearing){
			brush.rgbaValues = this.getBristleRGBAs(marks.pixels[index]);
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


BrushManager.prototype.getBristleRGBAs = function(pixels,sourcePixel){
	var rGBAs = [], data = this.iData, bristleCount = pixels.length;
	if(sourcePixel >= bristleCount)
		sourcePixel = bristleCount - 1;
	var centerPixel = sourcePixel || pixels[Math.floor(bristleCount/2)];
	if(centerPixel == "undefined"){
		rGBAs.push(undefined,undefined,undefined,undefined);
	}else{
		rGBAs.push(data[centerPixel],data[centerPixel+1],data[centerPixel+2],data[centerPixel+3]);
	}
	return rGBAs;
}

BrushManager.prototype.getRandomRGBAs = function(pixels){
	var rGBAs = [], data = this.iData;
	pixels.forEach(function(pixel){
		rGBAs.push(Math.random()*255, Math.random()*255, Math.random()*255, 255);
	});
	return rGBAs
}


/*Brush.prototype.putPixelRGBfromRGBArray = function(rgbArray){
  var rgbEntryCount = rgbArray.length/4;
  for(var pixInLine = 0; pixInLine < this.pixelLine.length; pixInLine++){
    var rgbEntry = pixInLine%rgbEntryCount;
    this.brushSys.iData.data[this.pixelLine[pixInLine]*4  ] = rgbArray[rgbEntry*4  ];
    this.brushSys.iData.data[this.pixelLine[pixInLine]*4+1] = rgbArray[rgbEntry*4+1];
    this.brushSys.iData.data[this.pixelLine[pixInLine]*4+2] = rgbArray[rgbEntry*4+2];
    this.brushSys.iData.data[this.pixelLine[pixInLine]*4+3] = rgbArray[rgbEntry*4+3];
  }
}

Brush.prototype.setPixelLineRGB = function(r_,g_,b_,a_){
  var pixRGB = this.pixelRGB;
  for(var i = this.pixelLine.length; i; i--){
    pixRGB[i*4  ] = r_;
    pixRGB[i*4+1] = g_;
    pixRGB[i*4+2] = b_;
    pixRGB[i*4+3] = a_;
  }
}*/


//Apply rgba values to pixels in this.iData
BrushManager.prototype.smearAll = function(marks,ctx){
	var data = ctx.iData;
	for(var mark=0; mark < marks.pixels.length; mark++){
		var rGBAs = marks.rGBAs[mark];
		var rgbaEntries = rGBAs.length;
		var pixels = marks.pixels[mark];
		for(var index = 0; index < pixels.length; index++){
			var rgbaIndex = index % (rgbaEntries/4) * 4;
			var red = rGBAs[rgbaIndex];
			var pixel = pixels[index];
			if(typeof pixel == "undefined" || typeof red == "undefined"){
				continue;
			}
			data[pixel  ] = rGBAs[rgbaIndex  ];
			data[pixel+1] = rGBAs[rgbaIndex+1];
			data[pixel+2] = rGBAs[rgbaIndex+2];
			data[pixel+3] = rGBAs[rgbaIndex+3];
		}
	}
	return marks;
}

BrushManager.prototype.smearOpaque = function(marks,ctx){
	var data = ctx.iData;
	for(var mark=0; mark < marks.pixels.length; mark++){
		var rGBAs = marks.rGBAs[mark];
		var rgbaEntries = rGBAs.length;
		var pixels = marks.pixels[mark];
		for(var index = 0; index < pixels.length; index++){
			var rgbaIndex = index % (rgbaEntries/4) * 4;
			if(rGBAs[rgbaIndex+3]){
				var pixel = pixels[index];
				var red = rGBAs[rgbaIndex];
				if((typeof pixel == "undefined") || (typeof red == "undefined")){
					continue;
				}
				data[pixel  ] = rGBAs[rgbaIndex  ];
				data[pixel+1] = rGBAs[rgbaIndex+1];
				data[pixel+2] = rGBAs[rgbaIndex+2];
				data[pixel+3] = rGBAs[rgbaIndex+3];
			}
		}
	}
	return marks;
}


BrushManager.prototype.smearAntiTransparent = function(marks,ctx){
	var data = ctx.iData;
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

BrushManager.prototype.smearAwayDark = function(marks,ctx){
	var data = ctx.iData;
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

BrushManager.prototype.smearAwayLight = function(marks,ctx){
	var data = ctx.iData;
	for (var mark=0; mark < marks.pixels.length; mark++){
		var rGBAs = marks.rGBAs[mark];
		var rgbaEntries = rGBAs.length;
		var pixels = marks.pixels[mark];
		for(var index = 0; index < pixels.length; index++){
			var rgbaIndex = index % (rgbaEntries/4) * 4;
			var pixel = pixels[index];
			if(!data[pixel+3] 
			||((data[pixel  ] > rGBAs[rgbaIndex])
			|| (data[pixel+1] > rGBAs[rgbaIndex+1])
			|| (data[pixel+2] > rGBAs[rgbaIndex+2]))
			&& rGBAs[rgbaIndex+3])
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

BrushManager.prototype.blend = function(marks,ctx){
	var data = ctx.iData;
	for (var mark=0; mark < marks.pixels.length; mark++){
		var rGBAs = marks.rGBAs[mark];
		var rgbaEntries = rGBAs.length;
		var pixels = marks.pixels[mark];
		for(var index = 0; index < pixels.length; index++){
			var rgbaIndex = index % (rgbaEntries/4) * 4;
			var pixel = pixels[index];
			if(data[pixel+3] && rGBAs[rgbaIndex+3])
			{
				data[pixel  ] = (data[pixel  ] + rGBAs[rgbaIndex  ]) / 2;
				data[pixel+1] = (data[pixel+1] + rGBAs[rgbaIndex+1]) / 2;
				data[pixel+2] = (data[pixel+2] + rGBAs[rgbaIndex+2]) / 2;
				data[pixel+3] = (data[pixel+3] + rGBAs[rgbaIndex+3]) / 2;
			}
		}
	}
	return marks;
}

BrushManager.prototype.blendBlackOrWhite = function(marks,ctx,degree){
	var data = ctx.iData;
	degree = 1.9;
	for (var mark=0; mark < marks.pixels.length; mark++){
		var pixels = marks.pixels[mark];
		for(var index = 0; index < pixels.length; index++){
			var pixel = pixels[index];
			if(data[pixel+3])
			{
				data[pixel  ] = (data[pixel  ] * degree) / 2;
				data[pixel+1] = (data[pixel+1] * degree) / 2;
				data[pixel+2] = (data[pixel+2] * degree) / 2;
				data[pixel+3] = 255;
			}
		}
	}
	return marks;
}

BrushManager.prototype.smearLightOrDark = function(){
	var vPosOrNeg = Math.random() - .5;
	if(vPosOrNeg >= 0){
		this.smearAgainstDark();
  	}else{
    	this.smearAgainstLight();
  	}
}


BrushManager.prototype.blendOrSmear = function(num_){
	if(num_){
		var vPosOrNeg = num_;
	}else{
		var vPosOrNeg = Math.random() - .5;
	}
	if(vPosOrNeg >= .75){
		this.smear();
	}else{
		this.blend();
	}
}

BrushManager.prototype.blendOrSmearLightOrDark = function(){
	var vPosOrNeg = Math.random() - .5;
	if(vPosOrNeg >= 0){
		this.blend();
	}else{
		this.smearLightOrDark(vPosOrNeg);
	}
}

