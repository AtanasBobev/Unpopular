const geolib = require("geolib");

module.exports = function (latitude, longitude) {
  return geolib.isPointInPolygon({ latitude: latitude, longitude: longitude }, [
    { latitude: 41.349247, longitude: 22.937707 },
    { latitude: 41.857882, longitude: 27.905287 },
    { latitude: 44.1507, longitude: 28.556475 },
    { latitude: 44.283719, longitude: 22.718092 },
  ]);
};
