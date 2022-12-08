/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
var __webpack_exports__ = {};
/*!*************************************!*\
  !*** ./src/extension/background.ts ***!
  \*************************************/

console.log('background.ts');
chrome.runtime.onInstalled.addListener(function () {
    chrome.webRequest.onCompleted.addListener(function (details) {
        console.log(details);
    }, {
        urls: ['https://*.youtube.com/*']
    }, []);
});
self.addEventListener('fetch', function (event) {
    console.log(event);
});

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFja2dyb3VuZC5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7QUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0EsS0FBSztBQUNMLENBQUM7QUFDRDtBQUNBO0FBQ0EsQ0FBQyIsInNvdXJjZXMiOlsid2VicGFjazovL3l0ZHBubC8uL3NyYy9leHRlbnNpb24vYmFja2dyb3VuZC50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBzdHJpY3RcIjtcbmNvbnNvbGUubG9nKCdiYWNrZ3JvdW5kLnRzJyk7XG5jaHJvbWUucnVudGltZS5vbkluc3RhbGxlZC5hZGRMaXN0ZW5lcihmdW5jdGlvbiAoKSB7XG4gICAgY2hyb21lLndlYlJlcXVlc3Qub25Db21wbGV0ZWQuYWRkTGlzdGVuZXIoZnVuY3Rpb24gKGRldGFpbHMpIHtcbiAgICAgICAgY29uc29sZS5sb2coZGV0YWlscyk7XG4gICAgfSwge1xuICAgICAgICB1cmxzOiBbJ2h0dHBzOi8vKi55b3V0dWJlLmNvbS8qJ11cbiAgICB9LCBbXSk7XG59KTtcbnNlbGYuYWRkRXZlbnRMaXN0ZW5lcignZmV0Y2gnLCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICBjb25zb2xlLmxvZyhldmVudCk7XG59KTtcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==