import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MapView from '../../components/MapView';
import { mockRoutes } from '../../data/routes';
import { mockHotspots } from '../../data/hotspots';
import RiskBadge from '../../components/common/RiskBadge';
import NotificationToast from '../../components/common/NotificationToast';
import { useGeolocation } from '../../hooks/useGeolocation';
import { voiceAlert } from '../../utils/voice';
import { MapPin, Navigation, Volume2, VolumeX, Play, AlertCircle } from 'lucide-react';

export default function UserNavigation() {
  const navigate = useNavigate();
  const { location: userLoc } = useGeolocation(false); // default mock location College Road
  
  const [source, setSource] = useState('My Location (BYK College Road)');
  const [destination, setDestination] = useState('Nashik Road Railway Station');
  const [routeType, setRouteType] = useState('safest'); // safest vs fastest
  const [selectedRoute, setSelectedRoute] = useState(mockRoutes[0]); // Route 1 safest default
  
  const [voiceOn, setVoiceOn] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [toastType, setToastType] = useState('success');

  // Sync selectedRoute depending on routeType toggle
  useEffect(() => {
    if (routeType === 'safest') {
      setSelectedRoute(mockRoutes[0]); // Route 1
    } else {
      setSelectedRoute(mockRoutes[2]); // Route 3 (highway)
    }
  }, [routeType]);

  const handleVoiceToggle = () => {
    const nextVoiceState = !voiceOn;
    setVoiceOn(nextVoiceState);
    voiceAlert.setMute(!nextVoiceState);

    if (nextVoiceState) {
      setToastType('success');
      setToastMessage("Speech alert active. Safety notices will be read aloud.");
      voiceAlert.speak("Voice guidance activated. MargRakshak AI will monitor safety concerns along your route.");
    } else {
      setToastType('info');
      setToastMessage("Speech alert muted.");
      voiceAlert.cancel();
    }
  };

  const handleStartTrip = () => {
    setToastType('success');
    setToastMessage("Trip started! Loading Live Monitor...");
    
    // Play sound notification
    if (voiceOn) {
      voiceAlert.speak("Trip started. Approaching live route. Drive safely.");
    }

    setTimeout(() => {
      // Navigate to User Alerts page to simulate the active driving scenario
      // Pass the selected route ID so the Alerts page knows which route is active
      navigate('/user/alerts', { state: { routeId: selectedRoute.id, voiceOn: voiceOn } });
    }, 1500);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Toast popup */}
      {toastMessage && (
        <NotificationToast 
          message={toastMessage} 
          type={toastType} 
          onClose={() => setToastMessage(null)} 
        />
      )}

      {/* Title */}
      <div>
        <h1 className="text-xl font-bold text-navy-900 uppercase">Start Navigation</h1>
        <p className="text-gray-500 text-sm">Design safest routes bypassing critical risk hotspots around Nashik.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Form & Route Summary */}
        <div className="lg:col-span-1 space-y-6 flex flex-col justify-start">
          
          {/* Navigation Inputs Form */}
          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 space-y-4">
            <h2 className="text-sm font-bold text-navy-950 uppercase border-b border-gray-100 pb-2 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-blue-600" /> Start Navigation
            </h2>

            <div className="space-y-3">
              {/* Source */}
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase">Source Location</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-green-500 text-xs">📍</span>
                  </div>
                  <input 
                    type="text" 
                    value={source} 
                    onChange={(e) => setSource(e.target.value)}
                    className="block w-full pl-8 pr-3 py-1.5 text-sm rounded-lg border border-gray-300 bg-gray-50 focus:outline-none"
                    placeholder="Enter starting point"
                  />
                </div>
              </div>

              {/* Destination */}
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase">Destination Location</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-red-500 text-xs">🏁</span>
                  </div>
                  <input 
                    type="text" 
                    value={destination} 
                    onChange={(e) => setDestination(e.target.value)}
                    className="block w-full pl-8 pr-3 py-1.5 text-sm rounded-lg border border-gray-300 bg-gray-50 focus:outline-none"
                    placeholder="Enter destination"
                  />
                </div>
              </div>
            </div>

            {/* Route Option Switcher */}
            <div className="border-t border-gray-100 pt-3">
              <label className="block text-[10px] font-bold text-gray-400 uppercase mb-2">Route Optimization Option</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setRouteType('safest')}
                  className={`py-2 px-3 text-xs font-bold rounded-lg border text-center transition cursor-pointer ${
                    routeType === 'safest'
                      ? 'bg-green-55 bg-green-50 border-green-500 text-green-700'
                      : 'bg-slate-50 border-gray-200 text-gray-600 hover:bg-slate-100'
                  }`}
                >
                  🟢 Safest Route
                </button>
                <button
                  type="button"
                  onClick={() => setRouteType('fastest')}
                  className={`py-2 px-3 text-xs font-bold rounded-lg border text-center transition cursor-pointer ${
                    routeType === 'fastest'
                      ? 'bg-red-50 border-red-500 text-red-700'
                      : 'bg-slate-50 border-gray-200 text-gray-600 hover:bg-slate-100'
                  }`}
                >
                  🔴 Fastest (Highway)
                </button>
              </div>
            </div>
          </div>

          {/* Route Safety Summary Card */}
          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex-1 flex flex-col justify-between">
            <div className="space-y-4">
              <h2 className="text-sm font-bold text-navy-950 uppercase border-b border-gray-100 pb-2 flex items-center gap-1.5">
                <Navigation className="w-4 h-4 text-blue-600" /> Route Safety Summary
              </h2>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-[10px] text-gray-400 font-semibold block uppercase">Est. Distance</span>
                  <span className="text-lg font-black text-navy-900">{selectedRoute.distance}</span>
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 font-semibold block uppercase">Est. Time</span>
                  <span className="text-lg font-black text-navy-900">{selectedRoute.time}</span>
                </div>
              </div>

              <div>
                <span className="text-[10px] text-gray-400 font-semibold block uppercase">Accident Risk Level</span>
                <div className="mt-1">
                  <RiskBadge level={selectedRoute.riskLevel} />
                </div>
              </div>

              <div className="border-t border-gray-100 pt-3">
                <span className="text-[10px] text-gray-400 font-bold block uppercase mb-2">En Route Hotspots ({selectedRoute.totalHotspots})</span>
                
                {selectedRoute.totalHotspots > 0 ? (
                  <div className="space-y-2.5">
                    {selectedRoute.hotspotsEnRoute.map((spot, i) => (
                      <div key={i} className="flex items-start space-x-2 bg-red-50/50 p-2.5 rounded-lg border border-red-100">
                        <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                        <div>
                          <div className="text-xs font-bold text-red-900">{spot.name}</div>
                          <div className="text-[10px] text-red-700">{spot.detail} ({spot.risk} risk)</div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-xs text-green-700 bg-green-50 p-3 rounded-lg font-semibold text-center border border-green-200">
                    🟢 Zero critical clusters en-route. Safe path.
                  </div>
                )}
              </div>
            </div>

            {/* Start Trip & Mute Controls */}
            <div className="pt-4 border-t border-gray-100 grid grid-cols-3 gap-2 mt-4">
              <button
                type="button"
                onClick={handleVoiceToggle}
                className={`py-2 px-3 rounded-lg border text-center flex items-center justify-center font-bold text-xs cursor-pointer transition ${
                  voiceOn 
                    ? 'bg-blue-100 border-blue-300 text-blue-800 hover:bg-blue-200' 
                    : 'bg-slate-50 border-gray-200 text-gray-500 hover:bg-slate-100'
                }`}
                title={voiceOn ? "Mute Voice Alerts" : "Unmute Voice Alerts"}
              >
                {voiceOn ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
                <span className="ml-1 hidden sm:inline">{voiceOn ? 'ON' : 'OFF'}</span>
              </button>
              <button
                type="button"
                onClick={handleStartTrip}
                className="col-span-2 py-2 px-4 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg transition-colors border border-green-500 flex items-center justify-center gap-1.5 shadow-sm text-xs cursor-pointer"
              >
                <Play className="w-4 h-4" /> START TRIP
              </button>
            </div>
          </div>
        </div>

        {/* Right Side: Leaflet map */}
        <div className="lg:col-span-2 h-[550px] flex flex-col">
          <MapView 
            hotspots={mockHotspots}
            selectedRoute={selectedRoute}
            userLocation={{ latitude: 20.0084, longitude: 73.7635, speed: 0 }} // Center on College Road start point
            showPins={true}
            showKde={true}
            showSpeedLimits={false}
            zoom={13}
          />
        </div>
      </div>
    </div>
  );
}
