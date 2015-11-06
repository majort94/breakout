"use strict";


 /************ Design Rules ************

	key:

	0 : nothing
	1 : normal brick
	...
	2 : ice trigger
			surrounding bricks become frozen bricks
	3 : fire trigger
			surrounding bricks become burning bricks
	4 : stone trigger
		takes multiple hits to break
	...
	5 : frozen brick
			this brick takes an extra hit to destroy and slows the ball on contact
	6 : burning brick
			this brick becomes invincible while burning for 0.5 seconds and speeds up the ball on contact
	...

	*/
	var canvas = document.querySelector('canvas');
	var ctx = this.canvas.getContext('2d');

	canvas.width = app.main.WIDTH;
	canvas.height = app.main.HEIGHT;



	var typeRow0 = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
	var typeRow1 = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
	var typeRow2 = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
	var typeRow3 = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
	var typeRow4 = [0,0,0,1,0,1,0,1,0,0,0,1,0,1,0,1,0,0,0,0];
	var typeRow5 = [0,0,0,1,0,2,0,1,0,0,0,1,0,3,0,1,0,0,0,0];
	var typeRow6 = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
	var typeRow7 = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
	var typeRow8 = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
	var typeRowAll = [typeRow0, typeRow1, typeRow2, typeRow3, typeRow4, typeRow5, typeRow6, typeRow7, typeRow8];

	var anglesRow0 = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
	var anglesRow1 = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
	var anglesRow2 = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
	var anglesRow3 = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
	var anglesRow4 = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
	var anglesRow5 = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
	var anglesRow6 = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
	var anglesRow7 = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
	var anglesRow8 = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
	var anglesRowAll = [anglesRow0, anglesRow1, anglesRow2, anglesRow3, anglesRow4, anglesRow5, anglesRow6, anglesRow7, anglesRow8];

	var map = {
		numCols : typeRow0.length,
		numRows : typeRowAll.length
		

	};




	var BLOCK = {
		piece : canvas.width / map.numCols,
		height0 : (canvas.height - 175) / map.numRows

	}
	var blocks = [];



/*
function makeMap(){
	for(var i = 0; i < typeRowAll.length; i++){
		for(var j = 0; j < typeRowAll[i].length; j++){

			if(typeRowAll[i][j] != 0){
				var pick = getRandomInt(0, app.main.colors.length);
				blocks.push(new Shape(((BLOCK.piece).toFixed()) * (j - 1), (BLOCK.height0).toFixed() * i, (BLOCK.piece).toFixed() * 3, (BLOCK.height0).toFixed(), app.main.colors[pick], typeRowAll[i][j]));
			}
		}
	}

}
*/
function makeMap1(){
	for(var i = 0; i < typeRowAll.length; i++){
		for(var j = 0; j < typeRowAll[i].length; j++){

			if(typeRowAll[i][j] != 0){
				//var pick = getRandomInt(0, app.main.colors.length);
				var tempFill;
				switch (typeRowAll[i][j])
				{
					case 1:
						tempFill = "wheat";
						break;
					case 2:
						tempFill = "aqua";
						break;
					case 3:
						tempFill = "red";
						break;
					case 4:
						tempFill = "brown";
						break;
				}
				blocks.push(new Shape(((BLOCK.piece).toFixed()) * (j), (BLOCK.height0).toFixed() * i, (BLOCK.piece).toFixed() * 2, (BLOCK.height0).toFixed(), tempFill, typeRowAll[i][j], anglesRowAll[i][j], i, j));
			}
		}
	}

}

function Shape(x, y, w, h, fill, type, angle, row, rowIndex) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.fill = fill;
    this.type = type;
    this.angle = angle;
}

function drawMap(){
	for (var i = 0; i < blocks.length; i++) {
		ctx.save();
		ctx.fillStyle = blocks[i].fill
		ctx.translate(blocks[i].x, blocks[i].y);
		if(blocks[i].angle != 0){
			ctx.rotate(blocks[i].angle * Math.PI/180);
		}

		ctx.fillRect(0, 0, blocks[i].w, blocks[i].h);
		
		ctx.restore();
	}
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function applyEffectToSurroundingBricks(trigger, effect) {
	//effect is just replacing the type with the types representing status effects

	var maxXIndex = typeRowAll[0].length;
	var maxYIndex = typeRowAll.length;

	// N
	if ((trigger.row > 0) && (typeRowAll[trigger.row -1][trigger.index] == 0))
		{ typeRowAll[trigger.row -1][trigger.index] = effect; }
	//NE
	if (((trigger.row > 0) && (trigger.index <= maxXIndex -2) && (typeRowAll[trigger.row][trigger.index -2] == 0)))
		{ typeRowAll[trigger.row][trigger.index -2] = effect; }
	//E
	if ((trigger.index <= maxXIndex -2) && (typeRowAll[trigger.row][trigger.index +2] == 0))
		{ typeRowAll[trigger.row][trigger.index +2] = effect; }
	//SE
	if (((trigger.row <= maxYIndex -2) && (trigger.index <= maxXIndex -2) && (typeRowAll[trigger.row +1][trigger.index +2] == 0)))
		{ typeRowAll[trigger.row +1][trigger.index +2] = effect; }
	//S
	if ((trigger.row <= maxYIndex -2) && (typeRowAll[trigger.row +1][trigger.index] == 0))
		{ typeRowAll[trigger.row +1][trigger.index] = effect; }
	//SW
	if (((trigger.row <= maxYIndex -2) && (trigger.index >= 2) && (typeRowAll[trigger.row +1][trigger.index -2] == 0)))
		{ typeRowAll[trigger.row +1][trigger.index -2] = effect; }
	//W
	if ((trigger.index >= 2) && (typeRowAll[trigger.row][trigger.index -2] == 0))
		{ typeRowAll[trigger.row][trigger.index -2] = effect; }
	// NW
	if ((trigger.row > 0) && (trigger.index >= 2) && (typeRowAll[trigger.row -1][trigger.index -2] == 0))
		{ typeRowAll[trigger.row -1][trigger.index -2] = effect; }
}