
window.onload = function() {
  canvas1 = document.getElementById('canvas1');
  bigMan = new Piece();
  bigMan.init(canvas1);
  pSys = new BrushManager(bigMan);
  bigMan.addManager(pSys);

  for(var i=0;i<100;i++){
    var numW = Math.floor(Math.random()*canvas1.width);
    var numH = Math.floor(Math.random()*canvas1.height);
    var len = Math.floor(30);

    pSys.addBrush(new Brush(numW,numH,numW+len,numH));
    pSys.brushes[i].setMaxSpeedAndForce(2,.2);
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

  })();



};


document.addEventListener("keydown", function(e) {
    if (e.keyCode == 83) {
      stop = 1;
    }
}, false);
