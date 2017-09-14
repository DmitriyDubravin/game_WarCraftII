import {say, delay} from './helpers';

export default {
	navFunction() {
		console.log('navFunction executed');
	},
	galleryFunction() {
		console.log('galleryFenction executed');
		$('.gallery').slick({
			infinite: true,
			slidesToShow: 3,
			slidesToScroll: 3
		});
	}
};