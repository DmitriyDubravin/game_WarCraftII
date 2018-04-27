
/**
 * NOTES
 * redraw sprite to unit size 60x60
 */










import Field from './field';
import Units from './units';
import Unit from './unit';

import {

    getClickedCoords,
    checkClickedMouseButton,

} from './functions';




export default {
    game() {


        const field = new Field();

        class Knight extends Unit {
            constructor(props) {
                super(props);
                this.image = document.getElementById('unit');
            }
        }

        const knight1 = new Knight({ctx: field.ctx, size: field.cellSize, fieldMatrix: field.filledFieldMatrix, x: 0, y: 0});
        const knight2 = new Knight({ctx: field.ctx, size: field.cellSize, fieldMatrix: field.filledFieldMatrix, x: 128, y: 0});
        const knight3 = new Knight({ctx: field.ctx, size: field.cellSize, fieldMatrix: field.filledFieldMatrix, x: 256, y: 0});

        const unitsArr = [
            knight1,
            knight2,
            knight3,
        ];

        const units = new Units(field.ctx, field.cellSize, unitsArr);







let isDragging = false;
let drawingRect = {};

function init() {
    field.canvas.addEventListener('mousedown', mouseDown, false);
    field.canvas.addEventListener('mouseup', mouseUp, false);
    field.canvas.addEventListener('mousemove', mouseMove, false);
}

function mouseDown(e) {
    let mouseButton = checkClickedMouseButton(e.button);

    if (mouseButton === 'left') {
        drawingRect.startX = e.pageX - this.offsetLeft;
        drawingRect.startY = e.pageY - this.offsetTop;
        isDragging = true;
    }
}

function mouseUp(e) {
    let mouseButton = checkClickedMouseButton(e.button);

    if (mouseButton === 'left') {
        const {startX, startY, finishX, finishY} = drawingRect;
        const shiftX = Math.abs(finishX - startX);
        const shiftY = Math.abs(finishY - startY);

        if (
            // clean click
            finishX !== undefined ||
            // click with little moving
            shiftX < 20 && shiftY < 20
        ) {
            units.reSelectWithArea(drawingRect);
        }
        isDragging = false;
    }

    drawingRect = {};
}

function mouseMove(e) {
    if (isDragging) {
        drawingRect.finishX = e.pageX - this.offsetLeft;
        drawingRect.finishY = e.pageY - this.offsetTop;
    }
}
init();



function drawSelectedAreaRect() {
    if (drawingRect.finishX !== undefined) {
        const {startX, startY, finishX, finishY} = drawingRect;
        const width = finishX - startX;
        const height = finishY - startY;
        field.ctx.beginPath();
        field.ctx.rect(startX, startY, width, height);
        field.ctx.strokeStyle = "#fc0";
        field.ctx.stroke();
    }
}



document.oncontextmenu = function() {
    return false;
};

field.canvas.addEventListener('mousedown', function(e) {

    let mouseButton = checkClickedMouseButton(e.button);

    if (mouseButton === 'left') {
        let clickedCoords = getClickedCoords(e, field.cellSize);
        units.reSelect(clickedCoords);
    }

    if (mouseButton === 'right') {
        units.setTarget(e);
        units.setPathway();
    }

});



        function move() {
            field.clear();
            field.fill(units.occupiedCells());
            field.draw();
            drawSelectedAreaRect();

            units.updateEnvironment(field.filledFieldMatrix);
            units.draw();
            units.move();
            window.requestAnimationFrame(move);
        }

        window.requestAnimationFrame(move);





    }
};
