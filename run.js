
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
  var randoms = document.getElementsByName("random");
  var animloop;

  (animloop = function() {
    var animloop_id;
    animloop_id = requestAnimationFrame(animloop);


    bigMan.run();
    //console.log(bigMan.imgData.data[0],bigMan.imgData.data[1],bigMan.imgData.data[2],bigMan.imgData.data[3])
    //console.log(red.value,green.value,blue.value,alpha.value);

    canvas1.onclick = function(event){
      var rect = canvas1.getBoundingClientRect(), root = document.documentElement;
      var x = event.clientX - rect.left - root.scrollLeft;
      var y = event.clientY - rect.top - root.scrollTop;
      var method = ["smear","default"];
      var random = "no";
      for(var action=0; action < actions.length; action++){
        if(actions[action].checked){
          method = actions[action].value.split(" ");
          break;
        }
      }
      for(var rIndex=0; rIndex < randoms.length; rIndex++){
        if(randoms[rIndex].checked){
          random = randoms[rIndex].value;
          break;
        }
      }
      bigMan.uiAddBrush(method[0],method[1],x,y,
                        [Number(red.value),Number(green.value),Number(blue.value),Number(alpha.value)],random);
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
