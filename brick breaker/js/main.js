// main.js
// Dependencies: 
// Description: singleton object
// This object will be our main "controller" class and will contain references
// to most of the other objects in the game.

"use strict";

// if app exists use the existing copy
// else create a new object literal
var app = app || {};

/*
 .main is an object literal that is a property of the app global
 This object literal has its own properties and methods (functions)
 // hello2
 */
app.main = {
	//  properties
    WIDTH : 1200, 
    HEIGHT: 700,
    canvas: undefined,
    ctx: undefined,
   	lastTime: 0, // used by calculateDeltaTime() 
    debug: false,
    first: true,
    paused: false,
    pauseCircles: true,
    animationID: 0,
    gameState: undefined,
    roundScore: 0,
    roundGoal: 6,
    level: 1,
    lives: 1,
    player: 0,
    ball: 0,
    MAX_LIVES: 2,
    totalScore: 0,
    colors: ["#FD5B78","#FF6037","#FF9966","#FFFF66","#66FF66","#50BFE6","#FF6EFF","#EE34D2"],
    bgAudio: undefined,
	effectAudio : undefined,
	currentEffect : 0,
	currentDirection : 1,
	effectSounds :
	["1.mp3","2.mp3","3.mp3","4.mp3","5.mp3","6.mp3","7.mp3","8.mp3"],

    CIRCLE: Object.freeze({
    	NUM_CIRCLES_START: 5,
    	NUM_CIRCLES_END: 70,
    	START_RADIUS: 10,
    	MAX_RADIUS: 45,
    	MIN_RADIUS: 2,
    	MAX_LIFETIME: 2.5,
    	MAX_SPEED: 100,
    	EXPLOSION_SPEED: 60,
    	IMPLOSION_SPEED: 84
    }),

    GAME_STATE: Object.freeze({
    	SMALL: 0,
    	BEGIN: 1,
    	DEFAULT: 2,
    	EXPLODING: 3,
    	ROUND_OVER: 4,
    	REPEAT_LEVEL: 5,
    	END: 6
    }),


   	CIRCLE_STATE: Object.freeze({
   		NORMAL: 0,
   		EXPLODING: 1,
   		MAX_SIZE: 2,
   		IMPLODING: 3,
   		DONE: 4
   	}),
/*
   	PLAYER: Object.seal({
   		player.w: 25,
   		player.h: 10,
   		SPEED: 1,
   		EXTEND: 0,
   		X: 640 / 2,
   		Y: 480 - 25
   	}),
*/
   	circles: [],
   	numCircles: this.NUM_CIRCLES_START,
    
    
    // methods
	init : function() {
		console.log("app.main.init() called");
		// initialize properties
		this.canvas = document.querySelector('canvas');
		this.canvas.width = this.WIDTH;
		this.canvas.height = this.HEIGHT;
		this.ctx = this.canvas.getContext('2d');
		
		this.numCircles = this.CIRCLE.NUM_CIRCLES_START;
		this.circles = this.makeCircles(this.numCircles);
		//console.log("this.circles = " + this.circles);

		this.gameState = this.GAME_STATE.SMALL;
		

		//this.canvas.onmousedown = this.domousedown.bind(this);	

		this.bgAudio = document.querySelector("#bgAudio");
		this.bgAudio.volume=0.25;
		this.effectAudio = document.querySelector("#effectAudio");
		this.effectAudio.volume = 0.3;

		this.level = 0;

		//this.reset();
		this.totalScore = 0;
		this.lives = this.MAX_LIVES;

		this.player = {
	   		w: 100,
	   		h: 10,
	   		SPEED: 7,
	   		EXTEND: 0,
	   		x: canvas.width/2,
	   		y: canvas.height - 10 - 2
   		};
   		this.ball = {
   			x : canvas.width / 2,
			y : canvas.height - 100,
			radius : 10,
			speed : 20
   		};
   		this.gameState = this.GAME_STATE.BEGIN;
   		//this.drawHUD(this.ctx);
   		makeMap1();
		//this.drawPlayer(this.ctx, this.player);
		this.update();



		//this.drawHUD(this.ctx);
	},

	makeFullscreen: function(){
		requestFullscreen(canvas);
		canvas.width= window.innerWidth;
		canvas.height = window.innerHeight;
		app.main.WIDTH = canvas.width;
		app.main.HEIGHT = canvas.height;	
		this.gameState = this.GAME_STATE.BEGIN;
		this.update();
	},


	resize1: function(){
		app.main.gameState = app.main.GAME_STATE.SMALL;
 		app.main.drawHUD(app.main.ctx);
 		window.removeEventListener("resize", this.resize1);
	},

	setupFullscreen: function(){
		requestFullscreen(canvas);
		canvas.width= window.innerWidth;
		canvas.height = window.innerHeight;
		app.main.WIDTH = canvas.width;
		app.main.HEIGHT = canvas.height;
		this.player = {
	   		w: 35,
	   		h: 10,
	   		SPEED: 3,
	   		EXTEND: 0,
	   		x: 900 / 2,
	   		y: canvas.height - 10 - 2
   		};
   		this.ball = {
   			x : canvas.width / 2,
			y : canvas.height - 100,
			radius : 10,
			speed : 80
   		};
   		this.gameState = this.GAME_STATE.BEGIN;
   		//this.drawHUD(this.ctx);
   		makeMap1();
		//this.drawPlayer(this.ctx, this.player);
		this.update();
		//console.log('game ' + this.gameState);
		// start the game loop

	},

	stopBGAudio: function(){
	 	this.bgAudio.pause();
	 	this.bgAudio.currentTime = 0;
	},

	drawPlayer: function(ctx, player){
		ctx.save();
		//console.log('x ' + player.x);
		//console.log(myKeys.keydown[37]);
		var movePlayer = function(){
			if(myKeys.keydown[37]){
				// move left
				if(player.x > 0){
					player.x -= player.SPEED;
				}
			}
			if(myKeys.keydown[39]){
				// move right
				if(player.x < canvas.width){
					player.x += player.SPEED;
				}
			}

		};
		
		movePlayer();
		ctx.fillStyle = 'white';
		//ctx.fillRect(150, 150, 50, 50);
		ctx.fillRect(player.x, player.y, player.w, player.h);
		ctx.restore();


	},

	resetGame: function(){
		//this.level = 0;
		//this.totalScore = 0;
		//this.lives = this.MAX_LIVES;
		//this.numCircles = this.CIRCLE.NUM_CIRCLES_START;
		this.gameState = this.GAME_STATE.BEGIN;
		this.newBall(this.player.x + (this.player.w / 2), canvas.height - 100, 0, 0);

		//this.reset();
	},


	reset: function(){
		if(this.gameState == this.GAME_STATE.REPEAT_LEVEL){
			this.gameState = this.GAME_STATE.DEFAULT;
		}else{
			this.numCircles += 5;
			this.level++;
			this.lives = this.MAX_LIVES;
		}
		this.roundScore = 0;
		this.circles = this.makeCircles(this.numCircles);
		
		if(this.numCircles % 2 == 0){
			this.roundGoal = this.numCircles / 2 + this.level;
		}else{
			this.roundGoal = (this.numCircles + 1) / 2 + this.level;
		}
	},

	domousedown: function(e){
		/*console.log("e=" + e);
		console.log("e.target=" + e.target);
		console.log("this=" + this);
		console.log("e.pageX=" + e.pageX);
		console.log("e.pageY=" + e.pageY);
		*/

		this.bgAudio.play();


		if(this.paused){
			this.paused = false;
			this.update();
			return;
		}

		// TSMITH -- Do not return, still needs state checking logic below
		if(this.pauseCircles){
			this.pauseCircles = false;
		}

/* TSMITH - Not needed for breakout
		if(this.gameState == this.GAME_STATE.BEGIN){
			this.gameState = this.GAME_STATE.DEFAULT;
			return;
		}

		*/

		console.log('do something');
		if(this.gameState == this.GAME_STATE.DEFAULT){
			return;
		}
		if(this.gameState == this.GAME_STATE.ROUND_OVER){
			//this.pauseCircles = true;
				//this.lives--;
				if(this.lives == 0){
					this.gameState = this.GAME_STATE.END;
					this.stopBGAudio();
				
				//this.gameState = this.GAME_STATE.BEGIN;
				//this.reset();
				return;
			}
		}
		if(this.gameState == this.GAME_STATE.END){
			//this.pauseCircles = true;

			//this.resetGame();
			return;
		}


		var mouse = getMouse(e);
		//this.checkCircleClicked(mouse);
		//console.log("(mouse.x, mouse.y)=" + mouse.x + "," + mouse.y);
	},


/*

 drawBall : function(ctx, dt, ball, player, app){
 		
		var moveBall = function(dt, ball, player, app){
		ball.x += ball.xSpeed * ball.speed * dt;
		ball.y += ball.ySpeed * ball.speed * dt;
		
			if(app.gameState == app.GAME_STATE.BEGIN){
				ball.x = player.x + player.w/2;
				//app.drawBall(ctx, dt, ball, player);
			}
			if(app.circleHitLeftRight(ball))
				{
					 ball.xSpeed *= -1;
					 moveBall(dt, ball, player, app);
				}
	 			if(app.circleHitTopBottom(ball) == 0)
	 			{
					ball.ySpeed *= -1;
					moveBall(dt, ball, player, app);
			}
		};

		var fillBall = function(){
			ctx.save();
			ctx.fillStyle = 'white';
			ctx.beginPath();
			ctx.arc(ball.x, ball.y, ball.radius, 0, 2 * Math.PI, false);
			ctx.closePath();
			ctx.fill();
			ctx.restore();
		};

		moveBall(dt, ball, player, app);
		fillBall();

	},
	*/

checkForCollisions: function(dt){
		if(this.gameState == this.GAME_STATE.DEFAULT){
			// check for collisions between circles
			for(var i=0;i<this.circles.length; i++){
				var c1 = this.circles[i];
				// did circles leave screen?

				if(this.circleHitLeftRight(c1))
				{
					 c1.xSpeed *= -1;
					 c1.move(dt);
					 return;
				}

				switch(this.circleHitTopBottom(c1)){
					case 0:
						c1.ySpeed *= -1;
						c1.move(dt);
						return;
						break;
					case 1:
						c1.kill();
						if(this.lives != 0){
							this.resetGame();
						}
						return;
						break;
					default:
				}
				if(checkIntersect(c1,app.main.player) ){
						//this.playEffect();
						//c2.state = this.CIRCLE_STATE.EXPLODING;
						c1.ySpeed *= -1;
						calculateAngle(c1);
						return;
						//var x = c1.x+ c1.radius;
						//var y = app.main.player
					}

		/*
				for(var i = 0; i < shapeRowAll.length; i ++){
					for(var j = 0; j < shapeRowAll[i].length; j++){
						var temp = shapeRowAll[i][j];

						if(temp){
							console.log('ttt ' + temp);
						}
					}
				}
				*/
				
				for(var j = 0; j < blocks.length; j ++){
					if(checkIntersectBlock(c1, blocks[j])){
						c1.ySpeed *= -1; 
						blocks[j].beenHit(c1);
						lethalStatusCheck(blocks[j].row, blocks[j].rowIndex);
						return;
					}
				}
				/*
				// only check for collisions if c1 is exploding
				for(var j=0;j<this.circles.length; j++){
					var c2 = this.circles[j];
				// don't check for collisions if c2 is the same circle
					if (c1 === c2) continue; 
				// don't check for collisions if c2 is already exploding 
					//if (c2.state != this.CIRCLE_STATE.NORMAL ) continue;  
					//if (c2.state === this.CIRCLE_STATE.DONE) continue;
				
					// Now you finally can check for a collision

				}

				*/
			} // end for
			/*
			// round over?
			var isOver = true;
			for(var i=0;i<this.circles.length; i++){
				var c = this.circles[i];
				if(c.state != this.CIRCLE_STATE.NORMAL && c.state != this.CIRCLE_STATE.DONE){
				 isOver = false;
				 break;
				}
			} // end for
		
			if(isOver){
				this.stopBGAudio();
				this.gameState = this.GAME_STATE.ROUND_OVER;
				this.totalScore += this.roundScore;
			 }
				*/
		} // end if GAME_STATE_EXPLODING
	},

	playEffect: function (){
		this.effectAudio.src = "media/" + this.effectSounds[this.currentEffect];
		this.effectAudio.play();

		this.currentEffect += this.currentDirection;
		if(this.currentEffect == this.effectSounds.length || this.currentEffect == -1){
			this.currentDirection *= -1;
			this.currentEffect += this.currentDirection;
		}
	},

	checkCircleClicked: function(mouse){
		for(var i = this.circles.length - 1; i >= 0; i--){
			var c = this.circles[i];
			if(pointInsideCircle(mouse.x, mouse.y, c)){
				//c.fillStyle = "red";
				this.playEffect();
				c.xSpeed = c.ySpeed = 0;
				c.state = this.CIRCLE_STATE.EXPLODING;
				this.gameState = this.GAME_STATE.EXPLODING;
				this.roundScore++;
				break;
			}
		}
	},

	drawPauseScreen: function(ctx){
		ctx.save();
		ctx.fillStyle = "black";
		ctx.fillRect(0,0,this.WIDTH,this.HEIGHT);
		ctx.textAlign = "center";
		ctx.textBaseline = "middle";
		this.fillText(this.ctx, "... PAUSED ...", this.WIDTH/2, this.HEIGHT/2, "40pt courier", "white");
		ctx.restore();
	},
	
	update: function(){
		// 1) LOOP
		// schedule a call to update()
		//this.ctx.clearRect(0,0, this.ctx.width, this.ctx.height);
	 	this.animationID = requestAnimationFrame(this.update.bind(this));
	 	
	 	// 2) PAUSED?
	 	// if so, bail out of loop
	 	if(this.paused){
	 		this.drawPauseScreen(this.ctx);
	 		return;
	 	}

	 	
	 	// 3) HOW MUCH TIME HAS GONE BY?
	 	var dt = this.calculateDeltaTime();
	 	 
	 	// 4) UPDATE
	 	// move circles.

	 	// TSMITH -- when text is on the screen, stop moving the circles
	 	if(!this.pauseCircles){
		 	//this.moveCircles(dt);
		 	//this.checkForCollisions();
		 }
		// 5) DRAW	
		// i) draw background
		this.ctx.fillStyle = "black"; 
		this.ctx.fillRect(0,0,this.WIDTH,this.HEIGHT); 
	
		// ii) draw circles
		this.ctx.globalAlpha = 0.9;
		this.drawPlayer(this.ctx, this.player);
		drawMap();
		//this.drawBall(this.ctx, dt, this.ball, this.player, app.main);
		this.moveCircles(dt);

		//check DOT
		for (var i = 0; i < blocks.length; i ++)
		{
			if (blocks[i].burn || blocks[i].poison)
			{
				shapeRowAll[blocks[i].row][blocks[i].rowIndex].tickDOT();
			}
			lethalStatusCheck(blocks[i].row, blocks[i].rowIndex);	
		}

		//check ball brick collisions
		this.checkForCollisions(dt);
		for (var i = 0; i < blocks.length; i ++)
			{ lethalStatusCheck(blocks[i].row, blocks[i].rowIndex);	}

		this.drawCircles(this.ctx);


	
		// iii) draw HUD
		this.ctx.globalAlpha = 1.0;
		this.drawHUD(this.ctx);

		if(this.gameState == this.GAME_STATE.BEGIN || this.gameState == this.GAME_STATE.ROUND_OVER){
			if(myKeys.keydown[myKeys.KEYBOARD.KEY_UP] && myKeys.keydown[myKeys.KEYBOARD.KEY_SHIFT]){
				this.totalScore++;
				this.playEffect();
			}
		}
		// iv) draw debug info
		if (this.debug){
			// draw dt in bottom right corner
			this.fillText(this.ctx, "dt: " + dt.toFixed(3), this.WIDTH - 150, this.HEIGHT - 10, "18pt courier", "white");
		}
		
	},
	
drawHUD: function(ctx){
		ctx.save(); // NEW
		// draw score
      	// fillText(string, x, y, css, color)
		//this.fillText(this.ctx, "This Round: " + this.roundScore + " of " + this.numCircles, 20, 20, "16pt courier", "#ddd");
		//this.fillText(this.ctx, "Goal: " + this.roundGoal, 20, 40, "16pt courier", "#ddd");
		// NEW
		//console.log('winhe ' + window.height);
		//console.log('screenh ' + screen.height);
	/*	if(this.gameState == this.GAME_STATE.SMALL){
	 		//app.main.gameState = app.main.GAME_STATE.SMALL;
	 		//app.main.drawHUD(app.main.ctx);
	 					ctx.fillStyle = 'black';
			app.main.canvas.width = 500;
			app.main.canvas.height = 500;
			ctx.fillRect(0,0, canvas.width, canvas.height);
			ctx.restore();
			var line1 =  this.first ? "To Start Game" : "To Continue Game";
			var xPos = this.first ? 163 : 145;
			this.first = false;
			this.fillText(this.ctx, line1, xPos, canvas.height/2 - 30, "16pt courier", "#ddd");
			this.fillText(this.ctx, "Please Click", 170, canvas.height/2, "16pt courier", "#ddd");
			this.fillText(this.ctx, "Go Full Screen", 155, canvas.height/2 + 30, "16pt courier", "#ddd");
			ctx.restore();
			return;
	 	}
	 	*/

	 	/*
		if(this.gameState == this.GAME_STATE.SMALL){
			console.log('fuck ' + this.gameState);
			ctx.fillStyle = 'black';
			app.main.canvas.width = 1000;
			app.main.canvas.height = 1000;
			ctx.fillRect(0,0, canvas.width, canvas.height);
			ctx.restore();
			var line1 =  this.first ? "To Start Game" : "To Continue Game";
			var xPos = this.first ? 163 : 145;
			this.first = false;
			this.fillText(this.ctx, line1, xPos, canvas.height/2 - 30, "16pt courier", "#ddd");
			this.fillText(this.ctx, "Please Click", 170, canvas.height/2, "16pt courier", "#ddd");
			this.fillText(this.ctx, "Go Full Screen", 155, canvas.height/2 + 30, "16pt courier", "#ddd");
			ctx.restore();
			return;
		}


		*/

		this.fillText(this.ctx, "Total Score: " + this.totalScore, 5, this.HEIGHT - 15, "16pt courier", "#ddd");
		this.fillText(this.ctx, "Lives: " + this.lives, this.WIDTH - 125, this.HEIGHT - 15, "16pt courier", "#ddd");

		if(this.gameState == this.GAME_STATE.BEGIN){
			ctx.textAlign = "center";
			ctx.textBaseline = "middle";
			this.fillText(this.ctx, "To begin, Press UP", this.WIDTH/2, this.HEIGHT/2, "30pt courier", "white");
		} // end if
	
		// NEW
		if(this.gameState == this.GAME_STATE.ROUND_OVER){
			this.pauseCircles = true;
			ctx.save();
			ctx.textAlign = "center";
			ctx.textBaseline = "middle";

			this.fillText(this.ctx, "Round Over", this.WIDTH/2, this.HEIGHT/2 - 40, "30pt courier", "red");
			if(this.roundScore >= this.roundGoal){
				this.fillText(this.ctx, "Click to continue", this.WIDTH/2, this.HEIGHT/2, "30pt courier", "red");
				this.fillText(this.ctx, "Next round there are " + (this.numCircles + 5) + " circles", this.WIDTH/2 , this.HEIGHT/2 + 35, "20pt courier", "#ddd");
			}else{
				this.fillText(this.ctx, "You popped " + this.roundScore + " out of " + this.roundGoal, this.WIDTH/2, this.HEIGHT/2, "30pt courier", "#ddd");
				this.fillText(this.ctx, "You have " +  (this.lives - 1) + " lives remaining", this.WIDTH/2 , this.HEIGHT/2 + 35, "20pt courier", "#ddd");
			}
		} // end if
		if(this.gameState == this.GAME_STATE.END){
			ctx.save();
			ctx.textAlign = "center";
			ctx.textBaseline = "middle";
			ctx.fillStyle = "black";
			ctx.globalAlpha = 1;
			if(this.lives != 0){
				this.fillText(this.ctx, "You Win!", this.WIDTH/2, this.HEIGHT/2 - 40, "50pt courier", "red");
			}else{
				this.fillText(this.ctx, "Game Over", this.WIDTH/2, this.HEIGHT/2 - 40, "30pt courier", "red");
			}
			this.fillText(this.ctx, "Refesh for a New Game", this.WIDTH/2, this.HEIGHT/2, "30pt courier", "white");
			//this.fillText(this.ctx, "Next round there are " + (this.numCircles + 5) + " circles", this.WIDTH/2 , this.HEIGHT/2 + 35, "20pt courier", "#ddd");

		}
		
		ctx.restore(); // NEW
	},
	

	fillText: function(ctx, string, x, y, css, color) {
		this.ctx.save();
		// https://developer.mozilla.org/en-US/docs/Web/CSS/font
		this.ctx.font = css;
		this.ctx.fillStyle = color;
		this.ctx.fillText(string, x, y);
		this.ctx.restore();
	},
	
	calculateDeltaTime: function(){
		// what's with (+ new Date) below?
		// + calls Date.valueOf(), which converts it from an object to a 	
		// primitive (number of milliseconds since January 1, 1970 local time)
		var now,fps;
		now = (+new Date); 
		fps = 1000 / (now - this.lastTime);
		fps = clamp(fps, 12, 60);
		this.lastTime = now; 
		return 1/fps;
	},
	
	circleHitLeftRight: function (c){
		if(c.x < c.radius || c.x > this.WIDTH - c.radius){
			return true;
		}
	},

	circleHitTopBottom: function (c){
		if(c.y < c.radius ){
			return 0;
		}else{
			if( c.y > this.HEIGHT - c.radius){
			return 1;
			}else{
				return 2;
		}
	}

	},

	newBall: function(x, y, xSpeed, ySpeed){
		this.makeCircles(1);
		var ball = this.circles[this.circles.length - 1];
		ball.x = x;
		ball.y = y;
		ball.xSpeed = xSpeed;
		ball.ySpeed = ySpeed; 
	},

	makeCircles: function(num){
		var array = [];
		var circleDraw = function(ctx){
			ctx.save();
			ctx.beginPath();
			ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2, false);
			ctx.closePath();
			ctx.fillStyle = 'white';
			ctx.fill();
			ctx.restore();
		};

		var circleDeath = function(){
			if(app.main.lives !=0){
				app.main.lives--;
			}
			if(app.main.lives == 0){
				app.main.gameState = app.main.GAME_STATE.END;
			}
		};

		var circleMove = function(dt){
			if(app.main.gameState == app.main.GAME_STATE.BEGIN){
				//console.log('here');
				this.x = app.main.player.x + app.main.player.w / 2;

				if(myKeys.keydown[myKeys.KEYBOARD.KEY_UP]){
					this.ySpeed = -2;
					this.xSpeed = -.09; 
					app.main.gameState = app.main.GAME_STATE.DEFAULT;
				}
				
			}
			this.x += this.xSpeed * this.speed * dt;
			this.y += this.ySpeed * this.speed * dt;
		};
			var c = {};
			c.x = canvas.width / 2;
			c.y = canvas.height - 100;

			c.radius = this.CIRCLE.START_RADIUS;

			//var randomVector = getRandomUnitVector();
			c.xSpeed = 0;
			c.ySpeed = 0;

			c.speed = this.CIRCLE.MAX_SPEED;
			c.fillStyle = 'white';
			c.state = this.CIRCLE_STATE.NORMAL;
			c.lifetime = 0;

			c.draw = circleDraw;
			c.move = circleMove;
			c.kill = circleDeath;


			Object.seal(c);
			array.push(c);
		
		
		return array;
	},

	drawCircles: function(ctx){
		if(this.gameState == this.GAME_STATE.ROUND_OVER){
			this.globalAlpha = 0.25;
		}else{ 
			if(this.gameState == this.GAME_STATE.END){
				this.globalAlpha = 0.1;
			}
		}
		for(var i = 0; i < this.circles.length; i++){
			var c = this.circles[i];
			c.draw(ctx);
		}
	},

	pauseGame: function(){
		this.paused = true;
		cancelAnimationFrame(this.animationID);
		this.stopBGAudio();
		this.update();
	},

	resumeGame: function(){
		cancelAnimationFrame(this.animationID);
		this.paused = false;
		this.bgAudio.play();
		this.update();
	},

	moveCircles: function(dt){
		for(var i=0;i<this.circles.length; i++){
			var c = this.circles[i];
		
			// move circles
			c.move(dt);
		

	
		} // end for loop
	}
}; // end app.main