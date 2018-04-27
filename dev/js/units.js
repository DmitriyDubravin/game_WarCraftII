


export default class Units {
    constructor(ctx, cellSize, unitsArray) {
        this.units = unitsArray;
        this.ctx = ctx;
        this.cellSize = cellSize;
    }

    updateEnvironment(newFilledField) {
        this.units.forEach(unit => {
            unit.update({field: newFilledField});
        });
    }
    draw() {
        this.units.forEach(unit => {
            // unit.drawTarget(this.ctx);
            unit.drawOutline(this.ctx);
            unit.drawUnit(this.ctx);
        });
    }
    move() {
        this.units.forEach(unit => {
            if (unit.isTargetSet() && unit.isHasPath()) {
                unit.followThePath();
            } else {
                unit.randomTurns();
            }
            if (unit.isUnitOnTarget()) {
                unit.resetTarget();
            }
        });
    }
    setPathway() {
        this.units.forEach(unit => {
            if (unit.isSelected && !unit.isUnitOnTarget()) {
                unit.setPath();
            }
        });
    }
    setTarget(e) {
        this.units.forEach(unit => {
            if (unit.isSelected) {
                unit.setTarget(e);
            }
        });
    }
    reSelect(clickedCoords) {
        this.units.map(unit => {
            let isClickedOnUnit = unit.occupiedCellX === clickedCoords.x && unit.occupiedCellY === clickedCoords.y;
            return Object.assign(unit, {isSelected: isClickedOnUnit});
        });
    }
    reSelectWithArea(drawedCoords) {
        this.units.map(unit => {
            let unitCenterX = unit.occupiedCellX + unit.size / 2;
            let unitCenterY = unit.occupiedCellY + unit.size / 2;
            let isUnitInsideArea = (
                unitCenterX >= drawedCoords.startX &&
                unitCenterX <= drawedCoords.finishX &&
                unitCenterY >= drawedCoords.startY &&
                unitCenterY <= drawedCoords.finishY
            );
            return Object.assign(unit, {isSelected: isUnitInsideArea});
        });
    }
    occupiedCells() {
        return this.units.map(unit => [unit.occupiedCellX / this.cellSize, unit.occupiedCellY / this.cellSize]);
    }
}
