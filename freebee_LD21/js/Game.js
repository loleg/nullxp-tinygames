/*
 
 Creative Commons Attribution 3.0 Unported License
 http://creativecommons.org/licenses/by/3.0/
 
*/
var LEVEL_LAST = 5; // total levels
function Game(ctx) {
    
    this.pause = true;
    this.level = 0;
    this.score = 0;
    this.timer = 0;
    this.total = 0;
    
    this.play = null;
    this.bees = new Array();
    this.exits = new Array();
    this.blocks = new Array();
    this.ctx = ctx;
    
    this.Bee = function() {
	
	this.active = true;
	
	// current and target bee location and rotation
	this.x = centerX;
	this.y = centerY;
	this.r = 0;
	this.tx = this.ty = this.tr = 0;
	
	// speed of movement and rotation
	this.beeSpeed = 10;
	this.beeCruise = 2;
	this.s = this.rflip = 1;
	
	// general bee properties
	this.beeHappy = false;
	this.h = this.w = 24;
	
	// bee movement radius, speed and offset
	this.beeR = 12; this.beeTurn = 0.3;
	this.dt = this.dx = this.dy = 0;
	
	// height and width and offset of movable area
	this.mh = ctx.canvas.height;
	this.mw = ctx.canvas.width;
	this.oh = this.ow = 0;
	
	// main function for object tick
	this.update = function() {
	    this.move();
	    this.collide();
	    this.draw();
	    this.buzz();
	}
	
	this.move = function() {
	    // increment angle and calculate Rhodonea Cosine
	    if (this.s < 10) {
		this.dt += this.beeTurn;
		if (this.dt > 3.14) this.dt = 0;
		this.dx = this.beeR * Math.cos(3 * this.dt) * Math.cos(this.dt);
		this.dy = this.beeR * Math.cos(3 * this.dt) * Math.sin(this.dt);
	    }
	    this.x += this.dx;
	    this.y += this.dy;
	    // move and rotate towards goal
	    if (this.tx != 0) {
		this.x += ((this.x < this.tx) ? 1 : -1) * this.s;
		this.y += ((this.y < this.ty) ? 1 : -1) * this.s;
		// rotate if needed
		//r this.r += ((this.tr < this.r) ? 1 : -1) * this.rs;
	    }
	    // check boundaries
	    if (this.x < 0) this.x = 0;
	    if (this.y < 0) this.y = 0;
	    if (this.x > ctx.canvas.width)
		this.x = ctx.canvas.width;
	    if (this.y > ctx.canvas.height)
		this.y = ctx.canvas.height;
	    // adjust speed
	    this.s *= 0.9;
	};
	
	// thanks to http://stackoverflow.com/users/334432/pockata
	this.collidesWith = function(o2) {
	    var o1 = this;
	    if ((o1.y + o1.h) < o2.y) {
		return 0;
	    }
	    if ((o1.y - o1.h) > (o2.y + o2.h)) {
		return 0;
	    }
	    if ((o1.x + o1.w) < o2.x) {
		return 0;
	    }
	    if ((o1.x - o1.w) > (o2.x + o2.w)) {
		return 0;
	    }
	    return 1;
	};
	
	// super simple collisions
	this.collide = function() {
	    //return false;
	    for (var bl in game.blocks) {
		if (this.collidesWith(game.blocks[bl])) {
		    var o2 = game.blocks[bl];
		    this.x += 15 * ((this.x < o2.x) ? -1 : 1);
		    this.y += 15 * ((this.y < o2.y) ? -1 : 1);
		    return true;
		}
	    }
	    return false;
	};
	
	this.buzz = function() {
	    var dist = 2;
	    // buzz around randomly
	    if (Math.abs(this.x - this.tx) < dist ||
		    this.s <= this.beeCruise) {
		this.moveToRandom();
	    }
	};
	
	this.moveTo = function(nx, ny) {
	    if (!nx || !ny) return;
	    // set new target
	    this.tx = nx; this.ty = ny;
	    if (this.x == this.tx || this.y == this.ty) return;
	    // set rotation
	    //r this.tr = Math.atan((this.y - this.ty)/(this.x - this.tx));
	    this.rflip = ((this.x - this.tx) < 0) ? -1 : 1;
	    // reset speed
	    this.s = this.beeSpeed;
	};
	
	this.moveToRandom = function() {
	    var nx = Math.ceil(Math.random() * this.mw) + this.ow;
	    var ny = Math.ceil(Math.random() * this.mh) + this.oh;
	    this.moveTo(nx, ny);
	    this.beeHappy = false;
	};
	
	this.pullTo = function(x, y) {
	    // how strongly the sugar attracts
	    var pMax = 66; var pMin = 18;
	    var dx = Math.abs(x - this.x);
	    var dy = Math.abs(y - this.y);
	    if ((dx < pMax) && (dx > pMin) &&
		(dy < pMax) && (dy > pMin)) {
		this.moveTo(x, y);
		this.beeHappy = true;
	    }
	};
	
	this.draw = function() {
	    ctx.save();
	    ctx.translate(this.x, this.y);
	    //d ctx.fillRect(0, 0, this.w, this.h);
	    //r ctx.rotate(Math.abs(6.28 * this.tr) + 1.2);
	    ctx.scale(this.rflip * 0.7, 0.7);
	    drawBee(ctx, this.beeHappy);
	    ctx.restore();
	};
	
    };
    
    this.drawCounter = function(count) {
	for (var i = 0; i < count; i++) {
	    ctx.save();
	    ctx.translate(20 + i * 25, 20);
	    ctx.scale(-0.3, 0.3);
	    ctx.globalAlpha = 0.8;
	    drawBee(ctx, true);
	    ctx.restore();
	}
    };
    
    this.Exit = function(h, v) {
	
	this.posH = h;
	this.posV = v;
	this.s = 30;
	this.capture = 14;
	this.bonus = false;
    
	// set up opposing exits
	this.x =
	    (this.posH) ?
		((this.posV) ? 6 : ctx.canvas.width)
		: centerX;
	this.y =
	    (!this.posH) ?
		((this.posV) ? 6 : ctx.canvas.height)
		: centerY;
	
	// set bonus post
	this.bonus = (this.posH && this.posV);
	
	this.draw = function() {
	    ctx.save();
	    //ctx.globalAlpha = 0.5 + Math.random()*0.4;
	    ctx.fillStyle = "#000000";
	    ctx.translate(this.x, this.y);
	    ctx.beginPath();
	    ctx.arc(0, 0, this.s, 0, 6.2832, true);
	    ctx.fill();
	    if (this.bonus) {
		ctx.save();
		ctx.rotate(-1.57);
		Context2d.fillStyle = "#dc0";
		Context2d.font = "bold 10pt sans-serif";
		Context2d.fillText("BONUS", -22, 10);
		ctx.restore();
	    }
	    ctx.restore();
	};
	
	this.checkBee = function(b) {
	    var dx = Math.abs(b.x - this.x);
	    var dy = Math.abs(b.y - this.y);
	    //var d = Math.sqrt(Math.abs((dx * dx) - (dy * dy)));
	    //if (d <= this.capture) {
	    if (dx < this.capture && dy < this.capture) {
		// bee has escaped
		b.active = false;
		// check bonus
		if (this.bonus) game.score += 50;
		return true;
	    }
	    return false;
	};
	
	this.checkAllBees = function() {
	    for (var b in game.bees) {
		// check bee escaping
		this.checkBee(game.bees[b]);
	    }
	};
	
	this.update = function() {
	    this.draw();
	    this.checkAllBees();
	};
    };
    
    this.createBees = function(count) {
	// evenly distribute bees
	this.total = count;
	for (var i = 0; i < count; i++) {
	    var bee = new this.Bee();
	    bee.y = (.5 + i) * ctx.canvas.height / count;
	    bee.moveToRandom();
	    this.bees.push(bee);
	}
    }
    
    this.createBlock = function(size, pos, isHorizontal) {
	// symmetrically distributed blocks
	var hh = ww = 20; // width
	var bl = new this.Block();
	if (isHorizontal) {
	    ww = size * centerX;
	    bl.x -= (ww / 2);
	    bl.y = -(hh / 2) + centerY + (pos * centerY * 2);
	} else {
	    hh = size * centerY;
	    bl.x = -(ww / 2) + centerX + (pos * centerX * 2);
	    bl.y -= (hh / 2);
	}
	bl.w = ww; bl.h = hh;
	//bl.y = (1 + i) * ctx.canvas.height / count;
	this.blocks.push(bl);
    }
    
    this.createExits = function(i) {
	this.exits = new Array();
	
	// add up to four exits
	var exit = new this.Exit(1, 0);
	this.exits.push(exit);
	if (i == 1) return;
	
	exit = new this.Exit(1, 1);
	this.exits.push(exit);
	if (i == 2) return;
	
	exit = new this.Exit(0, 1);
	this.exits.push(exit);
	if (i == 3) return;
	
	exit = new this.Exit(0, 0);
	this.exits.push(exit);
    };
    
    this.Block = function() {
	
	this.h = this.w = 0;
	this.x = centerX;
	this.y = centerY;
	
	this.draw = function() {
	    ctx.save();
	    ctx.fillStyle = "#cb0";
	    ctx.translate(this.x, this.y);
	    ctx.fillRect(0, 0, this.w, this.h);
	    ctx.restore();
	}
	
    };
    
    this.Player = function() {
	
	this.x = this.y = 0;
	this.s = 20;
	
	this.draw = function() {
	    ctx.save();
	    ctx.translate(this.x - 20, this.y - 20);
	    drawSugar(ctx);
	    ctx.restore();
	};
	
	this.update = function() {
	    this.x = mouseX;
	    this.y = mouseY;
	    this.draw();
	};
	
    };
    
    this.Action = function() {
	
	// check timer (for score)
	var elapsed = 30 - Math.floor((new Date().getTime() - this.timer) / 1000);
	
	// show exits
	for (var e in this.exits) {
	    this.exits[e].update();
	}
	
	// show barriers
	for (var b in this.blocks) {
	    this.blocks[b].draw();
	}
	
	// show bees
	var newbees = new Array();
	for (var b in this.bees) {
	    if (this.bees[b].active) {
		if (mouseDown(0)) {
		    this.bees[b].pullTo(mouseX, mouseY);
		}
		this.bees[b].update();
		newbees.push(this.bees[b]);
	    } else {
		// add this one to the score
		this.score += elapsed;
	    }
	}
	
	// collect still trappde bees
	this.bees = newbees;
	
	// show player
	if (mouseDown(0)) { this.play.update(); }
	drawMessage(this.score, "yellow", 207, null, true);
	this.drawCounter(this.total - this.bees.length);
	
	// check status
	if (this.bees.length == 0) {
	    this.level++;
	    this.pause = true;
	}
	
	// draw timer	
	drawMessage(elapsed, (elapsed < 10) ? "red" : null, -244, null, true);
	if (elapsed < 1) { this.level = -1; this.pause = true; }

    };
    
    this.Notice = function() {
	
	// quick flash
	this.timer = (this.timer < 50) ? this.timer + 2 : 0;
	var t = 200 + Math.abs(this.timer - 25) * 2;
	
	// title image
	preLoadImage("img/P1020726.JPG");
	if (this.level == LEVEL_LAST) {
	    drawCenterImage("img/P1020726.JPG");
	}
        drawCenterImage("img/freebee.png");
	
	switch (this.level) {
	case -1:
	    
	    // welcome message
	    drawMessage("G A M E  O V E R", "red", 130);
	    drawMessage(this.score, "yellow", 200);
	    drawMessage("right click to try again",
		"rgb(" + t + "," + t + "," + t + ")", -200, 20);
	    
	    if (mouseDown(2)) this.Restart();
	    return;
	    
	case 0:
	    
	    // welcome message
	    drawMessage("tap or click to start",
		"rgb(" + t + "," + t + "," + t + ")", -200);
	    drawMessage("Help the bees escape using your sugar cube!", "#ccc", 122, 13);
	    drawMessage("The faster you are, the more points you get", "#ccc", 142, 13);
	    drawMessage("Race against time through five bizzy levels", "#ccc", 162, 13);
	    drawMessage("Created for Ludum Dare 21 - 'Escape'", "#dfd", 200, 16);
		
	    if (mouseDown(0)) this.Restart();
	    return;
	    
	case LEVEL_LAST:
	    
	    // game completed
	    drawMessage("right click to play again",
		"rgb(" + t + "," + t + "," + t + ")", -170, 16);
	    drawMessage("you saved uzzz, thanks!", "#cf0", 135);
	    drawMessage(this.score, "yellow", 200);
	    
	    if (mouseDown(2)) this.Restart();
	    return;
	    
	default:
	    
   	    // default action is to continue playing
	    drawMessage("LEVEL " + this.level + " complete!", "#fec", 120);
	    drawMessage(this.score, "yellow", 200);
	    drawMessage("RIGHT click to continue",
		"rgb(" + t + "," + t + "," + t + ")", 170, 18);
	    if (mouseDown(2)) { this.pause = false; this.Start(); }
	    return;
	    
	}
        
    };
    
    this.Restart = function() {

	// for testing, set the starting level here
	this.level = 0;	
	// reset for a new game
	this.pause = false;
	this.score = 0;
	this.Start();
	
    };

    this.Start = function() {
	
	// start the clock
	this.timer = new Date().getTime();
	
	// reset score and objects
	this.blocks = new Array();
	this.bees = new Array();
	
	switch (this.level) {
	case 0:
	    this.createExits(4);
	    this.createBees(3);
	    this.play = new this.Player();
	    break;
	    
	case 1:
	    this.createBlock(1.5, 0, 0);
	    this.createExits(3);
	    this.createBees(4);
	    this.play = new this.Player();
	    break;
		    
	case 2:
	    this.createBlock(1, -.2, 1);
	    this.createBlock(1, .2, 1);
	    this.createExits(2);
	    this.createBees(4);
	    this.play = new this.Player();
	    break;
	    
	case 3:
	    this.createBlock(0.7, -.3, 0);
	    this.createBlock(0.7, .3, 0);
	    this.createBlock(0.7, -.3, 1);
	    this.createBlock(0.7, .3, 1);
	    this.createExits(2);
	    this.createBees(5);
	    this.play = new this.Player();
	    break;
	    
	case 4:
	    this.createBlock(1, -.2, 0);
	    this.createBlock(1, .2, 0);
	    this.createExits(1);
	    this.createBees(5);
	    this.play = new this.Player();
	    break;
	    
	}
	
    };
    
    this.Frame = function() {
	
	if (this.pause) {
	    this.Notice();
	} else {
	    this.Action();
	}
	
    };
}
