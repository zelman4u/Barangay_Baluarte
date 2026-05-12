import React, { useState, useEffect } from 'react';
import PortalLayout from '@/src/components/layout/PortalLayout';
import { 
  ClipboardList, Search, Plus, Filter, Download, 
  MoreHorizontal, Eye, Clock, ShieldAlert,
  Calendar, CheckCircle2, AlertCircle, FileDown,
  User, Database, MapPin, Zap, Rocket,
  TrendingUp, Target, ArrowUpRight
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { collection, query, onSnapshot, orderBy } from 'firebase/firestore';
import { db } from '@/src/lib/firebase';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';

export default function SKProjects() {
  const [records, setRecords] = useState<any[]>([]);

  useEffect(() => {
    const q = query(collection(db, 'sk_projects'), orderBy('createdAt', 'desc'));
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
              <div className="p-3 bg-blue-50 rounded-2xl shadow-sm border border-blue-100">
                <Rocket className="text-blue-600 h-6 w-6 lg:h-8 lg:w-8" />
              </div>
              <div>
                <h2 className="text-2xl lg:text-3xl font-black text-slate-900 tracking-tight text-left italic uppercase">SK Projects</h2>
                <p className="text-[10px] lg:text-xs font-bold text-slate-500 uppercase tracking-[0.2em] mt-1 italic text-left">Initiative Tracking & Project Lifecycle</p>
              </div>
            </div>
          </motion.div>
          
          <motion.div variants={itemVariants} className="flex gap-2">
            <Button className="h-11 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-900/20 font-bold text-white uppercase tracking-widest text-xs">
               <Plus className="mr-2 h-4 w-4" /> Propose Project
            </Button>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           <div className="md:col-span-2 space-y-6">
              {records.length === 0 ? (
                <Card className="border-slate-200 shadow-xl bg-white rounded-3xl p-20 flex flex-col items-center justify-center text-center">
                   <Target size={64} className="text-slate-100 mb-6" />
                   <h3 className="text-xl font-black text-slate-300 italic uppercase">Strategic Benchmarks</h3>
                   <p className="text-sm font-medium text-slate-400 mt-2 max-w-xs mx-auto italic">Propose your first SK Council project to begin tracking resource allocation and community impact deliverables.</p>
                </Card>
              ) : (
                records.map(rec => (
                  <Card key={rec.id} className="border-slate-200 hover:border-blue-200 transition-all shadow-lg rounded-3xl overflow-hidden group">
                     <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-6">
                           <Badge className="bg-blue-50 text-blue-600 border-none font-black text-[9px] uppercase tracking-widest px-3 h-6">{rec.status || 'Ongoing'}</Badge>
                           <span className="text-[10px] font-black text-slate-300 uppercase italic">Ref: {rec.id.slice(0, 8)}</span>
                        </div>
                        <h3 className="text-xl font-black text-slate-900 tracking-tight mb-2 group-hover:text-blue-600 transition-colors">{rec.title || 'Youth Sports Development 2026'}</h3>
                        <p className="text-sm font-medium text-slate-500 line-clamp-2 leading-relaxed italic">{rec.description || 'Description of the project scope and community objectives.'}</p>
                        
                        <div className="mt-6 pt-6 border-t border-slate-50 flex items-center justify-between">
                           <div className="flex items-center gap-4">
                              <div>
                                 <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Budget Utilization</p>
                                 <p className="text-sm font-black text-slate-900">₱{rec.budget || '0,000.00'}</p>
                              </div>
                           </div>
                           <Button variant="ghost" className="rounded-xl font-black text-[10px] uppercase tracking-widest text-blue-600 hover:bg-blue-50">
                              Full Report <ArrowUpRight size={14} className="ml-1" />
                           </Button>
                        </div>
                     </CardContent>
                  </Card>
                ))
              )}
           </div>
           
           <div className="space-y-6">
              <Card className="border-none shadow-2xl bg-slate-900 text-white rounded-3xl overflow-hidden">
                 <CardHeader className="p-6 pb-2">
                    <CardTitle className="text-xs font-black uppercase tracking-[0.3em] text-blue-400 italic">Financial Overview</CardTitle>
                 </CardHeader>
                 <CardContent className="p-6 pt-0 space-y-6">
                    <div className="text-center py-6 border-b border-white/5">
                       <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Total SK Fund 2026</p>
                       <p className="text-4xl font-black text-white tracking-tighter mt-1">₱1,240,000</p>
                    </div>
                    <div className="space-y-4">
                       {[
                         { label: 'Utilized Amount', val: '₱840,000', per: 65, color: 'bg-emerald-500' },
                         { label: 'Remaining Balance', val: '₱400,000', per: 35, color: 'bg-blue-500' },
                       ].map((s, i) => (
                          <div key={i} className="space-y-2">
                             <div className="flex justify-between text-[11px] font-bold">
                                <span className="text-slate-400 italic">{s.label}</span>
                                <span className="text-white">{s.val}</span>
                             </div>
                             <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                                <div className={cn("h-full rounded-full", s.color)} style={{ width: `${s.per}%` }} />
                             </div>
                          </div>
                       ))}
                    </div>
                 </CardContent>
              </Card>

              <Card className="border-slate-200 shadow-xl rounded-3xl overflow-hidden group">
                 <CardHeader className="p-6 border-b border-slate-50 flex flex-row items-center justify-between">
                    <CardTitle className="text-[10px] font-black uppercase text-slate-400 tracking-widest italic flex items-center gap-2">
                       <TrendingUp size={14} className="text-blue-600" /> Active Milestones
                    </CardTitle>
                 </CardHeader>
                 <CardContent className="p-6 space-y-4">
                    {[
                      { m: 'Procurement of Gear', d: 'In Progress' },
                      { m: 'Sports Fair Day 1', d: 'May 20' },
                      { m: 'Scholarship Granting', d: 'Completed' },
                    ].map((m, i) => (
                       <div key={i} className="flex justify-between items-center bg-slate-50 p-3 rounded-2xl border border-slate-100 group-hover:bg-white transition-colors">
                          <span className="text-xs font-black text-slate-800">{m.m}</span>
                          <span className="text-[9px] font-bold text-slate-400 uppercase italic">{m.d}</span>
                       </div>
                    ))}
                 </CardContent>
              </Card>
           </div>
        </div>
      </motion.div>
    </PortalLayout>
  );
}
