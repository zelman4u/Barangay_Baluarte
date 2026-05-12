import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import PortalLayout from '@/src/components/layout/PortalLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  AlertTriangle, Users, Sprout, Wind, Plus, MapPin, 
  ArrowUpRight, GraduationCap, Trash2, Zap, CloudAlert
} from 'lucide-react';
import ModulePlaceholder from '@/src/components/shared/ModulePlaceholder';
import { motion, AnimatePresence } from 'motion/react';
import { collection, query, onSnapshot, limit, orderBy } from 'firebase/firestore';
import { db } from '@/src/lib/firebase';

export default function ResourcesDashboard() {
  const location = useLocation();
  const [alerts, setAlerts] = useState<any[]>([]);

  useEffect(() => {
    // Fetch recent incidents/alerts as proxy for DRRM
    const q = query(collection(db, 'incidents'), limit(4));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setAlerts(snapshot.docs.map(doc => ({ 
        id: doc.id, 
        type: doc.data().type || 'Alert', 
        title: doc.data().description || 'Low Pressure Area Alert', 
        status: doc.data().status || 'Monitoring', 
        time: 'Just now', 
        color: doc.data().severity === 'High' ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'
      })));
    });

    return () => unsubscribe();
  }, []);

  // If we're at a sub-route, show placeholder
  if (location.pathname !== '/resources') {
    const moduleName = location.pathname.split('/').pop()?.replace('-', ' ') || 'Module';
    return (
      <PortalLayout>
        <ModulePlaceholder title={moduleName.charAt(0).toUpperCase() + moduleName.slice(1)} />
      </PortalLayout>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <PortalLayout>
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="space-y-6 lg:space-y-8"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <motion.div variants={itemVariants}>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-amber-50 rounded-2xl">
                <AlertTriangle className="text-amber-600 h-6 w-6 lg:h-8 lg:w-8" />
              </div>
              <div>
                <h2 className="text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight italic uppercase">Resources & DRRM</h2>
                <p className="text-xs lg:text-sm font-medium text-slate-500 mt-1 uppercase tracking-widest leading-none">Youth, Disaster Risk, and Environment Control</p>
              </div>
            </div>
          </motion.div>
          <motion.div variants={itemVariants} className="flex gap-2">
            <Button className="bg-amber-600 hover:bg-amber-700 font-bold shadow-lg shadow-amber-600/20">
              <MapPin className="mr-2 h-4 w-4" /> Live Situation Map
            </Button>
          </motion.div>
        </div>

        {/* Resource Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {[
            { label: 'Youth Population', value: '3,546', icon: GraduationCap, color: 'text-purple-600', bg: 'bg-purple-50', trend: 'Active SK' },
            { label: 'DRR Gear Status', value: 'Ready', icon: AlertTriangle, color: 'text-amber-600', bg: 'bg-amber-50', trend: '42 Units' },
            { label: 'Waste Collection', value: '98%', icon: Trash2, color: 'text-emerald-600', bg: 'bg-emerald-50', trend: 'Purok 1-7' },
            { label: 'Evac Capacity', value: '500', icon: Wind, color: 'text-blue-600', bg: 'bg-blue-50', trend: 'Available' },
          ].map((stat, i) => (
            <motion.div key={i} variants={itemVariants}>
              <Card className="hover:shadow-lg transition-all border-slate-200 overflow-hidden group">
                <CardContent className="pt-6">
                  <div className="flex flex-col">
                    <div className={`${stat.bg} ${stat.color} w-10 h-10 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110`}>
                      <stat.icon size={20} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
                      <p className="text-2xl font-black text-slate-900 mt-1 tracking-tighter leading-none">{stat.value}</p>
                      <p className="text-[9px] font-bold text-slate-400 mt-2 uppercase tracking-tighter">{stat.trend}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Feed */}
          <div className="lg:col-span-8 space-y-6">
            <motion.div variants={itemVariants}>
              <Card className="border-slate-200 shadow-sm overflow-hidden bg-white">
                <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-slate-50">
                   <div>
                    <CardTitle className="text-lg font-bold tracking-tight">Active Situations & Assets</CardTitle>
                    <CardDescription className="text-xs">Real-time status of youth, disaster, and environmental assets</CardDescription>
                  </div>
                  <Badge className="bg-amber-100 text-amber-700 font-black text-[10px] uppercase border-amber-200">
                    Live Feed
                  </Badge>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <AnimatePresence mode="popLayout">
                      {(alerts.length > 0 ? alerts : [
                        { type: 'Weather', title: 'Low Pressure Area Alert', status: 'Monitoring', time: '1 hr ago', color: 'bg-blue-50 text-blue-600' },
                        { type: 'Environment', title: 'River Level Check', status: 'Normal', time: '2 hrs ago', color: 'bg-emerald-50 text-emerald-600' },
                      ]).map((alert, i) => (
                        <motion.div 
                          key={alert.id || i} 
                          layout
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="flex items-center justify-between p-4 rounded-2xl border border-slate-100 hover:border-amber-100 hover:bg-amber-50/10 transition-all group"
                        >
                          <div className="flex items-center gap-4">
                            <div className={`${alert.color} p-2.5 rounded-xl transition-transform group-hover:rotate-12`}>
                              <CloudAlert size={18} />
                            </div>
                            <div className="min-w-0">
                              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">{alert.type}</p>
                              <h4 className="font-bold text-slate-800 truncate">{alert.title}</h4>
                            </div>
                          </div>
                          <div className="text-right shrink-0">
                             <Badge variant="outline" className="text-[10px] font-black uppercase tracking-tighter mb-1.5 border-slate-200">
                               {alert.status}
                             </Badge>
                             <p className="text-[10px] font-bold text-slate-400 uppercase">{alert.time}</p>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                  <Button variant="ghost" className="w-full mt-6 text-[10px] font-black text-slate-400 hover:text-amber-600 uppercase tracking-widest">
                    View Comprehensive Registry
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-4 space-y-6">
            <motion.div variants={itemVariants}>
              <Card className="border-slate-800 bg-slate-900 text-white overflow-hidden shadow-2xl">
                <CardHeader className="bg-amber-600 text-slate-900 p-6 relative">
                  <div className="absolute top-0 right-0 p-4">
                     <Zap size={24} className="text-slate-900/40" />
                  </div>
                  <CardTitle className="text-lg font-black tracking-tight uppercase italic">Crisis Protocols</CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-5">
                   <div className="p-4 rounded-xl bg-white/5 border border-white/10 group hover:bg-white/10 transition-colors">
                      <h4 className="font-bold text-amber-500 text-sm mb-2 flex items-center gap-2">
                        <AlertTriangle size={16} /> Signal No. 1
                      </h4>
                      <p className="text-[11px] text-slate-400 leading-relaxed">Activate monitoring of river systems and clear drainage paths. BPSO standby.</p>
                   </div>
                   <div className="p-4 rounded-xl bg-white/5 border border-white/10 opacity-50 relative group">
                      <h4 className="font-bold text-red-500 text-sm mb-2 flex items-center gap-2">
                        <AlertTriangle size={16} /> Signal No. 2
                      </h4>
                      <p className="text-[11px] text-slate-400 leading-relaxed">Deploy rescue teams to coastal areas (Purok 7). Evacuation active.</p>
                   </div>
                   <Button className="w-full bg-white text-slate-900 hover:bg-slate-100 font-black uppercase tracking-widest text-xs h-12 rounded-xl shadow-xl">
                      Escalate Alert Level
                   </Button>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card className="border-slate-200 shadow-sm border-t-4 border-t-purple-500">
                <CardHeader>
                   <CardTitle className="text-xs font-black text-slate-400 uppercase tracking-widest">SK Youth Programs</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { title: 'Sports Fest Registration', stat: '420 Joined' },
                    { title: 'Youth Leadership Seminar', stat: 'Coming Soon' },
                    { title: 'Environmental Cleanup', stat: 'Purok 3' },
                  ].map((prog, i) => (
                    <div key={i} className="flex items-center justify-between group cursor-pointer hover:bg-slate-50 p-2 rounded-lg transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                        <span className="text-xs font-bold text-slate-700 leading-tight">{prog.title}</span>
                      </div>
                      <span className="text-[10px] font-black text-slate-300 uppercase italic shrink-0 ml-2">{prog.stat}</span>
                    </div>
                  ))}
                  <Button variant="outline" className="w-full text-[10px] font-black text-slate-400 hover:text-purple-600 uppercase tracking-widest mt-2 border-slate-200">
                    Draft SK Project
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </aside>
        </div>
      </motion.div>
    </PortalLayout>
  );
}
