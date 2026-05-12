import React, { useState, useEffect } from 'react';
import PortalLayout from '@/src/components/layout/PortalLayout';
import { cn } from '@/lib/utils';
import { 
  UserPlus, Search, Plus, Filter, Download, 
  MoreHorizontal, Eye, HeartPulse, Activity,
  ClipboardList, CheckCircle2, UserCheck, 
  Stethoscope, Database, Trash2, Edit, Accessibility
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

export default function PWD() {
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddOpen, setIsAddOpen] = useState(false);

  useEffect(() => {
    const q = query(collection(db, 'pwd_registry'), orderBy('createdAt', 'desc'));
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
              <div className="p-3 bg-purple-50 rounded-2xl shadow-sm border border-purple-100">
                <Accessibility className="text-purple-600 h-6 w-6 lg:h-8 lg:w-8" />
              </div>
              <div>
                <h2 className="text-2xl lg:text-3xl font-black text-slate-900 tracking-tight">PWD Assistance</h2>
                <p className="text-[10px] lg:text-xs font-bold text-slate-500 uppercase tracking-[0.2em] mt-1 italic">Disability Registry & Support Services</p>
              </div>
            </div>
          </motion.div>
          
          <motion.div variants={itemVariants} className="flex items-center gap-2">
            <Button variant="outline" className="h-11 px-4 rounded-xl border-slate-200 font-bold bg-white">
              <Download size={18} className="mr-2" /> Export Database
            </Button>
            
            <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
              <DialogTrigger render={
                <Button className="h-11 px-6 rounded-xl bg-purple-600 hover:bg-purple-700 shadow-lg shadow-purple-900/20 font-bold">
                  <UserPlus size={18} className="mr-2" /> Register PWD
                </Button>
              } />
              <DialogContent className="sm:max-w-[500px] border-none shadow-2xl rounded-3xl overflow-hidden font-sans">
                <div className="absolute top-0 left-0 w-full h-1.5 bg-purple-600" />
                <DialogHeader className="pt-6">
                  <DialogTitle className="text-xl font-black tracking-tight text-slate-900">New PWD Entry</DialogTitle>
                  <DialogDescription className="font-medium text-slate-500 italic">Add a resident with disabilities to the local registry for benefits.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-6 py-6 font-sans">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Resident Name</Label>
                    <Input placeholder="Full Name" className="h-12 rounded-xl bg-slate-50 border-slate-200 font-bold" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Disability Type</Label>
                      <Input placeholder="Visual / Physical / etc" className="h-12 rounded-xl bg-slate-50 border-slate-200 font-bold" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">PWD ID No.</Label>
                      <Input placeholder="ID-XXXX-XXXX" className="h-12 rounded-xl bg-slate-50 border-slate-200 font-bold" />
                    </div>
                  </div>
                </div>
                <DialogFooter className="bg-slate-50 p-6 -m-6 mt-2">
                  <Button variant="ghost" onClick={() => setIsAddOpen(false)} className="rounded-xl font-bold text-slate-500">Cancel</Button>
                  <Button className="bg-purple-600 hover:bg-purple-700 rounded-xl font-black px-8 shadow-lg shadow-purple-900/20 uppercase tracking-widest text-xs h-11">Register PWD</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           <div className="md:col-span-2">
              <Card className="border-slate-200/60 shadow-xl bg-white rounded-2xl font-sans overflow-hidden">
                <div className="p-4 lg:p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input placeholder="Search PWD registry..." className="pl-12 h-12 rounded-xl bg-slate-50 border-none shadow-inner font-medium" />
                  </div>
                </div>
                <div className="overflow-x-auto">
                   <Table>
                    <TableHeader className="bg-slate-50 font-sans">
                      <TableRow className="border-none">
                        <TableHead className="py-4 text-[10px] font-black uppercase text-slate-400 tracking-widest pl-6">Beneficiary</TableHead>
                        <TableHead className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Disability</TableHead>
                        <TableHead className="text-[10px] font-black uppercase text-slate-400 tracking-widest">ID Number</TableHead>
                        <TableHead className="text-[10px] font-black uppercase text-slate-400 tracking-widest text-right pr-6">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {records.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={4} className="py-20 text-center">
                            <div className="flex flex-col items-center gap-4 text-slate-300 font-sans font-black uppercase">
                              <Accessibility size={48} className="opacity-10" />
                              <p className="text-xs">Registry is currently empty</p>
                            </div>
                          </TableCell>
                        </TableRow>
                      ) : (
                        records.map(rec => (
                          <TableRow key={rec.id} className="border-b border-slate-50 hover:bg-slate-50/50 group">
                             <TableCell className="pl-6 py-4">
                                <p className="font-black text-slate-900 tracking-tight">{rec.name}</p>
                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Purok {rec.purok || '2'}</p>
                             </TableCell>
                             <TableCell>
                                <Badge variant="secondary" className="bg-purple-50 text-purple-600 border-none font-bold text-[9px] uppercase">{rec.type || 'Physical'}</Badge>
                             </TableCell>
                             <TableCell>
                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{rec.pwdId || 'PENDING'}</span>
                             </TableCell>
                             <TableCell className="text-right pr-6">
                                <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl text-slate-300 hover:text-purple-600 transition-colors">
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
           <div>
              <Card className="border-slate-200/60 shadow-lg bg-white rounded-2xl overflow-hidden">
                <CardHeader className="bg-slate-950 text-white p-6">
                   <CardTitle className="text-lg font-black tracking-tight uppercase italic flex items-center gap-2">
                     <HeartPulse size={20} className="text-purple-400" /> PWD Benefits
                   </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                   {[
                     { title: 'Medication Subsidy', value: '₱ 1,500/mo', active: true },
                     { title: 'Educational Support', value: 'Seasonal', active: true },
                     { title: 'Home-Care Visits', value: 'Weekly', active: false },
                   ].map((benefit, i) => (
                     <div key={i} className="flex items-center justify-between p-3 rounded-xl border border-slate-100 bg-slate-50/50">
                        <div>
                           <p className="text-[10px] font-black text-purple-600 uppercase tracking-widest leading-none mb-1">Status: {benefit.active ? 'Active' : 'Standby'}</p>
                           <h4 className="text-xs font-bold text-slate-900">{benefit.title}</h4>
                        </div>
                        <span className="text-xs font-black text-slate-900">{benefit.value}</span>
                     </div>
                   ))}
                   <Button className="w-full h-11 rounded-xl bg-slate-900 font-black uppercase tracking-widest text-[10px] mt-2">
                      Manage Benefits
                   </Button>
                </CardContent>
              </Card>
           </div>
        </div>
      </motion.div>
    </PortalLayout>
  );
}
