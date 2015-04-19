
window.onload = function() {
  var canvas1 = document.getElementById('canvas1');
  var uiCanvas = document.getElementById('uiCanvas');
  var actions = document.getElementsByName("action");
  var randoms = document.getElementsByName("random");
  bigMan = new Piece();
  bigMan.init(canvas1,uiCanvas,actions,randoms);
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
      //stop = 1;
    }
}, false);
