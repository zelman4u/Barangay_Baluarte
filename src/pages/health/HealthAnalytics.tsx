import React, { useState, useEffect } from 'react';
import PortalLayout from '@/src/components/layout/PortalLayout';
import { cn } from '@/lib/utils';
import { 
  BarChart3, TrendingUp, Users, HeartPulse, Landmark, 
  Download, Filter, Calendar, Zap, ArrowUpRight, 
  Activity, PieChart, LineChart as LineIcon, Search,
  Thermometer, Activity as ActivityIcon, Users2
} from 'lucide-react';
import { 
  Card, CardContent, CardHeader, CardTitle, CardDescription 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, AreaChart, Area, PieChart as RePieChart, Pie, Cell,
  LineChart, Line, Legend
} from 'recharts';
import { motion } from 'motion/react';

const healthStats = [
  { name: 'Total Patients', value: '1,482', trend: '+45 this month', icon: Users, color: 'text-rose-600', bg: 'bg-rose-50' },
  { name: 'Immunization Rate', value: '94.2%', trend: '+1.2% vs Q1', icon: Activity, color: 'text-indigo-600', bg: 'bg-indigo-50' },
  { name: 'Assistance Budget', value: '₱ 245K', trend: '82% Utilized', icon: Landmark, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  { name: 'Consultation Avg', value: '18.4', trend: 'Daily average', icon: HeartPulse, color: 'text-amber-600', bg: 'bg-amber-50' },
];

const diseaseTrendData = [
  { name: 'Jan', flu: 45, dengue: 5, hypert: 20 },
  { name: 'Feb', flu: 52, dengue: 8, hypert: 22 },
  { name: 'Mar', flu: 48, dengue: 12, hypert: 25 },
  { name: 'Apr', flu: 61, dengue: 4, hypert: 24 },
  { name: 'May', flu: 55, dengue: 7, hypert: 28 },
];

const ageDemographics = [
  { name: 'Infants', value: 120, color: '#f43f5e' },
  { name: 'Children', value: 280, color: '#6366f1' },
  { name: 'Adults', value: 740, color: '#10b981' },
  { name: 'Seniors', value: 342, color: '#f59e0b' },
];

export default function HealthAnalytics() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <PortalLayout>
      <motion.div initial="hidden" animate="visible" variants={containerVariants} className="space-y-6 lg:space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <motion.div variants={itemVariants}>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-rose-600 rounded-2xl shadow-lg shadow-rose-900/20">
                <BarChart3 className="text-white h-6 w-6 lg:h-8 lg:w-8" />
              </div>
              <div>
                <h2 className="text-2xl lg:text-3xl font-black text-slate-900 tracking-tight">Health Analytics</h2>
                <p className="text-[10px] lg:text-xs font-bold text-slate-500 uppercase tracking-[0.2em] mt-1 italic">Epidemiological & Wellness Overview</p>
              </div>
            </div>
          </motion.div>
          <motion.div variants={itemVariants} className="flex gap-2">
            <Button variant="outline" className="h-11 px-4 rounded-xl border-slate-200 font-bold bg-white shadow-sm">
              <Filter className="mr-2 h-4 w-4" /> Custom Range
            </Button>
            <Button className="h-11 px-6 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold shadow-lg">
              <Download className="mr-2 h-4 w-4" /> Export Datasets
            </Button>
          </motion.div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {healthStats.map((stat, i) => (
            <motion.div key={stat.name} variants={itemVariants}>
              <Card className="hover:shadow-lg transition-all border-slate-200 overflow-hidden group h-full">
                <CardContent className="p-4 lg:p-6 relative flex flex-col h-full">
                  <div className="absolute top-0 right-0 p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <ArrowUpRight size={14} className="text-slate-300" />
                  </div>
                  <div className="flex items-center sm:items-start justify-between">
                    <div>
                      <p className="text-[10px] lg:text-xs font-bold text-slate-400 uppercase tracking-widest leading-none">{stat.name}</p>
                      <p className="text-xl lg:text-3xl font-black text-slate-900 mt-1 lg:mt-2 tracking-tighter leading-none">{stat.value}</p>
                      <div className="text-[9px] lg:text-[10px] font-bold mt-1.5 lg:mt-2.5 flex items-center gap-1 text-emerald-500">
                        {stat.trend}
                      </div>
                    </div>
                    <div className={cn("p-2 lg:p-3 rounded-xl lg:rounded-2xl transition-transform group-hover:scale-110 duration-300 shadow-sm border border-black/5", stat.bg, stat.color)}>
                      <stat.icon size={20} className="lg:w-6 lg:h-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <motion.div variants={itemVariants} className="lg:col-span-2">
            <Card className="border-slate-200 shadow-xl shadow-slate-200/20 overflow-hidden h-full rounded-2xl">
              <CardHeader className="bg-slate-50/50 border-b border-slate-100 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg font-black tracking-tight text-slate-900 uppercase">Disease Surveillance</CardTitle>
                    <CardDescription className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Monthly trend of reported cases</CardDescription>
                  </div>
                  <Badge variant="outline" className="h-6 px-3 bg-white text-rose-600 border-rose-100 font-bold text-[10px]">MAY 2026</Badge>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="h-[350px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={diseaseTrendData}>
                      <defs>
                        <linearGradient id="colorFlu" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.1}/>
                          <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="name" stroke="#94A3B8" fontSize={11} fontWeight={700} axisLine={false} tickLine={false} />
                      <YAxis stroke="#94A3B8" fontSize={11} fontWeight={700} axisLine={false} tickLine={false} />
                      <Tooltip />
                      <Legend />
                      <Area type="monotone" dataKey="flu" stroke="#f43f5e" strokeWidth={3} fillOpacity={1} fill="url(#colorFlu)" />
                      <Area type="monotone" dataKey="hypert" stroke="#6366f1" strokeWidth={3} fillOpacity={0} />
                      <Area type="monotone" dataKey="dengue" stroke="#10b981" strokeWidth={3} fillOpacity={0} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="border-slate-200 shadow-xl shadow-slate-200/20 overflow-hidden h-full rounded-2xl flex flex-col">
              <CardHeader className="bg-slate-50/50 border-b border-slate-100 p-6">
                <CardTitle className="text-lg font-black tracking-tight text-slate-900 uppercase">Age Population</CardTitle>
                <CardDescription className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Health monitoring distribution</CardDescription>
              </CardHeader>
              <CardContent className="p-6 flex-1 flex flex-col justify-center">
                <div className="h-[280px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <RePieChart>
                      <Pie
                        data={ageDemographics}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {ageDemographics.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </RePieChart>
                  </ResponsiveContainer>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-6">
                  {ageDemographics.map((item) => (
                    <div key={item.name} className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{item.name}</span>
                      <span className="text-xs font-bold text-slate-900 ml-auto">{item.value}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </motion.div>
    </PortalLayout>
  );
}
