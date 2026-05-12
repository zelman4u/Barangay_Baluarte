import React from 'react';
import PortalLayout from '@/src/components/layout/PortalLayout';
import { Sprout, Plus, Database, TreePine, Droplets, Leaf } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export default function Environment() {
  return (
    <PortalLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-emerald-50 rounded-2xl shadow-sm border border-emerald-100">
              <Sprout className="text-emerald-600 h-6 w-6 lg:h-8 lg:w-8" />
            </div>
            <div>
              <h2 className="text-2xl lg:text-3xl font-black text-slate-900 tracking-tight text-left italic uppercase">Environmental Reporting</h2>
              <p className="text-[10px] lg:text-xs font-bold text-slate-500 uppercase tracking-[0.2em] mt-1 italic text-left tracking-widest leading-none">Natural Resource & Ecosystem Preservation</p>
            </div>
          </div>
          <Button className="h-11 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-700 shadow-lg font-bold text-white uppercase tracking-widest text-xs">
            <Plus className="mr-2 h-4 w-4" /> Log Compliance
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
           <Card className="md:col-span-3 border-slate-200 shadow-xl bg-white rounded-3xl overflow-hidden min-h-[450px] flex flex-col p-0">
               <div className="bg-slate-900 p-6 border-b border-white/5 flex items-center justify-between">
                 <h3 className="text-sm font-black text-white italic uppercase tracking-widest">Active Preserve Zones</h3>
                 <Badge className="bg-blue-500 text-white border-none text-[8px]">ECO-SENSITIVE</Badge>
               </div>
               <CardContent className="p-6">
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                   {[
                     { name: 'Tagoloan Riverbank', status: 'Protected', coverage: '4.2km', icon: Droplets, color: 'text-blue-500', bg: 'bg-blue-50' },
                     { name: 'Coastal Mangrove', status: 'Managed', coverage: '1.8km', icon: Leaf, color: 'text-emerald-500', bg: 'bg-emerald-50' },
                     { name: 'Brgy Hall Garden', status: 'Active', coverage: '200sqm', icon: Sprout, color: 'text-amber-500', bg: 'bg-amber-50' },
                     { name: 'Purok 7 Reforestation', status: 'Growing', coverage: '0.5ha', icon: TreePine, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                   ].map((zone, i) => (
                     <div key={i} className="p-5 rounded-2xl border border-slate-100 bg-slate-50/30 hover:border-emerald-200 hover:bg-emerald-50/10 transition-all group">
                       <div className="flex items-center justify-between mb-4">
                         <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", zone.bg, zone.color)}>
                           <zone.icon size={20} />
                         </div>
                         <Badge variant="outline" className="text-[8px] font-black uppercase tracking-widest border-slate-200">{zone.status}</Badge>
                       </div>
                       <h4 className="font-bold text-slate-800 text-sm mb-1">{zone.name}</h4>
                       <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Zone Area: {zone.coverage}</p>
                     </div>
                   ))}
                 </div>
                 <div className="mt-8 flex flex-col items-center justify-center py-12 border-2 border-dashed border-slate-100 rounded-3xl">
                   <Database size={40} className="text-slate-100 mb-4" />
                   <p className="text-sm font-bold text-slate-300 uppercase tracking-widest italic">Compliance Registry Entry Point</p>
                 </div>
               </CardContent>
            </Card>
           <div className="space-y-6">
              <Card className="border-none shadow-xl bg-slate-950 text-white rounded-3xl">
                 <CardHeader className="p-6">
                    <CardTitle className="text-xs font-black uppercase tracking-widest text-emerald-400 italic">Greening Benchmarks</CardTitle>
                 </CardHeader>
                 <CardContent className="p-6 pt-0 space-y-4">
                    {[
                      { key: 'Tree Count', val: '1,240' },
                      { key: 'Garden Units', val: '42' },
                    ].map((st, i) => (
                      <div key={i} className="bg-white/5 p-4 rounded-2xl border border-white/5">
                         <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{st.key}</p>
                         <p className="text-2xl font-black text-white tracking-tighter mt-1">{st.val}</p>
                      </div>
                    ))}
                    <div className="p-4 bg-emerald-600/10 rounded-2xl border border-emerald-500/20 mt-4">
                       <p className="text-[9px] font-black text-emerald-400 uppercase tracking-[0.2em] mb-2">Next Audit</p>
                       <p className="text-xs font-bold text-white italic">June 15, 2026</p>
                    </div>
                 </CardContent>
              </Card>
           </div>
        </div>
      </div>
    </PortalLayout>
  );
}
