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
	var canvas = document.querySelector('#canvas1');
	var ctx = this.canvas.getContext('2d');
	var canvas1 = document.querySelector('#canvas2');
	var ctx1 = this.canvas1.getContext('2d');

	canvas.width = app.main.WIDTH;
	canvas.height = app.main.HEIGHT;
	canvas1.width = app.main.WIDTH;
	canvas1.height = app.main.HEIGHT;



	var typeRow0 = [0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
	var typeRow1 = [0,0,1,0,0,0,0,1,0,0,1,0,0,1,0,1,0,0,0,0];
	var typeRow2 = [0,0,1,0,0,0,0,0,1,0,1,0,0,1,0,1,0,0,0,0];
	var typeRow3 = [0,0,1,0,0,0,0,0,1,0,1,0,0,0,1,0,0,0,0,0];
	var typeRow4 = [0,0,1,0,1,0,1,0,1,0,0,1,0,1,0,1,0,0,0,0];
	var typeRow5 = [0,0,1,0,1,0,1,0,1,0,0,1,0,1,0,1,0,0,0,0];
	var typeRow6 = [0,0,1,0,1,0,1,0,1,0,1,0,0,0,0,0,1,0,0,0];
	var typeRow7 = [0,0,1,0,1,0,1,0,0,0,0,0,0,0,0,1,0,0,0,0];
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
		numRows : typeRowAll.length,
		bottomBricks: [],
		bottomLeft: {},
		bottomRight: {},
		shapes: [],
		playerStamp: 0,

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

function loadNewLevel(){
	ctx.clearRect(0,0,canvas.width,canvas.height);
	typeRow0 = level2_0;
	typeRow1 = level2_1;
	typeRow2 = level2_2;
	typeRow3 = level2_3;
	typeRow4 = level2_4;
	typeRow5 = level2_5;
	typeRow6 = level2_6;
	typeRow7 = level2_7;
	typeRow8 = level2_8;
	typeRowAll = level2All;

	shapeRow0 = [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null];
	shapeRow1 = [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null];
	shapeRow2 = [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null];
	shapeRow3 = [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null];
	shapeRow4 = [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null];
	shapeRow5 = [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null];
	shapeRow6 = [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null];
	shapeRow7 = [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null];
	shapeRow8 = [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null];
	//typeRowAll = level2All;

	map.shapes = [];
	map.bottomBricks = [];
	blocks = [];
	makeMap1();
	drawMap();
}
function makeMap1(){

	for(var i = 0; i < typeRowAll.length; i++){
		map.shapes.push([]);
		for(var j = 0; j < typeRowAll[i].length; j++){

			if(typeRowAll[i][j] != 0){
				var pick = getRandomInt(0, app.main.colors.length);
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
				var temp = new Shape(((BLOCK.piece).toFixed()) * (j), (BLOCK.height0).toFixed() * i, (BLOCK.piece).toFixed() * 2, (BLOCK.height0).toFixed(), app.main.colors[pick], typeRowAll[i][j], shapeRowAll[i][j], i, j);
				//blocks.push(new Shape(((BLOCK.piece).toFixed()) * (j), (BLOCK.height0).toFixed() * i, (BLOCK.piece).toFixed() * 2, (BLOCK.height0).toFixed(), tempFill, typeRowAll[i][j], shapeRowAll[i][j], i, j));
				blocks.push(temp);
				//shapeRowAll[i][i] = new Shape(((BLOCK.piece).toFixed()) * (j), (BLOCK.height0).toFixed() * i, (BLOCK.piece).toFixed() * 2, (BLOCK.height0).toFixed(), tempFill, typeRowAll[i][j], shapeRowAll[i][j], i, j);
				shapeRowAll[i][j] = temp;
				map.shapes[i][j] = temp;
			}
		}
	}// end for loop

	for(var i = 0; i<map.numCols; i++){
		map.bottomBricks.push(null);
	}
	
	findBottom();


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
    this.lifespan = 0;	//in seconds
}

function drawMap(){
	ctx.save();
	ctx.fillStyle = 'black';
	ctx.clearRect(0,0, app.main.canvas.width, app.main.canvas.height);
	ctx.fillRect(0,0, app.main.canvas.width, app.main.canvas.height);
	ctx.restore();

	for (var i = 0; i < blocks.length; i++) {
		ctx.save();
		ctx.fillStyle = blocks[i].fill;
		ctx.translate(blocks[i].x, blocks[i].y);
		if(blocks[i].angle != 0){
			ctx.rotate(blocks[i].angle * Math.PI/180);
		}

		ctx.fillRect(0, 0, blocks[i].w, blocks[i].h);
		
		ctx.restore();
	}

	findBottom();
	app.main.drawHUD(app.main.ctx1);
	
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
	var referenceArray = [];

	var maxRowIndex = typeRowAll.length;
	//right now this works since all rows are consistent length
	var maxWithinRowIndex = typeRowAll[0].length;

	//statements check if surrounding bricks would be within the max width/height and if they are normal brick type (triggers can't be transformed to effect types)
	// COMPASS KEY
	// NW
	if ((trigger.row > 0) && (trigger.rowIndex >= 2) && (typeRowAll[trigger.row -1][trigger.rowIndex -2] == 1))
		{ referenceArray.push(trigger.row -1, trigger.rowIndex -1); }
	// N
	if ((trigger.row > 0) && (typeRowAll[trigger.row -1][trigger.rowIndex] == 1))
		{ referenceArray.push(trigger.row -1, trigger.rowIndex); }
	// NE
	if ((trigger.row > 0) && (trigger.rowIndex <= maxXIndex -2) && (typeRowAll[trigger.row][trigger.rowIndex -2] == 1))
		{ referenceArray.push(trigger.row -1, trigger.rowIndex +1); }
	// E
	if ((trigger.rowIndex <= maxXIndex -2) && (typeRowAll[trigger.row][trigger.rowIndex +2] == 1))
		{ referenceArray.push(trigger.row, trigger.rowIndex +1); }
	// SE
	if ((trigger.row <= maxYIndex -2) && (trigger.rowIndex <= maxXIndex -2) && (typeRowAll[trigger.row +1][trigger.rowIndex +2] == 1))
		{ referenceArray.push(trigger.row +1, trigger.rowIndex +1); }
	// S
	if ((trigger.row <= maxYIndex -2) && (typeRowAll[trigger.row +1][trigger.rowIndex] == 1))
		{ referenceArray.push(trigger.row +1, trigger.rowIndex); }
	// SW
	if ((trigger.row <= maxYIndex -2) && (trigger.rowIndex >= 2) && (typeRowAll[trigger.row +1][trigger.rowIndex -2] == 1))
		{ referenceArray.push(trigger.row +1, trigger.rowIndex -1); }
	// W
	if ((trigger.rowIndex >= 2) && (typeRowAll[trigger.row][trigger.rowIndex -2] == 1))
		{ referenceArray.push(trigger.row, trigger.rowIndex -1); }

	return referenceArray;
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
				//freezing stops burn effects
				if (shapeRowAll[bricksArray[i].row][bricksArray[i].rowIndex].type = 5) 
					{ shapeRowAll[bricksArray[i].row][bricksArray[i].rowIndex].lifespan = 0; }
				shapeRowAll[bricksArray[i].row][bricksArray[i].rowIndex].health = 2;
				break;
			//Burn
			case 6:
				//ice burns twice as fast as normal
				if (shapeRowAll[bricksArray[i].row][bricksArray[i].rowIndex].type = 5) 
					{ shapeRowAll[bricksArray[i].row][bricksArray[i].rowIndex].lifespan = 1; }
				shapeRowAll[bricksArray[i].row][bricksArray[i].rowIndex].lifespan = 2;
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
				if (shapeRowAll[i][j].health == 0) 
				{ 
					deleteBrick(i, j); 

					return;
				}

				// find bricks affected by DOT
				if (shapeRowAll[i][j].lifespan != 0)
				{
					if (shapeRowAll[i][j].lifespan == 0)
					{
						deleteBrick();
					}
				}
			}
		//}
	//}
}

