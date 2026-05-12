import React, { useState, useEffect } from 'react';
import PortalLayout from '@/src/components/layout/PortalLayout';
import { cn } from '@/lib/utils';
import { 
  Wallet, TrendingUp, TrendingDown, Landmark, 
  Plus, Search, Download, Calendar, Filter, 
  ArrowUpRight, ArrowDownRight, History, Receipt,
  PieChart as PieIcon, LineChart as LineIcon
} from 'lucide-react';
import { 
  Card, CardContent, CardHeader, CardTitle, CardDescription 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from '@/components/ui/table';
import { collection, query, onSnapshot, orderBy, limit, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/src/lib/firebase';
import { motion } from 'motion/react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, AreaChart, Area
} from 'recharts';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';

const budgetData = [
  { name: 'Jan', income: 45000, expense: 32000 },
  { name: 'Feb', income: 52000, expense: 41000 },
  { name: 'Mar', income: 48000, expense: 38000 },
  { name: 'Apr', income: 61000, expense: 45000 },
  { name: 'May', income: 55000, expense: 42000 },
  { name: 'Jun', income: 67000, expense: 50000 },
];

export default function Finance() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddTxOpen, setIsAddTxOpen] = useState(false);
  const [newTx, setNewTx] = useState({
    purpose: '',
    amount: '',
    type: 'Income',
    receiptNumber: ''
  });

  useEffect(() => {
    const q = query(collection(db, 'treasury'), orderBy('createdAt', 'desc'), limit(50));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setTransactions(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleAddTx = async () => {
    try {
      await addDoc(collection(db, 'treasury'), {
        ...newTx,
        amount: parseFloat(newTx.amount),
        createdAt: serverTimestamp(),
        status: 'Completed'
      });
      setIsAddTxOpen(false);
      setNewTx({ purpose: '', amount: '', type: 'Income', receiptNumber: '' });
    } catch (error) {
      console.error("Error adding transaction:", error);
    }
  };

  const totalIncome = transactions.filter(t => t.type === 'Income').reduce((acc, t) => acc + (t.amount || 0), 0) + 124500;
  const totalExpense = transactions.filter(t => t.type === 'Expense').reduce((acc, t) => acc + (t.amount || 0), 0) + 82000;

  return (
    <PortalLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-xl text-blue-600">
                <Landmark size={28} />
              </div>
              Financial Hub
            </h2>
            <p className="text-sm font-medium text-slate-500 mt-1">
              Barangay Treasury, Budgeting and Expenditure Tracking
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" className="h-11 px-4 rounded-xl border-slate-200">
              <Download size={18} className="mr-2" /> Annual Report
            </Button>
            
            <Dialog open={isAddTxOpen} onOpenChange={setIsAddTxOpen}>
              <DialogTrigger render={
                <Button className="h-11 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 shadow-lg font-bold">
                  <Plus size={18} className="mr-2" /> Record Transaction
                </Button>
              } />
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle className="text-xl font-bold">New Financial Record</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="type">Transaction Type</Label>
                    <select 
                      id="type"
                      className="w-full h-10 px-3 rounded-md border border-slate-200 text-sm"
                      value={newTx.type}
                      onChange={e => setNewTx({...newTx, type: e.target.value})}
                    >
                      <option value="Income">Income (Revenue)</option>
                      <option value="Expense">Expense (Expenditure)</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="purpose">Purpose / Particulars</Label>
                    <Input id="purpose" value={newTx.purpose} onChange={e => setNewTx({...newTx, purpose: e.target.value})} placeholder="e.g. Barangay Clearance Fee" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="amount">Amount (₱)</Label>
                      <Input id="amount" type="number" value={newTx.amount} onChange={e => setNewTx({...newTx, amount: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="receipt">Receipt #</Label>
                      <Input id="receipt" value={newTx.receiptNumber} onChange={e => setNewTx({...newTx, receiptNumber: e.target.value})} />
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={handleAddTx} className="bg-blue-600 hover:bg-blue-700 w-full">Commit to Ledger</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Global Finance Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
           <Card className="border-slate-200 bg-white shadow-sm overflow-hidden group">
            <CardContent className="pt-6 relative">
              <div className="absolute top-0 right-0 p-4 opacity-5 bg-blue-600 rounded-bl-[100px] w-24 h-24" />
              <div className="flex items-center justify-between mb-4">
                 <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl group-hover:scale-110 transition-transform">
                   <Wallet size={24} />
                 </div>
                 <Badge className="bg-white text-blue-600 border-blue-100 font-black">NET BALANCE</Badge>
              </div>
              <p className="text-3xl font-black text-slate-900 tracking-tighter">₱{(totalIncome - totalExpense).toLocaleString()}</p>
              <div className="mt-2 flex items-center gap-1 text-[10px] font-bold text-emerald-500">
                <TrendingUp size={12} /> +12.5% vs Last Quarter
              </div>
            </CardContent>
           </Card>

           {[
             { label: 'Total Revenue', value: totalIncome, icon: ArrowUpRight, color: 'text-emerald-600', bg: 'bg-emerald-50' },
             { label: 'Total Expenses', value: totalExpense, icon: ArrowDownRight, color: 'text-rose-600', bg: 'bg-rose-50' },
             { label: 'Projected Budget', value: 1500000, icon: Landmark, color: 'text-indigo-600', bg: 'bg-indigo-50' },
           ].map((stat, i) => (
             <Card key={i} className="border-slate-200">
               <CardContent className="pt-6">
                 <div className="flex items-center justify-between mb-4">
                   <div className={`${stat.bg} ${stat.color} p-2 rounded-lg`}>
                     <stat.icon size={18} />
                   </div>
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">{stat.label}</p>
                 </div>
                 <p className="text-2xl font-black text-slate-900 tracking-tight">₱{stat.value.toLocaleString()}</p>
               </CardContent>
             </Card>
           ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Chart Section */}
          <Card className="lg:col-span-8 border-slate-200 shadow-sm overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between border-b border-slate-50">
              <div>
                <CardTitle className="text-lg font-black tracking-tight">Budget Performance</CardTitle>
                <CardDescription className="text-xs font-medium text-slate-400">Monthly Revenue vs Expenditure Trends</CardDescription>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-blue-600"><LineIcon size={16} /></Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400"><PieIcon size={16} /></Button>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
               <div className="h-[320px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={budgetData}>
                    <defs>
                      <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" stroke="#94A3B8" fontSize={11} fontWeight={700} tickLine={false} axisLine={false} />
                    <YAxis stroke="#94A3B8" fontSize={11} fontWeight={700} tickLine={false} axisLine={false} />
                    <Tooltip 
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', fontSize: '12px', fontWeight: '800' }}
                    />
                    <Area type="monotone" dataKey="income" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorIncome)" />
                    <Area type="monotone" dataKey="expense" stroke="#ef4444" strokeWidth={3} fillOpacity={1} fill="url(#colorExpense)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Recent Ledger Area */}
          <Card className="lg:col-span-4 border-slate-200 shadow-sm overflow-hidden flex flex-col">
            <CardHeader className="bg-slate-900 text-white pb-6">
              <div className="flex items-center justify-between mb-2">
                <CardTitle className="text-base font-black tracking-widest uppercase italic">The Ledger</CardTitle>
                <History size={16} className="text-blue-400" />
              </div>
              <CardDescription className="text-slate-400 text-[10px] font-bold uppercase tracking-widest leading-none">Global Transaction Feed</CardDescription>
            </CardHeader>
            <CardContent className="p-0 flex-1 overflow-y-auto max-h-[400px]">
              <div className="divide-y divide-slate-100">
                {isLoading ? (
                  <div className="p-8 text-center text-slate-400 text-xs font-bold uppercase tracking-widest">Opening Vault...</div>
                ) : transactions.length === 0 ? (
                  <div className="p-8 text-center text-slate-400 text-xs flex flex-col items-center gap-2">
                    <Receipt size={32} className="opacity-20" />
                    No entries in this cycle
                  </div>
                ) : (
                  transactions.map((tx) => (
                    <div key={tx.id} className="p-4 hover:bg-slate-50 transition-colors flex items-center justify-between group">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-xl border ${tx.type === 'Income' ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : 'bg-rose-50 border-rose-100 text-rose-600'}`}>
                          {tx.type === 'Income' ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                        </div>
                        <div>
                          <p className="text-xs font-black text-slate-900 uppercase tracking-tighter leading-none mb-1 group-hover:text-blue-600 transition-colors">{tx.purpose}</p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">RC: {tx.receiptNumber || 'N/A'}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`text-sm font-black ${tx.type === 'Income' ? 'text-emerald-600' : 'text-rose-600'}`}>
                          {tx.type === 'Income' ? '+' : '-'}₱{tx.amount?.toLocaleString()}
                        </p>
                        <p className="text-[9px] text-slate-400 font-bold uppercase tracking-tighter">
                          {tx.createdAt?.toDate?.() ? tx.createdAt.toDate().toLocaleDateString() : 'Just now'}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
            <div className="p-4 bg-slate-50 border-t border-slate-200">
              <Button variant="ghost" className="w-full text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-blue-600">
                View Full Audit Logs
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </PortalLayout>
  );
}
