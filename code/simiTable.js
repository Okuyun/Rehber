/**
 * @file Manage the similarity page of the project. 
 * The methods are based on cosine similarity and will be updated by the time. 
 * You can get the mathematical explination from this link 
 * <a href="https://youtu.be/5XVFQix8tAk?t=455">the mathematical explination from this link </a>
 * @author Abdurrahman RAJAB 
 */

/**
 * Roots vector to hold the words roots.
 */
const rootsVector = new Map();
/** 
 * Holds all suras vectors as map, which holds the vector, aya, chapter and verse numbers.
 */
let surasVector = new Map();
/** 
 * The results to print on the screen.
 */
let result;
/**
 * initialize the root vector of arabic words in Quran.
 */
function initRootVector() {
    [...rootsMap.keys()].forEach((key) => {
        if (rootsVector.get(key)) console.log("key")
        rootsVector.set(key, 0);
    });
    return new Promise((resolve, reject) => { resolve("Horay") })
}

function readHash() {}

function parseHash() {}
/**The initilize function to the page, which is 
 * 1- init() -- from script, to init the suras and needed translations  <br>
 * 2- initMujam() -- @todo why do i have this here?  <br>
 * 3- initRootVector() -- to be able to compare the  <br>
 * 4- tableGenerator() -- to get the whole quran Vectors  <br>
 * 5- initEvents() --  start the events needed in the page <br>
 * 6- suraLists() -- Get whole suras list to add in the option box <br>
 * 7- getHash() or AyaList() --either read hash or show aya list, based on the link/hash that we got
 */
async function initTable() {
       
    await init()
    await initMujam();
    await initRootVector();
    callWorker()
    // await timer("All vectors created in ", tableGenerator)
        // await timer("All vectors created in ", readVectorFile)
    initEvents()
    suraList()
    if (location.hash) {
        getHash();
    } else {
        ayaList();
    }
}
function callWorker(){
    let worker = new Worker('code/worker/simiWorker.js')
    worker.postMessage({sura:suraAr,suraV:surasVector,rootV:rootsVector, wordsRoots:wordToRoot})
    worker.addEventListener('message', function(e) {
        var data = e.data;
        switch (data.cmd) {
          case 'log':
            console.log('WORKER message: ' + data.msg);
            break;
          case 'assign':
            console.log('Data assigned: ' + data.msg);
            surasVector = data.msg;
            worker.terminate(); // Terminates the worker.
            break;
          default:
            self.postMessage('Unknown command: ' + data.msg);
        };
      });
    worker.onerror = console.error
}
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
/**
 *  
 * Starting the DOM functions
 *   
 * */


/**
 * Marking the verse based on the ratios.
 * @param {Number} ratio  The result ratio.
 * @param {String} verse The verse words.
 * @param {*} vector The verse vector.
 */
function mark(ratio, verse, vector) {
    verse = verse.split(" ")
    if (ratio >= 60) {
        // changeGreatColour("yellow")
        verse = greatArray(vector, verse, 0)
    } else if (ratio < 60 && ratio >= 40) {
        // changeGreatColour("")
        verse = greatArray(vector, verse, 2)
    } else {
        // changeGreatColour("red")
        verse = greatArray(vector, verse, 1)
    }
    return verse.join(" ");
}
/**
 * Create the graet span to colour.
 * @param {*} vector 
 * @param {*} wordArray 
 * @param {*} mode 
 */
function greatArray(vector, wordArray, mode) {
    if (mode == 1) { // more than 60 
        wordArray = wordArray.map(e => {
            if (vector.get(wordToRoot.get(toBuckwalter(e))) >= 1) {
                return `<span style="color:yellow">${e}</span>`
            } else { return e }
        })
    } // less than 40
    else if (mode == 0) {
        wordArray = wordArray.map(e => {
            let word = vector.get(wordToRoot.get(toBuckwalter(e)))
            if (word < 1 || word == undefined) {
                return `<span style="color:red">${e}</span>`
            } else { return e }
        })
    }
    return wordArray;

}
/**
 * generating the button to open extra sources
 * @param {Number} c chapter number
 * @param {Number} v Verse number
 */
function splitDown(c, v) {
    let cv = c + ":" + v
    return `
    <!-- Example split danger button -->
<div class="btn-group">
<button type="button" class="btn badge badge-light align-text-bottom dropdown-toggle dropdown-toggle-split" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
<span class="sr-only">Toggle Dropdown</span>
</button>
  <button type="button" class="btn badge badge-light align-text-bottom" onclick="lastOneF('${cv}')">${cv + " "+ quran.sura[c-1].name}</button>
 
  <div class="dropdown-menu">
    <button class="dropdown-item" onclick="openCorpus('${cv}')">Corpus</button>
    <button class="dropdown-item" onclick="openQuran('${cv}')">Quran</button>
    <button class="dropdown-item" onclick="openMeali('${cv}')">Meali</button>
    <div class="dropdown-divider"></div>
    <button class="dropdown-item" onclick="openIqra('${cv}')">Iqra</button>
  </div>    
</div>
`
}
/**
 * Warper for sorting functions.
 */
function sortWarp() {
    sortReslts()
    createTable(result)
}
/**
 * Sorting resutls based on the option that a user choose, 
 * options are percentage and index, decrement vs increment order.
 */
