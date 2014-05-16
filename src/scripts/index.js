document.body.onload = main;

function main() {
  var canvas = document.getElementById('scene');
  var ctx = canvas.getContext('2d');

  var plot = ctx.getImageData(0, 0, canvas.offsetWidth, canvas.offsetHeight);

  var width = plot.width;
  var height = plot.height;

  var fromX = -10, toX = 10, fromY = -10, toY = 10;
  var mathWidth = toX - fromX;
  var mathHeight = toY - fromY;

  var step = (toX - fromX)/(20 * width);

  for (var x = fromX; x < toX; x += step) {
    var y = Math.sin(x);

    var angle = Math.PI/2;
    var rotX = x * Math.cos(angle) - y * Math.sin(angle);
    var rotY = x * Math.sin(angle) + y * Math.cos(angle);

    var screenX = (rotX - fromX) * width / mathWidth;
    var screenY = (rotY - fromY) * height / mathHeight;


    pixel(screenX, screenY, 0, 255, 0);
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

