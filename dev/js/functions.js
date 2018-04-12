
export function createFieldMatrix(width, height) {
    let matrix = [];
    for(let i = 0; i < height; i++) {
        let row = [];
        for(let i = 0; i < width; i++) {
            row.push(0);
        }
        matrix.push(row);
    }
    return matrix;
}

export function fillFieldMatrix(emptyMatrix, fillingArray) {
    return emptyMatrix.map((row, rowI) => {
        return row.map((cell, cellI) => {
            return fillingArray.some(cords => rowI === cords[1] && cellI === cords[0]) ? 1 : 0;
        });
    });
}

export function findSimplePath(x0, y0, x1, y1, step) {
    let lineArr = [];
    let dx = Math.abs(x1-x0);
    let dy = Math.abs(y1-y0);
    let sx = (x0 < x1) ? step : -step;
    let sy = (y0 < y1) ? step : -step;
    let err = dx-dy;

    while(true) {
        lineArr.push({x: x0, y: y0});
        if ((x0==x1) && (y0==y1)) break;
        let e2 = 2*err;
        if (e2 >-dy){ err -= dy; x0  += sx; }
        if (e2 < dx){ err += dx; y0  += sy; }
    }
    return lineArr;
}

export function shuffleArray(array) {
    for(let i = array.length; i; i--) {
        let j = Math.floor(Math.random() * i);
        [array[i - 1], array[j]] = [array[j], array[i - 1]];
    }
    return array.slice();
}

export function argumentsTypesShouldBe(args, types) {
    for (let i = 0; i < types.length; i++) {
        let value = args[i];
        let expectedValueType = types[i];
        let valueType = value === null ? 'Null' :
            value === undefined ? 'Undefined' :
            Object.prototype.toString.call(value).slice(8, -1);
        if (valueType !== expectedValueType) {
            throw new Error(`${i} parameter should be ${expectedValueType} ! \n Got:\n type: ${valueType}\n value: ${value}`);
        }
    }
}

export function type(val) {
    return val === null ? 'Null' :
        val === undefined ? 'Undefined' :
        Object.prototype.toString.call(val).slice(8, -1);
}

export function valueTypeShouldBe(value, expectedValueType) {
    let valueType = value === null ? 'Null' :
        value === undefined ? 'Undefined' :
        Object.prototype.toString.call(value).slice(8, -1);
    if (valueType !== expectedValueType) {
        throw new Error(`value should be ${expectedValueType}! \n Got:\n type: ${valueType}\n value: ${value}`);
    }
}

export function filterSelected(units) {
    return units.filter(unit => unit.isSelected);
}

export function getClickedCoords(e, areaSize) {
    let x = Math.floor(e.clientX / areaSize) * areaSize;
    let y = Math.floor(e.clientY / areaSize) * areaSize;
    return {x, y};
}

export function reSelectUnits(units, clickedCoords) {
    return units.map(unit => {
        let isClickedOnUnit = unit.occupiedCellX === clickedCoords.x && unit.occupiedCellY === clickedCoords.y;
        return Object.assign(unit, {isSelected: isClickedOnUnit});
    });
}

export function reselectUnitsWithArea(units, unitSize, areaCoords) {
    return units.map(unit => {
        let unitCenterX = unit.occupiedCellX + unitSize / 2;
        let unitCenterY = unit.occupiedCellY + unitSize / 2;
        let isUnitInsideArea = (
            unitCenterX >= areaCoords.startX &&
            unitCenterX <= areaCoords.finishX &&
            unitCenterY >= areaCoords.startY &&
            unitCenterY <= areaCoords.finishY
        );
        return Object.assign(unit, {isSelected: isUnitInsideArea});
    });
}


export function checkClickedMouseButton(buttonIndex) {
    switch (buttonIndex) {
        case 0: return 'left';
        case 1: return 'wheel';
        case 2: return 'right';
    }
}