function sortReslts() {
    let perDesc = (a, b) => a[0] - b[0]
    let perAsc = (a, b) => b[0] - a[0]
    let indDesc = (a, b) => (a[1] + a[2]) - (b[1] + b[2])
    let indAsc = (a, b) => (b[1] + b[2]) - (a[1] + a[2])
    switch (sortBy.value) {
        case "0":
            result.sort(perDesc)
            break;
        case "1":
            result.sort(perAsc)
            break;
        case "2":
            result.sort(indDesc)
            break;
        case "3":
            result.sort(indAsc)
            break;
    }



}
/**
 * reading the hash from the page to call the similarity function based on it.
 */
function getHash() {
    let h = decodeURI(location.hash).slice(1);
    let [c, v] = h.split(":")
    let ayaListObj = document.getElementById("al");
    let suraList = document.getElementById("sl");
    suraList.selectedIndex = c - 1;
    timer("Vectors counted in ", () => { ayaList(0) })
    ayaListObj.selectedIndex = v - 1;
    triggerSimilarity()
}
/**
 * Set the page hash, from the Verse and chapter options.
 */
function setHash() {
    let ayaList = document.getElementById("al").value;
    let suraList = document.getElementById("sl").value;
    location.hash = suraList + ":" + ayaList;
    // console.trace();

}
// check full words, check the speed, time to get them, if its slow or not, or if it broken, need pagination...
/**
 * Starting the DOM functions
 */

/**
 * Create the sura list options.
 */
function suraList() {
    let suraList = document.getElementById("sl");
    suraList.innerHTML = "";
    quran.sura.forEach((e, ind) => {
        suraList.appendChild(createOption(ind + 1 + " " + e.tname, ind + 1))
    })
}
/**
 * Create option object
 * @param {String} text text for option
 * @param {Number} value option value
 */
function createOption(text, value) {
    let option = document.createElement("option");
    option.text = text;
    option.value = value;
    return option
}
/**
 * Create Aya list.
 * @param {Number} trigger to trigger an event
 */
function ayaList(trigger = 1) {
    let ayaList = document.getElementById("al");
    let suraList = document.getElementById("sl");
    ayaList.innerHTML = "";
    for (let i = 1; i <= quran.sura[suraList.value - 1].ayas; i++) {
        ayaList.appendChild(createOption(i, i))
    }
    if (trigger) {
        ayaList.dispatchEvent(new Event("change"));
    }
}
/**
 * initlize the events of the html elements.
 */
function initEvents() {
    let aList = document.getElementById("al");
    let suraList = document.getElementById("sl");
    let perc = document.getElementById("perc");
    let srt = document.getElementById("sortBy");

    srt.addEventListener("change", sortWarp)
    perc.addEventListener("change", triggerSimilarity)
    suraList.addEventListener("change", ayaList)
    aList.addEventListener("change", triggerSimilarity)
    window.addEventListener("hashchange", getHash);

}
/**
 * Trigger similarity function and start it, to get the results and set hashs.
 */
function triggerSimilarity() {
    let ayaList = document.getElementById("al");
    let suraList = document.getElementById("sl");
    let perc = document.getElementById("perc");
    setHash()
    result = checkSimilarity(suraList.value, ayaList.value, perc.value)
    sortReslts()
    createTable(result)
}
/**
 * Init the table.
 */
function initSimilarity() {
    initTable()

}
/**
 * create the table baesd on the results array.
 * @param {*} arr results array.
 */
function createTable(arr) {
    let ayaList = document.getElementById("al");
    let suraList = document.getElementById("sl");

    wordNumber.innerText = arr.length
    document.title = suraList.value + " " + ayaList.value + " " + arr.length
    element = document.getElementById("dTable").getElementsByTagName('tbody')[0];
    element.innerHTML = ""
    arr.forEach(e => {
        element.appendChild(createRow(...e))
    });
}
/**
 * create Row of the table.
 * @param {Number} ratio the ration.
 * @param {Number} ch the chapter number.
 * @param {Number} ve the vercse number.
 */
function createRow(ratio, ch, ve) {
    let ayaList = document.getElementById("al");
    let suraList = document.getElementById("sl");
    //tr ==> td ==> div ==> span
    let tr = document.createElement("tr");

    let td = document.createElement("td");
    td.scope = "col"
    td.className = "text-right"

    let span = document.createElement("span")
    span.className = "arabic"
    span.innerHTML = mark(ratio, suraAr[ch - 1][ve - 1], getVerseVector(suraList.value, ayaList.value))
    td.appendChild(span)
    let div = splitDown(ch, ve)
    td.innerHTML += "<br>" + div
        // btn group...
    span = document.createElement("span")
    span.className = "badge badge-info col-1";
    span.innerText = ratio + "%"
    td.appendChild(span)


    tr.appendChild(td)
    return tr;
}
// ***********
function writeToFile(){
    let text="";
    let perDesc = (a, b) => a[0] - b[0]
    let str;
    suraAr.forEach((ayas, indS) => {
        console.log(indS);
        ayas.forEach(
            (words, indA) => {
                result = checkSimilarity(indS+1, indA+1, 70)
                result.sort(perDesc)
                str = result.slice(0, 12)
                str = str.join(" ")
                text += str + "\n"
            }
            
        );
    })
   return text;
  }