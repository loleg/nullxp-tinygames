function Car() {
    this.X = 0, this.Y = 0;
    this.Color = 0, this.Speed = 1;
    this.Width = 32, this.Height = 18;
    this.Alive = true;
    this.update = function() {
        a.save();
        if (this.Alive) this.move();
        a.translate(this.X, this.Y);
        a.scale((this.Speed < 0) ? -1.0 : 1.0, 1.0);
        a.beginPath();
        if (this.Alive) {
            this.drawC();
        } else {
            this.drawX();
        }
        a.restore();
    };
    this.move = function() {
        this.X = (this.X < -this.Width) ? screen_width + this.Width : 
                 (this.X > screen_width + this.Width) ? -this.Width : 
                     this.X + this.Speed;
    };
    this.drawC = function() {
        // windows
        a.fillStyle = "#8af";
        a.fillRect(this.Width*.6, this.Height*.1, this.Width*.2, this.Height*.8);
        
        // wheels
        a.fillStyle = "#444";        
        a.fillRect(this.Width*.1, -this.Height*.1, this.Width*.2, this.Height*.1);
        a.fillRect(this.Width*.5, -this.Height*.1, this.Width*.2, this.Height*.1);
        a.fillRect(this.Width*.1, this.Height, this.Width*.2, this.Height*.1);
        a.fillRect(this.Width*.5, this.Height, this.Width*.2, this.Height*.1);
        
        this.drawB();
    };
    this.drawX = function() {
        a.globalAlpha = 0.5;
        
        // windows
        a.moveTo(this.Width*.6, this.Height*.1);
        a.lineTo(this.Width*.8, this.Height*.4);
        a.lineTo(this.Width*.6, this.Height*.6);
        a.lineTo(this.Width*.8, this.Height*.9);
        a.strokeStyle = "#36a";
        a.stroke(); 
       
        this.drawB();
    };
    this.drawB = function() {        
        // car body
        a.fillStyle = '#'+'ceffbbffbafacee66fddfd8bddc'.substr(this.Color*3,3);
        a.fillRect(0, 0, this.Width, this.Height);
    };
};

var hammer = {
    X: 0, Y: 0, D: 0, Active: false, Wham: false,
    startMillis: 0, score: 0, text: '', textScroll: 5,
    draw: function() {
        a.save();
        a.beginPath();
        a.arc(this.X, this.Y, this.D / 2, 0, Math.PI*2, true);
        a.fillStyle = "rgba(0, 0, 0," + this.D/hammer_size + ")";
        if (this.D > hammer_size - 5) a.fillStyle = "red";
        a.fill();
        a.restore();
    },
    start: function() {
        this.Active = true; this.Wham = false;
        this.D = 2; 
        this.draw();
    },
    update: function() {
        if (this.Active) {
            this.draw();
            this.D += 4;
            // when to stop hammer and trigger wham!
            if (this.D > hammer_size) {
                this.Active = false;
                this.Wham = true;
            }
            // note down start of game for score
            if (this.startMillis == 0 && this.score == 0) {
                this.startMillis = (new Date()).getTime();   
            }
        }
        this.drawText();
    },
    cancel: function() {
        this.Active = this.Wham = false; 
    },
    drawText: function() {
        if (this.text == '') { return; }
        this.textScroll *= 1.1;
        if (this.textScroll > screen_width) { this.text = ''; }
        a.fillStyle = '#fff';
        a.font = 'bold 12px sans-serif';
        a.textBaseline = 'top';
        a.fillText(this.text, this.textScroll, 285);       
    },
    write: function(txt) {
        this.text = txt;
        this.textScroll = 5;
    }
};
    
// create a bucket load of little cars
var cars = [];
for (var i = 0; i < number_cars; i++) {
    cc = new Car();
    // randomize starting position and speed
    cc.X = Math.random()*(screen_width - cc.Width);
    cc.Speed = Math.floor(Math.random()*7) + 1;
    cc.Speed *= (i >= number_cars/2) ? -1 : 1;
    // pick next vertical lane color
    cc.Y = 100 + i*(8 + cc.Height);
    cc.Y += (i >= number_cars/2) ? 5 : 0;
    cc.Color = i + 1;
    cars.push(cc);
    //fx(car.Color,5,15)
}

// main animation loop
setInterval(function(){
    // clear the screen
    a.globalCompositeOperation = 'destination-over';
    a.clearRect(0, 0, screen_width, screen_height);
    // update the hammer shadow
    hammer.update();
    // loop through cars
    var carsAlive = 0, carsWhammed = 0;
    var cw2 = (cars[0].Width / 2), ch2 = (cars[0].Height / 2), h2 = hammer_size / 2;
    for (var i = 0; i < number_cars; i++) {
        // needs better collision detection
        if (hammer.Wham && cars[i].Alive) {
           var midX = cars[i].X + cw2;
           var midY = cars[i].Y + ch2;
           if (midX > hammer.X - h2 && midX < hammer.X + h2
            && midY > hammer.Y - h2 && midY < hammer.Y + h2) {
                cars[i].Alive = false;
                carsWhammed++;
           }
        }
        // check if any cars are alive
        if (cars[i].Alive) carsAlive++;
        // move and redraw the car
        cars[i].update();
    }
    hammer.Wham = false;
    if (carsWhammed > 0) {
        hammer.score += carsWhammed * 100 + (carsWhammed - 1) * 200;
        if (carsAlive > 4) {
            hammer.write("Smack their tops! Your score: " + hammer.score);
        } else if (carsAlive > 2) {
            hammer.write("Keep going! Your score: " + hammer.score);
        } else if (carsAlive > 1) {
            hammer.write("Almost there! Your score: " + hammer.score);
        } else if (carsAlive > 0) {
            hammer.write("One more to go! Your score: " + hammer.score);
        }
    }
    if (carsAlive == 0) {
        if (hammer.startMillis != 0) {
            // get milliseconds elapsed
            var lapse = ((new Date()).getTime() - hammer.startMillis) / 1000;
            if (lapse < 20) hammer.score += 100 * Math.floor(20 - lapse);
            hammer.startMillis = 0;
        }
        hammer.write("Aahh..peace & quiet at last. Your score: " + hammer.score);
    }
}, 40);

// set up interaction
onmousedown = function(e) {
    hammer.X = e.clientX - c.offsetLeft;
       //+ (window.pageXOffset||document.body.scrollLeft||document.documentElement.scrollLeft);
    hammer.Y = e.clientY - c.offsetTop;
       //+ (window.pageYOffset||document.body.scrollTop||document.documentElement.scrollTop);
    hammer.start();
};
onmouseup = function(e) {
    hammer.cancel();
};

