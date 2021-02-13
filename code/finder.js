/**
 * @file The main functions of the search page.
 * @author Abdurrahman RAJAB 
 */

/**
 * Used to check one line function if its open or not.
 */
let oneline = false;
/**
 * Selected Page -- for chuncks of data.
 */
let dataIndex = 0;
/**
 * verseInPage of data in page.
 */
let verseInPage = 10;
// toArabic(wordToRoot.get(toBuckwalter("أَتْقَىٰكُمْ"))) -- get word root.. 
/**
 * Last opened function to go and visit. 
 */
let lastOne = "iqra";
/**
 * Interface language it has three options: tr,ar,en
 */
let texts = languages.tr;
/**
 * Application settings to be save in the local storage. 
 * @see initLocalStorage
 * @see updateSettings. 
 * @see loadSettings
 */
let settings = {};
/**
 * Clear html table and reset it to create the table for second word.
 */
function clearTable() {
    // translationHeader.style.display = "none"
    // arabicHeader.style.width = "100vw"
    element = document.getElementById("dTable").getElementsByTagName('tbody')[0];;
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }
}
/**
 * create Span to use for HTML paragraph
 * @see createArPar
 * @see createRow
 */
function createSpan() {
    return document.createElement('span');
}
/**
 * Create arabic paragraph, with class name arabic. 
 * @see createRow
 */
function createArPar() {
    let p = createSpan();
    p.className = "arabic"
    return p;
}
/**
 * Create table row element, TR
 */
function createTr() {
    return document.createElement('tr');
}
/**
 * Create table data element, TD
 */
function createTd() {
    return document.createElement('td');
}
/**
 * Create table row element, TR
 * with scope: col
 *      class: text-right
 * @see createRow
 */
function createArTd() {
    let td = createTd();
    td.scope = "col"
    td.className = "text-right"
    return td;
}

/**
 * Creating the table row based on sura aya number and the word to mark/highlight it. 
 * 
 * @param {int} sn sura number
 * @param {int} an aya number
 * @param {string} word the searched word string
 */
function createRow(sn, an, word = "") {
    // https://stackoverflow.com/questions/37924104/table-column-sizing -- to follow and fix.
    // array first element = sura number, second= aya number
    // the function be written in much prettier way but whatever.
    // why did not i use class name immedietyl at the set and call? idk? i only used it here.. .
    // TODO- write a generic code and change the functions
    // get the word to parse and mark based on it....
    /**
     * create table row.
     */
    let tr = createTr();
    /**
     * loc stands for location of the word itself.
     */
    let loc;
    /**
     * Check if word is latin or not, 
     * if latin get the query inside it and mark it, then set the view and disable oneline option - since it's only for arabic.  
     * otherwise it will print it normally and enable the oneline option.
     * @see showState
     * @see isLatin
     * @see displayState
     * @see getWordLocation
     */
    if (isLatin(word)) {
        // !isRoot(word)
        loc = getWordLocation(word, suraTr[sn][an], sn, an);
        state3.disabled = true
        showState(1)
        displayState(1)
    } else {
        loc = suraTr[sn][an];
        state3.disabled = ""
    }
    // arabicHeader.style.width = "47%"
    // translationHeader.style.display="table-cell"
    let td = createTd();
    td.className = "tableTranslation"
    let tb = createDropDownSplit(quran.sura[sn].tname + " " + (sn + 1) + ":" + (an + 1));
    //tb.href="https://maeyler.github.io/Iqra3/reader#v="+(sn + 1) + ":" + (an + 1)
    td.innerHTML += tb;
    td.append("\xA0\xA0")
    tr.appendChild(td)
    let tp = createSpan()
    tp.innerHTML = shrink(loc, 100)
    // add here for great function.
    // SpanAddEventListener(tp,sn,an)
    td.appendChild(tp)
    tp.className = "translation"


    let arTd = createArTd();
    arTd.scope = "col"
    arTd.className = "text-right w-50"
    arTd.dir = "rtl"
    // need to change the span thingy as well
    let arP = createArPar();

    // if (/[\u064B-\u0652]/.test(word)) {
    //     loc = getWordLocation(word, suraAr[sn][an],sn,an,1);
    // } else if(isLatin(word)){
    //     loc=getWordLocation(word,suraAr[sn][an],sn,an,1);
    // }else  {
    //     loc  = getWordLocation(word, suraSr[sn][an],sn,an);
    // }

    if (isRoot(word)) {
        let h = markRoot(word.substring(2), suraAr[sn][an], sn, an);
        loc = h;
    } else {

        loc = getWordLocation(word, suraAr[sn][an], sn, an, 1);
    }

    let span = document.createElement("span");
    span.className = "shrinkArabic";
    span.innerHTML = shrink(loc)
    // great function
    // SpanAddEventListener(span,sn,an) //1,word)
    arP.appendChild(span)

    span = document.createElement("span");
    span.className = "fullText";
    span.innerHTML = loc
    // great function
    // SpanAddEventListener(span,sn,an)//,1,word)
    arP.appendChild(span)

    // TODO: if oneline: add controler

    let arB = createDropDownSplit(quran.sura[sn].name + " " + (sn + 1) + ":" + (an + 1), 1);
    //arB.href="https://maeyler.github.io/Iqra3/reader#v="+(sn + 1) + ":" + (an + 1)



    arTd.innerHTML += arB;
    arTd.append("\xA0\xA0")
    arTd.appendChild(arP)

    tr.appendChild(arTd)

    return tr;
}

