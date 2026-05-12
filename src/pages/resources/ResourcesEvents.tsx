import React from 'react';
import PortalLayout from '@/src/components/layout/PortalLayout';
import { Calendar, Search, Plus, Filter, Download, Database, Info, History, MapPin } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

export default function ResourcesEvents() {
  return (
    <PortalLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-amber-50 rounded-2xl shadow-sm border border-amber-100">
              <Calendar className="text-amber-600 h-6 w-6 lg:h-8 lg:w-8" />
            </div>
            <div>
              <h2 className="text-2xl lg:text-3xl font-black text-slate-900 tracking-tight text-left italic uppercase">Event Management</h2>
              <p className="text-[10px] lg:text-xs font-bold text-slate-500 uppercase tracking-[0.2em] mt-1 italic text-left tracking-widest">DRRM Drills & Youth Assemblies</p>
            </div>
          </div>
          <Button className="h-11 px-6 rounded-xl bg-amber-600 hover:bg-amber-700 shadow-lg font-bold text-white uppercase tracking-widest text-xs">
            <Plus className="mr-2 h-4 w-4" /> Schedule Event
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
           <Card className="md:col-span-3 border-slate-200 shadow-xl bg-white rounded-3xl overflow-hidden min-h-[500px] flex flex-col items-center justify-center text-center">
              <Calendar size={64} className="text-slate-100 mb-6" />
              <h3 className="text-xl font-black text-slate-300 italic uppercase">Upcoming Assemblies</h3>
              <p className="text-sm font-medium text-slate-400 mt-2 max-w-xs mx-auto italic">Strategic calendar for barangay-wide disaster drills and youth leadership summits.</p>
           </Card>
           <div className="space-y-6">
              <Card className="border-none shadow-xl bg-slate-900 text-white rounded-3xl overflow-hidden p-6">
                 <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-500 mb-4 italic">Next 48 Hours</h4>
                 <div className="space-y-4">
                    <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                       <p className="text-xs font-black italic">No events scheduled.</p>
                    </div>
                 </div>
              </Card>
           </div>
        </div>
      </div>
    </PortalLayout>
  );
}