function deleteBrick(i, j){
	typeRowAll[i][j] = 0;
	shapeRowAll[i][j] = null;
	app.main.totalScore++;


	for(var g = 0; g < blocks.length; g++){
		if((blocks[g].row == i) && (blocks[g].rowIndex == j)){
			blocks.splice(g, 1);
		}
	}
}

function findBottom(){
	var cols = [];
	
	for(var i=0;i<map.bottomBricks.length;i++){
		map.bottomBricks[i] = null;
	}

	var colCheck = function(){
		for(var i=0;i<map.bottomBricks.length;i++){
			if(map.bottomBricks[i] == null){
				return false;
			}else{
				//i+=1;
			}
		}
		//map.rayTurn = map.bottomBricks[map.bottomBricks.length-1].x;
		return true;
	};
	for(var i = shapeRowAll.length - 1; i >= 0;i--){
		if(colCheck() == false){
			for(var j=0;j< blocks.length;j++){
				if(blocks[j].row == i){
					if(map.bottomBricks[blocks[j].rowIndex] == null){
						map.bottomBricks[blocks[j].rowIndex] = blocks[j];
						if(map.bottomBricks[blocks[j].rowIndex + 1] == null)
							map.bottomBricks[blocks[j].rowIndex + 1] = 0;
					}
				}
				/*
				if(shapeRowAll[i][j] != null){
					if(map.bottomBricks[j] == null){
						map.bottomBricks[j] = shapeRowAll[i][j];
						j+=2;
					}
				} */
			}
		}else{
			return;
		}
	}

	var temp = -1;
	var first = true;
	for(var i=0; i<map.bottomBricks.length; i++){
		if(map.bottomBricks[i] == 0){
			continue;
		}
		if(map.bottomBricks[i] == null){
			temp = i;
		}else{
			//console.log("i " + i);
			map.bottomLeft.x = map.bottomBricks[i].x;
			map.bottomLeft.y = +map.bottomBricks[i].y + +map.bottomBricks[i].h;
			break;
		}
	}

	for(var i=map.bottomBricks.length - 1; i>=0; i--){
		if(map.bottomBricks[i] == 0){
			continue;
		}
		if(map.bottomBricks[i] == null){
			temp = i;
		}else{
			map.bottomRight.x = +map.bottomBricks[i].x + +map.bottomBricks[i].w;
			map.bottomRight.y = +map.bottomBricks[i].y + +map.bottomBricks[i].h;
			break;
		}
	}

} // end findBottom()