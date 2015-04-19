
window.onload = function() {
  var canvas1 = document.getElementById('canvas1');
  var uiCanvas = document.getElementById('uiCanvas');
  var actions = document.getElementsByName("action");
  var randoms = document.getElementsByName("random");
  var life = document.getElementById("life");
  var smear = document.getElementById("smear");
  bigMan = new Piece();
  bigMan.init(canvas1,uiCanvas,actions,randoms,life,smear);
  now();
}

now = function(){

  var animloop;

  (animloop = function() {
    var animloop_id;
    animloop_id = requestAnimationFrame(animloop);

    bigMan.run();

    if(stop === 1){
      Save(canvas1,"stillLife","png");
      //stop = 0; 
    }
  })();
};


document.addEventListener("keydown", function(e) {
    if (e.keyCode == 83) {
      //stop = 1;
    }
}, false);
