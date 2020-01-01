/**
 * Clear HTML table without touching the headers.
 * https://stackoverflow.com/questions/18333427/how-to-insert-row-in-html-table-body-in-javascript
 * https://www.daniweb.com/programming/web-development/threads/113340/delete-all-rows-from-table-in-javascript
 * https://developer.mozilla.org/en-US/docs/Web/API/Node/removeChild
 */

let control=false;
let oneline=false;
let lastOne =openIqra; 
let texts=languages.tr;
let settings={};
function clearTable() {
    // translationHeader.style.display = "none"
    arabicHeader.style.width="100vw"
    element = document.getElementById("dTable").getElementsByTagName('tbody')[0];;
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }
}

function createBadge() {
    let anch = document.createElement('span');
    anch.className = "badge badge-light align-text-bottom"
    anch.style="cursor: pointer;"
    anch.addEventListener("click",function(e) {
        console.log(e.target.text);
    });
    return anch
}

function createParagraph() {
    return document.createElement('span');
}

function createArPar() {
    let p = createParagraph();
    p.className = "arabic"
    return p;
}

function createTr() {
    return document.createElement('tr');
}

function createTd() {
    return document.createElement('td');
}

function createArTd() {
    let td = createTd();
    td.scope = "col"
    td.className = "text-right"
    return td;
}
// array first element = sura number, second= aya number
// the function be written in much prettier way but whatever.
// why did not i use class name immedietyl at the set and call? idk? i only used it here.. .
// TODO- write a generic code and change the functions
// get the word to parse and mark based on it....
function createRow(sn, an, word) {
    let tr = createTr();
    let loc;
  
    if(isEnglish(word)){
        loc=getWordLocation(word,suraTr[sn][an],sn,an);
        state3.disabled =true
        showState(1)
        displayState(1)
    }else{
        loc=suraTr[sn][an];
        state3.disabled =""
    }
    arabicHeader.style.width="47%"
    // translationHeader.style.display="table-cell"
    let td = createTd();
    td.className="tableTranslation"
    let tb = createDropDownSplit( quran.sura[sn].tname + " " + (sn + 1)+ ":" + (an + 1)  );
    //tb.href="https://maeyler.github.io/Iqra3/reader#v="+(sn + 1) + ":" + (an + 1)
    td.innerHTML += tb;
    td.append("\xA0\xA0")
    tr.appendChild(td)
    let tp = createParagraph()
    tp.innerHTML = shrink(loc,100)
    // add here for great function.
    // SpanAddEventListener(tp,sn,an)
    td.appendChild(tp)
    tp.className="translation"
   

    let arTd = createArTd();
    arTd.scope="col"
    arTd.className="text-right"
    arTd.dir="rtl"
    // need to change the span thingy as well
    let arP = createArPar();
    
    // if (/[\u064B-\u0652]/.test(word)) {
    //     loc = getWordLocation(word, suraAr[sn][an],sn,an,1);
    // } else if(isEnglish(word)){
    //     loc=getWordLocation(word,suraAr[sn][an],sn,an,1);
    // }else  {
    //     loc  = getWordLocation(word, suraSr[sn][an],sn,an);
    // }
   
    
    loc = getWordLocation(word, suraAr[sn][an],sn,an,1);

        let span = document.createElement("span");
        span.className="shrinkArabic";
        span.innerHTML = shrink(loc)
        // great function
        // SpanAddEventListener(span,sn,an) //1,word)
        arP.appendChild(span)
    
        span = document.createElement("span");
        span.className="fullText";
        span.innerHTML = loc
        // great function
        // SpanAddEventListener(span,sn,an)//,1,word)
        arP.appendChild(span)

    // TODO: if oneline: add controler
    
    let arB = createDropDownSplit(quran.sura[sn].name + " " + (sn + 1) + ":" + (an + 1) , 1);
    //arB.href="https://maeyler.github.io/Iqra3/reader#v="+(sn + 1) + ":" + (an + 1)
   

    
    arTd.innerHTML+=arB;
    arTd.append("\xA0\xA0")
    arTd.appendChild(arP)
    
    tr.appendChild(arTd)
   
    return tr;
}
// mark specific words and return it. 
// location of the word, length of the word string, and arabic aya with vowels.
// broke at suraSr[1][53] --- because of difference in writing arabic.
// هو الله  الله أحق أن
// the trick is to split the AYA based on spaces and get location from no vowels then change it on the vowels one... 
function markAr(loc, aya) {
    let wordLst = aya.split(" ");
    wordLst[loc] = `<mark>` + wordLst[loc];
    wordLst[loc + length - 1] = wordLst[loc + length - 1] + `</mark>`
    return aya.replace(" ");
}
// get the searched word location and size to mark.
// searched word, aya text.
function getWordLocation(word, aya,sn,an,cnt) {
    // TODO : change to proper html
    // TODO: normilsation should be here i guess...
    let normAya = normlisation(aya).split(" ");;
    let normWord= normlisation(word).split(" ");
    let index= subArrayIndexes(normAya,normWord).reverse();
    aya = aya.split(" ");
    for (let loc of index){
    aya.splice(loc+normWord.length,0,`</great>`)
    aya.splice(loc,0,`<great onclick="openWithBuck(`+sn+`,`+an+`,this,`+cnt+`)">`);
    }
    // let regx = RegExp(word,"gi");
    //  event on click 
    // return aya.replace(regx, `<great onclick="openWithBuck(`+sn+`,`+an+`,'`+word+`',`+cnt+`)">$&</great>`)
    return aya.join(" ")
}

