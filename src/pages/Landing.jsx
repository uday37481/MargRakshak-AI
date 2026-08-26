import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, Car, ShieldCheck, MapPin } from 'lucide-react';

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-6 text-white font-sans">
      <div className="max-w-4xl w-full text-center space-y-8">
        {/* Title / Logo */}
        <div className="space-y-4">
          <div className="inline-flex items-center justify-center p-4 bg-red-600/10 rounded-full border border-red-500/20 text-red-500 animate-pulse">
            <ShieldAlert className="w-16 h-16" />
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight text-white">
            MARG<span className="text-blue-500">RAKSHAK</span> AI
          </h1>
          <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto">
            AI-Based Accident Risk Prediction System & Spatio-Temporal Hotspot Analyzer for Nashik City, Maharashtra.
          </p>
        </div>

        {/* Info Tags */}
        <div className="flex flex-wrap justify-center gap-3 max-w-md mx-auto pt-2">
          <div className="flex items-center px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-xs text-slate-300">
            <MapPin className="w-3.5 h-3.5 mr-1 text-blue-400" /> Nashik City
          </div>
          <div className="flex items-center px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-xs text-slate-300">
            <ShieldCheck className="w-3.5 h-3.5 mr-1 text-green-400" /> GIS & HDBSCAN Clustering
          </div>
          <div className="flex items-center px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-xs text-slate-300">
            🚨 Final Year Project Demo
          </div>
        </div>

        {/* Selection Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto pt-8">
          {/* Admin Card */}
          <div 
            onClick={() => navigate('/admin/map')}
            className="group relative bg-slate-800 border border-slate-700 rounded-2xl p-8 cursor-pointer hover:border-blue-500 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300 text-left flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="inline-flex p-3 bg-blue-600/10 text-blue-500 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold group-hover:text-blue-400 transition-colors duration-300">
                Traffic Authority Portal
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Access interactive GIS maps, monitor HDBSCAN clusters, analyze spatio-temporal trends, retrain ML models, and manage reports.
              </p>
            </div>
            <div className="mt-8 flex items-center text-sm font-semibold text-blue-500 group-hover:translate-x-1 transition-transform">
              Enter Admin Panel &rarr;
            </div>
          </div>

          {/* User/Driver Card */}
          <div 
            onClick={() => navigate('/user/navigation')}
            className="group relative bg-slate-800 border border-slate-700 rounded-2xl p-8 cursor-pointer hover:border-green-500 hover:shadow-2xl hover:shadow-green-500/10 transition-all duration-300 text-left flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="inline-flex p-3 bg-green-600/10 text-green-500 rounded-xl group-hover:bg-green-600 group-hover:text-white transition-colors duration-300">
                <Car className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold group-hover:text-green-400 transition-colors duration-300">
                Driver Navigation & Alerts
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Plan safe routes, review en-route safety hazards, receive real-time proximity voice warnings, and monitor speed limits.
              </p>
            </div>
            <div className="mt-8 flex items-center text-sm font-semibold text-green-500 group-hover:translate-x-1 transition-transform">
              Enter Driver App &rarr;
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-slate-500 text-xs pt-12">
          &copy; 2026 MargRakshak AI Project Team. Build for Academic Review & Viva.
        </div>
      </div>
    </div>
  );
}
