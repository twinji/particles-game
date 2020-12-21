var WIDTH = 1280, HEIGHT = 720;
var key, aKey = 65, dKey = 68, wKey = 87, sKey = 83, vKey = 86, nKey = 78, left = 37, right = 39, up = 38, down = 40, escape = 27, space = 32, num6 = 102, num4 = 100, num5 = 101, num8 = 104, uKey = 85, hKey = 72, jKey = 74, kKey = 75;
var num1 = 49, num2 = 50;
var canvas, c, menuHandler;
var player, players, bullet, bullets, particle, particles;
var secondTimer;
var gameStarted = false, gameOver = false, numOfPlayers;
var popSound, bgMusic;

function main() {
    canvas = document.getElementById("canvas");
    c = canvas.getContext("2d");
    canvas.width = WIDTH;
    canvas.height = HEIGHT;    
    canvas.focus();
    
    popSound = new Audio();
    popSound.src = "audio/shatter.mp3";
    
    bgMusic = new Audio();
    bgMusic.src = "audio/bgmusic.mp3";
	bgMusic.volume = 0.6;
    bgMusic.loop = true;
    bgMusic.play();

    key = [];
    window.addEventListener("keydown", function(e) {key[e.keyCode] = true; e.preventDefault();});
    window.addEventListener("keyup", function(e) {key[e.keyCode] = false; e.preventDefault();});
    
    var gameLoop = function() {
        update();
        render();
        window.requestAnimationFrame(gameLoop, canvas);
    }
    window.requestAnimationFrame(gameLoop, canvas);
}

function init(n) {
    if (n < 1) n = 1; if (n > 4) n = 4;
    if (n > 0) new player(canvas.width * 0.6, canvas.height * 0.2, 20, "gold", 6, wKey, sKey, aKey, dKey);
    if (n > 1) new player(canvas.width * 0.6, canvas.height * 0.4, 20, "aqua", 6, uKey, jKey, hKey, kKey);
    if (n > 2) new player(canvas.width * 0.6, canvas.height * 0.6, 20, "lime", 6, up, down, left, right);
    if (n > 3) new player(canvas.width * 0.6, canvas.height * 0.8, 20, "violet", 6, num8, num5, num4, num6);
    bullets.create(players.playersArray.length * 4);
    secondTimer.init(50, 50, true, 0);
	bgMusic.play();
}

function update() {
	secondTimer.update();
    bullets.update();
    players.update();
    particles.update();
	menuHandler.update();
    if (key[escape]) location.reload(true);
}

function render() {
    c.clearRect(0, 0, canvas.width, canvas.height);
    var g = c.createLinearGradient(canvas.width, 0, 0, 0);
    
    g.addColorStop(0, "rgba(0, 0, 0, 1)");
    g.addColorStop(0.96, "rgba(80, 10, 45, 1)");
    c.fillStyle = g;
    c.fillRect(0, 0, canvas.width, canvas.height);
    
    secondTimer.render();
    bullets.render();
    players.render();
    particles.render();
    menuHandler.render();
}

function clearAll() {
    players.playersArray = [];
    players.results = [];
    bullets.bulletsArray = [];
    particles.particlesArray = [];
}

