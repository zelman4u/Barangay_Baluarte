import React, { useState, useEffect } from 'react';
import PortalLayout from '@/src/components/layout/PortalLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Landmark, TrendingUp, Download, Plus, Receipt, ArrowUpRight, ArrowDownRight, History, Wallet } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { motion, AnimatePresence } from 'motion/react';
import { collection, query, onSnapshot, limit, orderBy } from 'firebase/firestore';
import { db } from '@/src/lib/firebase';

const financialData = [
  { name: 'Jan', revenue: 45000, expense: 32000 },
  { name: 'Feb', revenue: 52000, expense: 38000 },
  { name: 'Mar', revenue: 48000, expense: 35000 },
  { name: 'Apr', revenue: 61000, expense: 42000 },
  { name: 'May', revenue: 55000, expense: 40000 },
];

export default function TreasuryDashboard() {
  const [transactions, setTransactions] = useState<any[]>([]);

  useEffect(() => {
    // Fetch recent transactions
    const q = query(collection(db, 'treasury'), limit(6));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setTransactions(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    return () => unsubscribe();
  }, []);

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
              <div className="p-3 bg-emerald-50 rounded-2xl">
                <Wallet className="text-emerald-600 h-6 w-6 lg:h-8 lg:w-8" />
              </div>
              <div>
                <h2 className="text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight italic uppercase">Treasury Hub</h2>
                <p className="text-xs lg:text-sm font-medium text-slate-500 mt-1 uppercase tracking-widest leading-none">Fiscal Management & Revenue Control</p>
              </div>
            </div>
          </motion.div>
          <motion.div variants={itemVariants} className="flex gap-2">
            <Button variant="outline" className="border-slate-200 h-11 px-6 font-bold bg-white text-slate-600">
              <Download className="mr-2 h-4 w-4" /> Financial Report
            </Button>
            <Button className="bg-emerald-600 hover:bg-emerald-700 font-bold h-11 px-6 shadow-lg shadow-emerald-600/20">
              <Plus className="mr-2 h-4 w-4" /> New Receipt
            </Button>
          </motion.div>
        </div>

        {/* Finance Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {[
            { label: 'Total Revenue', value: '₱261,040', icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50', trend: '+12.5%' },
            { label: 'Total Expenses', value: '₱187,000', icon: ArrowDownRight, color: 'text-rose-600', bg: 'bg-rose-50', trend: '-2.4%' },
            { label: 'Net Balance', value: '₱74,040', icon: Landmark, color: 'text-blue-600', bg: 'bg-blue-50', trend: '+18.2%' },
            { label: 'Collections', value: '14 Items', icon: Receipt, color: 'text-amber-600', bg: 'bg-amber-50', trend: 'Pending' },
          ].map((stat, i) => (
            <motion.div key={i} variants={itemVariants}>
              <Card className="hover:shadow-lg transition-all border-slate-200 overflow-hidden group">
                <CardContent className="pt-6">
                  <div className="flex flex-col">
                    <div className={`${stat.bg} ${stat.color} w-10 h-10 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110`}>
                      <stat.icon size={20} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
                      <p className="text-2xl font-black text-slate-900 mt-1 tracking-tighter leading-none">{stat.value}</p>
                      <div className={`text-[9px] font-bold mt-2.5 flex items-center gap-1 ${stat.trend.startsWith('+') ? 'text-emerald-500' : stat.trend === 'Pending' ? 'text-amber-500' : 'text-red-500'}`}>
                        {stat.trend} <span className="text-slate-300">MoM Performance</span>
                      </div>
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
              <Card className="border-slate-200 shadow-sm overflow-hidden h-full">
                <CardHeader className="pb-4 border-b border-slate-50 flex flex-row items-center justify-between">
                   <div>
                    <CardTitle className="text-lg font-bold tracking-tight">Financial Performance</CardTitle>
                    <CardDescription className="text-xs">Barangay Revenue vs Expenses comparison (2026)</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Badge variant="outline" className="text-[9px] font-black uppercase text-emerald-600 border-emerald-100 bg-emerald-50">Revenue</Badge>
                    <Badge variant="outline" className="text-[9px] font-black uppercase text-rose-600 border-rose-100 bg-rose-50">Expense</Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={financialData}>
                        <defs>
                          <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                            <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                          </linearGradient>
                          <linearGradient id="colorExp" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#e11d48" stopOpacity={0.1}/>
                            <stop offset="95%" stopColor="#e11d48" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <XAxis dataKey="name" stroke="#94A3B8" fontSize={11} fontWeight={700} axisLine={false} tickLine={false} dy={10} />
                        <YAxis stroke="#94A3B8" fontSize={11} fontWeight={700} axisLine={false} tickLine={false} />
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                        <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }} />
                        <Area type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={4} fillOpacity={1} fill="url(#colorRev)" />
                        <Area type="monotone" dataKey="expense" stroke="#e11d48" strokeWidth={4} fillOpacity={1} fill="url(#colorExp)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          <aside className="lg:col-span-4 space-y-6">
            <motion.div variants={itemVariants}>
              <Card className="border-slate-200 overflow-hidden shadow-sm h-full flex flex-col">
                <CardHeader className="flex flex-row items-center justify-between border-b border-slate-50 pb-4">
                  <div>
                    <CardTitle className="text-base font-bold tracking-tight">Live Ledger</CardTitle>
                    <CardDescription className="text-[10px] font-medium text-slate-400 uppercase tracking-widest leading-none mt-1">Real-time collections</CardDescription>
                  </div>
                  <Badge variant="outline" className="text-[9px] font-black uppercase text-emerald-600 bg-emerald-50 border-emerald-100 animate-pulse">Live</Badge>
                </CardHeader>
                <CardContent className="flex-1 overflow-auto p-0 scrollbar-hide">
                  <div className="p-6 space-y-4">
                    <AnimatePresence mode="popLayout">
                      {(transactions.length > 0 ? transactions : [
                        { id: 'TX-001', resident: 'Juan Dela Cruz', purpose: 'Brgy Clearance', amount: 100, status: 'Paid', type: 'Income' },
                        { id: 'TX-002', resident: 'Supplier A', purpose: 'Office Supplies', amount: 2500, status: 'Paid', type: 'Expense' },
                        { id: 'TX-003', resident: 'Maria Clara', purpose: 'Cedula', amount: 50, status: 'Paid', type: 'Income' },
                      ]).map((tx, i) => (
                        <motion.div 
                          key={tx.id || i}
                          layout
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex items-center justify-between p-3 rounded-2xl border border-slate-100 hover:bg-slate-50 transition-all group"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className={`p-2.5 rounded-xl shrink-0 ${tx.type === 'Income' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                              <Receipt size={16} />
                            </div>
                            <div className="min-w-0">
                              <p className="text-xs font-bold text-slate-900 truncate tracking-tight">{tx.purpose}</p>
                              <p className="text-[10px] text-slate-400 font-bold truncate uppercase">{tx.residentName || tx.resident || 'N/A'}</p>
                            </div>
                          </div>
                          <div className="text-right shrink-0 ml-4">
                            <p className={`text-xs font-black ${tx.type === 'Income' ? 'text-emerald-600' : 'text-rose-600'}`}>
                              {tx.type === 'Income' ? '+' : '-'}₱{Math.abs(tx.amount).toLocaleString()}
                            </p>
                            <p className="text-[9px] font-bold text-slate-300 uppercase tracking-tighter mt-0.5">Just now</p>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                    <Button variant="ghost" className="w-full text-[10px] font-black text-slate-400 hover:text-emerald-600 uppercase tracking-widest mt-2">
                       Full Audit History <History size={14} className="ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </aside>
        </div>
      </motion.div>
    </PortalLayout>
  );
}
