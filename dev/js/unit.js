import PF from 'pathfinding';

import {

    filledFieldMatrix,

} from './constants';

import {

    shuffleArray,

} from './functions';



export default class Unit {
    constructor(props) {
        this.size = props.size;
        this.x = props.x;
        this.y = props.y;
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
        this.isSelected = false;
        this.occupiedCellX = props.x;
        this.occupiedCellY = props.y;
    }
    findNextDirection() {
        if (this.path.length > 1) {
            let xDiff = this.path[this.pathIndex + 1].x - this.path[this.pathIndex].x;
            let yDiff = this.path[this.pathIndex + 1].y - this.path[this.pathIndex].y;
            if (xDiff === 0 && yDiff < 0) this.currentDirection = 't';
            if (xDiff > 0 && yDiff < 0) this.currentDirection = 'tr';
            if (xDiff > 0 && yDiff === 0) this.currentDirection = 'r';
            if (xDiff > 0 && yDiff > 0) this.currentDirection = 'rb';
            if (xDiff === 0 && yDiff > 0) this.currentDirection = 'b';
            if (xDiff < 0 && yDiff > 0) this.currentDirection = 'bl';
            if (xDiff < 0 && yDiff === 0) this.currentDirection = 'l';
            if (xDiff < 0 && yDiff < 0) this.currentDirection = 'lt';
        }
    }
    randomTurns() {
        this.idle++;
        if (this.idle > 400) {
            let directionsArray = Object.keys(this.allDirections);
            shuffleArray(directionsArray);
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
        let size = this.size;
        this.target.x = Math.floor(e.clientX / size) * size;
        this.target.y = Math.floor(e.clientY / size) * size;
    }
    drawOutline(ctx, outlineSize) {
        if (this.isSelected) {
            ctx.beginPath();
            ctx.rect(this.x, this.y, outlineSize, outlineSize);
            ctx.strokeStyle = "#fc0";
            ctx.stroke();
        }
    }
    drawUnit(ctx, unitSize) {
        let look = this.unitLook();
        let x = look[0];
        let y = look[1];
        ctx.drawImage(this.image, x, y, unitSize, unitSize, this.x, this.y, unitSize, unitSize);
    }
    unitLook() {
        let size = this.size;
        let x = 0;
        if (this.currentDirection === 't') {x = 0;}
        if (this.currentDirection === 'tr') {x = size;}
        if (this.currentDirection === 'r') {x = size * 2;}
        if (this.currentDirection === 'rb') {x = size * 3;}
        if (this.currentDirection === 'b') {x = size * 4;}
        if (this.currentDirection === 'bl') {x = size * 5;}
        if (this.currentDirection === 'l') {x = size * 6;}
        if (this.currentDirection === 'lt') {x = size * 7;}
        let y = size * Math.floor(this.directionIndex / Math.floor(size / 4));
        return [x,y];
    }
    setPath() {

        /**
         * во время входа в каждую ячейку проверять, не занята ли она на данный момент
         * если занята, то перерасчитывать путь заново
         * ограничивать количество попыток (100?)
         */

        let size = this.size;

        if (this.target.x !== this.x || this.target.y !== this.y) {
            let startX = this.x;
            let startY = this.y;
            if (this.path.length !== 0) {
                startX = this.path[this.pathIndex + 1].x;
                startY = this.path[this.pathIndex + 1].y;
            }
            let grid = new PF.Grid(filledFieldMatrix);
            let finder = new PF.AStarFinder({allowDiagonal: true});



            /// The mess starts here

            let unitPathX = startX / size; /// maybe i should remove all these sizes ??? (1,2) better than (64,128)
            let unitPathY = startY / size;
            let pathTargetX = this.target.x / size;
            let pathTargetY = this.target.y / size;
            let path = finder.findPath(unitPathX, unitPathY, pathTargetX, pathTargetY, grid);

            let smartPath = path.map(function(item) {
                let nx = item[0] * size;
                let ny = item[1] * size;
                return {x: nx, y: ny};
            });
            if (this.path.length !== 0) {
                this.nextPath = smartPath;
            } else {
                this.path = smartPath;
            }
            console.log('path was set');
        } else {
            console.log('same cell');
        }
    }
    followThePath() {
        let size = this.size;
        if (this.path.length !== 0) {
            if (this.directionIndex === 0) {
                this.findNextDirection();
            }
            this.x += this.allDirections[this.currentDirection].x;
            this.y += this.allDirections[this.currentDirection].y;

            this.occupiedCellX = Math.floor(this.x / size) * size;
            this.occupiedCellY = Math.floor(this.y / size) * size;

            this.directionIndex += this.speed;
            if (this.directionIndex >= size) {
                this.directionIndex = 0;
                this.pathIndex += 1;
                if (this.nextPath.length !== 0) {
                    this.path = this.nextPath;
                    this.nextPath = [];
                    this.pathIndex = 0;
                }
                if (this.pathIndex === this.path.length - 1) {
                    this.path = [];
                    this.nextPath = [];
                    this.pathIndex = 0;
                }
            }
        }
    }
}