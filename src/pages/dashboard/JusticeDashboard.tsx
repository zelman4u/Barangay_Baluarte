import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import PortalLayout from '@/src/components/layout/PortalLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Scale, Plus, Search, Calendar, Filter, FileDown, 
  ShieldAlert, Clock, CheckCircle2, History, MessageSquare, AlertCircle, Trash2
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { jsPDF } from 'jspdf';
import ModulePlaceholder from '@/src/components/shared/ModulePlaceholder';
import { motion, AnimatePresence } from 'motion/react';
import { collection, query, onSnapshot, limit, orderBy } from 'firebase/firestore';
import { db } from '@/src/lib/firebase';

export default function JusticeDashboard() {
  const location = useLocation();
  const [cases, setCases] = useState<any[]>([]);
  const [incidents, setIncidents] = useState<any[]>([]);

  useEffect(() => {
    // Fetch recent cases
    const qCases = query(collection(db, 'cases'), limit(5));
    const unsubCases = onSnapshot(qCases, (snapshot) => {
      setCases(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    // Fetch recent incidents
    const qInc = query(collection(db, 'incidents'), limit(4));
    const unsubInc = onSnapshot(qInc, (snapshot) => {
      setIncidents(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    return () => {
      unsubCases();
      unsubInc();
    };
  }, []);

  const generateSummons = (caseData: any) => {
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(10);
    doc.text('Republic of the Philippines', 105, 20, { align: 'center' });
    doc.text('Province of Cavite', 105, 25, { align: 'center' });
    doc.text('Municipality of Tanza', 105, 30, { align: 'center' });
    doc.setFont("helvetica", "bold");
    doc.text('BARANGAY BALUARTE', 105, 35, { align: 'center' });
    
    doc.setFontSize(14);
    doc.text('OFFICE OF THE LUPON TAGAPAMAYAPA', 105, 50, { align: 'center' });
    
    doc.setFontSize(18);
    doc.text('SUMMONS (PATAWAG)', 105, 65, { align: 'center' });
    
    // Case Info
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(`Case No: ${caseData.id}`, 20, 80);
    doc.text(`Subject: ${caseData.title}`, 20, 90);
    
    // Content
    doc.text(`To: ${caseData.partyB}`, 20, 110);
    doc.text('(Respondent)', 20, 115);
    
    const message = `You are hereby summoned to appear before me in person, together with your witnesses, if any, for a mediation/conciliation of your dispute with ${caseData.partyA} (Complainant) at the Barangay Hall on:`;
    
    const splitMessage = doc.splitTextToSize(message, 170);
    doc.text(splitMessage, 20, 130);
    
    doc.setFont("helvetica", "bold");
    doc.text(`DATE: ${caseData.date}`, 105, 155, { align: 'center' });
    doc.text(`TIME: 9:00 AM`, 105, 162, { align: 'center' });
    
    doc.setFont("helvetica", "normal");
    doc.text('Failure to comply with this summons may result in legal consequences as provided by the Local Government Code of 1991.', 20, 180, { maxWidth: 170 });
    
    // Footer
    doc.text('__________________________', 140, 230);
    doc.text('Barangay Secretary / Lupon', 140, 235);
    doc.text('Attested by:', 20, 230);
    doc.setFont("helvetica", "bold");
    doc.text('HON. JUAN M. BALUARTE', 20, 245);
    doc.setFontSize(10);
    doc.text('Barangay Captain', 20, 250);

    doc.save(`Summons_${caseData.id}.pdf`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Resolved': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'Mediation': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Conciliation': return 'bg-amber-100 text-amber-700 border-amber-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

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
        className="space-y-6 lg:space-y-8"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <motion.div variants={itemVariants}>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-50 rounded-2xl">
                <Scale className="text-blue-600 h-6 w-6 lg:h-8 lg:w-8" />
              </div>
              <div>
                <h2 className="text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight italic uppercase">Lupon Tribunal</h2>
                <p className="text-xs lg:text-sm font-medium text-slate-500 mt-1 tracking-widest uppercase">Katarungang Pambarangay Management</p>
              </div>
            </div>
          </motion.div>
          <motion.div variants={itemVariants} className="flex gap-2">
            <Button className="bg-blue-600 hover:bg-blue-700 font-bold shadow-lg shadow-blue-600/20">
              <Plus className="mr-2 h-4 w-4" /> File New Complaint
            </Button>
          </motion.div>
        </div>

        {/* Justice Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {[
            { label: 'Active Cases', value: '12', icon: Clock, color: 'text-blue-600', bg: 'bg-blue-50', trend: '8 Mediation' },
            { label: 'Resolutions', value: '85%', icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50', trend: '+12% MoM' },
            { label: 'Today\'s Hear', value: '4', icon: Calendar, color: 'text-amber-600', bg: 'bg-amber-50', trend: 'Brgy Hall' },
            { label: 'BPSO Alerts', value: '7', icon: ShieldAlert, color: 'text-red-600', bg: 'bg-red-50', trend: 'Sensitive' },
          ].map((stat, i) => (
            <motion.div key={i} variants={itemVariants}>
              <Card className="hover:shadow-lg transition-all border-slate-200 overflow-hidden group h-full">
                <CardContent className="pt-6">
                  <div className="flex flex-col">
                    <div className={`${stat.bg} ${stat.color} w-10 h-10 rounded-xl flex items-center justify-center mb-4`}>
                      <stat.icon size={20} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">{stat.label}</p>
                      <p className="text-2xl font-black text-slate-900 mt-1 tracking-tighter leading-none">{stat.value}</p>
                      <p className="text-[9px] font-bold text-slate-400 mt-2 uppercase">{stat.trend}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 space-y-6">
            <motion.div variants={itemVariants}>
              <Card className="border-slate-200 shadow-sm overflow-hidden bg-white">
                <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-slate-50">
                   <div>
                    <CardTitle className="text-lg font-bold tracking-tight">Active Mediation Queue</CardTitle>
                    <CardDescription className="text-xs">Cases awaiting resolution through Lupon Tagapamayapa</CardDescription>
                  </div>
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
                    <Input placeholder="Search case..." className="pl-8 h-8 w-[150px] lg:w-[250px] text-xs font-medium bg-slate-50 border-none" />
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader className="bg-slate-50/50">
                      <TableRow className="hover:bg-transparent border-none">
                        <TableHead className="text-[10px] font-black uppercase tracking-widest h-10">Case Title</TableHead>
                        <TableHead className="text-[10px] font-black uppercase tracking-widest h-10">Parties</TableHead>
                        <TableHead className="text-[10px] font-black uppercase tracking-widest h-10">Status</TableHead>
                        <TableHead className="text-[10px] font-black uppercase tracking-widest h-10 text-right">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {cases.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={4} className="h-40 text-center text-slate-400 text-sm font-medium">
                            No active cases found in the mediation queue.
                          </TableCell>
                        </TableRow>
                      ) : (
                        cases.map((c) => (
                          <TableRow key={c.id} className="hover:bg-slate-50/50 transition-colors">
                            <TableCell>
                              <div>
                                <p className="text-sm font-bold text-slate-900 leading-none">{c.title}</p>
                                <p className="text-[10px] text-slate-400 font-bold mt-1.5 uppercase tracked-widest">#{c.id.slice(0, 8)}</p>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex flex-col gap-1">
                                <span className="text-xs font-medium text-slate-700">{c.partyA || 'Unknown'}</span>
                                <span className="text-[10px] text-slate-400 font-bold text-center w-fit border border-slate-100 px-1">VS</span>
                                <span className="text-xs font-medium text-slate-700">{c.partyB || 'Unknown'}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge className={`${getStatusColor(c.status || 'Filed')} text-[10px] font-black uppercase tracking-tighter px-2 border-none shadow-sm`}>
                                {c.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <Button variant="outline" size="sm" onClick={() => generateSummons(c)} className="h-8 text-[10px] font-black uppercase tracking-widest border-blue-100 text-blue-600 hover:bg-blue-50 bg-white">
                                <FileDown size={14} className="mr-1" /> Patawag
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          <aside className="lg:col-span-4 space-y-6">
            {/* Quick Record */}
            <motion.div variants={itemVariants}>
              <Card className="border-slate-800 bg-slate-900 text-white overflow-hidden shadow-2xl relative h-full">
                <div className="absolute top-0 right-0 p-4 opacity-20">
                  <ShieldAlert size={80} />
                </div>
                <CardHeader className="pb-2 relative">
                  <CardTitle className="text-lg font-black tracking-tight uppercase italic flex items-center gap-2">
                    <Plus className="text-blue-400" /> Blotter Log
                  </CardTitle>
                  <CardDescription className="text-slate-400 text-xs font-bold uppercase tracking-widest">REAL-TIME INCIDENT REPORTING</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 pt-4">
                  <AnimatePresence>
                    {incidents.slice(0, 3).map((inc, i) => (
                      <motion.div 
                        key={inc.id || i}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-white/5 border border-white/10 p-3 rounded-xl backdrop-blur-sm group hover:bg-white/10 transition-colors"
                      >
                        <div className="flex justify-between items-start mb-2">
                           <Badge className={`bg-${inc.severity === 'High' ? 'red' : 'blue'}-500/20 text-${inc.severity === 'High' ? 'red' : 'blue'}-400 text-[9px] font-black uppercase border-none`}>
                             {inc.severity || 'Normal'}
                           </Badge>
                           <span className="text-[10px] text-slate-500 font-bold">2m ago</span>
                        </div>
                        <h4 className="text-sm font-bold text-white leading-tight mb-1">{inc.type || 'General Incident'}</h4>
                        <p className="text-[11px] text-slate-400 leading-normal line-clamp-2">{inc.description}</p>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  <Button className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black uppercase tracking-widest text-xs h-11 rounded-xl shadow-lg shadow-blue-900/40">
                    File Blotter Report
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            {/* Archives Section */}
            <motion.div variants={itemVariants}>
              <Card className="border-slate-200 shadow-sm border-t-4 border-t-emerald-500">
                <CardHeader className="pb-3">
                  <CardTitle className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center justify-between">
                    Mediation Archives <History size={14} />
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { title: 'Neighbor Dispute #02', date: 'Oct 12' },
                    { title: 'Fence Misalignment', date: 'Sep 28' },
                    { title: 'Public Disturbance', date: 'Sep 15' },
                  ].map((arch, i) => (
                    <div key={i} className="flex items-center justify-between group cursor-pointer">
                      <div className="flex items-center gap-3">
                        <MessageSquare size={14} className="text-slate-300 group-hover:text-emerald-500 transition-colors" />
                        <span className="text-xs font-bold text-slate-700 group-hover:text-slate-900">{arch.title}</span>
                      </div>
                      <span className="text-[10px] font-black text-slate-300 uppercase italic">{arch.date}</span>
                    </div>
                  ))}
                  <Button variant="ghost" className="w-full text-[10px] font-black text-slate-400 hover:text-emerald-600 uppercase tracking-widest mt-4">
                    Visual Archive Library
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </aside>
        </div>
      </motion.div>
    </PortalLayout>
  );
}
