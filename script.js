/**
 * The base url of the data from project to read them.
 * 
 */
let dataUrl = "https://a0m0rajab.github.io/BahisQurani/data/"
    /**
     * Data JSON to read them from it.
     * Need to add: Translation for other languages.
     */
let data = {
        arclean: "quran-simple-clean.txt",
        aruthman: "quran-uthmani.txt",

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
 * @see suraAr
 */
let suraSr = []
    /**
     * 
     * Reading data from external source, the send it to a local callback funtion to use it.
     * 
     * @param {*} url The data Url
     * @param {*} target The target array to hold the text
     * @param {*} callBack The call back function to read and parse the file to array.
     * @see dataToArray
     */
function readExternal(url, target, callBack) {
    console.log("reading external data from " + url)
    fetch(url)
        .then(r => r.text()) //response
        .then(t => callBack(t, target)); //text
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
}
/**
 * Set Arabic arrays and initialize it.
 */
function setArabic() {
    // set uthmani array.
    readExternal(dataUrl + data.aruthman, suraAr, dataToArray)
        // set clean array.
    readExternal(dataUrl + data.arclean, suraSr, dataToArray)

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

function displaySura(target, arr) {
    let text = "";
    arr.forEach(e => {
        text += e + "\n"
    });
    target.innerText = text;
}
/**
 *
 * Display sura warper, used all of previews to call them.
 *   */
function displayArWr(number) {
    if (Number.isNaN(Number(number)))
        return
    setSura(number, setSuraNumber);
    displaySura(artxt, suraAr[lastSura]);

}

setArabic();