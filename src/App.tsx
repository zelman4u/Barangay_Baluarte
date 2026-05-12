/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from '@/src/contexts/AuthContext';
import { SocketProvider } from '@/src/contexts/SocketContext';
import Login from '@/src/pages/auth/Login';
import MainLayout from '@/src/components/layout/MainLayout';
import AdminDashboard from '@/src/pages/dashboard/AdminDashboard';
import JusticeDashboard from '@/src/pages/dashboard/JusticeDashboard';
import HealthDashboard from '@/src/pages/dashboard/HealthDashboard';
import ResourcesDashboard from '@/src/pages/dashboard/ResourcesDashboard';
import CitizenPortal from '@/src/pages/citizen/CitizenPortal';
import DocumentRequest from '@/src/pages/citizen/DocumentRequest';
import ResidentRegistration from '@/src/pages/citizen/ResidentRegistration';

// Admin Modules
import Residents from '@/src/pages/admin/Residents';
import Clearance from '@/src/pages/admin/Clearance';
import Finance from '@/src/pages/admin/Finance';
import Ordinances from '@/src/pages/admin/Ordinances';
import Sessions from '@/src/pages/admin/Sessions';
import Cedula from '@/src/pages/admin/Cedula';
import Payroll from '@/src/pages/admin/Payroll';
import Archive from '@/src/pages/admin/Archive';
import Analytics from '@/src/pages/admin/Analytics';

// Health Modules
import HealthRecords from '@/src/pages/health/HealthRecords';
import Vaccination from '@/src/pages/health/Vaccination';
import MedicalAssistance from '@/src/pages/health/MedicalAssistance';
import Nutrition from '@/src/pages/health/Nutrition';
import Seniors from '@/src/pages/health/Seniors';
import Relief from '@/src/pages/health/Relief';
import HealthAnalytics from '@/src/pages/health/HealthAnalytics';
import PWD from '@/src/pages/health/PWD';
import Welfare from '@/src/pages/health/Welfare';
import Outreach from '@/src/pages/health/Outreach';

// Justice Modules
import Complaints from '@/src/pages/justice/Complaints';
import Cases from '@/src/pages/justice/Cases';
import Mediation from '@/src/pages/justice/Mediation';
import Blotter from '@/src/pages/justice/Blotter';
import Patrol from '@/src/pages/justice/Patrol';
import Incidents from '@/src/pages/justice/Incidents';
import Emergency from '@/src/pages/justice/Emergency';
import Violations from '@/src/pages/justice/Violations';
import Alerts from '@/src/pages/justice/Alerts';

// Resources Modules
import YouthProfiling from '@/src/pages/resources/YouthProfiling';
import SKProjects from '@/src/pages/resources/SKProjects';
import ResourcesEvents from '@/src/pages/resources/ResourcesEvents';
import DRRM from '@/src/pages/resources/DRRM';
import Evacuation from '@/src/pages/resources/Evacuation';
import ResourcesRelief from '@/src/pages/resources/ResourcesRelief';
import WasteMonitoring from '@/src/pages/resources/WasteMonitoring';
import Environment from '@/src/pages/resources/Environment';
import ResourcesAnalytics from '@/src/pages/resources/ResourcesAnalytics';

