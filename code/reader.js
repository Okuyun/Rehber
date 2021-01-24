/**
 * The last displayed Sura.
 * 
 */
let lastSura = 1;
/**
 * Sura counter: to count the number of loaded suras 
 */
let suraCounter = 0;
/**
 * 
 * Determine weather to scroll or not on page update.
 */
let isHash = true;

/**
 * Set choosen sura and its search elements to show it.
 * 
 * @param {number} h to set the sura number - H was chosen as random, need to be changed
 * @param {object} htmlEl html object to set its value to sura number 
 * 
 */
function setSura(h = 0) {
    h = Number(h)
    lastSura = lastSura%114
        //console.log(h);
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
    if (lastSura <= -1)
        lastSura = 113;
    displayArWr(lastSura)
}

function addSura( lastSura) {
    scrollingChapters.appendChild(loadSura(lastSura))
}

function createTableHeader(suraNumber){ 
    if(suraNumber < 0 ) suraNumber=0; 
    if(suraNumber > 113) return "";
let header = document.createElement("thead")
let tr =  document.createElement("tr")
let thTr = createTh( " ( " + Number( suraNumber +1 ) +" ) " +  quran.sura[suraNumber].ename )
thTr.className ="tableTefsir w-50 text-center sticky"
tr.appendChild(thTr)
let thAr = createTh( " ( " +  Number( suraNumber +1 ) +" ) " + quran.sura[suraNumber].name  )
thAr.className ="tableArabic arabic text-center sticky"
tr.appendChild(thAr)
header.appendChild(tr)
return header;
}
function createTh(data){
    let th =  document.createElement("th")
    th.innerText=data
    return th;
}

function loadSura(suraNumber) {
    if(suraNumber < 0) suraNumber = 114 + suraNumber;
    if(suraNumber > 113) return "";
    let sura = document.createElement("table")
    sura.appendChild(createTableHeader(suraNumber))    
    sura.id = suraNumber + 1;
    // console.trace(sura.id)
    sura.className= "table table-hover table-sm"
    let tbody = document.createElement("tbody");
    let aya
    // suraTr
//     <tr>
//     <td>Rahmân ve Rahîm olan Allah'ın ismiyle.</td>
//     <td class="arabic text-right">بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ</td>
//   </tr>

    suraAr[suraNumber].forEach((e, i) => {
        aya = document.createElement("tr")
        aya.id = i + 1
        let td = document.createElement("td");
        td.className="tableTefsir"
        td.appendChild(createShareButton())
        td.appendChild(document.createElement("br"))
        td.appendChild(document.createTextNode("(" +aya.id +")"   +  suraTr[suraNumber][i]));
        aya.appendChild(td)
        
        td = document.createElement("td");
        td.appendChild(createShareButton())
        td.appendChild(document.createElement("br"))
        td.className="tableArabic text-right w-50"
        td.dir="rtl"
        let span = document.createElement("span")
        span.innerText= "(" +aya.id +")" + e 
        span.className="arabic text-right"
        td.appendChild(span)
        aya.appendChild(td)
        tbody.appendChild(aya)
    });
    sura.appendChild(tbody)
    lastSura++;
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
    lastSura = lastSura%114
    addSura(lastSura);

    // addSura(lastSura);
    // endOfScroll(artxt, appendSura)
    // checkSuraHeight()
    if (scrollingChapters.childElementCount > 4) {
        removeFirstSura()
    }
}

function checkSuraHeight() {
    if (artxt.firstChild.offsetHeight <= artxt.clientHeight) {
        appendSura()
    }
}

function removeFirstSura() {
    scrollingChapters.removeChild(scrollingChapters.firstChild)
}

function removeLastSura() {
    scrollingChapters.removeChild(scrollingChapters.lastChild)
    lastSura = Number(scrollingChapters.firstChild.id) -1 ;
}

function PrePendSura() {
    scrollingChapters.insertBefore(loadSura(Number(scrollingChapters.firstChild.id)-2), scrollingChapters.firstChild)
    removeLastSura()
    // if (scroll){scrollingChapters.children[1].scrollIntoView()}
    lastSura=Number(scrollingChapters.lastChild.id);
}




function syncOnclick(Event) {
    let element = event.srcElement
    let suraID = element.parentElement.id
    let ayaID = element.id
    console.log(suraID, ayaID, event)
    scrollToCV(suraID,ayaID)
    setHash(Number(suraID) + 1, Number(ayaID));
    // element.scrollIntoView()
}

function setHash(c, v=1) {
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
    // initSuras()
    getHash()
}



async function initReader() {
    // artxt.innerHTML = ""
    // trtxt.innerHTML = ""
    clearSura()
    await init();
    await loadTrans();
  
    // addAll()
    // initSuras()
    loadTransR(selectedTranslation.value)
    window.addEventListener("hashchange", getHash);
    responsiveMode()
    return new Promise(function(resolve, reject) {
        resolve('Success!');
    })
}

