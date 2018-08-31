
//get canvas from HTML document
console.log("Canvas:");
var canvas = document.getElementsByTagName("canvas")[0];
console.log(canvas);
console.log("Context:");
var context = canvas.getContext("2d");
console.log(context);

//these 2 statement are necessary, because javascript is garbage; javascript needs to be told that 2 == 2
canvas.height = canvas.clientHeight;
canvas.width = canvas.clientWidth;
//console.log(canvas);

//use percentages to place down the button text, relative to the canvas height/width
var percentOfHeight = 0.8; //place text at 80% of canvas height
var percentOfWidth = 0.27; //place text at 27% of canvas width

var origRect = canvas.getBoundingClientRect();
//console.log(origRect);
var fontsize = getFontSize(origRect);
var buttonText  = "Press Start!";
//context.font = fontsize + "px serif"; //set desired font & text size here
context.font = fontsize + "px Impact"; //set desired font & text size here

//write button text onto canvas
context.fillText(buttonText, origRect.width * percentOfWidth, origRect.height * percentOfHeight);
var textWidth = context.measureText(buttonText).width;

//console.log("textWidth: "+textWidth);

//click function
canvas.onclick = function(event) {
	//console.log(event);
    var rect = event.currentTarget.getBoundingClientRect();
	//console.log(event.currentTarget.getBoundingClientRect());
	//console.log(rect);

    //determine mouse position during click
    var mouseX = event.pageX - rect.left;
    var mouseY = event.pageY - rect.top;

    //determine top-left x/y position of buttonText
    var textX = rect.width * percentOfWidth;
    var textY = (rect.height * percentOfHeight) - getFontSize(rect);

    //determine bottom-right x/y position of buttonText
    var maxX = textX + (textWidth * (rect.width / origRect.width));
    var maxY = rect.height * percentOfHeight;

    //if mouse click is within position range of buttonText, initiate click action
    if(mouseY > textY && mouseY <= maxY && mouseX >= textX && mouseX <= maxX) {
        //place click action here
		//context.fillRect(0,0,100,100); //test action, makes black square in top-left corner of canvas if successful button click
        //context.fillStyle="#FF0000";
		//Source:https://www.paulirish.com/2009/random-hex-color-code-snippets/
        context.fillStyle="#"+Math.floor(Math.random()*16777215).toString(16);
		context.fillRect(0,0,0.25*canvas.width,0.25*canvas.height); //test action, makes black square in top-left corner of canvas if successful button click
        //canvas.onclick = null; //disable button functionality if switching screens after click
		console.log("clicked!");
	}
}

function getFontSize(rectangle) {
    return rectangle.width * 0.1; //change the constant '0.1' to change font size; constant must be a percentage representation (0.0-1.0)
}



///////if there are any problems, try using this code as well (just uncomment it to attach the resize event), 
/////////which resizes and redraws the canvas accordingly

window.addEventListener("resize", resizeCanvas);

function resizeCanvas() {
    //must save current frame to in-memory canvas, then redraw to actual after resize; 
    /////because stupid javascript clears all drawings after a resize
    var memCanvas = document.createElement("canvas");
    var memCtx = memCanvas.getContext("2d");

    memCanvas.width = canvas.width;
    memCanvas.height = canvas.height;
    memCtx.drawImage(canvas, 0, 0, memCanvas.width, memCanvas.height);

    canvas.width = memCanvas.width;
    canvas.height = memCanvas.height;
    canvas.getContext("2d").drawImage(memCanvas, 0, 0, canvas.width, canvas.height);
}

//I always forget how garbage this language is