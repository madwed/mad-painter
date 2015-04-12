
window.onload = function() {
  var canvas1 = document.getElementById('canvas1');
  var red = document.getElementById("red");
  var blue = document.getElementById("blue");
  var green = document.getElementById("green");
  var alpha = document.getElementById("alpha");
  var actions = document.getElementsByName("action");
  var randoms = document.getElementsByName("random");
  var life = document.getElementById("life");
  bigMan = new Piece();
  bigMan.init(canvas1,red,green,blue,alpha,actions,randoms,life);
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
