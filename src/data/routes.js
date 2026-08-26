export const mockRoutes = [
  {
    id: 1,
    name: "Route 1 (via Gangapur Rd & Sharanpur)",
    label: "Route 1 (Gangapur)",
    distance: "9.7 km",
    time: "22 mins",
    riskLevel: "LOW",
    riskScore: 0.12,
    totalHotspots: 0,
    hotspotsEnRoute: [],
    details: "BYK Circle -> Gangapur Rd -> Sharanpur -> Golf Club -> Nashik Road. Broad lanes, optimal signal timing, zero critical clusters.",
    path: [
      [20.0084, 73.7635], // College Road BYK Circle (Start)
      [20.0162, 73.7745], // Jehan Circle
      [20.0052, 73.7785], // Sharanpur Road
      [19.9930, 73.7740], // Golf Club Ground
      [19.9810, 73.7880], // Kathe Gali
      [19.9725, 73.8120], // Upnagar
      [19.9678, 73.8315], // Bitco Point
      [19.9615, 73.8443]  // Nashik Road Railway Station (End)
    ],
    color: "#22C55E" // Green
  },
  {
    id: 2,
    name: "Route 2 (via Main Rd / CBS)",
    label: "Route 2 (Main Rd)",
    distance: "8.5 km",
    time: "20 mins",
    riskLevel: "MODERATE",
    riskScore: 0.45,
    totalHotspots: 1,
    hotspotsEnRoute: [
      { name: "CBS Signal", risk: "MEDIUM", detail: "Bus Depot Congestion" }
    ],
    details: "College Road -> CBS Signal -> Shalimar -> Nashik Road. Moderate pedestrian density around commercial bus depot.",
    path: [
      [20.0084, 73.7635], // Start
      [20.0035, 73.7720], // Canada Corner
      [19.9967, 73.7836], // CBS Signal (Hotspot 5)
      [19.9910, 73.7910], // Shalimar Chowk
      [19.9785, 73.8080], // Gandhi Nagar
      [19.9678, 73.8315], // Bitco Point
      [19.9615, 73.8443]  // End
    ],
    color: "#EAB308" // Yellow
  },
  {
    id: 3,
    name: "Route 3 (via Highway NH-48 / Dwarka)",
    label: "Route 3 (NH-48)",
    distance: "8.2 km",
    time: "18 mins",
    riskLevel: "HIGH",
    riskScore: 0.88,
    totalHotspots: 3,
    hotspotsEnRoute: [
      { name: "CBS Signal", risk: "MEDIUM", detail: "Bus Depot Exit" },
      { name: "Mumbai Naka", risk: "MEDIUM", detail: "Flyover Merging Traffic" },
      { name: "Dwarka Circle", risk: "CRITICAL", detail: "High Density Heavy Vehicle Intersection" }
    ],
    details: "Highway route traversing Mumbai Naka and Dwarka Circle. Heavy container truck traffic and merging highways.",
    path: [
      [20.0084, 73.7635], // Start
      [19.9967, 73.7836], // CBS
      [19.9882, 73.7828], // Mumbai Naka (Hotspot 3)
      [19.9912, 73.8015], // Dwarka Circle (Hotspot 1)
      [19.9750, 73.8210], // Sinnar Phata
      [19.9615, 73.8443]  // End
    ],
    color: "#EF4444" // Red
  }
];
