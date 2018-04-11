
import {argumentsTypesShouldBe} from './functions';



export function drawField(ctx, matrix, cellSize) {
    argumentsTypesShouldBe(arguments, ['CanvasRenderingContext2D', 'Array', 'Number']);
    matrix.forEach(function(row, index) {
        let y = index * cellSize;
        row.forEach(function(cell, i) {
            if (cell === 1) {
                let x = i * cellSize;
                ctx.fillStyle = '#aaaaaa';
                ctx.fillRect(x, y, cellSize, cellSize);
            }
        });
    });
}

export function clearField(ctx, fieldWidth, fieldHeight) {
    argumentsTypesShouldBe(arguments, ['CanvasRenderingContext2D', 'Number', 'Number']);

    ctx.clearRect(0, 0, fieldWidth, fieldHeight);
}
