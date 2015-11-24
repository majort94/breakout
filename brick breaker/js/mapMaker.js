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
	...
	4 : stone brick
			takes multiple hits to break
	5 : frozen brick
			this brick takes an extra hit to destroy and slows the ball on contact
	6 : burning brick
			this brick becomes invincible while burning for 0.5 seconds and speeds up the ball on contact
	...
	7 : double ball brick
			spawns an extra ball in the field for a short duration
	8 : portal brick
			teleports player to the other portal brick
	...
	9 : poison trigger
			surrounding bricks become poisoned bricks
	10: poisoned brick
			burns twice as fast as fire bricks, disintegrates ball on contact
	*/
	var canvas = document.querySelector('canvas');
	var ctx = this.canvas.getContext('2d');

	canvas.width = app.main.WIDTH;
	canvas.height = app.main.HEIGHT;



	var typeRow0 = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
	var typeRow1 = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
	var typeRow2 = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
	var typeRow3 = [0,0,1,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0];
	var typeRow4 = [0,0,0,1,0,0,0,1,0,0,0,1,1,1,1,1,0,0,0,0];
	var typeRow5 = [0,0,0,0,0,11,0,0,0,0,0,1,0,3,0,1,0,0,0,0];
	var typeRow6 = [0,0,0,1,0,0,0,1,0,0,0,1,0,0,1,1,0,0,0,0];
	var typeRow7 = [0,0,1,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0];
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

	var date = new Date();

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
				
				var temp = new Shape(((BLOCK.piece).toFixed()) * (j), (BLOCK.height0).toFixed() * i, (BLOCK.piece).toFixed() * 2, (BLOCK.height0).toFixed(), typeRowAll[i][j], shapeRowAll[i][j], i, j);
				//blocks.push(new Shape(((BLOCK.piece).toFixed()) * (j), (BLOCK.height0).toFixed() * i, (BLOCK.piece).toFixed() * 2, (BLOCK.height0).toFixed(), tempFill, typeRowAll[i][j], shapeRowAll[i][j], i, j));
				blocks.push(temp);
				//shapeRowAll[i][i] = new Shape(((BLOCK.piece).toFixed()) * (j), (BLOCK.height0).toFixed() * i, (BLOCK.piece).toFixed() * 2, (BLOCK.height0).toFixed(), tempFill, typeRowAll[i][j], shapeRowAll[i][j], i, j);
				shapeRowAll[i][j] = temp;
			}
		}
	}
}

