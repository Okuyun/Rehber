/**
 * The last displayed Sura.
 * 
 */
let lastSura = 0;
/**
 * Sura counter: to count the number of loaded suras 
 */
let suraCounter = 0;
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
        setSura(lastSura)
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
function addSura(target, arr, lastSura) {
    // side note: check which one is faster the innerHTML vs the createAppend 
    let sura = document.createElement("sura")
    sura.id = lastSura;
    let aya
    arr.forEach((e, i) => {
        aya = document.createElement("aya")
        aya.id = i + 1
        aya.innerText = e
        aya.addEventListener("click", syncOnclick)
        aya.appendChild(document.createElement("br"))
        sura.appendChild(aya)
    });
    target.appendChild(sura)
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
        // setSura(number, setSuraNumber);

    lastSura++;


}

function appendSura() {
    addSura(artxt, suraAr[lastSura], lastSura);
    addSura(trtxt, suraTr[lastSura], lastSura);
    setNames(lastSura)
    lastSura++;
    endOfScroll(artxt, appendSura)
}

function removeFirstSura() {}

function removeLastSura() {}

function PrePendSura() {}

function displayTranslation(t) {
    console.log(t)
    for (let i = 0; i <= lastSura; i++)
        addSura(trtxt, suraTr[i], i);
}


function syncOnclick(Event) {
    let element = event.srcElement
    let suraID = element.parentElement.id
    let ayaID = element.id
    setNames(element.parentElement.id)
    console.log(suraID, ayaID, event)
    document.querySelector(`#artxt > sura[id='${suraID}'] >  aya[id='${ayaID}']`).scrollIntoView()
    document.querySelector(`#trtxt > sura[id='${suraID}'] > aya[id='${ayaID}']`).scrollIntoView()
        // element.scrollIntoView()
}

async function loadTransR(n) {
    trtxt.innerHTML = ""
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
    if (choosenGen <= 2) {
        addTextRight()
    } else {
        removeTextRight()
    }
    lastSura--;
    displayTranslation();
    lastSura++;
}



function setNames(number = lastSura) {
    arname.innerText = quran.sura[number].name
    ename.innerText = quran.sura[number].ename + " (" + quran.sura[number].tname + ")"
}

async function initReader() {
    artxt.innerHTML = ""
    trtxt.innerHTML = ""
    await init();
    appendSura();
    loadTrans();
    return new Promise(function(resolve, reject) {
        resolve('Success!');
    })
}


artxt.onscroll = function() {
    endOfScroll(artxt, function() {
        appendSura()
    })
}

/**
 * check if its at the end of scroll and have a call back function
 * @param {html} target HTML function with scrolling ability
 * @param {function} callBack Add call back function to call if its end of the scroll
 * Thanks StackOverFlow: https://stackoverflow.com/a/35888762
 */
function endOfScroll(target, callBack) {
    if (target.scrollTop + target.clientHeight == target.scrollHeight) {
        callBack();
    }
}

//document.querySelectorAll("#artxt > sura[id='0'] > aya")