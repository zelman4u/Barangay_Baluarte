import React, { useState, useEffect } from 'react';
import PortalLayout from '@/src/components/layout/PortalLayout';
import { 
  ShieldAlert, Search, Plus, Filter, Download, 
  MoreHorizontal, Eye, Clock, AlertTriangle,
  History, CheckCircle2, AlertCircle, FileDown,
  User, Database, MapPin, Zap
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { collection, query, onSnapshot, orderBy } from 'firebase/firestore';
import { db } from '@/src/lib/firebase';
import { motion } from 'motion/react';

import { cn } from '@/lib/utils';

export default function Incidents() {
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddOpen, setIsAddOpen] = useState(false);

  useEffect(() => {
    const q = query(collection(db, 'incidents'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setRecords(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
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
              <div className="p-3 bg-red-50 rounded-2xl shadow-sm border border-red-100">
                <ShieldAlert className="text-red-600 h-6 w-6 lg:h-8 lg:w-8" />
              </div>
              <div>
                <h2 className="text-2xl lg:text-3xl font-black text-slate-900 tracking-tight text-left">Incident Reporting</h2>
                <p className="text-[10px] lg:text-xs font-bold text-slate-500 uppercase tracking-[0.2em] mt-1 italic text-left">Active Surveillance & Crisis Logs</p>
              </div>
            </div>
          </motion.div>
          
          <motion.div variants={itemVariants} className="flex items-center gap-2">
            <Button variant="outline" className="h-11 px-4 rounded-xl border-slate-200 font-bold bg-white text-slate-700">
              <Download size={18} className="mr-2" /> Global Report
            </Button>
            
            <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
              <DialogTrigger render={
                <Button className="h-11 px-6 rounded-xl bg-red-600 hover:bg-red-700 shadow-lg shadow-red-900/20 font-bold text-white uppercase tracking-widest text-xs">
                  <Plus size={18} className="mr-2" /> File Report
                </Button>
              } />
              <DialogContent className="sm:max-w-[500px] border-none shadow-2xl rounded-3xl overflow-hidden font-sans">
                <div className="absolute top-0 left-0 w-full h-1.5 bg-red-600" />
                <DialogHeader className="pt-6">
                  <DialogTitle className="text-xl font-black tracking-tight text-slate-900 text-left">Internal Incident Report</DialogTitle>
                  <DialogDescription className="font-medium text-slate-500 italic text-left tracking-tight">Record real-time safety incidents for analysis and response.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-6 py-6 font-sans">
                  <div className="space-y-2 text-left">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Incident Type</Label>
                    <Input placeholder="e.g. Health Emergency, Dispute, Fire" className="h-12 rounded-xl bg-slate-50 border-slate-200 font-bold" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2 text-left">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Location</Label>
                      <Input placeholder="Purok / Street" className="h-12 rounded-xl bg-slate-50 border-slate-200 font-bold" />
                    </div>
                    <div className="space-y-2 text-left">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Severity</Label>
                      <Input placeholder="Critical / Low" className="h-12 rounded-xl bg-slate-50 border-slate-200 font-bold" />
                    </div>
                  </div>
                </div>
                <DialogFooter className="bg-slate-50 p-6 -m-6 mt-2">
                  <Button variant="ghost" onClick={() => setIsAddOpen(false)} className="rounded-xl font-bold text-slate-500">Cancel</Button>
                  <Button className="bg-red-600 hover:bg-red-700 rounded-xl font-black px-8 shadow-lg shadow-red-900/20 uppercase tracking-widest text-xs h-11 text-white">Save Report</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           <div className="md:col-span-2">
              <Card className="border-slate-200/60 shadow-xl bg-white rounded-2xl font-sans overflow-hidden h-full">
                <div className="p-4 lg:p-6 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                   <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-400 italic">Live Incident Feed</h3>
                   <div className="flex items-center gap-1.5 px-3 py-1 bg-red-50 text-red-600 rounded-full border border-red-100 animate-pulse">
                      <div className="h-1.5 w-1.5 rounded-full bg-red-600 shadow-[0_0_8px_rgba(220,38,38,0.6)]" />
                      <span className="text-[9px] font-black uppercase tracking-widest">Live Monitoring</span>
                   </div>
                </div>
                <div className="overflow-x-auto">
                   <Table>
                    <TableHeader className="bg-slate-50/20">
                      <TableRow className="border-none">
                        <TableHead className="py-4 text-[10px] font-black uppercase text-slate-400 tracking-widest pl-6">Alert Category</TableHead>
                        <TableHead className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Primary Details</TableHead>
                        <TableHead className="text-[10px] font-black uppercase text-slate-400 tracking-widest text-right pr-6">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {records.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={3} className="py-24 text-center">
                            <div className="flex flex-col items-center gap-4 text-slate-300">
                              <ShieldAlert size={48} className="opacity-10" />
                              <p className="text-xs font-black uppercase tracking-[0.2em]">No new incidents reported</p>
                            </div>
                          </TableCell>
                        </TableRow>
                      ) : (
                        records.map(rec => (
                          <TableRow key={rec.id} className="border-b border-slate-50 hover:bg-red-50/30 transition-colors group">
                             <TableCell className="pl-6 py-5">
                                <div className="flex items-center gap-4">
                                   <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center shrink-0", 
                                     rec.severity === 'High' ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-600'
                                   )}>
                                      <Zap size={20} strokeWidth={2.5} />
                                   </div>
                                   <div>
                                      <p className="font-extrabold text-slate-900 tracking-tight text-base leading-none mb-1">{rec.type}</p>
                                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{rec.id.slice(0, 8)}</p>
                                   </div>
                                </div>
                             </TableCell>
                             <TableCell>
                                <div className="flex items-center gap-2 mb-1">
                                   <MapPin size={12} className="text-slate-400" />
                                   <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{rec.location || 'Unknown Zone'}</span>
                                </div>
                                <p className="text-xs font-medium text-slate-400 line-clamp-1 italic">{rec.description || 'No additional details provided.'}</p>
                             </TableCell>
                             <TableCell className="text-right pr-6">
                                <Badge className="bg-slate-900 text-white border-none font-black text-[9px] uppercase px-3 h-7 tracking-widest">Logged</Badge>
                             </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                   </Table>
                </div>
              </Card>
           </div>
           <div className="space-y-6">
              <Card className="border-none shadow-xl bg-slate-950 text-white rounded-2xl overflow-hidden h-full">
                 <CardHeader className="p-6 pb-2">
                    <CardTitle className="text-[10px] font-black uppercase tracking-[0.3em] text-red-400 italic">Statistical Breakdown</CardTitle>
                 </CardHeader>
                 <CardContent className="p-6 space-y-8">
                    <div className="space-y-4">
                       {[
                         { nature: 'Criminal Integrity', count: 12, percent: 15 },
                         { nature: 'Civil Disputes', count: 84, percent: 70 },
                         { nature: 'Health Emergencies', count: 18, percent: 15 },
                       ].map((item, i) => (
                          <div key={i} className="flex items-center gap-4">
                             <div className="flex-1">
                                <div className="flex justify-between text-[11px] font-bold mb-1.5">
                                   <span className="text-slate-400">{item.nature}</span>
                                   <span className="text-white">{item.count}</span>
                                </div>
                                <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                                   <div className="h-full bg-red-600 rounded-full" style={{ width: `${item.percent}%` }} />
                                </div>
                             </div>
                          </div>
                       ))}
                    </div>
                    <div className="pt-6 border-t border-white/5">
                       <p className="text-[10px] font-medium text-slate-500 leading-relaxed italic text-center">
                          Reports are aggregated monthly to identify "Hot Zones" within the barangay perimeter.
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
