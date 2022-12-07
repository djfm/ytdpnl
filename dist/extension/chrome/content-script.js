/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
var __webpack_exports__ = {};
/*!*****************************************!*\
  !*** ./src/extension/content-script.ts ***!
  \*****************************************/

var lastVideoUrl = '';
var onVideoChanged = function (videoUrl) {
    console.log('video changed:', videoUrl);
};
var onVideoMightHaveChanged = function (videoUrl) {
    if (videoUrl === lastVideoUrl) {
        return;
    }
    lastVideoUrl = videoUrl;
    onVideoChanged(videoUrl);
};
var isOnVideoPage = function () { return window.location.pathname === '/watch'; };
if (isOnVideoPage()) {
    onVideoMightHaveChanged(window.location.href);
}
var observer = new MutationObserver(function () {
    var videoUrl = window.location.href;
    if (isOnVideoPage()) {
        onVideoMightHaveChanged(videoUrl);
    }
});
observer.observe(document.body, {
    childList: true,
    subtree: true
});

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29udGVudC1zY3JpcHQuanMiLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0NBQWtDO0FBQ2xDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0EsQ0FBQyIsInNvdXJjZXMiOlsid2VicGFjazovL3l0ZHBubC8uL3NyYy9leHRlbnNpb24vY29udGVudC1zY3JpcHQudHMiXSwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgbGFzdFZpZGVvVXJsID0gJyc7XG52YXIgb25WaWRlb0NoYW5nZWQgPSBmdW5jdGlvbiAodmlkZW9VcmwpIHtcbiAgICBjb25zb2xlLmxvZygndmlkZW8gY2hhbmdlZDonLCB2aWRlb1VybCk7XG59O1xudmFyIG9uVmlkZW9NaWdodEhhdmVDaGFuZ2VkID0gZnVuY3Rpb24gKHZpZGVvVXJsKSB7XG4gICAgaWYgKHZpZGVvVXJsID09PSBsYXN0VmlkZW9VcmwpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBsYXN0VmlkZW9VcmwgPSB2aWRlb1VybDtcbiAgICBvblZpZGVvQ2hhbmdlZCh2aWRlb1VybCk7XG59O1xudmFyIGlzT25WaWRlb1BhZ2UgPSBmdW5jdGlvbiAoKSB7IHJldHVybiB3aW5kb3cubG9jYXRpb24ucGF0aG5hbWUgPT09ICcvd2F0Y2gnOyB9O1xuaWYgKGlzT25WaWRlb1BhZ2UoKSkge1xuICAgIG9uVmlkZW9NaWdodEhhdmVDaGFuZ2VkKHdpbmRvdy5sb2NhdGlvbi5ocmVmKTtcbn1cbnZhciBvYnNlcnZlciA9IG5ldyBNdXRhdGlvbk9ic2VydmVyKGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgdmlkZW9VcmwgPSB3aW5kb3cubG9jYXRpb24uaHJlZjtcbiAgICBpZiAoaXNPblZpZGVvUGFnZSgpKSB7XG4gICAgICAgIG9uVmlkZW9NaWdodEhhdmVDaGFuZ2VkKHZpZGVvVXJsKTtcbiAgICB9XG59KTtcbm9ic2VydmVyLm9ic2VydmUoZG9jdW1lbnQuYm9keSwge1xuICAgIGNoaWxkTGlzdDogdHJ1ZSxcbiAgICBzdWJ0cmVlOiB0cnVlXG59KTtcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==