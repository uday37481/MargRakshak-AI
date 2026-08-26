import React, { useState } from 'react';
import { mockHotspots } from '../../data/hotspots';
import RiskBadge from '../../components/common/RiskBadge';
import Modal from '../../components/common/Modal';
import NotificationToast from '../../components/common/NotificationToast';
import { Search, Filter, Plus, Eye, Trash2, Map } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { saveOfflineHotspot } from '../../utils/indexedDB';

export default function AdminHotspots() {
  const navigate = useNavigate();
  const [hotspots, setHotspots] = useState(mockHotspots);
  const [searchQuery, setSearchQuery] = useState('');
  const [riskFilter, setRiskFilter] = useState('ALL');
  
  // Modal states
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedHotspot, setSelectedHotspot] = useState(null);
  const [isAddOpen, setIsAddOpen] = useState(false);

  // Notification Toast states
  const [toastMessage, setToastMessage] = useState(null);
  const [toastType, setToastType] = useState('success');

  // Form states for adding new zone
  const [newZoneName, setNewZoneName] = useState('');
  const [newLat, setNewLat] = useState('19.9920');
  const [newLng, setNewLng] = useState('73.7920');
  const [newRiskLevel, setNewRiskLevel] = useState('MEDIUM');
  const [newRiskScore, setNewRiskScore] = useState('0.60');
  const [newAccidentCount, setNewAccidentCount] = useState('24');
  const [newDensity, setNewDensity] = useState('7.5');
  const [newRiskFactors, setNewRiskFactors] = useState('Poor Signage, Overspeeding');

  // Filter Logic
  const filteredHotspots = hotspots.filter(spot => {
    const matchesSearch = spot.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          spot.riskFactors.some(f => f.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesRisk = riskFilter === 'ALL' || spot.riskLevel.toUpperCase() === riskFilter.toUpperCase();

    return matchesSearch && matchesRisk;
  });

  const handleOpenDetails = (spot) => {
    setSelectedHotspot(spot);
    setIsDetailsOpen(true);
  };

  const handleAddZone = (e) => {
    e.preventDefault();
    if (!newZoneName.trim() || !newLat || !newLng) {
      alert("Please fill in the Zone Name and GPS Coordinates.");
      return;
    }

    const newSpotObj = {
      id: hotspots.length + 1,
      name: newZoneName,
      lat: parseFloat(newLat),
      lng: parseFloat(newLng),
      riskLevel: newRiskLevel,
      riskScore: parseFloat(newRiskScore),
      density: parseFloat(newDensity),
      accidentCount: parseInt(newAccidentCount),
      riskFactors: newRiskFactors.split(',').map(f => f.trim()).filter(Boolean),
      algorithm: "HDBSCAN", // Default for manual adding
      lastUpdated: new Date().toISOString().replace('T', ' ').substring(0, 16)
    };

    // Update state
    const updatedHotspots = [...hotspots, newSpotObj];
    setHotspots(updatedHotspots);
    setIsAddOpen(false);

    // Save to IndexedDB for offline mock persistence
    saveOfflineHotspot(newSpotObj)
      .then(() => console.log("New hotspot persisted offline in IndexedDB"))
      .catch(err => console.error("IndexedDB Save error:", err));

    setToastType('success');
    setToastMessage(`Accident zone "${newZoneName}" successfully added & stored offline in IndexedDB!`);

    // Reset Form
    setNewZoneName('');
    setNewLat('19.9920');
    setNewLng('73.7920');
    setNewRiskLevel('MEDIUM');
    setNewRiskScore('0.60');
    setNewAccidentCount('24');
    setNewDensity('7.5');
    setNewRiskFactors('Poor Signage, Overspeeding');
  };

  const handleDeleteZone = (id, name) => {
    if (confirm(`Are you sure you want to remove "${name}" from the hotspots directory?`)) {
      setHotspots(hotspots.filter(spot => spot.id !== id));
      setToastType('warning');
      setToastMessage(`Accident zone "${name}" removed from temporary session data.`);
    }
  };

  const viewOnMap = (spot) => {
    setIsDetailsOpen(false);
    navigate('/admin/map');
  };

  return (
    <div className="p-6 space-y-6">
      {/* Toast alert */}
      {toastMessage && (
        <NotificationToast 
          message={toastMessage} 
          type={toastType} 
          onClose={() => setToastMessage(null)} 
        />
      )}

      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-gray-200 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-navy-900">ACCIDENT HOTSPOT DIRECTORY</h1>
          <p className="text-gray-500 text-sm">Directory management of identified geospatial safety concerns in Nashik.</p>
        </div>
        <button
          onClick={() => setIsAddOpen(true)}
          className="mt-3 md:mt-0 flex items-center justify-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors border border-blue-500 cursor-pointer shadow-sm text-sm"
        >
          <Plus className="w-4 h-4" /> Add New Zone
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        {/* Search */}
        <div className="md:col-span-2 relative">
          <Search className="absolute left-3 top-3 text-gray-400 w-4 h-4" />
          <input 
            type="text" 
            placeholder="Search Zone, Road name, or Risk factors..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 pr-4 py-2 w-full rounded-lg border border-gray-300 bg-gray-50 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 hover:bg-gray-100 transition"
          />
        </div>

        {/* Risk dropdown */}
        <div className="relative">
          <Filter className="absolute left-3 top-3 text-gray-400 w-4 h-4" />
          <select
            value={riskFilter}
            onChange={(e) => setRiskFilter(e.target.value)}
            className="pl-9 pr-4 py-2 w-full rounded-lg border border-gray-300 bg-gray-50 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 hover:bg-gray-100 transition"
          >
            <option value="ALL">All Risk Levels</option>
            <option value="CRITICAL">Critical Risk</option>
            <option value="HIGH">High Risk</option>
            <option value="MEDIUM">Medium Risk</option>
            <option value="LOW">Low Risk</option>
          </select>
        </div>
      </div>

      {/* Directory Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-55 text-navy-950 font-semibold text-xs text-left uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Zone Name</th>
                <th className="px-6 py-4">Latitude, Longitude</th>
                <th className="px-6 py-4">Risk Level</th>
                <th className="px-6 py-4 text-center">Accident Count</th>
                <th className="px-6 py-4 text-center">Density</th>
                <th className="px-6 py-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100 text-sm">
              {filteredHotspots.length > 0 ? (
                filteredHotspots.map((spot) => (
                  <tr key={spot.id} className="hover:bg-slate-50 transition duration-150">
                    <td className="px-6 py-4 font-bold text-navy-900">{spot.name}</td>
                    <td className="px-6 py-4 font-mono text-xs text-gray-500">
                      {spot.lat.toFixed(5)}, {spot.lng.toFixed(5)}
                    </td>
                    <td className="px-6 py-4">
                      <RiskBadge level={spot.riskLevel} />
                    </td>
                    <td className="px-6 py-4 text-center font-semibold text-gray-700">{spot.accidentCount}</td>
                    <td className="px-6 py-4 text-center font-semibold text-gray-700">{spot.density}</td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center space-x-2">
                        <button
                          onClick={() => handleOpenDetails(spot)}
                          className="inline-flex items-center justify-center p-1.5 text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 rounded-lg transition"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteZone(spot.id, spot.name)}
                          className="inline-flex items-center justify-center p-1.5 text-red-600 hover:text-red-800 bg-red-50 hover:bg-red-100 rounded-lg transition"
                          title="Delete Zone"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-gray-400">
                    No accident hotspot zones match your search query or filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Details Modal */}
      <Modal 
        isOpen={isDetailsOpen} 
        onClose={() => setIsDetailsOpen(false)}
        title="Accident Hotspot Details"
      >
        {selectedHotspot && (
          <div className="space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="text-xl font-bold text-navy-900">{selectedHotspot.name}</h4>
                <p className="text-xs font-mono text-gray-400 mt-0.5">GPS: {selectedHotspot.lat.toFixed(6)}, {selectedHotspot.lng.toFixed(6)}</p>
              </div>
              <RiskBadge level={selectedHotspot.riskLevel} />
            </div>

            <div className="grid grid-cols-2 gap-4 border-t border-b border-gray-100 py-3">
              <div>
                <span className="text-xs text-gray-400 font-semibold block uppercase">Risk Score</span>
                <span className="text-2xl font-black text-blue-600">{selectedHotspot.riskScore}</span>
              </div>
              <div>
                <span className="text-xs text-gray-400 font-semibold block uppercase">Accident Frequency</span>
                <span className="text-2xl font-black text-red-500">{selectedHotspot.accidentCount} Incidents</span>
              </div>
              <div>
                <span className="text-xs text-gray-400 font-semibold block uppercase">Point Density</span>
                <span className="text-lg font-bold text-gray-800">{selectedHotspot.density}</span>
              </div>
              <div>
                <span className="text-xs text-gray-400 font-semibold block uppercase">Detection Engine</span>
                <span className="text-sm font-bold text-gray-800">{selectedHotspot.algorithm}</span>
              </div>
            </div>

            <div>
              <span className="text-xs text-gray-400 font-semibold block uppercase mb-1.5">Detected Risk Factors</span>
              <div className="flex flex-wrap gap-2">
                {selectedHotspot.riskFactors.map((factor, index) => (
                  <span 
                    key={index}
                    className="px-2.5 py-1 bg-slate-100 text-slate-700 text-xs font-semibold rounded-lg border border-slate-200"
                  >
                    {factor}
                  </span>
                ))}
              </div>
            </div>

            <div className="text-[11px] text-gray-400 italic">
              Record Last Audited & Updated: {selectedHotspot.lastUpdated}
            </div>

            <div className="pt-4 border-t border-gray-100 flex space-x-3">
              <button
                onClick={() => setIsDetailsOpen(false)}
                className="flex-1 py-2 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg transition-colors border border-slate-200 text-sm"
              >
                Close
              </button>
              <button
                onClick={() => viewOnMap(selectedHotspot)}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors border border-blue-500 text-sm"
              >
                <Map className="w-4 h-4" /> View on Map
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Add New Zone Modal */}
      <Modal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        title="Add New Accident Hotspot Zone"
      >
        <form onSubmit={handleAddZone} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase">Zone Name / Location</label>
            <input 
              type="text" 
              placeholder="e.g. Dwarka Flyover Entry"
              value={newZoneName}
              onChange={(e) => setNewZoneName(e.target.value)}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm bg-gray-50 focus:outline-none focus:ring-1 focus:ring-blue-500"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase">Latitude</label>
              <input 
                type="number" 
                step="0.0001"
                placeholder="19.9912"
                value={newLat}
                onChange={(e) => setNewLat(e.target.value)}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm bg-gray-50 focus:outline-none focus:ring-1 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase">Longitude</label>
              <input 
                type="number" 
                step="0.0001"
                placeholder="73.8015"
                value={newLng}
                onChange={(e) => setNewLng(e.target.value)}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm bg-gray-50 focus:outline-none focus:ring-1 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase">Risk Level</label>
              <select
                value={newRiskLevel}
                onChange={(e) => setNewRiskLevel(e.target.value)}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm bg-gray-50 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="CRITICAL">Critical</option>
                <option value="HIGH">High</option>
                <option value="MEDIUM">Medium</option>
                <option value="LOW">Low</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase">Risk Score (0.00 - 1.00)</label>
              <input 
                type="number" 
                step="0.01"
                min="0"
                max="1"
                placeholder="0.85"
                value={newRiskScore}
                onChange={(e) => setNewRiskScore(e.target.value)}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm bg-gray-50 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase">Accident Count</label>
              <input 
                type="number" 
                placeholder="35"
                value={newAccidentCount}
                onChange={(e) => setNewAccidentCount(e.target.value)}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm bg-gray-50 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase">Density Metric</label>
              <input 
                type="number" 
                step="0.1"
                placeholder="10.4"
                value={newDensity}
                onChange={(e) => setNewDensity(e.target.value)}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm bg-gray-50 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase">Risk Factors (Comma separated)</label>
            <input 
              type="text" 
              placeholder="e.g. Sharp Curve, Low light, Heavy Trucks"
              value={newRiskFactors}
              onChange={(e) => setNewRiskFactors(e.target.value)}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm bg-gray-50 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div className="pt-4 border-t border-gray-100 flex space-x-3">
            <button
              type="button"
              onClick={() => setIsAddOpen(false)}
              className="flex-1 py-2 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg transition-colors border border-slate-200 text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors border border-blue-500 text-sm"
            >
              Save Zone
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
