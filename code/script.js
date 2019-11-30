/**
 * The base url of the data from project to read them.
 * 
 */
let dataUrl = "https://a0m0rajab.github.io/BahisQurani/data/"
    /**
     * Data JSON to read them from it.
     * Need to add: Translation for other languages.
     * tf = stands for tafsir - arabic one. 
     * tr = stands for translation 
     * XXYYZZ
     * xx = either tafsir or translation 
     * yy = the lanauges 
     * ZZ = the type or the source if it differ
     */
let data = {
        arclean: "quran-simple-clean.txt",
        aruthman: "quran-uthmani.txt",
        tfArJal: "ar.jalalayn.txt",
        tfArMu: "ar.muyassar.txt",
        trEn: "en.ahmedali.txt",
        trTr: "tr.diyanet.txt"
    }
    /**
     * Keep the last displayed sura saved for user errors
     * 
     */
let lastSura = 0;
/**
 * Arabic sura array hold nested array of suras and aya,
 * This is the base array of Quran with uthmani font. 
 * suraAr[X][Y] => x number of sura, Y number of aya
 */
let suraAr = []

/**
 * Same as SuraAr but this one does not use uthmani font or even diactrics(harakat) to simplify search methods
 * Sr stands for search...
 * @see suraAr
 */
let suraSr = []
    /** 
     * Translated sura, chosen by the user to show the translated version.
     * Tr = stsands for translation
     */
let suraTr = []
    /**
     * 
     * Reading data from external source, the send it to a local callback funtion to use it.
     * 
     * @param {*} url The data Url
     * @param {*} target The target array to hold the text
     * @param {*} callBack The call back function to read and parse the file to array.
     * @see dataToArray
     */
async function readExternal(url,target,callBack) {
    console.log("reading external data from " + url)
    const r = await fetch(url);
    const t = await r.text();
    const r_1 = callBack(t, target);
    return r_1; 
      
}

/**
 * 
 * File parsing function to parse the responce from external URL.
 * 
 * @param {String} t text from responce
 * @param {Array} targetArray Target array to send the modified data to it.
 * @see readExternal
 */
function dataToArray(t, targetArray) {
    // split the file to line, which downloaded from Tanzil.
    let parsedArray = []
    let lines = t.split("\n");
    let suraN;
    console.log("Quran Verses= " + lines.length);
    // temp to hold the number of sura, so we can use it to trigger the next sura and empty the verses array.
    let versesArray = [];
    for (let line of lines) {
        line = line.split("|");
        suraN = line[0] - 1;
        if (targetArray[suraN] == undefined) {
            targetArray[suraN] = [];
        }
        targetArray[suraN].push(line[2])
    }
   

    return new Promise(function(resolve, reject) {
        resolve('Success!');
      })

}
/**
 * Set Arabic arrays and initialize it.
 */
function loadArabic() {
    // set uthmani array.
    let p1= readExternal(dataUrl + data.aruthman, suraAr, dataToArray)
        // set clean array.

    let p2=    readExternal(dataUrl + data.arclean, suraSr, dataToArray)

    return Promise.all([p1,p2])

}
/**
 * Set choosen sura and its search elements to show it.
 * 
 * @param {number} h to set the sura number - H was chosen as random, need to be changed
 * @param {object} htmlEl html object to set its value to sura number 
 * 
 */
function setSura(h = 0, htmlEl) {
    h = Number(h)
        //console.log(h);
    if (h > 113 || h < 0)
        setSur(lastSura)
        // return dataShow.innerText = "Please Choose a number between 1-114"
    lastSura = h
    htmlEl.value = h + 1;

}

function nextSura() {
    lastSura++;
    if (lastSura == 114) {
        lastSura = 0;
    }
    displayArWr(lastSura)
}

function preSura() {
    lastSura--;
    if (lastSura == -1)
        lastSura = 113;
    displayArWr(lastSura)
}
/**
 * Display choosen sura from the array on the target HTML element, 
 * 
 * @param {Object} target Target HTML elemet to set the inner text as the nested array elements
 * @param {Object} arr  Array of chosen text, can be arabic or the translation 
 */
function displaySura(target, arr) {
    let text = "";
    arr.forEach(e => {
        text += e + "\n"
    });
    target.innerText = text;
}
/**
 *
 * Display arabic sura warper, used all of previews to call them.
 *   
 * 
 */
function displayArWr(number = 0) {

    if (Number.isNaN(Number(number)))
        return
    setSura(number, setSuraNumber);
    displaySura(artxt, suraAr[lastSura]);
    displayTranslation();
    setNames()

}

function displayTranslation(t) {
    console.log(t)
    displaySura(trtxt, suraTr[lastSura]);
}


function init() {

    let p1 = loadArabic()
    let p2 = initTranslation()
    //displayArWr()
    return Promise.all([p1,p2])//.then(displayArWr)
    //initTranslation();

    // display results, after waiting the set arabic to be done, this will wait for 0.5 seconds 

}
/**
 * Load translation and set the translation array to use it in the future.
 * 
 * @param {Number} choosen The choosen number of selected translatio
 */
function loadTrans(choosen = "1") {
    suraTr = []
    let translate = data.tfArJal;
    switch (choosen) {
        case "1":
            translate = data.tfArJal;
            break;
        case "2":       
            translate = data.tfArMu;
            break;
        case "3":
            translate = data.trTr;
            break;
        case "4":
            translate = data.trEn;
            break;
        case "5":
            break;

    }
    return readExternal(dataUrl + translate, suraTr, dataToArray)    
}

async function  loadTransR(n){
     /**
     * Add text right to the tranlsation dislpay to set it for RTL text type (arabic)
     */
    function addTextRight() {
        trtxt.classList.add("text-right")
        //  trtxt.classList.toggle("text-right")
    }
    /**
     * Removed class text right from translation display, to set it for LTR text type
     */
    function removeTextRight() {
        trtxt.classList.remove("text-right")
    }
    await loadTrans(n) 
    if(choosen <= 2 ){
        addTextRight()
    }else{
        removeTextRight()
    }
    displayTranslation();
  }

function initTranslation() {
    return readExternal(dataUrl + data.trTr, suraTr, dataToArray)

}

function setNames() {
    arname.innerText = quran.sura[lastSura].name
    ename.innerText = quran.sura[lastSura].ename + " (" + quran.sura[lastSura].tname + ")"
}

function initReader() {
    init();
    displayArWr();
    loadTrans();
    return new Promise(function(resolve, reject) {
        resolve('Success!');
      })
}
