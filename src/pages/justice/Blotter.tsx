import React, { useState, useEffect } from 'react';
import PortalLayout from '@/src/components/layout/PortalLayout';
import { 
  FileText, Search, Plus, Filter, Download, 
  MoreHorizontal, Eye, ShieldAlert, AlertCircle,
  FileDown, User, MapPin, Database, History,
  BookOpen, Hash, Clock
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

export default function Blotter() {
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddOpen, setIsAddOpen] = useState(false);

  useEffect(() => {
    const q = query(collection(db, 'blotter_records'), orderBy('createdAt', 'desc'));
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
                <BookOpen className="text-red-600 h-6 w-6 lg:h-8 lg:w-8" />
              </div>
              <div>
                <h2 className="text-2xl lg:text-3xl font-black text-slate-900 tracking-tight text-left">Blotter Records</h2>
                <p className="text-[10px] lg:text-xs font-bold text-slate-500 uppercase tracking-[0.2em] mt-1 italic text-left">Official Police/Barangay Incident Logbook</p>
              </div>
            </div>
          </motion.div>
          
          <motion.div variants={itemVariants} className="flex items-center gap-2">
            <Button variant="outline" className="h-11 px-4 rounded-xl border-slate-200 font-bold bg-white text-slate-700">
              <Download size={18} className="mr-2" /> Export Logbook
            </Button>
            
            <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
              <DialogTrigger render={
                <Button className="h-11 px-6 rounded-xl bg-red-600 hover:bg-red-700 shadow-lg shadow-red-900/20 font-bold text-white">
                  <Plus size={18} className="mr-2" /> New Entry
                </Button>
              } />
              <DialogContent className="sm:max-w-[600px] border-none shadow-2xl rounded-3xl overflow-hidden font-sans">
                <div className="absolute top-0 left-0 w-full h-1.5 bg-red-600" />
                <DialogHeader className="pt-6">
                  <DialogTitle className="text-xl font-black tracking-tight text-slate-900 text-left">Internal Blotter Entry</DialogTitle>
                  <DialogDescription className="font-medium text-slate-500 italic text-left tracking-tight">Officially record a criminal or civil incident for legal documentation.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-6 py-6 font-sans">
                   <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2 text-left">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 text-left">Reporter Name</Label>
                      <Input placeholder="Complainant" className="h-12 rounded-xl bg-slate-50 border-slate-200 font-bold" />
                    </div>
                    <div className="space-y-2 text-left">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 text-left">Incident Type</Label>
                      <Input placeholder="Theft / Assault / etc" className="h-12 rounded-xl bg-slate-50 border-slate-200 font-bold" />
                    </div>
                  </div>
                  <div className="space-y-2 text-left">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 text-left">Narrative / Description</Label>
                    <textarea 
                      className="w-full h-32 rounded-xl bg-slate-50 border border-slate-200 font-bold p-4 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20"
                      placeholder="Provide a detailed narrative of the event..."
                    />
                  </div>
                </div>
                <DialogFooter className="bg-slate-50 p-6 -m-6 mt-2">
                  <Button variant="ghost" onClick={() => setIsAddOpen(false)} className="rounded-xl font-bold text-slate-500">Cancel</Button>
                  <Button className="bg-red-600 hover:bg-red-700 rounded-xl font-black px-8 shadow-lg shadow-red-900/20 uppercase tracking-widest text-xs h-11 text-white">Commit Entry</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
           <div className="lg:col-span-9">
              <Card className="border-slate-200/60 shadow-xl bg-white rounded-2xl font-sans overflow-hidden">
                <div className="p-4 lg:p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input placeholder="Search blotter by reporter, type or case #" className="pl-12 h-12 rounded-xl bg-slate-50 border-none shadow-inner font-medium" />
                  </div>
                </div>
                <div className="overflow-x-auto">
                   <Table>
                    <TableHeader className="bg-slate-50 font-sans">
                      <TableRow className="border-none">
                        <TableHead className="py-4 text-[10px] font-black uppercase text-slate-400 tracking-widest pl-6">Entry ID & Date</TableHead>
                        <TableHead className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Incident Nature</TableHead>
                        <TableHead className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Reporting Entity</TableHead>
                        <TableHead className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Severity</TableHead>
                        <TableHead className="text-[10px] font-black uppercase text-slate-400 tracking-widest text-right pr-6">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {records.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} className="py-20 text-center">
                            <div className="flex flex-col items-center gap-4 text-slate-300 font-sans font-black uppercase">
                              <BookOpen size={48} className="opacity-10" />
                              <p className="text-xs">No blotter entries found</p>
                            </div>
                          </TableCell>
                        </TableRow>
                      ) : (
                        records.map(rec => (
                          <TableRow key={rec.id} className="border-b border-slate-50 hover:bg-slate-50/50 group">
                             <TableCell className="pl-6 py-5">
                                <p className="font-extrabold text-slate-900 tracking-tight text-xs uppercase underline decoration-red-200">#{rec.id.slice(0, 8)}</p>
                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter mt-1">{rec.date || 'MAY 11, 2026'}</p>
                             </TableCell>
                             <TableCell>
                                <p className="text-xs font-black text-slate-800">{rec.type || 'General Offense'}</p>
                             </TableCell>
                             <TableCell>
                                <span className="text-[11px] font-bold text-slate-500 italic">{rec.reporter || 'Anonymous'}</span>
                             </TableCell>
                             <TableCell>
                                <Badge className="bg-red-50 text-red-600 border-none font-bold text-[9px] uppercase px-3">High</Badge>
                             </TableCell>
                             <TableCell className="text-right pr-6">
                                <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl text-slate-300 hover:text-red-600 transition-colors">
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
           <div className="lg:col-span-3 space-y-6">
              <Card className="border-none shadow-xl bg-slate-900 text-white rounded-2xl overflow-hidden relative">
                 <CardHeader className="p-6">
                    <CardTitle className="text-xs font-black uppercase tracking-widest text-red-400 italic flex items-center gap-2">
                       <Hash size={16} /> Fast Counters
                    </CardTitle>
                 </CardHeader>
                 <CardContent className="p-6 pt-0 space-y-4">
                    {[
                      { label: 'Total Entries YTD', value: '428' },
                      { label: 'Felonies Logged', value: '18' },
                      { label: 'Civil Disputes', value: '312' },
                    ].map((stat, i) => (
                      <div key={i} className="flex flex-col gap-1 border-b border-white/5 pb-3">
                         <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">{stat.label}</span>
                         <span className="text-2xl font-black text-white tracking-tighter">{stat.value}</span>
                      </div>
                    ))}
                 </CardContent>
              </Card>

              <Card className="border-slate-200 shadow-sm rounded-2xl overflow-hidden">
                <CardContent className="p-0">
                  <div className="bg-red-50 p-6 flex items-center gap-4">
                     <AlertCircle className="text-red-600 shrink-0" size={24} />
                     <p className="text-[10px] font-bold text-red-900 uppercase tracking-tight leading-relaxed italic">
                       Blotter records are legal documents. Tampering is punishable by law.
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
