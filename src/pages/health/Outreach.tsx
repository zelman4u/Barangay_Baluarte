import React, { useState, useEffect } from 'react';
import PortalLayout from '@/src/components/layout/PortalLayout';
import { cn } from '@/lib/utils';
import { 
  Map, Search, Plus, Filter, Download, 
  MoreHorizontal, Calendar, Users, Globe,
  MapPin, CheckCircle2, Clock, Megaphone,
  Database, Info, AlertCircle, Heart
} from 'lucide-react';
import { 
  Card, CardContent, CardHeader, CardTitle, CardDescription 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from '@/components/ui/table';
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

export default function Outreach() {
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddOpen, setIsAddOpen] = useState(false);

  useEffect(() => {
    const q = query(collection(db, 'outreach_programs'), orderBy('createdAt', 'desc'));
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
              <div className="p-3 bg-sky-50 rounded-2xl shadow-sm border border-sky-100">
                <Map className="text-sky-600 h-6 w-6 lg:h-8 lg:w-8" />
              </div>
              <div>
                <h2 className="text-2xl lg:text-3xl font-black text-slate-900 tracking-tight">Community Outreach</h2>
                <p className="text-[10px] lg:text-xs font-bold text-slate-500 uppercase tracking-[0.2em] mt-1 italic">Public Health Campaigns & Field Programs</p>
              </div>
            </div>
          </motion.div>
          
          <motion.div variants={itemVariants} className="flex items-center gap-2">
            <Button variant="outline" className="h-11 px-4 rounded-xl border-slate-200 font-bold bg-white">
              <Download size={18} className="mr-2" /> Export Logs
            </Button>
            
            <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
              <DialogTrigger render={
                <Button className="h-11 px-6 rounded-xl bg-sky-600 hover:bg-sky-700 shadow-lg shadow-sky-900/20 font-bold">
                  <Plus size={18} className="mr-2" /> New Campaign
                </Button>
              } />
              <DialogContent className="sm:max-w-[500px] border-none shadow-2xl rounded-3xl overflow-hidden font-sans">
                <div className="absolute top-0 left-0 w-full h-1.5 bg-sky-600" />
                <DialogHeader className="pt-6">
                  <DialogTitle className="text-xl font-black tracking-tight text-slate-900">Initiate Outreach Program</DialogTitle>
                  <DialogDescription className="font-medium text-slate-500 italic">Plan a new health mission or public awareness campaign.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-6 py-6 font-sans">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Program Name</Label>
                    <Input placeholder="e.g. Free Dental Clinic Mission" className="h-12 rounded-xl bg-slate-50 border-slate-200 font-bold" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Target Location</Label>
                      <Input placeholder="Purok / Area" className="h-12 rounded-xl bg-slate-50 border-slate-200 font-bold" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Schedule Date</Label>
                      <Input type="date" className="h-12 rounded-xl bg-slate-50 border-slate-200 font-bold" />
                    </div>
                  </div>
                </div>
                <DialogFooter className="bg-slate-50 p-6 -m-6 mt-2">
                  <Button variant="ghost" onClick={() => setIsAddOpen(false)} className="rounded-xl font-bold text-slate-500">Cancel</Button>
                  <Button className="bg-sky-600 hover:bg-sky-700 rounded-xl font-black px-8 shadow-lg shadow-sky-900/20 uppercase tracking-widest text-xs h-11">Launch Program</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
           <div className="md:col-span-3">
              <Card className="border-slate-200/60 shadow-xl bg-white rounded-2xl font-sans overflow-hidden">
                <div className="p-4 lg:p-6 border-b border-slate-100 bg-slate-50/30">
                  <div className="relative max-w-md">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input placeholder="Filter outreach missions..." className="pl-12 h-11 rounded-xl bg-white border-slate-200 shadow-sm font-medium" />
                  </div>
                </div>
                <div className="overflow-x-auto">
                   <Table>
                    <TableHeader className="bg-slate-50/50">
                      <TableRow className="border-none">
                        <TableHead className="py-4 text-[10px] font-black uppercase text-slate-400 tracking-widest pl-6">Campaign Info</TableHead>
                        <TableHead className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Venue</TableHead>
                        <TableHead className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Target Demographic</TableHead>
                        <TableHead className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Status</TableHead>
                        <TableHead className="text-[10px] font-black uppercase text-slate-400 tracking-widest text-right pr-6">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {records.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} className="py-24 text-center">
                            <div className="flex flex-col items-center gap-4 text-slate-300">
                              <Megaphone size={48} className="opacity-10 animate-pulse" />
                              <p className="text-xs font-black uppercase tracking-[0.2em]">No scheduled outreach missions yet</p>
                              <Button variant="ghost" className="text-sky-600 font-bold text-xs uppercase tracking-widest" onClick={() => setIsAddOpen(true)}>
                                Create First Program
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ) : (
                        records.map(rec => (
                          <TableRow key={rec.id} className="border-b border-slate-50 hover:bg-sky-50/30 transition-colors group">
                             <TableCell className="pl-6 py-4">
                                <p className="font-black text-slate-900 tracking-tight text-base">{rec.programName}</p>
                                <div className="flex items-center gap-2 mt-1">
                                  <Calendar size={12} className="text-slate-400" />
                                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">{rec.date || 'To be announced'}</p>
                                </div>
                             </TableCell>
                             <TableCell>
                                <div className="flex items-center gap-1.5">
                                  <MapPin size={14} className="text-rose-400" />
                                  <span className="text-xs font-bold text-slate-600">{rec.location || 'Purok 4 Multi-purpose'}</span>
                                </div>
                             </TableCell>
                             <TableCell>
                                <Badge variant="outline" className="bg-sky-50 text-sky-600 border-none font-bold text-[9px] uppercase px-3">{rec.target || 'General Public'}</Badge>
                             </TableCell>
                             <TableCell>
                                <div className="flex items-center gap-2">
                                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Active</span>
                                </div>
                             </TableCell>
                             <TableCell className="text-right pr-6">
                                <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl text-slate-300 hover:text-sky-600 hover:bg-sky-50 transition-all">
                                  <MoreHorizontal size={18} />
                                </Button>
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
              <Card className="border-slate-200/60 shadow-lg bg-white rounded-2xl overflow-hidden border-t-4 border-t-sky-500">
                <CardHeader className="p-6">
                   <CardTitle className="text-xs font-black tracking-[0.2em] uppercase text-slate-400 italic flex items-center gap-2">
                     <Clock size={16} className="text-sky-500" /> Program Queue
                   </CardTitle>
                </CardHeader>
                <CardContent className="p-6 pt-0 space-y-4">
                   {[
                     { area: 'Purok 1', task: 'Nutrition Seminar', time: '9:00 AM' },
                     { area: 'Purok 7', task: 'COVID-19 Awareness', time: '1:30 PM' },
                   ].map((item, i) => (
                      <div key={i} className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
                        <div>
                          <p className="text-[9px] font-black text-sky-600 uppercase tracking-widest">{item.area}</p>
                          <p className="text-xs font-bold text-slate-900 mt-0.5">{item.task}</p>
                        </div>
                        <span className="text-[10px] font-black text-slate-400">{item.time}</span>
                      </div>
                   ))}
                </CardContent>
              </Card>

              <Card className="border-none shadow-xl bg-slate-900 text-white rounded-2xl overflow-hidden relative">
                <div className="absolute -right-4 -bottom-4 opacity-10">
                   <Globe size={120} />
                </div>
                <CardContent className="p-6">
                   <h3 className="text-lg font-black tracking-tight leading-tight italic">Field Personnel Active Tracker</h3>
                   <div className="mt-6 space-y-3">
                      <div className="flex items-center justify-between">
                         <span className="text-xs font-bold text-slate-400">Total BHWs Deployed</span>
                         <span className="text-sm font-black text-sky-400">24</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                         <div className="h-full bg-sky-500 w-3/4" />
                      </div>
                      <p className="text-[10px] font-medium text-slate-500 mt-2 italic">75% of designated areas covered today</p>
                   </div>
                </CardContent>
              </Card>
           </div>
        </div>
      </motion.div>
    </PortalLayout>
  );
}
