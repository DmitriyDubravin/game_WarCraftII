


export default class Units {
    constructor(ctx, cellSize, unitsArray) {
        this.units = unitsArray;
        this.ctx = ctx;
        this.cellSize = cellSize;
    }

    draw() {
        this.units.forEach(unit => {
            // unit.drawTarget(this.ctx);
            unit.drawOutline(this.ctx, this.cellSize);
            unit.drawUnit(this.ctx, this.cellSize);
        });
    }
    move() {
        this.units.forEach(unit => {
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
    setPathway() {
        this.units.forEach(unit => {
            if (unit.isSelected && !unit.isTargetAchieved()) {
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
}
