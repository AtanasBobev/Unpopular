const geolib = require("geolib");

export default function (latitude, longitude) {
  return geolib.isPointInPolygon({ latitude: latitude, longitude: longitude }, [
    { latitude: 41.123061, longitude: 22.237707 },
    { latitude: 41.617865, longitude: 28.87706 },
    { latitude: 44.169042, longitude: 29.550376 },
    { latitude: 44.55166, longitude: 22.339255 },
  ]);
}
