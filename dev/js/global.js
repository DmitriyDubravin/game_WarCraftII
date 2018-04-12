
import Unit from './unit';
import {

    filterSelected,
    getClickedCoords,
    reSelectUnits,
    reselectUnitsWithArea,
    checkClickedMouseButton,

} from './functions';

import {

    canvas,
    ctx,
    fieldWidth,
    fieldHeight,
    cellSize,
    filledFieldMatrix,

} from './constants';


import {

    clearField,
    drawField,

} from './field';



export default {
    game() {



// game constants






// canvas settings
















class Knight extends Unit {
    constructor(props) {
        super(props);
        this.image = document.getElementById('unit');
    }
}

let knight1 = new Knight({size: cellSize, x: 0, y: 0});
let knight2 = new Knight({size: cellSize, x: 128, y: 0});
let knight3 = new Knight({size: cellSize, x: 256, y: 0});

let allUnits = [
    knight1,
    knight2,
    knight3,
];





class UnitsGroup {
    constructor(unitsArray) {
        this.units = unitsArray;
    }
}

let unitsAll = new UnitsGroup(allUnits);
console.log(unitsAll);



class Constants {
    // ?
}


class Field {
    // ?
}





let drag = false;
let rect = {};

function init() {
    canvas.addEventListener('mousedown', mouseDown, false);
    canvas.addEventListener('mouseup', mouseUp, false);
    canvas.addEventListener('mousemove', mouseMove, false);
}

function mouseDown(e) {
    let mouseButton = checkClickedMouseButton(e.button);

    if (mouseButton === 'left') {
        rect.startX = e.pageX - this.offsetLeft;
        rect.startY = e.pageY - this.offsetTop;
        drag = true;
    }
}

function mouseUp(e) {
    let mouseButton = checkClickedMouseButton(e.button);

    if (mouseButton === 'left') {
        if (
            // clean click
            rect.finishX !== undefined ||
            // click with little moving
            rect.finishX - rect.startX < 20 && rect.finishY - rect.startY < 20
        ) {
            allUnits = reselectUnitsWithArea(allUnits, cellSize, rect);
        }


        drag = false;
    }




    rect = {};
}

function mouseMove(e) {
    if (drag) {
        rect.finishX = e.pageX - this.offsetLeft;
        rect.finishY = e.pageY - this.offsetTop;
    }
}
init();





// function drawTarget() {
//     if (unit.isTargetSet()) {
//         ctx.fillStyle = '#f0f0f0';
//         ctx.fillRect(unit.target.x, unit.target.y, cellSize, cellSize);
//     }
// }







function drawUnits(ctx, units) {
    units.forEach(function(unit) {
        unit.drawOutline(ctx, cellSize);
        unit.drawUnit(ctx, cellSize);
    });
}
function unitsMoves(units) {
    units.forEach(function(unit) {
        if (unit.isTargetSet()) {
            unit.followThePath();
        } else {
            unit.randomTurns();
        }
        if (unit.isTargetAchieved()) {
            unit.resetTarget();
        }
    });
}
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





function drawSelectedAreaRect() {
    if (rect.finishX !== undefined) {
        ctx.beginPath();
        ctx.rect(rect.startX, rect.startY, rect.finishX - rect.startX, rect.finishY - rect.startY);
        ctx.strokeStyle = "#fc0";
        ctx.stroke();
    }
}



document.oncontextmenu = function() {
    return false;
};

canvas.addEventListener('mousedown', function(e) {

    let mouseButton = checkClickedMouseButton(e.button);

    if (mouseButton === 'left') {
        let clickedCoords = getClickedCoords(e, cellSize);
        allUnits = reSelectUnits(allUnits, clickedCoords);
    }

    if (mouseButton === 'right') {
        let selectedUnits = filterSelected(allUnits);

        if (selectedUnits.length !== 0) {
            allSetTarget(e, selectedUnits);
            allSetPath(selectedUnits);
        }
    }

});






function move() {
    clearField(ctx, fieldWidth, fieldHeight);
    drawField(ctx, filledFieldMatrix, cellSize);
    drawSelectedAreaRect();

    // drawTarget();
    drawUnits(ctx, allUnits);
    unitsMoves(allUnits);
    window.requestAnimationFrame(move);
}

window.requestAnimationFrame(move);




    }
};
