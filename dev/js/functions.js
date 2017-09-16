export default {
	createFieldMatrix(width, height) {
		let matrix = [];
		for(let i = 0; i < height; i++) {
			let row = [];
			for(let i = 0; i < width; i++) {
				row.push(0);
			}
			matrix.push(row);
		}
		return matrix;
	},
	fillFieldMatrix(emptyMatrix, fillingArray) {
		let matrix = [];
		emptyMatrix.forEach((row, i) => {
			matrix[i] = row.slice();
		});
		fillingArray.forEach(item => {
			matrix[item[0]][item[1]] = 1;
		});
		return matrix;
	},
	findSimplePath(x0, y0, x1, y1, step) {
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
	},
	shuffleArray(array) {
		let newArray = [];
		for(let i = array.length; i; i--) {
			let j = Math.floor(Math.random() * i);
			[newArray[i - 1], newArray[j]] = [array[j], array[i - 1]];
		}
		return newArray;
	}
};