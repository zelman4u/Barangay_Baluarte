import React, { useState, useEffect } from 'react';
import PortalLayout from '@/src/components/layout/PortalLayout';
import { cn } from '@/lib/utils';
import { 
  ShieldCheck, Search, Plus, Filter, Download, 
  MoreHorizontal, Eye, Syringe, Calendar, CheckCircle2,
  Clock, AlertCircle, Info, Database, TrendingUp,
  FileText, Trash2, Edit
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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
import { collection, query, onSnapshot, orderBy, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/src/lib/firebase';
import { motion } from 'motion/react';

export default function Vaccination() {
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddOpen, setIsAddOpen] = useState(false);

  useEffect(() => {
    const q = query(collection(db, 'vaccinations'), orderBy('createdAt', 'desc'));
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
              <div className="p-3 bg-indigo-50 rounded-2xl shadow-sm border border-indigo-100">
                <ShieldCheck className="text-indigo-600 h-6 w-6 lg:h-8 lg:w-8" />
              </div>
              <div>
                <h2 className="text-2xl lg:text-3xl font-black text-slate-900 tracking-tight">Vaccination Drive</h2>
                <p className="text-[10px] lg:text-xs font-bold text-slate-500 uppercase tracking-[0.2em] mt-1 italic">Immunization Program Management</p>
              </div>
            </div>
          </motion.div>
          
          <motion.div variants={itemVariants} className="flex items-center gap-2">
            <Button variant="outline" className="h-11 px-4 rounded-xl border-slate-200 font-bold bg-white shadow-sm">
              <Download size={18} className="mr-2" /> Summary Report
            </Button>
            
            <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
              <DialogTrigger render={
                <Button className="h-11 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-900/20 font-bold">
                  <Syringe size={18} className="mr-2" /> Log Vaccination
                </Button>
              } />
              <DialogContent className="sm:max-w-[450px] border-none shadow-2xl rounded-3xl overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1.5 bg-indigo-600" />
                <DialogHeader className="pt-6">
                  <DialogTitle className="text-xl font-black tracking-tight text-slate-900">New Immunization Lead</DialogTitle>
                  <DialogDescription className="font-medium text-slate-500 italic">Record a recent patient vaccination entry.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-6 py-6 font-sans">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Recipient Name</Label>
                    <Input placeholder="Resident's Full Name" className="h-12 rounded-xl bg-slate-50 border-slate-200 font-bold" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Vaccine Type</Label>
                      <Input placeholder="Flu / COVID / Polio" className="h-12 rounded-xl bg-slate-50 border-slate-200 font-bold" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Dose Sequence</Label>
                      <Input placeholder="1st / 2nd / Booster" className="h-12 rounded-xl bg-slate-50 border-slate-200 font-bold" />
                    </div>
                  </div>
                </div>
                <DialogFooter className="bg-slate-50 p-6 -m-6 mt-2">
                  <Button variant="ghost" onClick={() => setIsAddOpen(false)} className="rounded-xl font-bold text-slate-500">Close</Button>
                  <Button className="bg-indigo-600 hover:bg-indigo-700 rounded-xl font-black px-8 shadow-lg shadow-indigo-900/20 uppercase tracking-widest text-xs h-11">Save Record</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </motion.div>
        </div>

        {/* Immunization Pulse */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Fully Vaccinated', value: '94.2%', icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
            { label: 'Booster Uptake', value: '62.8%', icon: TrendingUp, color: 'text-blue-600', bg: 'bg-blue-50' },
            { label: 'Active Supplies', value: '420', icon: Database, color: 'text-amber-600', bg: 'bg-amber-50' },
            { label: 'Next Campaign', value: 'May 20', icon: Calendar, color: 'text-rose-600', bg: 'bg-rose-50' },
          ].map((stat, i) => (
            <motion.div key={i} variants={itemVariants}>
              <Card className="border-slate-200/60 shadow-sm bg-white/50 backdrop-blur-sm group overflow-hidden">
                <CardContent className="p-4 lg:p-6 flex items-center gap-4">
                  <div className={cn("p-3 rounded-2xl transition-transform group-hover:rotate-12 duration-300", stat.bg, stat.color)}>
                    <stat.icon size={22} strokeWidth={2.5} />
                  </div>
                  <div>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">{stat.label}</p>
                    <p className="text-2xl font-black text-slate-900 mt-1 tracking-tighter leading-none">{stat.value}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div variants={itemVariants}>
          <Card className="border-slate-200/60 shadow-xl shadow-slate-200/20 overflow-hidden bg-white rounded-2xl">
            <div className="p-4 lg:p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input placeholder="Search vaccination logs..." className="pl-12 h-12 rounded-xl bg-slate-50 border-none shadow-inner font-medium" />
              </div>
              <div className="flex items-center gap-2">
                 <Button variant="outline" className="h-11 rounded-xl font-bold text-slate-600 border-slate-200 bg-white shadow-sm">
                   <Filter size={18} className="mr-2" /> Strategy Filter
                 </Button>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-slate-50">
                  <TableRow className="border-none hover:bg-transparent">
                    <TableHead className="py-4 text-[10px] font-black uppercase text-slate-400 tracking-widest pl-6">Recipient Info</TableHead>
                    <TableHead className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Vaccine / Brand</TableHead>
                    <TableHead className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Dose Type</TableHead>
                    <TableHead className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Administrator</TableHead>
                    <TableHead className="text-[10px] font-black uppercase text-slate-400 tracking-widest text-right pr-6">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    [1,2,3,4].map(i => (
                      <TableRow key={i} className="animate-pulse"><TableCell colSpan={5} className="py-8"><div className="h-10 bg-slate-100 rounded-xl w-full" /></TableCell></TableRow>
                    ))
                  ) : records.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="py-20 text-center">
                        <div className="flex flex-col items-center gap-4 text-slate-300 italic">
                          <Syringe size={48} className="opacity-10" />
                          <p className="text-xs font-black uppercase tracking-[0.2em]">Ready for new immunization entries</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    records.map((record) => (
                      <TableRow key={record.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors group">
                        <TableCell className="py-4 pl-6">
                           <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 font-black shadow-inner">
                              {record.name?.[0] || 'V'}
                            </div>
                            <div className="min-w-0">
                               <p className="font-black text-slate-900 tracking-tight truncate">{record.name}</p>
                               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Purok {record.purok || '4'} Resident</p>
                            </div>
                           </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                             <Badge className="bg-indigo-50 text-indigo-700 border-none font-bold text-[9px] uppercase">{record.vaccine || 'COVID Pfizer'}</Badge>
                             <span className="text-[9px] font-black text-slate-300 uppercase tracking-[0.2em]">{record.batch || 'BN-2024'}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                           <Badge variant="outline" className="text-[9px] font-black uppercase tracking-widest border-2 border-slate-100 text-slate-500">
                             {record.dose || '2nd Dose'}
                           </Badge>
                        </TableCell>
                        <TableCell>
                           <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-slate-700">{record.administrator || 'Dr. Santos'}</span>
                           </div>
                        </TableCell>
                        <TableCell className="text-right pr-6">
                           <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl text-slate-400 hover:text-indigo-600 transition-colors">
                                <MoreHorizontal size={18} />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48 rounded-2xl shadow-xl border-slate-100 p-1.5 backdrop-blur-md bg-white/95">
                              <DropdownMenuItem className="gap-2 font-bold text-xs rounded-xl h-10 px-3 hover:bg-slate-50"><FileText size={14} /> Full Record</DropdownMenuItem>
                              <DropdownMenuItem className="gap-2 font-bold text-xs rounded-xl h-10 px-3 hover:bg-slate-50"><Edit size={14} /> Correct Entry</DropdownMenuItem>
                              <DropdownMenuSeparator className="my-1 bg-slate-50" />
                              <DropdownMenuItem className="gap-2 font-bold text-xs text-red-600 rounded-xl h-10 px-3 hover:bg-red-50"><Trash2 size={14} /> Remove Entry</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </Card>
        </motion.div>
      </motion.div>
    </PortalLayout>
  );
}