function Shape(x, y, w, h, type, angle, row, rowIndex) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.type = type;
    this.angle = angle;
    this.row = row;
    this.rowIndex = rowIndex;
    this.health = 1;
    this.lifespan = 1;
    this.burn = false;
    this.poison = false;
    this.otherPortal = null;
    this.filePaths = function () { // MOVE TO MAP
    	this.normalBrick = 'resources/wood/normal_brick.png';
    	this.iceBrick = null;
    	this.normalSocket = null;
    	this.iceSocket = null;
    	this.iceTrigger = null;
    	this.fireTrigger = null;
    	this.poisonTrigger = null;
    	this.fireAlpha = null;
    	this.poisonAlpha = null;
    }
    switch (type) // will remove fills after drawMap and collision are fixed to work with images // REMOVE
    {
    	case 1: //normal brick
    		this.fill = "wheat";
    		this.filePaths.normal = 'resources/wood/normal_brick.png';
    		break;
    	case 2: // ice trigger
    		this.fill = "blue";
    		this.filePath = 'resources/wood/normal_brick.png';
    		break;
    	case 3: // fire trigger
    		this.fill = "red";
    		this.filePath = 'resources/wood/normal_brick.png';
    		break;
    	case 9: // poison trigger
    		this.fill = "green";
    		break;

    	case 6: // burning brick
    		this.fill = "orange";
    		break;
    	case 10: // poisoned brick
    		this.fill = "lightgreen";
    		break;
    	case 4: // stone take twice normal to kill
    		this.health = 2;
    		this.lifespan = 2;
    		this.fill = "brown";
    		break;
    	case 5: // frozen have twice hp but half burn
    		this.heath = 2;
    		this.lifespan = .5;
    		this.fill = "aqua";
    		break;

    	case 7: // double ball brick
    		break;
    	case 8: // portal brick -- STARTED
    		for (var i = 0; i < blocks.length; i++)
    		{
    			// find portals
    			if (blocks[i].type = 8)
    			{
    				// check not self
    				if ((blocks[i].row != this.row) && (blocks[i].rowIndex != this.rowIndex))
    				{
    					this.otherPortal = (blocks[i].row, blocks[i].rowIndex);
    				}
    			}
    		}
    		break;

    	
    	default:
    		break;
    }
    this.beenHit = function(ball) {
    	this.health -= 1;
    	switch (type)
    	{
    		case 2: // ice trigger
    			applyEffectsToBricks(referenceSurroundingBricks(this), 5);
    			break;
    		case 3: // fire trigger
    			applyEffectsToBricks(referenceSurroundingBricks(this), 6);
    			break;
    		case 9: // poison trigger
    			applyEffectsToBricks(referenceDiagonalBricks(this), 10);
    			break;
    		case 5: // ice brick
    			// apply chill to ball
    			break;
    		case 6: // fire brick
    			// apply speed boost to ball
    			break;
    		case 10: // poison brick
    			// apply disintigrationg to ball
    			break;

    		case 7: // double ball brick
    			// spawn second ball 
    		case 8: // portal brick
    			// teleport ball to other portal
    			break;
    		default:
    			break;
    	}
    };
    this.firstBurn = true;
    this.lastTick = null;
    this.burnRate = 4000;
    this.tickDOT = function() {
    	if (this.firstBurn) 
    	{ 
    		this.firstBurn = false;
    		this.timer = (new Date()).getTime(); 
    		this.lastTick = (new Date()).getTime(); 
    		//console.log("FIRST BURN || Timer: " + this.timer + ", LastTick: " + this.lastTick);
    	}
    	else
    	{ 
    		this.timer = (new Date()).getTime(); 
    		//console.log("TIMER TICK || Timer: " + this.timer + ", LastTick: " + this.lastTick);
    		if (this.timer > (this.lastTick + this.burnRate)) // burn lasts 4 seconds
			{
				for (var i = 0; i < blocks.length; i++)
				{
					if (blocks[i].burn || blocks[i].poison)
					{
						shapeRowAll[blocks[i].row][blocks[i].rowIndex].lifespan -= .25;
						this.lastTick = date.getTime();
					}
				}
			}
    	}
    };
    this.draw = function() {
    	/*
    	//brick
    	ctx.drawImage();
    	//socket and orb
    	if (this.type == 2 || 3 || 7 || 8 || 9) 
    		{ ctx.drawImage(); }
    	// fire alpha
    	if (this.burn) 
    		{ ctx.drawImage(); }
    	//poison alpha
    	if (this.poison)
    		{ ctx.drawImage(); }
    	*/
    };
}

