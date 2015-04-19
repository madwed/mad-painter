$( "#managers" ).accordion({
	active: 1,
	animate: "swing",
	collapsible: true,
	heightStyle: "content",
	icons: {"header": "ui-icon-blank", "activeHeader": "ui-icon-triangle-1-se"}
});

//Color picker
function refreshSwatch() {
  var red = $( "#red" ).slider( "value" ),
    green = $( "#green" ).slider( "value" ),
    blue = $( "#blue" ).slider( "value" ),
    alpha = $("#alpha").slider("value");
  $( "#swatch" ).css( "background-color", 'rgba('+red+', '+green+', '+blue+', '+alpha/255+')' );
}

$(function() {
	//Color Picker
	$( "#red, #green, #blue, #alpha" ).slider({
	  orientation: "horizontal",
	  range: "min",
	  max: 255,
	  value: 255,
	  slide: refreshSwatch,
	  change: refreshSwatch
	});
	$( "#red" ).slider( "value", 255 );
	$( "#green" ).slider( "value", 140 );
	$( "#blue" ).slider( "value", 60 );

	//Brush width, smearSampleRate, strokeLength
	$("#size, #smear, #life").slider({
		orientation: "horizontal",
		range: "min",
		max: 300,
		min: 1,
		value: 10
	});
	$("#smear, #life").slider("option","max",1000);
	//Accompanying spinners
	$("#sizeSpin, #smearSpin, #lifeSpin").spinner({
		max: 300,
		min: 1,
	});
	$("#sizeSpin, #smearSpin, #lifeSpin").spinner("value",10);
	$("#smearSpin, #lifeSpin").spinner("option","max",1000);
	$("#sizeSpin").on("spin",function(){$("#size").slider("value",$("#sizeSpin").spinner("value"))});
	$("#smearSpin").on("spin",function(){$("#smear").slider("value",$("#smearSpin").spinner("value"))});
	$("#lifeSpin").on("spin",function(){$("#life").slider("value",$("#lifeSpin").spinner("value"))});
});