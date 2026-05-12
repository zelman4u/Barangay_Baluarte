import React from 'react';
import PortalLayout from '@/src/components/layout/PortalLayout';
import { MapPin, Search, Plus, Map, Info, Database, Compass, Navigation } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { motion } from 'motion/react';

import { cn } from '@/lib/utils';

export default function Evacuation() {
  return (
    <PortalLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-50 rounded-2xl shadow-sm border border-blue-100">
              <MapPin className="text-blue-600 h-6 w-6 lg:h-8 lg:w-8" />
            </div>
            <div>
              <h2 className="text-2xl lg:text-3xl font-black text-slate-900 tracking-tight text-left italic">Evacuation Monitoring</h2>
              <p className="text-[10px] lg:text-xs font-bold text-slate-500 uppercase tracking-[0.2em] mt-1 italic text-left">Safe Zone & Shelter Management</p>
            </div>
          </div>
          <Button className="h-11 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 shadow-lg font-bold text-white uppercase tracking-widest text-xs">
            <Map className="mr-2 h-4 w-4" /> Live Evac Map
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           {[
             { name: 'Baluarte Covered Court', status: 'Available', capacity: '300/500', color: 'bg-emerald-500' },
             { name: 'Elementary School Hall', status: 'Ready', capacity: '0/200', color: 'bg-blue-500' },
             { name: 'Brgy Hall Annex', status: 'Full', capacity: '50/50', color: 'bg-amber-500' },
           ].map((center, i) => (
             <Card key={i} className="border-slate-200 shadow-xl rounded-3xl overflow-hidden hover:scale-[1.02] transition-transform">
                <CardHeader className="bg-slate-50 p-6 border-b border-slate-100 flex flex-row items-center justify-between">
                   <Badge variant="outline" className="border-slate-200 text-slate-400 font-black uppercase text-[9px] tracking-widest h-5 px-2">{center.status}</Badge>
                   <Compass size={16} className="text-slate-300" />
                </CardHeader>
                <CardContent className="p-6">
                   <h3 className="text-lg font-black text-slate-900 tracking-tight mb-2 leading-none uppercase italic">{center.name}</h3>
                   <div className="flex justify-between items-end mt-6">
                      <div className="space-y-1">
                         <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">Occupancy Load</p>
                         <p className="text-xl font-black text-slate-900 tracking-tighter leading-none">{center.capacity}</p>
                      </div>
                      <div className="h-8 w-8 rounded-xl bg-slate-900 flex items-center justify-center text-white">
                         <Navigation size={14} />
                      </div>
                   </div>
                   <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden mt-6">
                      <div className={cn("h-full rounded-full", center.color)} style={{ width: center.status === 'Full' ? '100%' : '60%' }} />
                   </div>
                </CardContent>
             </Card>
           ))}
        </div>

        <Card className="border-slate-200 shadow-2xl bg-white rounded-3xl overflow-hidden">
           <div className="p-32 flex flex-col items-center justify-center text-center">
              <Database size={64} className="text-slate-100 mb-6" />
              <h3 className="text-xl font-black text-slate-300 italic uppercase">Evacuation Master List</h3>
              <p className="text-sm font-medium text-slate-400 mt-2 max-w-xs mx-auto italic">Database connection active. No residents currently checked into emergency shelters.</p>
           </div>
        </Card>
      </div>
    </PortalLayout>
  );
}
