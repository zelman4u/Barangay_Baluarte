import React, { useState, useEffect } from 'react';
import PortalLayout from '@/src/components/layout/PortalLayout';
import { cn } from '@/lib/utils';
import { 
  Baby, Search, Plus, Filter, Download, 
  MoreHorizontal, Eye, Apple, Scale, 
  Utensils, TrendingDown, ClipboardList,
  Calendar, CheckCircle2, UserCheck, Activity,
  Database, LineChart, Pill
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

export default function Nutrition() {
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddOpen, setIsAddOpen] = useState(false);

  useEffect(() => {
    const q = query(collection(db, 'nutrition_program'), orderBy('createdAt', 'desc'));
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
              <div className="p-3 bg-emerald-50 rounded-2xl shadow-sm border border-emerald-100">
                <Baby className="text-emerald-600 h-6 w-6 lg:h-8 lg:w-8" />
              </div>
              <div>
                <h2 className="text-2xl lg:text-3xl font-black text-slate-900 tracking-tight">Nutrition Program</h2>
                <p className="text-[10px] lg:text-xs font-bold text-slate-500 uppercase tracking-[0.2em] mt-1 italic">Child & Maternal Nutritional Surveillance</p>
              </div>
            </div>
          </motion.div>
          
          <motion.div variants={itemVariants} className="flex items-center gap-2">
            <Button variant="outline" className="h-11 px-4 rounded-xl border-slate-200 font-bold bg-white shadow-sm">
              <Download size={18} className="mr-2" /> Program Status
            </Button>
            
            <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
              <DialogTrigger render={
                <Button className="h-11 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-900/20 font-bold">
                  <Plus size={18} className="mr-2" /> Log Measurement
                </Button>
              } />
              <DialogContent className="sm:max-w-[450px] border-none shadow-2xl rounded-3xl overflow-hidden font-sans">
                <div className="absolute top-0 left-0 w-full h-1.5 bg-emerald-600" />
                <DialogHeader className="pt-6">
                  <DialogTitle className="text-xl font-black tracking-tight text-slate-900">Health Surveillance Entry</DialogTitle>
                  <DialogDescription className="font-medium text-slate-500 italic">Record weight, height, and nutritional status for monitoring.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-6 py-6 font-sans">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Child/Resident Name</Label>
                    <Input placeholder="Full Name" className="h-12 rounded-xl bg-slate-50 border-slate-200 font-bold" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Weight (kg)</Label>
                      <Input placeholder="0.0" className="h-12 rounded-xl bg-slate-50 border-slate-200 font-bold" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Height (cm)</Label>
                      <Input placeholder="0.0" className="h-12 rounded-xl bg-slate-50 border-slate-200 font-bold" />
                    </div>
                  </div>
                </div>
                <DialogFooter className="bg-slate-50 p-6 -m-6 mt-2">
                  <Button variant="ghost" onClick={() => setIsAddOpen(false)} className="rounded-xl font-bold text-slate-500">Close</Button>
                  <Button className="bg-emerald-600 hover:bg-emerald-700 rounded-xl font-black px-8 shadow-lg shadow-emerald-900/20 uppercase tracking-widest text-xs h-11">Register Data</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </motion.div>
        </div>

        {/* Nutrition Pulse Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Normal Status', value: '88.4%', icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
            { label: 'Underweight Count', value: '14', icon: Scale, color: 'text-rose-600', bg: 'bg-rose-50' },
            { label: 'Program Reach', value: '100%', icon: UserCheck, color: 'text-indigo-600', bg: 'bg-indigo-50' },
            { label: 'Vitamin A Drive', value: 'Active', icon: Pill, color: 'text-amber-600', bg: 'bg-amber-50' },
          ].map((stat, i) => (
            <motion.div key={i} variants={itemVariants}>
              <Card className="border-slate-200 shadow-sm bg-white hover:shadow-md transition-all group overflow-hidden">
                <CardContent className="p-4 lg:p-6 flex items-center gap-4">
                  <div className={cn("p-3 rounded-2xl transition-transform group-hover:-rotate-12 duration-300 shadow-sm", stat.bg, stat.color)}>
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
          <Card className="border-slate-200/60 shadow-xl shadow-slate-200/20 overflow-hidden bg-white rounded-2xl font-sans">
             <div className="p-4 lg:p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input placeholder="Search program participants..." className="pl-12 h-12 rounded-xl bg-slate-50 border-none shadow-inner font-medium" />
              </div>
              <div className="flex gap-2">
                 <Button variant="outline" className="h-11 rounded-xl font-bold border-slate-200 bg-white">
                    <Apple size={18} className="mr-2 text-rose-500" /> Malnutrition List
                 </Button>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-slate-50 font-sans">
                  <TableRow className="border-none hover:bg-transparent">
                    <TableHead className="py-4 text-[10px] font-black uppercase text-slate-400 tracking-widest pl-6">Participant</TableHead>
                    <TableHead className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Age / Group</TableHead>
                    <TableHead className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Weight Data</TableHead>
                    <TableHead className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Status Rating</TableHead>
                    <TableHead className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Last Assessed</TableHead>
                    <TableHead className="text-[10px] font-black uppercase text-slate-400 tracking-widest text-right pr-6">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    [1,2,3].map(i => <TableRow key={i} className="animate-pulse"><TableCell colSpan={6} className="py-8"><div className="h-10 bg-slate-100 rounded-xl w-full" /></TableCell></TableRow>)
                  ) : records.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="py-20 text-center">
                        <div className="flex flex-col items-center gap-4 text-slate-300 italic font-sans font-black uppercase tracking-widest">
                          <Utensils size={48} className="opacity-10" />
                          <p className="text-xs">Log nutrition assessments to see data</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    records.map((rec) => (
                      <TableRow key={rec.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors group">
                        <TableCell className="py-4 pl-6">
                           <div className="flex items-center gap-4">
                             <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 font-sans font-black shadow-inner">
                               {rec.name?.[0] || 'N'}
                             </div>
                             <div className="min-w-0">
                                <p className="font-black text-slate-900 tracking-tight">{rec.name || 'Resident'}</p>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Purok {rec.purok || '3'}</p>
                             </div>
                           </div>
                        </TableCell>
                        <TableCell>
                           <span className="text-xs font-bold text-slate-700">{rec.ageGroup || '6-12 Months'}</span>
                        </TableCell>
                        <TableCell>
                           <div className="flex flex-col">
                              <span className="text-xs font-black text-slate-900 leading-none">{rec.weight || '8.4'} kg</span>
                              <span className="text-[9px] font-bold text-slate-400 mt-1 uppercase tracking-tighter">{rec.height || '72'} cm</span>
                           </div>
                        </TableCell>
                        <TableCell>
                           <Badge variant="outline" className={cn(
                             "text-[9px] font-black uppercase tracking-widest h-6 px-3 rounded-lg border-2",
                             rec.status === 'Malnourished' ? "bg-rose-50 text-rose-600 border-rose-100" :
                             rec.status === 'Overweight' ? "bg-indigo-50 text-indigo-600 border-indigo-100" :
                             "bg-emerald-50 text-emerald-600 border-emerald-100"
                           )}>
                             {rec.status || 'Normal'}
                           </Badge>
                        </TableCell>
                        <TableCell>
                           <span className="text-xs font-bold text-slate-500">{rec.lastAssessed || 'May 08, 2026'}</span>
                        </TableCell>
                        <TableCell className="text-right pr-6">
                           <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl text-slate-300 hover:text-emerald-600 transition-colors">
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
        </motion.div>
      </motion.div>
    </PortalLayout>
  );
}
