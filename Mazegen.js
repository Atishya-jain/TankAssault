var canvas;
var context;
var theMaze = null;

$(document).ready(function() {
	canvas = document.getElementById('maze');
	context = canvas.getContext('2d');	
	context.font = "bold 20px sans-serif";
	$(document).keydown(handleKeypress);
});
$('#generate').live('click', function() {
	//console.profile();
	makeMaze();
	//console.profileEnd();
});
function makeMaze() {
	var rows =  Math.floor(Math.random() * 5) + 5;  // rows of maze
	var columns = Math.floor(Math.random() * 5) + 5; // columns of maze
	var gridsize =7*rows; // grid size of maze
	var mazeStyledecision = Math.floor(Math.random() * 2) + 1;
	//var mazeStyle = $('input[name=mazeStyle]:checked').val();
	if(mazeStyledecision == 1){
		var mazeStyle = 'straight';
	}else{
		var mazeStyle = 'normal';
	}
	var startColumn = 0;
	var startRow = 0;
	var endColumn = columns - 1;
	var endRow = rows - 1;
	var wallR = 0;
	var wallG = 0;
	var wallB = 0;
	var backgroundR = 255;
	var backgroundG = 255;
	var backgroundB = 255;
	var solutionR = $('#solutionR').val();
	var solutionG = $('#solutionG').val();
	var solutionB = $('#solutionB').val();
	
	var wallColor = "rgb(" + wallR + "," + wallG + "," + wallB + ")";
	var backgroundColor = "rgb(" + backgroundR + "," + backgroundG + "," + backgroundB + ")";
	var solutionColor = "rgb(" + solutionR + "," + solutionG + "," + solutionB + ")";
	theMaze = new maze(rows, columns, gridsize, mazeStyle, startColumn, startRow, endColumn, endRow, wallColor, backgroundColor, solutionColor);
	theMaze.generate();
	theMaze.draw();
}

// Detecting the arrow key pressed and then changing values accordingly
function handleKeypress(event) {
	var currentPlayerGrid = theMaze.grid[theMaze.playerX][theMaze.playerY];
	var isMoving = false;
	var changeX = 0;
	var changeY = 0;
	if (event.keyCode == 32 || event.keyCode == 38 || event.keyCode == 40) {
		event.preventDefault();	
	}
	switch(event.keyCode) {
		case 37: {
			//left key
			if (currentPlayerGrid.leftWall == false) {
				changeX = -1;
				isMoving = true;
			}
			break;
		}
		case 38: {
			//up key
			if (currentPlayerGrid.topWall == false) {
				changeY = -1;	
				isMoving = true;
			}
			break;
		}
		case 39: {
			//right key
			if (currentPlayerGrid.rightWall == false) {
				changeX = 1;
				isMoving = true;
			}
			break;
		}
		case 40: {
			//down key
			if (currentPlayerGrid.bottomWall == false) {
				changeY = 1;
				isMoving = true
			}
			break;
		}
		default: {
			//not a key we care about
			break;
		}
	}
	if (isMoving == true) {
		//maze.prototype.drawPlayer.cleaRect(drawX, drawY, (this.gridsize/2),(this.gridsize*2/3));
		theMaze.redrawCell(theMaze.grid[theMaze.playerX][theMaze.playerY]);
		theMaze.playerX += changeX;
		theMaze.playerY += changeY;
		theMaze.drawPlayer();
	}
}

