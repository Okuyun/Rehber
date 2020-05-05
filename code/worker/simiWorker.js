/**
 * @file The web worker for simi, it creates a thread to calculate the data.
 * @author Abdurrahman RAJAB 
 */

// instead of transferring the whole object just try to get the results and see how is it.

importScripts('/code/buckwalter.js')
importScripts('/code/mujam.js')
importScripts('/code/common.js')
let sv = new Map()
// toBuckwalter = BWC.toBuckwalter
/**
 * create the suras vectors, by: 
 * 1- looping each Chapter <br>
 * 2- looping each verses in each chapter  <br>
 * 3- looping the words in Verse to create their count object.  <br>
 * 4- Add the counted object to the surasVector map to use later. <br>
 * Return a promise to follow up the end of the function. <br>
 */
function tableGenerator(suraAr,surasVector,rootsVector) {
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
async function loadAll(){
    let p1 = initMujam()
    let p2 =  tableGenerator(suraAr,sv,rootsVector);

}
onmessage = (e) => {
    let data =e.data
    suraAr=data.sura
    // surasVector= data.suraV
    rootsVector= data.rootV
    wordToRoot= data.wordsRoots
    // postMessage(toBuckwalter.toString())
    tableGenerator(suraAr,sv,rootsVector).then(e=> {
        postMessage({'cmd': 'log', 'msg': "done" })
        postMessage({'cmd': 'assign', 'msg': sv})

    })
    postMessage({'cmd': 'log', 'msg': 'worker started'})
   
    postMessage({'cmd': 'log', 'msg': 'after'})

}
