// math stuff: https://youtu.be/5XVFQix8tAk?t=455
const rootsVector = new Map();
const surasVector = new Map();

function initRootVector() {
    [...rootsMap.keys()].forEach((key) => {
        if (rootsVector.get(key)) console.log("key")
        rootsVector.set(key, 0);
    });
}

function tableGenerator() {
    suraAr.forEach((ayas, indS) => {
        surasVector.set(indS, new Map())
        ayas.forEach(
            (words, indA) => {
                let array = words.split(" ")
                let temp = new Map(rootsVector);
                array.forEach(e => { if (wordToRoot.get(toBuckwalter(e)) !== undefined) temp.set(wordToRoot.get(toBuckwalter(e)), temp.get(wordToRoot.get(toBuckwalter(e))) + 1) })
                surasVector.get(indS).set(indA, { vector: temp, aya: words })
            }
        );
    })
}
async function initTable() {
    await init()
    await initMujam();
    initRootVector();
    timer("All vectors created in ", tableGenerator)

}

function innerProd(a, b) {
    let av = [...a.values()]
    let bv = [...b.values()]
    let reducer = (a, curr, ind) => curr ? a += curr * bv[ind] : a += 0;
    return av.reduce(reducer, 0);
}

function magnitude(a) {
    return round_to_precision(Math.sqrt(([...a.values()].reduce((c, b) => b ? c += b * b : c, 0))), 0.2).toFixed(2)
}

function round_to_precision(x, precision) {
    var y = +x + (precision === undefined ? 0.5 : precision / 2);
    return y - (y % (precision === undefined ? 1 : +precision));
}

function allMag() {
    let temp;
    surasVector.forEach((sura) => {
        sura.forEach(
            (aya) => {
                if ((temp = magnitude(aya.vector)) != 1) {
                    console.log("found", temp, aya.aya)
                }
            }
        )
    })
}
// two map as vectors.
function similarity(a, b) {
    return innerProd(a, b) / (magnitude(a) * magnitude(b))
}

function test() {
    // allMag();
}

function similiartySimilarVerses() {
    // let a = surasVector.get(2).get(2)
    // console.log(a.aya)
    // a=a.vector;
    // console.log(similarity(a,a))
    surasVector.forEach((sura) => sura.forEach((aya) => console.log(similarity(aya.vector, aya.vector), aya.aya)))
}

function similairtyCheckNAN() {
    let f = (aya) => (isNaN(similarity(aya.vector, aya.vector))) ? console.log(aya.aya) : null;
    surasVector.forEach((sura) => sura.forEach((aya) => f(aya)))

}

function similiartyError() {
    // let a = surasVector.get(2).get(2)
    // console.log(a.aya)
    // a=a.vector;
    // console.log(similarity(a,a))
    surasVector.forEach((sura) => sura.forEach((aya) => Math.round(!similarity(aya.vector, aya.vector)) >= 1 ? console.log(aya.aya) : aya))
}