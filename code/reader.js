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

function addSura( lastSura) {
    scrollingChapters.appendChild(loadSura(lastSura))
}

function createTableHeader(suraNumber){ 
     let header = document.createElement("thead")
let tr =  document.createElement("tr")
let thTr = createTh(quran.sura[suraNumber].ename)
thTr.className ="w-50 text-center"
tr.appendChild(thTr)
let thAr = createTh(quran.sura[suraNumber].name)
thAr.className ="arabic text-center"
tr.appendChild(thAr)
header.appendChild(tr)
return header;
}
function createTh(data){
    let th =  document.createElement("th")
    th.innerText=data
    return th;
}

function loadSura(lastSura) {
    let sura = document.createElement("table")
    sura.appendChild(createTableHeader(lastSura))    
    sura.id = lastSura;
    sura.className= "table table-hover table-sm"
    let tbody = document.createElement("tbody");
    let aya
    // suraTr
//     <tr>
//     <td>Rahmân ve Rahîm olan Allah'ın ismiyle.</td>
//     <td class="arabic text-right">بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ</td>
//   </tr>
    suraAr[lastSura].forEach((e, i) => {
        aya = document.createElement("tr")
        aya.id = i + 1
        let td = document.createElement("td");
        td.innerText=suraTr[lastSura][i]
        aya.appendChild(td)
        td = document.createElement("td");
        td.innerText=e
        td.className="arabic text-right"
        aya.appendChild(td)
        tbody.appendChild(aya)
    });
    sura.appendChild(tbody)
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
    addSura(lastSura);
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
    // trtxt.innerHTML = ""
        /**
         * Add text right to the tranlsation dislpay to set it for RTL text type (arabic)
         */
    function addTextRight() {
        // trtxt.classList.add("text-right")
            //  trtxt.classList.toggle("text-right")
    }
    /**
     * Removed class text right from translation display, to set it for LTR text type
     */
    function removeTextRight() {
        // trtxt.classList.remove("text-right")
    }
    await loadTrans(n)
    if (choosenGen <= 2) {
        addTextRight()
    } else {
        removeTextRight()
    }
    clearSura()
    addAll()
    getHash()
}



function setNames(number = lastSura) {
    arname.innerText = quran.sura[number].name
    ename.innerText = quran.sura[number].ename + " (" + quran.sura[number].tname + ")"
}

async function initReader() {
    // artxt.innerHTML = ""
    // trtxt.innerHTML = ""
    clearSura()
    await init();
    await loadTrans();
    // addSura(0)
    addAll()

    loadTransR(selectedTranslation.value)
    window.addEventListener("hashchange", getHash);
    responsiveMode()
    return new Promise(function(resolve, reject) {
        resolve('Success!');
    })
}

function initSuras() {
    appendSura();
    appendSura()
    appendSura()
}

 scrollingChapters.onscroll = function() {
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
   
    getChapterVerse(h);
}
/**
 * a function to go to specific chapter and page.
 * 
 * @param {string} text chapter and verse number.
 * 
 */
function getChapterVerse(text){
    let [c, v] = text.split(":")
    loadhash(c - 1)
    setNames(c - 1)
    scrollToCV(c, v)
}
function gotosura(){
   let [c,v] = document.getElementById("suraCV").value.split(":")
   if(!v) v = 1;
   setHash(Number(c), Number(v));
}
function scrollToCV(c, v) {
    if(!v) v = 0;
    document.querySelector(`#artxt > sura[id='${c-1}'] >  aya[id='${v}']`).scrollIntoView()
    document.querySelector(`#trtxt > sura[id='${c-1}'] > aya[id='${v}']`).scrollIntoView()
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
       
        state1.checked = true
        state2.checked = false
        state3.checked = false
     
           break;
        case 2:
          
            state1.checked = false
            state2.checked = true
            state3.checked = false
            break;
            case 3:
              
                state1.checked = false
                state2.checked = false
                state3.checked = true
                break;
 
   }

}

function clearSura(){
    scrollingChapters.innerHTML = ""
}
function addAll(){
    for (let i = 0 ; i < 114 ; i ++ ){
        addSura(i)
        }
}