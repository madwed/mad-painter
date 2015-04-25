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
		value: 30
	});
	$("#smear, #life").slider("option","max",1000);
	$("#size").on("slide",function(_,ui){$("#sizeSpin").spinner("value",ui.value)});
	$("#smear").on("slide",function(_,ui){$("#smearSpin").spinner("value",ui.value)});
	$("#life").on("slide",function(_,ui){$("#lifeSpin").spinner("value",ui.value)});

	//Accompanying spinners
	$("#sizeSpin, #smearSpin, #lifeSpin").spinner({
		max: 300,
		min: 1,
	});
	$("#sizeSpin, #smearSpin, #lifeSpin").spinner("value",30);
	$("#smearSpin, #lifeSpin").spinner("option","max",1000);
	$("#sizeSpin").on("spin",function(_,ui){$("#size").slider("value",ui.value)});
	$("#smearSpin").on("spin",function(_,ui){$("#smear").slider("value",ui.value)});
	$("#lifeSpin").on("spin",function(_,ui){$("#life").slider("value",ui.value)});

	//BrushType, ie wet, dry
	$("#brushType").selectmenu();

	//Managers
	$( "#managers" ).accordion({
		active: 1,
		animate: "swing",
		collapsible: true,
		heightStyle: "content",
		icons: {"header": "ui-icon-blank", "activeHeader": "ui-icon-triangle-1-se"}
	});

});