import React, { useState, useEffect } from 'react';
import PortalLayout from '@/src/components/layout/PortalLayout';
import { 
  GraduationCap, Search, Plus, Filter, Download, 
  MoreHorizontal, Users, Baby, MapPin,
  CheckCircle2, AlertCircle, FileDown,
  Database, UserPlus, Heart
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { collection, query, onSnapshot, orderBy } from 'firebase/firestore';
import { db } from '@/src/lib/firebase';
import { motion } from 'motion/react';

export default function YouthProfiling() {
  const [records, setRecords] = useState<any[]>([]);

  useEffect(() => {
    const q = query(collection(db, 'residents'), orderBy('birthDate', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      // Filter for youth (e.g., ages 15-30)
      const now = new Date();
      const youth = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter((r: any) => {
          if (!r.birthDate) return false;
          const birth = new Date(r.birthDate);
          const age = now.getFullYear() - birth.getFullYear();
          return age >= 15 && age <= 30;
        });
      setRecords(youth);
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
              <div className="p-3 bg-purple-50 rounded-2xl shadow-sm border border-purple-100">
                <GraduationCap className="text-purple-600 h-6 w-6 lg:h-8 lg:w-8" />
              </div>
              <div>
                <h2 className="text-2xl lg:text-3xl font-black text-slate-900 tracking-tight text-left">Youth Profiling</h2>
                <p className="text-[10px] lg:text-xs font-bold text-slate-500 uppercase tracking-[0.2em] mt-1 italic text-left">SK Masterlist & Demographic Registry</p>
              </div>
            </div>
          </motion.div>
          
          <motion.div variants={itemVariants} className="flex gap-2">
            <Button variant="outline" className="h-11 px-6 rounded-xl border-slate-200 font-bold bg-white text-slate-700">
              <Download className="mr-2 h-4 w-4" /> Export Registry
            </Button>
            <Button className="h-11 px-6 rounded-xl bg-purple-600 hover:bg-purple-700 shadow-lg shadow-purple-900/20 font-bold text-white uppercase tracking-widest text-xs">
               <Plus className="mr-2 h-4 w-4" /> Add Youth Record
            </Button>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
           <div className="lg:col-span-3">
              <Card className="border-slate-200/60 shadow-xl bg-white rounded-3xl overflow-hidden font-sans">
                <div className="p-4 lg:p-6 border-b border-slate-100 bg-slate-50/20 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input placeholder="Search youth by name, age, or education..." className="pl-12 h-11 rounded-xl border-slate-200 shadow-sm font-medium" />
                  </div>
                </div>
                <div className="overflow-x-auto">
                   <Table>
                    <TableHeader className="bg-slate-50/50">
                      <TableRow className="border-none">
                        <TableHead className="py-4 text-[10px] font-black uppercase text-slate-400 tracking-widest pl-6">Profile Name</TableHead>
                        <TableHead className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Age / DOB</TableHead>
                        <TableHead className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Education/Employment</TableHead>
                        <TableHead className="text-[10px] font-black uppercase text-slate-400 tracking-widest text-right pr-6">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {records.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={4} className="py-24 text-center">
                            <div className="flex flex-col items-center gap-4 text-slate-300">
                              <Users size={48} className="opacity-10" />
                              <p className="text-xs font-black uppercase tracking-[0.2em]">Youth masterlist is currently undergoing sync</p>
                            </div>
                          </TableCell>
                        </TableRow>
                      ) : (
                        records.map(rec => (
                          <TableRow key={rec.id} className="border-b border-slate-100/50 hover:bg-purple-50/30 transition-colors">
                             <TableCell className="pl-6 py-5">
                                <div className="flex items-center gap-3">
                                   <div className="h-9 w-9 rounded-xl bg-slate-100 flex items-center justify-center text-[10px] font-black text-slate-400">
                                      {rec.firstName?.[0]}{rec.lastName?.[0]}
                                   </div>
                                   <div>
                                      <p className="font-extrabold text-slate-900 tracking-tight leading-none mb-1">{rec.firstName} {rec.lastName}</p>
                                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">#{rec.id.slice(0, 8)}</p>
                                   </div>
                                </div>
                             </TableCell>
                             <TableCell>
                                <p className="text-xs font-black text-slate-700">{rec.age || '22'} Yrs Old</p>
                                <span className="text-[10px] font-bold text-slate-400 uppercase">{rec.birthDate || 'JAN 01, 2004'}</span>
                             </TableCell>
                             <TableCell>
                                <Badge variant="secondary" className="bg-purple-50 text-purple-600 border-none font-bold text-[9px] uppercase tracking-tighter">Student</Badge>
                             </TableCell>
                             <TableCell className="text-right pr-6">
                                <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl text-slate-300 hover:text-purple-600 transition-colors"><MoreHorizontal size={18} /></Button>
                             </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                   </Table>
                </div>
              </Card>
           </div>
           <div>
              <Card className="border-none shadow-xl bg-slate-950 text-white rounded-3xl overflow-hidden sticky top-6">
                 <CardHeader className="p-6 pb-2">
                    <CardTitle className="text-xs font-black tracking-[0.3em] uppercase text-purple-400 italic flex items-center gap-2">
                       <Heart size={16} /> Demographics
                    </CardTitle>
                 </CardHeader>
                 <CardContent className="p-6 space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                       <div className="p-4 bg-white/5 rounded-2xl border border-white/5 text-center">
                          <p className="text-2xl font-black text-blue-400 tracking-tighter">1.4k</p>
                          <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest mt-1 italic">Voters</p>
                       </div>
                       <div className="p-4 bg-white/5 rounded-2xl border border-white/5 text-center">
                          <p className="text-2xl font-black text-rose-400 tracking-tighter">52%</p>
                          <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest mt-1 italic">Female</p>
                       </div>
                    </div>
                    <div className="space-y-4 pt-4 border-t border-white/5">
                       {[
                         { dem: 'Senior High', val: 340, color: 'bg-indigo-500' },
                         { dem: 'College', val: 820, color: 'bg-purple-500' },
                         { dem: 'Out-of-School', val: 120, color: 'bg-rose-500' },
                       ].map((d, i) => (
                          <div key={i} className="space-y-1.5">
                             <div className="flex justify-between text-[10px] font-bold italic">
                                <span className="text-slate-500">{d.dem}</span>
                                <span className="text-white">{d.val}</span>
                             </div>
                             <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                                <div className="h-full rounded-full" style={{ width: `${(d.val/1280)*100}%`, backgroundColor: d.color }} />
                             </div>
                          </div>
                       ))}
                    </div>
                 </CardContent>
              </Card>
           </div>
        </div>
      </motion.div>
    </PortalLayout>
  );
}