function subArrayIndexes(master,sub){
//  inspiration from, Jaimin Patel's comment: https://stackoverflow.com/questions/34151834/javascript-array-contains-includes-sub-array

//collect all master indexes matching first element of sub-array
   let matched_index= allOccurenceSub(master,sub[0])  

    for(let index of matched_index){
        for(let [j,element] of sub.entries()){
            if(!master[j+index].includes(element)) {
                matched_index= removeElement(matched_index,index)
                break;
            }
        }
    }
    return matched_index;
}

function removeElement(arr, value) {
// https://love2dev.com/blog/javascript-remove-from-array/
    return arr.filter(function(ele){
        return ele != value;
    });
    
 }

function allOccurence(array,element){
    // This match if EXACTLY the same... need to check if substring, will this can be a mode in the future, yeah far FUTURE not now, note to yourself, finish your code :( )
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/indexOf
    let indices = [];
    let idx = array.indexOf(element);
    while (idx != -1) {
    indices.push(idx);
    idx = array.indexOf(element, idx + 1);
    }
    return indices;
}

function allOccurenceSub(array,element){
    let indices = [];
    array.forEach(function(item,index) {
        if (item.indexOf(element) !== -1) {
            indices.push(index)
        }
      })
      return indices;
}
/**
function subArrayIndexes(master,sub){
//  inspiration from, Jaimin Patel comment: https://stackoverflow.com/questions/34151834/javascript-array-contains-includes-sub-array
    //collect all master indexes matching first element of sub-array
    let matched_index = [] 
    let start_index = master.indexOf(master.find(e=>e==sub[0]))
    
    while(master.indexOf(sub[0], start_index)>0){
        matched_index.push(start_index)
        let index = master.indexOf(sub[0], start_index)
        start_index = index+1
    } 

    let has_array //flag
    
    for(let [i,s_index] of matched_index.entries()){
        for(let [j,element] of sub.entries()){
            if(element != master[j+s_index]) {
                matched_index.pop()
                has_array = false
                break
            }else has_array = true
        }
        if (has_array) break
    }
    return matched_index
} */
function SpanAddEventListener(span,sn,an,cnt,word){
    // TOD: check why it did not work for arabic, but worked well for English!! 
    // its over annoying! 
    if(span.children[0] !== undefined){
        let cv = (sn+1)+":"+(an+1);
        // if(cnt) cv += "&w=" + toBuckwalter(word)+"";
        console.log("event listern added to" , span.children[0].innerText)
        // span.children[0].onclick=function (){console.log("hello")}
        span.children[0].addEventListener("click",function(e) {
            console.log("clicked")
            openIqra(cv)
        });
    }
    // TODO: bug at أَضَآءَتْ  -- need to fix :( -- Still not working in Iqra... need to check.
}

function openWithBuck(sn,an,word , cnt){
    let cv = (sn+1)+":"+(an+1);
    // console.log(word)
    word=word.innerText;
    // console.log(word)
    // word = word.split(" ")[0]
    if(cnt) cv += "&w=" + toBuckwalter(word)+"";
    openIqra(cv);
}

