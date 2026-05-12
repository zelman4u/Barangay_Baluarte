import React, { useState, useEffect } from 'react';
import PortalLayout from '@/src/components/layout/PortalLayout';
import { 
  AlertCircle, Search, Plus, Filter, Download, 
  MapPin, Clock, PhoneCall, Zap,
  Navigation, CheckCircle2, Siren,
  Database, Info, AlertTriangle, ShieldCheck
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { collection, query, onSnapshot, orderBy, limit } from 'firebase/firestore';
import { db } from '@/src/lib/firebase';
import { motion } from 'motion/react';

import { cn } from '@/lib/utils';

export default function Emergency() {
  const [loading, setLoading] = useState(true);

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
              <div className="p-3 bg-rose-50 rounded-2xl shadow-sm border border-rose-100">
                <Siren className="text-rose-600 h-6 w-6 lg:h-8 lg:w-8 animate-pulse" />
              </div>
              <div>
                <h2 className="text-2xl lg:text-3xl font-black text-slate-900 tracking-tight text-left uppercase italic">Emergency Dispatch</h2>
                <p className="text-[10px] lg:text-xs font-bold text-slate-500 uppercase tracking-[0.2em] mt-1 italic text-left">Real-Time First-Response Coordination</p>
              </div>
            </div>
          </motion.div>
          
          <motion.div variants={itemVariants} className="flex gap-2">
            <Button className="h-11 px-6 rounded-xl bg-slate-900 text-white font-black uppercase tracking-widest text-xs hover:bg-slate-800 shadow-xl">
               Dispatch Unit
            </Button>
            <Button className="h-11 px-6 rounded-xl bg-rose-600 text-white font-black uppercase tracking-widest text-xs hover:bg-rose-700 shadow-xl shadow-rose-900/20">
               Broadcast Panic Alert
            </Button>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
           <motion.div variants={itemVariants} className="lg:col-span-2">
              <Card className="border-slate-800 bg-slate-950 text-white shadow-2xl rounded-2xl overflow-hidden h-full">
                 <CardHeader className="border-b border-white/5 p-6 flex flex-row items-center justify-between">
                    <div>
                       <CardTitle className="text-sm font-black tracking-widest uppercase text-rose-500 italic">Active Distress Signals</CardTitle>
                       <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter mt-1 italic">Requiring Immediate Intervention</p>
                    </div>
                    <Badge variant="outline" className="border-rose-500/50 text-rose-500 bg-rose-500/10 font-black animate-pulse uppercase text-[9px] tracking-widest">0 Live Calls</Badge>
                 </CardHeader>
                 <CardContent className="p-0">
                    <div className="py-32 flex flex-col items-center justify-center text-center px-6">
                       <Zap size={64} className="text-slate-800 opacity-20 mb-6" />
                       <h3 className="text-xl font-black italic tracking-tighter text-slate-600 uppercase">Perimeter Secure</h3>
                       <p className="text-xs font-medium text-slate-500 mt-2 max-w-xs mx-auto italic">No active distress calls detected from mobile panic buttons or landline hotline.</p>
                    </div>
                 </CardContent>
              </Card>
           </motion.div>
           <motion.div variants={itemVariants} className="space-y-6">
              <Card className="border-slate-200 shadow-lg bg-white rounded-2xl overflow-hidden">
                 <CardHeader className="bg-rose-600 text-white p-6">
                    <CardTitle className="text-xs font-black uppercase tracking-[0.2em] flex items-center gap-2">
                       <PhoneCall size={16} /> 24/7 Hotline Status
                    </CardTitle>
                 </CardHeader>
                 <CardContent className="p-6 space-y-4">
                    {[
                      { channel: 'Barangay Radio', active: true, load: 'Low' },
                      { channel: 'Tanza Police', active: true, load: 'Idle' },
                      { channel: 'Red Cross', active: false, load: 'Out' },
                    ].map((ch, i) => (
                      <div key={i} className="flex justify-between items-center bg-slate-50 p-3 rounded-xl border border-slate-100">
                         <div>
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest italic leading-none">{ch.channel}</p>
                            <p className={cn("text-sm font-black mt-1", ch.active ? 'text-slate-900 font-black tracking-tight' : 'text-slate-300 line-through')}>Connected</p>
                         </div>
                         <Badge variant="outline" className={cn("text-[8px] font-black uppercase tracking-widest border-none bg-white", ch.active ? 'text-emerald-500' : 'text-slate-300')}>{ch.load}</Badge>
                      </div>
                    ))}
                    <div className="pt-4 border-t border-slate-100">
                       <p className="text-[9px] font-black text-rose-600 uppercase tracking-widest mb-2 italic">Standard Response Time</p>
                       <div className="flex items-end justify-between font-black tracking-tighter">
                          <span className="text-4xl text-slate-900 leading-none">3.5</span>
                          <span className="text-sm text-slate-400 uppercase">Minutes</span>
                       </div>
                    </div>
                 </CardContent>
              </Card>
           </motion.div>
        </div>
      </motion.div>
    </PortalLayout>
  );
}
