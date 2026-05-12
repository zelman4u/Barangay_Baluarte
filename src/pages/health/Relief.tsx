import React, { useState, useEffect } from 'react';
import PortalLayout from '@/src/components/layout/PortalLayout';
import { cn } from '@/lib/utils';
import { 
  Package, Search, Plus, Filter, Download, 
  MoreHorizontal, Eye, Box, Truck, 
  Users, Calendar, CheckCircle2, History,
  TrendingUp, Activity, Database, Archive,
  ClipboardCheck, MapPin, Trash2, Edit
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

export default function Relief() {
  const [batches, setBatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddOpen, setIsAddOpen] = useState(false);

  useEffect(() => {
    const q = query(collection(db, 'relief_operations'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setBatches(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
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
                <Package className="text-amber-600 h-6 w-6 lg:h-8 lg:w-8" />
              </div>
              <div>
                <h2 className="text-2xl lg:text-3xl font-black text-slate-900 tracking-tight">Relief Assistance</h2>
                <p className="text-[10px] lg:text-xs font-bold text-slate-500 uppercase tracking-[0.2em] mt-1 italic">Logistical Aid Distribution Tracking</p>
              </div>
            </div>
          </motion.div>
          
          <motion.div variants={itemVariants} className="flex items-center gap-2">
            <Button variant="outline" className="h-11 px-4 rounded-xl border-slate-200 font-bold bg-white">
              <History size={18} className="mr-2" /> Operation History
            </Button>
            
            <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
              <DialogTrigger render={
                <Button className="h-11 px-6 rounded-xl bg-amber-600 hover:bg-amber-700 shadow-lg shadow-amber-900/20 font-bold">
                  <Plus size={18} className="mr-2" /> New Batch
                </Button>
              } />
              <DialogContent className="sm:max-w-[500px] border-none shadow-2xl rounded-3xl overflow-hidden font-sans">
                <div className="absolute top-0 left-0 w-full h-1.5 bg-amber-600" />
                <DialogHeader className="pt-6">
                  <DialogTitle className="text-xl font-black tracking-tight text-slate-900">Initialize Relief Operation</DialogTitle>
                  <DialogDescription className="font-medium text-slate-500 italic">Define a new distribution batch for community assistance.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-6 py-6 font-sans">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Operation / Batch Title</Label>
                    <Input placeholder="Ayuda / Disaster Relief / Food Pack" className="h-12 rounded-xl bg-slate-50 border-slate-200 font-bold" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Quantity (Units)</Label>
                      <Input placeholder="0" className="h-12 rounded-xl bg-slate-50 border-slate-200 font-bold" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Target Sector</Label>
                      <Input placeholder="General / Senior / PWD" className="h-12 rounded-xl bg-slate-50 border-slate-200 font-bold" />
                    </div>
                  </div>
                </div>
                <DialogFooter className="bg-slate-50 p-6 -m-6 mt-2">
                  <Button variant="ghost" onClick={() => setIsAddOpen(false)} className="rounded-xl font-bold text-slate-500">Cancel</Button>
                  <Button className="bg-amber-600 hover:bg-amber-700 rounded-xl font-black px-8 shadow-lg shadow-amber-900/20 uppercase tracking-widest text-xs h-11">Launch Operation</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </motion.div>
        </div>

        {/* Relief Analytics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Distributed Today', value: '420', icon: Truck, color: 'text-amber-600', bg: 'bg-amber-50' },
            { label: 'Total Recipient Households', value: '1,280', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
            { label: 'Inventory in Stock', value: '850', icon: Box, color: 'text-emerald-600', bg: 'bg-emerald-50' },
            { label: 'Completion Rate', value: '94%', icon: ClipboardCheck, color: 'text-indigo-600', bg: 'bg-indigo-50' },
          ].map((stat, i) => (
            <motion.div key={i} variants={itemVariants}>
              <Card className="border-slate-200 shadow-sm bg-white hover:border-amber-100 transition-all group overflow-hidden">
                <CardContent className="p-4 lg:p-6 flex items-center gap-4">
                  <div className={cn("p-3 rounded-2xl transition-transform group-hover:scale-110 duration-300 shadow-sm", stat.bg, stat.color)}>
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
          <Card className="border-slate-200/60 shadow-xl bg-white rounded-2xl font-sans overflow-hidden">
             <div className="p-4 lg:p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input placeholder="Search operation history..." className="pl-12 h-12 rounded-xl bg-slate-50 border-none shadow-inner font-medium focus-visible:ring-amber-500" />
              </div>
              <div className="flex gap-2">
                 <Button variant="outline" className="h-11 rounded-xl font-bold bg-white border-slate-200 shadow-sm">
                    <Archive size={18} className="mr-2" /> Distribution Logs
                 </Button>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-slate-50 font-sans">
                  <TableRow className="border-none">
                    <TableHead className="py-4 text-[10px] font-black uppercase text-slate-400 tracking-widest pl-6">Operation Title</TableHead>
                    <TableHead className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Quantity</TableHead>
                    <TableHead className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Target Sector</TableHead>
                    <TableHead className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Distribution Date</TableHead>
                    <TableHead className="text-[10px] font-black uppercase text-slate-400 tracking-widest text-center">Status</TableHead>
                    <TableHead className="text-[10px] font-black uppercase text-slate-400 tracking-widest text-right pr-6">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    [1,2].map(i => <TableRow key={i} className="animate-pulse"><TableCell colSpan={6} className="py-8"><div className="h-10 bg-slate-100 rounded-xl w-full" /></TableCell></TableRow>)
                  ) : batches.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="py-20 text-center">
                        <div className="flex flex-col items-center gap-4 text-slate-300 font-black uppercase">
                          <Box size={48} className="opacity-10" />
                          <p className="text-xs tracking-widest">No active or past relief operations recorded</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    batches.map((batch) => (
                      <TableRow key={batch.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors group">
                        <TableCell className="py-4 pl-6">
                           <div className="flex items-center gap-4">
                             <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 font-sans font-black shadow-inner">
                                {batch.title?.[0] || 'R'}
                             </div>
                             <div className="min-w-0">
                                <p className="font-black text-slate-900 tracking-tight">{batch.title || 'General Relief'}</p>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">OP-ID #{batch.id.slice(0, 6)}</p>
                             </div>
                           </div>
                        </TableCell>
                        <TableCell>
                           <span className="text-xs font-bold font-sans text-slate-700">{batch.quantity || '0'} Units</span>
                        </TableCell>
                        <TableCell>
                           <Badge variant="secondary" className="bg-slate-100 text-slate-600 font-bold text-[9px] uppercase tracking-tight">{batch.sector || 'General'}</Badge>
                        </TableCell>
                        <TableCell>
                           <span className="text-xs font-bold font-sans text-slate-500">{batch.date || 'TBD'}</span>
                        </TableCell>
                        <TableCell className="text-center font-sans">
                           <Badge variant="outline" className={cn(
                             "text-[9px] font-black uppercase tracking-widest px-3 h-6 rounded-xl border-2",
                             batch.status === 'Completed' ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
                             batch.status === 'Ongoing' ? "bg-amber-50 text-amber-600 border-amber-100 animate-pulse" :
                             "bg-slate-50 text-slate-400 border-slate-100"
                           )}>
                             {batch.status || 'Planned'}
                           </Badge>
                        </TableCell>
                        <TableCell className="text-right pr-6">
                           <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl text-slate-300 hover:text-amber-600 transition-colors">
                                <MoreHorizontal size={18} />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48 rounded-2xl shadow-xl border-slate-100 p-1.5 backdrop-blur-md bg-white/95">
                               <DropdownMenuItem className="gap-2 font-bold text-xs rounded-xl h-10 px-3 hover:bg-slate-50"><Eye size={14} /> Full Logistics</DropdownMenuItem>
                               <DropdownMenuItem className="gap-2 font-bold text-xs rounded-xl h-10 px-3 hover:bg-slate-50"><Users size={14} /> Recipient List</DropdownMenuItem>
                               <DropdownMenuSeparator className="my-1 bg-slate-50" />
                               <DropdownMenuItem className="gap-2 font-bold text-xs text-red-600 rounded-xl h-10 px-3 hover:bg-red-50 focus:bg-red-50"><Trash2 size={14} /> Delete Entry</DropdownMenuItem>
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
