export default {
	createFieldMatrix(width, height) {
		let fieldCoverage = [];
		for(let i = 0; i < height; i++) {
			let row = [];
			for(let i = 0; i < width; i++) {
				row.push(0);
			}
			fieldCoverage.push(row);
		}
		return fieldCoverage;
	},
	fillFieldMatrix(matrix, arr) {
		arr.forEach(function(item) {
			let row = item[0];
			let cell = item[1];
			matrix[row][cell] = 1;
		});
		return matrix;
	}
}