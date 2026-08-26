import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Map, 
  BarChart3, 
  AlertTriangle, 
  FileText, 
  Settings, 
  LogOut,
  ShieldAlert,
  Menu,
  X
} from 'lucide-react';

export default function AdminLayout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const navigationItems = [
    { name: 'Dashboard', path: '/admin/map', icon: LayoutDashboard, isMock: true },
    { name: 'Map', path: '/admin/map', icon: Map, isMock: false },
    { name: 'Analysis', path: '/admin/analysis', icon: BarChart3, isMock: false },
    { name: 'Hotspots', path: '/admin/hotspots', icon: AlertTriangle, isMock: false },
    { name: 'Reports', path: '/admin/reports', icon: FileText, isMock: false },
  ];

  const handleMockClick = (name) => {
    alert(`${name} view is represented within the 4 primary admin screens (Map, Analysis, Hotspots, Reports).`);
  };

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden font-sans">
      {/* Sidebar for Desktop */}
      <aside className="hidden md:flex md:flex-col md:w-64 bg-navy-900 text-white flex-shrink-0">
        <div className="flex items-center h-16 px-6 bg-navy-950 border-b border-navy-800">
          <ShieldAlert className="w-6 h-6 mr-3 text-red-500" />
          <span className="font-bold text-lg tracking-wider text-red-500">MargRakshak AI</span>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {navigationItems.map((item) => {
            const isActive = location.pathname === item.path;
            
            if (item.isMock) {
              return (
                <button
                  key={item.name}
                  onClick={() => handleMockClick(item.name)}
                  className="flex items-center w-full px-4 py-3 text-sm font-medium rounded-lg text-slate-300 hover:bg-navy-800 hover:text-white transition-colors duration-200"
                >
                  <item.icon className="w-5 h-5 mr-3 text-slate-400" />
                  {item.name}
                </button>
              );
            }

            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200 ${
                  isActive 
                    ? 'bg-blue-600 text-white shadow-md' 
                    : 'text-slate-300 hover:bg-navy-800 hover:text-white'
                }`}
              >
                <item.icon className={`w-5 h-5 mr-3 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                {item.name}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-navy-800 bg-navy-950">
          <button 
            onClick={() => alert("Settings panel will be implemented in future backend phases.")}
            className="flex items-center w-full px-4 py-2.5 text-sm font-medium rounded-lg text-slate-300 hover:bg-navy-800 hover:text-white transition-colors duration-200 mb-1"
          >
            <Settings className="w-5 h-5 mr-3 text-slate-400" />
            Settings
          </button>
          <button
            onClick={() => navigate('/')}
            className="flex items-center w-full px-4 py-2.5 text-sm font-medium rounded-lg text-red-400 hover:bg-red-950 hover:text-red-300 transition-colors duration-200"
          >
            <LogOut className="w-5 h-5 mr-3" />
            Logout
          </button>
        </div>
      </aside>

      {/* Mobile menu toggle */}
      <div className="md:hidden fixed top-3 left-4 z-50">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 rounded-md bg-navy-900 text-white focus:outline-none"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Sidebar overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40 flex">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setIsMobileMenuOpen(false)} />
          <aside className="relative flex flex-col w-64 bg-navy-900 text-white h-full z-50">
            <div className="flex items-center h-16 px-6 bg-navy-950 border-b border-navy-800">
              <ShieldAlert className="w-6 h-6 mr-3 text-red-500" />
              <span className="font-bold text-lg text-red-500">MargRakshak AI</span>
            </div>
            <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
              {navigationItems.map((item) => {
                const isActive = location.pathname === item.path;
                return item.isMock ? (
                  <button
                    key={item.name}
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      handleMockClick(item.name);
                    }}
                    className="flex items-center w-full px-4 py-3 text-sm font-medium rounded-lg text-slate-300 hover:bg-navy-800 hover:text-white"
                  >
                    <item.icon className="w-5 h-5 mr-3 text-slate-400" />
                    {item.name}
                  </button>
                ) : (
                  <Link
                    key={item.name}
                    to={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg ${
                      isActive ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-navy-800 hover:text-white'
                    }`}
                  >
                    <item.icon className="w-5 h-5 mr-3" />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
            <div className="p-4 border-t border-navy-800 bg-navy-950">
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  alert("Settings panel will be implemented in future backend phases.");
                }}
                className="flex items-center w-full px-4 py-2.5 text-sm font-medium rounded-lg text-slate-300 hover:bg-navy-800 hover:text-white mb-1"
              >
                <Settings className="w-5 h-5 mr-3 text-slate-400" />
                Settings
              </button>
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  navigate('/');
                }}
                className="flex items-center w-full px-4 py-2.5 text-sm font-medium rounded-lg text-red-400 hover:bg-red-950 hover:text-red-300"
              >
                <LogOut className="w-5 h-5 mr-3" />
                Logout
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-navy-900 border-b border-navy-800 flex items-center justify-between px-6 md:px-8 text-white z-10">
          <div className="flex items-center pl-10 md:pl-0">
            <span className="text-xl font-bold tracking-wider text-slate-100 flex items-center gap-2">
              🚨 ACCIDENT RISK MANAGEMENT SYSTEM
            </span>
          </div>
          <div className="flex items-center space-x-3">
            <span className="text-sm font-medium text-slate-300 hidden sm:inline">Nashik Jurisdiction</span>
            <div className="h-4 w-px bg-navy-800 hidden sm:block"></div>
            <div className="flex items-center bg-navy-850 px-3 py-1.5 rounded-lg border border-navy-850">
              <span className="text-sm font-semibold mr-2 text-slate-200">Admin 👤</span>
            </div>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main className="flex-1 overflow-y-auto bg-gray-50 focus:outline-none">
          {children}
        </main>
      </div>
    </div>
  );
}
