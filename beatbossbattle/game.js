/*
 BEAT BOSS BATTLE FOR HTML5
 
 Written by @loleg http://oleg.utou.ch
 
 Dedicated to our young musical couple

 Creative Commons Attribution 3.0 Unported License
 http://creativecommons.org/licenses/by/3.0/
*/

// Initial settings
var 	level = 1, lastLevel = 4,
		pause = 1, pointsPerLevel = 200,
		message = "get ready players!";
		
// Game objects
function Boss(Name, ImageSrc) {
    this.X = 0, this.Y = 0; 
    this.Width = 100;
    this.Speed = 1;
    this.id = Name;
    this.img = new Image();
    this.img.src = ImageSrc;
    this.update = function() {
        //a.save();
        this.move();
        //a.translate(this.X, this.Y);
        //a.scale((this.Speed < 0) ? -1.0 : 1.0, 1.0);
        this.draw();
    };    
    this.move = function() {
        this.X = (this.X < -this.Width) ? screen_width + this.Width : 
                 (this.X > screen_width + this.Width) ? -this.Width : 
                     this.X + this.Speed;
		// update frame and speed                    
		this.Speed = (Math.abs(this.Speed) > 0.1) ? 
			this.Speed / 1.5 : 			// decrease speed exponentially
			(Math.random() - 0.5) * 200;// assign new trajectory
    };
    this.draw = function() {
        a.drawImage(this.img, this.X, this.Y);
    };
};

function Star(myType) {
    this.X = boss.X + 25, this.Y = boss.Y + 25; 
    this.DX = 3*(Math.random()-0.5), this.DY = 1;
    this.alive = true, this.Type = myType;
    // how often a star become a shoe?
    if (Math.random() > 0.99) this.Type = 3 + level;
	this.update = function() {
		if (!this.alive) return;
        this.move();
		a.save();
		a.globalAlpha = 0.2 + Math.random()*0.4;
		a.fillStyle = "#ffff00";		
        a.translate(this.X, this.Y);
        switch(this.Type) {
        case 0:
	        this.drawSquare(); break;
	    case 1:
	    	this.drawCircle(); break;
	    case 2:
	    	this.drawNote(); break;
	    case 3:
	    	this.drawStar(); break;
	    case 4:
	    case 5:
	    case 6:
	    	this.drawShoe(); break;
	    case 7:
	    	this.drawHeart(); break;
	    }
        a.restore();
        this.checkhit();
    };
    this.move = function() {
        this.X += this.DX;
        this.Y += this.DY;
		this.DY *= 1.26;
		if (this.Y > screen_height+150) {
			this.alive = false;
		}
    };
    this.checkhit = function() {
    	if (this.Type == 7) return;
    	var r = 64;
    	for (var j in players) {
    		var p = players[j];
			if (this.X > p.X && this.X < p.X + r &&
				this.Y > p.Y && this.Y < p.Y + r) {
				if (this.Type == 7) {
					// no points
				} else if (this.Type > 3) {
					// bonus points
					p.Score += 25;
				} else {
					p.Score++;
				}
				p.Frame = 0;
				p.Glow = 10;
				updateScore(j);
				this.alive = false;
				return;
			}
		}
    };
	this.drawSquare = function() {
		a.fillRect(0, 0, 10, 10);
		return;	
	};
	this.drawCircle = function() {
		a.beginPath();
		a.arc(0, 0, 10, 0, 6.2832, true);
		a.fill();
		return;	
	};
	this.drawNote = function() {
		a.font = "16pt Arial";
		a.fillText("#", 0, 0);
		return;	
	};
	this.drawStar = function() {
		// Converted with http://www.professorcloud.com/svg-to-canvas/
		a.lineCap = 'butt';
		a.lineJoin = 'miter';
		a.miterLimit = 4;
		a.translate(0,3160.6299);
		a.transform(0.23766007,0,0,0.23766007,-57.254546,-3218.0365);
		a.scale(0.5, 0.5);
		a.beginPath();
		a.moveTo(345.7143,255.18018);
		a.bezierCurveTo(353.28283999999996,254.05625,363.04184999999995,309.94968,369.23174,314.44761);
		a.bezierCurveTo(376.68521,319.86372,440.82975,319.0176,444.93313,327.26689);
		a.bezierCurveTo(448.34086,334.11768,398.19874,360.67107,395.83374000000003,367.94794);
		a.bezierCurveTo(392.98596000000003,376.71028,413.61243,437.45390000000003,407.03490000000005,443.90562);
		a.bezierCurveTo(401.57246000000004,449.26358,360.82391000000007,409.78104,353.17237000000006,409.78047);
		a.bezierCurveTo(343.9588800000001,409.77977999999996,292.5622000000001,448.16751999999997,284.3936800000001,443.90560999999997);
		a.bezierCurveTo(277.6099700000001,440.36621999999994,302.5681000000001,389.41128,300.2041900000001,382.13404999999995);
		a.bezierCurveTo(297.3577200000001,373.37128999999993,244.9663500000001,336.35259999999994,246.4954700000001,327.26687999999996);
		a.bezierCurveTo(247.7653500000001,319.72144999999995,303.9388600000001,327.71210999999994,310.1294200000001,323.21511);
		a.bezierCurveTo(317.5837000000001,317.80010999999996,336.6007400000001,256.53355999999997,345.7143000000001,255.18017999999998);
		a.closePath();
		a.fill();
		return;
	};
	this.drawShoe = function() {
		a.rotate(- this.Y / 100);
		a.globalAlpha = 1.0;
		a.drawImage(bonus[this.Type % 3], 0, 0);
		return;
	};
	this.drawHeart = function() {
		a.globalAlpha = 1.0;
		a.drawImage(bonus[3], 0, 0, 60, 80);
		return;
	};
}