const HomeRedirect = () => {
  const { user, profile, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  if (user && profile) {
    if (profile.role === 'super_admin' || profile.department === 'administration_governance') {
      return <Navigate to="/admin" replace />;
    } else if (profile.department === 'justice_public_safety' || profile.role === 'lupon_member' || profile.role === 'bpso_member') {
      return <Navigate to="/justice" replace />;
    } else if (profile.department === 'health_social_welfare' || profile.role === 'bhw') {
      return <Navigate to="/health" replace />;
    } else if (
      profile.department === 'youth_drrm_environment' || 
      profile.role === 'sk_official' || 
      profile.role === 'drrm_officer' ||
      profile.department?.toLowerCase().includes('youth') ||
      profile.department?.toLowerCase().includes('disaster') ||
      profile.department?.toLowerCase().includes('environment')
    ) {
      return <Navigate to="/resources" replace />;
    } else if (profile.department === 'citizen_portal') {
      return <CitizenPortal />;
    }
  }

  return <CitizenPortal />;
};

const ProtectedRoute = ({ children, allowedRoles }: { children: React.ReactNode, allowedRoles?: string[] }) => {
  const { user, profile, loading } = useAuth();
  
  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (allowedRoles && profile && !allowedRoles.includes(profile.role)) {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
};

const STAFF_ROLES = ['super_admin', 'barangay_captain', 'secretary', 'treasurer', 'sk_official', 'drrm_officer', 'bhw', 'lupon_member', 'bpso_member'];
const RESOURCES_ROLES = STAFF_ROLES;

export default function App() {
  return (
    <AuthProvider>
      <SocketProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            
            {/* Public / Landing */}
            <Route path="/" element={<MainLayout />}>
              <Route index element={<HomeRedirect />} />
              <Route 
                path="request-document" 
                element={
                  <ProtectedRoute allowedRoles={['resident', 'super_admin']}>
                    <DocumentRequest />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="register" 
                element={
                  <ProtectedRoute>
                    <ResidentRegistration />
                  </ProtectedRoute>
                } 
              />
            </Route>

            {/* Admin / Multi-Department Portals */}
            <Route path="/admin">
              <Route 
                index 
                element={
                  <ProtectedRoute allowedRoles={['super_admin', 'barangay_captain', 'secretary', 'treasurer']}>
                    <AdminDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="residents" 
                element={
                  <ProtectedRoute allowedRoles={['super_admin', 'secretary', 'barangay_captain']}>
                    <Residents />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="clearance" 
                element={
                  <ProtectedRoute allowedRoles={['super_admin', 'secretary']}>
                    <Clearance />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="certificates" 
                element={
                  <ProtectedRoute allowedRoles={['super_admin', 'secretary']}>
                    <Clearance />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="cedula" 
                element={
                  <ProtectedRoute allowedRoles={['super_admin', 'treasurer', 'secretary']}>
                    <Cedula />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="ordinance-mgmt" 
                element={
                  <ProtectedRoute allowedRoles={['super_admin', 'secretary', 'barangay_captain']}>
                    <Ordinances />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="sessions" 
                element={
                  <ProtectedRoute allowedRoles={['super_admin', 'secretary', 'barangay_captain']}>
                    <Sessions />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="finance" 
                element={
                  <ProtectedRoute allowedRoles={['super_admin', 'treasurer']}>
                    <Finance />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="payroll" 
                element={
                  <ProtectedRoute allowedRoles={['super_admin', 'treasurer', 'secretary']}>
                    <Payroll />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="archive" 
                element={
                  <ProtectedRoute allowedRoles={['super_admin', 'secretary']}>
                    <Archive />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="analytics" 
                element={
                  <ProtectedRoute allowedRoles={['super_admin', 'barangay_captain']}>
                    <Analytics />
                  </ProtectedRoute>
                } 
              />
            </Route>
            <Route path="/justice">
              <Route 
                index 
                element={
                  <ProtectedRoute allowedRoles={['super_admin', 'lupon_member', 'barangay_captain', 'secretary']}>
                    <JusticeDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="complaints" 
                element={
                  <ProtectedRoute allowedRoles={['super_admin', 'lupon_member', 'barangay_captain', 'secretary']}>
                    <Complaints />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="cases" 
                element={
                  <ProtectedRoute allowedRoles={['super_admin', 'lupon_member', 'barangay_captain', 'secretary']}>
                    <Cases />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="mediation" 
                element={
                  <ProtectedRoute allowedRoles={['super_admin', 'lupon_member', 'barangay_captain', 'secretary']}>
                    <Mediation />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="blotter" 
                element={
                  <ProtectedRoute allowedRoles={['super_admin', 'lupon_member', 'bpso_member', 'barangay_captain', 'secretary']}>
                    <Blotter />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="patrol" 
                element={
                  <ProtectedRoute allowedRoles={['super_admin', 'bpso_member', 'lupon_member', 'barangay_captain', 'secretary']}>
                    <Patrol />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="incidents" 
                element={
                  <ProtectedRoute allowedRoles={['super_admin', 'bpso_member', 'lupon_member', 'barangay_captain', 'secretary']}>
                    <Incidents />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="emergency" 
                element={
                  <ProtectedRoute allowedRoles={['super_admin', 'bpso_member', 'barangay_captain', 'secretary', 'lupon_member']}>
                    <Emergency />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="violations" 
                element={
                  <ProtectedRoute allowedRoles={['super_admin', 'bpso_member', 'barangay_captain', 'secretary', 'lupon_member']}>
                    <Violations />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="alerts" 
                element={
                  <ProtectedRoute allowedRoles={['super_admin', 'bpso_member', 'barangay_captain', 'secretary', 'lupon_member']}>
                    <Alerts />
                  </ProtectedRoute>
                } 
              />
            </Route>
            <Route path="/health">
              <Route 
                index 
                element={
                  <ProtectedRoute allowedRoles={['super_admin', 'bhw']}>
                    <HealthDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="records" 
                element={
                  <ProtectedRoute allowedRoles={['super_admin', 'bhw']}>
                    <HealthRecords />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="vaccination" 
                element={
                  <ProtectedRoute allowedRoles={['super_admin', 'bhw']}>
                    <Vaccination />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="assistance" 
                element={
                  <ProtectedRoute allowedRoles={['super_admin', 'bhw']}>
                    <MedicalAssistance />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="nutrition" 
                element={
                  <ProtectedRoute allowedRoles={['super_admin', 'bhw']}>
                    <Nutrition />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="seniors" 
                element={
                  <ProtectedRoute allowedRoles={['super_admin', 'bhw']}>
                    <Seniors />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="pwd" 
                element={
                  <ProtectedRoute allowedRoles={['super_admin', 'bhw']}>
                    <PWD />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="relief" 
                element={
                  <ProtectedRoute allowedRoles={['super_admin', 'bhw']}>
                    <Relief />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="welfare" 
                element={
                  <ProtectedRoute allowedRoles={['super_admin', 'bhw']}>
                    <Welfare />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="outreach" 
                element={
                  <ProtectedRoute allowedRoles={['super_admin', 'bhw']}>
                    <Outreach />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="analytics" 
                element={
                  <ProtectedRoute allowedRoles={['super_admin', 'bhw']}>
                    <HealthAnalytics />
                  </ProtectedRoute>
                } 
              />
            </Route>
            <Route path="/resources">
              <Route 
                index 
                element={
                  <ProtectedRoute allowedRoles={RESOURCES_ROLES}>
                    <ResourcesDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="youth" 
                element={
                  <ProtectedRoute allowedRoles={RESOURCES_ROLES}>
                    <YouthProfiling />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="projects" 
                element={
                  <ProtectedRoute allowedRoles={RESOURCES_ROLES}>
                    <SKProjects />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="events" 
                element={
                  <ProtectedRoute allowedRoles={RESOURCES_ROLES}>
                    <ResourcesEvents />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="drrm" 
                element={
                  <ProtectedRoute allowedRoles={RESOURCES_ROLES}>
                    <DRRM />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="evacuation" 
                element={
                  <ProtectedRoute allowedRoles={RESOURCES_ROLES}>
                    <Evacuation />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="relief" 
                element={
                  <ProtectedRoute allowedRoles={RESOURCES_ROLES}>
                    <ResourcesRelief />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="waste" 
                element={
                  <ProtectedRoute allowedRoles={RESOURCES_ROLES}>
                    <WasteMonitoring />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="environment" 
                element={
                  <ProtectedRoute allowedRoles={RESOURCES_ROLES}>
                    <Environment />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="analytics" 
                element={
                  <ProtectedRoute allowedRoles={RESOURCES_ROLES}>
                    <ResourcesAnalytics />
                  </ProtectedRoute>
                } 
              />
            </Route>
            
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </SocketProvider>
    </AuthProvider>
  );
}
