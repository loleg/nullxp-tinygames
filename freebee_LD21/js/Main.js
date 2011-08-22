/*
 * Canvas set up thanks to @vede
 *
 */

var FPS = 30;

var canvas = null;
var Context2d = null;
var game = null;
var centerX = centerY = 0;
var MouseArray=new Array(3);
var mouseX=0;
var mouseY=0;

// set up mouse handling
function initCanvas(c) {
    c.onmousedown = function(event) {
        MouseArray[event.button] = true;
        return false;
    }
    c.onmouseup = function(event) {
        MouseArray[event.button] = false;
    }
    c.onmousemove = function(event) {
        mouseX = event.clientX-canvas.offsetLeft+document.body.scrollLeft;
        mouseY = event.clientY-canvas.offsetTop+document.body.scrollTop;
    }
}

function mouseDown(a) {
    return MouseArray[a];
}

window.onload=function() {
    // set up the canvas
    canvas = document.getElementById('canvas');
    
    initCanvas(canvas);
    
    Context2d = canvas.getContext('2d');
    Context2d.mozImageSmoothingEnabled = false;
    
    centerX = Context2d.canvas.width / 2;
    centerY = Context2d.canvas.height / 2;
    
    game = new Game(Context2d);
    
    setInterval(main,1000/FPS);
}

function main() {
    /*
    // canvas default fill
    Context2d.fillStyle = "#888888";
    Context2d.fillRect(0,0,canvas.width,canvas.height);
    */

    // clear the screen
    Context2d.clearRect(0,0,canvas.width,canvas.height);
    
    // update game frame
    game.Frame();
}

function drawMessage(message, color, pos, size, noshade) {
    // draw a message
    color = (!color) ? "#fff" : color;
    pos   = (!pos)   ? 0 : pos;
    size  = (!size)  ? 24 : size;
    Context2d.save();
    Context2d.font = "bold " + size + "pt sans-serif";
    Context2d.textBaseline = "top";
    Context2d.textAlign = "center";
    Context2d.fillStyle = color;
    if (!noshade) {
		Context2d.shadowColor = "#333";
		Context2d.shadowOffsetX = 3;
		Context2d.shadowOffsetY = 3;
		Context2d.shadowBlur = 5;
	}
    Context2d.fillText(message, centerX, centerY + pos);
    Context2d.restore();
}

function drawCenterImage(imgsrc) {
    // draw a centered image
    Context2d.save();
    var img = new Image();
    img.src = imgsrc;
    Context2d.drawImage(img,
        centerX - (img.width / 2),
        centerY - (img.height / 2));
    Context2d.restore();
}
