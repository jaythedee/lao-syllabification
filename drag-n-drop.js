/* var els = document.querySelectorAll('#pcontainer');
[].forEach.call(els, function(el) {
	el.setAttribute("draggable","true");  
	el.addEventListener("click",getTranslation, false);
  	el.addEventListener("dragstart", handleDragStart, false)
}); */

// track dragged element
var elementDragged = null;

function handleDragStart(ev) {
	ev.dataTransfer.setData("text/html", ev.target.innerHTML);
	elementDragged = this;	
	return false;
}

function handleDragEnter(ev) {
   //ev.target.style.border = "2px solid blue";
}

function handleDragLeave(ev) {
  	//ev.target.style.border = "2px solid white";
}

function handleDragOver(ev) {
	ev.preventDefault();
   //ev.target.style.border = "2px solid blue";
}

function handleDrop(ev) {
   ev.preventDefault();
   var data = ev.dataTransfer.getData("text/html");
   
   // create new p tag
	var newElement = document.createElement("P"); 
	newElement.id = "pcontainer";
	
	// fill p tag with html
	newElement.innerHTML = data;
	newElement.setAttribute("draggable","true");
	newElement.addEventListener("click",getTranslation, false);
	newElement.addEventListener("dragstart",handleDragStart);
		
	// take the surrounding div and append
	if (ev.target.id == "pcontainer"){
		// you are dropping on pcontainer, do not join
		divhandle = ev.target.parentNode;	
	}
	else {
		divhandle = ev.target;
	}
	
	divhandle.insertBefore(newElement,divhandle.firstChild);
   
	// remove the element
	elementDragged.parentNode.removeChild(elementDragged);
	return false;
}