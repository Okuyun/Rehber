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
function setSura(h = 0) {
    h = Number(h)
        //console.log(h);
    if (h > 110) {
        lastSura = 110;
        return;
    } else if (h < 0) {
        lastSura = 0;
    }
    // return dataShow.innerText = "Please Choose a number between 1-114"
    lastSura = h
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
    target.appendChild(loadSura(arr, lastSura))
}

function loadSura(arr, lastSura) {
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
    return sura;
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
    if (lastSura == 114) return
    addSura(artxt, suraAr[lastSura], lastSura);
    addSura(trtxt, suraTr[lastSura], lastSura);
    setNames(lastSura)
    lastSura++;
    // endOfScroll(artxt, appendSura)
    // checkSuraHeight()
    if (artxt.children.length > 4) {
        removeFirstSura()
    }
}

function checkSuraHeight() {
    if (artxt.firstChild.offsetHeight <= artxt.clientHeight) {
        appendSura()
    }
}

function removeFirstSura() {
    artxt.removeChild(artxt.firstChild)
    trtxt.removeChild(trtxt.firstChild)
}

function removeLastSura() {
    artxt.removeChild(artxt.lastChild)
    trtxt.removeChild(trtxt.lastChild)
}

function PrePendSura() {
    if (artxt.firstChild.id == 0) {
        return;
    }
    setNames(lastSura - 2)
    artxt.insertBefore(loadSura(suraAr[lastSura - 2], lastSura - 2), artxt.firstChild)
    trtxt.insertBefore(loadSura(suraTr[lastSura - 2], lastSura - 2), trtxt.firstChild)
    removeLastSura()
    artxt.children[1].scrollIntoView()
    trtxt.children[1].scrollIntoView()
    lastSura--;
}

function displayTranslation(t) {
    console.log(t)
    for (let i = artxt.firstChild.id; i <= artxt.lastChild.id; i++)
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
    setHash(Number(suraID) + 1, Number(ayaID));
    // element.scrollIntoView()
}

function setHash(c, v) {
    console.log(c, v)
    location.hash = c + ":" + v;
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
    initSuras();
    setNames(0)
    loadTrans();
    window.addEventListener("hashchange", getHash);
    responsiveMode()
    loadTransR(selectedTranslation.value)

    return new Promise(function(resolve, reject) {
        resolve('Success!');
    })
}

function initSuras() {
    appendSura();
    appendSura()
    appendSura()
}

artxt.onscroll = function() {
    endOfScroll(artxt, function() { appendSura() })
    topOfScroll(artxt, e => PrePendSura())
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

function topOfScroll(target, callBack) {
    if (target.scrollTop == 0) {
        callBack();
    }
}

//document.querySelectorAll("#artxt > sura[id='0'] > aya")
// Add hash reader to open a specific sura immediately
function resetAll() {
    artxt.innerHTML = ""
    trtxt.innerHTML = ""
}

function loadhash(chapter) {
    resetAll()
    setSura(chapter)
    initSuras()
}

function getHash() {
    let h = decodeURI(location.hash).slice(1);
    let [c, v] = h.split(":")
    loadhash(c - 1)
    setNames(c - 1)
    scrollToCV(c, v)
}

function scrollToCV(c, v) {
    document.querySelector(`#artxt > sura[id='${c-1}'] >  aya[id='${v}']`).scrollIntoView()
    document.querySelector(`#trtxt > sura[id='${c-1}'] > aya[id='${v}']`).scrollIntoView()
}
/**
 * A warper function of visibility for arabic only/
 */
function showArabic(){
    visibility(["arname","artxt"],false)

}
/**
 * A warper function of visibility for arabic only/
 */
function hideArabic(){
    visibility(["arname","artxt"],true)

}
/**
 * A function to set the hidden attributes of the elements.
 * 
 * @param {string array} listID a string array of the ids to control
 * @param {boolean} control a controller of hiding or showing the element.
 */
function visibility(listID,control){
    listID.forEach(e => document.getElementById(e).hidden =control )
}
/**
 * A warper function of visibility for Tefsir only/
 */
function showTefsir(){
    visibility(["tefsirController","ename","trtxt"],false)
}
/**
 * A warper function of visibility for Tefsir only/
 */
function hideTefsir(){
    visibility(["tefsirController","ename","trtxt"],true)
}

function checkSize() {
    let width= window.innerWidth;
    switch (true) {
        case (width < 770):
            return "small"
        case (width < 990):
            return "medium"
        case (width < 1200):
            return "large"
    }
}

function responsiveMode(){
    switch(checkSize()){
        case "small":
            displayState(2)
            break;
            case "medium":
        case "large":
          
            displayState(1)

        break;
    }
}
window.onresize = () => {
    responsiveMode();
}

function displayState(state){
    switch (state){
        case 1:
            checkState(1)
            break;
        case 2:
           checkState(2)
            break;
        case 3:
checkState(3)
        break;
    }
}

function checkState(number){
   switch(number){
       case 1:
        showArabic()
        showTefsir()
        state1.checked = true
        state2.checked = false
        state3.checked = false
           break;
        case 2:
            hideTefsir();
            showArabic()
            state1.checked = false
            state2.checked = true
            state3.checked = false
            break;
            case 3:
                showTefsir()
                hideArabic()
                state1.checked = false
                state2.checked = false
                state3.checked = true
                break;
 
   }

}