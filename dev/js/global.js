import PF from 'pathfinding';
import functions from './functions';


import { clearField, sum } from './field';

sum(1,2)


export default {
	game() {



// game constants
const cellSize = 64;
const stepsPerCell = Math.floor(cellSize / 4);
const fieldWidth = cellSize * Math.floor(window.innerWidth / cellSize);
const fieldHeight = cellSize * Math.floor(window.innerHeight / cellSize);
const cellsInWidth = fieldWidth / cellSize;
const cellsInHeight = fieldHeight / cellSize;
const totalCells = cellsInWidth * cellsInHeight;



// canvas settings
const canvas = document.getElementById('app');
const ctx = canvas.getContext('2d');
canvas.width = fieldWidth;
canvas.height = fieldHeight;
canvas.style.display = 'block';
canvas.style.background = '#fafafa';



let fieldMatrix = functions.createFieldMatrix(cellsInWidth, cellsInHeight);
let filledFieldMatrix = functions.fillFieldMatrix(fieldMatrix,[[3,3],[3,4],[3,5],[7,1],[7,2],[7,3]]);



class Unit {
	constructor(x,y) {
		this.x = x;
		this.y = y;
		this.speed = 4;
		this.target = {x: null, y: null};
		this.path = [];
		this.nextPath = [];
		this.pathIndex = 0;
		this.currentDirection = 'b';
		this.directionIndex = 0;
		this.allDirections = {
			t: {x: 0, y: -this.speed},
			tr: {x: this.speed, y: -this.speed},
			r: {x: this.speed, y: 0},
			rb: {x: this.speed, y: this.speed},
			b: {x: 0, y: this.speed},
			bl: {x: -this.speed, y: this.speed},
			l: {x: -this.speed, y: 0},
			lt: {x: -this.speed, y: -this.speed},
		};
		this.idle = 0;
	}
	followThePath() {
		if(this.path.length !== 0) {
			if(this.directionIndex === 0) {
				this.findNextDirection();
			}
			this.x += this.allDirections[this.currentDirection].x;
			this.y += this.allDirections[this.currentDirection].y;
			this.directionIndex += this.speed;
			if(this.directionIndex >= cellSize) {
				this.directionIndex = 0;
				this.pathIndex += 1;
				if(this.nextPath.length !== 0) {
					this.path = this.nextPath;
					this.nextPath = [];
					this.pathIndex = 0;
				}
				if(this.pathIndex === this.path.length - 1) {
					this.path = [];
					this.nextPath = [];
					this.pathIndex = 0;
				}
			}
		}
	}
	findNextDirection() {
		if(this.path.length > 1) {
			let xDiff = this.path[this.pathIndex + 1].x - this.path[this.pathIndex].x;
			let yDiff = this.path[this.pathIndex + 1].y - this.path[this.pathIndex].y;
			if(xDiff === 0 && yDiff < 0) this.currentDirection = 't';
			if(xDiff > 0 && yDiff < 0) this.currentDirection = 'tr';
			if(xDiff > 0 && yDiff === 0) this.currentDirection = 'r';
			if(xDiff > 0 && yDiff > 0) this.currentDirection = 'rb';
			if(xDiff === 0 && yDiff > 0) this.currentDirection = 'b';
			if(xDiff < 0 && yDiff > 0) this.currentDirection = 'bl';
			if(xDiff < 0 && yDiff === 0) this.currentDirection = 'l';
			if(xDiff < 0 && yDiff < 0) this.currentDirection = 'lt';
		}
	}
	randomTurns() {
		this.idle++;
		if(this.idle > 400) {
			let directionsArray = Object.keys(this.allDirections);
			functions.shuffleArray(directionsArray);
			this.currentDirection = directionsArray[0];
			this.idle = 0;
		}
	}
	resetTarget() {
		this.target.x = this.target.y = null;
	}
	isTargetSet() {
		return this.target.x !== null && this.target.y !== null;
	}
	isTargetAchieved() {
		return this.target.x === this.x && this.target.y === this.y;
	}
	setTarget(e) {
		this.target.x = Math.floor((e.clientX - canvas.offsetLeft) / cellSize) * cellSize;
		this.target.y = Math.floor((e.clientY - canvas.offsetTop) / cellSize) * cellSize;
	}
	setPath() {
		if(this.target.x !== this.x || this.target.y !== this.y) {
			let startX = this.x;
			let startY = this.y;
			if(this.path.length !== 0) {
				startX = this.path[this.pathIndex + 1].x;
				startY = this.path[this.pathIndex + 1].y;
			}
			let grid = new PF.Grid(filledFieldMatrix);
			let finder = new PF.AStarFinder({allowDiagonal: true});
			let unitPathX = (startX + cellSize) / cellSize;
			let unitPathY = (startY + cellSize) / cellSize;
			let pathTargetX = (this.target.x + cellSize) / cellSize;
			let pathTargetY = (this.target.y + cellSize) / cellSize;
			let path = finder.findPath(unitPathX, unitPathY, pathTargetX, pathTargetY, grid);
			let smartPath = path.map(function(item) {
				let nx = item[0] * cellSize - cellSize;
				let ny = item[1] * cellSize - cellSize;
				return {x: nx, y: ny};
			});
			if(this.path.length !== 0) {
				this.nextPath = smartPath;
			} else {
				this.path = smartPath;
			}
			console.log('path was set');
		} else {
			console.log('same cell');
		}
	}
}

class Knight extends Unit {
	constructor(x,y) {
		super(x,y);
		this.image = document.getElementById('unit');
	}
}

let knight1 = new Knight(0,0);
let knight2 = new Knight(256,0);
let knight3 = new Knight(128,0);


let allUnits = [knight1, knight2, knight3];




function drawField() {
	filledFieldMatrix.forEach(function(row, index) {
		let y = index * cellSize - cellSize;
		row.forEach(function(cell, i) {
			if(cell === 1) {
				let x = i * cellSize - cellSize;
				ctx.fillStyle = '#aaaaaa';
				ctx.fillRect(x, y, cellSize, cellSize);
			}
		});
	});
}

// function clearField() {
// 	ctx.clearRect(0, 0, fieldWidth, fieldHeight);
// }

function drawTarget() {
	if(unit.isTargetSet()) {
		ctx.fillStyle = '#f0f0f0';
		ctx.fillRect(unit.target.x, unit.target.y, cellSize, cellSize);
	}
}

function unitLook(unit) {
	let x = 0;
	if(unit.currentDirection === 't') {x = 0;}
	if(unit.currentDirection === 'tr') {x = cellSize;}
	if(unit.currentDirection === 'r') {x = cellSize * 2;}
	if(unit.currentDirection === 'rb') {x = cellSize * 3;}
	if(unit.currentDirection === 'b') {x = cellSize * 4;}
	if(unit.currentDirection === 'bl') {x = cellSize * 5;}
	if(unit.currentDirection === 'l') {x = cellSize * 6;}
	if(unit.currentDirection === 'lt') {x = cellSize * 7;}
	let y = cellSize * Math.floor(unit.directionIndex / stepsPerCell);
	return [x,y];
}

function drawUnit(ctx, units) {
	units.forEach(function(unit) {
		let look = unitLook(unit);
		let x = look[0];
		let y = look[1];
		ctx.drawImage(unit.image, x, y, cellSize, cellSize, unit.x, unit.y, cellSize, cellSize);
	});
}

function unitsMoves(units) {
	units.forEach(function(unit) {
		if(unit.isTargetSet()) {
			unit.followThePath();
		} else {
			unit.randomTurns();
		}
		if(unit.isTargetAchieved()) {
			unit.resetTarget();
		}
	});
}

function move() {
	clearField(ctx, fieldWidth, fieldHeight);
	drawField();
	// drawTarget();
	drawUnit(ctx, allUnits);
	unitsMoves(allUnits);
	window.requestAnimationFrame(move);
}

window.requestAnimationFrame(move);

function allSetPath(units) {
	units.forEach(function(unit) {
		unit.setPath();
	});
}
function allSetTarget(e, units) {
	units.forEach(function(unit) {
		unit.setTarget(e);
	});
}


canvas.onmousedown = e => {
	allSetTarget(e,allUnits);
	allSetPath(allUnits);
};



	}
};
