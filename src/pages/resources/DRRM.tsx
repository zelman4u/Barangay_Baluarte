import React, { useState, useEffect } from 'react';
import PortalLayout from '@/src/components/layout/PortalLayout';
import { 
  AlertTriangle, Search, Plus, Filter, Download, 
  MapPin, Clock, ShieldAlert, Zap,
  Navigation, CheckCircle2, Siren,
  Database, Info, CloudRain, Wind, Waves,
  Activity, BellRing
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { collection, query, onSnapshot, orderBy, limit } from 'firebase/firestore';
import { db } from '@/src/lib/firebase';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';

export default function DRRM() {
  const [incidents, setIncidents] = useState<any[]>([]);

  useEffect(() => {
    const q = query(collection(db, 'incidents'), orderBy('createdAt', 'desc'), limit(5));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setIncidents(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <PortalLayout>
      <motion.div initial="hidden" animate="visible" variants={containerVariants} className="space-y-6 lg:space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <motion.div variants={itemVariants}>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-amber-50 rounded-2xl shadow-md border border-amber-100">
                <AlertTriangle className="text-amber-600 h-6 w-6 lg:h-8 lg:w-8 animate-pulse" />
              </div>
              <div>
                <h2 className="text-2xl lg:text-3xl font-black text-slate-900 tracking-tight text-left uppercase italic">Disaster Preparedness</h2>
                <p className="text-[10px] lg:text-xs font-bold text-slate-500 uppercase tracking-[0.2em] mt-1 italic text-left tracking-widest">DRRM / Crisis Management Center</p>
              </div>
            </div>
          </motion.div>
          
          <motion.div variants={itemVariants} className="flex gap-2">
            <Button className="h-11 px-6 rounded-xl bg-slate-900 text-white font-black uppercase tracking-widest text-[10px] hover:bg-slate-800 shadow-xl">
               Inventory Check
            </Button>
            <Button className="h-11 px-6 rounded-xl bg-amber-600 text-white font-black uppercase tracking-widest text-[10px] hover:bg-amber-700 shadow-xl shadow-amber-900/40">
               <BellRing className="mr-2 h-4 w-4" /> Issue Warning
            </Button>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
           {[
             { label: 'River Level', value: '1.2m', status: 'Stable', icon: Waves, color: 'text-blue-500', bg: 'bg-blue-50' },
             { label: 'Wind Speed', value: '14km/h', status: 'Light', icon: Wind, color: 'text-emerald-500', bg: 'bg-emerald-50' },
             { label: 'Precipitation', value: '42mm', status: 'Moderate', icon: CloudRain, color: 'text-sky-500', bg: 'bg-sky-50' },
             { label: 'Seismic Act', value: 'None', status: 'Active Scan', icon: Activity, color: 'text-rose-500', bg: 'bg-rose-50' },
           ].map((stat, i) => (
             <motion.div key={i} variants={itemVariants}>
                <Card className="border-slate-200/60 shadow-lg rounded-2xl overflow-hidden group hover:shadow-xl transition-all cursor-default h-full">
                   <CardContent className="p-6">
                      <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110", stat.bg, stat.color)}>
                         <stat.icon size={24} strokeWidth={2.5} />
                      </div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic leading-none">{stat.label}</p>
                      <p className="text-2xl font-black text-slate-900 mt-1 tracking-tighter leading-none">{stat.value}</p>
                      <Badge variant="outline" className="mt-4 border-none bg-slate-50 text-slate-500 font-bold text-[9px] uppercase tracking-widest h-5 px-2">{stat.status}</Badge>
                   </CardContent>
                </Card>
             </motion.div>
           ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
           <div className="lg:col-span-8">
              <Card className="border-slate-200/60 shadow-2xl bg-white rounded-3xl overflow-hidden h-full">
                 <CardHeader className="bg-slate-950 text-white p-6 border-b border-white/5">
                    <CardTitle className="text-xs font-black uppercase tracking-[0.3em] text-amber-500 flex items-center justify-between">
                       Situation Master Feed <Zap size={16} className="animate-pulse" />
                    </CardTitle>
                 </CardHeader>
                 <CardContent className="p-0">
                    <Table>
                       <TableHeader className="bg-slate-50/50">
                          <TableRow className="border-none">
                             <TableHead className="py-4 text-[10px] font-black uppercase text-slate-400 pl-6">Alert Category</TableHead>
                             <TableHead className="text-[10px] font-black uppercase text-slate-400">Purok / Area</TableHead>
                             <TableHead className="text-[10px] font-black uppercase text-slate-400 text-right pr-6">Severity</TableHead>
                          </TableRow>
                       </TableHeader>
                       <TableBody>
                          {incidents.length === 0 ? (
                            <TableRow>
                              <TableCell colSpan={3} className="py-32 text-center text-slate-300">
                                 <ShieldAlert size={48} className="mx-auto mb-4 opacity-10" />
                                 <p className="text-xs font-black uppercase tracking-widest italic">No Active Threats Detected</p>
                              </TableCell>
                            </TableRow>
                          ) : (
                            incidents.map(inc => (
                              <TableRow key={inc.id} className="border-b border-slate-50 hover:bg-slate-50/50">
                                 <TableCell className="pl-6 py-5">
                                    <div className="flex items-center gap-4">
                                       <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-amber-500 shrink-0">
                                          <Navigation size={18} />
                                       </div>
                                       <div>
                                          <p className="font-black text-slate-900 tracking-tight leading-none mb-1">{inc.type || 'General Alert'}</p>
                                          <p className="text-[10px] font-bold text-slate-400 line-clamp-1">{inc.description || 'Routine monitoring active.'}</p>
                                       </div>
                                    </div>
                                 </TableCell>
                                 <TableCell>
                                    <div className="flex items-center gap-2">
                                       <MapPin size={14} className="text-slate-400" />
                                       <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">{inc.location || 'All Sectors'}</span>
                                    </div>
                                 </TableCell>
                                 <TableCell className="text-right pr-6">
                                    <Badge className={cn("border-none font-black text-[9px] uppercase px-3 h-6 tracking-widest", 
                                      inc.severity === 'High' ? 'bg-red-500 text-white shadow-lg shadow-red-500/20' : 'bg-blue-500 text-white shadow-lg shadow-blue-500/20'
                                    )}>{inc.severity || 'Normal'}</Badge>
                                 </TableCell>
                              </TableRow>
                            ))
                          )}
                       </TableBody>
                    </Table>
                 </CardContent>
              </Card>
           </div>
           <div className="lg:col-span-4 space-y-6">
              <Card className="border-none shadow-xl bg-gradient-to-br from-amber-500 to-amber-700 text-white rounded-3xl overflow-hidden p-6 relative">
                 <div className="absolute top-0 right-0 p-4 opacity-10">
                    <CloudRain size={80} />
                 </div>
                 <h4 className="text-[10px] font-black uppercase tracking-[0.3em] mb-4 text-amber-100 italic">Disaster Comms Hub</h4>
                 <div className="space-y-3">
                    <div className="p-3 bg-white/10 rounded-2xl border border-white/5 backdrop-blur-sm">
                       <p className="text-xs font-black mb-1">Radio Channel: BARANGAY-1</p>
                       <p className="text-[10px] font-medium text-amber-100">Status: Active Service</p>
                    </div>
                    <div className="p-3 bg-white/10 rounded-2xl border border-white/5 backdrop-blur-sm">
                       <p className="text-xs font-black mb-1">Evac. Ready: HIGH</p>
                       <p className="text-[10px] font-medium text-amber-100">Hotline: 911-BALUARTE</p>
                    </div>
                 </div>
                 <Button className="w-full bg-slate-950 text-white hover:bg-slate-900 border-none font-black uppercase tracking-widest text-[10px] h-12 rounded-xl mt-6 shadow-2xl">
                    Crisis Broadcast System
                 </Button>
              </Card>

              <Card className="border-slate-200/60 shadow-lg rounded-3xl p-6 bg-white border-t-4 border-t-amber-500">
                 <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 italic">Response Team On-Call</h4>
                 <div className="space-y-4">
                    {[
                      { team: 'BPSO Alpha', status: 'Ready', count: 12 },
                      { team: 'Medical Unit 1', status: 'Stationed', count: 4 },
                      { team: 'Rescue Team B', status: 'Assigned', count: 8 },
                    ].map((t, i) => (
                      <div key={i} className="flex justify-between items-center bg-slate-50 p-3 rounded-2xl border border-slate-100">
                         <div>
                            <p className="text-xs font-black text-slate-900">{t.team}</p>
                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{t.status}</span>
                         </div>
                         <div className="h-8 w-8 rounded-full bg-slate-900 text-amber-500 flex items-center justify-center text-[10px] font-black">
                            {t.count}
                         </div>
                      </div>
                    ))}
                 </div>
              </Card>
           </div>
        </div>
      </motion.div>
    </PortalLayout>
  );
}
