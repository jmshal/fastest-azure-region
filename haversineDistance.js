// original: https://github.com/dcousens/haversine-distance/blob/1cf86e875874b9aa117c3057037f85d40bfb6f42/index.js

const squared = (x) => x * x;
const toRad = (x) => x * Math.PI / 180.0;
const hav = (x) => squared(Math.sin(x / 2));

module.exports = function haversineDistance(a, b) {
  const aLat = toRad(a.latitude);
  const bLat = toRad(b.latitude);
  const aLng = toRad(a.longitude);
  const bLng = toRad(b.longitude);

  const ht = hav(bLat - aLat) + Math.cos(aLat) * Math.cos(bLat) * hav(bLng - aLng);
  return 2 * 6378137 * Math.asin(Math.sqrt(ht));
};
