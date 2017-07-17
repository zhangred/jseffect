window.noscroll = function(event) {
    event.preventDefault();
}
window.stopscroll = function(event) {
    document.body.addEventListener('touchmove', noscroll, false);
}
window.startscroll = function(event) {
    document.body.removeEventListener('touchmove', noscroll, false);
}

