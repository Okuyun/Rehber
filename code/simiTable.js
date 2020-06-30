/**
 * @file Manage the similarity page of the project. 
 * The methods are based on cosine similarity and will be updated by the time. 
 * You can get the mathematical explination from this link 
 * <a href="https://youtu.be/5XVFQix8tAk?t=455">the mathematical explination from this link </a>
 * @author Abdurrahman RAJAB 
 */
/**
 * The web worker to control outside the function and have access to it.
 */
let worker = new Worker('code/worker/simiWorker.js');
worker.addEventListener('message', function (e) {
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
        case 'done':
            console.log('Table generated: ' + data.msg);
            document.getElementById("loading").hidden = true;
            document.getElementById("dataSection").hidden = false;
            // let date2 = new Date()
            // console.log(date2 - date1)
            initUI();
            break;
        case 'result':
            console.log('result is here');
            result = data.msg;
            sortResults()
            createTable(result)
            break;
        case 'vectorReturned':
            console.log('vectorReturned');
            verseVector = data.msg;

            break;
        default:
            self.postMessage('Unknown command: ' + data.msg);
    };
    menuFn();
});
let verseVector;
worker.onerror = console.error
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

function readHash() { }

function parseHash() { }
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
}
function initUI() {
    initEvents()
    suraList()
    if (location.hash) {
        getHash();
    } else {
        ayaList();
    }
}
let date1;
function callWorker() {
    date1 = new Date();
    worker.postMessage({ "cmd": "init", "data": { sura: suraAr, suraV: surasVector, rootV: rootsVector, wordsRoots: wordToRoot } })
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
function finderButton(msg,root){
    return `
    <!-- Example split warning button -->
<div class="btn-group">
<button type="button" class="btn badge badge-warning align-text-bottom" onclick="openFinder('${root}')">${msg}</button>

</div>
`
}
function openFinder(root){
    let link = "https://a0m0rajab.github.io/BahisQurani/finder#r=" + root;
    window.open(link, "finder")
}
/**
 * generating the button to open extra sources
 * @param {Number} c chapter number
 * @param {Number} v Verse number
 */
function splitDown(c, v,color="light") {
    let cv = c + ":" + v
    return `
    <!-- Example split danger button -->
<div class="btn-group">
<button type="button" class="btn badge badge-`+color+` align-text-bottom dropdown-toggle dropdown-toggle-split" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
<span class="sr-only">Toggle Dropdown</span>
</button>
  <button type="button" class="btn badge badge-`+color+` align-text-bottom" onclick="lastOneF('${cv}')">${cv + " " + quran.sura[c - 1].name}</button>
 
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
    sortResults()
    createTable(result)
}
/**
 * Sorting resutls based on the option that a user choose, 
 * options are percentage and index, decrement vs increment order.
 */
function sortResults() {
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
    let ayaList = document.getElementById("al").value;
    let suraList = document.getElementById("sl").value;
    let perc = document.getElementById("perc").value;
    setHash()
    getVerseVector(suraList, ayaList)
    // worker.postMessage("test")
    worker.postMessage({ "cmd": "compare", "msg": { c: suraList, v: ayaList, min: perc } })
    setHeader(suraList,ayaList)
    // worker.postMessage({"cmd":"compare", "msg":{c:3,v:3}})
    // worker.postMessage({"cmd":"init", "data":{sura:suraAr,suraV:surasVector,rootV:rootsVector, wordsRoots:wordToRoot}})

    // result = checkSimilarity(suraList.value, ayaList.value, perc.value)
}
function setHeader(ch,ve,text){
    let header = document.getElementById("VerseHeader")
    header.innerText=""
    let span = document.createElement("span")
    span.className = "arabic"
    if(text){
        span.innerText= text
        header.appendChild(span)
        return
    }
    if(!text && !ch ) console.trace("undefined header")
    span.innerHTML = suraAr[ch - 1][ve - 1]
    header.appendChild(span)
    let div = splitDown(ch, ve)
    header.innerHTML += "<br>" + div

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
    let length =  arr.length-1
    let title =suraList.value + " " + ayaList.value + " " + arr.length
    if(isSelection)    {
        length ++;
        title = "selection"
    }
   
    wordNumber.innerText =length
    document.title = title
    element = document.getElementById("dTable").getElementsByTagName('tbody')[0];
    element.innerHTML = ""
    if(arr.length  < 2) {
        element.innerHTML = "There is no similarity"
        element.className="text-center"
        return
    }
    // if(verseVector.size == 1) {
    //     wordNumber.innerText = 0
    //     element.className="text-center"
    //     element.innerHTML += finderButton("Open in finder",verseVector.keys().next().value)
    //     return
    // }
    arr.forEach(e => {
        let [ratio,ch,ve] = [...e];
        if(ayaList.value == ve  && suraList.value == ch && !isSelection){
          return;
        }
        element.appendChild(createRow(ratio,ch,ve))
    });
    isSelection= false;
    // triggerSimilarity();
}
/**
 * create Row of the table.
 * @param {Number} ratio the ratio.
 * @param {Number} ch the chapter number.
 * @param {Number} ve the vercse number.
 */
function createRow(ratio, ch, ve) {
    //tr ==> td ==> div ==> span
    let tr = document.createElement("tr");
    let td = document.createElement("td");
    td.scope = "col"
    td.className = "text-right"
    let span = document.createElement("span")
    span.className = "arabic"
    //    continue after the worker message, with rowVector function
    span.innerHTML = mark(ratio, suraAr[ch - 1][ve - 1], verseVector)
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

function getVerseVector(chapterValue, verseValue) {
    worker.postMessage({ 'cmd': 'getVector', msg: { chapter: chapterValue, verse: verseValue } })
}
// ***********
function writeToFile() {
    let text = "";
    let perDesc = (a, b) => a[0] - b[0]
    let str;
    suraAr.forEach((ayas, indS) => {
        console.log(indS);
        ayas.forEach(
            (words, indA) => {
                result = checkSimilarity(indS + 1, indA + 1, 70)
                result.sort(perDesc)
                str = result.slice(0, 12)
                str = str.join(" ")
                text += str + "\n"
            }

        );
    })
    return text;
}


function menuFn() {

    const menu = document.getElementById("contextMenu");
    const menuOption = document.querySelector(".menu-option");
    let menuVisible = false;
    document.addEventListener('keydown', keyPress);

    function select() {
        let s = getSelection().toString().trim()
        if (s) return s
            // else alert("Önce Arapça bir kelime seçin")
    }

    function keyPress(e) {
        if (e.key === "Escape") {
            // preventDefault();
            if (menuVisible) toggleMenu("hide");
        }
    }

    function addContextMenu() {
        document.querySelectorAll("span.arabic").forEach(e => {
            e.addEventListener("contextmenu", e => {
                e.preventDefault();
                const origin = {
                    left: e.x,
                    top: e.y
                };
                // console.log(e)
                setPosition(origin);
                return false;
            })
        })
    }

    function contextMenuArabic() {
        let spAr = document.querySelectorAll("span.arabic")
        for (let e of spAr) {
            e.addEventListener("click", e => {
                if (menuVisible) toggleMenu("hide");
            });
        }
    }



    const toggleMenu = command => {
        // console.log("toggle" + command)
        if (!select() && command == "show") return;
        menu.style.display = command === "show" ? "block" : "none";
        menuVisible = !menuVisible;
    };

    const setPosition = ({ top, left }) => {
        if (window.innerWidth - left < 160) {
            left = (window.innerWidth - 190)
        }
        if (window.innerHeight - top < 220) {
            top -= 250
        }
        menu.style.left = `${left}px`;
        menu.style.top = `${top}px`;
        toggleMenu("show");
    };

    contextMenuArabic();

    document.addEventListener("click", e => {
        if (menuVisible) toggleMenu("hide");
    });
    // should be added by a function - future note  to myself.
    contextMenu.addEventListener("click", e => {
        if (!menuVisible) { return }
        let sel = select();
        // console.log("worked..." + " sel =" + sel)
        switch (e.target.value) {
            case 2: // check similar
            if(!sel) break
            setHeader(undefined,undefined,sel)
            isSelection=true
            worker.postMessage({ "cmd": "checkSelection", "data": { msg: sel , min: perc.value} })
            break;
            case 4: // google search
                window.open("https://google.com/search?q=" + sel)
                break;
            case 1: // copy 
                navigator.clipboard.writeText(sel)
                    .then(() => { console.log('Panoya:', sel) })
                    .catch(e => { alert('Panoya yazamadım\n' + sel) })
                break;
            case 3: // Find in finder
            window.open("https://a0m0rajab.github.io/BahisQurani/finder.html#w=" + sel)
                break;
            
        }
        toggleMenu("hide");
    });
    addContextMenu();
}

let isSelection = false;