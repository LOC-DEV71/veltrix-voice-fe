import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import LandingPage from '../pages/client/LandingPage';
import StudioPage from '../pages/client/StudioPage';
import DashboardPage from '../pages/client/DashboardPage';
import PricingPage from '../pages/client/PricingPage';
import LoginPage from '../pages/client/LoginPage';
import RegisterPage from '../pages/client/RegisterPage';

import AdminLoginPage from '../pages/admin/AdminLoginPage';
import AdminDashboard from '../pages/admin/AdminDashboard';
import UserManagement from '../pages/admin/UserManagement';
import VoiceManagement from '../pages/admin/VoiceManagement';
import PlanManagement from '../pages/admin/PlanManagement';
import PromoManagement from '../pages/admin/PromoManagement';
import RoleManagement from '../pages/admin/RoleManagement';
import AccountManagement from '../pages/admin/AccountManagement';
import SettingsManagement from '../pages/admin/SettingsManagement';

import ClientMiddleware from '../middlewares/clientMiddleware';
import AdminMiddleware from '../middlewares/adminMiddleware';

export default function AppRoutes() {
  return (
    <Routes>
      {/* 1. Client Public Landing Page (Trang chủ /) */}
      <Route 
        path="/" 
        element={
          <ClientMiddleware>
            <LandingPage />
          </ClientMiddleware>
        } 
      />

      {/* 2. Client Dedicated Login & Register Pages */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* 3. Client Dedicated Pricing Page (/pricing) */}
      <Route 
        path="/pricing" 
        element={
          <ClientMiddleware>
            <PricingPage />
          </ClientMiddleware>
        } 
      />

      {/* 4. Client Dedicated Dashboard Page (/dashboard) */}
      <Route 
        path="/dashboard" 
        element={
          <ClientMiddleware>
            <DashboardPage />
          </ClientMiddleware>
        } 
      />

      {/* 5. Client Voice Generator Studio Workspace (Trang Studio /studio) */}
      <Route 
        path="/studio" 
        element={
          <ClientMiddleware>
            <StudioPage />
          </ClientMiddleware>
        } 
      />

      {/* 6. Admin Public Login */}
      <Route path="/admin/login" element={<AdminLoginPage />} />

      {/* 7. Admin Protected Routes */}
      <Route 
        path="/admin/dashboard" 
        element={
          <AdminMiddleware requiredPermission="dashboard_view">
            <AdminDashboard />
          </AdminMiddleware>
        } 
      />
      <Route 
        path="/admin/users" 
        element={
          <AdminMiddleware requiredPermission="users_view">
            <UserManagement />
          </AdminMiddleware>
        } 
      />
      <Route 
        path="/admin/voices" 
        element={
          <AdminMiddleware requiredPermission="voices_view">
            <VoiceManagement />
          </AdminMiddleware>
        } 
      />
      <Route 
        path="/admin/plans" 
        element={
          <AdminMiddleware requiredPermission="plans_view">
            <PlanManagement />
          </AdminMiddleware>
        } 
      />
      <Route 
        path="/admin/promos" 
        element={
          <AdminMiddleware requiredPermission="plans_view">
            <PromoManagement />
          </AdminMiddleware>
        } 
      />
      <Route 
        path="/admin/roles" 
        element={
          <AdminMiddleware requiredPermission="roles_view">
            <RoleManagement />
          </AdminMiddleware>
        } 
      />
      <Route 
        path="/admin/accounts" 
        element={
          <AdminMiddleware requiredPermission="accounts_view">
            <AccountManagement />
          </AdminMiddleware>
        } 
      />
      <Route 
        path="/admin/settings" 
        element={
          <AdminMiddleware requiredPermission="settings_view">
            <SettingsManagement />
          </AdminMiddleware>
        } 
      />

      {/* Catch-all redirect to Home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
