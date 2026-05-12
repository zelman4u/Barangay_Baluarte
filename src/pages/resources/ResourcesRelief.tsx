import React from 'react';
import PortalLayout from '@/src/components/layout/PortalLayout';
import { Package, Plus, Database, Truck, Box, ClipboardList, CheckCircle2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export default function ResourcesRelief() {
  return (
    <PortalLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-50 rounded-2xl shadow-sm border border-blue-100">
              <Package className="text-blue-600 h-6 w-6 lg:h-8 lg:w-8" />
            </div>
            <div>
              <h2 className="text-2xl lg:text-3xl font-black text-slate-900 tracking-tight text-left italic uppercase">Relief Distribution</h2>
              <p className="text-[10px] lg:text-xs font-bold text-slate-500 uppercase tracking-[0.2em] mt-1 italic text-left tracking-widest leading-none mt-1">Emergency Goods & Supply Logistics</p>
            </div>
          </div>
          <Button className="h-11 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 shadow-lg font-bold text-white uppercase tracking-widest text-xs">
            <Plus className="mr-2 h-4 w-4" /> New Distribution
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
           <Card className="md:col-span-3 border-slate-200 shadow-xl bg-white rounded-3xl overflow-hidden min-h-[500px] flex flex-col p-0">
               <div className="bg-slate-900 p-6 border-b border-white/5 flex items-center justify-between">
                 <h3 className="text-sm font-black text-white italic uppercase tracking-widest">Ongoing Distributions</h3>
                 <Badge className="bg-blue-500 text-white border-none text-[8px]">ACTIVE OPERATIONS</Badge>
               </div>
               <CardContent className="p-0">
                 <div className="divide-y divide-slate-100">
                    {[
                      { purok: 'Purok 7 (Coastal)', target: '120 Households', item: 'Food Packs', status: 'In Transit', progress: 40, icon: Truck, color: 'text-amber-500' },
                      { purok: 'Purok 2 (Poblacion)', target: '85 Families', item: 'Hygiene Kits', status: 'Distributing', progress: 85, icon: Box, color: 'text-blue-500' },
                      { purok: 'Purok 5', target: '210 Residents', item: 'Rice Allocation', status: 'Scheduled', progress: 0, icon: ClipboardList, color: 'text-slate-400' },
                      { purok: 'Purok 1', target: '94 Households', item: 'Food Packs', status: 'Completed', progress: 100, icon: CheckCircle2, color: 'text-emerald-500' },
                    ].map((dist, i) => (
                      <div key={i} className="p-6 hover:bg-slate-50 transition-colors group">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                           <div className="flex items-center gap-4">
                              <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 bg-slate-100", dist.color)}>
                                 <dist.icon size={22} />
                              </div>
                              <div>
                                 <h4 className="font-black text-slate-900 border-b border-slate-100 pb-1 mb-1">{dist.purok}</h4>
                                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{dist.target} • {dist.item}</p>
                              </div>
                           </div>
                           <div className="text-right">
                              <Badge className={cn("border-none text-[9px] font-black uppercase tracking-widest", dist.status === 'Completed' ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-600')}>
                                 {dist.status}
                              </Badge>
                           </div>
                        </div>
                        <div className="space-y-2">
                           <div className="flex justify-between text-[9px] font-black uppercase tracking-widest text-slate-400">
                              <span>Distribution Progress</span>
                              <span>{dist.progress}%</span>
                           </div>
                           <div className="h-2 bg-slate-100 rounded-full overflow-hidden shadow-inner">
                              <div 
                                 className={cn("h-full rounded-full transition-all duration-1000", dist.progress === 100 ? 'bg-emerald-500' : 'bg-blue-500')} 
                                 style={{ width: `${dist.progress}%` }} 
                              />
                           </div>
                        </div>
                      </div>
                    ))}
                 </div>
               </CardContent>
            </Card>
           <div className="space-y-6">
              <Card className="border-none shadow-xl bg-slate-950 text-white rounded-3xl overflow-hidden p-6">
                 <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400 mb-6 italic underline underline-offset-8">Warehousing Status</h4>
                 <div className="space-y-4">
                    {[
                      { item: 'Rice Sacks', val: '124', unit: 'Sacks' },
                      { item: 'Canned Goods', val: '2,420', unit: 'Cans' },
                      { item: 'Hygiene Kits', val: '315', unit: 'Kits' },
                      { item: 'Bottle Water', val: '1,800', unit: 'Units' },
                    ].map((s, i) => (
                      <div key={i} className="flex justify-between items-end border-b border-white/5 pb-4">
                         <div>
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-none mb-1">{s.item}</p>
                            <p className="text-xl font-black text-white leading-none">{s.val}</p>
                         </div>
                         <span className="text-[9px] font-bold text-slate-600 uppercase italic">{s.unit}</span>
                      </div>
                    ))}
                 </div>
                 <Button variant="ghost" className="w-full text-[10px] font-black uppercase tracking-widest text-blue-400 mt-6 hover:bg-white/5">
                    Audit Inventory Feed
                 </Button>
              </Card>
           </div>
        </div>
      </div>
    </PortalLayout>
  );
}
