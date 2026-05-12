import React from 'react';
import PortalLayout from '@/src/components/layout/PortalLayout';
import { BarChart3, Search, Plus, Filter, Download, Database, Info, History, TrendingUp, PieChart } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

export default function ResourcesAnalytics() {
  return (
    <PortalLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-slate-100 rounded-2xl shadow-sm border border-slate-200">
              <BarChart3 className="text-slate-900 h-6 w-6 lg:h-8 lg:w-8" />
            </div>
            <div>
              <h2 className="text-2xl lg:text-3xl font-black text-slate-900 tracking-tight text-left italic uppercase">Disaster Analytics</h2>
              <p className="text-[10px] lg:text-xs font-bold text-slate-500 uppercase tracking-[0.2em] mt-1 italic text-left tracking-widest">DRRM & Youth Sector Insights</p>
            </div>
          </div>
          <Button className="h-11 px-6 rounded-xl bg-slate-900 hover:bg-slate-800 shadow-lg font-bold text-white uppercase tracking-widest text-xs">
            <Download className="mr-2 h-4 w-4" /> Comprehensive Report
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <Card className="border-slate-200 shadow-xl bg-white rounded-3xl overflow-hidden min-h-[400px] flex flex-col items-center justify-center text-center">
              <PieChart size={64} className="text-slate-100 mb-6" />
              <h3 className="text-xl font-black text-slate-400 italic uppercase italic">Sector Distributions</h3>
              <p className="text-sm font-medium text-slate-400 mt-2 max-w-xs mx-auto italic italic">Processing real-time data from DRRM activities and SK project outcomes.</p>
           </Card>
           <Card className="border-slate-200 shadow-xl bg-white rounded-3xl overflow-hidden min-h-[400px] flex flex-col items-center justify-center text-center">
              <TrendingUp size={64} className="text-slate-100 mb-6" />
              <h3 className="text-xl font-black text-slate-400 italic uppercase">Trend Analysis</h3>
              <p className="text-sm font-medium text-slate-400 mt-2 max-w-xs mx-auto italic">Comparative analytics for disaster response times and youth program engagement rates.</p>
           </Card>
        </div>
      </div>
    </PortalLayout>
  );
}
