import React, { useState, useEffect } from 'react';
import MapView from '../../components/MapView';
import { mockHotspots } from '../../data/hotspots';
import RiskBadge from '../../components/common/RiskBadge';
import { Calendar, Cpu, Layers, Info } from 'lucide-react';
import { initIndexedDB } from '../../utils/indexedDB';

export default function AdminMap() {
  const [dateRange, setDateRange] = useState('2026-07-01 to 2026-08-25');
  const [selectedAlgo, setSelectedAlgo] = useState('HDBSCAN');
  
  // Map layers states
  const [showPins, setShowPins] = useState(true);
  const [showKde, setShowKde] = useState(true);
  const [showSpeedLimits, setShowSpeedLimits] = useState(false);

  // Selected Hotspot state
  const [selectedHotspot, setSelectedHotspot] = useState(null);
  const [hotspotsList, setHotspotsList] = useState(mockHotspots);

  useEffect(() => {
    // Populate IndexedDB with default mock hotspots on admin map init
    initIndexedDB(mockHotspots)
      .then(() => console.log("IndexedDB Initialized successfully from Admin Map"))
      .catch(err => console.error("IndexedDB Init error in Admin Map:", err));
  }, []);

  // Filter hotspots based on algorithm selected
  useEffect(() => {
    if (selectedAlgo === 'ALL') {
      setHotspotsList(mockHotspots);
    } else {
      setHotspotsList(mockHotspots.filter(h => h.algorithm === selectedAlgo || h.algorithm === 'HDBSCAN'));
    }
  }, [selectedAlgo]);

  const handleSelectHotspot = (hotspot) => {
    setSelectedHotspot(hotspot);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-gray-200 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-navy-900">GIS INTERACTIVE MAP</h1>
          <p className="text-gray-500 text-sm">Real-time prediction overlays & spatial clustering algorithms.</p>
        </div>
      </div>

      {/* Top Filter Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        {/* Date Range Selector */}
        <div className="flex items-center space-x-3">
          <Calendar className="text-blue-600 w-5 h-5 flex-shrink-0" />
          <div className="flex-1">
            <label className="block text-xs font-semibold text-gray-500 uppercase">Analysis Date Range</label>
            <select 
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-1.5 text-sm bg-gray-50 hover:bg-gray-100 transition focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="2026-07-01 to 2026-08-25">Last 60 Days (July 1 - Aug 25, 2026)</option>
              <option value="2026-01-01 to 2026-08-25">Year-to-Date (YTD 2026)</option>
              <option value="2025-01-01 to 2025-12-31">Full Year 2025</option>
            </select>
          </div>
        </div>

        {/* Algorithm Selector */}
        <div className="flex items-center space-x-3">
          <Cpu className="text-blue-600 w-5 h-5 flex-shrink-0" />
          <div className="flex-1">
            <label className="block text-xs font-semibold text-gray-500 uppercase">Clustering Algorithm</label>
            <select 
              value={selectedAlgo} 
              onChange={(e) => setSelectedAlgo(e.target.value)}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-1.5 text-sm bg-gray-50 hover:bg-gray-100 transition focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="HDBSCAN">HDBSCAN (Hierarchical - Default)</option>
              <option value="DBSCAN">DBSCAN (Density-Based)</option>
              <option value="K-Means">K-Means (Partitioning)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Map & Info Section */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Side: Map Container */}
        <div className="lg:col-span-3 h-[600px] flex flex-col">
          <MapView 
            hotspots={hotspotsList}
            selectedHotspot={selectedHotspot}
            onSelectHotspot={handleSelectHotspot}
            showPins={showPins}
            showKde={showKde}
            showSpeedLimits={showSpeedLimits}
            zoom={13}
          />
        </div>

        {/* Right Side: Map Controls & Selected Details */}
        <div className="lg:col-span-1 space-y-6 flex flex-col justify-start">
          {/* Map Layers Toggle Panel */}
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-sm font-bold text-navy-950 uppercase border-b border-gray-100 pb-2 mb-3 flex items-center gap-2">
              <Layers className="w-4 h-4 text-blue-600" /> Map Layers
            </h3>
            <div className="space-y-3">
              <label className="flex items-center space-x-3 cursor-pointer text-sm font-medium text-gray-700">
                <input 
                  type="checkbox" 
                  checked={showPins} 
                  onChange={(e) => setShowPins(e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 w-4 h-4"
                />
                <span>Hotspot Pins</span>
              </label>

              <label className="flex items-center space-x-3 cursor-pointer text-sm font-medium text-gray-700">
                <input 
                  type="checkbox" 
                  checked={showKde} 
                  onChange={(e) => setShowKde(e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 w-4 h-4"
                />
                <span>KDE Heatmap</span>
              </label>

              <label className="flex items-center space-x-3 cursor-pointer text-sm font-medium text-gray-700">
                <input 
                  type="checkbox" 
                  checked={showSpeedLimits} 
                  onChange={(e) => setShowSpeedLimits(e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 w-4 h-4"
                />
                <span>Speed Limits</span>
              </label>
            </div>
          </div>

          {/* Selected Zone Info Card */}
          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex-1 flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-bold text-navy-950 uppercase border-b border-gray-100 pb-2 mb-4 flex items-center gap-2">
                <Info className="w-4 h-4 text-blue-600" /> Selected Zone Info
              </h3>
              
              {selectedHotspot ? (
                <div className="space-y-4">
                  <div>
                    <span className="text-xs text-gray-400 font-semibold block uppercase">Zone Name</span>
                    <span className="text-lg font-bold text-navy-900">{selectedHotspot.name}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-xs text-gray-400 font-semibold block uppercase">Risk Rating</span>
                      <div className="mt-1">
                        <RiskBadge level={selectedHotspot.riskLevel} />
                      </div>
                    </div>
                    <div>
                      <span className="text-xs text-gray-400 font-semibold block uppercase">Risk Score</span>
                      <span className="text-lg font-bold text-navy-900">{selectedHotspot.riskScore}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-xs text-gray-400 font-semibold block uppercase">Accident Density</span>
                      <span className="text-base font-bold text-gray-800">{selectedHotspot.density}</span>
                    </div>
                    <div>
                      <span className="text-xs text-gray-400 font-semibold block uppercase">Accident Count</span>
                      <span className="text-base font-bold text-red-600">{selectedHotspot.accidentCount}</span>
                    </div>
                  </div>

                  <div className="border-t border-gray-100 pt-3">
                    <span className="text-xs text-gray-400 font-semibold block uppercase mb-1">Risk Factors</span>
                    <ul className="list-disc list-inside text-xs text-gray-600 space-y-1">
                      {selectedHotspot.riskFactors.map((factor, index) => (
                        <li key={index}>{factor}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs border-t border-gray-100 pt-3 text-gray-500">
                    <div>Lat: {selectedHotspot.lat.toFixed(4)}</div>
                    <div>Lng: {selectedHotspot.lng.toFixed(4)}</div>
                    <div className="col-span-2">Algo: {selectedHotspot.algorithm}</div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-gray-400 space-y-2">
                  <Layers className="w-12 h-12 mx-auto stroke-1" />
                  <p className="text-sm">Click any hotspot marker on the map to view detailed GIS & predictive insights.</p>
                </div>
              )}
            </div>

            {selectedHotspot && (
              <div className="text-xs text-gray-400 border-t border-gray-100 pt-3 mt-4 text-center">
                Last calculated: {selectedHotspot.lastUpdated}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
