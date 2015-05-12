module.exports = elementAdder;

function elementAdder(type, attributes, text){
	var element = document.createElement(type);
	var attrKeys = Object.getOwnPropertyNames(attributes);
	for (var i = 0; i < attrKeys.length; i++){
		var key = attrKeys[i];
		var attr = document.createAttribute(key);
		attr.value = attributes[key];
		element.setAttributeNode(attr);
	}
	if(typeof text === "string"){element.textContent = text; }
	return element;
}
