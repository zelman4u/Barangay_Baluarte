import React, { useState, useEffect } from 'react';
import PortalLayout from '@/src/components/layout/PortalLayout';
import { cn } from '@/lib/utils';
import { 
  Users, Search, Plus, Filter, Download, 
  MoreHorizontal, Eye, Heart, GlassWater,
  Calendar, CreditCard, ChevronRight, Cake,
  MapPin, Phone, Mail, CheckCircle2, UserCheck,
  Stethoscope, Database, Trash2, Edit
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

export default function Seniors() {
  const [seniors, setSeniors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddOpen, setIsAddOpen] = useState(false);

  useEffect(() => {
    const q = query(collection(db, 'senior_citizens'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setSeniors(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
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
                <Users className="text-indigo-600 h-6 w-6 lg:h-8 lg:w-8" />
              </div>
              <div>
                <h2 className="text-2xl lg:text-3xl font-black text-slate-900 tracking-tight">Senior Citizens</h2>
                <p className="text-[10px] lg:text-xs font-bold text-slate-500 uppercase tracking-[0.2em] mt-1 italic">Elderly Welfare & Pension Registry</p>
              </div>
            </div>
          </motion.div>
          
          <motion.div variants={itemVariants} className="flex items-center gap-2">
            <Button variant="outline" className="h-11 px-4 rounded-xl border-slate-200 font-bold bg-white">
              <Download size={18} className="mr-2" /> Masterlist
            </Button>
            
            <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
              <DialogTrigger render={
                <Button className="h-11 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-900/20 font-bold">
                  <Plus size={18} className="mr-2" /> Register OSCA
                </Button>
              } />
              <DialogContent className="sm:max-w-[550px] border-none shadow-2xl rounded-3xl overflow-hidden font-sans">
                <div className="absolute top-0 left-0 w-full h-1.5 bg-indigo-600" />
                <DialogHeader className="pt-6">
                  <DialogTitle className="text-xl font-black tracking-tight text-slate-900">New Senior Registration</DialogTitle>
                  <DialogDescription className="font-medium text-slate-500 italic">Enroll an elderly resident for secondary benefits and monitoring.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-6 py-6 font-sans">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                       <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">First Name</Label>
                       <Input className="h-12 rounded-xl bg-slate-50 border-slate-200 font-bold" />
                    </div>
                    <div className="space-y-2">
                       <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Last Name</Label>
                       <Input className="h-12 rounded-xl bg-slate-50 border-slate-200 font-bold" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                       <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Date of Birth</Label>
                       <Input type="date" className="h-12 rounded-xl bg-slate-50 border-slate-200 font-bold" />
                    </div>
                    <div className="space-y-2">
                       <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">OSCA ID No.</Label>
                       <Input className="h-12 rounded-xl bg-slate-50 border-slate-200 font-bold" />
                    </div>
                  </div>
                </div>
                <DialogFooter className="bg-slate-50 p-6 -m-6 mt-2">
                  <Button variant="ghost" onClick={() => setIsAddOpen(false)} className="rounded-xl font-bold text-slate-500">Cancel</Button>
                  <Button className="bg-indigo-600 hover:bg-indigo-700 rounded-xl font-black px-8 shadow-lg shadow-indigo-900/20 uppercase tracking-widest text-xs h-11">Complete Enrollment</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </motion.div>
        </div>

        {/* Senior Pulse Dashboard */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Total Registered', value: '342', icon: Database, color: 'text-indigo-600', bg: 'bg-indigo-50' },
            { label: 'Pension Recipients', value: '280', icon: CreditCard, color: 'text-emerald-600', bg: 'bg-emerald-50' },
            { label: 'Active Monitoring', value: '115', icon: Heart, color: 'text-rose-600', bg: 'bg-rose-50' },
            { label: 'Centenarians', value: '03', icon: Cake, color: 'text-amber-600', bg: 'bg-amber-50' },
          ].map((stat, i) => (
            <motion.div key={i} variants={itemVariants}>
              <Card className="border-slate-200 shadow-sm bg-white/70 backdrop-blur-md group hover:border-indigo-100 transition-all cursor-default">
                <CardContent className="p-4 lg:p-6 flex items-center gap-4">
                  <div className={cn("p-3 rounded-2xl transition-all group-hover:scale-110 shadow-sm", stat.bg, stat.color)}>
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
                <Input placeholder="Search seniors by name or ID..." className="pl-12 h-12 rounded-xl bg-slate-50 border-none shadow-inner font-medium" />
              </div>
              <div className="flex gap-2">
                 <Button variant="outline" className="h-11 rounded-xl font-bold border-slate-200 bg-white">
                    <Filter size={18} className="mr-2" /> Sector Filter
                 </Button>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-slate-50 font-sans">
                  <TableRow className="border-none">
                    <TableHead className="py-4 text-[10px] font-black uppercase text-slate-400 tracking-widest pl-6">Full Name & Contact</TableHead>
                    <TableHead className="text-[10px] font-black uppercase text-slate-400 tracking-widest">OSCA ID</TableHead>
                    <TableHead className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Age / Purok</TableHead>
                    <TableHead className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Health Status</TableHead>
                    <TableHead className="text-[10px] font-black uppercase text-slate-400 tracking-widest text-center">Pension</TableHead>
                    <TableHead className="text-[10px] font-black uppercase text-slate-400 tracking-widest text-right pr-6">Management</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    [1,2,3].map(i => <TableRow key={i} className="animate-pulse"><TableCell colSpan={6} className="py-8"><div className="h-10 bg-slate-100 rounded-xl w-full" /></TableCell></TableRow>)
                  ) : seniors.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="py-20 text-center">
                        <div className="flex flex-col items-center gap-4 text-slate-300 font-sans font-black uppercase">
                          <Users size={48} className="opacity-10" />
                          <p className="text-xs tracking-widest italic">Senior citizen registry database is empty</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    seniors.map((senior) => (
                      <TableRow key={senior.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors group">
                        <TableCell className="py-4 pl-6">
                            <div className="flex items-center gap-4">
                               <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 font-black shadow-inner border border-white">
                                  {senior.lastName?.[0] || 'S'}
                               </div>
                               <div className="min-w-0">
                                  <p className="font-black text-slate-900 tracking-tight">{senior.lastName}, {senior.firstName}</p>
                                  <p className="text-[10px] font-bold text-slate-400 flex items-center gap-1"><Phone size={10} /> {senior.phone || '09XX-XXX-XXXX'}</p>
                               </div>
                            </div>
                        </TableCell>
                        <TableCell>
                           <span className="text-[11px] font-black text-slate-600 bg-slate-100 px-2 py-0.5 rounded tracking-tighter shadow-sm border border-white uppercase">{senior.oscaId || 'OSCA-202X'}</span>
                        </TableCell>
                        <TableCell>
                           <div className="flex flex-col">
                              <span className="text-xs font-bold text-slate-700">{senior.age || '65'} YRS OLD</span>
                              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">PUROK {senior.purok || '5'}</span>
                           </div>
                        </TableCell>
                        <TableCell>
                           <div className="flex items-center gap-2">
                              <div className={cn("w-1.5 h-1.5 rounded-full shadow-sm animate-pulse", senior.isUnderMonitoring ? "bg-rose-500" : "bg-emerald-500")} />
                              <span className="text-[10px] font-black text-slate-800 uppercase tracking-tight">{senior.isUnderMonitoring ? 'Monitoring' : 'Stable'}</span>
                           </div>
                        </TableCell>
                        <TableCell className="text-center font-sans">
                           {senior.hasPension ? (
                             <Badge className="bg-emerald-50 text-emerald-600 border-none font-bold text-[9px] uppercase px-3 shadow-none">Enrolled</Badge>
                           ) : (
                             <Badge className="bg-slate-50 text-slate-400 border-none font-bold text-[9px] uppercase px-3 shadow-none">None</Badge>
                           )}
                        </TableCell>
                        <TableCell className="text-right pr-6">
                           <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl text-slate-300 hover:text-indigo-600 transition-colors">
                                <MoreHorizontal size={18} />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48 rounded-2xl shadow-xl border-slate-100 p-1.5 backdrop-blur-md bg-white/95">
                               <DropdownMenuItem className="gap-2 font-bold text-xs rounded-xl h-10 px-3 hover:bg-slate-50"><Eye size={14} /> Full History</DropdownMenuItem>
                               <DropdownMenuItem className="gap-2 font-bold text-xs rounded-xl h-10 px-3 hover:bg-slate-50"><Stethoscope size={14} /> Medical Profile</DropdownMenuItem>
                               <DropdownMenuItem className="gap-2 font-bold text-xs rounded-xl h-10 px-3 hover:bg-slate-50 text-blue-600 focus:text-blue-700"><Edit size={14} /> Edit Data</DropdownMenuItem>
                               <DropdownMenuSeparator className="my-1 bg-slate-50" />
                               <DropdownMenuItem className="gap-2 font-bold text-xs text-red-600 rounded-xl h-10 px-3 hover:bg-red-50 focus:bg-red-50 focus:text-red-700"><Trash2 size={14} /> Remove Resident</DropdownMenuItem>
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
