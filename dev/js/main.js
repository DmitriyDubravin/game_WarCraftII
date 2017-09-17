require('../css/main.scss');

import slick from 'slick-carousel';

import binder from './binder';
import global from './global';
import functions from './functions';

if(dev) {
	if(module.hot) {
		module.hot.accept();
	}
}

// treeshaking test
import {unusedFunction} from './helpers';

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