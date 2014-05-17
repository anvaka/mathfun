// based on: http://www.playfuljs.com/realistic-terrain-in-130-lines/

document.body.onload = main;

function main() {
  var canvas = document.getElementById('scene');
  var ctx = canvas.getContext('2d');
  var plot = ctx.getImageData(0, 0, canvas.offsetWidth, canvas.offsetHeight);
  var map = heightMap(9, 0.7);
  var width = plot.width;
  var height = plot.height;

  ctx.clearRect(0, 0, width, height);
  for (var x = 0; x < width; ++x) {
    for (var y = 0; y < height; ++y) {
      var val = map.get(x, y);
      pixel(x, y, 0, c/1.2, c);
    }
  }

  ctx.putImageData(plot, 0, 0);

  function pixel(x, y, r, g, b) {
    x = Math.floor(x);
    y = Math.floor(y);
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
    get: get
  };

  function divide(size) {
    var x, y, half = size / 2;
    var scale = roughness * size;
    if (half < 1) return;

    for (y = half; y < max; y += size) {
      for (x = half; x < max; x += size) {
        square(x, y, half, Math.random() * scale * 2 - scale);
      }
    }
    for (y = 0; y <= max; y += half) {
      for (x = (y + half) % size; x <= max; x += size) {
        diamond(x, y, half, Math.random() * scale * 2 - scale);
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
