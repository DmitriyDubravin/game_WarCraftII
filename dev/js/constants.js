import {

    createFieldMatrix,
    fillFieldMatrix,

} from './functions';



export const cellSize = 64;
const stepsPerCell = Math.floor(cellSize / 4);
export const fieldWidth = cellSize * Math.floor(window.innerWidth / cellSize);
export const fieldHeight = cellSize * Math.floor(window.innerHeight / cellSize);

export const canvas = document.getElementById('app');
export const ctx = canvas.getContext('2d');
canvas.width = fieldWidth;
canvas.height = fieldHeight;
canvas.style.display = 'block';
canvas.style.background = '#fafafa';
// const zeroX = canvas.offsetLeft;
// const zeroY = canvas.offsetTop;
// console.log(zeroX, zeroY);
const cellsInWidth = fieldWidth / cellSize;
const cellsInHeight = fieldHeight / cellSize;
const totalCells = cellsInWidth * cellsInHeight;

const fieldMatrix = createFieldMatrix(cellsInWidth, cellsInHeight);
export const filledFieldMatrix = fillFieldMatrix(fieldMatrix,[
    [1,2],
    [2,2],
    [3,2],

    [3,4],
    [4,4],
    [5,4],

    [1,7],
    [2,7],
    [3,7]
]);

