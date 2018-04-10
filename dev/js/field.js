
// function type(val) {
//     return val === null ? 'Null' :
//         val === undefined ? 'Undefined' :
//         Object.prototype.toString.call(val).slice(8, -1);
// }

// function valueTypeShouldBe(value, expectedValueType) {
//     let valueType = value === null ? 'Null' :
//         value === undefined ? 'Undefined' :
//         Object.prototype.toString.call(value).slice(8, -1);
//     if (valueType !== expectedValueType) {
//         throw new Error(`value should be ${expectedValueType}! \n Got:\n type: ${valueType}\n value: ${value}`);
//     }
// }

function argumentsTypesShouldBe(args, types) {
    for (let i = 0; i < types.length; i++) {
        let value = args[i];
        let expectedValueType = types[i];
        let valueType = value === null ? 'Null' :
            value === undefined ? 'Undefined' :
            Object.prototype.toString.call(value).slice(8, -1);
        if (valueType !== expectedValueType) {
            throw new Error(`${i} parameter should be ${expectedValueType} ! \n Got:\n type: ${valueType}\n value: ${value}`);
        }
    }
}


export function clearField(field, fieldWidth, fieldHeight) {
    argumentsTypesShouldBe(arguments, ['CanvasRenderingContext2D', 'Number', 'Number']);

    field.clearRect(0, 0, fieldWidth, fieldHeight);
}

export function sum(a, b) {
    return a + b;
}