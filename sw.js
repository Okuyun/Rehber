"use strict";
const PREF ='BQ', CACHE = PREF+'01'
// automate file things with WebPage that show everything underit with the needed style.
const FILES = [
  '/BahisQurani/',
//   '/BahisQurani/finder.html',
//   '/BahisQurani/reader.html',
//   '/BahisQurani/code/buckwalter.js',
//   '/BahisQurani/code/common.js',
//   '/BahisQurani/code/finder.js',
//   '/BahisQurani/code/quran-data.js',
//   '/BahisQurani/code/quran-sura.js',
//   '/BahisQurani/code/script.js',
//   '/BahisQurani/data/ar.jalalayn.txt',
//   '/BahisQurani/data/ar.muyassar.txt',
//   '/BahisQurani/data/en.ahmedali.txt',
//   '/BahisQurani/data/en.yusufali.txt',
//   '/BahisQurani/data/quran-simple-clean.txt',
//   '/BahisQurani/data/quran-uthmani.txt',
//   '/BahisQurani/data/tr.diyanet.txt',
//   '/BahisQurani/data/tr.yazir.txt',
  '/BahisQurani/style/me_quran.ttf',
'https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css',
'https://code.jquery.com/jquery-3.3.1.slim.min.js',
'https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.7/umd/popper.min.js',
'https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js',
// '/BahisQurani/style/keyboard.css',
// '/BahisQurani/code/keyboard.js',
// '/BahisQurani/code/language.js',
'/BahisQurani/images/search.png'
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
  if (!req.url.includes("BahisQurani")) 
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