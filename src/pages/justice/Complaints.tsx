import React, { useState, useEffect } from 'react';
import PortalLayout from '@/src/components/layout/PortalLayout';
import { 
  MessageSquare, Search, Plus, Filter, Download, 
  MoreHorizontal, Eye, Clock, ShieldAlert,
  Calendar, CheckCircle2, AlertCircle, FileDown,
  User, MapPin, Database
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

export default function Complaints() {
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddOpen, setIsAddOpen] = useState(false);

  useEffect(() => {
    const q = query(collection(db, 'justice_complaints'), orderBy('createdAt', 'desc'));
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
              <div className="p-3 bg-blue-50 rounded-2xl shadow-sm border border-blue-100">
                <MessageSquare className="text-blue-600 h-6 w-6 lg:h-8 lg:w-8" />
              </div>
              <div>
                <h2 className="text-2xl lg:text-3xl font-black text-slate-900 tracking-tight">Complaint Filing</h2>
                <p className="text-[10px] lg:text-xs font-bold text-slate-500 uppercase tracking-[0.2em] mt-1 italic">Katarungang Pambarangay Intake System</p>
              </div>
            </div>
          </motion.div>
          
          <motion.div variants={itemVariants} className="flex items-center gap-2">
            <Button variant="outline" className="h-11 px-4 rounded-xl border-slate-200 font-bold bg-white">
              <Download size={18} className="mr-2" /> Export Logs
            </Button>
            
            <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
              <DialogTrigger render={
                <Button className="h-11 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-900/20 font-bold text-white">
                  <Plus size={18} className="mr-2" /> New Complaint
                </Button>
              } />
              <DialogContent className="sm:max-w-[550px] border-none shadow-2xl rounded-3xl overflow-hidden font-sans">
                <div className="absolute top-0 left-0 w-full h-1.5 bg-blue-600" />
                <DialogHeader className="pt-6">
                  <DialogTitle className="text-xl font-black tracking-tight text-slate-900 text-left">File Formal Complaint</DialogTitle>
                  <DialogDescription className="font-medium text-slate-500 italic text-left tracking-tight">Initiate a legal mediation process through the Office of Lupon Tagapamayapa.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-6 py-6 font-sans">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Complainant (Nagsasakdal)</Label>
                    <Input placeholder="Full Name" className="h-12 rounded-xl bg-slate-50 border-slate-200 font-bold" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Respondent (Inirereklamo)</Label>
                    <Input placeholder="Full Name" className="h-12 rounded-xl bg-slate-50 border-slate-200 font-bold" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Subject of Complaint</Label>
                    <Input placeholder="e.g. Neighbor Dispute, Physical Injury, etc." className="h-12 rounded-xl bg-slate-50 border-slate-200 font-bold" />
                  </div>
                </div>
                <DialogFooter className="bg-slate-50 p-6 -m-6 mt-2">
                  <Button variant="ghost" onClick={() => setIsAddOpen(false)} className="rounded-xl font-bold text-slate-500">Cancel</Button>
                  <Button className="bg-blue-600 hover:bg-blue-700 rounded-xl font-black px-8 shadow-lg shadow-blue-900/20 uppercase tracking-widest text-xs h-11 text-white">File Complaint</Button>
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
                    <Input placeholder="Search complaints by name or case #" className="pl-12 h-12 rounded-xl bg-slate-50 border-none shadow-inner font-medium" />
                  </div>
                </div>
                <div className="overflow-x-auto">
                   <Table>
                    <TableHeader className="bg-slate-50 font-sans">
                      <TableRow className="border-none">
                        <TableHead className="py-4 text-[10px] font-black uppercase text-slate-400 tracking-widest pl-6">Case Summary</TableHead>
                        <TableHead className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Type</TableHead>
                        <TableHead className="text-[10px] font-black uppercase text-slate-400 tracking-widest text-right pr-6">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {records.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={3} className="py-20 text-center">
                            <div className="flex flex-col items-center gap-4 text-slate-300 font-sans font-black uppercase">
                              <Database size={48} className="opacity-10" />
                              <p className="text-xs">No active complaints found</p>
                            </div>
                          </TableCell>
                        </TableRow>
                      ) : (
                        records.map(rec => (
                          <TableRow key={rec.id} className="border-b border-slate-50 hover:bg-slate-50/50 group">
                             <TableCell className="pl-6 py-4">
                                <p className="font-black text-slate-900 tracking-tight">{rec.complainant} vs {rec.respondent}</p>
                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter mt-1">{rec.id.slice(0, 8)} • {rec.date || 'Today'}</p>
                             </TableCell>
                             <TableCell>
                                <Badge variant="secondary" className="bg-blue-50 text-blue-600 border-none font-bold text-[9px] uppercase tracking-tighter">{rec.subject || 'General'}</Badge>
                             </TableCell>
                             <TableCell className="text-right pr-6">
                                <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl text-slate-300 hover:text-blue-600 transition-colors">
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
              <Card className="border-slate-200/60 shadow-lg bg-white rounded-2xl overflow-hidden sticky top-6">
                <CardHeader className="bg-slate-950 text-white p-6">
                   <CardTitle className="text-lg font-black tracking-tight uppercase italic flex items-center gap-2">
                     <ShieldAlert size={20} className="text-blue-400" /> Intake Policy
                   </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                   <div className="space-y-4">
                     <p className="text-xs font-medium text-slate-600 leading-relaxed italic">
                       All complaints must follow the procedural steps as mandated by the Katarungang Pambarangay Law.
                     </p>
                     {[
                       'Mediation (Internal)',
                       'Conciliation (Panel)',
                       'Arbitration (Tribunal)',
                     ].map((step, i) => (
                        <div key={i} className="flex items-center gap-3">
                           <div className="h-5 w-5 rounded-full bg-blue-50 flex items-center justify-center text-[10px] font-black text-blue-600">
                             {i + 1}
                           </div>
                           <span className="text-xs font-bold text-slate-800">{step}</span>
                        </div>
                     ))}
                   </div>
                   <div className="pt-4 border-t border-slate-100">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Required Attachments</p>
                      <ul className="space-y-1.5">
                         <li className="text-[10px] font-bold text-slate-500 flex items-center gap-2">
                            <CheckCircle2 size={12} className="text-emerald-500" /> Valid Government ID
                         </li>
                         <li className="text-[10px] font-bold text-slate-500 flex items-center gap-2">
                            <CheckCircle2 size={12} className="text-emerald-500" /> Evidence (Photos/Videos)
                         </li>
                      </ul>
                   </div>
                   <Button className="w-full h-11 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-black uppercase tracking-widest text-[10px] mt-2">
                      Official Procedure Guide
                   </Button>
                </CardContent>
              </Card>
           </div>
        </div>
      </motion.div>
    </PortalLayout>
  );
}
