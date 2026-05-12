import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  FileText, Send, Phone, MessageSquare, 
  Calendar, Info, AlertCircle, QrCode, Search, LogOut, LayoutDashboard 
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/src/contexts/AuthContext';
import { auth } from '@/src/lib/firebase';

export default function CitizenPortal() {
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const services = [
    { name: 'Request Document', icon: FileText, desc: 'Brgy Clearance, Indigency, Residency, Cedula', color: 'bg-blue-50 text-blue-600', path: '/request-document' },
    { name: 'File Complaint', icon: MessageSquare, desc: 'Submit a sumbong to Katarungang Pambarangay', color: 'bg-red-50 text-red-600', path: '#services' },
    { name: 'Emergency Report', icon: AlertCircle, desc: 'Quick report for accidents, fire, or crime', color: 'bg-amber-50 text-amber-600', path: '#services' },
    { name: 'Book Appointment', icon: Calendar, desc: 'Schedule a session with Brgy Officials', color: 'bg-emerald-50 text-emerald-600', path: '#services' },
  ];

  return (
    <div className="pb-20">
      {/* Hero Section */}
      <section className="relative bg-slate-900 py-32 px-4 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#2563eb_1px,transparent_1px)] [background-size:20px_20px]"></div>
        </div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 tracking-tight">
            Digital Governance for <span className="text-blue-500">Barangay Baluarte</span>
          </h1>
          <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto leading-relaxed">
            Accessible, transparent, and responsive public services at your fingertips.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 px-8 text-lg rounded-full shadow-lg shadow-blue-900/20" onClick={() => navigate('/request-document')}>
              Request a Document
            </Button>
            {user ? (
              <div className="flex gap-4">
                <Button size="lg" variant="outline" className="text-white border-blue-500/50 bg-blue-500/10 hover:bg-blue-500/20 px-8 text-lg rounded-full" onClick={() => {
                  if (profile?.department === 'administration_governance') navigate('/admin');
                  else if (profile?.department === 'justice_public_safety') navigate('/justice');
                  else if (profile?.department === 'health_social_welfare') navigate('/health');
                  else if (profile?.department === 'youth_drrm_environment') navigate('/resources');
                  else navigate('/admin');
                }}>
                  <LayoutDashboard className="mr-2 h-5 w-5" /> Portal Dashboard
                </Button>
                <Button size="lg" variant="ghost" className="text-slate-400 hover:text-red-400 hover:bg-red-400/10 px-8 text-lg rounded-full" onClick={() => auth.signOut()}>
                  <LogOut className="mr-2 h-5 w-5" /> Sign Out
                </Button>
              </div>
            ) : (
              <Button size="lg" variant="outline" className="text-white border-slate-700 hover:bg-slate-800 px-8 text-lg rounded-full" onClick={() => navigate('/login')}>
                Resident Login
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section id="services" className="max-w-7xl mx-auto mt-[-80px] px-4 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, i) => (
            <Card key={service.name} className="hover:shadow-xl transition-all h-full border-slate-200 cursor-pointer group" onClick={() => navigate(service.path)}>
              <CardHeader>
                <div className={`${service.color} w-12 h-12 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <service.icon size={24} />
                </div>
                <CardTitle className="group-hover:text-blue-600 transition-colors">{service.name}</CardTitle>
                <CardDescription>{service.desc}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      {/* Announcements */}
      <section id="announcements" className="max-w-7xl mx-auto px-4 mt-24">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-slate-900">Latest Updates</h2>
            <p className="text-slate-500">Official announcements from the Barangay Hall</p>
          </div>
          <Button variant="ghost" className="text-blue-600">View All</Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="border-slate-200 overflow-hidden group">
              <div className="aspect-video bg-slate-100 relative">
                <div className="absolute inset-0 flex items-center justify-center text-slate-300">
                   <Info size={48} />
                </div>
                <div className="absolute top-4 left-4">
                   <span className="bg-blue-600 text-white text-[10px] font-bold px-2 py-1 rounded">HEALTH</span>
                </div>
              </div>
              <CardContent className="p-6">
                <p className="text-xs text-slate-400 mb-2">May 11, 2026</p>
                <h3 className="font-bold text-lg mb-2 group-hover:text-blue-600 transition-colors">Barangay-wide Vaccination Drive</h3>
                <p className="text-sm text-slate-500 line-clamp-2">
                  The Barangay Health Center will be conducting a free house-to-house vaccination drive this Saturday...
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Barangay Profile */}
      <section id="profile" className="max-w-7xl mx-auto px-4 mt-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 mb-6 font-display">Barangay Profile</h2>
            <div className="prose prose-slate max-w-none">
              <p className="text-slate-600 leading-relaxed mb-6">
                <strong>Baluarte</strong> is a vibrant barangay in the municipality of <strong>Tagoloan</strong>, 
                province of <strong>Misamis Oriental</strong>. With a population of <strong>10,860</strong> (2020 Census), 
                Baluarte is a key community representing 13.52% of Tagoloan's total population.
              </p>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-8">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-1">Region</p>
                  <p className="font-bold text-slate-900">Northern Mindanao</p>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-1">Postal Code</p>
                  <p className="font-bold text-slate-900">9001</p>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-1">Elevation</p>
                  <p className="font-bold text-slate-900">3.5m ASL</p>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-bold text-slate-900 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                  Demographic Breakdown (2015)
                </h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center bg-slate-50 p-3 rounded-xl">
                    <span className="text-slate-600">Young Dependents (0-14)</span>
                    <span className="font-bold text-slate-900">32.65%</span>
                  </div>
                  <div className="flex justify-between items-center bg-slate-50 p-3 rounded-xl">
                    <span className="text-slate-600">Working Age (15-64)</span>
                    <span className="font-bold text-slate-900">63.98%</span>
                  </div>
                  <div className="flex justify-between items-center bg-slate-50 p-3 rounded-xl">
                    <span className="text-slate-600">Senior Citizens (65+)</span>
                    <span className="font-bold text-slate-900">3.37%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="relative">
            <Card className="border-slate-200 overflow-hidden shadow-2xl skew-y-1">
              <div className="aspect-square relative bg-slate-100">
                <iframe 
                  width="100%" 
                  height="100%" 
                  frameBorder="0" 
                  scrolling="no" 
                  marginHeight={0} 
                  marginWidth={0} 
                  src="https://www.openstreetmap.org/export/embed.html?bbox=124.7211%2C8.5238%2C124.7611%2C8.5638&amp;layer=mapnik&amp;marker=8.5438%2C124.7411"
                  className="grayscale hover:grayscale-0 transition-all duration-700"
                ></iframe>
              </div>
              <CardContent className="p-6 bg-white">
                <h4 className="font-bold text-slate-900 mb-2">Location Information</h4>
                <p className="text-sm text-slate-500 mb-4">
                  Coordinates: 8.5438° N, 124.7411° E. Baluarte shares borders with Poblacion, 
                  Santa Cruz, and Gracia in Tagoloan.
                </p>
                <div className="flex flex-wrap gap-2">
                   <Badge variant="outline" className="text-[10px] uppercase">Tagoloan River (1.08km)</Badge>
                   <Badge variant="outline" className="text-[10px] uppercase">Mindanao Island</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Quick Search Section */}
      <section className="bg-blue-600 mt-24 py-16 px-4 rounded-[40px] max-w-7xl mx-auto overflow-hidden relative">
        <div className="absolute top-[-20%] right-[-10%] w-96 h-96 bg-blue-500 rounded-full blur-3xl opacity-50"></div>
        <div className="absolute bottom-[-20%] left-[-10%] w-96 h-96 bg-blue-700 rounded-full blur-3xl opacity-50"></div>
        
        <div className="max-w-2xl mx-auto text-center relative z-10 text-white">
          <h2 className="text-3xl font-bold mb-6">Verify Your Document</h2>
          <p className="mb-8 text-blue-100">Scan the QR code on your certificate to verify its authenticity online.</p>
          <div className="flex gap-2">
            <Input className="bg-white/10 border-white/20 text-white placeholder:text-white/50 rounded-full px-6" placeholder="Document ID (e.g. BAL-2026-0001)" />
            <Button className="bg-white text-blue-600 hover:bg-blue-50 rounded-full px-8">Verify</Button>
          </div>
        </div>
      </section>
    </div>
  );
}
