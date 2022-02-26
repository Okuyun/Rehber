// The file is dependece on the script.js file. Both of them need to be loaded before this file.
// Language: javascript
// Path: code\translations.js

/* const tefsir = [ //not used
    "تفسير الجلالين", "تفسير الميسر", "Türkçe: Diyanet Meali", "English: Ahmed Ali", "Türkçe: Elmalılı Hamdi Yazır", "English: Abdullah Yusuf Ali", "French"
    ,"English: Pickthall", "Türkçe: Muhammet Abay", "German: Zaidan",
] */
const translations = [ //this order is fixed
    { id:"aruthman", path: "quran-uthmani.txt", name: "Arabic Uthmani" },
    { id:"arclean", path: "quran-simple-clean.txt", name: "Arabic Clean" },
    { id:"tfJa", path: "ar.jalalayn.txt", name:"تفسير الجلالين" },
    { id:"trTr", path: "tr.diyanet.txt", name: "Türkçe: Diyanet (1987)" },
    { id:"enAh", path: "en.ahmedali.txt", name: "English: Ahmed Ali" },
    { id:"trEl", path: "tr.yazir.txt", name: "Türkçe: Elmalılı Yazır" },
    { id:"enYu", path: "en.yusufali.txt", name: "English: Yusuf Ali" },
    { id:"frHa", path: "fr.hamidullah.txt", name: "Français: Hamidullah" },
    { id:"enPi", path: "en.pickthall.txt", name: "English: M Pickthall" },
    { id:"trAb", path: "tr.abay.txt", name: "Türkçe: çeviriyazı " },
    { id:"deZa", path: "de.zaidan.txt", name: "Deutsch: Amir Zaidan" },
    { id:"tfMu", path: "ar.muyassar.txt", name: "تفسير الميسر" },
] 

const menuItems = [3,5,4,6,8,7,10,9,2,11] //this order is arbitrary
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
function finderCallBack(index){ //by M A Eyler
 // return "loadTransF('"+index+"')"
    return "changeTrans('"+index+"')"
}
function readerCallBack(index){
    return index
}

function populateTranslationMenu(menuId, templateId, cloneType, attributionName, callBack){
    let menu = document.getElementById(menuId);
    let template = document.querySelector(templateId);
    menuItems.forEach( index => {
        // if(index < 2) return;
        let clone = template.content.cloneNode(true);
        let button = clone.querySelector(cloneType);
        button.innerHTML = translations[index].name;
        button.setAttribute(attributionName, callBack(index));
        menu.appendChild(clone);
    })
}
