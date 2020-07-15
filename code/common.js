/**
 * @file Common function used in the files.
 * <br>like the buckwalter and arabic transliteration
 * @author Abdurrahman RAJAB 
 */
"use strict";
const DATA_URL = "https://maeyler.github.io/Iqra3/data/" // in common.js

/**
 * &emsp; used in both Mujam
 * used at report2 @see report2
 */
const EM_SPACE = String.fromCharCode(8195)

/**
 * Translating Arabic letters to Buckwalter.
 * 
 * uses BWC object in src="buckwalter.js"
 * code from https://github.com/stts-se/buckwalter-converter
 *
 * @param {string} s  Arabic string 
 * @returns {string}  Buckwalter transliteration 
 */
function toBuckwalter(s) {
    return BWC.convert(BWC.a2bMap, s).output
}

/**
 * Translating to Arabic letters back from Buckwalter.
 * 
 * @param {string} s  Buckwalter transliteration
 * @returns {string}  Arabic string
 */
function toArabic(s) {
    return BWC.convert(BWC.b2aMap, s).output
}


// from: https://stackoverflow.com/questions/1409225/changing-a-css-rule-set-from-javascript
// Add variables array then use destrutctor to call it for once! only one time... 
// no need to crash the app everytime the user will change the CSS since its static and
//  stable, yet, do you think the array thingy was faster? if yes then go for it and leave 
// TODO: this, speed is valuable more than some ninja JS skills here. 

function getCSSRule(ruleName) {
    // ruleName=ruleName.toLowerCase();  
                 
    for (let sheet of document.styleSheets) {
        try{      
        for (let rule of sheet.cssRules) {
            if (rule.selectorText == ruleName) {
                return rule;
            }
        }}catch(error){console.log("error reading external CSS")}
    }

}