import React, { useState, useEffect } from 'react';
import PortalLayout from '@/src/components/layout/PortalLayout';
import { cn } from '@/lib/utils';
import { 
  BarChart3, TrendingUp, Users, FileText, Landmark, 
  Download, Filter, Calendar, Zap, ArrowUpRight, 
  Target, Activity, PieChart as PieIcon, LineChart as LineIcon
} from 'lucide-react';
import { 
  Card, CardContent, CardHeader, CardTitle, CardDescription 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion } from 'motion/react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, 
  AreaChart, Area, PieChart, Pie, Legend
} from 'recharts';

const populationData = [
  { name: 'Purok 1', count: 1240 },
  { name: 'Purok 2', count: 850 },
  { name: 'Purok 3', count: 2100 },
  { name: 'Purok 4', count: 1450 },
  { name: 'Purok 5', count: 980 },
  { name: 'Purok 6', count: 1600 },
  { name: 'Purok 7', count: 2640 },
];

const revenueStats = [
  { name: 'Jan', val: 45000 }, { name: 'Feb', val: 52000 }, { name: 'Mar', val: 48000 },
  { name: 'Apr', val: 61000 }, { name: 'May', val: 55000 }, { name: 'Jun', val: 67000 },
];

const requestDistribution = [
  { name: 'Clearance', value: 45, color: '#3b82f6' },
  { name: 'Indigency', value: 30, color: '#10b981' },
  { name: 'Residency', value: 15, color: '#f59e0b' },
  { name: 'Others', value: 10, color: '#ef4444' },
];

export default function Analytics() {
  return (
    <PortalLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
              <div className="p-2 bg-indigo-100 text-indigo-600 rounded-xl">
                <BarChart3 size={28} />
              </div>
              Reports & Analytics
            </h2>
            <p className="text-sm font-medium text-slate-500 mt-1">
              Data-Driven Governance and Statistical Insights for Baluarte
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" className="h-11 px-4 rounded-xl border-slate-200">
               <Calendar size={18} className="mr-2" /> Custom Range
            </Button>
            <Button className="h-11 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-700 shadow-lg font-bold">
               <Download size={18} className="mr-2" /> Export PDF Report
            </Button>
          </div>
        </div>

        {/* High Level Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { label: 'Citizen Satisfaction', value: '94.2%', icon: Target, color: 'text-indigo-600', bg: 'bg-indigo-50' },
            { label: 'Efficiency Index', value: '+18.5%', icon: Zap, color: 'text-amber-600', bg: 'bg-amber-50' },
            { label: 'Network Uptime', value: '99.9%', icon: Activity, color: 'text-emerald-600', bg: 'bg-emerald-50' },
            { label: 'Response Time', value: '4.2m', icon: TrendingUp, color: 'text-blue-600', bg: 'bg-blue-50' },
          ].map((stat, i) => (
            <Card key={i} className="border-slate-200">
              <CardContent className="pt-4 flex items-center gap-4">
                <div className={`${stat.bg} ${stat.color} p-3 rounded-xl`}>
                  <stat.icon size={20} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">{stat.label}</p>
                  <p className="text-xl font-black text-slate-900 mt-1">{stat.value}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Revenue Area */}
          <Card className="lg:col-span-8 border-slate-200 shadow-sm overflow-hidden">
             <CardHeader className="flex flex-row items-center justify-between border-b border-slate-50 mb-0">
               <div>
                  <CardTitle className="text-lg font-black tracking-tight">Financial Velocity</CardTitle>
                  <CardDescription className="text-xs font-medium text-slate-400 italic">2024 Revenue Collection Flow</CardDescription>
               </div>
               <div className="flex gap-2">
                 <Badge className="bg-emerald-50 text-emerald-600 border-none px-3 font-bold">+12% Growth</Badge>
               </div>
             </CardHeader>
             <CardContent className="pt-6">
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={revenueStats}>
                      <defs>
                        <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                          <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="name" stroke="#94A3B8" fontSize={11} fontWeight={700} tickLine={false} axisLine={false} />
                      <YAxis stroke="#94A3B8" fontSize={11} fontWeight={700} tickLine={false} axisLine={false} />
                      <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', fontSize: '12px', fontWeight: '800' }} />
                      <Area type="monotone" dataKey="val" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorVal)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
             </CardContent>
          </Card>

          {/* Distribution Pie */}
          <Card className="lg:col-span-4 border-slate-200 shadow-sm overflow-hidden">
             <CardHeader className="border-b border-slate-50">
                <CardTitle className="text-[10px] font-black uppercase tracking-widest text-slate-400">Request Distribution</CardTitle>
             </CardHeader>
             <CardContent className="pt-6 h-full flex flex-col items-center">
                <div className="h-[200px] w-full">
                   <ResponsiveContainer width="100%" height="100%">
                     <PieChart>
                       <Pie 
                         data={requestDistribution} 
                         cx="50%" cy="50%" 
                         innerRadius={60} 
                         outerRadius={80} 
                         paddingAngle={5} 
                         dataKey="value"
                       >
                         {requestDistribution.map((entry, index) => (
                           <Cell key={`cell-${index}`} fill={entry.color} />
                         ))}
                       </Pie>
                       <Tooltip />
                     </PieChart>
                   </ResponsiveContainer>
                </div>
                <div className="w-full space-y-3 mt-4">
                  {requestDistribution.map((item) => (
                    <div key={item.name} className="flex items-center justify-between">
                       <div className="flex items-center gap-2">
                         <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                         <span className="text-[10px] font-bold text-slate-600 uppercase tracking-tight">{item.name}</span>
                       </div>
                       <span className="text-xs font-black text-slate-900">{item.value}%</span>
                    </div>
                  ))}
                </div>
             </CardContent>
          </Card>

          {/* Population Bar Chart */}
          <Card className="lg:col-span-12 border-slate-200 shadow-sm overflow-hidden">
             <CardHeader className="border-b border-slate-50 bg-slate-50/50">
                <CardTitle className="text-lg font-black tracking-tight uppercase flex items-center gap-2">
                   <Users size={20} className="text-indigo-600" />
                   Population Density by Purok
                </CardTitle>
             </CardHeader>
             <CardContent className="p-6">
                <div className="h-[350px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={populationData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="name" stroke="#94A3B8" fontSize={11} fontWeight={700} tickLine={false} axisLine={false} />
                      <YAxis stroke="#94A3B8" fontSize={11} fontWeight={700} tickLine={false} axisLine={false} />
                      <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                      <Bar dataKey="count" radius={[8, 8, 0, 0]} barSize={40}>
                         {populationData.map((entry, index) => (
                           <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#4f46e5' : '#818cf8'} fillOpacity={0.9} />
                         ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
             </CardContent>
          </Card>
        </div>
      </div>
    </PortalLayout>
  );
}
