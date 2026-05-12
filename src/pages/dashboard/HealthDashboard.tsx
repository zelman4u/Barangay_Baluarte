import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import PortalLayout from '@/src/components/layout/PortalLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { HeartPulse, Activity, Syringe, Plus, Search, MapPin, ArrowUpRight, ClipboardList, Thermometer } from 'lucide-react';
import { Input } from '@/components/ui/input';
import ModulePlaceholder from '@/src/components/shared/ModulePlaceholder';
import { motion, AnimatePresence } from 'motion/react';
import { collection, query, where, onSnapshot, getCountFromServer, limit, orderBy } from 'firebase/firestore';
import { db } from '@/src/lib/firebase';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area 
} from 'recharts';

const healthTrendData = [
  { name: 'Mon', visits: 12 },
  { name: 'Tue', visits: 18 },
  { name: 'Wed', visits: 15 },
  { name: 'Thu', visits: 25 },
  { name: 'Fri', visits: 20 },
  { name: 'Sat', visits: 10 },
  { name: 'Sun', visits: 5 },
];

export default function HealthDashboard() {
  const location = useLocation();
  const [records, setRecords] = useState<any[]>([]);
  const [stats, setStats] = useState({
    vaccinated: '92.4%',
    monitored: 0,
    activeCases: 14,
    staff: 12
  });

  useEffect(() => {
    // Fetch recent health records
    const q = query(collection(db, 'health'), limit(6));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setRecords(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    const fetchCounts = async () => {
      try {
        const monitoredCount = await getCountFromServer(collection(db, 'health'));
        setStats(prev => ({ ...prev, monitored: monitoredCount.data().count }));
      } catch (e) {
        console.error(e);
      }
    };
    fetchCounts();

    return () => unsubscribe();
  }, []);

  // If we're at a sub-route, show placeholder
  if (location.pathname !== '/health') {
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
              <div className="p-3 bg-rose-50 rounded-2xl">
                <HeartPulse className="text-rose-600 h-6 w-6 lg:h-8 lg:w-8" />
              </div>
              <div>
                <h2 className="text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight">Health & Welfare</h2>
                <p className="text-xs lg:text-sm font-medium text-slate-500 mt-1 uppercase tracking-widest leading-none">Purok-Based Health Monitoring</p>
              </div>
            </div>
          </motion.div>
          <motion.div variants={itemVariants} className="flex gap-2">
            <Button className="bg-rose-600 hover:bg-rose-700 font-bold shadow-lg shadow-rose-600/20">
              <Plus className="mr-2 h-4 w-4" /> New Patient Record
            </Button>
          </motion.div>
        </div>

        {/* Health Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {[
            { label: 'Vaccinated', value: stats.vaccinated, icon: Syringe, color: 'text-rose-600', bg: 'bg-rose-50', trend: '+0.2%' },
            { label: 'Residents Monitored', value: stats.monitored || '1,042', icon: Activity, color: 'text-emerald-600', bg: 'bg-emerald-50', trend: 'Global' },
            { label: 'Active Concerns', value: stats.activeCases, icon: Thermometer, color: 'text-amber-600', bg: 'bg-amber-50', trend: '-2' },
            { label: 'BHW Personnel', value: stats.staff, icon: ClipboardList, color: 'text-blue-600', bg: 'bg-blue-50', trend: 'Active' },
          ].map((stat, i) => (
            <motion.div key={i} variants={itemVariants}>
              <Card className="hover:shadow-lg transition-all border-slate-200 overflow-hidden group">
                <CardContent className="pt-6 relative">
                  <div className="flex flex-col">
                    <div className={`${stat.bg} ${stat.color} w-10 h-10 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110`}>
                      <stat.icon size={20} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
                      <p className="text-2xl font-black text-slate-900 mt-1 tracking-tighter">{stat.value}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Chart Area */}
            <motion.div variants={itemVariants}>
              <Card className="border-slate-200 shadow-sm overflow-hidden h-full">
                <CardHeader className="pb-2 border-b border-slate-50">
                   <CardTitle className="text-lg font-bold tracking-tight">Patient Traffic</CardTitle>
                   <CardDescription className="text-xs">Weekly health center visitations</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="h-[250px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={healthTrendData}>
                        <defs>
                          <linearGradient id="colorVisits" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#e11d48" stopOpacity={0.1}/>
                            <stop offset="95%" stopColor="#e11d48" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="name" stroke="#94A3B8" fontSize={11} fontWeight={700} axisLine={false} tickLine={false} dy={10} />
                        <YAxis stroke="#94A3B8" fontSize={11} fontWeight={700} axisLine={false} tickLine={false} />
                        <Tooltip />
                        <Area type="monotone" dataKey="visits" stroke="#e11d48" strokeWidth={3} fillOpacity={1} fill="url(#colorVisits)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Resident Records Search */}
            <motion.div variants={itemVariants} className="space-y-4">
              <div className="flex gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input placeholder="Search residents record..." className="pl-10 border-slate-200 h-11 bg-white font-medium" />
                </div>
                <Button variant="outline" className="border-slate-200 h-11 px-6 font-bold bg-white">Filter</Button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {records.length === 0 ? (
                  [1,2,3,4].map(i => (
                    <Card key={i} className="border-slate-200 opacity-60 animate-pulse bg-slate-50 h-[140px]" />
                  ))
                ) : (
                  records.map((record, i) => (
                    <Card key={i} className="border-slate-200 hover:shadow-md transition-all relative overflow-hidden group h-full">
                      <div className="absolute top-0 right-0 p-3">
                         <Badge variant="outline" className="text-[9px] font-black uppercase tracking-tighter bg-white">
                           {record.status || 'Active'}
                         </Badge>
                      </div>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base font-bold tracking-tight">{record.residentName || 'Unknown Resident'}</CardTitle>
                        <CardDescription className="text-xs font-medium">Baluarte Resident • Record #{record.id.slice(0, 5)}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-1 mb-4">
                          {(record.conditions || ['Hypertension', 'Regular Checkup']).map((c: string) => (
                            <Badge key={c} variant="secondary" className="text-[9px] font-bold bg-rose-50 text-rose-600 border-none px-2">
                              {c}
                            </Badge>
                          ))}
                        </div>
                        <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tight flex items-center gap-1">
                            <Activity size={12} /> Last Visit: {record.lastVisit || 'N/A'}
                          </span>
                          <Button variant="ghost" size="sm" className="text-[10px] font-black text-rose-600 hover:text-rose-700 hover:bg-rose-50 uppercase tracking-widest px-0">
                            View Log
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </motion.div>
          </div>

          <div className="space-y-6">
            <motion.div variants={itemVariants}>
              <Card className="border-slate-200 shadow-sm overflow-hidden">
                <CardHeader className="bg-rose-600 text-white p-6">
                  <CardTitle className="text-lg font-black tracking-tight uppercase italic flex items-center gap-2">
                    <Activity size={20} /> Health Alerts
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 bg-rose-50/20">
                  <div className="space-y-4">
                    {[
                      { title: 'Flu Season Advisory', desc: 'Increased cases reported in Purok 2.', level: 'Medium' },
                      { title: 'Vaccination Drive', desc: 'Pneumonia vaccines available at Brgy Hall.', level: 'Info' },
                      { title: 'Senior Checkup', desc: 'Free dental checkup for seniors tomorrow.', level: 'Low' },
                    ].map((alert, i) => (
                      <div key={i} className="bg-white p-3 rounded-xl border border-rose-100 shadow-sm">
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-[10px] font-black text-rose-600 uppercase tracking-widest">{alert.level}</p>
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                        </div>
                        <h4 className="text-sm font-bold text-slate-800">{alert.title}</h4>
                        <p className="text-xs text-slate-500 mt-1">{alert.desc}</p>
                      </div>
                    ))}
                    <Button className="w-full bg-slate-900 hover:bg-slate-800 text-xs font-bold h-11 rounded-xl mt-2">
                      Broadcast Advisory
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card className="border-slate-200 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-sm font-black text-slate-400 uppercase tracking-widest">Medical Support Feed</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { head: 'BHW Mary', action: 'Uploaded vaccination list', time: '5m' },
                    { head: 'Nurse Ann', action: 'Updated senior records', time: '18m' },
                    { head: 'Sec. Cora', action: 'Approved medical assist', time: '1h' },
                  ].map((log, i) => (
                    <div key={i} className="flex gap-4 group">
                      <div className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-slate-800 uppercase tracking-tight">{log.action}</p>
                        <p className="text-[10px] text-slate-400 font-bold mt-0.5">{log.head} • {log.time}</p>
                      </div>
                    </div>
                  ))}
                  <Button variant="ghost" className="w-full text-[10px] font-black text-slate-400 hover:text-rose-600 uppercase tracking-widest mt-4">
                    Full Records Access
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </PortalLayout>
  );
}
