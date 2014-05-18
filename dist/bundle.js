(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports = heightMap;

var rand = require('./random')(42);

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

},{"./random":5}],2:[function(require,module,exports){
// based on: http://www.playfuljs.com/realistic-terrain-in-130-lines/

document.body.onload = main;

var heightMap = require('./heightMap');
var perlinMap = require('./perlinMap');

function main() {
  var canvas = document.getElementById('scene');
  var ctx = canvas.getContext('2d');
  var width = canvas.width = window.innerWidth;
  var height = canvas.height = window.innerHeight;

  var map = heightMap(9, 0.7);
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
        var waterLeft = project(x, y, size * 0.2);
        var waterTop = project(x, y, size * 0.2, 1);
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
    var y = (size - pointY) * 0.005 + 1;

    return isY ?  y0 + z / y : x0 + x / y;
  }

  function isoX(x, y) { return 0.5 * (size + x - y); }
  function isoY(x, y) { return 0.5 * (x + y); }

  function rect(left, top, right, bottom, color) {
    if (bottom < top || right < left) return;
    ctx.fillStyle = color;
    ctx.fillRect(left, top, right-left, bottom-top);
  }
}

},{"./heightMap":1,"./perlinMap":4}],3:[function(require,module,exports){
module.exports = noise;

var p = [151,160,137,91,90,15,131,13,201,95,96,53,194,233,7,225,140,36,103,30,69,142,8,99,37,240,21,10,
          23,190,6,148,247,120,234,75,0,26,197,62,94,252,219,203,117,35,11,32,57,177,33,88,237,149,56,87,
          174,20,125,136,171,168,68,175,74,165,71,134,139,48,27,166,77,146,158,231,83,111,229,122,60,211,
          133,230,220,105,92,41,55,46,245,40,244,102,143,54,65,25,63,161,1,216,80,73,209,76,132,187,208,
          89,18,169,200,196,135,130,116,188,159,86,164,100,109,198,173,186,3,64,52,217,226,250,124,123,5,
          202,38,147,118,126,255,82,85,212,207,206,59,227,47,16,58,17,182,189,28,42,223,183,170,213,119,
          248,152,2,44,154,163,70,221,153,101,155,167,43,172,9,129,22,39,253,19,98,108,110,79,113,224,232,
          178,185,112,104,218,246,97,228,251,34,242,193,238,210,144,12,191,179,162,241,81,51,145,235,249,
          14,239,107,49,192,214,31,181,199,106,157,184,84,204,176,115,121,50,45,127,4,150,254,138,236,205,
          93,222,114,67,29,24,72,243,141,128,195,78,66,215,61,156,180];

for (var i=0; i < 256 ; i++) {
  p[256+i] = p[i];
}

function fade(t) {
  return t * t * t * (t * (t * 6 - 15) + 10);
}

function lerp(t, a, b) {
  return a + t * (b - a);
}

function grad(hash, x, y, z) {
  var h = hash & 15;
  var u = h < 8 ? x : y, v = h < 4 ? y : h == 12 || h == 14 ? x : z;
  return ((h&1) === 0 ? u : -u) + ((h&2) === 0 ? v : -v);
}

function noise(x, y, z) {
  var floorX = ~~x, floorY = ~~y, floorZ = ~~z;

  var X = floorX & 255, Y = floorY & 255, Z = floorZ & 255;

  x -= floorX;
  y -= floorY;
  z -= floorZ;

  var xMinus1 = x - 1, yMinus1 = y - 1, zMinus1 = z - 1;

  var u = fade(x), v = fade(y), w = fade(z);

  var A = p[X]+Y, AA = p[A]+Z, AB = p[A+1]+Z, B = p[X+1]+Y, BA = p[B]+Z, BB = p[B+1]+Z;

  return lerp(
    w,
    lerp(v,
          lerp(u, grad(p[AA], x, y, z), grad(p[BA], xMinus1, y, z)),
          lerp(u, grad(p[AB], x, yMinus1, z), grad(p[BB], xMinus1, yMinus1, z))
        ),
    lerp(v,
          lerp(u, grad(p[AA+1], x, y, zMinus1), grad(p[BA+1], xMinus1, y, z-1)),
          lerp(u, grad(p[AB+1], x, yMinus1, zMinus1), grad(p[BB+1], xMinus1, yMinus1, zMinus1))
        )
      );
}

},{}],4:[function(require,module,exports){
module.exports = perlinMap;

var rand = require('./random')();
var noise = require('./noise');

function perlinMap(detail, roughness) {
  var size = Math.pow(2, detail) + 1,
      max = size - 1,
      map = new Float32Array(size * size);
  roughness = typeof roughness === 'number' ? roughness : 4;

  var quality = 1;
  var z = rand() * 100;

  // Do several passes to get more detail
  for ( var iteration = 0; iteration < roughness; iteration++ ) {
    for ( var i = 0; i < map.length; i ++ ) {
      var x = i % size;
      var y = Math.floor( i / size );
      map[i] += Math.abs( noise( x / quality, y / quality, z ) * quality );
    }
    quality *= 5;
  }

  return {
    map: map,
    get: get,
    size: max
  };

  function get(x, y) {
    if (x < 0 || x > max || y < 0 || y > max) return -1;
    return map[x + size * y];
  }
}


},{"./noise":3,"./random":5}],5:[function(require,module,exports){
module.exports = function random(seed) {
  if (typeof seed !== 'number') seed = +new Date();

  return function () {
    // Robert Jenkins' 32 bit integer hash function.
    seed = ((seed + 0x7ed55d16) + (seed << 12))  & 0xffffffff;
    seed = ((seed ^ 0xc761c23c) ^ (seed >>> 19)) & 0xffffffff;
    seed = ((seed + 0x165667b1) + (seed << 5))   & 0xffffffff;
    seed = ((seed + 0xd3a2646c) ^ (seed << 9))   & 0xffffffff;
    seed = ((seed + 0xfd7046c5) + (seed << 3))   & 0xffffffff;
    seed = ((seed ^ 0xb55a4f09) ^ (seed >>> 16)) & 0xffffffff;
    return (seed & 0xfffffff) / 0x10000000;
  };
};

},{}]},{},[2])