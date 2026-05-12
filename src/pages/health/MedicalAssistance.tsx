import React, { useState, useEffect } from 'react';
import PortalLayout from '@/src/components/layout/PortalLayout';
import { cn } from '@/lib/utils';
import { 
  HeartPulse, Search, Plus, Filter, Download, 
  MoreHorizontal, Eye, HandHelping, Banknote, 
  FileCheck, Clock, AlertCircle, Bookmark, Compass,
  TrendingUp, Activity, CheckCircle2, XCircle
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

export default function MedicalAssistance() {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddOpen, setIsAddOpen] = useState(false);

  useEffect(() => {
    const q = query(collection(db, 'medical_assistance'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setRequests(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
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
              <div className="p-3 bg-blue-50 rounded-2xl shadow-sm border border-blue-100">
                <HeartPulse className="text-blue-600 h-6 w-6 lg:h-8 lg:w-8" />
              </div>
              <div>
                <h2 className="text-2xl lg:text-3xl font-black text-slate-900 tracking-tight">Medical Assistance</h2>
                <p className="text-[10px] lg:text-xs font-bold text-slate-500 uppercase tracking-[0.2em] mt-1 italic">Resource Allocation & Disbursement</p>
              </div>
            </div>
          </motion.div>
          
          <motion.div variants={itemVariants} className="flex items-center gap-2">
            <Button variant="outline" className="h-11 px-4 rounded-xl border-slate-200 font-bold bg-white shadow-sm">
              <Download size={18} className="mr-2" /> Disbursement Log
            </Button>
            
            <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
              <DialogTrigger render={
                <Button className="h-11 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-900/20 font-bold">
                  <Plus size={18} className="mr-2" /> New Request
                </Button>
              } />
              <DialogContent className="sm:max-w-[500px] border-none shadow-2xl rounded-3xl overflow-hidden font-sans">
                <div className="absolute top-0 left-0 w-full h-1.5 bg-blue-600" />
                <DialogHeader className="pt-6">
                  <DialogTitle className="text-xl font-black tracking-tight text-slate-900">Application Initiation</DialogTitle>
                  <DialogDescription className="font-medium text-slate-500 italic">Financial or logistical support for resident medical needs.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-6 py-6">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Applicant Name</Label>
                    <Input placeholder="Search resident profile..." className="h-12 rounded-xl bg-slate-50 border-slate-200 font-bold" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Request Type</Label>
                      <Input placeholder="Medicine / Hospital Bills" className="h-12 rounded-xl bg-slate-50 border-slate-200 font-bold" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Proposed Amount</Label>
                      <Input placeholder="₱ 0.00" className="h-12 rounded-xl bg-slate-50 border-slate-200 font-bold" />
                    </div>
                  </div>
                </div>
                <DialogFooter className="bg-slate-50 p-6 -m-6 mt-2">
                  <Button variant="ghost" onClick={() => setIsAddOpen(false)} className="rounded-xl font-bold text-slate-500">Dismiss</Button>
                  <Button className="bg-blue-600 hover:bg-blue-700 rounded-xl font-black px-8 shadow-lg shadow-blue-900/20 uppercase tracking-widest text-xs h-11">Submit Application</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </motion.div>
        </div>

        {/* Assistance Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Total Funds Granted', value: '₱ 28.4K', icon: Banknote, color: 'text-emerald-600', bg: 'bg-emerald-50' },
            { label: 'Active Requests', value: '12', icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
            { label: 'Success Rate', value: '98.2%', icon: FileCheck, color: 'text-blue-600', bg: 'bg-blue-50' },
            { label: 'Monthly Growth', value: '+14%', icon: TrendingUp, color: 'text-rose-600', bg: 'bg-rose-50' },
          ].map((stat, i) => (
            <motion.div key={i} variants={itemVariants}>
              <Card className="border-slate-200/60 shadow-sm bg-white hover:border-blue-100 transition-colors group">
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
          <Card className="border-slate-200/60 shadow-xl shadow-slate-200/20 overflow-hidden bg-white rounded-2xl font-sans">
            <div className="p-4 lg:p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input placeholder="Filter by resident or assistance type..." className="pl-12 h-12 rounded-xl bg-slate-50 border-none shadow-inner font-medium" />
              </div>
              <div className="flex gap-2">
                 <Button variant="outline" className="h-11 rounded-xl font-bold bg-white border-slate-200">
                    <Filter size={18} className="mr-2" /> Categories
                 </Button>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-slate-50">
                  <TableRow className="border-none">
                    <TableHead className="py-4 text-[10px] font-black uppercase text-slate-400 tracking-widest pl-6">Beneficiary</TableHead>
                    <TableHead className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Support Type</TableHead>
                    <TableHead className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Amount Disbursed</TableHead>
                    <TableHead className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Date Processed</TableHead>
                    <TableHead className="text-[10px] font-black uppercase text-slate-400 tracking-widest text-center">Status</TableHead>
                    <TableHead className="text-[10px] font-black uppercase text-slate-400 tracking-widest text-right pr-6">Options</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    [1,2,3].map(i => <TableRow key={i} className="animate-pulse"><TableCell colSpan={6} className="py-8"><div className="h-10 bg-slate-100 rounded-xl w-full" /></TableCell></TableRow>)
                  ) : requests.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="py-20 text-center">
                        <div className="flex flex-col items-center gap-4 text-slate-300">
                          <HandHelping size={48} className="opacity-20" />
                          <p className="text-xs font-black uppercase tracking-[0.2em] italic">Awaiting first medical support request</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    requests.map((req) => (
                      <TableRow key={req.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors group">
                        <TableCell className="py-4 pl-6">
                            <p className="font-black text-slate-900 tracking-tight">{req.name}</p>
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Purok {req.purok || '1'} • Local Resident</p>
                        </TableCell>
                        <TableCell>
                           <Badge className="bg-blue-50 text-blue-700 border-none font-bold text-[9px] uppercase px-2">{req.type || 'Hopsital Subsidy'}</Badge>
                        </TableCell>
                        <TableCell>
                           <span className="font-bold text-slate-900">₱ {Number(req.amount || 2500).toLocaleString()}</span>
                        </TableCell>
                        <TableCell>
                           <span className="text-xs font-bold text-slate-500">{req.date || 'May 10, 2026'}</span>
                        </TableCell>
                        <TableCell className="text-center font-sans">
                           <Badge variant="outline" className={cn(
                             "text-[9px] font-black uppercase tracking-widest px-3 h-6 rounded-lg",
                             req.status === 'Approved' ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
                             req.status === 'Rejected' ? "bg-red-50 text-red-600 border-red-100" :
                             "bg-amber-50 text-amber-600 border-amber-100"
                           )}>
                             {req.status || 'Verified'}
                           </Badge>
                        </TableCell>
                        <TableCell className="text-right pr-6">
                           <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl text-slate-400 hover:text-blue-600 transition-colors">
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
