import PF from 'pathfinding';

export default {
	game() {
		console.log('game');



let canvas = document.getElementById('app');
let ctx = canvas.getContext('2d');
let image = document.getElementById('unit');
let speed = 4;
let cellSize = 64;
let stepCellPosition = Math.floor(cellSize / 4);
let target = {x: null, y: null};


let fieldWidth = cellSize * Math.floor(window.innerWidth / cellSize);
let fieldHeight = cellSize * Math.floor(window.innerHeight / cellSize);
canvas.width = fieldWidth;
canvas.height = fieldHeight;
canvas.style.display = 'block';
canvas.style.background = '#fafafa';

class Field {
	constructor() {
		this.cellSize = 64;
	}
}

class Unit {
	constructor(x,y) {
		this.x = x;
		this.y = y;
		this.speed = 4;
		this.path = [];
		this.nextPath = [];
		this.pathIndex = 0;
		this.currentDirection = 'b';
		this.directionIndex = 0;
		this.allDirections = {
			t: {x: 0, y: -speed},
			tr: {x: speed, y: -speed},
			r: {x: speed, y: 0},
			rb: {x: speed, y: speed},
			b: {x: 0, y: speed},
			bl: {x: -speed, y: speed},
			l: {x: -speed, y: 0},
			lt: {x: -speed, y: -speed},
		};
		this.idle = 0;
	}
}

let unit = new Unit(0,0);
let unit2 = new Unit(0,128);


let cellsInWidth = fieldWidth / cellSize;
let cellsInHeight = fieldHeight / cellSize;
let amountOfCells = cellsInWidth * cellsInHeight;
let field = [];
for(let i = 0; i < amountOfCells; i++) {
	let x = i < cellsInWidth ? i * cellSize : (i - (Math.floor(i / cellsInWidth) * cellsInWidth)) * cellSize;
	let y = i < cellsInWidth ? 0 : Math.floor(i / cellsInWidth) * cellSize;
	field.push({x: x, y: y, busy: false});
}

function createFieldMatrix(width, height) {
	let fieldCoverage = [];
	for(let i = 0; i < height; i++) {
		let row = [];
		for(let i = 0; i < width; i++) {
			row.push(0);
		}
		fieldCoverage.push(row);
	}
	return fieldCoverage;
}

function fillFieldMatrix(arr) {
	arr.forEach(function(item) {
		let row = item[0];
		let cell = item[1];
		matrix[row][cell] = 1;
	});
}


let matrix = createFieldMatrix(cellsInWidth, cellsInHeight);
fillFieldMatrix([[3,3],[3,4],[3,5],[7,1],[7,2],[7,3]]);

// console.log(matrix);
// todo:
// Lee algorithm
// https://github.com/qiao/PathFinding.js/



// var unitPathX = (target.x + cellSize) / cellSize;
// var unitPathY = (target.y + cellSize) / cellSize;
// var pathTargetX = (target.x + cellSize) / cellSize;
// var pathTargetY = (target.y + cellSize) / cellSize;

// var path = finder.findPath(unitPathX, unitPathY, pathTargetX, pathTargetY, grid);
// console.log(path);




function drawField() {
	matrix.forEach(function(row, index) {
		let y = index * cellSize - cellSize;
		row.forEach(function(cell, i) {
			if(cell !== 0) {
				let x = i * cellSize - cellSize;
				ctx.fillStyle = '#aaaaaa';
				ctx.fillRect(x, y, cellSize, cellSize);
			}
		});
	});
}

function clearField() {
	ctx.clearRect(0, 0, fieldWidth, fieldHeight);
}
function drawTarget() {
	if(isTargetSet()) {
		ctx.fillStyle = '#f0f0f0';
		ctx.fillRect(target.x, target.y, cellSize, cellSize);
	}
}

function drawUnit() {
	let x = 0;
	if(unit.currentDirection === 't') {x = 0;}
	if(unit.currentDirection === 'tr') {x = cellSize;}
	if(unit.currentDirection === 'r') {x = cellSize * 2;}
	if(unit.currentDirection === 'rb') {x = cellSize * 3;}
	if(unit.currentDirection === 'b') {x = cellSize * 4;}
	if(unit.currentDirection === 'bl') {x = cellSize * 5;}
	if(unit.currentDirection === 'l') {x = cellSize * 6;}
	if(unit.currentDirection === 'lt') {x = cellSize * 7;}
	let y = cellSize * Math.floor(unit.directionIndex / stepCellPosition);
	ctx.drawImage(image, x, y, cellSize, cellSize, unit.x, unit.y, cellSize, cellSize);
}

function setPath() {
	if(target.x !== unit.x || target.y !== unit.y) {
		let preX = unit.x;
		let preY = unit.y;
		if(unit.path.length !== 0) {
			preX = unit.path[unit.pathIndex + 1].x;
			preY = unit.path[unit.pathIndex + 1].y;
		}

		let x = Math.floor(preX / cellSize) * cellSize;
		let y = Math.floor(preY / cellSize) * cellSize;
		let path = line(x, y, target.x, target.y, cellSize);

		var grid = new PF.Grid(matrix);
		var finder = new PF.AStarFinder({
			allowDiagonal: true
		});
		var unitPathX = (unit.x + cellSize) / cellSize;
		var unitPathY = (unit.y + cellSize) / cellSize;
		var pathTargetX = (target.x + cellSize) / cellSize;
		var pathTargetY = (target.y + cellSize) / cellSize;
		
		console.log(unitPathX, unitPathY, pathTargetX, pathTargetY);
	
		var newPath = finder.findPath(unitPathX, unitPathY, pathTargetX, pathTargetY, grid);
		console.log(newPath);
		var smartPath = newPath.map(function(item) {
			let nx = item[0] * 64 - 64;
			let ny = item[1] * 64 - 64;
			return {x: nx, y: ny};
		});

		if(unit.path.length !== 0) {
			unit.nextPath = path;
		} else {
			unit.path = smartPath;
		}

	



		console.log('path was set');


	} else {
		console.log('same cell');
	}

}

function findNextDirection() {
	if(unit.path.length > 1) {
		let xDiff = unit.path[unit.pathIndex + 1].x - unit.path[unit.pathIndex].x;
		let yDiff = unit.path[unit.pathIndex + 1].y - unit.path[unit.pathIndex].y;
		if(xDiff === 0 && yDiff < 0) return 't';
		if(xDiff > 0 && yDiff < 0) return 'tr';
		if(xDiff > 0 && yDiff === 0) return 'r';
		if(xDiff > 0 && yDiff > 0) return 'rb';
		if(xDiff === 0 && yDiff > 0) return 'b';
		if(xDiff < 0 && yDiff > 0) return 'bl';
		if(xDiff < 0 && yDiff === 0) return 'l';
		if(xDiff < 0 && yDiff < 0) return 'lt';
	}
}

function followThePath() {
	if(unit.path.length !== 0) {
		if(unit.directionIndex === 0) {
			unit.currentDirection = findNextDirection();
		}
		unit.x += unit.allDirections[unit.currentDirection].x;
		unit.y += unit.allDirections[unit.currentDirection].y;

		unit.directionIndex += unit.speed;
		if(unit.directionIndex >= cellSize) {
			unit.directionIndex = 0;
			unit.pathIndex += 1;
			console.log('cell passed');
			if(unit.nextPath.length !== 0) {
				unit.path = unit.nextPath;
				unit.nextPath = [];
				unit.pathIndex = 0;
			}
			if(unit.pathIndex === unit.path.length - 1) {
				unit.path = [];
				unit.pathIndex = 0;
				console.log('target achieved');
			}
		}
	}
}

function randomTurns() {
	unit.idle++;
	if(unit.idle * unit.speed > 600) {
		let directionsArray = Object.keys(unit.allDirections);
		shuffleArray(directionsArray);
		unit.currentDirection = directionsArray[0];
		unit.idle = 0;
	}
}

function shuffleArray(a) {
	for(let i = a.length; i; i--) {
		let j = Math.floor(Math.random() * i);
		[a[i - 1], a[j]] = [a[j], a[i - 1]];
	}
}

function move() {
	clearField();
	drawField();
	drawTarget();
	drawUnit();
	if(isTargetSet()) {
		followThePath();
	} else {
		randomTurns();
	}
	if(isTargetAchieved()) {
		resetTarget();
	}
	window.requestAnimationFrame(move);
}

window.requestAnimationFrame(move);

canvas.onmousedown = e => {
	target.x = Math.floor((e.clientX - canvas.offsetLeft) / cellSize) * cellSize;
	target.y = Math.floor((e.clientY - canvas.offsetTop) / cellSize) * cellSize;
	setPath();
};

function line(x0, y0, x1, y1, step) {
	let lineArr = [];
	let dx = Math.abs(x1-x0);
	let dy = Math.abs(y1-y0);
	let sx = (x0 < x1) ? step : -step;
	let sy = (y0 < y1) ? step : -step;
	let err = dx-dy;

	while(true) {
		lineArr.push({x: x0, y: y0});
		// console.log(x0,y0);
		if ((x0==x1) && (y0==y1)) break;
		let e2 = 2*err;
		if (e2 >-dy){ err -= dy; x0  += sx; }
		if (e2 < dx){ err += dx; y0  += sy; }
	}
	return lineArr;
}








function resetTarget() {
	target.x = target.y = null;
}

const isTargetSet = () => target.x !== null && target.y !== null;
const isTargetAchieved = () => target.x === unit.x && target.y === unit.y;






	}
};
