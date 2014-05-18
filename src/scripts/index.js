// based on: http://www.playfuljs.com/realistic-terrain-in-130-lines/

document.body.onload = main;

var heightMap = require('./heightMap');
var perlinMap = require('./perlinMap');

function main() {
  var canvas = document.getElementById('scene');
  var ctx = canvas.getContext('2d');
  var width = canvas.width = window.innerWidth;
  var height = canvas.height = window.innerHeight;

  var map = perlinMap(9, 4);
  var size = map.size;
  var startY = 0;
  var skip = 0;
  var skipFrame = false;
  var dt = -size * 0.2;
  // render();
  frame();

  function render() {
    requestAnimationFrame(render);
    frame();
  }

  function frame() {
    ctx.clearRect(0, 0, width, height);
    for (var y=0; y < size; ++y) {
      for (var x = 0; x < size; ++x) {
        var z = map.get(x, y);
        var z1 = map.get(x + 1, y);

        var c = brightness(x, y, z1 - z);

        var left = project(x, y, z);
        var top = project(x, y, z, 1);
        var right = project(x + 1, y, 0);
        var bottom = project(x + 1, y, 0, 1);
        var color = 'rgba(' + c+ ',' +  c + ',' +  c+ ', 1)';
        rect(left, top, right, bottom, color);
        var waterLeft = project(x, y, size * 0.0);
        var waterTop = project(x, y, size * 0.0, 1);
        rect(waterLeft, waterTop, right, bottom, 'rgba(50, 150, 200, 0.15)');
      }
    }
  }

  function brightness(x, y, slope) {
    if (x >= size-1 || y >= size -1) return 0;
    return Math.floor(slope * 50) + 128;
  }

  function project(flatX,flatY, flatZ, isY) {
    var pointX = isoX(flatX, flatY);
    var pointY = isoY(flatX, flatY);
    var x0 = width * 0.5;
    var y0 = height * 0.2;
    var z = size * 0.4 - flatZ + pointY * 0.75;
    var x = (pointX - size * 0.5) * 6;
    var y = (size - pointY) * 0.005 + 3;

    return isY ?  y0 + z*3 / y : x0 + x / y;
  }

  function isoX(x, y) { return 0.5 * (size + x - y); }
  function isoY(x, y) { return 0.5 * (x + y); }

  function rect(left, top, right, bottom, color) {
    if (bottom < top || right < left) return;
    ctx.fillStyle = color;
    ctx.fillRect(left, top, right-left, bottom-top);
  }
}
