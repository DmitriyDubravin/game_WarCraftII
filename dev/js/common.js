import {say, delay} from './helpers';

export default {
    isTouch: false,
    detectTouch() {
        if('ontouchstart' in window) {
            document.body.className += ' touch';
            this.isTouch = true;
        }
    },
    init() {
        say('window was loaded');
        this.detectTouch();
        say(`is touch: ${this.isTouch}`);
    },
    resize() {
        window.onresize = () => {
            delay(500, say, 'window was resized');
        };
    }
};