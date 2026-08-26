/**
 * Calculates the geodetic distance between two points on the Earth's surface
 * using the Haversine formula.
 * 
 * @param {Object} loc1 - First location {latitude, longitude} or {lat, lng}
 * @param {Object} loc2 - Second location {latitude, longitude} or {lat, lng}
 * @returns {number} Distance in kilometers
 */
export function calculateDistance(loc1, loc2) {
  const lat1 = loc1.latitude !== undefined ? loc1.latitude : loc1.lat;
  const lon1 = loc1.longitude !== undefined ? loc1.longitude : loc1.lng;
  
  const lat2 = loc2.latitude !== undefined ? loc2.latitude : loc2.lat;
  const lon2 = loc2.longitude !== undefined ? loc2.longitude : loc2.lng;

  if (lat1 === undefined || lon1 === undefined || lat2 === undefined || lon2 === undefined) {
    return 0;
  }

  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon / 2) * Math.sin(dLon / 2); 
    
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)); 
  const d = R * c; // Distance in km
  return d;
}

function deg2rad(deg) {
  return deg * (Math.PI / 180);
}
