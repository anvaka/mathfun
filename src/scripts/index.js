// based on: http://www.playfuljs.com/realistic-terrain-in-130-lines/

document.body.onload = main;

function main() {
  var canvas = document.getElementById('scene');
  var ctx = canvas.getContext('2d');

  var plot = ctx.getImageData(0, 0, canvas.offsetWidth, canvas.offsetHeight);

  var width = plot.width;
  var height = plot.height;
  for (var x = 0; x < width; ++x) {
    for (var y = 0; y < height; ++y) {
//      pixel(x, y,  0, (x) % 255, 0);
    }
  }

  ctx.putImageData(plot, 0, 0);

  function pixel(x, y, r, g, b) {
    var idx = (x + width * y) * 4;
    // play with colors:
    plot.data[idx] = r;
    plot.data[idx + 1] = g;
    plot.data[idx + 2] = b;
    plot.data[idx + 3] = 255;
  }
}
