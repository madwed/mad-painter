
window.onload = function() {
  canvas1 = document.getElementById('canvas1');
  bigMan = new Piece();
  bigMan.init(canvas1);
  pSys = new BrushManager(bigMan);
  bigMan.addManager(pSys);

  for(var i=0;i<1;i++){
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

    canvas1.onclick = function(event){
      var rect = canvas1.getBoundingClientRect(), root = document.documentElement;
      var x = event.clientX - rect.left - root.scrollLeft;
      var y = event.clientY - rect.top - root.scrollTop;
      pSys.addBrush(new Brush(x-60,y-10,x+40,y-10));
      pSys.brushes[pSys.brushes.length-1].setMaxSpeedAndForce(.5,.01);
      pSys.brushes[pSys.brushes.length-1].rgbaValues[0] = Math.random() * 255;
      pSys.brushes[pSys.brushes.length-1].rgbaValues[1] = 0;
      pSys.brushes[pSys.brushes.length-1].rgbaValues[2] = 0;
      pSys.brushes[pSys.brushes.length-1].rgbaValues[3] = 255;
    }

    if(stop === 1){
      Save(canvas1,"stillLife","png");
      stop = 0;
    }
  })();



};


document.addEventListener("keydown", function(e) {
    if (e.keyCode == 83) {
      stop = 1;
    }
}, false);
