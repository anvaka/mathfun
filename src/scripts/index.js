document.body.onload = main;

function main() {
  var canvas = document.getElementById('scene');
  var ctx = canvas.getContext('2d');

  var plot = ctx.getImageData(0, 0, canvas.offsetWidth, canvas.offsetHeight);

  var width = plot.width;
  var height = plot.height;

  // play with this:
  var fromX = -10, toX = 10, fromY = -10, toY = 10;
  var mathWidth = toX - fromX;
  var mathHeight = toY - fromY;

  var step = (toX - fromX)/(20 * width);

  for (var x = fromX; x < toX; x += step) {
    var y = Math.sin(x);

    var screenX = (x - fromX) * width / mathWidth;
    var screenY = (y - fromY) * height / mathHeight;

    // play with screenX/screenY - show regular x, y
    pixel(screenX, screenY, 0, 255, 0);
//    pixel(screenX + 5 - Math.random() * 10 , screenY + 5 - Math.random() * 10, 0, 255, 0);
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