function shrink(text,number=5){
    /**
     * length = 20
     * index = 15
     * 5- (15) +5 
     * 5- (index) +5
     * IF index+5 = 23 
     * pre+3 (23-length)
     * IF index-5 = -X
     * post+x, start from 0
     */
    text=text.split(" ");

    let index= text.findIndex( e => e.includes("<great"))
    let endIndex= text.findIndex( e => e.includes("</great>"))
    number = number + (searchQue.value.split(" ").length);
    
    if(text.length <= number){
        return text.join(" ")
    }
    if(index < 0 ){
        return text.join(" ")
    }
    let pre=index-number/2 ,post =endIndex+number/2 
    if(pre < 0){
        return text.slice(0,number).join(" ");  
    }
    if(post > text.length ){
        return text.slice(pre+(text.length - post)).join(" ");  
    }
    //console.log(text.slice(pre,post).length)
    return text.slice(pre,post).join(" ");  
           
}

function colouredOne(text) {
    // <font color="blue">This is some text!</font>
    return text.replace(searchQue.value, `<font color="blue">` + searchQue.value + `</font>`);
}

// arr is lsit of aya and sura, searched word.
function createTable(arr, word) {
    wordNumber.innerText = arr.length + parseInt(wordNumber.innerText)
    document.title += " " + wordNumber.innerText;
    element = document.getElementById("dTable").getElementsByTagName('tbody')[0];
    arr.forEach(e => {
        element.appendChild(createRow(e[0], e[1], word))
    });
    addShowFunction();
}

// TODO: simplify and re-read the code then.

// get the sura and verses that has this word and the word location.
function search(word, arr = suraSr) {
    let index = -1,
        loc = [];

    // loop all of suras.
    for (i = 0; i < arr.length; i++) {
        // loop verses of each sura.
        for (let j = 0; j < arr[i].length; j++) {
            // 
            let aya =arr[i][j].toLowerCase();
            // working :) -- the insan error is caused by the RegEx
            let locs = removeOddChar(aya).indexOf(removeOddChar(word.toLowerCase()))
            
            if (locs !== -1) {
                loc.push([i, j, locs])
            }
        }
    }
    return loc;
}

function removeOddChar(string){
    let oddChar = `İ`.toLowerCase()[1]
    let h = new RegExp(oddChar,"ig")

    return string.replace( h,"");
}
// get the next word location from the search based on length of the word itself... 
// check if the word is at the ened of aya...
function nextWordLoc(word, arr = suraSr) {
    let wordLoc = search(word, arr);
    let nxtwrd, suraN, aya;
    for (let i = 0; i < wordLoc.length; i++) {
        nxtwrd = wordLoc[i][2] + word.length
        suraN = wordLoc[i][0]
        aya = wordLoc[i][1]
        wordLoc[i] = [suraN, aya, nxtwrd]
    }
    return wordLoc;
}