function drawMap(){
	
	for (var i = 0; i < blocks.length; i++) {
		ctx.save();

		/*
		blocks[i].draw();
		*/

		//
		ctx.fillStyle = blocks[i].fill;
		ctx.translate(blocks[i].x, blocks[i].y);
		if(blocks[i].angle != 0){
			ctx.rotate(blocks[i].angle * Math.PI/180);
		}
		ctx.fillRect(0, 0, blocks[i].w, blocks[i].h);
		//

		ctx.restore();
	}
	
/*
	for(var i = 0; i < shapeRow0.length; i++){
		for(var j = 0; j < shapeRowAll.length; j++){
			if(shapeRowAll[i][j] != null){

			
			ctx.save();
			ctx.fillStyle = shapeRowAll[i][j].fill;
			ctx.translate(shapeRowAll[i][j].x, shapeRowAll[i][j].y);
			if(shapeRowAll[i][j].angle != 0){
				ctx.rotate(shapeRowAll[i][j].angle * Math.PI/180);
			}

			ctx.fillRect(0, 0, shapeRowAll[i][j].w, shapeRowAll[i][j].h);
			
			ctx.restore();
		}

		}

	}
	*/
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function referenceSurroundingBricks(trigger) {
	var xIndexArray = [];
	var yIndexArray = [];
	var referenceArrays = [xIndexArray, yIndexArray];
	// REFERENCE ARRAY OF BRICKS - has two elements, each an array of their respective indexes

	var maxRowIndex = typeRowAll.length;
	var maxWithinRowIndex = typeRowAll[0].length;

	// COMPASS KEY - ifs check if target within map, not null, and is a normal brick
	// NW
	if ((trigger.row > 0) && (trigger.rowIndex > 0) && (typeRowAll[trigger.row -1][trigger.rowIndex -2] != null) && (typeRowAll[trigger.row -1][trigger.rowIndex -2] == 1))
		{ xIndexArray.push(trigger.row - 1); yIndexArray.push(trigger.rowIndex - 2); }
	// NW.5
	if ((trigger.row > 0) && (trigger.rowIndex > 0) && (typeRowAll[trigger.row -1][trigger.rowIndex -1] != null) && (typeRowAll[trigger.row -1][trigger.rowIndex -1] == 1))
		{ xIndexArray.push(trigger.row - 1); yIndexArray.push(trigger.rowIndex - 1); }
	// N
	if ((trigger.row > 0) && (typeRowAll[trigger.row -1][trigger.rowIndex] != null) && (typeRowAll[trigger.row -1][trigger.rowIndex] == 1))
		{ xIndexArray.push(trigger.row - 1); yIndexArray.push(trigger.rowIndex); }
	// NE.5
	if ((trigger.row > 0) && (trigger.rowIndex <= maxWithinRowIndex -2) && (typeRowAll[trigger.row -1][trigger.rowIndex +1] != null)  && (typeRowAll[trigger.row -1][trigger.rowIndex +1] == 1))
		{ xIndexArray.push(trigger.row - 1); yIndexArray.push(trigger.rowIndex + 1); }
	// NE
	if ((trigger.row > 0) && (trigger.rowIndex <= maxWithinRowIndex -2) && (typeRowAll[trigger.row -1][trigger.rowIndex +2] != null) && (typeRowAll[trigger.row -1][trigger.rowIndex +2] == 1))
		{ xIndexArray.push(trigger.row - 1); yIndexArray.push(trigger.rowIndex + 2); }
	// E
	if ((trigger.rowIndex <= maxWithinRowIndex -2) && (typeRowAll[trigger.row][trigger.rowIndex +2] != null)&& (typeRowAll[trigger.row][trigger.rowIndex +2] == 1))
		{ xIndexArray.push(trigger.row); yIndexArray.push(trigger.rowIndex + 2); }
	// SE
	if ((trigger.row <= maxRowIndex -2) && (trigger.rowIndex <= maxWithinRowIndex -2) && (typeRowAll[trigger.row +1][trigger.rowIndex +2] != null) && (typeRowAll[trigger.row +1][trigger.rowIndex +2] == 1))
		{ xIndexArray.push(trigger.row + 1); yIndexArray.push(trigger.rowIndex + 2); }
	// SE.5
	if ((trigger.row <= maxRowIndex -2) && (trigger.rowIndex <= maxWithinRowIndex -2) && (typeRowAll[trigger.row +1][trigger.rowIndex +1] != null) && (typeRowAll[trigger.row +1][trigger.rowIndex +1] == 1))
		{ xIndexArray.push(trigger.row + 1); yIndexArray.push(trigger.rowIndex + 1); }
	// S
	if ((trigger.row <= maxRowIndex -2) && (typeRowAll[trigger.row +1][trigger.rowIndex] != null) && (typeRowAll[trigger.row +1][trigger.rowIndex] == 1))
		{ xIndexArray.push(trigger.row + 1); yIndexArray.push(trigger.rowIndex); }
	// SW.5
	if ((trigger.row <= maxRowIndex -2) && (trigger.rowIndex > 0) && (typeRowAll[trigger.row +1][trigger.rowIndex -1] != null) && (typeRowAll[trigger.row +1][trigger.rowIndex -1] == 1))
		{ xIndexArray.push(trigger.row + 1); yIndexArray.push(trigger.rowIndex - 1); }
	// SW
	if ((trigger.row <= maxRowIndex -2) && (trigger.rowIndex > 0) && (typeRowAll[trigger.row +1][trigger.rowIndex -2] != null) && (typeRowAll[trigger.row +1][trigger.rowIndex -2] == 1))
		{ xIndexArray.push(trigger.row + 1); yIndexArray.push(trigger.rowIndex - 2); }
	// W
	if ((trigger.rowIndex > 0) && (typeRowAll[trigger.row][trigger.rowIndex -2] == 1))
		{ xIndexArray.push(trigger.row); yIndexArray.push(trigger.rowIndex - 2); }

	return referenceArrays;
}

/*
function referenceDiagonalBricks(trigger, radius) {
	var xIndexArray = [];
	var yIndexArray = [];
	var referenceArrays = [xIndexArray, yIndexArray];
	// REFERENCE ARRAY OF BRICKS - has two elements, each an array of their respective indexes
	var maxRowIndex = typeRowAll.length;
	var maxWithinRowIndex = typeRowAll[0].length;

	var tempX = 0;
	var tempY = 0;
	var compensation = 1;

	// iterate through each 4 diagonals
	for (var i = 0; i < 4; i++)
	{
		switch (i)
		{
			case 0:
				tempY = -1;
				tempX = -2;
				break;
			case 1:
				tempY = -1;
				tempX = 2;
				break;
			case 2:
				tempY = 1;
				tempX = 2;
				break;
			case 3:
				tempY = 1;
				tempX = -2;
				break;
		}
		
		for (var j = 0; j < 2; j++)
		{
			// increment tempX and tempY for each iteration, in order to reference the next brick in that diagonal direction
			tempX = tempX + (tempX * j);
			tempY = tempY + (tempY * j);

			// checking if diagonals are within map
			if ((trigger.row + tempY > 0) || (trigger.row + tempY <= shapeRowAll.length))
			{
				if ((trigger.rowIndex + tempX > 0) || (trigger.rowIndex + tempX <= shapeRow0.length))
				{
					//null check / normal brick
					if (shapeRowAll[trigger.row + tempY][trigger.rowIndex + tempX] != null)
					{
						if ((typeRowAll[trigger.row + tempY][trigger.rowIndex + tempX] == 1))
						{ 
							xIndexArray.push(trigger.row + tempY); yIndexArray.push(trigger.rowIndex + tempX); 
						}
					}
				}
			}
		}
	}
	return referenceArrays;
} */

function applyEffectsToBricks(bricksArray, effect) // used by elemental triggers
{
	for (var i=0; i < bricksArray[0].length; i++)
	{
		switch (effect)
		{
			//Freeze
			case 5:
				//switches to ice brick type
				typeRowAll[bricksArray[0][i]][bricksArray[1][i]] = effect;
				shapeRowAll[bricksArray[0][i]][bricksArray[1][i]].type = effect;
				//change to ice brick fill
				shapeRowAll[bricksArray[0][i]][bricksArray[1][i]].fill = "aqua";
				//stops burns and adds defense
				shapeRowAll[bricksArray[0][i]][bricksArray[1][i]].burn = false;
				shapeRowAll[bricksArray[0][i]][bricksArray[1][i]].health += 1;
				break;
			//Burn
			case 6:
				//apply burn alpha layer
				// ------------
				shapeRowAll[bricksArray[0][i]][bricksArray[1][i]].fill = "orange";
				//ice burns twice as fast as normal
				if (shapeRowAll[bricksArray[0][i]][bricksArray[1][i]].type == 5) 
					{ shapeRowAll[bricksArray[0][i]][bricksArray[1][i]].burnRate = 2000; }
				shapeRowAll[bricksArray[0][i]][bricksArray[1][i]].burn = true;
				break;
			//Poison
			case 10:
				//apply poison alpha layer
				// --------------
				shapeRowAll[bricksArray[0][i]][bricksArray[1][i]].fill = "lightgreen"
				//twice fire burn speed
				shapeRowAll[bricksArray[0][i]][bricksArray[1][i]].poison = true;
				shapeRowAll[bricksArray[0][i]][bricksArray[1][i]].burnRate = 2000;
				break;

			default:
				break;
		}
	}
}

function lethalStatusCheck(i, j){
	// for(var i = 0; i < typeRowAll.length; i++){
	//	for(var j = 0; j < typeRowAll[i].length; j++)
		//{

			//find bricks
			if (shapeRowAll[i][j] != null)
			{
				// 0hp kill threshold
				if (shapeRowAll[i][j].health <= 0) 
				{ 
					deleteBrick(i, j); 
					return;
				}
				// find bricks affected by DOT
				if (shapeRowAll[i][j].lifespan != 0)
				{
					if (shapeRowAll[i][j].lifespan <= 0)
					{
						deleteBrick(i, j);
					}
				}
			}
		//}
	//}
}

function deleteBrick(i, j){
	typeRowAll[i][j] = 0;
	shapeRowAll[i][j] = null;


	for(var g = 0; g < blocks.length; g++){
		if((blocks[g].row == i) && (blocks[g].rowIndex == j)){
			blocks.splice(g, 1);
		}
	}
}