function Player(Name, ImageSrc) {
    this.X = 0, this.Y = 0;
    this.Width = 64, this.Height = 96;
    this.Speed = 1, this.Frame = 0; // bounce frame
    this.Score = 0, this.Glow = 0;
    this.id = Name;
    this.img = new Image();
    this.img.src = ImageSrc;
    this.update = function() {
        a.save();
        this.move();
        this.draw();
        if (--this.Glow > 0) {
        	a.globalAlpha = 0.6;
        	a.fillStyle = "#ffe";
        	a.beginPath();
        	a.scale(1,0.3);
			a.arc(this.X+30, this.Y+650, 40, 0, 6.2832, true);
			a.fill();
		} else if (Math.abs(this.Frame) > 7) {
        	a.globalAlpha = 0.5 - (11-Math.abs(this.Frame))/8;
        	a.fillStyle = "#333";
        	a.beginPath();
        	a.scale(1,0.2);
			a.arc(this.X+30, this.Y+1060, 26, 0, 6.2832, true);
			a.fill();
        }
        a.restore();
    };    
    this.move = function() {
        this.X = (this.X < 0) ? 0 : 
                 (this.X > screen_width - this.Width) ? screen_width - this.Width: 
                     this.X + this.Speed;
		// update frame and speed                    
		this.Speed = (Math.abs(this.Speed) > 0.1) ? this.Speed / 2 : 0;
        this.Frame = (this.Frame == 10) ? -10 : this.Frame + 1;
    };
    this.up = function() {
    	// push back the other player
    	for (var j in players) {
    		if (players[j].Name != this.Name) {
    			players[j].Speed = -1000/(this.X - players[j].X);
    		}
    	}
    };
    this.left = function() {
    	this.Speed -= 20;
    };
    this.right = function() {
    	this.Speed += 20;
    };
    this.draw = function() {
    	var by, bh = 0;
    	if (Math.abs(this.Frame) > 7) {
    		bh = 3 * (Math.abs(this.Frame) - 7);
    	}
		by = (this.Frame * this.Frame) / 5;
        a.drawImage(this.img, 
        	this.X, this.Y + by, 
        	this.Width, this.Height - bh);
    };
};

function doKeyDown(evt){
	switch (evt.keyCode) {
//	case 38:  /* Up arrow */
//		players[0].up();
//		break;
//	case 40:  /* Down arrow */
//		players[0].down();
//		break;
	case 37:  /* Left arrow */
		players[0].left();
		break;
	case 39:  /* Right arrow */
		players[0].right();
		break;
//	case 87:  /* W */
//		players[1].up();
//		break;
//	case 93:  /* S */
//		players[1].down();
//		break;
	case 65:  /* A */
		players[1].left();
		break;
	case 68:  /* D */
		players[1].right();
		break;
	case 32:  /* space */
		unPause();
		break;
	}
};

function updateScore(j) {
	document.getElementById("score" + players[j].id).innerHTML = players[j].Score;
};

function checkCollide(i) {
    // collision detection
    for (var j in players) {
		if (j != i) {
			var d = players[j].X - players[i].X;
			if (Math.abs(d) < 64) {
				// collide
    			players[i].X -= d / 10;
    			players[j].X += d / 10;
    			// sparkles
    			bling[0] = new Star(7);
    			bling[0].Type = 7; // force
   				bling[0].X = players[i].X; 
   				bling[0].Y = 20 + players[i].Y - (30 * Math.random());
    			bling[1] = new Star(7);
    			bling[1].Type = 7; // force
   				bling[1].X = players[j].X; 
   				bling[1].Y = 20 + players[j].Y - (30 * Math.random());
    		}
		}
	}
}

