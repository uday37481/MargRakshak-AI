import React, { useState } from 'react';
import { mockModelPerformance, mockRiskFactors, mockClusteringMethods, mockTemporalTrends } from '../../data/analytics';
import NotificationToast from '../../components/common/NotificationToast';
import { Cpu, RefreshCw, BarChart2, Calendar, Clock, CloudRain, AlertTriangle, Moon } from 'lucide-react';

export default function AdminAnalysis() {
  const [selectedHour, setSelectedHour] = useState(18); // default to evening peak 18:00
  const [toastMessage, setToastMessage] = useState(null);
  const [toastType, setToastType] = useState('info');

  const handleRetrain = () => {
    setToastType('warning');
    setToastMessage("Initiating ML Pipeline Retraining... Connecting to FastAPI server...");
    
    // Simulate training progress
    setTimeout(() => {
      setToastType('success');
      setToastMessage("Model retraining complete! Metrics updated to RiskPredict-v2.4 (Accuracy: 91.4%).");
    }, 2500);
  };

  const getIncidentsForHour = (hr) => {
    const record = mockTemporalTrends.find(item => item.hour === hr);
    return record ? record.incidents : 0;
  };

  // SVG Chart Dimensions
  const chartHeight = 160;
  const chartWidth = 500;
  const maxIncidents = Math.max(...mockTemporalTrends.map(t => t.incidents));

  // Compute SVG Points for the trends line
  const points = mockTemporalTrends.map((t, index) => {
    const x = (index / 24) * chartWidth + 10;
    const y = chartHeight - (t.incidents / maxIncidents) * (chartHeight - 20) - 10;
    return `${x},${y}`;
  }).join(' ');

  // Get current hour slider string
  const formatHourString = (hr) => {
    return `${hr.toString().padStart(2, '0')}:00`;
  };

  const currentIncidents = getIncidentsForHour(selectedHour);

  return (
    <div className="p-6 space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <NotificationToast 
          message={toastMessage} 
          type={toastType} 
          onClose={() => setToastMessage(null)} 
        />
      )}

      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-navy-900">SPATIO-TEMPORAL & MODEL ACCURACY ANALYSIS</h1>
        <p className="text-gray-500 text-sm">Review risk predictor parameters, clustering algorithms, and temporal accident distributions.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Columns (Spatio-Temporal Trend & Risk Factors) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Section 1: Accident Trends Over Time */}
          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-md font-bold text-navy-900 flex items-center gap-2">
                <BarChart2 className="w-5 h-5 text-blue-600" /> Accident Trends Over Time
              </h2>
              <span className="bg-blue-50 text-blue-700 text-xs font-semibold px-2.5 py-1 rounded">
                Hourly Distribution
              </span>
            </div>

            {/* SVG Chart */}
            <div className="relative border border-gray-100 rounded-lg p-4 bg-slate-50">
              <div className="text-xs text-gray-400 mb-1">Incidents count vs. Hour of Day</div>
              
              <svg 
                viewBox={`0 0 ${chartWidth} ${chartHeight}`} 
                className="w-full h-44 overflow-visible"
              >
                {/* Horizontal grid lines */}
                <line x1="0" y1="10" x2={chartWidth} y2="10" stroke="#E2E8F0" strokeDasharray="3" />
                <line x1="0" y1="80" x2={chartWidth} y2="80" stroke="#E2E8F0" strokeDasharray="3" />
                <line x1="0" y1="150" x2={chartWidth} y2="150" stroke="#CBD5E1" strokeWidth="2" />
                
                {/* Graph line */}
                <polyline
                  fill="none"
                  stroke="#3B82F6"
                  strokeWidth="3.5"
                  points={points}
                />

                {/* Highlight selected hour point */}
                {(() => {
                  const x = (selectedHour / 24) * chartWidth + 10;
                  const y = chartHeight - (currentIncidents / maxIncidents) * (chartHeight - 20) - 10;
                  return (
                    <g>
                      <circle cx={x} cy={y} r="6" fill="#EF4444" stroke="#FFFFFF" strokeWidth="2" />
                      <line x1={x} y1={y} x2={x} y2="150" stroke="#EF4444" strokeDasharray="3" />
                    </g>
                  );
                })()}
              </svg>

              {/* X Axis Labels */}
              <div className="flex justify-between text-[10px] text-gray-400 font-semibold px-1 mt-1 font-mono">
                <span>00:00</span>
                <span>04:00</span>
                <span>08:00</span>
                <span>12:00</span>
                <span>16:00</span>
                <span>20:00</span>
                <span>23:59</span>
              </div>
            </div>

            {/* Time Slider Control */}
            <div className="space-y-2 bg-slate-50 p-4 rounded-lg border border-gray-100">
              <div className="flex justify-between text-sm font-semibold text-gray-700">
                <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-blue-600" /> Time: {formatHourString(selectedHour)}</span>
                <span className="text-red-500 font-bold">Incidents: {currentIncidents}</span>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-xs text-gray-400 font-mono">00:00</span>
                <input 
                  type="range" 
                  min="0" 
                  max="23" 
                  value={selectedHour}
                  onChange={(e) => setSelectedHour(parseInt(e.target.value))}
                  className="flex-grow h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <span className="text-xs text-gray-400 font-mono">23:59</span>
              </div>
              <p className="text-xs text-gray-500 italic text-center">
                Use the time slider above to view incident frequencies at different times of the day (Dwarka Circle peaks between 17:00 and 19:00).
              </p>
            </div>
          </div>

          {/* Section 2: Risk Factors Distribution */}
          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 space-y-4">
            <h2 className="text-md font-bold text-navy-900 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-orange-500" /> Primary Risk Factors Distribution
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              {/* Rain/Weather */}
              <div className="border border-gray-100 rounded-xl p-4 bg-slate-50 flex items-start space-x-3">
                <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                  <CloudRain className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <span className="text-xs font-semibold text-gray-400 uppercase">Weather</span>
                  <span className="block font-bold text-gray-800 text-sm">Rain / Wet Roads</span>
                  <div className="mt-2 flex items-center justify-between">
                    <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2">
                      <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: '62%' }}></div>
                    </div>
                    <span className="text-sm font-bold text-blue-600">62%</span>
                  </div>
                </div>
              </div>

              {/* Road Condition */}
              <div className="border border-gray-100 rounded-xl p-4 bg-slate-50 flex items-start space-x-3">
                <div className="p-2 bg-orange-100 text-orange-600 rounded-lg">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <span className="text-xs font-semibold text-gray-400 uppercase">Road Condition</span>
                  <span className="block font-bold text-gray-800 text-sm">Construction Work</span>
                  <div className="mt-2 flex items-center justify-between">
                    <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2">
                      <div className="bg-orange-500 h-2.5 rounded-full" style={{ width: '28%' }}></div>
                    </div>
                    <span className="text-sm font-bold text-orange-600">28%</span>
                  </div>
                </div>
              </div>

              {/* Night Condition */}
              <div className="border border-gray-100 rounded-xl p-4 bg-slate-50 flex items-start space-x-3">
                <div className="p-2 bg-indigo-100 text-indigo-950 rounded-lg">
                  <Moon className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <span className="text-xs font-semibold text-gray-400 uppercase">Temporal Factor</span>
                  <span className="block font-bold text-gray-800 text-sm">Night / Low Light</span>
                  <div className="mt-2 flex items-center justify-between">
                    <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2">
                      <div className="bg-indigo-950 h-2.5 rounded-full" style={{ width: '54%' }}></div>
                    </div>
                    <span className="text-sm font-bold text-indigo-950">54%</span>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* Right Columns (Model Accuracy Stats & Clustering Models) */}
        <div className="space-y-6">
          
          {/* Section 3: Model Performance Stats */}
          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 space-y-4">
            <h2 className="text-md font-bold text-navy-900 flex items-center gap-2">
              <Cpu className="w-5 h-5 text-blue-600" /> Model Performance
            </h2>
            <div className="space-y-3">
              <div className="bg-slate-50 p-3 rounded-lg border border-gray-100 flex justify-between items-center">
                <span className="text-xs font-semibold text-gray-500">MODEL ENGINE</span>
                <span className="text-sm font-bold text-navy-900">{mockModelPerformance.modelName}</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-50 p-3 rounded-lg border border-gray-100">
                  <span className="text-xs font-semibold text-gray-400 block uppercase">Accuracy</span>
                  <span className="text-xl font-black text-blue-600">{mockModelPerformance.accuracy}%</span>
                </div>
                <div className="bg-slate-50 p-3 rounded-lg border border-gray-100">
                  <span className="text-xs font-semibold text-gray-400 block uppercase">Precision</span>
                  <span className="text-xl font-black text-navy-900">{mockModelPerformance.precision}%</span>
                </div>
                <div className="bg-slate-50 p-3 rounded-lg border border-gray-100">
                  <span className="text-xs font-semibold text-gray-400 block uppercase">Recall</span>
                  <span className="text-xl font-black text-navy-900">{mockModelPerformance.recall}%</span>
                </div>
                <div className="bg-slate-50 p-3 rounded-lg border border-gray-100">
                  <span className="text-xs font-semibold text-gray-400 block uppercase">F1 Score</span>
                  <span className="text-xl font-black text-navy-900">{mockModelPerformance.f1Score}%</span>
                </div>
              </div>
              <div className="bg-slate-50 p-3 rounded-lg border border-gray-100 flex justify-between items-center">
                <span className="text-xs font-semibold text-gray-500">RISK THRESHOLD</span>
                <span className="text-sm font-bold text-navy-900">{mockModelPerformance.threshold}</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-lg border border-gray-100 flex justify-between items-center">
                <span className="text-xs font-semibold text-gray-500">STATUS</span>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-green-100 text-green-800">
                  {mockModelPerformance.status}
                </span>
              </div>
            </div>

            <button 
              onClick={handleRetrain}
              className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-navy-900 hover:bg-navy-800 text-white font-bold rounded-lg transition-colors border border-navy-850 cursor-pointer shadow-sm text-sm"
            >
              <RefreshCw className="w-4 h-4" /> Retrain Model 🔄
            </button>
            <p className="text-[10px] text-gray-400 text-center">Last trained: {mockModelPerformance.lastRetrained}</p>
          </div>

          {/* Section 4: Cluster Methods */}
          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 space-y-4">
            <h2 className="text-md font-bold text-navy-900">Cluster Methods Comparison</h2>
            <div className="space-y-3">
              {mockClusteringMethods.map((method) => (
                <div 
                  key={method.name} 
                  className={`p-3 rounded-lg border transition-all ${
                    method.active 
                      ? 'bg-blue-50 border-blue-200 ring-1 ring-blue-500' 
                      : 'bg-slate-50 border-gray-200 opacity-60'
                  }`}
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-bold text-navy-950">{method.name}</span>
                    {method.active && (
                      <span className="bg-blue-600 text-white px-2 py-0.5 rounded text-[10px] font-black tracking-wider uppercase">
                        Active Method
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-600">{method.details}</p>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
