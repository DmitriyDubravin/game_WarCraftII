
import PF from 'pathfinding';
import {
    shuffleArray,
} from './functions';



export default class Unit {
    constructor(props) {
        this.filledFieldMatrix = props.fieldMatrix;
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

        const isMoving = this.path.length !== 0;
        
        // start path where unit stands
        let unitStartX = this.x;
        let unitStartY = this.y;
        if (isMoving) {
            // if unit is moving, the nextPath start will be the next current path step
            unitStartX = this.path[this.pathIndex + 1].x;
            unitStartY = this.path[this.pathIndex + 1].y;
        }

        // gather data for the path
        const grid = new PF.Grid(this.filledFieldMatrix);
        const finder = new PF.AStarFinder({allowDiagonal: true});
        const pathStartX = unitStartX / this.size;
        const pathStartY = unitStartY / this.size;
        const pathFinishX = this.target.x / this.size;
        const pathFinishY = this.target.y / this.size;
        const gridPath = finder.findPath(pathStartX, pathStartY, pathFinishX, pathFinishY, grid);

        const path = gridPath.map(item => {
            const nx = item[0] * this.size;
            const ny = item[1] * this.size;
            return {x: nx, y: ny};
        });
        if (!isMoving) {
            this.path = path;
        } else {
            this.nextPath = path;
        }

    }
    followThePath() {
        let size = this.size;
        // if path is set
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
    drawTarget(ctx) {
        if (this.isTargetSet()) {
            ctx.fillStyle = '#f0f0f0';
            ctx.fillRect(this.target.x, this.target.y, this.size, this.size);
        }
    }

}
