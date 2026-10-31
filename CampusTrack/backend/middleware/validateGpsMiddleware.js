function validateGpsMiddleware(req, res, next) {
  const { latitude, longitude, tripId, accuracy, speed, heading } = req.body;

  if (latitude === undefined || longitude === undefined || !tripId) {
    return res.status(400).json({
      success: false,
      error: 'Malformed GPS payload: latitude, longitude, and tripId are required.'
    });
  }

  const lat = parseFloat(latitude);
  const lng = parseFloat(longitude);

  if (isNaN(lat) || lat < -90 || lat > 90) {
    return res.status(400).json({
      success: false,
      error: 'Invalid GPS latitude. Must be between -90.0 and +90.0 degrees.'
    });
  }

  if (isNaN(lng) || lng < -180 || lng > 180) {
    return res.status(400).json({
      success: false,
      error: 'Invalid GPS longitude. Must be between -180.0 and +180.0 degrees.'
    });
  }

  if (accuracy !== undefined && (isNaN(accuracy) || accuracy < 0 || accuracy > 5000)) {
    return res.status(400).json({
      success: false,
      error: 'Invalid GPS accuracy value.'
    });
  }

  req.validatedLocation = {
    trip_id: Number(tripId),
    latitude: lat,
    longitude: lng,
    accuracy: accuracy ? parseFloat(accuracy) : 5.0,
    speed: speed ? Math.max(0, parseFloat(speed)) : 0.0,
    heading: heading ? parseFloat(heading) : 0.0,
    device_timestamp: req.body.deviceTimestamp || new Date().toISOString()
  };

  next();
}

module.exports = validateGpsMiddleware;
