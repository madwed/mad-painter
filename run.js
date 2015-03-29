
window.onload = function() {
  canvas1 = document.getElementById('canvas1');
  bigMan = new Piece();
  bigMan.init(canvas1);
  now();
}

now = function(){
  var red = document.getElementById("red");
  var blue = document.getElementById("blue");
  var green = document.getElementById("green");
  var alpha = document.getElementById("alpha");
  var actions = document.getElementsByName("action");
  var animloop;

  (animloop = function() {
    var animloop_id;
    animloop_id = requestAnimationFrame(animloop);


    bigMan.run();

    canvas1.onclick = function(event){
      var rect = canvas1.getBoundingClientRect(), root = document.documentElement;
      var x = event.clientX - rect.left - root.scrollLeft;
      var y = event.clientY - rect.top - root.scrollTop;
      var method = ["smear","default"];
      for(var action=0; action < actions.length; action++){
        if(actions[action].checked){
          method = actions[action].value.split(" ");
          break;
        }
      }
      bigMan.uiAddBrush(method[0],method[1],x,y,[red.value,green.value,blue.value,alpha.value])
    }

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
