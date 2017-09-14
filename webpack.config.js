var config = {module: {rules: []}};
const options = ['entry', 'context', 'plugins', 'devServer', 'output', 'devtool'];
const moduleRules = ['images', 'scss', 'js'];
options.forEach(option => {
	let importedModules = require(`./webpack/${option}`);
	if(importedModules) config[option] = importedModules;
});
moduleRules.forEach(rule => {
	let importedModules = require(`./webpack/${rule}`);
	if(importedModules) config.module.rules = [...config.module.rules, ...importedModules];
});
module.exports = config;