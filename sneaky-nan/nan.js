

const viewBit = () => {
    const buf = new ArrayBuffer(8);
    const view = new DataView(buf);

    view.setFloat64(0, NaN);

    let binStr = '';
    for (let i = 0; i < 8; i++) {
        binStr += ('00000000' + view.getUint8(i).toString(2)).slice(-8) + ' ';
    }

    console.log(binStr);

}

const conceal = (val) => {

    console.log('concealing', val, ' in nan');

    // viewBit()

    console.log(  0b111_1111_1000_1000_1000_1000_1000_1000.toString(2))

    return val;
}

const reveal = (val) => {


    console.log('isNan', val, isNaN(val));
    return val;
}

const nan_val = conceal("hello world");
const revealed_val = reveal(nan_val);
