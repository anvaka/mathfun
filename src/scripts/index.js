// based on: http://www.playfuljs.com/realistic-terrain-in-130-lines/

document.body.onload = main;

var rand = require('./random')();

function main() {
  var canvas = document.getElementById('scene');
  var width = canvas.width = window.innerWidth;
  var height = canvas.height = window.innerHeight;
  var ctx = canvas.getContext('2d');
  var map = heightMap(9, 0.7);
  var size = map.size;
  var plot;
  var startY = 0;
  var dy = 1;

  frame();

  function frame() {
    requestAnimationFrame(frame);
    var y = startY;
    for (var x = 0; x < size-1; ++x) {
      var z = map.get(x, y);
      var z1 = map.get(x + 1, y);
      var c = brightness(x, y, z1 - z);

      var left = project(x, y, z);
      var top = project(x, y, z, 1);
      var right = project(x + 1, y, 0);
      var bottom = project(x + 1, y, 0, 1);
      var color = 'rgba(' + c+ ',' +  c+ ',' +  c+ ', 1)';
      rect(left, top, right, bottom, color);
      var waterLeft = project(x, y, size * 0.2);
      var waterTop = project(x, y, size * 0.2, 1);
      rect(waterLeft, waterTop, right, bottom, 'rgba(50, 150,200, 0.15)');
    }
    startY += dy;
    if (startY === size) {
      dy = -1;
    } else if (startY === 0) {
      dy = 1;
      ctx.clearRect(0, 0, width, height);
      map = heightMap(9, 0.7);
    }
  }

  function rect(left, top, right, bottom, color) {
    if (bottom < top) return;
    ctx.fillStyle = color;
    ctx.fillRect(left, top, right-left, bottom-top);
  }

  function brightness(x, y, slope) {
    if (x === size || y === size) return 0;
    return Math.floor(slope * 50) + 128;
  }

  function project(flatX, flatY, flatZ, isY) {
    var pointX = isoX(flatX, flatY);
    var pointY = isoY(flatX, flatY);
    var x0 = width * 0.5;
    var y0 = height * 0.2;
    var z = size * 0.5 - flatZ + pointY * 2.75;
    var x = (pointX - size * 0.5) * 6;
    var y = (size - pointY) * 0.005 + 3;

    return isY ? 
      y0 + z / y :
      x0 + x / y;
  }

  function isoX(x, y) { return 0.5 * (size + x - y); }
  function isoY(x, y) { return 0.5 * (x + y); }

  function pixel(x, y, r, g, b) {
    x = Math.floor(x);
    y = Math.floor(y);
    if (x < 0 || x > width || y < 0 || y > height) return;
    var idx = (x + width * y) * 4;
    plot.data[idx] = r;
    plot.data[idx + 1] = g;
    plot.data[idx + 2] = b;
    plot.data[idx + 3] = 255;
  }
}

function heightMap(detail, roughness) {
  var size = Math.pow(2, detail) + 1,
      max = size - 1,
      map = new Float32Array(size * size);

  set(0, 0, max / 2);
  set(max, 0, max / 2);
  set(max, max, max / 2);
  set(0, max, max / 2);

  divide(max);

  return {
    map: map,
    get: get,
    size: max
  };

  function divide(size) {
    var x, y, half = size / 2;
    var scale = roughness * size;
    if (half < 1) return;

    for (y = half; y < max; y += size) {
      for (x = half; x < max; x += size) {
        square(x, y, half, rand() * scale * 2 - scale);
      }
    }
    for (y = 0; y <= max; y += half) {
      for (x = (y + half) % size; x <= max; x += size) {
        diamond(x, y, half, rand() * scale * 2 - scale);
      }
    }
    divide(size / 2);
  }

  function diamond(x, y, size, offset) {
    var avg = average(
      get(x, y - size),      // top
      get(x + size, y),      // right
      get(x, y + size),      // bottom
      get(x - size, y)       // left
    );

    set(x, y, avg + offset);
  }

  function square(x, y, size, offset) {
    var avg = average(
      get(x - size, y - size),      // left, top
      get(x + size, y - size),      // right, top
      get(x + size, y + size),      // right, bottom
      get(x - size, y + size)       // left, bottom
    );
    set(x, y, avg + offset);
  }

  function average(w, x, y, z) {
    return (w + x + y + z) / 4;
  }

  function get(x, y) {
    if (x < 0 || x > max || y < 0 || y > max) return -1;
    return map[x + size * y];
  }

  function set(x, y, value) { map[x + size * y] = value; }
}
