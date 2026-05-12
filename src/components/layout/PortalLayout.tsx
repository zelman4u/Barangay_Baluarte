import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/src/contexts/AuthContext';
import { 
  Users, Home, Scale, Shield, Landmark, HeartPulse, 
  AlertTriangle, UserCheck, Settings, LogOut, LayoutDashboard,
  FileText, ClipboardList, Wallet, ScrollText, Calendar, 
  History, BarChart3, AlertCircle, MessageSquare, ShieldAlert,
  Search, Stethoscope, Baby, UserPlus, Package, Map, 
  Trash2, GraduationCap, Zap, Activity, MapPin, Menu, X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { auth } from '@/src/lib/firebase';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  const { profile } = useAuth();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const deptConfigs = {
    '/admin': {
      name: 'Administration & Governance',
      icon: Landmark,
      modules: [
        { name: 'Dashboard', icon: LayoutDashboard, path: '/admin' },
        { name: 'Resident Information', icon: Users, path: '/admin/residents' },
        { name: 'Barangay Clearance', icon: FileText, path: '/admin/clearance' },
        { name: 'Certificate Issuance', icon: ScrollText, path: '/admin/certificates' },
        { name: 'Cedula Management', icon: ClipboardList, path: '/admin/cedula' },
        { name: 'Ordinance Management', icon: Shield, path: '/admin/ordinance-mgmt' },
        { name: 'Session Management', icon: Calendar, path: '/admin/sessions' },
        { name: 'Financial Management', icon: Wallet, path: '/admin/finance' },
        { name: 'Payroll & Honoraria', icon: UserCheck, path: '/admin/payroll' },
        { name: 'Document Archiving', icon: History, path: '/admin/archive' },
        { name: 'Reports & Analytics', icon: BarChart3, path: '/admin/analytics' },
      ]
    },
    '/justice': {
      name: 'Justice & Public Safety',
      icon: Scale,
      modules: [
        { name: 'Dashboard', icon: LayoutDashboard, path: '/justice' },
        { name: 'Complaint filing', icon: MessageSquare, path: '/justice/complaints' },
        { name: 'Case Management', icon: ClipboardList, path: '/justice/cases' },
        { name: 'Mediation Scheduling', icon: Calendar, path: '/justice/mediation' },
        { name: 'Blotter Records', icon: FileText, path: '/justice/blotter' },
        { name: 'Emergency Dispatch', icon: AlertCircle, path: '/justice/emergency' },
        { name: 'Disaster Preparedness', icon: AlertTriangle, path: '/resources/drrm' },
        { name: 'Patrol Monitoring', icon: Footprints, path: '/justice/patrol' },
        { name: 'Resident Clearances', icon: UserCheck, path: '/justice/clearance' },
        { name: 'Ordinance Violations', icon: AlertTriangle, path: '/justice/violations' },
        { name: 'Community Alerts', icon: Zap, path: '/justice/alerts' },
      ]
    },
    '/health': {
      name: 'Health & Social Welfare',
      icon: HeartPulse,
      modules: [
        { name: 'Dashboard', icon: LayoutDashboard, path: '/health' },
        { name: 'Health Records', icon: Stethoscope, path: '/health/records' },
        { name: 'Vaccination Tracking', icon: Shield, path: '/health/vaccination' },
        { name: 'Medical Assistance', icon: HeartPulse, path: '/health/assistance' },
        { name: 'Nutrition Programs', icon: Baby, path: '/health/nutrition' },
        { name: 'Senior Citizen Registry', icon: Users, path: '/health/seniors' },
        { name: 'PWD Assistance', icon: UserPlus, path: '/health/pwd' },
        { name: 'Relief Assistance', icon: Package, path: '/health/relief' },
        { name: 'Community Outreach', icon: Map, path: '/health/outreach' },
        { name: 'Welfare Monitoring', icon: Activity, path: '/health/welfare' },
        { name: 'Reports & Analytics', icon: BarChart3, path: '/health/analytics' },
      ]
    },
    '/resources': {
      name: 'Youth, DRRM & Environment',
      icon: AlertTriangle,
      modules: [
        { name: 'Dashboard', icon: LayoutDashboard, path: '/resources' },
        { name: 'Youth Profiling', icon: GraduationCap, path: '/resources/youth' },
        { name: 'SK Projects', icon: ClipboardList, path: '/resources/projects' },
        { name: 'Event Management', icon: Calendar, path: '/resources/events' },
        { name: 'Disaster Preparedness', icon: AlertTriangle, path: '/resources/drrm' },
        { name: 'Evacuation Monitoring', icon: MapPin, path: '/resources/evacuation' },
        { name: 'Relief Distribution', icon: Package, path: '/resources/relief' },
        { name: 'Waste Monitoring', icon: Trash2, path: '/resources/waste' },
        { name: 'Environmental Reporting', icon: Map, path: '/resources/environment' },
        { name: 'Disaster Analytics', icon: BarChart3, path: '/resources/analytics' },
      ]
    }
  };

  const currentDeptKey = Object.keys(deptConfigs).find(key => location.pathname.startsWith(key)) as keyof typeof deptConfigs;
  const currentDept = deptConfigs[currentDeptKey];

  const menuItems = [
    { name: 'Administration', path: '/admin', dept: 'administration_governance' },
    { name: 'Justice', path: '/justice', dept: 'justice_public_safety' },
    { name: 'Health', path: '/health', dept: 'health_social_welfare' },
    { name: 'Youth & DRRM', path: '/resources', dept: 'youth_drrm_environment' },
  ];

  return (
    <div className="flex h-screen bg-bmis-bg overflow-hidden font-sans">
      {/* Sidebar Overlay for Mobile */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/60 z-30 lg:hidden backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 lg:static w-72 bg-bmis-sidebar text-white flex flex-col shadow-2xl z-40 transition-transform duration-300 ease-in-out lg:translate-x-0",
        isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="p-6 border-b border-slate-800 bg-slate-900/50 flex items-center justify-between">
          <Link to="/" onClick={() => setIsMobileMenuOpen(false)}>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl tracking-tighter text-bmis-accent">BMIS BALUARTE</span>
              </div>
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em] mt-1">Smart Governance Suite</span>
            </div>
          </Link>
          <Button 
            variant="ghost" 
            size="icon" 
            className="lg:hidden text-slate-400"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <X size={20} />
          </Button>
        </div>

        <ScrollArea className="flex-1 py-6 px-4">
          <div className="space-y-6">
            {currentDept && (
              <nav className="space-y-1">
                <p className="px-3 mb-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                  <currentDept.icon size={12} className="text-bmis-accent" />
                  {currentDept.name}
                </p>
                {currentDept.modules.map((mod) => (
                  <Link key={mod.path} to={mod.path} onClick={() => setIsMobileMenuOpen(false)}>
                    <span className={cn(
                      "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all relative group mb-1",
                      location.pathname === mod.path
                        ? "text-white bg-blue-600 shadow-lg shadow-blue-900/20" 
                        : "text-slate-400 hover:text-white hover:bg-white/5"
                    )}>
                      <mod.icon size={18} className={cn(
                        "transition-colors",
                        location.pathname === mod.path ? "text-white" : "text-slate-500 group-hover:text-slate-300"
                      )} />
                      {mod.name}
                    </span>
                  </Link>
                ))}
              </nav>
            )}

            {(profile?.role === 'super_admin' || 
              profile?.role === 'barangay_captain' || 
              profile?.role === 'secretary' || 
              profile?.role === 'treasurer') && (
              <nav className="space-y-1 pt-6 border-t border-slate-800">
                <p className="px-3 mb-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Departmental Portals</p>
                {menuItems.map((item) => (
                  <Link key={item.path} to={item.path} onClick={() => setIsMobileMenuOpen(false)}>
                    <span className={cn(
                      "flex items-center gap-3 px-3 py-2 rounded-lg text-xs transition-all",
                      location.pathname.startsWith(item.path) 
                        ? "text-blue-400 font-bold" 
                        : "text-slate-500 hover:text-slate-300"
                    )}>
                      {item.name}
                    </span>
                  </Link>
                ))}
              </nav>
            )}
          </div>
        </ScrollArea>

        <div className="p-4 border-t border-slate-800 bg-slate-950/50">
          <div className="flex items-center gap-3 mb-6 bg-slate-800/20 p-3 rounded-2xl border border-slate-700/30">
            <div className="w-10 h-10 rounded-xl bg-bmis-accent flex items-center justify-center text-slate-900 font-black border-2 border-white/5 shadow-inner">
              {profile?.displayName?.[0] || 'U'}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-xs font-black text-white truncate uppercase tracking-tighter">{profile?.displayName || 'User'}</p>
              <p className="text-[10px] text-bmis-accent truncate capitalize font-bold tracking-widest">{profile?.role?.replace('_', ' ')}</p>
            </div>
          </div>
          <Button 
            variant="destructive" 
            size="lg" 
            className="w-full justify-center bg-red-600/10 hover:bg-red-600 text-red-500 hover:text-white border border-red-500/20 font-black uppercase tracking-widest text-[10px] h-12 rounded-xl transition-all shadow-lg hover:shadow-red-900/20 group"
            onClick={() => auth.signOut()}
          >
            <LogOut size={16} className="mr-2 group-hover:-translate-x-1 transition-transform" /> Sign Out System
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden min-w-0">
        <header className="h-16 bg-white border-b border-bmis-border flex items-center justify-between px-4 lg:px-8 shadow-sm relative z-10 shrink-0">
          <div className="flex items-center gap-2 lg:gap-4 overflow-hidden">
            <Button 
              variant="ghost" 
              size="icon" 
              className="lg:hidden text-slate-500"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu size={20} />
            </Button>
            <h1 className="font-bold text-slate-900 text-sm lg:text-base tracking-tight truncate">
              {currentDept?.modules.find(m => m.path === location.pathname)?.name || 'Dashboard'}
            </h1>
            <div className="hidden sm:block h-4 w-px bg-slate-200" />
            <span className="hidden sm:inline-block text-[10px] lg:text-[11px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded uppercase tracking-wider truncate max-w-[120px] lg:max-w-none">
              {profile?.department?.replace(/_/g, ' ') || 'Citizen'}
            </span>
          </div>
          <div className="flex items-center gap-3 lg:gap-6 shrink-0">
            <div className="hidden md:flex flex-col items-end">
              <div className="text-[11px] font-black text-slate-900 uppercase tracking-tighter">
                {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
              </div>
              <div className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live Hub Online
              </div>
            </div>
            <Button 
              variant="outline"
              size="icon"
              className="w-10 h-10 rounded-xl bg-white border-slate-200 text-slate-400 hover:text-red-500 hover:bg-red-50 hover:border-red-200 transition-all shadow-sm group" 
              onClick={() => auth.signOut()} 
              title="Log Out"
            >
              <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
            </Button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto bg-slate-50/50 scroll-smooth">
          <div className="p-4 lg:p-8 pb-16 max-w-7xl mx-auto w-full">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
