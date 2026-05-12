import React, { useState, useEffect } from 'react';
import PortalLayout from '@/src/components/layout/PortalLayout';
import { cn } from '@/lib/utils';
import { 
  Activity, Search, Plus, Filter, Download, 
  MoreHorizontal, Eye, Heart, ShieldCheck,
  TrendingUp, Users, Calendar, CheckCircle2,
  AlertCircle, Info, Database, BarChart3,
  Waves, Thermometer, Stethoscope, Briefcase
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

export default function Welfare() {
  const [loading, setLoading] = useState(true);
  const [records, setRecords] = useState<any[]>([]);

  useEffect(() => {
    const q = query(collection(db, 'welfare_logs'), orderBy('createdAt', 'desc'));
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
                <Activity className="text-emerald-600 h-6 w-6 lg:h-8 lg:w-8" />
              </div>
              <div>
                <h2 className="text-2xl lg:text-3xl font-black text-slate-900 tracking-tight">Welfare Monitoring</h2>
                <p className="text-[10px] lg:text-xs font-bold text-slate-500 uppercase tracking-[0.2em] mt-1 italic">Vulnerable Sector Active Surveillance</p>
              </div>
            </div>
          </motion.div>
          
          <motion.div variants={itemVariants} className="flex gap-2">
            <Button variant="outline" className="h-11 px-6 rounded-xl border-slate-200 font-bold bg-white">
              <BarChart3 className="mr-2 h-4 w-4" /> Global View
            </Button>
            
            <Dialog>
              <DialogTrigger render={
                <Button className="h-11 px-6 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold shadow-lg">
                  <Plus className="mr-2 h-4 w-4" /> Log Home Visit
                </Button>
              } />
              <DialogContent className="sm:max-w-[450px] border-none shadow-2xl rounded-3xl overflow-hidden font-sans">
                <div className="absolute top-0 left-0 w-full h-1.5 bg-emerald-600" />
                <DialogHeader className="pt-6">
                  <DialogTitle className="text-xl font-black tracking-tight text-slate-900">New Surveillance Log</DialogTitle>
                  <DialogDescription className="font-medium text-slate-500 italic">Record findings from a recent household welfare visitation.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-6 py-6 font-sans">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Subject / Resident</Label>
                    <Input placeholder="Full Name" className="h-12 rounded-xl bg-slate-50 border-slate-200 font-bold" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Concern Area</Label>
                    <Input placeholder="e.g. Living conditions / Medical" className="h-12 rounded-xl bg-slate-50 border-slate-200 font-bold" />
                  </div>
                </div>
                <DialogFooter className="bg-slate-50 p-6 -m-6 mt-2">
                  <Button variant="ghost" className="rounded-xl font-bold text-slate-500">Cancel</Button>
                  <Button className="bg-emerald-600 hover:bg-emerald-700 rounded-xl font-black px-8 shadow-lg shadow-emerald-900/20 uppercase tracking-widest text-xs h-11">Save Log</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </motion.div>
        </div>

        {/* Welfare Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           {[
             { title: 'In-Danger Zones', value: '12', desc: 'Households needing relocation', icon: Waves, color: 'text-amber-600', bg: 'bg-amber-50' },
             { title: 'Medical Case Follow-up', value: '45', desc: 'Patients post-surgery/illness', icon: Stethoscope, color: 'text-indigo-600', bg: 'bg-indigo-50' },
             { title: 'Employment Placement', value: '08', desc: 'Livelihood support provided', icon: Briefcase, color: 'text-emerald-600', bg: 'bg-emerald-50' },
           ].map((stat, i) => (
             <motion.div key={i} variants={itemVariants}>
               <Card className="border-slate-200/60 shadow-sm hover:shadow-md transition-all group overflow-hidden bg-white">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                       <div className={cn("p-4 rounded-2xl", stat.bg, stat.color)}>
                          <stat.icon size={24} strokeWidth={2.5} />
                       </div>
                       <Badge variant="outline" className="text-[9px] font-black uppercase tracking-widest bg-slate-50 border-slate-100">Active</Badge>
                    </div>
                    <div className="mt-4">
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{stat.title}</p>
                       <p className="text-3xl font-black text-slate-900 mt-1 tracking-tighter">{stat.value}</p>
                       <p className="text-xs font-medium text-slate-500 mt-2 italic">{stat.desc}</p>
                    </div>
                  </CardContent>
               </Card>
             </motion.div>
           ))}
        </div>

        <motion.div variants={itemVariants}>
           <Card className="border-slate-200 shadow-sm bg-white overflow-hidden rounded-2xl">
              <CardHeader className="bg-slate-50/50 border-b border-slate-100">
                <CardTitle className="text-sm font-black text-slate-400 uppercase tracking-widest italic">Recent Surveillance Feed</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                 <div className="overflow-x-auto font-sans">
                    <Table>
                       <TableHeader className="bg-slate-50/20">
                          <TableRow className="border-none">
                             <TableHead className="pl-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Target Subject</TableHead>
                             <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-400">Concern Area</TableHead>
                             <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-400">Staff Assigned</TableHead>
                             <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-400">Outcome</TableHead>
                             <TableHead className="pr-6 text-right text-[10px] font-black uppercase tracking-widest text-slate-400">Action</TableHead>
                          </TableRow>
                       </TableHeader>
                       <TableBody>
                          {records.length === 0 ? (
                             <TableRow>
                               <TableCell colSpan={5} className="py-20 text-center">
                                 <div className="flex flex-col items-center gap-3 text-slate-300">
                                   <Database size={40} className="opacity-20" />
                                   <p className="text-xs font-black uppercase tracking-widest">No welfare logs updated this week</p>
                                 </div>
                               </TableCell>
                             </TableRow>
                          ) : (
                             records.map(rec => (
                                <TableRow key={rec.id} className="border-b border-slate-50 group hover:bg-slate-50/30">
                                   <TableCell className="pl-6 py-4 font-bold text-slate-800">{rec.subject || 'Resident'}</TableCell>
                                   <TableCell className="text-xs font-medium text-slate-500 italic">{rec.concern || 'Standard Monitoring'}</TableCell>
                                   <TableCell className="text-xs font-bold text-slate-700">{rec.staff || 'BHW Personnel'}</TableCell>
                                   <TableCell>
                                      <Badge variant="outline" className="text-[9px] font-black uppercase tracking-tighter bg-emerald-50 text-emerald-600 border-none px-3">Resolved</Badge>
                                   </TableCell>
                                   <TableCell className="pr-6 text-right">
                                      <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-slate-300 group-hover:text-slate-900"><MoreHorizontal size={16} /></Button>
                                   </TableCell>
                                </TableRow>
                             ))
                          )}
                       </TableBody>
                    </Table>
                 </div>
              </CardContent>
           </Card>
        </motion.div>
      </motion.div>
    </PortalLayout>
  );
}