function markRoot(root, aya, sn, an) {
    // await readExternal("https://raw.githubusercontent.com/maeyler/Iqra3/master/data/words.txt",rootsMap,readRoots)
    let words = rootsMap.get(root);
    words = words.map(e =>
        toArabic(e)
    )
    return aya.split(" ").map(e => {
        if (words.includes(e)) {
            return `<great onclick="openWithBuck(` + sn + `,` + an + `,this,` + 1 + `)"> ${e}</great>`
        } else {
            return e;
        }
    }).join(" ");

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

/**
 * Create the string of searched word based on array indexes with the highlight  - HTML tag great.
 * @param {string} word the searched word
 * @param {string} aya full aya
 * @param {number} sn sura number
 * @param {number} an aya number
 * @param {number} cnt to check if need to translate to buckwalter or not...
 * @returns the aya highlighting the serached word.
 * TODO: refactor and check if we really need count? 
 * @see normlisation
 * @see subArrayIndexes
 * 
 */
function getWordLocation(word, aya, sn, an, cnt) {
    // TODO: change to proper html
    // TODO: normilsation should be here i guess...
    let normAya = normlisation(aya).toLowerCase().split(" ");;
    let normWord = normlisation(word).toLowerCase().split(" ");
    let index = subArrayIndexes(normAya, normWord).reverse();
    aya = aya.split(" ");
    for (let loc of index) {
        aya.splice(loc + normWord.length, 0, `</great>`)
        aya.splice(loc, 0, `<great onclick="openWithBuck(` + sn + `,` + an + `,this,` + cnt + `)">`);
    }
    // let regx = RegExp(word,"gi");
    //  event on click 
    // return aya.replace(regx, `<great onclick="openWithBuck(`+sn+`,`+an+`,'`+word+`',`+cnt+`)">$&</great>`)
    return aya.join(" ")
}

function subArrayIndexes(master, sub) {
    //  inspiration from, Jaimin Patel's comment: https://stackoverflow.com/questions/34151834/javascript-array-contains-includes-sub-array

    //collect all master indexes matching first element of sub-array
    let matched_index = allOccurenceSub(master, sub[0])
    try {
        for (let index of matched_index) {
            for (let [j, element] of sub.entries()) {
                let masterWord = master[j + index];
                if (!masterWord || !masterWord.includes(element)) {
                    matched_index = removeElement(matched_index, index)
                    break;
                }
            }
        }
    } catch (error) {
        console.error(error, matched_index)
    }

    return matched_index;
}

function removeElement(arr, value) {
    // https://love2dev.com/blog/javascript-remove-from-array/
    return arr.filter(function (ele) {
        return ele != value;
    });

}

function allOccurence(array, element) {
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

function allOccurenceSub(array, element) {
    let indices = [];
    array.forEach(function (item, index) {
        // localeCompare to use.
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
function SpanAddEventListener(span, sn, an, cnt, word) {
    // TOD: check why it did not work for arabic, but worked well for English!! 
    // its over annoying! 
    if (span.children[0] !== undefined) {
        let cv = (sn + 1) + ":" + (an + 1);
        // if(cnt) cv += "&w=" + toBuckwalter(word)+"";
        console.log("event listern added to", span.children[0].innerText)
        // span.children[0].onclick=function (){console.log("hello")}
        span.children[0].addEventListener("click", function (e) {
            console.log("clicked")
            openIqra(cv)
        });
    }
    // TODO: bug at أَضَآءَتْ  -- need to fix :( -- Still not working in Iqra... need to check.
}

function openWithBuck(sn, an, word, cnt) {
    let cv = (sn + 1) + ":" + (an + 1);
    // console.log(word)
    word = word.innerText;
    // console.log(word)
    // word = word.split(" ")[0]
    if (cnt) cv += "&w=" + toBuckwalter(word) + "";
    openIqra(cv);
}

function shrink(text, number = 5) {
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
    let searchQue = document.getElementById("searchQue")
    if (!!searchQue) {
        number = number + (searchQue.value.split(" ").length);
    }
    text = text.split(" ");
    let index = text.findIndex(e => e.includes("<great"))
    let endIndex = text.findIndex(e => e.includes("</great>"))
    if (text.length <= number) {
        return text.join(" ")
    }
    if (index < 0) {
        return text.join(" ")
    }
    // let pre=index-number/2 ,post =endIndex+number/2 
    let post = text.length,
        pre = index - 3;
    if (pre < 0) {
        return text.slice(0, post).join(" ");
    }
    if (post > text.length) {
        return text.slice(pre + (text.length - post)).join(" ");
    }
    //console.log(text.slice(pre,post).length)
    return text.slice(pre, post).join(" ");
}
let dataArr, wordCt;
// arr is lsit of aya and sura, searched word.
function createTable(arr, word) {
    if (arr.length == 0) { document.getElementById("PaginationMenu").hidden = true; return }; // empty array. TODO: can make a message for the user to show that its not found
    dataArr = arr;
    wordCt = word;
    let message = arr.length
    dTable.hidden = false
    if (message == 0) {
        message = "bulunmadi"
        dTable.hidden = "true"
        console.log(dTable, "Data table")
    }
    finderMessage.innerText = ""
    wordNumber.innerText = message//+ parseInt(wordNumber.innerText)
    document.title += " " + wordNumber.innerText;
    // arr.forEach((e, i) => {
    //     if (i > 100) { console.log(i); return; } else {
    //         element.appendChild(createRow(e[0], e[1], word))
    //     }
    // });
    setVersePerPage()
}

// wordLst[1].size --> get number of page   s


/**
 * A function to go a dsired page and show the verese of that page.
 * 
 * Need refactoring. seperate of concern and do not call same function twice.
 * 
 * @param {int} num the desired page number
 */
function paginationControl(num) {
    /**
     * Clear table
     */
    let element = document.getElementById("dTable").getElementsByTagName('tbody')[0];
    element.innerHTML = ""
    /**
     * Get the search pages number - check get pages functions to understand it.
     */
    let numberOfPages = getPages()
    /**
     * Check the desired page feasability. 
     * if less then zero then we should show the first page.
     * if its larger than the results length then it will show the last number of pages.
     * else it will be used without modification
     */
    if (num < 0) dataIndex = 0;
    else if (num > numberOfPages) dataIndex = numberOfPages;
    else dataIndex = num;
    /**
     * Set the chosen page view for the user, added one to show numbers starting from 1 not 0.
     */
    let chosenPageButton = document.getElementById("choosenPage")
    chosenPageButton.value = dataIndex + 1;
    /** min is the number of first verse to show based on the chosen page, which it should be the desiredPage multiplied by the number of verses in a page. 
     * if the minum number is 
     */
    // dataIndex = num <= 0 ? 0 : (Math.ceil(dataArr.length / verseInPage) <= num) ? num : Math.ceil(dataArr.length / verseInPage);
    let min = dataIndex * verseInPage >= dataArr.length ? dataArr.length - dataArr.length % verseInPage : dataIndex * verseInPage;
    /** max is the number of the last verse to show based on the minimum number which it's min+desired number of verses. But needed small modification to overcome errors */
    let max = min + verseInPage >= dataArr.length ? dataArr.length : min + verseInPage;
    /** if any error occuered then we can se them to defaults, the eror occuers cause of one page */
    if (isNaN(min)) min = 0;
    if (isNaN(max)) max = dataArr.length;
    /** show the results.  */
    for (let i = min; i < max; i++) {
        element.appendChild(createRow(dataArr[i][0], dataArr[i][1], wordCt))
    }
    /**start the needed functions */
    addShowFunction();
    menuFn();
    initPagination();
    /** if pages is less than one then we dont have to show it. */
    if (getPages() < 1) {
        document.getElementById("PaginationMenu").hidden = true
    } else {
        document.getElementById("PaginationMenu").hidden = false
    }
}

function paginationNext() {
    paginationControl(dataIndex + 1)
}

/**
 * Get the search pages number, the pages number is 
 * number of results divided on the number of verses in a page. 
 * 
 * The return result is a real number
 * 
 * (results.length/desiredVerses)
 * 
 */
function getPages() {
    return Math.ceil(dataArr.length / verseInPage) - 1;
}

function paginationPrev() {
    paginationControl(dataIndex - 1)
}

function paginationFirst() {
    paginationControl(0)
}

function paginationLast() {
    paginationControl(getPages())
}

function getFontType() {
    let fontType = document.getElementById("fontType").value
    getCSSRule(".arabic").style.fontFamily = `${fontType}, serif`
    updateSettings("fontType", fontType)
}

function setFontType(type){
    document.getElementById("fontType").value =type
    getFontType()
}

function setVersePerPage(mode, verse) {
    if (mode == 0) dataIndex = 0; // if dataindex it will go to the last page, now it will reset.
    let controller = document.getElementById("dataAmount").value
    if (verse) {
        document.getElementById("dataAmount").value = verse
        controller = verse;
    }
    let lastPageButton = document.getElementById("lastPage")
    verseInPage = parseInt(controller);
    if (dataArr) {
        lastPageButton.innerText = getPages() + 1;
        paginationControl(dataIndex)
    }
    updateSettings("verse_per_page", controller)
    return controller
}

function paginationSet() {
    let chosenPageButton = document.getElementById("choosenPage")
    paginationControl(chosenPageButton.value - 1)
}

function initPagination() {
    let controller = document.getElementById("dataAmount")
    controller.addEventListener("change", setVersePerPage)

    let lastPageButton = document.getElementById("lastPage")
    lastPageButton.addEventListener("click", paginationLast)

    let chosenPageButton = document.getElementById("choosenPage")
    chosenPageButton.addEventListener("change", paginationSet)

    let firstPageButton = document.getElementById("firstPage")
    firstPageButton.addEventListener("click", paginationFirst)

    let pagePrevButton = document.getElementById("pagePrev")
    pagePrevButton.addEventListener("click", paginationPrev)

    let pageNextButton = document.getElementById("pageNext")
    pageNextButton.addEventListener("click", paginationNext)
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
            let aya = arr[i][j].toLowerCase();
            aya = aya.normalize();
            word = word.normalize();
            // aya = normlisation(aya)
            // working :) -- the insan error is caused by the RegEx
            let locs = removeOddChar(aya).indexOf(removeOddChar(word.toLowerCase()))
            if (locs !== -1) {
                loc.push([i, j, locs])
            }
        }
    }
    return loc;
}

function removeOddChar(string) {
    let oddChar = `İ`.toLowerCase()[1]
    let h = new RegExp(oddChar, "ig")
    return string.replace(h, "");
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

function removePunctions(word) {
    return word.replace(/(~|`|!|@|#|$|%|^|&|\*|\(|\)|{|}|\[|\]|;|:|\"|'|<|,|\.|>|\?|\/|\\|\||-|_|\+|=)/g, "")
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

function isLatin(word) {
    // /([A-Za-z])+/
    // /^[A-Za-z0-9]*/i
    if (isRoot(word)) return false;
    let regXenglish = /[A-Za-z0-9]+/
    let h = new RegExp(regXenglish, "ig")
    if (h.test(word)) {
        SearchBarLTR()
        return true
    }
    SearchBarRTL();
    return false
}

function SearchBarLTR() {

    searchQue.dir = "LTR"
    searchQue.className = "form-control translation"


}

function SearchBarRTL() {
    searchQue.className = "arabic form-control text-right";
    searchQue.dir = "rtl"
}

function find(word = "") {
    if (word.length <= 0) return;
    if (isRoot(word)) return;
    if (isLatin(word)) {
        wordLst = nextWordList(word, suraTr)
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

function findAction(word = "") {
    let [h, type, arabic] = readHash()
    if (word.length <= 0) return;
    if (searchQue.value == arabic) return;
    clearTable();
    // already triggered when the hash changed, they are connected together 
    // serachedWordTable(word);
    setHash(word)
}



function isRoot(word) {
    return word.includes(";") || word.includes("=");
}

function mujamList(rl) {
    let root = rl.split(";")[0];
    let list = rl.split(";")[1].split(",");
    let wordLst = list.map(e => [Number(e.split(":")[0] - 1), Number(e.split(":")[1] - 1)])
    return [root, wordLst];
}

function serachedWordTable(word) {
    // submitData(word);
    word = word.trim();
    // word = normlisation(word)
    if (isRoot(word)) {
        [word, wordLst] = mujamList(word)
        wordLst[1] = [...wordLst];
    }
    dTable.hidden = "true"
    finderMessage.innerText = "Bulunmadı"
    document.title = "Kuran Rehber: Finder - " + word;
    wordNumber.innerText = "Bulunmadı";
    let words = word.split("+")
    words.forEach(e => {
        word = e;
        // timer("Results in ", () => find(word))
        find(word)
        createTable([...wordLst[1]], word)
    });
    menuFn();
    removeElementByID("postID")

}
/**
 * not active anymore... removed since version 1.11
 * @param {*} word 
 * @param {*} message 
 * @param {*} email 
 */
function submitData(word, message = "no", email = "anon") {
    // let link = "https://docs.google.com/forms/d/e/1FAIpQLSd7o_vx8kanr371NqY3ylGAmDHrht6APYLFg0g6rhJVDC2zdA/formResponse?usp=pp_url&entry.841595716="
    // let link =  "https://docs.google.com/forms/d/e/1FAIpQLSd7o_vx8kanr371NqY3ylGAmDHrht6APYLFg0g6rhJVDC2zdA/formResponse?usp=pp_url&entry.364753965=email&entry.841595716=word&entry.1093518355=feedBackMessage&entry.2043746972=screen&entry.562870159=model&entry.709022821=settings&entry.1881015334=navigator"
    let link = "https://docs.google.com/forms/d/e/1FAIpQLSd7o_vx8kanr371NqY3ylGAmDHrht6APYLFg0g6rhJVDC2zdA/formResponse?usp=pp_url&entry.364753965=email&entry.841595716=word&entry.1093518355=feedBackMessage&entry.2043746972=screen&entry.562870159=model&entry.709022821=settings&entry.1881015334=navigator"
    link = link.replace("word", word);
    link = link.replace("feedBackMessage", message);
    link = link.replace("screen", screen.width + " x " + screen.height);
    link = link.replace("model", navigator.userAgent)
    link = link.replace("settings", JSON.stringify(settings))
    link = link.replace("email", email)

    link = link.replace("navigator", navigatorToString())
    link = decodeURI(link)
    let submit = '&submit=Submit';
    link = link + submit;
    let post = document.createElement("iframe")
    post.src = link;
    post.id = "postID"
    post.hidden = true;
    document.body.appendChild(post)

}

function navigatorToString() {
    var _navigator = {};
    for (var i in navigator) _navigator[i] = navigator[i];
    return JSON.stringify(_navigator);
}

function removeElementByID(elementID) {
    let el = document.getElementById(elementID);
    while (el != null) {
        el.parentNode.removeChild(el);
        el = document.getElementById(elementID);
    }

}

function submitFeedBack() {
    let email = inputEmail.value;
    let msg = feedBackMessage.value;
    if (email.length <= 2) {
        email = "anon"
    }
    if (msg.length <= 2) {
        msg = "empty";
    }
    submitData(searchQue.value, msg, email)
    $('#FeedBackModal').modal('hide');

}

function cancelFeedBack() {
    submitData(searchQue.value, "FormCancelled", "FormCancelled")

}

function findActionH(word) {
    clearTable();
    word = decodeURI(word);
    searchQue.value = word
    serachedWordTable(word);
}

function sugOnKeyUp(word) {
    let sugwrd = word.split("+")
    word = sugwrd[sugwrd.length - 1]
    find(word)
    addSuggestions([...wordLst[0]]);
}


function addSuggestions(wordList) {
    wordList = wordList.slice(0, 11)
    suggestions.innerHTML = "";
    let opt;
    let html;
    wordList.forEach(e => {
        //only check if its the same ... without searchQue value it would not work.. .imporatnt 
        opt = document.createElement("option")
        opt.className = "arabic"
        opt.value = searchQue.value + "" + e
        // suggestions.appendChild(opt)
        html += opt.outerHTML;
    })
    suggestions.innerHTML = html;

}

// function rootToWords(rootB) {
//     return rootsMap.get((decodeURI(rootB))).map(e => toArabic(e)).join("+")
// }
function rootToFinder(root) {
    // wordCt = root;
    // searchQue.value = root
    let refSet = new Set()
    let refs = getReferences(toArabic(root.slice(2)));
    refs.forEach(e => refSet.add(e.index));
    let rootArr = [];
    refSet.forEach(e => {
        let [c, v] = toCV(e)
        rootArr.push([c - 1, v - 1])
    })
    // wordLst[0] = [];
    // wordLst[1] = rootArr
    createTable(rootArr, root)
}
function readHash() {
    let h = decodeURI(location.hash);
    // console.log("hashChanged...")
    let type = h[1];
    h = h.slice(3);
    let arabic = h.replace(/%20/g, " ");
    return [h, type, arabic]
}

function hashChanged() {
    let [h, type, arabic] = readHash()
    switch (type) {
        case "b":
            arabic = toArabic(decodeURI(arabic));
            break;
        case "w":
            break;
        case "t":
            break;
        case "r":
            // let arr=  ;
            // arabic = rootToWords(arabic)
            document.title = "R=" + arabic;
            rootToFinder(type + "=" + arabic);
            return;
        default:
            console.log(h, type, arabic, "BROKEN")
            findAction('بسم الله')
            return;
    }

    // arabic=toArabic(decodeURI(arabic)); // move the decode function to BuckWalter code... better approach
    if (arabic.length <= 0) {
        console.log("arabic length", arabic.length)
        return;
    }
    if (suraTr == undefined) {
        console.log("suraTr undefeined")
        return
    }; // a little lovely bug.. faster way to solve it lol
    // if (arabic == searchQue.value) {
    //     console.log("Search value and arabic are equal")
    //     return};
    findActionH(arabic); //toArabicLetters(arabic));
}

function setHash(word, type) {
    e = word;
    if (e.split("+").length !== 1) return;
    if (!isLatin(e)) {
        e = "b=" + toBuckwalter(e);
    } else {
        e = "t=" + e;
    }
    if (type == "r") e = "r=" + toBuckwalter(word);
    location.hash = e //toBuckwalter(e);
    // console.trace();
}
/**
 * Ininitlise finder by adding serachbar keyup event (onsubmit)
 * Adding the hash change event to check the hash and control it. 
 * check the settings avaialability on local storage if available --> load()
 * if not then initilise local storage. 
 *   graph TD
      initReader --> b[Add serach bar enter event]
      b--> c[hashControl/event added]
      c --> s{settings Available}
      s-->|no| initLocalStorage
      s-->|yes| loadSettings
 */
async function initFinder() {
    let h = decodeURI(location.hash);
    let type = h[1];
    if (type == "r") {
        await loadMujam();
    }
    console.log("Finder started...")
    searchQue.addEventListener("keyup", function (event) {
        if (event.keyCode === 13) {
            event.preventDefault();
            findAction(searchQue.value)
        }
    });
    window.addEventListener("hashchange", hashChanged);
    if (storageAvailable("localStorage")) {
        if (window.localStorage.settings === undefined) {
            initLocalStorage();
            await loadTransF();
        } else {
            await loadSettings()
        }
    }
    hashChanged();
    menuFn();
    initPagination();
    if (type != "r") {
        await loadMujam();
    }
}
async function loadMujam() {
    let date = new Date()
    let p = await initMujam();
    console.log("Mujam load time", new Date() - date)
    return p
}


function changeColour(col) {
    changeGreatColour(col)
    updateSettings("colour", col)
}

function changeGreatColour(col) {
    document.getElementById("greatColour").value = col;
    getCSSRule("great").style.backgroundColor = col;
}

function setFontSize(language, size, rule, update) {
    if (!rule) {
        var { rule, update } = getFontRule(language)
    }
    rule.style.fontSize = size + "px"

    updateSettings(update, size)
}
function getFontRule(language) {
    //console.log(language,size)
    let rule, update = "translation";
    if (language == "arabic") {
        //.arabic
        rule = getCSSRule(".arabic");
        update = "arabic"
    } else {
        //.translation 
        rule = getCSSRule(".translation")
    }
    return { rule, update }
}
function changeFont(language, size) {
    let { rule, update } = getFontRule(language)
    let old = parseInt(rule.style.fontSize);
    setFontSize(update, old + size, rule, update)
}
function setFontToDefault(language, size) {
    let { rule, update } = getFontRule(language)
    setFontSize(update, size, rule, update)
}

async function loadTransF(n = 3) {
    await loadTrans(n.toString())
    // clearTable();
    // toCheck...
    // if (!location.hash.includes("r=")) findAction(searchQue.value);
    // else hashChanged();
    // can be added from the url? - or even modified to be more generic by having data collection for it to create the whole thingy, like the tefsir and even the list... 
    // will need an object of the link and name of each tefsir, to get them from there, and parse them.
    // the object will be looped through to create the select option list, then would be used to parse the name and even the data.
    // maybe better approach to manage them from one place, when you change the object you will have to change the data as a whole. TODO
    THtext.innerText = getTefsirText(n) + "\u2002";
    findActionH(searchQue.value)
    updateSettings("source", n)
    langSpeechSettings()
}

function getTefsirText(n) {
    let tefsir = ["تفسير الجلالين", "تفسير الميسر", "Türkçe: Diyanet Meali", "English: Ahmed Ali", "Türkçe: Elmalılı Hamdi Yazır", "English: Abdullah Yusuf Ali", "French"]
    return tefsir[n - 1];
}

function openMeali(cv) {
    cv = cv.split(":");
    let c = cv[0],
        v = cv[1];
    let link = `http://kuranmeali.com/AyetKarsilastirma.php?sure=${c}&ayet=${v}`
    window.open(link, "meali")
    lastOne = "meal";
    warpLast()

}
// cv = chapter verses C:V 
function openIqra(cv) {
    let link = "/Kuran/reader.html#v=" + cv;
    window.open(link, "iqra")
    lastOne = "iqra";
    warpLast()
}

function openSimi(cv) {
    let link = "/Rehber/simi#" + cv;
    window.open(link, "simi")
    lastOne = "simi";
    warpLast()
}

function openQuran(cv) {
    cv = cv.split(":");
    let c = cv[0],
        v = cv[1];
    let link = `https://quran.com/${c}/${v}`
    window.open(link, "Quran")
    lastOne = "quran";
    warpLast()
}

function openCorpus(cv) {
    cv = cv.split(":");
    let c = cv[0],
        v = cv[1];
    let link = `http://corpus.quran.com/translation.jsp?chapter=${c}&verse=${v}`
    window.open(link, "Corpus")
    lastOne = "corpus";
    warpLast()
}

function createDropDownSplit(suraCV, control) {
    // may change it to javascript later, but this is much easier LOL.
    // NEED TO reFactor.
    let cv = suraCV.split(" ");
    cv = cv[cv.length - 1]
    let x = `
    <!-- Example split danger button -->
<div class="btn-group">
  <button id="showHideFull" type="button" class="btn badge badge-light align-text-bottom dropdown-toggle-split" aria-expanded="false" onlcick="toggleShow('test')">+</button>
  <button type="button" class="btn badge badge-light align-text-bottom" onclick="lastOneF('${cv}')">${suraCV}</button>
  <button type="button" class="btn badge badge-light align-text-bottom dropdown-toggle dropdown-toggle-split" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
    <span class="sr-only">Toggle Dropdown</span>
  </button>
  <div class="dropdown-menu">
    <button class="dropdown-item" onclick="openCorpus('${cv}')">Corpus</button>
    <button class="dropdown-item" onclick="openQuran('${cv}')">Quran</button>
    <button class="dropdown-item" onclick="openMeali('${cv}')">Meali</button>
    <div class="dropdown-divider"></div>
    <button class="dropdown-item" onclick="openIqra('${cv}')">Iqra</button>
  </div>
</div><br>
`
    if (control) {
        x = `
    <!-- Example split danger button -->
<div class="btn-group">
<button type="button" class="btn badge badge-light align-text-bottom dropdown-toggle dropdown-toggle-split" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
<span class="sr-only">Toggle Dropdown</span>
</button>
  <button type="button" class="btn badge badge-light align-text-bottom" onclick="lastOneF('${cv}')">${suraCV}</button>
 
  <button id="showHideFull" type="button" class="btn badge badge-light align-text-bottom dropdown-toggle-split" aria-expanded="false" onlcick="toggleShow('test')">+</button>

  <div class="dropdown-menu">
    <button class="dropdown-item" onclick="openCorpus('${cv}')">Corpus</button>
    <button class="dropdown-item" onclick="openQuran('${cv}')">Quran</button>
    <button class="dropdown-item" onclick="openMeali('${cv}')">Meali</button>
    <div class="dropdown-divider"></div>
    <button class="dropdown-item" onclick="openIqra('${cv}')">Iqra</button>
    <button class="dropdown-item" onclick="openSimi('${cv}')">Simi</button>

  </div>    
</div><br>
`
    }
    return x;
}

function toggleShow(e) {
    // $0 this element --> for the split button made in createDropDownSplit
    // .parentElement btnGroup
    // .parentElement td
    // .children[2] spanArabic
    // .children[0] 
    // children 0 = ShrinkedArabic
    // children 1 = full text
    let fullText = e.parentElement.parentElement.children[2].children[0];
    let shrinked = e.parentElement.parentElement.children[2].children[1];
    switch (e.innerText) {
        case "+":
            e.innerText = "-";
            fullText.style.display = "none"
            shrinked.style.display = "table-cell"
            break;
        case "-":
            e.innerText = "+";
            shrinked.style.display = "none"
            fullText.style.display = "table-cell"
            break;
    }

}
/**
 * Rest all the show/hide buttons and get the original CSS style. 
 * @param {html} e button
 */
function resetTD(e) {
    if (e.parentElement.parentElement.children[2].className == "translation")
        return
    let fullText = e.parentElement.parentElement.children[2].children[0];
    let shrinked = e.parentElement.parentElement.children[2].children[1];
    e.innerText = "+";
    fullText.style.display = "";
    shrinked.style.display = "";
}
/**
 * add @see toggleShow function to the whole showHideFull elements. 
 */
function addShowFunction() {
    if (typeof showHideFull !== "undefined") {
        for (let x of showHideFull) {
            x.onclick = function () { toggleShow(x) }
        }
    }
}

function toggleOneline() {
    // Approach two: create and delete the whole page, you got the data in wordlst already... 
    //  does it worth to loop it? or would it better if we have had the CSS since its easier.
    // let htmlText;
    // for (let el of document.querySelectorAll("span.arabic") ){
    //     htmlText=  el.innerHTML;
    //     el.innerHTML = shrink(htmlText)
    // }
    // oneline =!oneline;
    // oneLineShow(oneline)
    updateSettings("oneline", oneline)
    // go to check this for future fix:https://stackoverflow.com/questions/4602141/variable-name-as-a-string-in-javascript
}
/**
 * set the display state and show the table based on it.
 * @param {number} num display state of the table 
 */
function displayState(num) {
    /**
     * 1: for showing all 
     * 2: for showing only arabic
     * 3: for showing only arabic online mode.
     */
    updateSettings("dstate", num)


    switch (num) {
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

function translationStyle(text) {
    getCSSRule(".tableTranslation").style.display = text
    // go to check this for future fix:https://stackoverflow.com/questions/4602141/variable-name-as-a-string-in-javascript
}

function oneLineShow(bool) {
    if (typeof showHideFull !== "undefined") {
        checkButton();
    }


    oneline = bool;
    if (bool) {
        fullTextStyle("none")
        shrinkStyle("table-cell");
        showHideButtonStyle("")
    } else {
        shrinkStyle("none")
        fullTextStyle("table-cell");
        showHideButtonStyle("none")
    }
    if (typeof variable !== 'undefined') {
        updateSettings("oneline", oneline)
    }
}
/**
 * Reset the showHideFull button which is the one near the open last one to showing as + smybol
 */
function checkButton() {
    for (let x of showHideFull) {
        //    if(x.innerText == "-"){
        //    x.click();
        resetTD(x)
        //    }
    }
    // other approach: document.querySelectorAll("span.fullText") 
}

function fullTextStyle(text) {
    getCSSRule(".fullText").style.display = text;

}

function shrinkStyle(text) {
    getCSSRule(".shrinkArabic").style.display = text;
}

function showHideButtonStyle(text) {
    getCSSRule("#showHideFull").style.display = text;
}
// Local storage code.  
// {@link http://www.google.com|Google}
// source: https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API/Using_the_Web_Storage_API
function storageAvailable(type) {
    var storage;
    try {
        storage = window[type];
        var x = '__storage_test__';
        storage.setItem(x, x);
        storage.removeItem(x);
        return true;
    } catch (e) {
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

function normlisation(text) {
    // TODO: add rahman Case, adam case.
    text = text.replace(/[\u0670-\u0671]/gm, "ا")
    text = text.replace(/[\u064B-\ufd3f]/gm, '');
    text = text.replace(/\u0629/gm, "ه");
    text = text.replace(/\u0623/gm, "ا");
    text = text.replace(/\u0625/gm, "ا");
    return text;

}

function initLocalStorage() {
    let keys = ["arabic", "translation", "colour", "source", "oneline", "lastOne", "lang", "verse_per_page", "fontType"]
    let arabicSize = parseInt(getCSSRule(".arabic").style.fontSize);
    let translationSize = parseInt(getCSSRule(".translation").style.fontSize);
    let colour = "#ffff00";
    let values = [arabicSize, translationSize, colour, 5, oneline, lastOne, "1", 10, "Zekr"]
    for (let i = 0; i < keys.length; i++) {
        updateSettings(keys[i], values[i])
    }
}

function updateSettings(target, value) {
    settings[target] = value;
    updateSettingsStorage()
}

function warpLast() {
    updateSettings("lastOne", lastOne)
}

function updateSettingsStorage() {
    if (storageAvailable('localStorage')) {
        localStorage.setItem('settings', JSON.stringify(settings))
    }
}

function lastOneF(cv) {
    switch (lastOne) {
        case "iqra":
            openIqra(cv)
            break;
        case "meal":
            openMeali(cv)
            break;
        case "quran":
            openQuran(cv)
            break;
        case "corpus":
            openCorpus(cv)
            break;
        case "simi":
            openSimi(cv)
            break;
    }
}

function loadSettings() {
    if (storageAvailable('localStorage')) {
        settings = JSON.parse(localStorage.getItem('settings'))
        changeColour(settings.colour)
        setFontSize("arabic", settings.arabic)
        setFontSize("translation", settings.translation)
        setVersePerPage(undefined, settings.verse_per_page)
        lastOne = settings.lastOne;
        language(settings.lang)
        showState(settings.dstate)
        displayState(settings.dstate)
        setFontType(settings.fontType)
        return loadTransF(settings.source);
    }
}



function showState(state) {
    switch (state) {
        case 1:
            state1.checked = true;
            break;
        case 2:
            state2.checked = true;
            break;
        case 3:
            state3.checked = true;
            break;
    }
}
// Global to be able to cancel :) 
const SR = new webkitSpeechRecognition()

function SearchVoice(language) {
    let speechLang = "tr-TR"
    // TODO: tefsir source is not defined -- check form local storage.
    switch (settings.source) {
        case 3:
        case 5:
            speechLang = "tr-TR"
            break;
        case 1:
        case 2:
            speechLang = "ar-AR"
            break;
        case 4:
        case 6:
            speechLang = "en-EN"
            break;
    }

    function listen(lang) {
        SR.lang = lang ? lang : speechLang; //: "en-EN"; 
        console.log(SR.lang)
        SR.start()
    }

    function getResult(e) {
        let a = e.results[0][0]; //use first result
        $('#speechSettings').modal('hide');
        console.log(a.transcript, a.confidence.toFixed(2))
        searchQue.value = a.transcript;
        findAction(searchQue.value)
        loading.hidden = true;

        // out.innerText = a.transcript; speak()
        // out.style.background = ''
    }

    function error(e) {
        // out.innerText = turk.checked? '[ses yok]' : '[no input]'
        // out.style.background = ''
        loading.hidden = true;
        console.log("error ", e)
    }

    function started() {
        loading.hidden = false;
    }

    function stopped() { loading.hidden = true; };

    SR.onspeechend = SR.stop;
    SR.onsoundend = error
    SR.onresult = getResult;
    SR.onnomatch = error
    SR.onstart = started;
    SR.onstop = stopped;
    listen(language);
}

function speechCancel() {
    SR.abort();
    loading.hidden = true;
}
/**
 * set langauge of the interface. 
 * then it will update the settings and load the language
 * @param {string} val the language value to set.
 * @see updateSettings
 * @see loadLang
 */
function language(val) {
    val = parseInt(val)
    switch (val) {
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
    updateSettings("lang", val)
}
/**
 * Load langugae file and change the UI based on it,
 * used html ID's to change the text and the json file. 
 * @see langSpeechSettings
 */
function loadLang() {
    txtWordFound.innerText = texts.occ;
    fontAr.innerText = texts.font + " " + texts.size;
    txtTrans.innerText = texts.trans + " " + texts.size;
    markColour.innerText = texts.mark + " " + texts.colour;
    settingsModelTitle.innerText = texts.pref;
    txtModelClose.innerText = texts.close;
    state1.labels[0].innerText = texts.show;
    state2.labels[0].innerText = texts.arabic;
    state3.labels[0].innerText = texts.oneLine;
    btnArabic.innerText = texts.arabic;
    btnClose.innerText = texts.close;
    modelVoiceControl.innerText = texts.soundSettings;
    loadText.innerText = texts.listening;
}
/**
 * A seprate langauge laod for speech language since it needed a switch case. 
 * @see loadLang
 */
function langSpeechSettings() {
    switch (settings.source) {
        case 3:
        case 5:
            language(1)
            btnOtherLang.innerText = texts.turkish;
            break;
        case 1:
        case 2:
            language(2)
            btnOtherLang.innerText = texts.arabic;
            break;
        case 4:
        case 6:
            language(3)
            btnOtherLang.innerText = texts.english;
            break;
    }
    loadLang();

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
            case 0: // Search in finder
                findAction(sel)
                break;
            case 1: // google search
                window.open("https://google.com/search?q=" + sel)
                break;
            case 2: // copy 
                navigator.clipboard.writeText(sel)
                    .then(() => { console.log('Panoya:', sel) })
                    .catch(e => { alert('Panoya yazamadım\n' + sel) })
                break;
            case 3: // search for root
                let root = wordToRoot.get(toBuckwalter(sel))
                setHash(toArabic(root), "r")
                // findAction(rootToWords(root))
                break;
        }
        toggleMenu("hide");
    });
    addContextMenu();
}
/**
 * Clear HTML table without touching the headers.
 * https://stackoverflow.com/questions/18333427/how-to-insert-row-in-html-table-body-in-javascript
 * https://www.daniweb.com/programming/web-development/threads/113340/delete-all-rows-from-table-in-javascript
 * https://developer.mozilla.org/en-US/docs/Web/API/Node/removeChild
 */
// TODO: merciful ... bug :( 
// أتقاكم show google thingy.
// TODO: write docs and split the code to more readable style.. 
// bug:la habersiz
// TODO: instead of removing/clearning diactricits( vowels - tashkeel) check if its there then search by another array.
