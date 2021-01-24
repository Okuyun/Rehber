/**
 * @file Common function used in the files.
 * <br>like the buckwalter and arabic transliteration
 * @author Abdurrahman RAJAB 
 */
"use strict";
const DATA_URL = "/Kuran/data/" // in common.js

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