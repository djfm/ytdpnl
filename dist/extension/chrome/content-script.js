/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
var __webpack_exports__ = {};
/*!*****************************************!*\
  !*** ./src/extension/content-script.ts ***!
  \*****************************************/

var appRootId = 'ytdpnl-app-root';
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
var hideNativeRecommendationsAndEnsureExtensionIsInjected = function () {
    var relatedElt = document.querySelector('#related');
    if (!relatedElt) {
        return;
    }
    var relatedHtmlElt = relatedElt;
    if (relatedHtmlElt.style.display !== 'none') {
        relatedHtmlElt.style.display = 'none';
        var appRoot = document.createElement('div');
        appRoot.id = appRootId;
        appRoot.innerHTML = 'Hello world';
        var parent_1 = relatedElt.parentElement;
        if (!parent_1) {
            console.error('Could not find parent element of #related');
            return;
        }
        parent_1.insertBefore(appRoot, relatedElt);
    }
};
var observer = new MutationObserver(function () {
    var videoUrl = window.location.href;
    if (isOnVideoPage()) {
        onVideoMightHaveChanged(videoUrl);
    }
    hideNativeRecommendationsAndEnsureExtensionIsInjected();
});
observer.observe(document.body, {
    childList: true,
    subtree: true
});

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29udGVudC1zY3JpcHQuanMiLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrQ0FBa0M7QUFDbEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0EsQ0FBQyIsInNvdXJjZXMiOlsid2VicGFjazovL3l0ZHBubC8uL3NyYy9leHRlbnNpb24vY29udGVudC1zY3JpcHQudHMiXSwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgYXBwUm9vdElkID0gJ3l0ZHBubC1hcHAtcm9vdCc7XG52YXIgbGFzdFZpZGVvVXJsID0gJyc7XG52YXIgb25WaWRlb0NoYW5nZWQgPSBmdW5jdGlvbiAodmlkZW9VcmwpIHtcbiAgICBjb25zb2xlLmxvZygndmlkZW8gY2hhbmdlZDonLCB2aWRlb1VybCk7XG59O1xudmFyIG9uVmlkZW9NaWdodEhhdmVDaGFuZ2VkID0gZnVuY3Rpb24gKHZpZGVvVXJsKSB7XG4gICAgaWYgKHZpZGVvVXJsID09PSBsYXN0VmlkZW9VcmwpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBsYXN0VmlkZW9VcmwgPSB2aWRlb1VybDtcbiAgICBvblZpZGVvQ2hhbmdlZCh2aWRlb1VybCk7XG59O1xudmFyIGlzT25WaWRlb1BhZ2UgPSBmdW5jdGlvbiAoKSB7IHJldHVybiB3aW5kb3cubG9jYXRpb24ucGF0aG5hbWUgPT09ICcvd2F0Y2gnOyB9O1xuaWYgKGlzT25WaWRlb1BhZ2UoKSkge1xuICAgIG9uVmlkZW9NaWdodEhhdmVDaGFuZ2VkKHdpbmRvdy5sb2NhdGlvbi5ocmVmKTtcbn1cbnZhciBoaWRlTmF0aXZlUmVjb21tZW5kYXRpb25zQW5kRW5zdXJlRXh0ZW5zaW9uSXNJbmplY3RlZCA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgcmVsYXRlZEVsdCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNyZWxhdGVkJyk7XG4gICAgaWYgKCFyZWxhdGVkRWx0KSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdmFyIHJlbGF0ZWRIdG1sRWx0ID0gcmVsYXRlZEVsdDtcbiAgICBpZiAocmVsYXRlZEh0bWxFbHQuc3R5bGUuZGlzcGxheSAhPT0gJ25vbmUnKSB7XG4gICAgICAgIHJlbGF0ZWRIdG1sRWx0LnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgICAgIHZhciBhcHBSb290ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgIGFwcFJvb3QuaWQgPSBhcHBSb290SWQ7XG4gICAgICAgIGFwcFJvb3QuaW5uZXJIVE1MID0gJ0hlbGxvIHdvcmxkJztcbiAgICAgICAgdmFyIHBhcmVudF8xID0gcmVsYXRlZEVsdC5wYXJlbnRFbGVtZW50O1xuICAgICAgICBpZiAoIXBhcmVudF8xKSB7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKCdDb3VsZCBub3QgZmluZCBwYXJlbnQgZWxlbWVudCBvZiAjcmVsYXRlZCcpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHBhcmVudF8xLmluc2VydEJlZm9yZShhcHBSb290LCByZWxhdGVkRWx0KTtcbiAgICB9XG59O1xudmFyIG9ic2VydmVyID0gbmV3IE11dGF0aW9uT2JzZXJ2ZXIoZnVuY3Rpb24gKCkge1xuICAgIHZhciB2aWRlb1VybCA9IHdpbmRvdy5sb2NhdGlvbi5ocmVmO1xuICAgIGlmIChpc09uVmlkZW9QYWdlKCkpIHtcbiAgICAgICAgb25WaWRlb01pZ2h0SGF2ZUNoYW5nZWQodmlkZW9VcmwpO1xuICAgIH1cbiAgICBoaWRlTmF0aXZlUmVjb21tZW5kYXRpb25zQW5kRW5zdXJlRXh0ZW5zaW9uSXNJbmplY3RlZCgpO1xufSk7XG5vYnNlcnZlci5vYnNlcnZlKGRvY3VtZW50LmJvZHksIHtcbiAgICBjaGlsZExpc3Q6IHRydWUsXG4gICAgc3VidHJlZTogdHJ1ZVxufSk7XG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=