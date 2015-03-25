
window.onload = function() {
  canvas1 = document.getElementById('canvas1');
  bigMan = new Piece();
  bigMan.init(canvas1);
  pSys = new BrushManager(bigMan);
  bigMan.addManager(pSys);

  pSys.addRunMethod("blend",function (brush){
    var f = brush.reynoldsWalk();
    brush.applyForce(f,.01);

    brush.pixelOperations();
    brush.isItSmearing();

    brush.vertsEndlessCanvas();
  });


  for(var i=0;i<100;i++){
    var numW = Math.floor(Math.random()*canvas1.width);
    var numH = Math.floor(Math.random()*canvas1.height);
    var len = Math.floor(30);

    pSys.addBrush(new PixelBrush(numW,numH,numW+len,numH,pSys,"blend"));
    pSys.brushes[i].setMaxSpeedAndForce(100,200);
    pSys.brushes[i].rgbaValues[0] = Math.random() * 255;
    pSys.brushes[i].rgbaValues[1] = 0;
    pSys.brushes[i].rgbaValues[2] = 0;
    pSys.brushes[i].rgbaValues[3] = 255;
  }
  now();
}

now = function(){
  var animloop;

  (animloop = function() {
    var animloop_id;
    animloop_id = requestAnimationFrame(animloop);


    bigMan.run();

    /*canvas1.onclick = function(event){
      var rect = canvas1.getBoundingClientRect();
      var x = event.clientX - rect.left;
      var y = event.clientY - rect.top;
      pSys.addBrush(new PixelBrush(x,y,x+50,y,pSys));
      pSys.brushes[pSys.brushes.length-1].setMaxSpeedAndForce(.5,.01);
      console.log(x,y)
    }

    if(stop === 1){
      Save(canvas1,"stillLife","png");
      stop = 0;
    }*/
  })();



};


document.addEventListener("keydown", function(e) {
    if (e.keyCode == 83) {
      stop = 1;
    }
}, false);
