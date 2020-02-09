const DATA_URL = "https://maeyler.github.io/Iqra3/data/"; //in maeyler/Iqra3/code/common.js

/**
 * Roots map
 */
let rootsMap = new Map();
let wordToRoot = new Map();

function readRoots(text, target) {
    text = text.split("\n")
    let root;
    text.forEach(e => {
        e = e.split(" ")
        root = e.shift();
        target.set(root, e)
        for (let w of e) wordToRoot.set(w, root)

    })
}

function initMujam(){
    return readExternal("https://raw.githubusercontent.com/maeyler/Iqra3/master/data/words.txt", rootsMap, readRoots);

}
