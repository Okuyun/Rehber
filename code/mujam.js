// const DATA_URL = "https://maeyler.github.io/Iqra3/data/"; //in maeyler/Iqra3/code/common.js

/**
 * Roots map
 */
let rootsMap = new Map();
let wordToRoot = new Map();
let rootToCounts = new Map();
const wordToRefs = new Map();
/**
 * A map holds the letters and its roots.
 * set at report2 @see report2
 */
const letterToRoots = new Map();

const rootToWords = new Map();

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

async function initMujam() {
    await initMAE();
    await readExternal("https://okuyun.github.io/Kuran/data/words.txt", rootsMap, readRoots);
    return new Promise((resolve, reject) => { resolve('Success!'); })
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
    if (!rootToWords) setTimeout(() => { console.log("World!"); }, 2000);

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

async function initMAE() {
    //showSelections(false);
    sajda = [175, 250, 271, 292, 308, 333, 364, 378, 415, 453, 479, 527, 589, 597, 999]
    let letters = [];
    for (let c = 1575; c < 1609; c++) letters.push(String.fromCharCode(c));
    try {
        await readData();
    } catch (err) {
        console.error("Could not read it", err)
    }
    if (!localStorage.topics)
        localStorage.topics = 'Secde=1w82bu2i62ne2s430l38z3gg3pq42y4a74qm5k15q5'
    return new Promise(function (resolve, reject) {
        resolve('Success!');
    })
}

async function readData() {
    //const DATA_URL = "https://maeyler.github.io/Iqra3/data/" in common.js
    const r = await fetch(DATA_URL + "refs.txt");
    const t = await r.text();
    return report2(t); //text
}

function report2(t) {
    function convert(s) {
        let [w, n] = s.split(' ')
        let a = toArabic(w)
        //convert space to em-space " "
        return [a, a + EM_SPACE + n]
    }
    let line = t.split('\n')
    let m = line.length - 1
    console.log(t.length + " chars " + m + " lines");
    let i = 0;
    while (i < m) { //for each line
        let [root, number] = convert(line[i])
        rootToCounts.set(root, number);
        let j = i + 1
        let list = []
        while (j < m) {
            let [xxx, s] = convert(line[j])
            let k = s.indexOf('\t')
            if (k <= 0) break;
            let word = s.substring(0, k)
            let refs = s.substring(k + 1)
            wordToRefs.set(word, refs)
            list.push(word);
            j++;
        }
        i = j;
        list.sort();
        let ch = root[0]; //first char
        let x = letterToRoots.get(ch);
        if (x) x.push(number);
        else letterToRoots.set(ch, [number]);
        rootToWords.set(number, list);
    }
    let keys = [...letterToRoots.keys()];
    // sort the root list for each letter
    for (let k of keys) letterToRoots.get(k).sort()
    // sort and set menu1 (letters)
    return new Promise(function (resolve, reject) {
        resolve('Success!');
    })
}