menuHandler = {
    update: function() {
        if (gameStarted && players.playersArray.length === 0) {
			gameOver = true;
			bgMusic.pause();
		}
        if (key[space]) {
            if (!gameStarted) {
                numOfPlayers = prompt("How many user players? Between 1 and 4.\nControls are listed below the game window for each player.", "");
                while (isNaN(numOfPlayers) || (numOfPlayers < 1 || numOfPlayers > 4)) numOfPlayers = prompt("How many user players?\nThe number must be between 1 and 4.", "");
                key[space] = false;
                init(numOfPlayers);
                gameStarted = true;
            } else if (gameStarted && gameOver) {
                gameOver = false;
				bgMusic.currentTime = 0;
                clearAll();
                init(numOfPlayers);
            }
        }
    },
    render: function() {
        if (!gameStarted) {
            c.save();
            c.textAlign = "center";
            c.textBaseline = "middle";
            c.font = "40px Arial";
            c.fillStyle = "rgba(255, 30, 130, 0.4)";
            c.fillText("P A R T I C L E S", canvas.width / 2, canvas.height / 2);
            c.font = "12px Arial";
            c.fillStyle = "rgba(255, 30, 130, 1)";
            c.fillText("P R E S S   S P A C E   T O   P L A Y", canvas.width / 2, canvas.height / 2 + 30);
        }
        if (gameOver) {
            c.save();
            c.textAlign = "center";
            c.textBaseline = "middle";
            c.font = "40px Arial";
            c.fillStyle = "rgba(255, 30, 130, 0.4)";
            c.fillText("G A M E   O V E R", canvas.width / 2, canvas.height / 2.3);
            c.font = "12px Arial";
            c.fillStyle = "rgba(255, 30, 130, 1)";
            c.textAlign = "left";
            for (var i = 0; i < players.results.length; i++) {
                var p = players.results[i];
                c.fillStyle = p[0];
                c.fillText("(" + (i + 1) + ")  " + p[0].toUpperCase() + " died after " + p[1] + " seconds", canvas.width / 2.3, canvas.height / 2.1 + (i + 1) * 20);
            }
            c.textAlign = "center";
            c.fillStyle = "rgba(255, 30, 130, 1)";
            c.fillText("P R E S S   S P A C E   T O   P L A Y   A G A I N", canvas.width / 2, canvas.height / 2.1 + (i + 2) * 20);
            c.fillStyle = "rgba(255, 30, 130, 0.5)";
            c.fillText("P R E S S   E S C A P E   TO   R E T U R N   TO   M A I N   S C R E E N", canvas.width / 2, canvas.height / 2.1 + (i + 3) * 20);
        }
    }
}

secondTimer = {
	x: null, y: null,
	time: null,
	d: null, s: null,
	radius: null,
	start: false,
	init: function(x, y, boolean, startTime) {
		this.x = x;
		this.y = y;
		this.time = startTime;
		this.d = new Date();
		this.s = (this.d.getSeconds()).toFixed(0);
		this.radius = 40;
		this.start = boolean;
	},
	update: function() {
		if (this.start) {
			var d = new Date();
			if (new Date().getSeconds().toFixed(0) !== this.s) {
				bullets.bulletCap += 100;
                if (players.playersArray.length !== 0) {
				    this.time++;	
                }
			}
			this.s = (d.getSeconds()).toFixed(0);
            if (gameStarted && gameOver) this.start = false;
		}
	},
	render: function() {
        if (this.start) {
            c.save();
            c.textAlign = "center";
            c.textBaseline = "middle";
            c.font = "770px Arial";
            c.fillStyle = "rgba(255, 30, 130, 0.06)";
            c.fillText(this.time, canvas.width / 2, canvas.height / 2);
            
            c.font = "13px Arial";
            c.fillStyle = "rgba(255, 30, 130, 0.4)";
            c.fillText("P A R T I C L E S :  " + bullets.bulletsArray.length + "  /  " + bullets.bulletCap, canvas.width / 2, canvas.height - 20);
            c.restore();
        }
	}
};

players = {
    playersArray: [],
    results: [],
    update: function() {
        for (var i = 0; i < this.playersArray.length; i++) {
            var p = this.playersArray[i];
            if (p.health <= 0) p.destroy(i);
            p.update();
        }
    },
    render: function() {for (var i = 0; i < this.playersArray.length; i++) this.playersArray[i].render();}
};

