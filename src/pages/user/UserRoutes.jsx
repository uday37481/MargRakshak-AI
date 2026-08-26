import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MapView from '../../components/MapView';
import { mockRoutes } from '../../data/routes';
import { mockHotspots } from '../../data/hotspots';
import RiskBadge from '../../components/common/RiskBadge';
import NotificationToast from '../../components/common/NotificationToast';
import { Compass, ShieldCheck, ChevronRight, Navigation, RefreshCw } from 'lucide-react';

export default function UserRoutes() {
  const navigate = useNavigate();
  const [selectedRoute, setSelectedRoute] = useState(mockRoutes[0]); // Default to Route 1 (safest)
  const [toastMessage, setToastMessage] = useState(null);
  const [toastType, setToastType] = useState('success');

  const handleSelectRoute = (route) => {
    setSelectedRoute(route);
    setToastType('info');
    setToastMessage(`Switched map projection to: ${route.name}`);
  };

  const handleNavigateSafely = () => {
    setToastType('success');
    setToastMessage(`Pre-selecting ${selectedRoute.label}... Launching navigator.`);
    
    setTimeout(() => {
      // Redirect to UserNavigation page and pass the selected route's info
      navigate('/user/navigation', { state: { routeId: selectedRoute.id } });
    }, 1200);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Toast Alert */}
      {toastMessage && (
        <NotificationToast 
          message={toastMessage} 
          type={toastType} 
          onClose={() => setToastMessage(null)} 
        />
      )}

      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-navy-900">ROUTE COMPARISON & ACCIDENT RISK MATRIX</h1>
        <p className="text-gray-500 text-sm">Compare route variants by predictive risk scores rather than duration alone.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Route Comparison Matrix */}
        <div className="lg:col-span-1 space-y-6 flex flex-col justify-start">
          
          {/* Preferred Route Matrix */}
          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 space-y-4">
            <h2 className="text-sm font-bold text-navy-950 uppercase border-b border-gray-100 pb-2 flex items-center gap-1.5">
              <Compass className="w-4 h-4 text-blue-600" /> Select Preferred Route
            </h2>

            <div className="space-y-3">
              {mockRoutes.map((route) => {
                const isSelected = selectedRoute.id === route.id;
                return (
                  <div 
                    key={route.id}
                    onClick={() => handleSelectRoute(route)}
                    className={`p-4 rounded-xl border-2 transition-all cursor-pointer text-left ${
                      isSelected 
                        ? 'bg-blue-50 border-blue-500 ring-1 ring-blue-500 shadow-md scale-[1.01]' 
                        : 'bg-white border-gray-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-bold text-navy-900">{route.name}</span>
                      <RiskBadge level={route.riskLevel} />
                    </div>
                    
                    <div className="grid grid-cols-3 gap-2 text-xs border-b border-gray-100 pb-2 mb-2 font-mono">
                      <div>
                        <span className="text-[10px] text-gray-400 block font-semibold uppercase">Risk Score</span>
                        <span className={`font-bold ${route.riskScore > 0.7 ? 'text-red-500' : route.riskScore > 0.3 ? 'text-yellow-600' : 'text-green-600'}`}>
                          {route.riskScore}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-gray-400 block font-semibold uppercase">Distance</span>
                        <span className="text-gray-700 font-bold">{route.distance}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-gray-400 block font-semibold uppercase">Hotspots</span>
                        <span className="text-gray-700 font-bold">{route.totalHotspots}</span>
                      </div>
                    </div>

                    <p className="text-xs text-gray-500 leading-relaxed">{route.details}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Selection Stats and Navigation Actions */}
          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex-1 flex flex-col justify-between">
            <div className="space-y-4">
              <h2 className="text-xs font-bold text-navy-950 uppercase border-b border-gray-100 pb-2 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-green-500" /> Selected Route Analytics
              </h2>

              <div className="bg-slate-50 p-4 rounded-xl border border-gray-100 space-y-3">
                <div className="flex justify-between items-center text-sm font-bold text-navy-900 border-b border-gray-200 pb-2">
                  <span>SELECTED ROUTE:</span>
                  <span className="text-blue-600 font-extrabold">{selectedRoute.label}</span>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-[10px] text-gray-400 font-semibold block uppercase">Travel Duration</span>
                    <span className="text-sm font-bold text-gray-800">{selectedRoute.time}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-400 font-semibold block uppercase">Safety Clearance</span>
                    <span className="text-sm font-bold text-gray-800">
                      {selectedRoute.totalHotspots === 0 ? '🟢 100% Clear' : `⚠️ ${selectedRoute.totalHotspots} Alert zone(s)`}
                    </span>
                  </div>
                </div>

                {/* Extra Distance/Time indicator relative to fastest route */}
                <div className="text-[11px] text-slate-500 pt-1">
                  {selectedRoute.id === 1 && (
                    <span className="text-green-600 font-bold">Safest Option: +1.5 km (+4 mins vs Highway)</span>
                  )}
                  {selectedRoute.id === 2 && (
                    <span className="text-yellow-600 font-bold">Medium Option: +0.3 km (+2 mins vs Highway)</span>
                  )}
                  {selectedRoute.id === 3 && (
                    <span className="text-red-500 font-bold">Fastest but Risky: Highway route, active speed violations</span>
                  )}
                </div>
              </div>
            </div>

            <button
              onClick={handleNavigateSafely}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors border border-blue-500 cursor-pointer shadow-sm text-sm mt-6"
            >
              <Navigation className="w-4 h-4" /> Navigate Safely
            </button>
          </div>
        </div>

        {/* Right Column: Leaflet Map */}
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
