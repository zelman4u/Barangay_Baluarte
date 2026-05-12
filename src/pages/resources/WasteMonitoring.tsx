import React from 'react';
import PortalLayout from '@/src/components/layout/PortalLayout';
import { Trash2, History, MapPin, Database } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { motion } from 'motion/react';

export default function WasteMonitoring() {
  return (
    <PortalLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-emerald-50 rounded-2xl shadow-sm border border-emerald-100">
              <Trash2 className="text-emerald-600 h-6 w-6 lg:h-8 lg:w-8" />
            </div>
            <div>
              <h2 className="text-2xl lg:text-3xl font-black text-slate-900 tracking-tight text-left italic uppercase">Waste Monitoring</h2>
              <p className="text-[10px] lg:text-xs font-bold text-slate-500 uppercase tracking-[0.2em] mt-1 italic text-left tracking-widest leading-none mt-1">Sanitation & Collection Logistics</p>
            </div>
          </div>
          <Button className="h-11 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-700 shadow-lg font-bold text-white uppercase tracking-widest text-xs">
            <MapPin className="mr-2 h-4 w-4" /> Collection Routes
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           <Card className="md:col-span-2 border-slate-200 shadow-xl bg-white rounded-3xl overflow-hidden min-h-[400px] flex flex-col p-0">
               <div className="bg-slate-900 p-4 border-b border-white/5 flex items-center justify-between">
                 <h3 className="text-sm font-black text-white italic uppercase tracking-widest">Sector Status Feed</h3>
                 <Badge className="bg-emerald-500 text-white border-none text-[8px]">LIVE UPDATES</Badge>
               </div>
               <div className="p-0 overflow-hidden">
                 <div className="divide-y divide-slate-100">
                    {[
                      { sector: 'Purok 1', collector: 'Truck A (8821)', status: 'On Route', time: '8:45 AM', color: 'text-blue-500' },
                      { sector: 'Purok 3', collector: 'Truck B (9012)', status: 'Completed', time: '7:30 AM', color: 'text-emerald-500' },
                      { sector: 'Market Area', collector: 'Compact-1', status: 'In Progress', time: 'Now', color: 'text-amber-500' },
                      { sector: 'Purok 7', collector: 'Truck A (8821)', status: 'Pending', time: '10:00 AM', color: 'text-slate-400' },
                    ].map((item, i) => (
                      <div key={i} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400">
                            <History size={14} />
                          </div>
                          <div>
                            <p className="text-xs font-black text-slate-800">{item.sector}</p>
                            <p className="text-[10px] text-slate-400 font-bold uppercase">{item.collector}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={cn("text-[9px] font-black uppercase tracking-widest mb-1", item.color)}>{item.status}</p>
                          <p className="text-[9px] text-slate-300 font-bold">{item.time}</p>
                        </div>
                      </div>
                    ))}
                 </div>
               </div>
               <div className="p-4 border-t border-slate-50 mt-auto">
                 <Button variant="ghost" className="w-full text-[10px] font-black text-slate-400 hover:text-emerald-600 uppercase tracking-widest">
                   Download Compliance Report
                 </Button>
               </div>
            </Card>
           <Card className="border-none shadow-xl bg-slate-950 text-white rounded-3xl overflow-hidden p-6">
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400 mb-6 italic">Next Collection Cycle</h4>
              <div className="space-y-6">
                 {[
                   { sector: 'Purok 1-3', day: 'Mon/Wed/Fri', status: 'Active' },
                   { sector: 'Purok 4-6', day: 'Tue/Thu/Sat', status: 'Pending' },
                   { sector: 'Coastal / Market', day: 'Daily', status: 'Active' },
                 ].map((s, i) => (
                    <div key={i} className="flex justify-between items-center bg-white/5 p-4 rounded-2xl border border-white/5">
                       <div>
                          <p className="text-xs font-black italic">{s.sector}</p>
                          <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">{s.day}</span>
                       </div>
                       <Badge variant="outline" className="border-emerald-500/50 text-emerald-500 text-[8px] uppercase tracking-widest">{s.status}</Badge>
                    </div>
                 ))}
              </div>
              <div className="mt-8 pt-6 border-t border-white/5">
                <div className="flex justify-between items-end">
                   <div>
                     <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Efficiency Rating</p>
                     <p className="text-4xl font-black text-white tracking-tighter italic">94.2%</p>
                   </div>
                   <div className="text-right">
                     <p className="text-[11px] font-bold text-emerald-400 tracking-tighter italic">+2.1% ↑</p>
                   </div>
                </div>
              </div>
           </Card>
        </div>
      </div>
    </PortalLayout>
  );
}
