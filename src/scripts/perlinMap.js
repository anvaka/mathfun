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

