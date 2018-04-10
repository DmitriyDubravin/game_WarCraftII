
import binder from './binder';
import global from './global';

if(dev) {
	if(module.hot) {
		module.hot.accept();
	}
}


let args = [
	// elements to find & functions to execute if element was found
	{
		'body': ['game'],
	},
	// modules to plug in
	[
		global
	],
	// run binder tests
	// true
];

binder(...args);