// This function basically is to remove the previously drawn tank after tank moves to new position
maze.prototype.redrawCell = function(theCell) {
	//console.log(theCell);
	var drawX = (theCell.x * this.gridsize);
	var drawY = (theCell.y * this.gridsize);
	var pastX = parseInt(drawX) + parseInt(this.gridsize);
	var pastY = parseInt(drawY) + parseInt(this.gridsize);
	context.fillStyle = this.backgroundColor;		
	
	// To remove previous rectangle we graw a white stroke of line of same size as rectangle
	context.fillRect(drawX, drawY, this.gridsize, this.gridsize);	
	context.beginPath();
	if (theCell.leftWall == true) {
		//context.strokeRect(drawX, drawY, 1, this.gridsize);
		context.moveTo(drawX, drawY);
		context.lineTo(drawX, pastY);
	}
	if (theCell.topWall == true) {
		//context.strokeRect(drawX, drawY, this.gridsize, 1);
		context.moveTo(drawX, drawY);
		context.lineTo(pastX, drawY);
	}
	if (theCell.rightWall == true) {
		//context.strokeRect((drawX + this.gridsize), drawY, 1, this.gridsize);
		context.moveTo(pastX, drawY);
		context.lineTo(pastX, pastY);
	}
	if (theCell.bottomWall == true) {
		//context.strokeRect(drawX, (drawY + this.gridsize), this.gridsize, 1);	
		context.moveTo(drawX, pastY);
		context.lineTo(pastX, pastY);
	}
	context.closePath();
	context.stroke();
}




