"use strict";
/**
 * 
 * The code version.
 * 
 */
const VERSION = "V3.12T";

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
 * Translating Buckwalter letters to Arabic.
 * 
 * uses BWC object in src="buckwalter.js"
 * code from https://github.com/stts-se/buckwalter-converter
 *
 * @param {string} s  Buckwalter transliteration 
 * @returns {string}  Arabic String
 */
function toArabicLetters(s) {
    return BWC.convert(BWC.b2aMap, s).output
}