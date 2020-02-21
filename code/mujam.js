const DATA_URL = "https://maeyler.github.io/Iqra3/data/"; //in maeyler/Iqra3/code/common.js

/**
 * Roots map
 */
let rootsMap = new Map();
let wordToRoot = new Map();
let rootToCounts = new Map();

function readRoots(text, target) {
    text = text.split("\n")
    let root;
    text.forEach(e => {
        e = e.split(" ")
        root = e.shift();
        target.set(root, e)
        rootToCounts.set(root, e.length);
        for (let w of e) wordToRoot.set(w, root)

    })
}

function initMujam() {
    return readExternal("https://raw.githubusercontent.com/maeyler/Iqra3/master/data/words.txt", rootsMap, readRoots);
}
let wRefs = [];
/**
 * Make wRefs for specified roots
 * 
 * @param {Array} roots Array to be displayed
 */
function parseRoots(roots) { //root array in Arabic
    wRefs = []
    let [word, ...rest] = roots
    let i1 = getReferences(word) //combined
    if (rest) { //multiple roots, single RefSet
        for (let r of rest) {
            let i2 = getReferences(r)
                //find intersection
            i1 = i1.filter(v => //i2.includes(v)
                i2.find(x => x.index == v.index))
        }
        word = roots.map(x => rootToCounts.get(x)).join(' + ')
    }
    let set = new RefSet(word, i1)
    if (rest.length > 0) wRefs = [set]
    return set
}

/**
 * calculate the index array for given root.
 * 
 * @param {string} root to be displayed
 * @returns {VerseRef[]} Array of VerseRef's
 */
function getReferences(root) {
    let cnt = rootToCounts.get(root);
    let refA = []
    for (let word of rootToWords.get(cnt)) {
        let enc = wordToRefs.get(word)
        let set = RefSet.fromEncoded(word, enc)
        for (let v of set.list) refA.push(v)
            //refA.concat(set.list)  concat returns another Array
        wRefs.push(set)
    }
    return refA.sort((a, b) => (a.index - b.index))
}