function maze(rows, columns, gridsize, mazeStyle, startColumn, startRow, endColumn, endRow, wallColor, backgroundColor, solutionColor) {
	this.rows = rows;
	this.columns = columns;
	this.gridsize = gridsize;
	this.mazeStyle = mazeStyle;
	this.sizex = gridsize * rows;
	this.sizey = gridsize * columns;
	this.halfgridsize = this.gridsize / 2;
	this.grid = new Array(this.columns);
	this.history = new Array();
	this.startColumn = parseInt(startColumn);
	this.startRow = parseInt(startRow);
	this.playerX = this.startColumn;
	this.playerY = this.startRow;
	this.endColumn = parseInt(endColumn);
	this.endRow = parseInt(endRow);
	this.wallColor = wallColor;
	this.backgroundColor = backgroundColor;
	this.solutionColor = solutionColor;
	this.lineWidth = 2;
	this.genStartColumn = Math.floor(Math.random() * (this.columns- 1));
	this.genStartRow = Math.floor(Math.random() * (this.rows- 1));
	this.cellCount = this.columns * this.rows;
	this.generatedCellCount = 0;
	for (i = 0; i < columns; i++) {
		this.grid[i] = new Array(rows);		
	}
	for (j = 0; j < this.columns; j++) {
		for (k = 0; k < this.rows; k++) {
			var isStart = false;
			var isEnd = false;
			var partOfMaze = false;
			var isGenStart = false;
			if (j == this.startColumn && k == this.startRow) {
				isStart = true;
			}
			if (j == this.genStartColumn && k == this.genStartRow) {
				partOfMaze = true;
				isGenStart = true;
			}
			if (j == this.endColumn && k == this.endRow) {
				isEnd = true;		
			}
			this.grid[j][k] = new cell(j, k, partOfMaze, isStart, isEnd, isGenStart);
		}
	}
}
maze.prototype.generate = function() {
	var theMaze = this;
	var currentCell = this.grid[this.genStartColumn][this.genStartRow];
	var nextCell;
	var leftCellPartOfMaze = false;
	var topCellPartOfMaze = false;
	var rightCellPartOfMaze = false;
	var bottomCellPartOfMaze = false;
	var currentX = this.genStartColumn;
	var currentY = this.genStartRow;
	var changeX = 0;
	var changeY = 0;
	var previousChangeX = 0;
	var previousChangeY = 0;
	var leftCell;
	var topCell;
	var rightCell;
	var bottomCell;
	var direction;
	var leftChoices;
	var rightChoices;
	var downChoices;
	var upChoices;
	var biasDirection;
	var choices;
	while (this.generatedCellCount < this.cellCount - 1) {
		doGeneration();	
	}
	function chooseCell() {
		changeX = 0;
		changeY = 0;
		choices = [];
		biasDirection = '';
		if (previousChangeX == -1) {
			biasDirection = 'left';	
		} else if (previousChangeX == 1) {
			biasDirection = 'right';
		} else if (previousChangeY == -1) {
			biasDirection = 'up';
		} else if (previousChangeY == 1) {
			biasDirection = 'down';
		}
		direction = '';
		leftChoices = [0, 0, 0, 0, 0];
		upChoices = [1, 1, 1, 1, 1];
		rightChoices = [2, 2, 2, 2, 2];
		downChoices = [3, 3, 3, 3, 3];
		switch (theMaze.mazeStyle) {
		case "straight": {
			leftChoices = [0];
			upChoices = [1];
			rightChoices = [2];
			downChoices = [3];		
			if (biasDirection == 'left') {
				leftChoices = [0, 0, 0, 0, 0, 0, 0, 0];				
			} else if (biasDirection == 'right') {
				rightChoices = [2, 2, 2, 2, 2, 2, 2, 2];		
			} else if (biasDirection == 'down') {
				downChoices = [3, 3, 3, 3, 3, 3, 3, 3];	
			} else if (biasDirection == 'up') {
				upChoices = [1, 1, 1, 1, 1, 1, 1, 1]		
			}
			break;
		}
		case "normal": {
			leftChoices = [0];
			upChoices = [1];
			rightChoices = [2];
			downChoices = [3];
			break;
		}
		}
		choices = leftChoices.concat(rightChoices.concat(downChoices.concat(upChoices)));
		var rand = Math.floor(Math.random() * choices.length);
		var weightedRand = choices[rand];
		switch(weightedRand) {
		case 0: {
			nextCell = leftCell;
			changeX = -1;
			direction = 'left';
			break;				
		}
		case 1: {
			nextCell = topCell;
			changeY = -1;
			direction = 'up';
			break;	
		}
		case 2: {
			nextCell = rightCell;
			changeX = 1;
			direction = 'right';
			break;
		}
		case 3: {
			nextCell = bottomCell;
			changeY = 1;
			direction = 'down';
			break;	
		}
		default: {
			nextCell = null;
			changeY = 0;
			changeX = 0;
			break;		
		}
		}

		if (nextCell == null || nextCell.partOfMaze == true) {
			chooseCell();	
		} else {
			currentX += changeX;
			currentY += changeY;
			previousChangeX = changeX;
			previousChangeY = changeY;
			theMaze.history.push(direction);
		}
	}
	function addToMaze() {
		nextCell.partOfMaze = true;
		if (changeX == -1) {
			currentCell.leftWall = false;
			nextCell.rightWall = false;
		}
		if (changeY == -1) {
			currentCell.topWall = false;
			nextCell.bottomWall = false;
		}
		if (changeX == 1) {
			currentCell.rightWall = false;
			nextCell.leftWall = false;
		}
		if (changeY == 1) {
			currentCell.bottomWall = false;
			nextCell.topWall = false;
		}
	}
	function doGeneration() {
		//stop generation if the maze is full
		if (theMaze.generatedCellCount == theMaze.cellCount - 1) {
			return;		
		}
		//do actual generation
		changeX = 0;
		changeY = 0;
		if (currentX > 0) {
			leftCell = theMaze.grid[currentX - 1][currentY];
			leftCellPartOfMaze = leftCell.partOfMaze;
		} else {
			leftCell = null;
			leftCellPartOfMaze = true;
		}	
		if (currentY > 0) {
			topCell = theMaze.grid[currentX][currentY - 1];
			topCellPartOfMaze = topCell.partOfMaze;
			
		} else {
			topCell = null;	
			topCellPartOfMaze = true;
		}
		if (currentX < (theMaze.columns - 1)) {
			rightCell = theMaze.grid[currentX + 1][currentY];
			rightCellPartOfMaze = rightCell.partOfMaze;
		} else {
			rightCell = null;
			rightCellPartOfMaze = true;
		}
		if (currentY < (theMaze.rows - 1)) {
			bottomCell = theMaze.grid[currentX][currentY + 1];
			bottomCellPartOfMaze = bottomCell.partOfMaze;
		} else {
			bottomCell = null;
			bottomCellPartOfMaze = true;
		}
		if (leftCellPartOfMaze == true && topCellPartOfMaze == true && rightCellPartOfMaze == true && bottomCellPartOfMaze == true) {
			//go back and check previous cell for generation
			var lastDirection = theMaze.history.pop();
			changeX = 0;
			changeY = 0;
			switch (lastDirection) {
			case 'left': {
				changeX = 1;
				break;			
			}
			case 'up': {
				changeY = 1;
				break;				
			}			
			case 'right': {
				changeX = -1;
				break;				
			}
			case 'down': {
				changeY = -1;
				break;
			}
			}
			nextCell = theMaze.grid[currentX + changeX][currentY + changeY];
			currentX += changeX;
			currentY += changeY;
			currentCell = nextCell;
				doGeneration();

		} else {
			chooseCell();
			addToMaze();	
			currentCell = nextCell;
			//console.log(currentCell);
			theMaze.generatedCellCount += 1;
			//doGeneration();
		}
	}
}
maze.prototype.draw = function() {
	var totalWidth = this.columns * this.gridsize;
	var totalHeight = this.rows * this.gridsize;
	$('#maze').attr("width", totalWidth);
	$('#maze').attr("height", totalHeight);
	context.lineWidth = this.lineWidth;
	context.clearRect(0, 0, totalWidth, totalHeight);
	context.strokeStyle = this.wallColor;
	for (j = 0; j < this.columns; j++) {
		for (k = 0; k < this.rows; k++) {
			var drawX = (j * this.gridsize);
			var drawY = (k * this.gridsize);
			var pastX = parseInt(drawX) + parseInt(this.gridsize);
			var pastY = parseInt(drawY) + parseInt(this.gridsize);
			var theCell = this.grid[j][k];
			//this.drawColors(theCell);
				context.fillStyle = this.backgroundColor;
			
			context.fillRect(drawX, drawY, this.gridsize, this.gridsize);	
			context.beginPath();
			if (theCell.leftWall == true) {
				//context.strokeRect(drawX, drawY, 1, this.gridsize);
				context.moveTo(drawX, drawY);
				context.lineTo(drawX, pastY);
			}
			if (theCell.topWall == true) {
				//context.strokeRect(drawX, drawY, this.gridsize, 1);
				context.moveTo(drawX, drawY);
				context.lineTo(pastX, drawY);
			}
			if (theCell.rightWall == true) {
				//context.strokeRect((drawX + this.gridsize), drawY, 1, this.gridsize);
				context.moveTo(pastX, drawY);
				context.lineTo(pastX, pastY);
			}
			if (theCell.bottomWall == true) {
				//context.strokeRect(drawX, (drawY + this.gridsize), this.gridsize, 1);	
				context.moveTo(drawX, pastY);
				context.lineTo(pastX, pastY);
			}
			context.closePath();
			context.stroke();
			
		}
	}
	this.drawPlayer();
}

// drawing tank
maze.prototype.drawPlayer = function() {
	var drawX = this.playerX * this.gridsize + (this.gridsize/4);
	var drawY = this.playerY * this.gridsize + (this.gridsize/4);
	context.fillStyle = "gold";
	context.beginPath();
	context.rect(drawX, drawY, (this.gridsize/2),(this.gridsize*2/3));
	context.closePath();
	context.fill();
}

function cell(column, row, partOfMaze, isStart, isEnd, isGenStart) {
	this.x = column;
	this.y = row;
	this.leftWall = true;
	this.topWall = true;
	this.rightWall = true;
	this.bottomWall = true;
	this.partOfMaze = partOfMaze;
	this.isPlayer = false;
}
