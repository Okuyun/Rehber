"use strict";
const PREF ='BQ', CACHE = PREF+'01'
// automate file things with WebPage that show everything underit with the needed style.
const FILES = [
  '/Rehber/',
//   '/Rehber/finder.html',
//   '/Rehber/reader.html',
//   '/Rehber/code/buckwalter.js',
//   '/Rehber/code/common.js',
//   '/Rehber/code/finder.js',
//   '/Rehber/code/quran-data.js',
//   '/Rehber/code/quran-sura.js',
//   '/Rehber/code/script.js',
//   '/Rehber/data/ar.jalalayn.txt',
//   '/Rehber/data/ar.muyassar.txt',
//   '/Rehber/data/en.ahmedali.txt',
//   '/Rehber/data/en.yusufali.txt',
//   '/Rehber/data/quran-simple-clean.txt',
//   '/Rehber/data/quran-uthmani.txt',
//   '/Rehber/data/tr.diyanet.txt',
//   '/Rehber/data/tr.yazir.txt',
  '/Rehber/style/me_quran.ttf',
'https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css',
'https://code.jquery.com/jquery-3.3.1.slim.min.js',
'https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.7/umd/popper.min.js',
'https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js',
// '/Rehber/style/keyboard.css',
// '/Rehber/code/keyboard.js',
// '/Rehber/code/language.js',
'/Rehber/images/search.png'
]

function installCB(e) {  //CB means call-back
  console.log("installing "+CACHE);
  e.waitUntil(
    caches.open(CACHE)
    .then(cache => cache.addAll(FILES))
    .catch(console.log)
  )
}
addEventListener('install', installCB)

function save(req, resp) {
  if (!req.url.includes("Rehber")) 
     return resp;
  return caches.open(CACHE)
  .then(cache => { // save request
    cache.put(req, resp.clone());
    return resp;
  }) 
  .catch(console.err)
}
function report(req) {
  console.log(CACHE+' matches '+req.url)
  return req
}
function fetchCB(e) { //fetch first
  let req = e.request
  e.respondWith(
    fetch(req).then(r2 => save(req, r2))
    .catch(() => caches.match(req).then(report))
  )
}
addEventListener('fetch', fetchCB)

function removeOld(L) {
  return Promise.all(L.map(key => {
    if (!key.startsWith(PREF) || key == CACHE)
       return null;
    console.log(key+" is deleted")
    return caches.delete(key)
  }))
}
function activateCB(e) {
  console.log(CACHE+" is activated");
  e.waitUntil(
    caches.keys().then(removeOld)
  )
}
addEventListener('activate', activateCB);