
import {
    createFieldMatrix,
    fillFieldMatrix,
    argumentsTypesShouldBe
} from './functions';



export default class Field {
    constructor() {

        this.canvas = document.getElementById('app');
        this.ctx = this.canvas.getContext('2d');
        this.cellSize = 64;
        this.fieldWidth = this.cellSize * Math.floor(window.innerWidth / this.cellSize);
        this.fieldHeight = this.cellSize * Math.floor(window.innerHeight / this.cellSize);
        this.canvas.width = this.fieldWidth;
        this.canvas.height = this.fieldHeight;
        this.canvas.style.display = 'block';
        this.canvas.style.background = '#fafafa';
        this.cellsInWidth = this.fieldWidth / this.cellSize;
        this.cellsInHeight = this.fieldHeight / this.cellSize;
        this.fieldMatrix = createFieldMatrix(this.cellsInWidth, this.cellsInHeight);
        this.filledFieldMatrix = fillFieldMatrix(this.fieldMatrix,[[1,2],[2,2],[3,2],[3,4],[4,4],[5,4],[1,7],[2,7],[3,7]]);

    }
    draw() {
        // argumentsTypesShouldBe(arguments, ['CanvasRenderingContext2D', 'Array', 'Number']);
        this.filledFieldMatrix.forEach((row, index) => {
            let y = index * this.cellSize;
            row.forEach((cell, i) => {
                if (cell === 1) {
                    let x = i * this.cellSize;
                    this.ctx.fillStyle = '#aaaaaa';
                    this.ctx.fillRect(x, y, this.cellSize, this.cellSize);
                }
            });
        });
    }
    
    clear() {
        let fieldWidth = this.fieldWidth;
        let fieldHeight = this.fieldHeight;
        // argumentsTypesShouldBe(arguments, ['CanvasRenderingContext2D', 'Number', 'Number']);
    
        this.ctx.clearRect(0, 0, fieldWidth, fieldHeight);
    }
}
