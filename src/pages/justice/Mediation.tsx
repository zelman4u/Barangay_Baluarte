import React, { useState, useEffect } from 'react';
import PortalLayout from '@/src/components/layout/PortalLayout';
import { 
  Calendar, Search, Plus, Filter, Download, 
  MoreHorizontal, Clock, Users, Coffee,
  CheckCircle2, AlertCircle, FileDown,
  User, MapPin, Database, MessageCircle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { collection, query, onSnapshot, orderBy } from 'firebase/firestore';
import { db } from '@/src/lib/firebase';
import { motion } from 'motion/react';

export default function Mediation() {
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'mediation_sessions'), orderBy('createdAt', 'desc'));
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
              <div className="p-3 bg-amber-50 rounded-2xl shadow-sm border border-amber-100">
                <Users className="text-amber-600 h-6 w-6 lg:h-8 lg:w-8" />
              </div>
              <div>
                <h2 className="text-2xl lg:text-3xl font-black text-slate-900 tracking-tight text-left">Mediation Scheduling</h2>
                <p className="text-[10px] lg:text-xs font-bold text-slate-500 uppercase tracking-[0.2em] mt-1 italic text-left">Conflict Resolution Appointments</p>
              </div>
            </div>
          </motion.div>
          
          <motion.div variants={itemVariants} className="flex items-center gap-2">
            <Button variant="outline" className="h-11 px-6 rounded-xl border-slate-200 font-bold bg-white text-slate-700">
              <Calendar className="mr-2 h-4 w-4" /> Calendar View
            </Button>
            <Button className="h-11 px-6 rounded-xl bg-amber-600 hover:bg-amber-700 shadow-lg shadow-amber-900/20 font-bold text-white">
              <Plus size={18} className="mr-2" /> Schedule Hearing
            </Button>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
           <div className="md:col-span-8">
              <Card className="border-slate-200/60 shadow-xl bg-white rounded-2xl font-sans overflow-hidden">
                <div className="p-4 lg:p-6 border-b border-slate-100 bg-slate-50/30">
                  <div className="relative max-w-md">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input placeholder="Filter sessions by name or case #" className="pl-12 h-11 rounded-xl bg-white border-slate-200 shadow-sm font-medium" />
                  </div>
                </div>
                <div className="overflow-x-auto">
                   <Table>
                    <TableHeader className="bg-slate-50/50">
                      <TableRow className="border-none">
                        <TableHead className="py-4 text-[10px] font-black uppercase text-slate-400 tracking-widest pl-6">Scheduled Session</TableHead>
                        <TableHead className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Parties</TableHead>
                        <TableHead className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Hearing Officer</TableHead>
                        <TableHead className="text-[10px] font-black uppercase text-slate-400 tracking-widest text-right pr-6">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {records.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={4} className="py-24 text-center">
                            <div className="flex flex-col items-center gap-4 text-slate-300">
                              <Clock size={48} className="opacity-10 animate-pulse" />
                              <p className="text-xs font-black uppercase tracking-[0.2em]">No scheduled hearings this week</p>
                            </div>
                          </TableCell>
                        </TableRow>
                      ) : (
                        records.map(rec => (
                          <TableRow key={rec.id} className="border-b border-slate-50 hover:bg-amber-50/30 transition-colors group">
                             <TableCell className="pl-6 py-5">
                                <p className="font-extrabold text-slate-900 tracking-tight text-base leading-none mb-2">{rec.caseTitle || 'Mediation'}</p>
                                <div className="flex items-center gap-2">
                                  <Badge className="bg-amber-100 text-amber-700 border-none font-bold text-[8px] uppercase px-2 h-4">{rec.time || '09:00 AM'}</Badge>
                                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{rec.date || 'Today'}</span>
                                </div>
                             </TableCell>
                             <TableCell>
                                <div className="flex flex-col gap-0.5">
                                  <span className="text-xs font-bold text-slate-700 italic">{rec.partyA}</span>
                                  <span className="text-[8px] font-black text-slate-300 uppercase tracking-tighter">vs</span>
                                  <span className="text-xs font-bold text-slate-700 italic">{rec.partyB}</span>
                                </div>
                             </TableCell>
                             <TableCell>
                                <div className="flex items-center gap-2">
                                   <div className="h-6 w-6 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-black text-slate-500">
                                     {rec.officer?.[0] || 'L'}
                                   </div>
                                   <span className="text-xs font-bold text-slate-600">{rec.officer || 'Lupon Member'}</span>
                                </div>
                             </TableCell>
                             <TableCell className="text-right pr-6">
                                <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl text-slate-300 hover:text-amber-600 hover:bg-amber-50 transition-all">
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
           <div className="md:col-span-4 space-y-6">
              <Card className="border-slate-200 shadow-xl bg-white rounded-2xl overflow-hidden border-t-4 border-t-amber-500">
                <CardHeader className="p-6">
                   <CardTitle className="text-sm font-black tracking-widest uppercase text-slate-900 italic flex items-center gap-2">
                     <MessageCircle size={18} className="text-amber-500" /> Mediation Protocol
                   </CardTitle>
                </CardHeader>
                <CardContent className="p-6 pt-0 space-y-6">
                   <div className="space-y-4">
                      {[
                        { title: 'Privacy First', desc: 'All hearings are strictly confidential.' },
                        { title: 'Impartiality', desc: 'Lupon members must maintain neutrality.' },
                        { title: 'Voluntarism', desc: 'Parties reach mutual agreements freely.' },
                      ].map((item, i) => (
                        <div key={i} className="flex gap-4">
                           <div className="h-6 w-6 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600 shrink-0">
                              <CheckCircle2 size={14} />
                           </div>
                           <div>
                              <p className="text-xs font-black text-slate-900 uppercase tracking-tight">{item.title}</p>
                              <p className="text-[10px] font-medium text-slate-500 italic leading-tight mt-0.5">{item.desc}</p>
                           </div>
                        </div>
                      ))}
                   </div>
                   <div className="p-4 bg-slate-900 rounded-2xl shadow-inner relative overflow-hidden">
                      <div className="absolute -right-2 -bottom-2 opacity-10">
                        <Coffee size={64} className="text-white" />
                      </div>
                      <p className="text-[10px] font-black text-amber-400 uppercase tracking-widest">Next Available Slot</p>
                      <p className="text-lg font-black text-white mt-1">Tomorrow, 1:30 PM</p>
                      <p className="text-[9px] font-bold text-slate-500 uppercase tracking-tighter mt-2 underline">View Multi-purpose Hall Schedule</p>
                   </div>
                </CardContent>
              </Card>

              <Card className="border-none shadow-lg bg-emerald-600 text-white rounded-2xl">
                 <CardContent className="p-6 flex items-center justify-between">
                    <div>
                       <p className="text-2xl font-black italic tracking-tighter tracking-tight">85%</p>
                       <p className="text-[9px] font-bold uppercase tracking-widest text-emerald-100">Settlement Success Rate</p>
                    </div>
                    <CheckCircle2 size={32} className="text-emerald-300 opacity-50" />
                 </CardContent>
              </Card>
           </div>
        </div>
      </motion.div>
    </PortalLayout>
  );
}
