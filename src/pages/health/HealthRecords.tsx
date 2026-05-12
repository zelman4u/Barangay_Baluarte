import React, { useState, useEffect } from 'react';
import PortalLayout from '@/src/components/layout/PortalLayout';
import { cn } from '@/lib/utils';
import { 
  Stethoscope, Search, UserPlus, Filter, Download, 
  MoreHorizontal, Eye, Edit, Trash2, Heart, 
  Activity, Thermometer, ClipboardList, Database,
  ArrowUpRight, Plus, Calendar, Clock
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
import { collection, query, onSnapshot, orderBy, limit, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/src/lib/firebase';
import { motion } from 'motion/react';

export default function HealthRecords() {
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddOpen, setIsAddOpen] = useState(false);

  useEffect(() => {
    const q = query(collection(db, 'health_records'), orderBy('updatedAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setRecords(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <PortalLayout>
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="space-y-6"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <motion.div variants={itemVariants}>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-rose-50 rounded-2xl shadow-sm border border-rose-100">
                <Stethoscope className="text-rose-600 h-6 w-6 lg:h-8 lg:w-8" />
              </div>
              <div>
                <h2 className="text-2xl lg:text-3xl font-black text-slate-900 tracking-tight">Health Records</h2>
                <p className="text-[10px] lg:text-xs font-bold text-slate-500 uppercase tracking-[0.2em] mt-1 italic">Electronic Medical Management</p>
              </div>
            </div>
          </motion.div>
          
          <motion.div variants={itemVariants} className="flex items-center gap-2">
            <Button variant="outline" className="h-11 px-4 rounded-xl border-slate-200 font-bold bg-white shadow-sm">
              <Download size={18} className="mr-2" /> Export
            </Button>
            
            <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
              <DialogTrigger render={
                <Button className="h-11 px-6 rounded-xl bg-rose-600 hover:bg-rose-700 shadow-lg shadow-rose-900/20 font-bold">
                  <Plus size={18} className="mr-2" /> New Case File
                </Button>
              } />
              <DialogContent className="sm:max-w-[500px] border-none shadow-2xl rounded-3xl overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1.5 bg-rose-600" />
                <DialogHeader className="pt-6">
                  <DialogTitle className="text-xl font-black tracking-tight text-slate-900">New Patient Instance</DialogTitle>
                  <DialogDescription className="font-medium text-slate-500 italic">Create a new electronic health record file.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-6 py-6">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Patient Full Name</Label>
                    <Input placeholder="Search resident database..." className="h-12 rounded-xl bg-slate-50 border-slate-200 font-bold" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Entry Type</Label>
                      <Input placeholder="Checkup / Referral" className="h-12 rounded-xl bg-slate-50 border-slate-200 font-bold" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Severity</Label>
                      <Input placeholder="Routine / Urgent" className="h-12 rounded-xl bg-slate-50 border-slate-200 font-bold" />
                    </div>
                  </div>
                </div>
                <DialogFooter className="bg-slate-50 p-6 -m-6 mt-2">
                  <Button variant="ghost" onClick={() => setIsAddOpen(false)} className="rounded-xl font-bold text-slate-500">Cancel</Button>
                  <Button className="bg-rose-600 hover:bg-rose-700 rounded-xl font-black px-8 shadow-lg shadow-rose-900/20 uppercase tracking-widest text-xs h-11">Initialize File</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </motion.div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Active Consultations', value: '24', icon: Heart, color: 'text-rose-600', bg: 'bg-rose-50' },
            { label: 'Total Patients', value: '1,482', icon: Database, color: 'text-indigo-600', bg: 'bg-indigo-50' },
            { label: 'Avg Daily Visits', value: '18', icon: Activity, color: 'text-emerald-600', bg: 'bg-emerald-50' },
            { label: 'Pending Referrals', value: '07', icon: ClipboardList, color: 'text-amber-600', bg: 'bg-amber-50' },
          ].map((stat, i) => (
            <motion.div key={i} variants={itemVariants}>
              <Card className="border-slate-200/60 shadow-sm hover:shadow-md transition-all group overflow-hidden bg-white/50 backdrop-blur-sm">
                <CardContent className="p-4 lg:p-6 flex items-center gap-4">
                   <div className={cn("p-3 rounded-2xl transition-transform group-hover:scale-110 duration-300", stat.bg, stat.color)}>
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
                <Input 
                  placeholder="Search by patient name, diagnosis, or record ID..." 
                  className="pl-12 h-12 rounded-xl bg-slate-50 border-none shadow-inner font-medium focus-visible:ring-rose-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" className="h-11 rounded-xl font-bold text-slate-600 border-slate-200 bg-white">
                  <Filter size={18} className="mr-2" /> Filters
                </Button>
                <div className="h-8 w-px bg-slate-100" />
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Showing {records.length} records
                </p>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-slate-50">
                  <TableRow className="border-none hover:bg-transparent">
                    <TableHead className="w-[300px] py-4 text-[10px] font-black uppercase text-slate-400 tracking-widest pl-6">Patient & ID</TableHead>
                    <TableHead className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Diagnosis</TableHead>
                    <TableHead className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Last Checkup</TableHead>
                    <TableHead className="text-[10px] font-black uppercase text-slate-400 tracking-widest text-center">Status</TableHead>
                    <TableHead className="text-[10px] font-black uppercase text-slate-400 tracking-widest text-right pr-6">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    [1,2,3,4,5].map(i => (
                      <TableRow key={i} className="animate-pulse border-b border-slate-50 hover:bg-transparent">
                        <TableCell colSpan={5} className="py-8 pl-6">
                          <div className="h-10 bg-slate-100 rounded-xl w-full" />
                        </TableCell>
                      </TableRow>
                    ))
                  ) : records.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="py-20 text-center">
                        <div className="flex flex-col items-center justify-center gap-4 text-slate-300">
                          <div className="p-6 bg-slate-50 rounded-full">
                            <ClipboardList size={48} className="opacity-20" />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-400">No medical records found</p>
                            <p className="text-xs uppercase tracking-widest font-black mt-1">Initialize your first patient file</p>
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    records.map((record, i) => (
                      <TableRow key={record.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors group">
                        <TableCell className="py-4 pl-6">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 font-black shrink-0 shadow-sm border border-white">
                              {record.patientName?.[0] || 'P'}
                            </div>
                            <div className="min-w-0">
                              <p className="font-black text-slate-900 tracking-tight truncate">{record.patientName}</p>
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">EMR NO_{record.recordNumber || record.id.slice(0, 8)}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {(record.diagnosis || ['Checkup', 'General']).map((diag: string, j: number) => (
                              <Badge key={j} variant="secondary" className="text-[9px] font-bold bg-rose-50 text-rose-600 border-none px-2 uppercase tracking-tight">
                                {diag}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2 text-slate-500">
                             <Clock size={14} className="text-slate-400" />
                             <span className="text-xs font-bold">{record.lastCheckup || 'Today'}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge className={cn(
                            "text-[9px] font-black uppercase tracking-widest h-6 px-3 rounded-lg border-2",
                            record.status === 'Critical' ? "bg-red-50 text-red-600 border-red-100" :
                            record.status === 'Monitoring' ? "bg-amber-50 text-amber-600 border-amber-100" :
                            "bg-emerald-50 text-emerald-600 border-emerald-100"
                          )}>
                            {record.status || 'Stable'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right pr-6">
                           <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl text-slate-400 hover:text-rose-600 transition-colors group-hover:bg-rose-50">
                                <MoreHorizontal size={18} />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48 rounded-2xl shadow-xl border-slate-100 p-1.5 backdrop-blur-md bg-white/95">
                              <DropdownMenuLabel className="text-[9px] font-black uppercase tracking-widest text-slate-400 px-3 py-2">Clinical Management</DropdownMenuLabel>
                              <DropdownMenuItem className="gap-2 font-bold text-xs rounded-xl h-10 px-3 hover:bg-slate-50 focus:bg-slate-50 focus:text-rose-600"><Eye size={14} /> Full History</DropdownMenuItem>
                              <DropdownMenuItem className="gap-2 font-bold text-xs rounded-xl h-10 px-3 hover:bg-slate-50 focus:bg-slate-50 focus:text-blue-600"><Edit size={14} /> Update Diagnosis</DropdownMenuItem>
                              <DropdownMenuSeparator className="my-1 bg-slate-50" />
                              <DropdownMenuItem className="gap-2 font-bold text-xs text-red-600 rounded-xl h-10 px-3 hover:bg-red-50 focus:bg-red-50 focus:text-red-700"><Trash2 size={14} /> Archive File</DropdownMenuItem>
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
