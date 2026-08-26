import React, { useState, useRef } from 'react';
import { mockRecentReports } from '../../data/reports';
import NotificationToast from '../../components/common/NotificationToast';
import { FileUp, FileText, Download, Eye, CheckCircle, RefreshCw, Layers } from 'lucide-react';

export default function AdminReports() {
  const fileInputRef = useRef(null);
  const [recentReports, setRecentReports] = useState(mockRecentReports);
  
  // File Upload states
  const [uploadedFile, setUploadedFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  // Report Generator states
  const [reportType, setReportType] = useState('Monthly Risk');
  const [reportFormat, setReportFormat] = useState('PDF');
  const [generating, setGenerating] = useState(false);

  // Toast notifications
  const [toastMessage, setToastMessage] = useState(null);
  const [toastType, setToastType] = useState('success');

  const handleBrowseClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      simulateUpload(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      const extension = file.name.split('.').pop().toLowerCase();
      if (['csv', 'xls', 'xlsx'].includes(extension)) {
        simulateUpload(file);
      } else {
        setToastType('error');
        setToastMessage("Invalid file format. Please upload CSV or Excel files.");
      }
    }
  };

  const simulateUpload = (file) => {
    setUploading(true);
    setToastType('info');
    setToastMessage(`Reading accident logs: ${file.name}...`);

    setTimeout(() => {
      setUploadedFile({
        name: file.name,
        size: (file.size / (1024 * 1024)).toFixed(2) + " MB",
        recordsCount: Math.floor(Math.random() * 300) + 150,
        status: "Cleaned & Normalized",
        lastUpdated: new Date().toLocaleString()
      });
      setUploading(false);
      setToastType('success');
      setToastMessage("Data pipeline ingested successfully. Records formatted and projected to Nashik coordinates.");
    }, 1800);
  };

  const handleGenerateReport = (e) => {
    e.preventDefault();
    setGenerating(true);
    setToastType('info');
    setToastMessage(`Compiling Spatial clusters for ${reportType} (${reportFormat})...`);

    setTimeout(() => {
      const extension = reportFormat.toLowerCase();
      const reportName = `Nashik_${reportType.replace(/\s+/g, '_')}_${new Date().toLocaleString('en-US', { month: 'short' })}_${new Date().getFullYear()}.${extension}`;
      
      const newReport = {
        id: recentReports.length + 1,
        name: reportName,
        type: reportFormat,
        size: (Math.random() * 3 + 1.2).toFixed(1) + " MB",
        generatedAt: new Date().toLocaleString(),
        category: reportType
      };

      setRecentReports([newReport, ...recentReports]);
      setGenerating(false);
      setToastType('success');
      setToastMessage(`Report "${reportName}" generated successfully.`);
    }, 2000);
  };

  const handleDownload = (reportName) => {
    setToastType('success');
    setToastMessage(`Downloading report: ${reportName}`);
  };

  const handleView = (report) => {
    alert(`Report Details:\n\nName: ${report.name}\nType: ${report.type}\nCategory: ${report.category}\nSize: ${report.size}\nCreated: ${report.generatedAt}\n\nThis is a frontend demonstration. In the integrated system, this will open a spatial PDF canvas or download an Excel spreadsheet containing GeoPandas statistical dumps.`);
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
        <h1 className="text-2xl font-bold text-navy-900">DATA MANAGEMENT & REPORT GENERATION</h1>
        <p className="text-gray-500 text-sm">Upload bulk accident reports, run sanity normalization steps, and compile analytical reports.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left Column: Data Upload */}
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 space-y-4">
            <h2 className="text-md font-bold text-navy-900 flex items-center gap-2">
              <FileUp className="w-5 h-5 text-blue-600" /> Upload Accident Data
            </h2>
            
            {/* Drag & Drop Area */}
            <div 
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center bg-gray-50 hover:bg-slate-100/50 hover:border-blue-500 transition cursor-pointer"
              onClick={handleBrowseClick}
            >
              <input 
                type="file" 
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".csv, .xls, .xlsx"
                className="hidden" 
              />
              <FileText className="w-12 h-12 text-slate-400 mx-auto mb-3" />
              <p className="font-bold text-sm text-navy-900 mb-1">Drag & Drop CSV/Excel file here</p>
              <p className="text-xs text-gray-500 mb-3">Accepts .csv, .xlsx, .xls (Nashik City logs format)</p>
              <button 
                type="button"
                className="px-4 py-1.5 bg-white border border-gray-300 text-navy-900 hover:bg-gray-100 font-semibold rounded-lg text-xs transition"
              >
                Browse Files
              </button>
            </div>

            {/* Ingestion Loading Indicator */}
            {uploading && (
              <div className="flex items-center justify-center space-x-2 py-4 text-blue-600 font-semibold text-sm">
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Ingesting bulk GPS points & parsing spatial coordinates...</span>
              </div>
            )}

            {/* Ingestion Status Container */}
            {uploadedFile && !uploading && (
              <div className="bg-green-50 border border-green-200 rounded-xl p-4 space-y-3">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="font-bold text-sm text-green-900">Data Status: {uploadedFile.status}</span>
                </div>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs text-green-800">
                  <div><span className="font-semibold">File Ingested:</span> {uploadedFile.name}</div>
                  <div><span className="font-semibold">Records Parsed:</span> {uploadedFile.recordsCount} coordinates</div>
                  <div><span className="font-semibold">Data Size:</span> {uploadedFile.size}</div>
                  <div><span className="font-semibold">Last Processed:</span> {uploadedFile.lastUpdated}</div>
                </div>
              </div>
            )}

            <div className="text-xs text-gray-400 italic">
              🚨 Note: Uploaded coordinate systems are projected to EPSG:4326 WGS-84 formats for correct Leaflet projection.
            </div>
          </div>
        </div>

        {/* Right Column: Generate Reports */}
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 space-y-4">
            <h2 className="text-md font-bold text-navy-900 flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" /> Generate Reports
            </h2>

            <form onSubmit={handleGenerateReport} className="space-y-4">
              {/* Report Category Radios */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-gray-500 uppercase">Select Report Type</label>
                <div className="space-y-2">
                  {['Monthly Risk', 'Hotspot Audit', 'Spatial Analysis'].map((type) => (
                    <label 
                      key={type} 
                      className={`flex items-center p-3 rounded-lg border cursor-pointer hover:bg-slate-50 transition text-sm ${
                        reportType === type 
                          ? 'bg-blue-50/50 border-blue-200 font-semibold text-navy-900' 
                          : 'bg-white border-gray-200 text-gray-700'
                      }`}
                    >
                      <input 
                        type="radio" 
                        name="reportType" 
                        value={type}
                        checked={reportType === type}
                        onChange={() => setReportType(type)}
                        className="mr-3 text-blue-600 focus:ring-blue-500 w-4 h-4 border-gray-300"
                      />
                      {type}
                    </label>
                  ))}
                </div>
              </div>

              {/* Format Dropdown */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase">Format</label>
                <select
                  value={reportFormat}
                  onChange={(e) => setReportFormat(e.target.value)}
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm bg-gray-50 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="PDF">Portable Document Format (PDF)</option>
                  <option value="Excel">Excel Spreadsheet (XLSX)</option>
                </select>
              </div>

              {/* Action Button */}
              <button 
                type="submit"
                disabled={generating}
                className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors border border-blue-500 cursor-pointer shadow-sm text-sm disabled:bg-blue-400"
              >
                {generating ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Compiling spatial charts...</span>
                  </>
                ) : (
                  <span>Generate Report</span>
                )}
              </button>
            </form>
          </div>
        </div>

      </div>

      {/* Recent Generated Reports Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
          <Layers className="w-4 h-4 text-blue-600" />
          <h2 className="text-sm font-bold text-navy-950 uppercase">Recent Generated Reports</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 text-navy-950 font-semibold text-xs text-left uppercase tracking-wider">
              <tr>
                <th className="px-6 py-3.5">Report Title</th>
                <th className="px-6 py-3.5">Category</th>
                <th className="px-6 py-3.5">File Format</th>
                <th className="px-6 py-3.5">File Size</th>
                <th className="px-6 py-3.5">Generated At</th>
                <th className="px-6 py-3.5 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100 text-sm">
              {recentReports.map((report) => (
                <tr key={report.id} className="hover:bg-slate-50 transition duration-150">
                  <td className="px-6 py-3.5 font-bold text-navy-900">{report.name}</td>
                  <td className="px-6 py-3.5 text-gray-600">{report.category}</td>
                  <td className="px-6 py-3.5 font-mono text-xs">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      report.type === 'PDF' ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-green-50 text-green-700 border border-green-200'
                    }`}>
                      {report.type}
                    </span>
                  </td>
                  <td className="px-6 py-3.5 text-gray-500 font-mono text-xs">{report.size}</td>
                  <td className="px-6 py-3.5 text-gray-500 text-xs">{report.generatedAt}</td>
                  <td className="px-6 py-3.5 text-center">
                    <div className="flex items-center justify-center space-x-2">
                      <button
                        onClick={() => handleView(report)}
                        className="p-1 text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 rounded transition"
                        title="View Report details"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDownload(report.name)}
                        className="p-1 text-green-600 hover:text-green-800 bg-green-50 hover:bg-green-100 rounded transition"
                        title="Download file"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
