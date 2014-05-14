(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
document.body.onload = main;

function main() {
  var canvas = document.getElementById('scene');
  var ctx = canvas.getContext('2d');
  
  var plot = ctx.getImageData(0, 0, canvas.offsetWidth, canvas.offsetHeight);
  
  var width = plot.width;
  var height = plot.height;
  for (var x = 0; x < width; ++x) {
    for (var y = 0; y < height; ++y) {
      pixel(x, y,  0, (x + y) % 255, 0);
    }
  }
  ctx.putImageData(plot, 0, 0);
  
  function pixel(x, y, r, g, b) {
    var idx = (x + width * y) * 4;
    plot.data[idx] = r; 
    plot.data[idx + 1] = g;
    plot.data[idx + 2] = b;
    plot.data[idx + 3] = 255;
  }
}


},{}]},{},[1])