import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/src/lib/firebase';
import { ShieldCheck, User, Menu, X, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/src/contexts/AuthContext';
import { signOut } from 'firebase/auth';

export default function MainLayout() {
  const { user, profile } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const handleLogout = async () => {
    await signOut(auth);
    window.location.href = '/';
  };

  const getPortalLink = () => {
    if (!profile) return '/admin';
    
    if (profile.role === 'super_admin' || profile.department === 'administration_governance') {
      return '/admin';
    } else if (profile.department === 'justice_public_safety' || profile.role === 'lupon_member' || profile.role === 'bpso_member') {
      return '/justice';
    } else if (profile.department === 'health_social_welfare' || profile.role === 'bhw') {
      return '/health';
    } else if (profile.department === 'youth_drrm_environment' || profile.role === 'sk_official' || profile.role === 'drrm_officer') {
      return '/resources';
    }
    
    return '/admin';
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white border-b border-slate-100 p-4 sticky top-0 z-50 overflow-visible">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="bg-blue-600 p-1.5 rounded-lg text-white">
              <ShieldCheck size={20} />
            </div>
            <span className="font-bold text-slate-900 text-lg">Baluarte Connect</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <Link to="/#services" className="hover:text-blue-600 transition-colors">Services</Link>
            <Link to="/#announcements" className="hover:text-blue-600 transition-colors">Announcements</Link>
            <Link to="/#emergency" className="hover:text-red-600 transition-colors">Emergency</Link>
            <div className="h-4 w-px bg-slate-200"></div>
            {user ? (
               <div className="flex items-center gap-2">
                 {profile?.department !== 'citizen_portal' && (
                   <Link to={getPortalLink()}>
                     <Button variant="ghost" size="sm" className="gap-2 text-blue-600 font-bold border border-blue-100 bg-blue-50/50">
                       <ShieldCheck size={16} /> Admin Portal
                     </Button>
                   </Link>
                 )}
                 <div className="h-8 w-px bg-slate-100 mx-2"></div>
                 <Button variant="ghost" size="sm" className="gap-2 text-slate-500 hover:text-red-600" onClick={handleLogout}>
                   <LogOut size={16} /> Logout
                 </Button>
               </div>
            ) : (
              <Link to="/login">
                <Button variant="default" size="sm" className="bg-blue-600 hover:bg-blue-700 px-6">Login</Button>
              </Link>
            )}
          </div>

          <button className="md:hidden text-slate-600" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Nav */}
        {isMenuOpen && (
          <div className="md:hidden pt-4 pb-2 px-2 space-y-2 border-t mt-4 border-slate-100">
             <Link to="/#services" className="block px-4 py-2 text-slate-600" onClick={() => setIsMenuOpen(false)}>Services</Link>
             <Link to="/#announcements" className="block px-4 py-2 text-slate-600" onClick={() => setIsMenuOpen(false)}>Announcements</Link>
             {user ? (
               <>
                 {profile?.department !== 'citizen_portal' && (
                   <Link to={getPortalLink()} className="block px-4 py-2 text-blue-600 font-bold" onClick={() => setIsMenuOpen(false)}>Admin Portal</Link>
                 )}
                 <button className="w-full text-left px-4 py-2 text-red-600 font-medium" onClick={handleLogout}>Logout</button>
               </>
             ) : (
               <Link to="/login" className="block px-4 py-2 text-blue-600 font-medium" onClick={() => setIsMenuOpen(false)}>Portal Access</Link>
             )}
          </div>
        )}
      </nav>

      <main>
        <Outlet />
      </main>

      <footer className="bg-slate-900 text-slate-400 py-12 px-4 border-t border-slate-800">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-2">
            <h3 className="text-white font-bold text-lg mb-4">Official Barangay Baluarte Portal</h3>
            <p className="text-sm max-w-md">
              Serving the community with transparency and efficiency since the Local Government Code of 1991. 
              Our digital platform brings government services closer to every Baluarteno.
            </p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4 underline decoration-blue-500 underline-offset-4">Hotlines</h4>
            <ul className="text-sm space-y-2">
              <li>Emergency: 911</li>
              <li>Barangay Hall: (02) 888-1234</li>
              <li>BPSO/Tanod: (02) 888-5678</li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4 underline decoration-blue-500 underline-offset-4">Location</h4>
            <p className="text-sm">
              Barangay Hall Compound<br />
              Poblacion Area, Baluarte<br />
              Philippines
            </p>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-slate-800 text-xs flex justify-between">
          <p>© 2026 Barangay Baluarte. All rights reserved.</p>
          <div className="flex gap-4">
            <span className="hover:text-white cursor-pointer transition-colors">Privacy Policy</span>
            <span className="hover:text-white cursor-pointer transition-colors">Terms of Service</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