player = function(x, y, radius, color, spd, upKey, downKey, leftKey, rightKey) {
    players.playersArray.push(this);
    this.x = x;
    this.y = y;
    this.maxHealth = 100;
    this.health = this.maxHealth;
    this.radius = radius;
    this.color = color;
    this.spd = spd;
    this.velX = 0;
    this.velY = 0;
    this.friction = 0.84;
    this.hit = false;
    this.sound = new Audio();
    this.sound.src = "audio/blast.wav";
    this.destroy = function(i) {
        particles.create(this.x, this.y, this.color, this.radius * 3, 14);
        this.sound.play();
        players.playersArray.splice(i, 1);
        players.results.unshift([this.color, secondTimer.time]);
		console.log(this.color + " survived for " + secondTimer.time + " seconds");
    };
    this.hitBy = function(obj) {
        if (obj.healthPack) {
            this.health += Math.round(8 * obj.radius);
            obj.sound.play();
            particles.create(obj.x, obj.y, obj.color, obj.radius * 12, 24);
        } else {
            this.health -= obj.spd.toFixed(0) * 5;
            particles.create(obj.x, obj.y, obj.color, obj.radius, 10);
            particles.create(obj.x, obj.y, this.color, obj.radius, 6);
            this.hit = true;
        }
        this.health = Math.min(this.maxHealth, Math.max(0, this.health));
    };
    this.update = function() {	
        if (key[upKey]) {this.velY = -this.spd;} else if (key[downKey]) {this.velY = this.spd;}
        if (key[leftKey] && !this.hit) {this.velX = -this.spd;} else if (key[rightKey] || this.hit) {this.velX = this.spd;}
        this.velX *= this.friction;
        this.velY *= this.friction;
        this.x += this.velX;
        this.y += this.velY;	
        this.x = Math.min(canvas.width - this.radius, Math.max(this.x, this.radius));
        this.y = Math.min(canvas.height - this.radius, Math.max(this.y, this.radius));
        this.hit = false;
    };
    this.render = function() {
        var glowRadius = this.radius + (30 * (this.health / 10));
        var g = c.createRadialGradient(this.x, this.y, 0, this.x, this.y, glowRadius);
        g.addColorStop(0, this.color);
        g.addColorStop(1, "transparent");
        drawCircle(c, this.x, this.y, glowRadius, g, 0.2, true);
        drawCircle(c, this.x, this.y, this.radius, this.color, 1, true);
        
        c.save();
        c.textAlign = "center";
        c.textBaseline = "middle";
        c.font = "20px Arial";
        c.fillStyle = "black";
        c.fillText(this.health, this.x, this.y);
        c.restore();
    };
};

bullets = {
    bulletsArray: [],
    maxBulletSpeed: 7,
    minBulletSpeed: 2,
    bulletCap: players.playersArray.length * 4,
    create: function(number) {for (var i = 0; i < number; i++) this.bulletsArray.push(new bullet());},
    collisionDetect: function() {
        for (var i = 0; i < this.bulletsArray.length; i++) {
            var b = this.bulletsArray[i];
            for (var j = 0; j < players.playersArray.length; j++) {
                var p = players.playersArray[j];
                if (pointDistance(p.x, p.y, b.x, b.y) < p.radius + b.radius) {
                    p.hitBy(b);
                    b.destroy(i);
                }
            }
        }
    },
    update: function() {
		for (var i = 0; i < this.bulletsArray.length; i++) {
			this.bulletsArray[i].update(); 
		}
		this.collisionDetect();},
    render: function() {for (var i = 0; i < this.bulletsArray.length; i++) this.bulletsArray[i].render();}
};

