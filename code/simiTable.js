// math stuff: https://youtu.be/5XVFQix8tAk?t=455
const rootsVector = new Map();
const surasVector = new Map();
let result;
// <!-- tum kurandan gecip 80% ustu var olan benzerlikleri bir yere yazdirmaya dusundum -->

function initRootVector() {
    [...rootsMap.keys()].forEach((key) => {
        if (rootsVector.get(key)) console.log("key")
        rootsVector.set(key, 0);
    });
    return new Promise((resolve, reject) => { resolve("Horay") })
}

function readHash() {}

function parseHash() {}

function tableGenerator() {
    suraAr.forEach((ayas, indS) => {
        surasVector.set(indS, new Map())
        ayas.forEach(
            (words, indA) => {
                let array = words.split(" ")
                let temp = new Map(rootsVector);
                array.forEach(e => { if (wordToRoot.get(toBuckwalter(e)) !== undefined) temp.set(wordToRoot.get(toBuckwalter(e)), temp.get(wordToRoot.get(toBuckwalter(e))) + 1) })
                surasVector.get(indS).set(indA, { vector: temp, aya: words, ch: indS + 1, ver: indA + 1 })
            }
        );
    })
    return new Promise((resolve, reject) => { resolve("Horay") })

}
async function initTable() {
    await init()
    await initMujam();
    await initRootVector();
    await timer("All vectors created in ", tableGenerator)
    initEvents()
    suraList()

    if (location.hash) {
        getHash();
    }else {
        ayaList();
    }

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
    let y = +x + (precision === undefined ? 0.5 : precision / 2);
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
function similarity(a, b, magB) {
    return innerProd(a, b) / (magnitude(a) * (magB ? magB : magnitude(b)))
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

function similarityCheckNAN() {
    result = []
    let f = (aya, c, v) => (isNaN(similarity(aya.vector, aya.vector))) ? result.push([100, c + 1, v + 1]) : null;
    surasVector.forEach((sura, c) => sura.forEach((aya, v) => f(aya, c, v)))
    return result;

}

function similiartyError() {
    // let a = surasVector.get(2).get(2)
    // console.log(a.aya)
    // a=a.vector;
    // console.log(similarity(a,a))
    surasVector.forEach((sura) => sura.forEach((aya) => Math.round(!similarity(aya.vector, aya.vector)) >= 1 ? console.log(aya.aya) : aya))
}

function checkSimilarity(c, v, min = 70) {
    result = [];
    min = min / 100
        // verse vector
    let ratio;

    let vv = getVerseVector(c,v);
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
function getVerseVector(c,v){
    return surasVector.get(c - 1).get(v - 1).vector;
}
// start DOM functions
function suraList() {
    let suraList = document.getElementById("sl");
    suraList.innerHTML = "";
    quran.sura.forEach((e, ind) => {
        suraList.appendChild(createOption(ind + 1 + " " + e.tname, ind + 1))
    })
}

function createOption(text, value) {
    let option = document.createElement("option");
    option.text = text;
    option.value = value;
    return option
}

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

function triggerSimilarity() {
    let ayaList = document.getElementById("al");
    let suraList = document.getElementById("sl");
    let perc = document.getElementById("perc");
    setHash()
    result = checkSimilarity(suraList.value, ayaList.value, perc.value)
    sortReslts()
    createTable(result)
}

function initSimilarity() {
    initTable()

}

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
    span.innerHTML = mark(ratio, suraAr[ch - 1][ve - 1],getVerseVector(suraList.value,ayaList.value))
    td.appendChild(span)
    let div = splitDown(ch, ve)
    td.innerHTML +="<br>"+  div 
        // btn group...
    span = document.createElement("span")
    span.className = "badge badge-info col-1";
    span.innerText = ratio + "%"
    td.appendChild(span)


    tr.appendChild(td)
    return tr;
}
function mark(ratio,verse,vector){
    verse = verse.split(" ")
    if(ratio >= 60 ){
        // changeGreatColour("yellow")
        verse = greatArray(vector,verse,0)
    }else if(ratio < 60 && ratio >= 40){
        // changeGreatColour("")
        verse = greatArray(vector,verse,2)
    }else {
        // changeGreatColour("red")
        verse = greatArray(vector,verse,1)
    }
    return verse.join(" ");
}
function greatArray(vector,wordArray,mode){
    if(mode == 1){ // more than 60 
      wordArray=   wordArray.map(e => {
            if(vector.get(wordToRoot.get(toBuckwalter(e)))>= 1 ){
                return `<span style="color:yellow">${e}</span>`
            }else {return e}
        })
    }// less than 40
    else if(mode == 0){
        wordArray=   wordArray.map(e => {
            let word = vector.get(wordToRoot.get(toBuckwalter(e)))
            if( word < 1 || word == undefined){
                return `<span style="color:red">${e}</span>`
            }else {return e}
        })
    }
    return wordArray;

}

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

function sortWarp() {
    sortReslts()
    createTable(result)
}

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

function setHash() {
    let ayaList = document.getElementById("al").value;
    let suraList = document.getElementById("sl").value;
    location.hash = suraList + ":" + ayaList;
    // console.trace();

}
// check full words, check the speed, time to get them, if its slow or not, or if it broken, need pagination...