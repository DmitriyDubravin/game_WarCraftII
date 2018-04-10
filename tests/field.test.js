import { sum, clearField } from './../dev/js/field';

import { checkArgs, testArgs } from './tests.presets';



test('adds 1 + 2 to equal 3', () => {
    expect(sum(1, 2)).toBe(3);
});
describe('clearField', () => {
    testArgs(
        clearField,
        ['CanvasRenderingContext2D', 'Number', 'Number'],
        'checked with args'
    );
    // test('clearField: wrong args types', () => {
    //     checkArgs(
    //         clearField,
    //         ['CanvasRenderingContext2D', 'Number', 'Number']
    //     );
    // });
});
