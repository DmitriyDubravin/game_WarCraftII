const ARGS = ['a', 1, true, ['Array'], {}, null, undefined];

function getType(val) {
    return val === null ? 'Null' :
        val === undefined ? 'Undefined' :
        Object.prototype.toString.call(val).slice(8, -1);
}

function expectWrapper(fn, args) {
    expect(() => {
        fn(...args)
    }).toThrow(/should be/);
}


export function testArgs(fn, expectedArgsTypes, msg) {
    checkArgs(fn, expectedArgsTypes, msg, true);
}

export function checkArgs(fn, expectedArgsTypes, msg = '',  withTest = false) {

    const depth = expectedArgsTypes.length;

    ARGS.filter(arg => getType(arg) !== expectedArgsTypes[0]).forEach(a => {
        if (depth === 1) {
            if (withTest) {
                test(`${msg}: ${a}`, () => {
                    expectWrapper(fn, [a]);
                });
            } else {
                expectWrapper(fn, [a]);
            }
        } else {
            ARGS.filter(arg => getType(arg) !== expectedArgsTypes[1]).forEach(b => {
                if (depth === 2) {
                    if (withTest) {
                        test(`${msg}: ${a}, ${b}`, () => {
                            expectWrapper(fn, [a, b]);
                        });
                    } else {
                        expectWrapper(fn, [a, b]);
                    }
                } else {
                    ARGS.filter(arg => getType(arg) !== expectedArgsTypes[2]).forEach(c => {
                        if (withTest) {
                            test(`${msg}: ${a}, ${b}, ${c}`, () => {
                                expectWrapper(fn, [a, b, c]);
                            });
                        } else {
                            expectWrapper(fn, [a, b, c]);
                        }
                    });
                }
            });
        }
    });
}
