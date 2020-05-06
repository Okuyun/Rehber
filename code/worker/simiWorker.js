/**
 * @file The web worker for simi, it creates a thread to calculate the data.
 * @author Abdurrahman RAJAB 
 */

// instead of transferring the whole object just try to get the results and see how is it.

importScripts('/code/buckwalter.js')
importScripts('/code/mujam.js')
importScripts('/code/common.js')
let sv = new Map()
let surasVector;
postMessage({ 'cmd': 'log', 'msg': 'worker started' })
// toBuckwalter = BWC.toBuckwalter
/**
 * create the suras vectors, by: 
 * 1- looping each Chapter <br>
 * 2- looping each verses in each chapter  <br>
 * 3- looping the words in Verse to create their count object.  <br>
 * 4- Add the counted object to the surasVector map to use later. <br>
 * Return a promise to follow up the end of the function. <br>
 */
function tableGenerator(suraAr, surasVector, rootsVector) {
    /** Loop each chapter */
    suraAr.forEach((ayas, indS) => {
        surasVector.set(indS, new Map())
        /**loop each vers in the chapter */
        ayas.forEach(
            (words, indA) => {
                let array = words.split(" ")
                let temp = new Map(rootsVector);
                /** looping the words in Verse to create their count object. */
                array.forEach(e => { if (wordToRoot.get(toBuckwalter(e)) !== undefined) temp.set(wordToRoot.get(toBuckwalter(e)), temp.get(wordToRoot.get(toBuckwalter(e))) + 1) })
                /** Add the counted object to the surasVector map to use later. */
                surasVector.get(indS).set(indA, { vector: temp, aya: words, ch: indS + 1, ver: indA + 1 })
            }
        );
    })
    /**Return surasVector to send */
    // sv = surasVector;
    // surasVector.get(0).get(0).vector.forEach(e=>{console.log(e)})
    return new Promise((resolve, reject) => { resolve("Horay") })

}
async function loadAll() {
    let p1 = initMujam()
    let p2 = tableGenerator(suraAr, sv, rootsVector);

}
onmessage = (e) => {
    let data = e.data
    postMessage({ 'cmd': 'log', 'msg': 'after' })
    switch (data.cmd) {
        case 'init':
            suraAr = data.data.sura
            // surasVector= data.suraV
            rootsVector = data.data.rootV
            wordToRoot = data.data.wordsRoots
            // postMessage(toBuckwalter.toString())
            tableGenerator(suraAr, sv, rootsVector).then(e => {
                postMessage({ 'cmd': 'done', 'msg': "horaay" })
                surasVector = sv;
                // postMessage({ 'cmd': 'assign', 'msg': sv })
            })
            break;
        case 'assign':
            console.log('Data assigned: ' + data.msg);
            surasVector = data.msg;
            worker.terminate(); // Terminates the worker.
            break;
            case 'compare':
                console.log('Data assigned: ' + data.msg);
                checkSimilarity( data.msg.c,  data.msg.v,  data.msg.min) 
                postMessage({ 'cmd': 'resultbroken', msg:  checkSimilarity(data.msg.c, data.msg.v, data.msg.min) })
                break;
        default:
            self.postMessage('Unknown command: ' + data.msg);
    };

}
// *************************** 
//  The new part.

/**
 * inner production of two vectors and return one result.
 * @param {*} a first vector
 * @param {*} b Second vector
 */
function innerProd(a, b) {
    let av = [...a.values()]
    let bv = [...b.values()]
    let reducer = (a, curr, ind) => curr ? a += curr * bv[ind] : a += 0;
    // check reduce function in MDN docs
    return av.reduce(reducer, 0);
}
/**
 * get a vector magnitude
 * @param {*} a vector
 */
function magnitude(a) {
    return round_to_precision(Math.sqrt(([...a.values()].reduce((c, b) => b ? c += b * b : c, 0))), 0.2).toFixed(2)
}
/**
 * number to round
 * @param {*} x number
 * @param {*} precision to round
 */
function round_to_precision(x, precision) {
    let y = +x + (precision === undefined ? 0.5 : precision / 2);
    return y - (y % (precision === undefined ? 1 : +precision));
}

/** Check magnitudes of all vectors, used as testing method */
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

/**
 * Applying the cosine similarity function.
 * @param {*} a first vector
 * @param {*} b second vector 
 * @param {*} magB magnitude B if we need to set it manually
 */
function similarity(a, b, magB) {
    return innerProd(a, b) / (magnitude(a) * (magB ? magB : magnitude(b)))
}

function test() {
    // allMag();
}
/**
 * Get similairty of the same verses
 */
function similiartySimilarVerses() {
    // let a = surasVector.get(2).get(2)
    // console.log(a.aya)
    // a=a.vector;
    // console.log(similarity(a,a))
    surasVector.forEach((sura) => sura.forEach((aya) => console.log(similarity(aya.vector, aya.vector), aya.aya)))
}
/** used for testing to check if there is any NaN error in the verses */
function similarityCheckNAN() {
    result = []
    let f = (aya, c, v) => (isNaN(similarity(aya.vector, aya.vector))) ? result.push([100, c + 1, v + 1]) : null;
    surasVector.forEach((sura, c) => sura.forEach((aya, v) => f(aya, c, v)))
    return result;

}
/** testing manually */
function similiartyError() {
    // let a = surasVector.get(2).get(2)
    // console.log(a.aya)
    // a=a.vector;
    // console.log(similarity(a,a))
    surasVector.forEach((sura) => sura.forEach((aya) => Math.round(!similarity(aya.vector, aya.vector)) >= 1 ? console.log(aya.aya) : aya))
}
/**
 * check similarity based on chapter and verse numbers
 * @param {Number} c chapter
 * @param {Number} v Verse
 * @param {Number} min minimum similarity rate
 */
function checkSimilarity(c, v, min = 70) {
    result = [];
    min = min / 100
    // verse vector
    let ratio;
    let vv = getVerseVector(c, v);
    let mag = magnitude(vv)
    // console.log(mag)
    if (mag > 0) {
        surasVector.forEach(s => s.forEach(v => {
            if ((ratio = similarity(v.vector, vv, mag)) >= min) {
                // console.log(v.aya, (ratio = parseInt(ratio * 100)) > 100 ? 100 : ratio, v.ch, v.ver)
                result.push([(ratio = parseInt(ratio * 100)) > 100 ? 100 : ratio, v.ch, v.ver])
            }
        }))
    } else {
        result = similarityCheckNAN();
    }
    return result;
}
/**
 * Returning the verse vector from an object, by providing the known numbers.
 * @param {Number} c chapter number 
 * @param {Number} v verse number
 */
function getVerseVector(c, v) {
    return surasVector.get(c - 1).get(v - 1).vector;
}