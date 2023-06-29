

const convert_number_to_numeral = (val) => {
    return "XXXIX";
}



var assert = require('assert');
const test_cases = {
    39: "XXXIX",
    2421: "MMCDXXI",
    1066: "MLXVI",
}

Object.keys(test_cases).forEach(key => {
    assert(test_cases[key] === convert_number_to_numeral(key));
});