function loadGameData() {
	// create players
	var p1 = new Player("Jo", "pix/jo.png");
	p1.X = 170; p1.Y = 140;
	players.push(p1);
	var p2 = new Player("Ernie", "pix/ernie.png");
	p2.X = 270; p2.Y = 140;
	players.push(p2);

	// create first boss
	boss = new Boss("Jay-Z 1st date", "pix/jay-z.png");
	boss.X = 200; boss.Y = 10;

	// load bonus items
	var img;
	for (var i = 1; i < 4; i++) {
		img = new Image();
		img.src = "pix/shooz" + i + ".png";
		bonus.push(img);
	}
	img = new Image();
	img.src = "pix/sparklheart.gif";
	bonus.push(img);
	
	// load backgrounds
	backgrounds[0] = "2798118074_c329b6f624_b.jpg";
	backgrounds[1] = "4449079525_2c06384207_b.jpg";
	backgrounds[2] = "4471774941_9f95b09b4e_b.jpg";
	// preload
	for (var i in backgrounds) {
		img = new Image();
		img.src = "bgs/" + backgrounds[i];
	}	
	// load first background
	c.style.backgroundImage = "url(bgs/" + backgrounds[0] + ")";
	au.src="tunz/1.ogg"; au.play();
	
	// set up audio playback on Firefox
	if (navigator.product == "Gecko") {
		au.addEventListener('ended', function(){ this.currentTime = 0; }, false);
	}
	document.getElementById("mutebutton").addEventListener('mousedown', function(){
		au.volume = (au.volume > 0) ? 0 : 1;
	}, true);
}

function unPause() {
	// continue game
	if (pause && level < lastLevel + 1) {
		pause = 0;
		// reset scores
   		bling = [];
	   	for (var i in players) {
	   		players[i].Score = 0;
	   		updateScore(i);
	   	}
	   	// switch background
	   	switch (level) {
       	case 2:
       		c.style.backgroundImage = "url(bgs/" + backgrounds[1] + ")";
       		au.src="tunz/2.ogg";
       		break;
       	case 3:
       		c.style.backgroundImage = "url(bgs/" + backgrounds[2] + ")";
       		au.src="tunz/3.ogg";
       		break;
       	case 4:
	    	document.location.reload();
       	}
	}
}

function checkScore(i) {
	if (players[i].Score > pointsPerLevel * level) {
       	level++; pause = 1;
       	message = players[i].id;
   		bling = [];
       	switch (level) {
       	case 2:
       		message = "great start " + message + "!";
       		boss = new Boss("Kweli romance", "pix/talib.png");
       		break;
       	case 3:
       		message = "big score " + message + "!";
       		boss = new Boss("Kanye love", "pix/kanye.png");
       		break;
       	case 4:
       		message = message + " wins the round!";
	       	break;
       	}
    }
}

function drawMessage() {
	// draw the message
	a.save();
	a.font = "bold 24pt sans-serif";
	a.textBaseline = "top";
	a.textAlign = "center";
	a.fillStyle = "red";
	a.shadowColor = "#fff";
	a.shadowOffsetX = 0;
	a.shadowOffsetY = 0;
	a.shadowBlur = 5 + Math.abs(pause - 3);
	a.fillText(message, c.width / 2, c.height / 4);
	if (level < lastLevel) {
		a.fillStyle = "#3f0";
		a.fillText("ROUND " + level + ": " + boss.id, 
					c.width / 2, (c.height / 4) - 50);
	}
	a.restore();
}

/******************************/
/* Initialization routines    */
/******************************/

// create players
var backgrounds = [];
var players = [];
var bling = [];
var bonus = [];
var boss;

// object data
loadGameData();

// process movements
window.addEventListener('keydown',doKeyDown,true);
c.addEventListener('mousedown',unPause,true);

// main animation loop
setInterval(function(){

    // clear the screen
    a.globalCompositeOperation = 'destination-over';
    a.clearRect(0, 0, screen_width, screen_height);

    // loop through players
    for (var i in players) {
        players[i].update();
        checkCollide(i);
        if (!pause) checkScore(i); 
    }
    
    // check game state
	if (pause) {
	
		drawMessage();
		
		pause = (pause > 6) ? 1 : pause + 1;

		// keep updating bling (collision hearts)
		for (var i in bling) {
		    bling[i].update();
		}
				
    } else {
    
		// update boss
		boss.update();
		
		// loop through bling
		for (var i in bling) {
		    bling[i].update();
		    if (!bling[i].alive) {
			    bling[i] = new Star(i % 4);
		    }
		}
		
		if (bling.length < 32) { // max stars
			bling.push(new Star(bling.length % 4));
		}
		
	}
    
}, 40);


