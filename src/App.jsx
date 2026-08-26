import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import AdminLayout from './components/layout/AdminLayout';
import UserLayout from './components/layout/UserLayout';

// Pages
import Landing from './pages/Landing';

// Admin Pages
import AdminMap from './pages/admin/AdminMap';
import AdminAnalysis from './pages/admin/AdminAnalysis';
import AdminHotspots from './pages/admin/AdminHotspots';
import AdminReports from './pages/admin/AdminReports';

// User Pages
import UserNavigation from './pages/user/UserNavigation';
import UserAlerts from './pages/user/UserAlerts';
import UserRoutes from './pages/user/UserRoutes';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Entry / Role selection */}
        <Route path="/" element={<Landing />} />

        {/* Admin Dashboard Experience */}
        <Route 
          path="/admin/map" 
          element={
            <AdminLayout>
              <AdminMap />
            </AdminLayout>
          } 
        />
        <Route 
          path="/admin/analysis" 
          element={
            <AdminLayout>
              <AdminAnalysis />
            </AdminLayout>
          } 
        />
        <Route 
          path="/admin/hotspots" 
          element={
            <AdminLayout>
              <AdminHotspots />
            </AdminLayout>
          } 
        />
        <Route 
          path="/admin/reports" 
          element={
            <AdminLayout>
              <AdminReports />
            </AdminLayout>
          } 
        />

        {/* Driver / Commuter Navigation Experience */}
        <Route 
          path="/user/navigation" 
          element={
            <UserLayout>
              <UserNavigation />
            </UserLayout>
          } 
        />
        <Route 
          path="/user/alerts" 
          element={
            <UserLayout>
              <UserAlerts />
            </UserLayout>
          } 
        />
        <Route 
          path="/user/routes" 
          element={
            <UserLayout>
              <UserRoutes />
            </UserLayout>
          } 
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
