"use strict";
const PREF ='BQ', CACHE = PREF+'00'
// automate file things with WebPage that show everything underit with the needed style.
const FILES = [
  '/BahisQurani/',
  '/BahisQurani/finder.html',
  '/BahisQurani/reader.html',
  '/BahisQurani/code/buckwalter.js',
  '/BahisQurani/code/common.js',
  '/BahisQurani/code/finder.js',
  '/BahisQurani/code/quran-data.js',
  '/BahisQurani/code/quran-sura.js',
  '/BahisQurani/code/script.js',
  '/BahisQurani/data/ar.jalalayn.txt',
  '/BahisQurani/data/ar.muyassar.txt',
  '/BahisQurani/data/en.ahmedali.txt',
  '/BahisQurani/data/en.yusufali.txt',
  '/BahisQurani/data/quran-simple-clean.txt',
  '/BahisQurani/data/quran-uthmani.txt',
  '/BahisQurani/data/tr.diyanet.txt',
  '/BahisQurani/data/tr.yazir.txt',
  '/BahisQurani/style/me_quran.ttf',
  '/BahisQurani/data/manifest.json'
]

function installCB(e) {  //CB means call-back
  console.log(CACHE, e);
  e.waitUntil(
    caches.open(CACHE)
    .then(cache => cache.addAll(FILES))
    .catch(console.log)
  )
}
addEventListener('install', installCB)

function cacheCB(e) { //cache first
  e.respondWith(
    caches.match(e.request)
    .then(r => {
       if (r) return r
       console.log('not in', CACHE, e.request.url)
       return fetch(e.request)
    })
    .catch(console.log)
  )
}
addEventListener('fetch', cacheCB)

function removeOld(L) {
  return Promise.all(L.map(key => {
    if (!key.startsWith(PREF) || key == CACHE)
       return null;
    console.log('deleted', key)
    return caches.delete(key)
  }))
}
function activateCB(e) {
  console.log(CACHE, e);
  e.waitUntil(
    caches.keys().then(removeOld)
  )
}
addEventListener('activate', activateCB);