bullet = function() {
    this.x;
    this.y;
    this.color;
    this.spd = null;
    this.alpha = null;
    this.healthPack = false;
    this.sound;
    this.generateRandomProperties = function() {
        this.x = -Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.spd = bullets.minBulletSpeed + (bullets.maxBulletSpeed - bullets.minBulletSpeed) * Math.random();
        this.radius = this.spd;
        this.alpha = this.radius * 1.5 / 10;
        if (Math.random() <= 0.05) {
            this.healthPack = true;
            this.sound = new Audio();
            this.sound.src = "audio/blast.wav";
            this.color = "white";
        } else {
            this.healthPack = false;
            this.sound = null;
            this.color = Math.random() >= 0.3 * players.playersArray.length? "red":"rgba(250, 50, 0, 1)";
        }
    };
    this.generateRandomProperties();
    this.destroy = function(i) {
        if (this.sound === null) {
            popSound.currentTime = 0;
            popSound.play();
        }
        bullets.bulletsArray.splice(i, 1);
    };
    this.update = function() {
        this.x += this.spd;
        if (this.x > canvas.width + this.radius * 2) {
            if (bullets.bulletsArray.length < bullets.bulletCap && players.playersArray.length > 0) bullets.create(2);
            this.generateRandomProperties();
        }
    };
    this.render = function() {
        if (this.healthPack) {
            c.save();
            for (var i = 0; i < bullets.bulletsArray.length; i++) {
                var b = bullets.bulletsArray[i];
                if (pointDistance(this.x, this.y, b.x, b.y) < 170) {
                    c.beginPath();
                    c.lineWidth = 0.4;
                    c.strokeStyle = this.color;
                    c.moveTo(this.x, this.y);
                    c.lineTo(b.x, b.y);
                    c.stroke();
                    c.closePath();
                }
            }
            c.restore();
            var g = c.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius * 70);
            g.addColorStop(0, "rgba(255, 0, 255, 0.25)");
            g.addColorStop(1, "transparent");
            drawCircle(c, this.x, this.y, this.radius * 70, g, 1, true);
            drawCircle(c, this.x, this.y, this.radius, this.color, 1, true);
        } else {
            drawCircle(c, this.x, this.y, this.radius, this.color, this.alpha, true);
            drawCircle(c, this.x, this.y, this.radius, this.color, this.alpha, false);
        }
    };
};

particles = {
    particlesArray: [],
    create: function(x, y, color, size, num) {for (var i = 0; i < num; i++) this.particlesArray.push(new particle(x, y, size, color));},
    collisionDetect: function() {
        for (var j = 0; j < this.particlesArray.length; j++) {
            var c = this.particlesArray[j];
            for (var k = 0; k < bullets.bulletsArray.length; k++) {
                var b = bullets.bulletsArray[k];
                if (pointDistance(c.x, c.y, b.x, b.y) < c.radius + b.radius && c.radius >= 0.6) {
                    particles.create(b.x, b.y, b.color, b.radius, 10);
                    b.destroy(k);
                }
            }
        }
    },
    update: function() {
        for (var i = 0; i < this.particlesArray.length; i++) {
            var p = this.particlesArray[i];
            if (p.alpha <= 0 || !withinStage(p.x, p.y, p.radius)) p.destroy(i);
            p.update();
        }
        this.collisionDetect();
    },
    render: function() {for (var i = 0; i < this.particlesArray.length; i++) this.particlesArray[i].render();}
};

particle = function(x, y, size, color) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.dir = 2 * Math.PI * Math.random();
    this.radius = (Math.random() + Math.random()) * size;
    this.alpha = 1;
    this.destroy = function(i) {
        particles.particlesArray.splice(i, 1);
    };
    this.update = function() {
        this.x += Math.cos(this.dir) * (this.radius / 2);
        this.y += Math.sin(this.dir) * (this.radius / 2);
        this.x += this.radius / 10;
        this.alpha -= 0.012;
        this.radius *= this.alpha + 0.05;
    };
    this.render = function() {
        var g = c.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius);
        g.addColorStop(1, this.color);
        g.addColorStop(0, "rgba(0, 0, 0, 0)");
        drawCircle(c, this.x, this.y, this.radius, g, this.alpha, true);
    };
};

function pointDistance(x1, y1, x2, y2) {
    var diffX = x2 - x1;
    var diffY = y2 - y1;
    return Math.sqrt((diffX * diffX) + (diffY * diffY));
}

function drawCircle(context, x, y, radius, color, alpha, fill) {
    if (withinStage(x, y, radius)) {
        context.globalAlpha = alpha;
        context.save();
        context.beginPath();
		context.arc(x, y, radius, 0, 2 * Math.PI);
		
		if (fill) {context.fillStyle = color; context.fill();}
		else {context.strokeStyle = color; context.stroke();}
		
        context.closePath();
        context.restore();
        context.globalAlpha = 1;
    }
}

function withinStage(x, y, radius) {
    return (!(x + radius < 0 && x - radius > canvas.width) && !(y + radius < 0 && x - radius > canvas.height));
}
