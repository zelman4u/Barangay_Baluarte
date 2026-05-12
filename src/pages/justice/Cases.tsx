import React, { useState, useEffect } from 'react';
import PortalLayout from '@/src/components/layout/PortalLayout';
import { 
  ClipboardList, Search, Plus, Filter, Download, 
  MoreHorizontal, Eye, Scale, ShieldCheck,
  History, CheckCircle2, AlertCircle, FileDown,
  User, Gavel, Briefcase, Database
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

export default function Cases() {
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'cases'), orderBy('createdAt', 'desc'));
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Resolved': return 'bg-emerald-50 text-emerald-600';
      case 'Dismissed': return 'bg-red-50 text-red-600';
      case 'Ongoing': return 'bg-blue-50 text-blue-600';
      default: return 'bg-slate-100 text-slate-600';
    }
  };

  return (
    <PortalLayout>
      <motion.div initial="hidden" animate="visible" variants={containerVariants} className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <motion.div variants={itemVariants}>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-indigo-50 rounded-2xl shadow-sm border border-indigo-100">
                <Gavel className="text-indigo-600 h-6 w-6 lg:h-8 lg:w-8" />
              </div>
              <div>
                <h2 className="text-2xl lg:text-3xl font-black text-slate-900 tracking-tight text-left">Case Management</h2>
                <p className="text-[10px] lg:text-xs font-bold text-slate-500 uppercase tracking-[0.2em] mt-1 italic text-left">Active Tribunal Docket & Archives</p>
              </div>
            </div>
          </motion.div>
          
          <motion.div variants={itemVariants} className="flex items-center gap-2">
             <Button variant="outline" className="h-11 px-6 rounded-xl border-slate-200 font-bold bg-white">
              <FileDown size={18} className="mr-2" /> Daily Docket
            </Button>
            <Button className="h-11 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-900/20 font-bold text-white">
              <ClipboardList size={18} className="mr-2" /> Central Records
            </Button>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
           <div className="md:col-span-3">
              <Card className="border-slate-200/60 shadow-xl bg-white rounded-2xl font-sans overflow-hidden">
                <div className="p-4 lg:p-6 border-b border-slate-100 bg-slate-50/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input placeholder="Search legal docket by case title or party name..." className="pl-12 h-11 rounded-xl bg-white border-slate-200 shadow-sm font-medium" />
                  </div>
                </div>
                <div className="overflow-x-auto">
                   <Table>
                    <TableHeader className="bg-slate-50/50">
                      <TableRow className="border-none">
                        <TableHead className="py-4 text-[10px] font-black uppercase text-slate-400 tracking-widest pl-6">Case Identification</TableHead>
                        <TableHead className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Involved Parties</TableHead>
                        <TableHead className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Status</TableHead>
                        <TableHead className="text-[10px] font-black uppercase text-slate-400 tracking-widest text-right pr-6">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {records.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={4} className="py-24 text-center">
                            <div className="flex flex-col items-center gap-4 text-slate-300">
                              <Database size={48} className="opacity-10" />
                              <p className="text-xs font-black uppercase tracking-[0.2em]">Legal docket is currently empty</p>
                            </div>
                          </TableCell>
                        </TableRow>
                      ) : (
                        records.map(rec => (
                          <TableRow key={rec.id} className="border-b border-slate-50 hover:bg-slate-50/30 transition-colors group">
                             <TableCell className="pl-6 py-5">
                                <p className="font-black text-slate-900 tracking-tight text-base leading-none mb-2">{rec.title}</p>
                                <div className="flex items-center gap-2">
                                  <Badge className="bg-slate-900 text-white border-none font-black text-[8px] uppercase px-2 h-4 tracking-tighter">Case #{rec.id.slice(0, 6)}</Badge>
                                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest italic">{rec.date || 'Active'}</span>
                                </div>
                             </TableCell>
                             <TableCell>
                                <div className="space-y-1">
                                  <p className="text-xs font-bold text-slate-700">{rec.partyA} <span className="text-[8px] font-black text-slate-400 uppercase tracking-tighter">(Complainant)</span></p>
                                  <p className="text-xs font-bold text-slate-700">{rec.partyB} <span className="text-[8px] font-black text-slate-400 uppercase tracking-tighter">(Respondent)</span></p>
                                </div>
                             </TableCell>
                             <TableCell>
                                <Badge variant="outline" className={cn("border-none font-black text-[9px] uppercase px-3 h-6 tracking-widest", getStatusColor(rec.status))}>
                                  {rec.status || 'Active'}
                                </Badge>
                             </TableCell>
                             <TableCell className="text-right pr-6">
                                <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl text-slate-300 hover:text-indigo-600 hover:bg-indigo-50 transition-all">
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
              <Card className="border-none shadow-xl bg-slate-950 text-white rounded-2xl overflow-hidden">
                <CardHeader className="p-6 pb-2">
                   <CardTitle className="text-xs font-black tracking-[0.2em] uppercase text-indigo-400 flex items-center gap-2 italic">
                     <ShieldCheck size={16} /> Resolution Index
                   </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                   <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-white/5 rounded-2xl border border-white/10 text-center">
                         <p className="text-2xl font-black text-emerald-400 tracking-tighter">84</p>
                         <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest mt-1">Settled</p>
                      </div>
                      <div className="p-4 bg-white/5 rounded-2xl border border-white/10 text-center">
                         <p className="text-2xl font-black text-amber-400 tracking-tighter">12</p>
                         <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest mt-1">Pending</p>
                      </div>
                   </div>
                   <div className="space-y-4 pt-4 border-t border-white/10">
                      <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500">Legal Milestone Status</h4>
                      {[
                        { label: 'Avg Resolution Time', value: '4.2 Days', color: 'text-sky-400' },
                        { label: 'Appeal Rate', value: '2.1%', color: 'text-rose-400' },
                      ].map((m, i) => (
                        <div key={i} className="flex justify-between items-center bg-white/5 p-3 rounded-xl">
                           <span className="text-[10px] font-bold text-slate-400">{m.label}</span>
                           <span className={cn("text-xs font-black", m.color)}>{m.value}</span>
                        </div>
                      ))}
                   </div>
                </CardContent>
              </Card>

              <Card className="border-slate-200/60 shadow-lg bg-white rounded-2xl overflow-hidden border-t-4 border-t-indigo-500">
                <CardContent className="p-6">
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 italic leading-relaxed">
                     Archives accessible only to the Tribunal Secretary and Barangay Captain.
                   </p>
                   <Button variant="outline" className="w-full h-11 rounded-xl border-slate-200 font-black uppercase tracking-widest text-[10px] gap-2">
                      <History size={14} className="text-indigo-500" /> Digital Archives
                   </Button>
                </CardContent>
              </Card>
           </div>
        </div>
      </motion.div>
    </PortalLayout>
  );
}
