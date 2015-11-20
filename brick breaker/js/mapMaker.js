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
	var typeRow5 = [0,0,0,1,0,4,0,1,0,0,0,1,0,3,0,1,0,0,0,0];
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
				
				var temp = new Shape(((BLOCK.piece).toFixed()) * (j), (BLOCK.height0).toFixed() * i, (BLOCK.piece).toFixed() * 2, (BLOCK.height0).toFixed(), changeBrickFill(typeRowAll[i][j]), typeRowAll[i][j], shapeRowAll[i][j], i, j);
				//blocks.push(new Shape(((BLOCK.piece).toFixed()) * (j), (BLOCK.height0).toFixed() * i, (BLOCK.piece).toFixed() * 2, (BLOCK.height0).toFixed(), tempFill, typeRowAll[i][j], shapeRowAll[i][j], i, j));
				blocks.push(temp);
				//shapeRowAll[i][i] = new Shape(((BLOCK.piece).toFixed()) * (j), (BLOCK.height0).toFixed() * i, (BLOCK.piece).toFixed() * 2, (BLOCK.height0).toFixed(), tempFill, typeRowAll[i][j], shapeRowAll[i][j], i, j);
				shapeRowAll[i][j] = temp;
			}
		}
	}
}

function Shape(x, y, w, h, fill, type, angle, row, rowIndex) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.type = type;
    this.angle = angle;
    this.row = row;
    this.rowIndex = rowIndex;
    this.fill = fill;
    this.health = 1;
    this.lifespan = 1;
    switch (type)
    {
    	case 1:
    		//this.fill - ; DEFINE ART PER TYPE / will need to modify changeFillType()
    	case 2:
    	case 3:
    	case 6:
    	case 7:
    	case 8:
    		break;
    	case 4: // stone take twice normal to kill
    		this.health = 2;
    		this.lifespan = 2;
    		break;
    	case 5: // frozen have twice hp but half burn
    		this.heath = 2;
    		this.lifespan = .5;
    		break;
    	default:
    		break;
    }
    this.beenHit = function(ball) {
    	this.health -= 1;
    	switch (type)
    	{
    		case 5: // ice brick
    			// apply chill to ball
    			break;
    		case 6: // fire brick
    			// apply speed boost to ball
    			break;

    		case 2: // ice trigger
    			applyEffectsToBricks(referenceSurroundingBricks(this), 5);
    			break;
    		case 3: // fire trigger
    			applyEffectsToBricks(referenceSurroundingBricks(this), 6);
    			break;

    		case 7: // double ball brick
    			//
    			break;
    		default:
    			break;
    	}
    };
    this.firstBurn = true;
    this.lastTick = null;
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
    		if (this.timer > (this.lastTick + 4000)) // burn lasts 4 seconds
			{
				for (var i = 0; i < blocks.length; i++)
				{
					if (blocks[i].type == 6)
					{
						shapeRowAll[blocks[i].row][blocks[i].rowIndex].lifespan -= .25;
						this.lastTick = date.getTime();
					}
				}
			}
    	}
    };
}

