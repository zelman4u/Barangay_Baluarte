import React, { useState, useEffect } from 'react';
import PortalLayout from '@/src/components/layout/PortalLayout';
import { 
  Shield, Search, Plus, Filter, Download, 
  MoreHorizontal, MapPin, Clock, Users,
  CheckCircle2, AlertCircle, FileDown,
  Database, Navigation, Zap, Calendar, Pencil, Trash2
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  collection, query, onSnapshot, orderBy, 
  addDoc, updateDoc, deleteDoc, doc, serverTimestamp 
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '@/src/lib/firebase';
import { motion } from 'motion/react';

import { cn } from '@/lib/utils';
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter 
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from '@/components/ui/select';

export default function Patrol() {
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingDoc, setEditingDoc] = useState<any>(null);
  const [formData, setFormData] = useState({
    zone: '',
    shift: 'MORNING SHIFT',
    team: 'BPSO-ALPHA',
    status: 'Scheduled',
    startTime: '06:00',
    endTime: '14:00'
  });

  useEffect(() => {
    const q = query(collection(db, 'patrol_schedules'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setRecords(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const filteredRecords = records.filter(rec => 
    rec.zone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    rec.team?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    rec.shift?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingDoc) {
        await updateDoc(doc(db, 'patrol_schedules', editingDoc.id), {
          ...formData,
          updatedAt: serverTimestamp()
        });
      } else {
        await addDoc(collection(db, 'patrol_schedules'), {
          ...formData,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
      }
      setIsDialogOpen(false);
      setEditingDoc(null);
      resetForm();
    } catch (error) {
      handleFirestoreError(error, editingDoc ? OperationType.UPDATE : OperationType.CREATE, 'patrol_schedules');
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this patrol schedule?')) {
      try {
        await deleteDoc(doc(db, 'patrol_schedules', id));
      } catch (error) {
        handleFirestoreError(error, OperationType.DELETE, 'patrol_schedules');
      }
    }
  };

  const handleEdit = (rec: any) => {
    setEditingDoc(rec);
    setFormData({
      zone: rec.zone || '',
      shift: rec.shift || 'MORNING SHIFT',
      team: rec.team || 'BPSO-ALPHA',
      status: rec.status || 'Scheduled',
      startTime: rec.startTime || '06:00',
      endTime: rec.endTime || '14:00'
    });
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      zone: '',
      shift: 'MORNING SHIFT',
      team: 'BPSO-ALPHA',
      status: 'Scheduled',
      startTime: '06:00',
      endTime: '14:00'
    });
  };

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
                <Shield className="text-emerald-600 h-6 w-6 lg:h-8 lg:w-8" />
              </div>
              <div>
                <h2 className="text-2xl lg:text-3xl font-black text-slate-900 tracking-tight text-left">Patrol Scheduling</h2>
                <p className="text-[10px] lg:text-xs font-bold text-slate-500 uppercase tracking-[0.2em] mt-1 italic text-left">BPSO & Tanod Deployment Matrix</p>
              </div>
            </div>
          </motion.div>
          
          <motion.div variants={itemVariants} className="flex items-center gap-2">
            <Button variant="outline" className="h-11 px-6 rounded-xl border-slate-200 font-bold bg-white text-slate-700">
              <Calendar className="mr-2 h-4 w-4" /> Shift View
            </Button>
            <Button 
              onClick={() => setIsDialogOpen(true)}
              className="h-11 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-900/20 font-bold text-white"
            >
              <Plus size={18} className="mr-2" /> Assign Patrol
            </Button>
            
            <Dialog open={isDialogOpen} onOpenChange={(open) => {
              setIsDialogOpen(open);
              if (!open) {
                setEditingDoc(null);
                resetForm();
              }
            }}>
              <DialogContent className="sm:max-w-[425px] rounded-2xl">
                <DialogHeader>
                  <DialogTitle className="text-xl font-black italic">{editingDoc ? 'Edit Patrol Assignment' : 'Assign New Patrol'}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label className="text-xs font-black uppercase tracking-widest text-slate-400">Deployment Zone</Label>
                    <Input 
                      placeholder="e.g. Purok 1 & 2" 
                      value={formData.zone}
                      onChange={(e) => setFormData({...formData, zone: e.target.value})}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-xs font-black uppercase tracking-widest text-slate-400">Shift</Label>
                      <Select value={formData.shift} onValueChange={(val) => setFormData({...formData, shift: val})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select shift" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="MORNING SHIFT">Morning Shift</SelectItem>
                          <SelectItem value="AFTERNOON SHIFT">Afternoon Shift</SelectItem>
                          <SelectItem value="NIGHT SHIFT">Night Shift</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs font-black uppercase tracking-widest text-slate-400">Team</Label>
                      <Select value={formData.team} onValueChange={(val) => setFormData({...formData, team: val})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select team" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="BPSO-ALPHA">BPSO-Alpha</SelectItem>
                          <SelectItem value="BPSO-BRAVO">BPSO-Bravo</SelectItem>
                          <SelectItem value="BPSO-CHARLIE">BPSO-Charlie</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-xs font-black uppercase tracking-widest text-slate-400">Start Time</Label>
                      <Input 
                        type="time" 
                        value={formData.startTime}
                        onChange={(e) => setFormData({...formData, startTime: e.target.value})}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs font-black uppercase tracking-widest text-slate-400">End Time</Label>
                      <Input 
                        type="time" 
                        value={formData.endTime}
                        onChange={(e) => setFormData({...formData, endTime: e.target.value})}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-black uppercase tracking-widest text-slate-400">Status</Label>
                    <Select value={formData.status} onValueChange={(val) => setFormData({...formData, status: val})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Scheduled">Scheduled</SelectItem>
                        <SelectItem value="On Route">On Route</SelectItem>
                        <SelectItem value="Completed">Completed</SelectItem>
                        <SelectItem value="Cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <DialogFooter>
                    <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 font-bold">
                      {editingDoc ? 'Update Assignment' : 'Confirm Assignment'}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           <div className="md:col-span-2">
              <Card className="border-slate-200/60 shadow-xl bg-white rounded-2xl font-sans overflow-hidden">
                <div className="p-4 lg:p-6 border-b border-slate-100 bg-slate-50/30 flex items-center justify-between">
                   <div className="relative max-w-sm w-full">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input 
                      placeholder="Search ongoing patrols..." 
                      className="pl-12 h-11 rounded-xl bg-white border-slate-200 shadow-sm font-medium" 
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
                <div className="overflow-x-auto">
                   <Table>
                    <TableHeader className="bg-slate-50/50">
                      <TableRow className="border-none">
                        <TableHead className="py-4 text-[10px] font-black uppercase text-slate-400 tracking-widest pl-6">Deployment Zone</TableHead>
                        <TableHead className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Patrol Team</TableHead>
                        <TableHead className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Shift Time</TableHead>
                        <TableHead className="text-[10px] font-black uppercase text-slate-400 tracking-widest text-right pr-6">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                     <TableBody>
                      {filteredRecords.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} className="py-24 text-center">
                            <div className="flex flex-col items-center gap-4 text-slate-300">
                              <Navigation size={48} className="opacity-10 animate-bounce" />
                              <p className="text-xs font-black uppercase tracking-[0.2em]">
                                {searchTerm ? 'No patrols matching your search' : 'All patrols are currently stationed'}
                              </p>
                            </div>
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredRecords.map(rec => (
                          <TableRow 
                            key={rec.id} 
                            className="border-b border-slate-50 hover:bg-slate-50/30 transition-colors group cursor-pointer"
                            onClick={() => handleEdit(rec)}
                          >
                             <TableCell className="pl-6 py-5">
                                <div className="flex items-center gap-2">
                                   <MapPin size={16} className="text-emerald-500" />
                                   <p className="font-extrabold text-slate-900 tracking-tight text-base leading-none">{rec.zone || 'Purok 1 & 2'}</p>
                                </div>
                             </TableCell>
                             <TableCell>
                                <div className="flex items-center gap-2">
                                   <Badge variant="outline" className="border-slate-200 font-black text-[9px] uppercase">{rec.team || 'BPSO-ALPHA'}</Badge>
                                </div>
                             </TableCell>
                             <TableCell>
                                <span className="text-[11px] font-black text-slate-500 uppercase tracking-widest">{rec.shift || 'NIGHT SHIFT'}</span>
                                <p className="text-[9px] font-bold text-slate-400 mt-0.5">{rec.startTime || '22:00'} - {rec.endTime || '06:00'}</p>
                             </TableCell>
                             <TableCell className="text-right pr-6">
                                <div className="flex items-center justify-end gap-3">
                                  <Badge className={cn(
                                    "border-none font-black text-[9px] uppercase px-3 shadow-lg",
                                    rec.status === 'On Route' ? "bg-emerald-500 text-white shadow-emerald-500/20" :
                                    rec.status === 'Scheduled' ? "bg-amber-500 text-white shadow-amber-500/20" :
                                    rec.status === 'Completed' ? "bg-blue-500 text-white shadow-blue-500/20" :
                                    "bg-slate-500 text-white shadow-slate-500/20"
                                  )}>{rec.status || 'On Route'}</Badge>
                                  
                                  <div className="flex items-center gap-1">
                                    <Button 
                                      variant="ghost" 
                                      size="icon" 
                                      className="h-8 w-8 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all" 
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleEdit(rec);
                                      }}
                                    >
                                      <Pencil size={14} />
                                    </Button>
                                    <Button 
                                      variant="ghost" 
                                      size="icon" 
                                      className="h-8 w-8 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all" 
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleDelete(rec.id);
                                      }}
                                    >
                                      <Trash2 size={14} />
                                    </Button>
                                  </div>
                                </div>
                             </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                   </Table>
                </div>
              </Card>
           </div>
           <div className="space-y-6">
              <Card className="border-none shadow-xl bg-slate-950 text-white rounded-2xl overflow-hidden relative">
                 <div className="absolute top-0 right-0 p-4 opacity-10">
                    <Shield size={100} />
                 </div>
                 <CardHeader className="p-6">
                    <CardTitle className="text-xs font-black uppercase tracking-[0.3em] text-emerald-400 italic">Global Deployment Status</CardTitle>
                 </CardHeader>
                 <CardContent className="p-6 pt-0 space-y-6">
                    <div className="space-y-4">
                       {[
                         { area: 'Town Proper', load: 90 },
                         { area: 'Coastal Road', load: 45 },
                         { area: 'Market Perimeter', load: 100 },
                       ].map((area, i) => (
                          <div key={i} className="space-y-2">
                             <div className="flex justify-between text-[10px] font-bold">
                                <span className="text-slate-400 uppercase tracking-widest">{area.area}</span>
                                <span className="text-emerald-400 font-black">{area.load}% Cover</span>
                             </div>
                             <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                                <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${area.load}%` }} />
                             </div>
                          </div>
                       ))}
                    </div>
                    <Button variant="ghost" className="w-full text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 hover:text-white border border-white/5 bg-white/5 mt-4">
                       Optimize Patrol Routes
                    </Button>
                 </CardContent>
              </Card>

              <Card className="border-slate-200/60 shadow-lg bg-white rounded-2xl overflow-hidden">
                 <CardHeader className="p-4 border-b border-slate-50">
                    <CardTitle className="text-[10px] font-black uppercase text-slate-400 tracking-widest flex items-center gap-2 italic">
                       <Zap size={14} className="text-amber-500" /> Active Response Units
                    </CardTitle>
                 </CardHeader>
                 <CardContent className="p-4 space-y-3">
                    {[
                      { callsign: 'BPSO-BRAVO', status: 'Engaged', color: 'text-amber-500' },
                      { callsign: 'BPSO-ALPHA', status: 'Standby', color: 'text-emerald-500' },
                    ].map((unit, i) => (
                      <div key={i} className="flex items-center justify-between bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                         <span className="text-xs font-black text-slate-900">{unit.callsign}</span>
                         <span className={cn("text-[9px] font-black uppercase tracking-widest", unit.color)}>{unit.status}</span>
                      </div>
                    ))}
                 </CardContent>
              </Card>
           </div>
        </div>
      </motion.div>
    </PortalLayout>
  );
}
