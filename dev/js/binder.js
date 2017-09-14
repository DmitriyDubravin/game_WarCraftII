export default function binder(selectorsAndFunctionsBounds, modulesToPlugIn, runTests = false) {
	const selectorsToFind = Object.keys(selectorsAndFunctionsBounds);
	const foundElementsList = [...document.querySelectorAll(selectorsToFind.join(','))];
	const mergedModules = Object.assign(...modulesToPlugIn);
	selectorsToFind.forEach((selector, index, array) => {
		const selectorType = selector.slice(0,1).toLowerCase();
		if(foundElementsList.some(element => {
			switch(selectorType) {
				case '.': return (` ${element.className} `).indexOf(` ${selector.slice(1)} `) > -1;
				case '#': return element.id.indexOf(selector.slice(1)) > -1;
				case '[': return element.hasAttribute(selector.slice(1,-1));
				default:  return (element.tagName.toLowerCase()).indexOf(selector) > -1;
			}})
		) {
			if(runTests) console.log(`+ ${selector} --> ${selectorsAndFunctionsBounds[selector].join(', ')}`);
			selectorsAndFunctionsBounds[selector].forEach((script, i, arr) => {
				if(mergedModules.hasOwnProperty([script])) {
					mergedModules[script]();
				} else {
					console.log(`! ${script}: script name wasn't found`);
				}
			});
		} else {
			if(runTests) console.log(`- ${selector}`);
		}
	});
}