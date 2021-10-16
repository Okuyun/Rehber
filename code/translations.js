// The file is dependece on the script.js file. Both of them need to be loaded before this file.
// Language: javascript
// Path: code\translations.js
let tefsir = [
    "تفسير الجلالين", "تفسير الميسر", "Türkçe: Diyanet Meali", "English: Ahmed Ali", "Türkçe: Elmalılı Hamdi Yazır", "English: Abdullah Yusuf Ali", "French"
,"English: Pickthall",
"Türkçe: Muhammet Abay",
    "German: Zaidan",
]

/**
 * Load translation and set the translation array to use it in the future.
 * 
 * @param {Number} choosen The choosen number of selected translatio
 */
 let choosenGen;

 function loadTrans(choosen = 1) {
     choosenGen = choosen
     suraTr = []
     let translate = translations[choosen].path;
     return readExternal(dataUrl + translate, suraTr, dataToArray)
 }

function populateTranslationMenu(){
    let menu = document.getElementById("translationMenu");
    let template = document.querySelector('#translationButton');
    translations.forEach( (translation, index) => {
        if(index < 2) return;
        let clone = template.content.cloneNode(true);
        let button = clone.querySelector('button');
        button.innerHTML = translation.name;
        button.setAttribute("onclick", "loadTransF('"+index+"')");
        menu.appendChild(clone);
    })

}

populateTranslationMenu();