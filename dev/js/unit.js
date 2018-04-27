
import PF from 'pathfinding';
import {
    shuffleArray,
} from './functions';



export default class Unit {
    constructor(props) {


        // shouldn't it be static property
        this.ctx = props.ctx;
        this.filledFieldMatrix = props.fieldMatrix;
        this.size = props.size;
        this.directions = ['t', 'tr', 'r', 'rb', 'b', 'bl', 'l', 'lt'];

        this.x = props.x;
        this.y = props.y;
        this.speed = 4;
        this.target = {x: null, y: null};
        this.path = [];
        this.nextPath = [];
        this.pathIndex = 0;
        this.stepsInCell = Math.floor(this.size / this.speed);
        this.stepInCell = 0;
        this.currentDirection = shuffleArray(this.directions)[0];
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
    update(props) {
        this.filledFieldMatrix = props.field;
    }
    findNextDirection() {
        let xDiff = this.path[this.pathIndex + 1].x - this.path[this.pathIndex].x;
        let yDiff = this.path[this.pathIndex + 1].y - this.path[this.pathIndex].y;
        if (xDiff === 0 && yDiff < 0) return 't';
        if (xDiff > 0 && yDiff < 0) return 'tr';
        if (xDiff > 0 && yDiff === 0) return 'r';
        if (xDiff > 0 && yDiff > 0) return 'rb';
        if (xDiff === 0 && yDiff > 0) return 'b';
        if (xDiff < 0 && yDiff > 0) return 'bl';
        if (xDiff < 0 && yDiff === 0) return 'l';
        if (xDiff < 0 && yDiff < 0) return 'lt';
    }
    randomTurns() {
        this.idle++;
        if (this.idle > 400) {
            this.currentDirection = shuffleArray(this.directions)[0];
            this.idle = 0;
        }
    }
    resetTarget() {
        this.target.x = this.target.y = null;
    }
    isUnitOnTarget() {
        return this.target.x === this.x && this.target.y === this.y;
    }
    isTargetSet() {
        return this.target.x !== null && this.target.y !== null;
    }
    isHasPath() {
        return this.path.length !== 0;
    }
    setTarget(e) {
        let size = this.size;
        this.target.x = Math.floor(e.clientX / size) * size;
        this.target.y = Math.floor(e.clientY / size) * size;
    }
    drawOutline() {
        if (this.isSelected) {
            this.ctx.beginPath();
            this.ctx.rect(this.x, this.y, this.size, this.size);
            this.ctx.strokeStyle = "#fc0";
            this.ctx.stroke();
        }
    }
    drawUnit() {
        let look = this.unitLook();
        this.ctx.drawImage(this.image, look.x, look.y, this.size, this.size, this.x, this.y, this.size, this.size);
    }
    unitLook() {
        let x = 0;
        switch(this.currentDirection) {
            case "t":  x = this.size * 0; break;
            case "tr": x = this.size * 1; break;
            case "r":  x = this.size * 2; break;
            case "rb": x = this.size * 3; break;
            case "b":  x = this.size * 4; break;
            case "bl": x = this.size * 5; break;
            case "l":  x = this.size * 6; break;
            case "lt": x = this.size * 7; break;
        }
        let y = Math.floor(this.stepInCell * this.speed / this.stepsInCell) * this.size;
        return {x, y};
    }
    setPath() {
        const isMoving = this.isHasPath();
        
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
    isPathCompromised(currentPathIndex) {

        return this.path.some((cellCoords, i) => {
            if (i < currentPathIndex) {
                return false;
            } else {
                let row = cellCoords.y / this.size;
                let cell = cellCoords.x / this.size;
                return this.filledFieldMatrix[row][cell] > 0;
            }
        });

    }
    followThePath() {

        let size = this.size;

        // if finished current cell && still has path to go
        if (this.stepInCell === 0 && this.isHasPath()) {
            // find next direction
            this.currentDirection = this.findNextDirection();
        }

        // move unit position by current direction shift
        this.x += this.allDirections[this.currentDirection].x;
        this.y += this.allDirections[this.currentDirection].y;

        // increase step inside cell
        this.stepInCell++;

        // if current cell is passed
        if (this.stepInCell >= this.stepsInCell) {
            
            // reset step inside cell
            this.stepInCell = 0;

            // set occupied cell
            this.occupiedCellX = Math.floor(this.x / size) * size;
            this.occupiedCellY = Math.floor(this.y / size) * size;


            // increase path index => going to the new cell
            this.pathIndex++;

            if (this.isPathCompromised(this.pathIndex)) {
                console.log(1111);
                this.path = [];
                this.nextPath = [];
                this.pathIndex = 0;
                this.setPath();
            }

            // if next path already set, switching to new path
            if (this.nextPath.length !== 0) {
                // next path became current path
                this.path = this.nextPath;
                // clean next path
                this.nextPath = [];
                // reset path index
                this.pathIndex = 0;
            }

            // if path is ended, reset all path data
            if (this.pathIndex === this.path.length - 1) {
                this.path = [];
                this.nextPath = [];
                this.pathIndex = 0;
            }
        }
    }
    drawTarget() {
        if (this.isTargetSet()) {
            this.ctx.fillStyle = '#f0f0f0';
            this.ctx.fillRect(this.target.x, this.target.y, this.size, this.size);
        }
    }

}