function initSuras() {
  for (let index = 0; index < 4; index++) {
    appendSura();
  }
//   PrePendSura()
}
function setDynamicHash(){
    isHash=false
    setHash(isInView(),1);
}
 scrollingChapters.onscroll = function() {
   
    endOfScroll(scrollingChapters, function() {
          appendSura();
        })
     topOfScroll(scrollingChapters, e =>{
        PrePendSura();
     })
    setDynamicHash()
    console.log(isInView())
}

/**
 * check if its at the end of scroll and have a call back function
 * @param {html} target HTML function with scrolling ability
 * @param {function} callBack Add call back function to call if its end of the scroll
 * Thanks StackOverFlow: https://stackoverflow.com/a/35888762
 */
function endOfScroll(target, callBack) {
    if (Math.trunc( scrollingChapters.scrollTop+scrollingChapters.clientHeight) == target.scrollHeight) {
        callBack();
    }
}

function topOfScroll(target, callBack) {
    if (target.scrollTop <  100) {
        callBack();
    }
}

//document.querySelectorAll("#artxt > sura[id='0'] > aya")
// Add hash reader to open a specific sura immediately
function resetAll() {
  scrollingChapters.innerHTML = ""; 
}

function loadhash(chapter=0) {
    resetAll()
    setSura(chapter)
    initSuras()
}

function getHash() {
    if (!isHash) { isHash=true; return} 
    let h = decodeURI(location.hash).slice(1);
    if(h=="") {
        setHash(1,1)
        return;
    };
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
    scrollToCV(c, v)
}
function gotosura(event){
    console.log(event)
    if (event.keyCode === 13) {
        event.preventDefault();
        let [c,v] = document.getElementById("suraCV").value.split(":")
        if(!v) v = 1;
        setHash(Number(c)  , Number(v) );
    }
}
function scrollToCV(c, v) {
    if(!isHash) return;
    console.log("scrolled?")
    if(!v) v = 1;
    if(c=="") c=1;
    let h = document.querySelector(`#scrollingChapters > table[id='${c}'] > tbody >  tr[id='${v}']`).offsetTop
    let offset = document.querySelector(`#scrollingChapters > table[id='${c}'] > thead >  tr`).clientHeight
    scrollingChapters.scrollTo({
        left: 0,
        top: h-offset  ,
        behavior: 'smooth'
    })
    // document.querySelector(`#scrollingChapters > table[id='${c}'] > tbody >  tr[id='${v}']`).scrollIntoView()
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


function checkState(number){
   switch(number){
       case 1: 
       states(true,false,false)      
       break;
        case 2:
            states(false,true,false)      

            break;
            case 3:
                states(false,false,true)      

                break;
   }
}
function states(one,two,three){
    state1.checked = one
    state2.checked = two
    state3.checked = three   
}

function clearSura(){
    scrollingChapters.innerHTML = ""
}
function addAll(){
    for (let i = 0 ; i < 114 ; i ++ ){
        addSura(i)
        }
}
function displayState(number){
    switch(number){
        case 1:
            checkState(1)
            showAll();
        break;
        case 3:
            checkState(3)
            hideArabic();
            showTefsir()
        break;
        case 2:
            checkState(2)
            hideTefsir();
            showArabic();
        break;
        
    }
}
function showAll(){
    showArabic()
    showTefsir()
}
function hideTefsir(){
    setTefsir("none");
}
function showTefsir(){
    setTefsir("table-cell");
}
function showArabic(){
    setArabic("table-cell");
}
function hideArabic(){
    setArabic("none"); 
}
function setTefsir(text){
    getCSSRule(".tableTefsir").style.display=text;
}
function setArabic(text){
    getCSSRule(".tableArabic").style.display=text;
}
function isInView(){
    let x = scrollingChapters;
    for (let h = 0; h < 4; h++) {
        if(x.children[h].getBoundingClientRect().height + x.children[h].getBoundingClientRect().y -160 > 0 )
            return x.children[h].id
    }
}

function share(c,v){
    if (navigator.share) {
        navigator.share({
          title: 'Kuran Rehberi',
          text: 'bu ayet ilgim çekti',
          url: location.href.split("#")[0]+`#${c}:${v}`,
        })
          .then(() => console.log('Successful share'))
          .catch((error) => console.log('Error sharing', error));
      }
}

function createShareButton(){
    // <button type="button" class="btn btn-outline-info">Info</button>
    let btn = document.createElement("button")
    btn.type="button"
    btn.className="btn badge badge-info align-text-bottom"
    btn.innerText = "Share"
    btn.onclick = e => {
        let verse = btn.parentElement.parentElement
        let chapter = verse.parentElement.parentElement
        console.log(chapter.id,verse.id,"shared")
        share(chapter.id,verse.id)
    }
    return btn
}