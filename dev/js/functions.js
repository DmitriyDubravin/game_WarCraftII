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
	}
};