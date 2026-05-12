import React, { useState, useEffect } from 'react';
import PortalLayout from '@/src/components/layout/PortalLayout';
import { 
  Zap, Search, Plus, Filter, Download, 
  MoreHorizontal, Megaphone, Globe,
  CheckCircle2, AlertCircle, Send,
  Database, BellRing, Bell, Info
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { collection, query, onSnapshot, orderBy, limit } from 'firebase/firestore';
import { db } from '@/src/lib/firebase';
import { motion } from 'motion/react';

export default function Alerts() {
  const [records, setRecords] = useState<any[]>([]);

  useEffect(() => {
    const q = query(collection(db, 'community_alerts'), orderBy('createdAt', 'desc'), limit(10));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setRecords(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
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
      <motion.div initial="hidden" animate="visible" variants={containerVariants} className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <motion.div variants={itemVariants}>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-amber-50 rounded-2xl shadow-sm border border-amber-100">
                <BellRing className="text-amber-600 h-6 w-6 lg:h-8 lg:w-8" />
              </div>
              <div>
                <h2 className="text-2xl lg:text-3xl font-black text-slate-900 tracking-tight text-left italic">Community Alerts</h2>
                <p className="text-[10px] lg:text-xs font-bold text-slate-500 uppercase tracking-[0.2em] mt-1 italic text-left">Mass Notification & Awareness System</p>
              </div>
            </div>
          </motion.div>
          
          <motion.div variants={itemVariants} className="flex gap-2">
            <Button className="h-11 px-6 rounded-xl bg-amber-600 text-white font-black uppercase tracking-widest text-xs hover:bg-amber-700 shadow-xl shadow-amber-900/20">
               <Send size={18} className="mr-2" /> New Broadcast
            </Button>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
           <div className="lg:col-span-2">
              <Card className="border-slate-200 shadow-xl bg-white rounded-3xl overflow-hidden h-full">
                 <CardHeader className="p-6 border-b border-slate-50 flex flex-row items-center justify-between">
                    <div>
                       <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-400 italic">Historical Broadcasts</CardTitle>
                    </div>
                    <Badge variant="outline" className="border-slate-100 text-slate-400 font-bold uppercase text-[9px] tracking-widest">Archive Mode</Badge>
                 </CardHeader>
                 <CardContent className="p-0">
                    <div className="overflow-x-auto">
                       <Table>
                          <TableHeader className="bg-slate-50/50">
                             <TableRow className="border-none">
                                <TableHead className="py-4 text-[10px] font-black uppercase tracking-widest pl-6">Alert Subject</TableHead>
                                <TableHead className="text-[10px] font-black uppercase tracking-widest">Medium</TableHead>
                                <TableHead className="text-[10px] font-black uppercase tracking-widest">Time Sent</TableHead>
                                <TableHead className="text-right pr-6 text-[10px] font-black uppercase tracking-widest">Impact</TableHead>
                             </TableRow>
                          </TableHeader>
                          <TableBody>
                             {records.length === 0 ? (
                               <TableRow>
                                 <TableCell colSpan={4} className="py-32 text-center px-12">
                                    <Megaphone size={48} className="text-slate-100 mx-auto mb-6" />
                                    <h4 className="text-lg font-black text-slate-300 italic uppercase">System Ready for Transmission</h4>
                                    <p className="text-xs font-medium text-slate-400 mt-2 max-w-sm mx-auto italic">Send real-time notifications to residents via mobile app push and SMS integration (Barangay-wide coverage).</p>
                                 </TableCell>
                               </TableRow>
                             ) : (
                               records.map(rec => (
                                 <TableRow key={rec.id} className="border-b border-slate-50 hover:bg-amber-50/20 transition-colors">
                                    <TableCell className="pl-6 py-5">
                                       <p className="font-extrabold text-slate-900 leading-tight">{rec.subject || 'Public Advisory'}</p>
                                       <p className="text-[9px] font-black text-slate-400 uppercase mt-1">Ref ID: {rec.id.slice(0, 8)}</p>
                                    </TableCell>
                                    <TableCell>
                                       <Badge className="bg-slate-100 text-slate-500 border-none font-bold text-[9px] uppercase tracking-tighter">Mobile SMS</Badge>
                                    </TableCell>
                                    <TableCell>
                                       <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">2h ago</span>
                                    </TableCell>
                                    <TableCell className="text-right pr-6">
                                       <p className="text-xs font-black text-emerald-500 tracking-tighter">98% Sent</p>
                                    </TableCell>
                                 </TableRow>
                               ))
                             )}
                          </TableBody>
                       </Table>
                    </div>
                 </CardContent>
              </Card>
           </div>
           <div className="space-y-6">
              <Card className="border-none shadow-xl bg-slate-900 text-white rounded-3xl overflow-hidden relative">
                 <div className="absolute -right-4 -bottom-4 opacity-5 rotate-12">
                    <Globe size={150} />
                 </div>
                 <CardHeader className="p-6">
                    <CardTitle className="text-xs font-black uppercase tracking-[0.3em] text-amber-500 italic">Target Reach Matrix</CardTitle>
                 </CardHeader>
                 <CardContent className="p-6 pt-0 space-y-6">
                    <div className="space-y-4">
                       {[
                         { demographic: 'Registered Residents', count: '1,428', percent: 100 },
                         { demographic: 'Transient Visitors', count: '312', percent: 65 },
                         { demographic: 'BHW/Public Personnel', count: '84', percent: 100 },
                       ].map((m, i) => (
                          <div key={i} className="space-y-2">
                             <div className="flex justify-between items-end">
                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest italic">{m.demographic}</span>
                                <span className="text-sm font-black text-white">{m.count}</span>
                             </div>
                             <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                                <div className="h-full bg-amber-500" style={{ width: `${m.percent}%` }} />
                             </div>
                          </div>
                       ))}
                    </div>
                    <div className="pt-6 border-t border-white/5">
                       <p className="text-[9px] font-medium text-slate-500 leading-relaxed italic text-center">
                          Push notifications are routed via Google Firebase Cloud Messaging (FCM) protocol for zero-latency delivery.
                       </p>
                    </div>
                 </CardContent>
              </Card>
           </div>
        </div>
      </motion.div>
    </PortalLayout>
  );
}