function drawMap(){
	
	for (var i = 0; i < blocks.length; i++) {
		ctx.save();

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

	var maxRowIndex = typeRowAll.length;
	var maxWithinRowIndex = typeRowAll[0].length;

	//statements check if surrounding bricks would be within the max width/height and if they are normal brick type (triggers can't be transformed to effect types)
	// COMPASS KEY
	// NW
	if ((trigger.row > 0) && (trigger.rowIndex > 0) && (typeRowAll[trigger.row -1][trigger.rowIndex -2] == 1))
		{ xIndexArray.push(trigger.row - 1); yIndexArray.push(trigger.rowIndex - 2); }
			//referenceArray.push((trigger.row -1, trigger.rowIndex -2)); }
	// N
	if ((trigger.row > 0) && (typeRowAll[trigger.row -1][trigger.rowIndex] == 1))
		{ xIndexArray.push(trigger.row - 1); yIndexArray.push(trigger.rowIndex); }
		//{ referenceArray.push((trigger.row -1, trigger.rowIndex)); }
	// NE
	if ((trigger.row > 0) && (trigger.rowIndex <= maxWithinRowIndex -2) && (typeRowAll[trigger.row -1][trigger.rowIndex +2] == 1))
		{ xIndexArray.push(trigger.row - 1); yIndexArray.push(trigger.rowIndex + 2); }
		//{ referenceArray.push((trigger.row -1, trigger.rowIndex +2)); }
	// E
	if ((trigger.rowIndex <= maxWithinRowIndex -2) && (typeRowAll[trigger.row][trigger.rowIndex +2] == 1))
		{ xIndexArray.push(trigger.row); yIndexArray.push(trigger.rowIndex + 2); }
		//{ referenceArray.push((trigger.row, trigger.rowIndex +2)); }
	// SE
	if ((trigger.row <= maxRowIndex -2) && (trigger.rowIndex <= maxWithinRowIndex -2) && (typeRowAll[trigger.row +1][trigger.rowIndex +2] == 1))
		{ xIndexArray.push(trigger.row + 1); yIndexArray.push(trigger.rowIndex + 2); }
		//{ referenceArray.push((trigger.row +1, trigger.rowIndex +2)); }
	// S
	if ((trigger.row <= maxRowIndex -2) && (typeRowAll[trigger.row +1][trigger.rowIndex] == 1))
		{ xIndexArray.push(trigger.row + 1); yIndexArray.push(trigger.rowIndex); }
		//{ referenceArray.push((trigger.row +1, trigger.rowIndex)); }
	// SW
	if ((trigger.row <= maxRowIndex -2) && (trigger.rowIndex > 0) && (typeRowAll[trigger.row +1][trigger.rowIndex -2] == 1))
		{ xIndexArray.push(trigger.row + 1); yIndexArray.push(trigger.rowIndex - 2); }
		//{ referenceArray.push((trigger.row +1, trigger.rowIndex -2)); }
	// W
	if ((trigger.rowIndex > 0) && (typeRowAll[trigger.row][trigger.rowIndex -2] == 1))
		{ xIndexArray.push(trigger.row); yIndexArray.push(trigger.rowIndex - 2); }
		//{ referenceArray.push((trigger.row, trigger.rowIndex -2)); }

	return referenceArrays;

	// create two reference arrays. one for x and one for y pushes. they will be merged into a final referenceArray to be passed and referenced as referenceArray[x or y (0/1)][index]
}

function applyEffectsToBricks(bricksArray, effect)
{
	for (var i=0; i < bricksArray[0].length; i++)
	{

		//check if bricks are there
		//console.log('row ' + bricksArray[i][0]);
		//console.log('rowIndex ' + bricksArray[i][1]);
		typeRowAll[bricksArray[0][i]][bricksArray[1][i]] = effect;
		shapeRowAll[bricksArray[0][i]][bricksArray[1][i]].type = effect;
		shapeRowAll[bricksArray[0][i]][bricksArray[1][i]].fill = changeBrickFill(effect);
		switch (effect)
		{
			//Freeze
			case 5:
				//freezing stops burn effects
				if (shapeRowAll[bricksArray[0][i]][bricksArray[1][i]].type == 6) 
					{ shapeRowAll[bricksArray[0][i]][bricksArray[1][i]].lifespan = 0; }
				shapeRowAll[bricksArray[0][i]][bricksArray[1][i]].health = 2;
				break;
			//Burn
			case 6:
				//ice burns twice as fast as normal
				if (shapeRowAll[bricksArray[0][i]][bricksArray[1][i]].type == 5) 
					{ }
					//shapeRowAll[bricksArray[0][i]][bricksArray[1][i]].lifespan = .5; }
				shapeRowAll[bricksArray[0][i]][bricksArray[1][i]].lifespan = 1;
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

function changeBrickFill(type) {
	var tempFill;
	switch (type)
	{
		case 1: // normal
			tempFill = "wheat";
			break;
		case 2: // ice trigger
			tempFill = "blue";
			break;
		case 3: // fire trigger
			tempFill = "red";
			break;
		case 4: // stone brick
			tempFill = "brown";
			break;
		case 5: // ice brick
			tempFill = "aqua";
			break;
		case 6: // fire brick
			tempFill = "yellow";
			break;
		case 7: // double ball
			break;
	}
	return tempFill;
}