function removePunctions(word){
    return word.replace(/(~|`|!|@|#|$|%|^|&|\*|\(|\)|{|}|\[|\]|;|:|\"|'|<|,|\.|>|\?|\/|\\|\||-|_|\+|=)/g,"")
}

function nextWordList(word, arr = suraSr) {
    // ayet is out of bound...

    let wordlocation = nextWordLoc(word, arr);
    // sugwrd = suggestion word, ns= number sura, na = number aya, wls = world list.
    // anls = aya number list
    let wls = new Set(),
        als = new Set(),
        anls = new Set(),
        lastindex,
        sugwrd, ns, na, aya;
    for (let i = 0; i < wordlocation.length; i++) {
        anls.add([wordlocation[i][0], wordlocation[i][1]])
        ns = wordlocation[i][0];
        na = wordlocation[i][1];
        aya = arr[ns][na];
        lastindex = aya.indexOf(" ", wordlocation[i][2] + 1);
        if (lastindex == -1) {
            lastindex = aya.length;
        }
        sugwrd = aya.substring(wordlocation[i][2], lastindex);
        sugwrd = removePunctions(sugwrd);
        // if end of aya, then check next aya, from the beging
        if (sugwrd.length <= 1) {
         
            continue;

        }
        // check if aya is out of sura index
        wls.add(sugwrd)
        als.add(aya)
    }

    return [wls, anls];
}

let wordLst;

function isEnglish(word){
    // /([A-Za-z])+/
    // /^[A-Za-z0-9]*/i

    let regXenglish= /[A-Za-z0-9]+/
    let h = new RegExp(regXenglish,"ig")
    if(h.test(word)){
        SearchBarLTR()
        return true
    }
    SearchBarRTL();
    return false
}

function SearchBarLTR(){
   
        searchQue.dir="LTR"
        searchQue.className = "form-control translation"
    
  
}

function SearchBarRTL(){
    searchQue.className = "arabic form-control text-right";
    searchQue.dir="rtl"
}
function find(word) {
    if(word.length <= 0) return;

    if(isEnglish(word)) {
        wordLst=nextWordList(word,suraTr)
        return;
    }
    
    if (/[\u064B-\u0652]/.test(word)) {
        wordLst = nextWordList(word, suraAr);
    } else {
        wordLst = nextWordList(word);
    }
   
    // clearTable();
    // console.log([...wordLst[0]].join("\n"))
    // createTable([...wordLst[1]])
}

function findAction(word) {
    if(word.length <= 0) return;
    clearTable();
    serachedWordTable(word);
    setHash(word)
}


function serachedWordTable(word){
    word= word.trim();
    document.title="finder - " + word;
    wordNumber.innerText=0;
    let words= word.split("+")
    words.forEach(e => {
        word = e;
        find(word)
        createTable([...wordLst[1]], word)
    });
  
}
function findActionH(word) {
    clearTable();
    word = decodeURI(word);
    searchQue.value=word
    serachedWordTable(word);
}

function sugOnKeyUp(word) {
    let sugwrd = word.split("+")
    word = sugwrd[sugwrd.length-1]
    find(word)
    addSuggestions([...wordLst[0]]);
}


function autoCreate(word) {
    let wordLst = [...nextWordList(word)[0]];
    /*initiate the autocomplete function on the "myInput" element, and pass along the countries array as possible autocomplete values:*/
    autocomplete(document.getElementById("searchQue"), wordLst);
}

function addSuggestions(wordList) {
    wordList = wordList.slice(0, 11)
    suggestions.innerHTML = "";
    let opt;
    let html;
    wordList.forEach(e => {
        //only check if its the same ... without searchQue value it would not work.. .imporatnt 
        opt = document.createElement("option")
        opt.className="arabic"
        opt.value = searchQue.value + "" + e
            // suggestions.appendChild(opt)
        html += opt.outerHTML;
    })
    suggestions.innerHTML = html;

}

// https://www.w3schools.com/howto/howto_js_autocomplete.asp
function autocomplete(inp, arr) {
    /*the autocomplete function takes two arguments,
    the text field element and an array of possible autocompleted values:*/
    var currentFocus;
    /*execute a function when someone writes in the text field:*/
    inp.addEventListener("input", function(e) {
        var a, b, i, val = this.value;
        /*close any already open lists of autocompleted values*/
        closeAllLists();
        if (!val) { return false; }
        currentFocus = -1;
        /*create a DIV element that will contain the items (values):*/
        a = document.createElement("DIV");
        a.setAttribute("id", this.id + "autocomplete-list");
        a.setAttribute("class", "autocomplete-items");
        /*append the DIV element as a child of the autocomplete container:*/
        this.parentNode.appendChild(a);
        /*for each item in the array...*/
        for (i = 0; i < arr.length; i++) {
            /*check if the item starts with the same letters as the text field value:*/
            if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
                /*create a DIV element for each matching element:*/
                b = document.createElement("DIV");
                /*make the matching letters bold:*/
                b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
                b.innerHTML += arr[i].substr(val.length);
                /*insert a input field that will hold the current array item's value:*/
                b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
                /*execute a function when someone clicks on the item value (DIV element):*/
                b.addEventListener("click", function(e) {
                    /*insert the value for the autocomplete text field:*/
                    inp.value = this.getElementsByTagName("input")[0].value;
                    /*close the list of autocompleted values,
                    (or any other open lists of autocompleted values:*/
                    closeAllLists();
                });
                a.appendChild(b);
            }
        }
    });
    /*execute a function presses a key on the keyboard:*/
    inp.addEventListener("keydown", function(e) {
        var x = document.getElementById(this.id + "autocomplete-list");
        if (x) x = x.getElementsByTagName("div");
        if (e.keyCode == 40) {
            /*If the arrow DOWN key is pressed,
            increase the currentFocus variable:*/
            currentFocus++;
            /*and and make the current item more visible:*/
            addActive(x);
        } else if (e.keyCode == 38) { //up
            /*If the arrow UP key is pressed,
            decrease the currentFocus variable:*/
            currentFocus--;
            /*and and make the current item more visible:*/
            addActive(x);
        } else if (e.keyCode == 13) {
            /*If the ENTER key is pressed, prevent the form from being submitted,*/
            e.preventDefault();
            if (currentFocus > -1) {
                /*and simulate a click on the "active" item:*/
                if (x) x[currentFocus].click();
            }
        }
    });

    function addActive(x) {
        /*a function to classify an item as "active":*/
        if (!x) return false;
        /*start by removing the "active" class on all items:*/
        removeActive(x);
        if (currentFocus >= x.length) currentFocus = 0;
        if (currentFocus < 0) currentFocus = (x.length - 1);
        /*add class "autocomplete-active":*/
        x[currentFocus].classList.add("autocomplete-active");
    }

    function removeActive(x) {
        /*a function to remove the "active" class from all autocomplete items:*/
        for (var i = 0; i < x.length; i++) {
            x[i].classList.remove("autocomplete-active");
        }
    }

    function closeAllLists(elmnt) {
        /*close all autocomplete lists in the document,
        except the one passed as an argument:*/
        var x = document.getElementsByClassName("autocomplete-items");
        for (var i = 0; i < x.length; i++) {
            if (elmnt != x[i] && elmnt != inp) {
                x[i].parentNode.removeChild(x[i]);
            }
        }
    }
    /*execute a function when someone clicks in the document:*/
    document.addEventListener("click", function(e) {
        closeAllLists(e.target);
    });
}

function hashChanged() {
    let h = location.hash
    if (!h.startsWith('#w=')){
        console.log(h)
        findAction( 'بسم الله')
        return;
    }
    let arabic = h.substring(3).replace("%20", " ");
   // arabic=toArabic(decodeURI(arabic)); // move the decode function to BuckWalter code... better approach
    if(arabic.length <= 0) return;
    findActionH(arabic); //toArabicLetters(arabic));
}

function setHash(e) {
    // if(!isEnglish(e)){
    //     e=  toBuckwalter(e);
    // }

    
    location.hash = 'w=' + e //toBuckwalter(e);

}

function initFinder() {
    console.log("Finder started...")
    searchQue.addEventListener("keyup", function(event) {
        if (event.keyCode === 13) {
            event.preventDefault();
            findAction(searchQue.value)
        }
    });
    hashChanged();
    window.addEventListener("hashchange", hashChanged);
    if(storageAvailable("localStorage")){
        if(window.localStorage.settings === undefined){
            initLocalStorage();
        }else{
            loadSettings()
        }
    }
}
// from: https://stackoverflow.com/questions/1409225/changing-a-css-rule-set-from-javascript
// Add variables array then use destrutctor to call it for once! only one time... 
// no need to crash the app everytime the user will change the CSS since its static and
//  stable, yet, do you think the array thingy was faster? if yes then go for it and leave 
// TODO: this, speed is valuable more than some ninja JS skills here. 

function getCSSRule(ruleName) {              
    // ruleName=ruleName.toLowerCase();                      
    for ( let sheet of  document.styleSheets){
        for (let rule of sheet.cssRules){
       if(rule.selectorText == ruleName){
           return rule;
       }
        }
        }

}            

function changeColour(col){
    getCSSRule("great").style.backgroundColor=col;
    updateSettings("colour",col)
}
function changeFont(language,size){
    //console.log(language,size)
    let rule,update="translation";
    if(language=="arabic"){
        //.arabic
        rule=getCSSRule(".arabic");
        update = "arabic"
        }else{
            //.translation 
         rule=getCSSRule(".translation")
    }
    let old =parseInt(rule.style.fontSize);
    rule.style.fontSize =  old+size+"px"
    updateSettings(update,old+size)
}

async function loadTransF(n=3){
    await loadTrans(n.toString())
    clearTable();
    findAction(searchQue.value);
    THtext.innerText= getTefsirText(n) + "\u2002";
    updateSettings("source",n)
    langSpeechSettings()
}

function getTefsirText(n){
    let tefsir = [ "تفسير الجلالين","تفسير الميسر","Türkçe: Diyanet Meali","English: Ahmed Ali","Türkçe: Elmalılı Hamdi Yazır","English: Abdullah Yusuf Ali"]
    return tefsir[n-1];
}

function openMeali(cv){
    cv =cv.split(":");
    let c= cv[0] , v= cv[1];
    let link = `http://kuranmeali.com/AyetKarsilastirma.php?sure=${c}&ayet=${v}`
    window.open(link,"meali") 
    lastOne=openMeali
    warpLast()

}
// cv = chapter verses C:V 
function openIqra(cv){
    let link="https://maeyler.github.io/Iqra3/reader#v=" + cv ;
    window.open(link,"iqra") 
    lastOne=openIqra;
    warpLast()
}

function openQuran(cv){
    cv =cv.split(":");
    let c= cv[0] , v= cv[1];
    let link=`https://quran.com/${c}/${v}`
    window.open(link,"Quran") 
    lastOne=openQuran;
    warpLast()
}

function openCorpus(cv){
    cv =cv.split(":");
    let c= cv[0] , v= cv[1];
    let link =`http://corpus.quran.com/translation.jsp?chapter=${c}&verse=${v}`
    window.open(link,"Corpus") 
    lastOne=openCorpus;
    warpLast()
}

function createDropDownSplit(suraCV , control){
    // may change it to javascript later, but this is much easier LOL.
    // NEED TO reFactor.
    let cv = suraCV.split(" ");
    cv = cv[cv.length-1]
    let x = `
    <!-- Example split danger button -->
<div class="btn-group">
  <button id="showHideFull" type="button" class="btn badge badge-light align-text-bottom dropdown-toggle-split" aria-expanded="false" onlcick="toggleShow('test')">+</button>
  <button type="button" class="btn badge badge-light align-text-bottom" onclick="lastOne('${cv}')">${suraCV}</button>
  <button type="button" class="btn badge badge-light align-text-bottom dropdown-toggle dropdown-toggle-split" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
    <span class="sr-only">Toggle Dropdown</span>
  </button>
  <div class="dropdown-menu">
    <button class="dropdown-item" onclick="openCorpus('${cv}')">Corpus</button>
    <button class="dropdown-item" onclick="openQuran('${cv}')">Quran</button>
    <button class="dropdown-item" onclick="openMeali('${cv}')">Meali</button>
    <div class="dropdown-divider"></div>
    <button class="dropdown-item" onclick="openIqra('${cv}')">Reader</button>
  </div>
</div>
`
if(control){
    x = `
    <!-- Example split danger button -->
<div class="btn-group">
<button type="button" class="btn badge badge-light align-text-bottom dropdown-toggle dropdown-toggle-split" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
<span class="sr-only">Toggle Dropdown</span>
</button>
  <button type="button" class="btn badge badge-light align-text-bottom" onclick="lastOne('${cv}')">${suraCV}</button>
 
  <button id="showHideFull" type="button" class="btn badge badge-light align-text-bottom dropdown-toggle-split" aria-expanded="false" onlcick="toggleShow('test')">+</button>

  <div class="dropdown-menu">
    <button class="dropdown-item" onclick="openCorpus('${cv}')">Corpus</button>
    <button class="dropdown-item" onclick="openQuran('${cv}')">Quran</button>
    <button class="dropdown-item" onclick="openMeali('${cv}')">Meali</button>
    <div class="dropdown-divider"></div>
    <button class="dropdown-item" onclick="openIqra('${cv}')">Reader</button>
  </div>
</div>
`
}
return x;
}

function toggleShow(e){
    // $0 this element --> for the split button made in createDropDownSplit
    // .parentElement btnGroup
    // .parentElement td
    // .children[0] spanArabic
    // .children[0] 
    // children 0 = ShrinkedArabic
    // children 1 = full text
    let fullText = e.parentElement.parentElement.children[1].children[0];
    let shrinked = e.parentElement.parentElement.children[1].children[1];
   switch(e.innerText){
       case "+":
           e.innerText ="-";
           fullText.style.display="none"
           shrinked.style.display="table-cell"
           break;
        case "-":
            e.innerText ="+";
            shrinked.style.display="none"
            fullText.style.display="table-cell"
            break;
   }

}
function resetTD(e){
    if(e.parentElement.parentElement.children[1].className == "translation")
        return
    let fullText = e.parentElement.parentElement.children[1].children[0];
    let shrinked = e.parentElement.parentElement.children[1].children[1];
    e.innerText ="+";
    fullText.style.display="";
    shrinked.style.display="";
}

function addShowFunction(){
   if(typeof showHideFull !== "undefined"){
    for ( let x of showHideFull){
        x.onclick= function () {toggleShow(x)}
        }
   }
}

function toggleOneline(){
    // Approach two: create and delete the whole page, you got the data in wordlst already... 
    //  does it worth to loop it? or would it better if we have had the CSS since its easier.
    // let htmlText;
    // for (let el of document.querySelectorAll("span.arabic") ){
    //     htmlText=  el.innerHTML;
    //     el.innerHTML = shrink(htmlText)
    // }
    // oneline =!oneline;
    // oneLineShow(oneline)
    updateSettings("oneline",oneline)
    // go to check this for future fix:https://stackoverflow.com/questions/4602141/variable-name-as-a-string-in-javascript
}
function displayState(num){
    /**
     * 1: for showing all 
     * 2: for showing only arabic
     * 3: for showing only arabic online mode.
     */
    updateSettings("dstate", num)


    switch(num){
        case 1: 
            translationStyle("table-cell")
            oneLineShow(false)
            break;
        case 2:
            translationStyle("none")
            oneLineShow(false)
            break;
        case 3:
            translationStyle("none")
            oneLineShow(true)
            break;
    }
}
function translationStyle(text){
    getCSSRule(".tableTranslation").style.display=text
    // go to check this for future fix:https://stackoverflow.com/questions/4602141/variable-name-as-a-string-in-javascript
}
function oneLineShow(bool){
    if(typeof showHideFull !== "undefined"){
        checkButton();
       }
  

    oneline=bool;
    if(bool){
        fullTextStyle("none")
        shrinkStyle("table-cell");
        showHideButtonStyle("")
    }else {
        shrinkStyle("none")
        fullTextStyle("table-cell");
        showHideButtonStyle("none")
    }
    updateSettings("oneline",oneline)

}
function checkButton(){
    for ( let x of showHideFull){
    //    if(x.innerText == "-"){
        //    x.click();
        resetTD(x)
    //    }
        }
        // other approach: document.querySelectorAll("span.fullText") 
}
function fullTextStyle(text){
    getCSSRule(".fullText").style.display=text;

}
function shrinkStyle(text){
    getCSSRule(".shrinkArabic").style.display=text;
}
function showHideButtonStyle(text){
    getCSSRule("#showHideFull").style.display=text;
}
// Local storage code.  
// source: https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API/Using_the_Web_Storage_API
function storageAvailable(type) {
    var storage;
    try {
        storage = window[type];
        var x = '__storage_test__';
        storage.setItem(x, x);
        storage.removeItem(x);
        return true;
    }
    catch(e) {
        return e instanceof DOMException && (
            // everything except Firefox
            e.code === 22 ||
            // Firefox
            e.code === 1014 ||
            // test name field too, because code might not be present
            // everything except Firefox
            e.name === 'QuotaExceededError' ||
            // Firefox
            e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
            // acknowledge QuotaExceededError only if there's something already stored
            (storage && storage.length !== 0);
    }
}
function normlisation(text){
    text = text.replace(/[\u0670-\u0671]/gm,"ا")
    text = text.replace(/[\u064B-\ufd3f]/gm, '');
    text = text.replace(/\u0629/gm,"ه");
    text = text.replace(/\u0623/gm,"ا");
    text = text.replace(/\u0625/gm,"ا");
    return text;
    
}
function populateSettings(){

}
function initLocalStorage(){
    let keys=["arabic","translation","colour","control","source","oneline","lastOne","lang"]
    let arabicSize =parseInt(getCSSRule(".arabic").style.fontSize);
    let translationSize =parseInt(getCSSRule(".translation").style.fontSize);
    let colour=getCSSRule("great").style.backgroundColor;
    let values=[arabicSize,translationSize,colour,control,5,oneline,lastOne.toString(),"1"]
   for (let i = 0; i < keys.length; i++) {
      updateSettings(keys[i],values[i])
   }
}
function updateSettings(target,value){
    settings[target]=value;
    updateSettingsStorage()
}
function warpLast(){
    updateSettings("lastOne",lastOne.toString())
}
function updateSettingsStorage(){
    if (storageAvailable('localStorage')) {
        localStorage.setItem('settings',JSON.stringify(settings))
     }
}

function loadSettings(){
    if (storageAvailable('localStorage')) {
        settings= JSON.parse(localStorage.getItem('settings'))
        changeColour(settings.colour)
        changeFont("arabic",0)
        changeFont("x",0)
        loadTransF(settings.source);
        lastOne=eval('(' + settings.lastOne+ ')');
        language(settings.lang)
        showState(settings.dstate)
        displayState(settings.dstate)
    }
}

function showState(state){
    switch (state){
        case 1:
            state1.checked=true;
            break;
        case 2:
            state2.checked=true;
            break;
        case 3:
            state3.checked=true;
            break;
    }
}
// Global to be able to cancel :) 
const SR = new webkitSpeechRecognition()


function SearchVoice(language){
let speechLang= "tr-TR"
// TODO: tefsir source is not defined -- check form local storage.
switch(settings.source){
   case 3:
   case 5:
        speechLang="tr-TR"
        break;
    case 1:
    case 2:
        speechLang="ar-AR"
        break;
    case 4:
    case 6:
        speechLang="en-EN"
        break;
}
   
function listen(lang) {
    SR.lang = lang?lang:speechLang; //: "en-EN"; 
    console.log(SR.lang)
    SR.start() 
}
function getResult(e) {
    let a = e.results[0][0]; //use first result
    $('#speechSettings').modal('hide');
    console.log(a.transcript, a.confidence.toFixed(2))
    searchQue.value=a.transcript;
    findAction(searchQue.value)
    loading.hidden=true;

    // out.innerText = a.transcript; speak()
    // out.style.background = ''
}
function error(e) {
    // out.innerText = turk.checked? '[ses yok]' : '[no input]'
    // out.style.background = ''
    loading.hidden=true;
    console.log("error ",e)
}
function started(){
    loading.hidden=false;
}
function stopped() { loading.hidden=true;};
   
    SR.onspeechend = SR.stop; 
    SR.onsoundend = error
    SR.onresult = getResult;  
    SR.onnomatch = error
    SR.onstart = started;
    SR.onstop = stopped;
    listen(language);
}
function speechCancel(){
    SR.abort();
    loading.hidden=true;
}
function language(val){
    val = parseInt(val)
    switch(val){
        case 1:
            texts = languages.tr
            break;
        case 2:
            texts = languages.ar
            break;
        case 3:
            texts = languages.en
            break;

    }
    updateSettings("lang",val)
    loadLang();
}

function loadLang(){
    txtWordFound.innerText=texts.occ;
    fontAr.innerText=texts.font + " " + texts.size;
    txtTrans.innerText=texts.trans + " "+texts.size;
    markColour.innerText=texts.mark + " " + texts.colour;
    // showHide.innerText=texts.show +"/"+ texts.hide;
    // shTefsir.innerText=texts.show +"/"+ texts.hide +" " + texts.tefsir;
    settingsModelTitle.innerText=texts.pref;
    // txtOneline.innerText=texts.oneLine;
    // txtTefSource.innerText=texts.tefsir + " "+ texts.source;
    txtLangs.innerText=texts.language;
    txtModelClose.innerText=texts.close;
    state1.labels[0].innerText=texts.show;
    state2.labels[0].innerText=texts.arabic;
    state3.labels[0].innerText=texts.oneLine;
    btnArabic.innerText =texts.arabic;
    langSpeechSettings()
    // btnOtherLang.innerText=texts.close; Had to move it inside loadTranF
    btnClose.innerText=texts.close;
    modelVoiceControl.innerText=texts.soundSettings;
    loadText.innerText=texts.listening;
}

function langSpeechSettings(){
    switch(settings.source){
        case 3:
        case 5:
            btnOtherLang.innerText=texts.turkish;
             break;
         case 1:
         case 2:
            btnOtherLang.innerText=texts.arabic;
             break;
         case 4:
         case 6:
            btnOtherLang.innerText=texts.english;
             break;
     }

}
// write docs and split the code to more readable style.. 
// instead of removing/clearning diactricits( vowels - tashkeel) check if its there then search by another array.