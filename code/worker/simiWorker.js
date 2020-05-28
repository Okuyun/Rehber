/**
 * @file The web worker for simi, it creates a thread to calculate the data.
 * @author Abdurrahman RAJAB 
 */

// instead of transferring the whole object just try to get the results and see how is it.

importScripts('../buckwalter.js')
importScripts('../mujam.js')
importScripts('../common.js')
let sv = new Map()
let rootsVector = new Map();
let surasVectorG;
postMessage({ 'cmd': 'log', 'msg': 'worker started' })

function wordsToVector(words){
    let array = words.split(" ")
    let temp = new Map(rootsVector);
    /** looping the words in Verse to create their count object. */
    array.forEach(e => { if (wordToRoot.get(toBuckwalter(e)) !== undefined) temp.set(wordToRoot.get(toBuckwalter(e)), temp.get(wordToRoot.get(toBuckwalter(e))) + 1) })
    return temp
}
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
                temp = wordsToVector(words);
                             /** Add the counted object to the surasVector map to use later. */
                surasVector.get(indS).set(indA, { vector: temp, aya: words, ch: indS + 1, ver: indA + 1 })
            }
        );
    })
    surasVectorG = surasVector
    IDFvector = idfVector();
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
            // checkSimilarity( data.msg.c,  data.msg.v,  data.msg.min) 
            postMessage({ 'cmd': 'result', msg: checkSimilarity(data.msg.c, data.msg.v, data.msg.min) })
            // postMessage({ 'cmd': 'log', 'msg': "" })
            break;
        // broken
        case 'getVector':
            postMessage({ 'cmd': 'vectorReturned', msg: getVerseVector(data.msg.chapter, data.msg.verse) })
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
    // let date= new Date();
    let result = innerProd(a, b) / (magnitude(a) * (magB ? magB : magnitude(b)))
    // console.log(new Date()-date)
    return result
}

function test() {
    // allMag();
}
/**
 * Get similarity of the same verses
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
    // verse vector
    let vv = getVerseVector(c, v);
    let mag = magnitude(vv)
    // console.log(mag)
    if (mag > 0) {
       return wholeQuranLoop(vv,mag,min,similarity);
    } else {
        result = similarityCheckNAN();
    }
    return result;
}
function wholeQuranLoop(vv,mag,min,similarityFunction){
    let ratio;
    min = min/100
    let result = []
    surasVector.forEach(s => s.forEach(v => {
        if ((ratio = similarityFunction(v.vector, vv, mag)) >= min) {
            // console.log(v.aya, (ratio = parseInt(ratio * 100)) > 100 ? 100 : ratio, v.ch, v.ver)
            result.push([(ratio = parseInt(ratio * 100)) > 100 ? 100 : ratio, v.ch, v.ver])
        }
    }))
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

/** The TF*IDF algorthm based on https://janav.wordpress.com/2013/10/27/tf-idf-and-cosine-similarity/ */
function termFrequency(verseVector) {
    let total = 0
    verseVector.forEach((v, k, m) => { total += v })
    verseVector.forEach((v, k, m) => {
        verseVector.set(k, v / total)
    })
    return verseVector;
}

function totalNumberOfDocs() {
    //     total =0
    //    suraAr.forEach(e=> total+=e.length)
    return 6236;
}
function numberOFdocsWithTerm(word) {
    let total = 0;
    surasVectorG.forEach(sura => {
        sura.forEach(verse => {
            if (verse.vector.get(word) > 0) total += 1;
        })
    })
    return total;
}
function inverseDF(word) {
    return 1 + Math.log(totalNumberOfDocs() / numberOFdocsWithTerm(word))
}

let IDFvector = new Map();

function idfVector() {
    let idfVector = new Map()
    rootsVector.forEach((v, k, m) => {
        idfVector.set(k, inverseDF(k))
    })
    return idfVector;
}

function tfidfVector(a) {
    let tfidf = new Map()
    a.forEach((v, k, m) => {
        tfidf.set(k, v * IDFvector.get(k))
    })
    return tfidf;
}

function tfidfResult(a, b) {
    return [tfidfVector(a), tfidfVector(b)]
}
function termFwarper(a, b) {
    return [termFrequency(a), termFrequency(b)]
}
function getInterSection(a,b){
    let intersection = new Map();
    a.forEach((v,k,m)=>{
        if(b.get(k)>0){
            intersection.set(k,1);
        }
    })
    return intersection;
}
function updateVectors(a,b,inter){
    let an = new Map()
    let bn = new Map();
    inter.forEach((v,k,m)=>{
        an.set(k,a.get(k))
        bn.set(k,b.get(k))
    })
    return [an,bn]
}
function checkSmaller(a,b){
    let totalA = 0
    a.forEach((v, k, m) => { if(v>0) totalA += 1  })
    let totalb = 0
    b.forEach((v, k, m) => { if(v>0) totalb += 1  })
    if(totalA > totalb ) return [b,a]
    else return [a,b]
}

/** why it does not work without the intersection...? it could work but the magnitudde need to be calcuated based on the inner production other wise its a logical error */
function cosineTFIDF(a, b) {
    // could save the mutakerrer in table to make it faster, or maybe use a similar model to finder and just show 10 results instead of the whole collections :) TODO
    /**term frequency */
    // let date= new Date();
    [a,b] =checkSmaller(a,b)
    let [at, bt] = termFwarper(a, b);
    let [atidf, btidf] = tfidfResult(at, bt);
    let inters = getInterSection(a,b)
    let [a1,b1]= updateVectors(atidf,btidf,inters)
    
    let result= innerProd(a1,b1)/ (magnitude(a1) * magnitude(b1));
    // console.log(new Date()-date)
    return result
}
/**
 * get interseection based on the smalleset would it matter?
 */