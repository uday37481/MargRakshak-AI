import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import MapView from '../../components/MapView';
import { mockHotspots } from '../../data/hotspots';
import { mockRoutes } from '../../data/routes';
import NotificationToast from '../../components/common/NotificationToast';
import { voiceAlert } from '../../utils/voice';
import { 
  AlertTriangle, 
  Volume2, 
  VolumeX, 
  Milestone, 
  CheckCircle, 
  Play, 
  Pause, 
  HelpCircle,
  TrendingUp,
  MapPin,
  Car
} from 'lucide-react';

export default function UserAlerts() {
  const routerLocation = useLocation();
  const navigate = useNavigate();
  
  // Retrieve configuration from UserNavigation page if available
  const passedRouteId = routerLocation.state?.routeId || 3; // default to Highway (Route 3) to show Dwarka alerts
  const passedVoiceState = routerLocation.state?.voiceOn || false;

  // Simulation states
  const [isPlaying, setIsPlaying] = useState(false);
  const [distance, setDistance] = useState(500); // meters to hotspot
  const [speed, setSpeed] = useState(65); // km/h
  const [speedLimit, setSpeedLimit] = useState(40); // km/h
  const [voiceMuted, setVoiceMuted] = useState(!passedVoiceState);
  const [rerouted, setRerouted] = useState(false);
  const [activeHotspot, setActiveHotspot] = useState(mockHotspots[0]); // Dwarka Circle default

  // Toast notifications
  const [toastMessage, setToastMessage] = useState(null);
  const [toastType, setToastType] = useState('success');

  const simulationInterval = useRef(null);
  const speechCooldown = useRef(false);

  // Sync route safety speed limits depending on rerouting
  useEffect(() => {
    if (rerouted) {
      setSpeedLimit(60); // alternate route limit is higher
    } else {
      setSpeedLimit(40); // Dwarka Circle limit is 40
    }
  }, [rerouted]);

  // Voice Alert triggers when distance reaches critical steps
  useEffect(() => {
    if (voiceMuted || rerouted) return;

    if (distance === 300 && !speechCooldown.current) {
      voiceAlert.speak("Warning. High risk accident hotspot ahead: Dwarka Circle. 300 meters.");
      triggerCooldown();
    } else if (distance === 100 && !speechCooldown.current) {
      if (speed > speedLimit) {
        voiceAlert.speak("Alert. Speed limit violation. Reduce speed immediately. Critical intersection ahead.");
      } else {
        voiceAlert.speak("Caution. Entering Dwarka Circle. Heavy merging traffic.");
      }
      triggerCooldown();
    }
  }, [distance, voiceMuted, speed, speedLimit, rerouted]);

  const triggerCooldown = () => {
    speechCooldown.current = true;
    setTimeout(() => {
      speechCooldown.current = false;
    }, 1500);
  };

  // Play/Pause Auto Simulation Timer
  useEffect(() => {
    if (isPlaying) {
      simulationInterval.current = setInterval(() => {
        setDistance(prevDist => {
          if (prevDist <= 50) {
            setIsPlaying(false);
            setToastType('warning');
            setToastMessage("You have safely passed through the Dwarka Circle intersection.");
            return 500; // Reset
          }
          return prevDist - 50;
        });
      }, 2000);
    } else {
      clearInterval(simulationInterval.current);
    }

    return () => clearInterval(simulationInterval.current);
  }, [isPlaying]);

  const handleMuteToggle = () => {
    const nextMute = !voiceMuted;
    setVoiceMuted(nextMute);
    voiceAlert.setMute(nextMute);
    
    setToastType('info');
    setToastMessage(nextMute ? "Voice safety warnings muted." : "Voice safety warnings unmuted.");
    
    if (!nextMute) {
      voiceAlert.speak("Voice warnings active.");
    }
  };

  const handleReroute = () => {
    setRerouted(true);
    setIsPlaying(false);
    setDistance(600); // reset distance to far
    setToastType('success');
    setToastMessage("Alternative safer route selected! Rerouting via Canada Corner & Golf Club.");
    
    if (!voiceMuted) {
      voiceAlert.speak("Rerouting selected. Switched to alternative safe path. Bypassing critical congestion at Dwarka Circle.");
    }
  };

  const isSpeedViolation = speed > speedLimit;

  // Resolve Map Route Coordinates based on state
  const currentRouteData = rerouted ? mockRoutes[0] : mockRoutes[passedRouteId - 1];

  return (
    <div className="p-6 space-y-6">
      {/* Toast Ingest alerts */}
      {toastMessage && (
        <NotificationToast 
          message={toastMessage} 
          type={toastType} 
          onClose={() => setToastMessage(null)} 
        />
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-gray-200 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-navy-900">LIVE TRIP MONITORING & SAFETY ALERTS</h1>
          <p className="text-gray-500 text-sm">Simulating GPS tracking feeds & proximity hotspot alarms.</p>
        </div>
        <div className="mt-2 md:mt-0 flex items-center space-x-2 bg-blue-50 border border-blue-100 rounded-lg p-2 text-xs font-semibold text-blue-700">
          <Car className="w-4 h-4" />
          <span>Active Route: {currentRouteData.label}</span>
        </div>
      </div>

      {/* Top Banner simulation panel */}
      <div className="bg-slate-900 text-white p-4 rounded-xl shadow-lg border border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <span className="flex h-3.5 w-3.5 relative">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isPlaying ? 'bg-red-400' : 'bg-yellow-400'}`}></span>
            <span className={`relative inline-flex rounded-full h-3.5 w-3.5 ${isPlaying ? 'bg-red-500' : 'bg-yellow-500'}`}></span>
          </span>
          <div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest font-mono">Simulation Console</div>
            <div className="text-sm font-semibold">{isPlaying ? 'Active GPS Tracking Simulation' : 'Simulation Paused'}</div>
          </div>
        </div>

        {/* Manual Simulation Controls */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Distance Toggles */}
          <div className="flex items-center space-x-1.5 bg-slate-800 rounded-lg p-1 border border-slate-700">
            <Milestone className="w-3.5 h-3.5 text-blue-400 ml-1.5" />
            <span className="text-xs text-slate-300 font-mono pr-1.5 font-bold">Dist: {distance}m</span>
            {[500, 300, 200, 100, 50].map((d) => (
              <button
                key={d}
                onClick={() => {
                  setDistance(d);
                  setIsPlaying(false);
                }}
                className={`px-2 py-0.5 rounded text-[10px] font-bold transition font-mono ${
                  distance === d 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
              >
                {d}m
              </button>
            ))}
          </div>

          {/* Speed slider */}
          <div className="flex items-center space-x-2 bg-slate-800 rounded-lg p-1 px-2.5 border border-slate-700 text-xs">
            <span className="text-slate-300 font-bold">Speed: {speed} km/h</span>
            <input 
              type="range"
              min="30"
              max="85"
              value={speed}
              onChange={(e) => setSpeed(parseInt(e.target.value))}
              className="w-20 accent-blue-500 h-1"
            />
          </div>

          {/* Play/Pause Button */}
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition text-xs cursor-pointer"
          >
            {isPlaying ? (
              <><Pause className="w-3.5 h-3.5" /> Pause</>
            ) : (
              <><Play className="w-3.5 h-3.5" /> Auto Drive</>
            )}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Proximity Alert Cards */}
        <div className="lg:col-span-1 space-y-6 flex flex-col justify-start">
          
          {/* CRITICAL WARNING CARD */}
          {!rerouted ? (
            <div className={`p-6 rounded-xl border-2 shadow-md transition-all duration-300 ${
              distance <= 100 
                ? 'bg-red-50 border-red-500 text-red-900 animate-pulse shadow-red-100' 
                : distance <= 300 
                  ? 'bg-orange-50 border-orange-400 text-orange-900 shadow-orange-50'
                  : 'bg-yellow-50 border-yellow-300 text-yellow-900 shadow-yellow-50'
            }`}>
              <div className="flex items-center gap-2.5 mb-4">
                <AlertTriangle className={`w-8 h-8 ${distance <= 100 ? 'text-red-600' : 'text-orange-500'}`} />
                <div>
                  <h2 className="text-xs font-bold uppercase tracking-wider opacity-75">Proximity Hazard warning</h2>
                  <h3 className="text-base font-extrabold">🚨 CRITICAL ALERT</h3>
                </div>
              </div>

              <div className="space-y-3">
                <div className="text-lg font-black leading-snug">
                  APPROACHING ACCIDENT HOTSPOT!
                </div>
                <div>
                  <span className="text-xs font-semibold block uppercase text-slate-500">Location</span>
                  <span className="text-base font-extrabold">{activeHotspot.name} (~{distance}m ahead)</span>
                </div>
                <div>
                  <span className="text-xs font-semibold block uppercase text-slate-500">Risk Factor</span>
                  <span className="text-sm font-bold text-slate-700">High Density Cluster + Monsoon Wet Surface</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-green-50 border border-green-200 p-6 rounded-xl shadow-md text-green-900 space-y-4">
              <div className="flex items-center gap-2.5">
                <CheckCircle className="w-8 h-8 text-green-600" />
                <div>
                  <h2 className="text-xs font-bold uppercase tracking-wider text-green-700">Navigation Route</h2>
                  <h3 className="text-base font-extrabold">Route Safe</h3>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <p className="font-bold text-green-950">Alternative safer route selected.</p>
                <p className="text-green-800">Bypassed Dwarka Circle critical accident zone. Currently traversing via Sharanpur Road.</p>
              </div>
            </div>
          )}

          {/* Speedometer Card */}
          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Speed details */}
            <div className={`p-4 rounded-xl border flex flex-col justify-between ${
              isSpeedViolation ? 'bg-red-50 border-red-200 text-red-900' : 'bg-slate-50 border-gray-100'
            }`}>
              <div>
                <span className="text-[10px] text-gray-400 font-bold block uppercase">Your Speed</span>
                <span className={`text-2xl font-black ${isSpeedViolation ? 'text-red-600' : 'text-navy-900'}`}>{speed} km/h</span>
              </div>
              <div className="mt-2 text-xs font-bold">
                {isSpeedViolation ? (
                  <span className="text-red-600 flex items-center gap-1">⚠️ OVER SPEED</span>
                ) : (
                  <span className="text-green-600">🟢 Safe velocity</span>
                )}
              </div>
            </div>

            {/* Speed limits */}
            <div className="bg-slate-50 border border-gray-100 p-4 rounded-xl flex flex-col justify-between">
              <div>
                <span className="text-[10px] text-gray-400 font-bold block uppercase">Zone Limit</span>
                <span className="text-2xl font-black text-navy-950">{speedLimit} km/h</span>
              </div>
              <div className="mt-2 text-xs font-bold text-gray-500">
                {rerouted ? 'Alternate Path limit' : 'Hotspot buffer limit'}
              </div>
            </div>

            {isSpeedViolation && (
              <div className="col-span-2 bg-red-100 border border-red-200 text-red-800 p-3 rounded-lg text-xs font-bold text-center">
                🚨 SPEED VIOLATION DETECTED! PLEASE SLOW DOWN
              </div>
            )}
          </div>

          {/* Safety Action Options */}
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 grid grid-cols-2 gap-3">
            <button
              onClick={handleMuteToggle}
              className={`py-2 px-3 rounded-lg border text-center flex items-center justify-center font-bold text-xs cursor-pointer transition ${
                voiceMuted 
                  ? 'bg-slate-200 border-slate-300 text-slate-700' 
                  : 'bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100'
              }`}
            >
              {voiceMuted ? <VolumeX className="w-4 h-4 mr-1.5" /> : <Volume2 className="w-4 h-4 mr-1.5" />}
              {voiceMuted ? "Unmute Alert" : "Mute Alert"}
            </button>
            <button
              onClick={handleReroute}
              disabled={rerouted}
              className={`py-2 px-3 font-bold rounded-lg border text-center text-xs transition cursor-pointer ${
                rerouted 
                  ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed' 
                  : 'bg-green-600 hover:bg-green-700 border-green-500 text-white shadow-sm'
              }`}
            >
              🔁 Reroute Alternative
            </button>
          </div>
        </div>

        {/* Right Column: Live Map view */}
        <div className="lg:col-span-2 h-[550px] flex flex-col">
          <MapView 
            hotspots={mockHotspots}
            selectedRoute={currentRouteData}
            userLocation={{ 
              latitude: currentRouteData.path[Math.max(0, currentRouteData.path.length - 2 - Math.floor(distance/150))][0],
              longitude: currentRouteData.path[Math.max(0, currentRouteData.path.length - 2 - Math.floor(distance/150))][1],
              speed: speed 
            }}
            showPins={true}
            showKde={true}
            showSpeedLimits={true}
            zoom={15}
          />
        </div>
      </div>
    </div>
  );
}
