const parts = {
    1000: "M",
    900: "CM",
    500: "D",
    400: "CD",
    100: "C",
    90: "XC",
    50: "L",
    40: "XL",
    10: "X",
    9: "IX",
    5: "V",
    4: "IV",
    1: "I",
}

const convert_number_to_numeral = (val) => {
    if (val <= 0) {
        return ""
    }

    for (const key of Object.keys(parts).sort((a, b) => b - a)) {
        if (Number(key) <= val) {
            return parts[key] + convert_number_to_numeral(val - Number(key));
        }
    }
}



var assert = require('assert');
const test_cases = {
    39: "XXXIX",
    2421: "MMCDXXI",
    1066: "MLXVI",
}

Object.keys(test_cases).forEach(key => {
    console.log('result', key, convert_number_to_numeral(Number(key)));
    assert(test_cases[key] === convert_number_to_numeral(key));
});

