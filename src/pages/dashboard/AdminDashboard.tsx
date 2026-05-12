import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import PortalLayout from '@/src/components/layout/PortalLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { 
  Users, FileText, UserPlus, Clock, Send, CheckCircle2, XCircle, 
  UserCheck, Zap, ShieldCheck, Bell, ArrowUpRight, Activity, Plus, History, Landmark
} from 'lucide-react';
import { useSocket } from '@/src/contexts/SocketContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import ModulePlaceholder from '@/src/components/shared/ModulePlaceholder';
import { collection, query, where, onSnapshot, getCountFromServer, updateDoc, doc, limit } from 'firebase/firestore';
import { db } from '@/src/lib/firebase';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from 'recharts';

const chartData = [
  { name: 'Mon', count: 12, color: '#3b82f6' },
  { name: 'Tue', count: 18, color: '#2563eb' },
  { name: 'Wed', count: 15, color: '#1d4ed8' },
  { name: 'Thu', count: 22, color: '#1e40af' },
  { name: 'Fri', count: 30, color: '#1e3a8a' },
  { name: 'Sat', count: 10, color: '#3b82f6' },
  { name: 'Sun', count: 8, color: '#93c5fd' },
];

export default function AdminDashboard() {
  const { messages, broadcastMessage } = useSocket();
  const [msg, setMsg] = useState('');
  const [pendingStaff, setPendingStaff] = useState<any[]>([]);
  const [recentLogs, setRecentLogs] = useState<any[]>([]);
  const [counts, setCounts] = useState({
    residents: 10860,
    staff: 12,
    requests: 18,
    newToday: 24
  });
  const location = useLocation();

  useEffect(() => {
    // Fetch pending staff
    const qStaff = query(collection(db, 'staff'), where('isApproved', '==', false));
    const unsubStaff = onSnapshot(qStaff, (snapshot) => {
      setPendingStaff(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    // Recent updates for the feed
    const qReq = query(collection(db, 'document_requests'), limit(5));
    const unsubReq = onSnapshot(qReq, (snapshot) => {
      const logs = snapshot.docs.map(doc => ({
        id: doc.id,
        action: `New ${doc.data().documentType} Request`,
        user: doc.data().userName || 'Resident',
        time: 'Just now',
        color: 'bg-indigo-500'
      }));
      if (logs.length > 0) setRecentLogs(logs);
    });

    const updateCounts = async () => {
      try {
        const resCount = await getCountFromServer(collection(db, 'residents'));
        const staffCount = await getCountFromServer(collection(db, 'staff'));
        const reqCount = await getCountFromServer(collection(db, 'document_requests'));
        
        setCounts({
          residents: resCount.data().count || 10860,
          staff: staffCount.data().count || 12,
          requests: reqCount.data().count || 18,
          newToday: 24
        });
      } catch (e) {
        console.error("Error fetching counts:", e);
      }
    };

    updateCounts();
    return () => {
      unsubStaff();
      unsubReq();
    };
  }, []);

  const handleApproveStaff = async (id: string) => {
    try {
      await updateDoc(doc(db, 'staff', id), { isApproved: true });
    } catch (e) {
      console.error("Error approving staff:", e);
    }
  };

  const handleSend = () => {
    if (msg.trim()) {
      broadcastMessage(msg);
      setMsg('');
    }
  };

  const stats = [
    { name: 'Total Residents', value: counts.residents.toLocaleString(), icon: Users, color: 'text-blue-600', bg: 'bg-blue-50', trend: '+2.4%' },
    { name: 'Active Staff', value: counts.staff.toString(), icon: UserCheck, color: 'text-emerald-600', bg: 'bg-emerald-50', trend: 'Stable' },
    { name: 'Pending Requests', value: counts.requests.toString(), icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50', trend: '-12%' },
    { name: 'Today\'s Visitors', value: counts.newToday.toString(), icon: Activity, color: 'text-indigo-600', bg: 'bg-indigo-50', trend: '+18%' },
  ];

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
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <motion.div variants={itemVariants}>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-600 rounded-2xl shadow-lg shadow-blue-600/30">
                <ShieldCheck className="text-white h-6 w-6 lg:h-8 lg:w-8" />
              </div>
              <div>
                <h2 className="text-2xl lg:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                  Admin Console
                  <Badge variant="outline" className="text-[10px] uppercase font-black tracking-widest border-blue-100 text-blue-600 bg-blue-50/50 h-5 px-2">V2.4</Badge>
                </h2>
                <p className="text-xs lg:text-sm font-medium text-slate-500 mt-1 flex items-center gap-2">
                  <Activity size={14} className="text-emerald-500 animate-pulse" />
                  Live Governance Hub • Connected to Baluarte Network
                </p>
              </div>
            </div>
          </motion.div>
          <motion.div variants={itemVariants} className="flex items-center gap-2 sm:gap-3">
             <Button variant="outline" size="sm" className="bg-white font-bold border-slate-200 h-10 px-4 rounded-xl hover:bg-slate-50 transition-all">
              <History size={16} className="mr-2 text-slate-400" /> Logs
            </Button>
            <Button className="bg-slate-900 hover:bg-slate-800 font-bold h-10 px-4 rounded-xl shadow-lg shadow-slate-900/20">
              <Plus size={16} className="mr-2" /> New Entry
            </Button>
          </motion.div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {stats.map((stat, i) => (
            <motion.div key={stat.name} variants={itemVariants}>
              <Card className="hover:shadow-lg transition-all border-slate-200 overflow-hidden group h-full">
                <CardContent className="p-4 lg:p-6 relative flex flex-col h-full">
                  <div className="absolute top-0 right-0 p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <ArrowUpRight size={14} className="text-slate-300" />
                  </div>
                  <div className="flex items-center sm:items-start justify-between">
                    <div>
                      <p className="text-[10px] lg:text-xs font-bold text-slate-400 uppercase tracking-widest leading-none">{stat.name}</p>
                      <p className="text-xl lg:text-3xl font-black text-slate-900 mt-1 lg:mt-2 tracking-tighter leading-none">{stat.value}</p>
                      <div className={`text-[9px] lg:text-[10px] font-bold mt-1.5 lg:mt-2.5 flex items-center gap-1 ${stat.trend.startsWith('+') ? 'text-emerald-500' : stat.trend === 'Stable' ? 'text-slate-400' : 'text-red-500'}`}>
                        {stat.trend} <span className="text-slate-300">vs last week</span>
                      </div>
                    </div>
                    <div className={`${stat.bg} ${stat.color} p-2 lg:p-3 rounded-xl lg:rounded-2xl transition-transform group-hover:scale-110 duration-300 shadow-sm border border-black/5`}>
                      <stat.icon size={20} className="lg:w-6 lg:h-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Area */}
          <div className="lg:col-span-8 space-y-6">
            {/* Quick Actions Bar */}
            <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Add Resident', icon: UserPlus, color: 'bg-indigo-600', hover: 'hover:bg-indigo-50' },
                { label: 'Issue Document', icon: FileText, color: 'bg-emerald-600', hover: 'hover:bg-emerald-50' },
                { label: 'Broadcast Alert', icon: Bell, color: 'bg-rose-600', hover: 'hover:bg-rose-50' },
                { label: 'System Check', icon: Zap, color: 'bg-amber-500', hover: 'hover:bg-amber-50' },
              ].map((action, i) => (
                <Button 
                  key={i} 
                  variant="outline" 
                  className={cn(
                    "bg-white h-auto py-6 flex flex-col items-center gap-3 border-slate-200 transition-all font-black text-[10px] uppercase tracking-widest group shadow-sm rounded-2xl",
                    action.hover
                  )}
                >
                  <div className={cn(
                    action.color,
                    "text-white p-3 rounded-2xl group-hover:scale-110 group-hover:rotate-6 transition-all shadow-lg"
                  )}>
                    <action.icon size={20} />
                  </div>
                  {action.label}
                </Button>
              ))}
            </motion.div>

            {/* Staff Approvals */}
            <motion.div variants={itemVariants}>
              <Card className="border-slate-200 shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b border-slate-50">
                  <div>
                    <CardTitle className="text-lg font-bold tracking-tight">Staff Access Requests</CardTitle>
                    <CardDescription className="text-xs">Queue for administrator verification</CardDescription>
                  </div>
                  <Badge className="bg-amber-100 text-amber-700 border-amber-200 font-bold px-3">
                    {pendingStaff.length} Pending
                  </Badge>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="space-y-3">
                    <AnimatePresence mode="popLayout">
                      {pendingStaff.length === 0 ? (
                        <motion.div 
                          key="empty"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="text-center py-12 text-slate-400 text-sm flex flex-col items-center gap-3"
                        >
                          <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center">
                            <CheckCircle2 size={24} className="text-slate-200" />
                          </div>
                          No personnel currently awaiting approval.
                        </motion.div>
                      ) : (
                        pendingStaff.map((staff) => (
                          <motion.div 
                            key={staff.id} 
                            layout
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: 20, opacity: 0 }}
                            className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-slate-50/50 rounded-2xl border border-slate-100 gap-4 hover:border-blue-100 transition-colors group"
                          >
                            <div className="flex items-center gap-4">
                              <div className="shrink-0 w-12 h-12 rounded-2xl bg-blue-100 flex items-center justify-center text-blue-600 font-black shadow-sm group-hover:rotate-3 transition-transform">
                                {staff.displayName?.[0] || 'S'}
                              </div>
                              <div className="min-w-0">
                                <p className="text-sm font-bold text-slate-900 truncate">{staff.displayName}</p>
                                <div className="flex items-center gap-2 mt-0.5">
                                  <Badge variant="outline" className="text-[10px] font-bold h-5 uppercase bg-white border-slate-200 text-slate-500">
                                    {staff.department?.replace(/_/g, ' ')}
                                  </Badge>
                                  <span className="text-[10px] text-slate-400 font-medium truncate">{staff.email}</span>
                                </div>
                              </div>
                            </div>
                            <div className="flex gap-2 w-full sm:w-auto">
                              <Button 
                                size="sm" 
                                className="flex-1 sm:flex-initial bg-blue-600 hover:bg-blue-700 font-bold"
                                onClick={() => handleApproveStaff(staff.id)}
                              >
                                Approve
                              </Button>
                              <Button size="sm" variant="outline" className="bg-white text-slate-400 hover:text-red-500 border-slate-200">
                                <XCircle size={16} />
                              </Button>
                            </div>
                          </motion.div>
                        ))
                      )}
                    </AnimatePresence>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

             {/* Chart Card */}
            <motion.div variants={itemVariants}>
              <Card className="border-slate-200 shadow-sm overflow-hidden bg-white">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <div>
                    <CardTitle className="text-lg font-extrabold tracking-tight">Citizen Engagement</CardTitle>
                    <CardDescription className="text-xs font-medium text-slate-400">Weekly platform activity metrics</CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="px-2 sm:px-6">
                  <div className="h-[250px] w-full mt-4">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis 
                          dataKey="name" 
                          stroke="#94A3B8" 
                          fontSize={11} 
                          fontWeight={700}
                          tickLine={false} 
                          axisLine={false} 
                          dy={10}
                        />
                        <YAxis 
                          stroke="#94A3B8" 
                          fontSize={11} 
                          fontWeight={700}
                          tickLine={false} 
                          axisLine={false} 
                        />
                        <Tooltip 
                          cursor={{fill: '#f8fafc', radius: 8}} 
                          contentStyle={{ 
                            borderRadius: '16px', 
                            border: '1px solid #e2e8f0', 
                            boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)',
                            fontSize: '12px',
                            fontWeight: '800'
                          }} 
                        />
                        <Bar dataKey="count" radius={[6, 6, 0, 0]} barSize={36}>
                          {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} fillOpacity={0.9} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          <div className="lg:col-span-4 space-y-6">
            {/* System Pulse */}
            <motion.div variants={itemVariants}>
              <Card className="border-slate-200 shadow-sm bg-gradient-to-br from-slate-900 to-slate-800 text-white overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between uppercase tracking-tighter">
                    <div className="flex items-center gap-2">
                       <Activity size={14} className="text-emerald-400" />
                       <span className="text-[10px] font-black text-slate-300">System Pulse</span>
                    </div>
                    <div className="flex items-center gap-1.5 grayscale opacity-50">
                       <Landmark size={10} />
                       <span className="text-[9px] font-bold">Node 01</span>
                    </div>
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-4">
                    <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-2">Network</p>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-sm font-black italic">OPTIMAL</span>
                      </div>
                    </div>
                    <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-2">Sync</p>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-blue-500" />
                        <span className="text-sm font-black italic text-blue-400">SYNCED</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Broadcast Hub */}
            <motion.div variants={itemVariants}>
              <Card className="border-slate-200 shadow-md overflow-hidden ring-1 ring-slate-200 ring-inset">
                <CardHeader className="bg-slate-900 text-white p-6 relative">
                  <div className="absolute top-0 right-0 p-4">
                     <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping absolute" />
                     <div className="w-2 h-2 rounded-full bg-emerald-500 relative" />
                  </div>
                  <CardTitle className="text-lg font-black tracking-tight uppercase italic">Broadcast Hub</CardTitle>
                  <CardDescription className="text-slate-400 text-xs font-bold tracking-widest mt-1">REAL-TIME STAFF COMMS</CardDescription>
                </CardHeader>
                <CardContent className="p-6 bg-slate-50/50">
                  <div className="space-y-4">
                    <div className="max-h-[220px] overflow-y-auto space-y-3 scrollbar-hide pr-1">
                      <AnimatePresence initial={false}>
                        {messages.length === 0 ? (
                          <div className="text-center py-10">
                            <Bell size={32} className="mx-auto text-slate-200 mb-2" />
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">No Active Alerts</p>
                          </div>
                        ) : (
                          messages.map((m, i) => (
                            <motion.div 
                              key={m.id || i} 
                              initial={{ opacity: 0, x: 20 }}
                              animate={{ opacity: 1, x: 0 }}
                              className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm group"
                            >
                              <p className="text-sm font-bold text-slate-800 leading-tight">{m.text}</p>
                              <div className="flex items-center justify-between mt-2.5">
                                <span className="text-[9px] font-black text-blue-600 uppercase tracking-widest flex items-center gap-1">
                                  <Zap size={10} /> TRANSMITTING...
                                </span>
                                <span className="text-[10px] text-slate-400 font-bold">
                                  {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                              </div>
                            </motion.div>
                          ))
                        )}
                      </AnimatePresence>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Input 
                        value={msg} 
                        onChange={(e) => setMsg(e.target.value)} 
                        placeholder="Type a broadcast..." 
                        className="bg-white border-slate-200 text-sm h-12 rounded-xl font-medium focus-visible:ring-blue-500 shadow-sm"
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                      />
                      <Button onClick={handleSend} className="bg-slate-900 hover:bg-slate-800 h-12 w-12 rounded-xl shrink-0 p-0 shadow-lg group">
                        <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Audit Log */}
            <motion.div variants={itemVariants}>
              <Card className="border-slate-200 shadow-sm border-t-4 border-t-blue-600 overflow-hidden">
                <CardHeader className="pb-3">
                   <CardTitle className="text-base font-black tracking-widest uppercase text-slate-400">Live Audit Log</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-5">
                    {(recentLogs.length > 0 ? recentLogs : [
                      { user: 'Sec. Maria', action: 'Approved Residency', time: '10m', color: 'bg-emerald-500' },
                      { user: 'Capt. Juan', action: 'Signed Res. 04', time: '1h', color: 'bg-blue-500' },
                      { user: 'Tanod Leo', action: 'Incident Report', time: '2h', color: 'bg-indigo-500' },
                      { user: 'Treas. Ann', action: 'Daily Remittance', time: '4h', color: 'bg-amber-500' },
                    ]).map((log, i) => (
                      <div key={i} className="flex gap-4 group cursor-help">
                        <div className="relative">
                          <div className={`w-2 h-2 rounded-full ${log.color || 'bg-blue-500'} mt-1.5 shrink-0 group-hover:scale-150 transition-transform`} />
                          {i !== 3 && <div className="absolute top-5 left-[3px] bottom-[-20px] w-[1px] bg-slate-100" />}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-black text-slate-800 leading-none group-hover:text-blue-600 transition-colors uppercase tracking-tight">{log.action}</p>
                          <div className="flex justify-between items-center mt-1.5">
                             <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest">{log.user}</p>
                             <p className="text-[10px] text-slate-400 font-black">{log.time}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Button variant="ghost" className="w-full mt-8 text-[10px] font-black text-slate-400 hover:text-blue-600 hover:bg-slate-50 tracking-widest uppercase">
                    Launch Full Auditor
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
