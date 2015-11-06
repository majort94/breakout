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

	var shapeRow0 = [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null];
	var shapeRow1 = [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null];
	var shapeRow2 = [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null];
	var shapeRow3 = [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null];
	var shapeRow4 = [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null];
	var shapeRow5 = [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null];
	var shapeRow6 = [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null];
	var shapeRow7 = [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null];
	var shapeRow8 = [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null];
	var shapeRowAll = [shapeRow0, shapeRow1, shapeRow2, shapeRow3, shapeRow4, shapeRow5, shapeRow6, shapeRow7, shapeRow8];
	
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
				blocks.push(new Shape(((BLOCK.piece).toFixed()) * (j), (BLOCK.height0).toFixed() * i, (BLOCK.piece).toFixed() * 2, (BLOCK.height0).toFixed(), tempFill, typeRowAll[i][j], shapeRowAll[i][j], i, j));
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
    this.row = row;
    this.rowIndex = rowIndex;
    this.health = 1;
    this.lifespan = null;	//in seconds
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

// TO DO --------------- CHANGE TO RETURN REFERENCE ARRAY
// remove code changing typeRowAll. create and fill array of surrounding brick indices
function referenceSurroundingBricks(trigger, effect) {
	
	var maxRowIndex = typeRowAll.length;
	//right now this works since all rows are consistent length
	var maxWithinRowIndex = typeRowAll[0].length;

	//statements check if surrounding bricks would be within the max width/height and if they are normal bricks (allowing them to be transformed to effect type)
	// COMPASS KEY
	// N
	if ((trigger.row > 0) && (typeRowAll[trigger.row -1][trigger.rowIndex] == 1))
		{ typeRowAll[trigger.row -1][trigger.rowIndex] = effect; }
	// NE
	if ((trigger.row > 0) && (trigger.rowIndex <= maxXIndex -2) && (typeRowAll[trigger.row][trigger.rowIndex -2] == 1))
		{ typeRowAll[trigger.row][trigger.rowIndex -2] = effect; }
	// E
	if ((trigger.rowIndex <= maxXIndex -2) && (typeRowAll[trigger.row][trigger.rowIndex +2] == 1))
		{ typeRowAll[trigger.row][trigger.trigger.rowIndex +2] = effect; }
	// SE
	if ((trigger.row <= maxYIndex -2) && (trigger.rowIndex <= maxXIndex -2) && (typeRowAll[trigger.row +1][trigger.rowIndex +2] == 1))
		{ typeRowAll[trigger.row +1][trigger.rowIndex +2] = effect; }
	// S
	if ((trigger.row <= maxYIndex -2) && (typeRowAll[trigger.row +1][trigger.rowIndex] == 1))
		{ typeRowAll[trigger.row +1][trigger.rowIndex] = effect; }
	// SW
	if ((trigger.row <= maxYIndex -2) && (trigger.rowIndex >= 2) && (typeRowAll[trigger.row +1][trigger.rowIndex -2] == 1))
		{ typeRowAll[trigger.row +1][trigger.rowIndex -2] = effect; }
	// W
	if ((trigger.rowIndex >= 2) && (typeRowAll[trigger.row][trigger.rowIndex -2] == 1))
		{ typeRowAll[trigger.row][trigger.rowIndex -2] = effect; }
	// NW
	if ((trigger.row > 0) && (trigger.rowIndex >= 2) && (typeRowAll[trigger.row -1][trigger.rowIndex -2] == 1))
		{ typeRowAll[trigger.row -1][trigger.rowIndex -2] = effect; }

	//return referenceArray;
}

function applyEffectsToBricks(bricksArray, effect)
{
	for (var i=0; i < bricksArray.length; i++)
	{
		typeRowAll[bricksArray[i].row][bricksArray[i].rowIndex] = effect;
		shapeRowAll[bricksArray[i].row][bricksArray[i].rowIndex].type = effect;
		switch (effect)
		{
			//Freeze
			case 5:
				shapeRowAll[bricksArray[i].row][bricksArray[i].rowIndex].health = 2;
				break;
			//Burn
			case 6:
				shapeRowAll[bricksArray[i].row][bricksArray[i].rowIndex].lifespan = 3;
				break;
		}
	}
}

// TO DO ------ ICE / BURN MECHANICS INTERACTION
// remove lifespan, and change DOT to work with health, so that ice burns twice as fast as normal bricks
function lethalStatusCheck(){
	 for(var i = 0; i < typeRowAll.length; i++){
		for(var j = 0; j < typeRowAll[i].length; j++)
		{
			//if there is a brick in element
			if (shapeRowAll[i][j] != null)
			{
				// 0hp kill threshold
				if (shapeRowAll[i][j].health == 0) 
				{ 
					deleteBrick(i, j); 
				}
				// find bricks affected by DOT
		 		if (shapeRowAll[i][j].lifespan != null)
		 		{
		 			// 0lifespan kill threshold
		 			if (shapeRowAll[i][j].lifespan == 0)
		 			{
		 				deleteBrick(i, j);
		 			}
		 		}
			}
		}
	}
}

function deleteBrick(i, j){
	typeRowAll[i][j] = 0;
	shapeRowAll[i][j] = null;
}