import React, { useState, useEffect } from 'react';
import PortalLayout from '@/src/components/layout/PortalLayout';
import { 
  AlertTriangle, Search, Plus, Filter, Download, 
  MoreHorizontal, Gavel, FileText, Ban,
  CheckCircle2, AlertCircle, FileDown,
  Database, UserX, Receipt, Landmark
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { collection, query, onSnapshot, orderBy } from 'firebase/firestore';
import { db } from '@/src/lib/firebase';
import { motion } from 'motion/react';

export default function Violations() {
  const [records, setRecords] = useState<any[]>([]);

  useEffect(() => {
    const q = query(collection(db, 'ordinance_violations'), orderBy('createdAt', 'desc'));
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
                <Ban className="text-amber-600 h-6 w-6 lg:h-8 lg:w-8" />
              </div>
              <div>
                <h2 className="text-2xl lg:text-3xl font-black text-slate-900 tracking-tight text-left italic">Ordinance Violations</h2>
                <p className="text-[10px] lg:text-xs font-bold text-slate-500 uppercase tracking-[0.2em] mt-1 italic text-left">Code Enforcement & Citation Registry</p>
              </div>
            </div>
          </motion.div>
          
          <motion.div variants={itemVariants} className="flex gap-2">
            <Button variant="outline" className="h-11 px-6 rounded-xl border-slate-200 font-bold bg-white text-slate-700">
              <Receipt className="mr-2 h-4 w-4" /> Issue Citation
            </Button>
            <Button className="h-11 px-6 rounded-xl bg-slate-900 text-white font-black uppercase tracking-widest text-xs hover:bg-slate-800 shadow-xl">
               <Plus className="mr-2 h-4 w-4" /> log Violation
            </Button>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
           <div className="lg:col-span-3">
              <Card className="border-slate-200/60 shadow-xl bg-white rounded-2xl font-sans overflow-hidden">
                <div className="p-4 lg:p-6 border-b border-slate-100 bg-slate-50/20 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input placeholder="Search citations by violator or ID..." className="pl-12 h-11 rounded-1xl border-slate-200 shadow-sm font-medium" />
                  </div>
                </div>
                <div className="overflow-x-auto">
                   <Table>
                    <TableHeader className="bg-slate-50/50">
                      <TableRow className="border-none">
                        <TableHead className="py-4 text-[10px] font-black uppercase text-slate-400 tracking-widest pl-6">Violator</TableHead>
                        <TableHead className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Ordinance Ref</TableHead>
                        <TableHead className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Fine Status</TableHead>
                        <TableHead className="text-[10px] font-black uppercase text-slate-400 tracking-widest text-right pr-6">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {records.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={4} className="py-24 text-center">
                            <div className="flex flex-col items-center gap-4 text-slate-300">
                              <Landmark size={48} className="opacity-10" />
                              <p className="text-xs font-black uppercase tracking-[0.2em]">No violations recorded today</p>
                            </div>
                          </TableCell>
                        </TableRow>
                      ) : (
                        records.map(rec => (
                          <TableRow key={rec.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                             <TableCell className="pl-6 py-5">
                                <p className="font-extrabold text-slate-900 tracking-tight">{rec.name || 'Resident'}</p>
                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">#{rec.id.slice(0, 8)}</p>
                             </TableCell>
                             <TableCell>
                                <p className="text-xs font-bold text-slate-600 line-clamp-1 italic">{rec.ordinance || 'Code Section 102'}</p>
                             </TableCell>
                             <TableCell>
                                <Badge className="bg-amber-100 text-amber-700 border-none font-bold text-[9px] uppercase tracking-tighter px-3">Unpaid</Badge>
                             </TableCell>
                             <TableCell className="text-right pr-6">
                                <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl text-slate-300 hover:text-slate-900 transition-colors"><MoreHorizontal size={18} /></Button>
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
              <Card className="border-none shadow-xl bg-slate-900 text-white rounded-2xl overflow-hidden sticky top-6">
                 <CardHeader className="p-6 pb-2">
                    <CardTitle className="text-xs font-black tracking-[0.3em] uppercase text-slate-500 italic">Top Violations YTD</CardTitle>
                 </CardHeader>
                 <CardContent className="p-6 space-y-4">
                    {[
                      { code: 'Curfew', count: '142', trend: 'UP' },
                      { code: 'Illegal Dump', count: '85', trend: 'DOWN' },
                      { code: 'Noise Poll.', count: '42', trend: 'STABLE' },
                    ].map((v, i) => (
                      <div key={i} className="flex justify-between items-center bg-white/5 p-3 rounded-xl border border-white/5">
                         <div>
                            <p className="text-xs font-black italic">{v.code}</p>
                            <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">{v.trend}</span>
                         </div>
                         <p className="text-xl font-black text-white tracking-tighter">{v.count}</p>
                      </div>
                    ))}
                    <div className="pt-4 border-t border-white/5 text-center">
                       <p className="text-[9px] font-medium text-slate-500 italic mb-4">Centralized fine collection integrated with Treasury Dept.</p>
                       <Button variant="outline" className="w-full text-[9px] font-black uppercase tracking-widest text-slate-400 border-white/10 hover:bg-white/5 bg-transparent">
                          View Fine Revenue
                       </Button>
                    </div>
                 </CardContent>
              </Card>
           </div>
        </div>
      </motion.div>
    </PortalLayout>
  );
}
