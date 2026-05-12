import React, { useState, useEffect } from 'react';
import PortalLayout from '@/src/components/layout/PortalLayout';
import { cn } from '@/lib/utils';
import { 
  UserCheck, Search, Plus, Filter, Download, 
  CreditCard, MoreHorizontal, Eye, Banknote, Landmark,
  History, Wallet, ShieldCheck, ArrowUpRight
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
import { collection, query, onSnapshot, orderBy, where, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/src/lib/firebase';
import { motion } from 'motion/react';

export default function Payroll() {
  const [staff, setStaff] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Only approved staff should be in payroll
    const q = query(collection(db, 'staff'), where('isApproved', '==', true));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setStaff(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <PortalLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
              <div className="p-2 bg-emerald-100 text-emerald-600 rounded-xl">
                <Banknote size={28} />
              </div>
              Payroll & Honoraria
            </h2>
            <p className="text-sm font-medium text-slate-500 mt-1">
              Management of Staff Salaries, Benefits and Council Honoraria
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" className="h-11 px-4 rounded-xl border-slate-200">
               <History size={18} className="mr-2" /> Disbursement History
            </Button>
            <Button className="h-11 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-700 shadow-lg font-bold">
               <CreditCard size={18} className="mr-2" /> Release Batch
            </Button>
          </div>
        </div>

        {/* Payroll Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
           {[
             { label: 'Total Staff Member', value: staff.length, icon: UserCheck, color: 'text-blue-600', bg: 'bg-blue-50' },
             { label: 'Est. Monthly Payroll', value: '₱245,400', icon: Wallet, color: 'text-emerald-600', bg: 'bg-emerald-50' },
             { label: 'Next Release Date', value: 'May 30', icon: CreditCard, color: 'text-rose-600', bg: 'bg-rose-50' },
             { label: 'Fund Compliance', value: 'High', icon: ShieldCheck, color: 'text-indigo-600', bg: 'bg-indigo-50' },
           ].map((stat, i) => (
             <Card key={i} className="border-slate-200 shadow-sm">
                <CardContent className="pt-4 flex items-center justify-between">
                   <div>
                     <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">{stat.label}</p>
                     <p className="text-xl font-black text-slate-900 mt-2 tracking-tight">{stat.value}</p>
                   </div>
                   <div className={`${stat.bg} ${stat.color} p-3 rounded-2xl`}>
                     <stat.icon size={20} />
                   </div>
                </CardContent>
             </Card>
           ))}
        </div>

        <Card className="border-slate-200 shadow-sm overflow-hidden">
          <CardHeader className="bg-white border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4 p-6">
            <div className="flex-1 max-w-md relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <Input placeholder="Search personnel by name..." className="pl-10 h-11 border-slate-200 rounded-xl" />
            </div>
            <Badge variant="outline" className="bg-emerald-50 border-emerald-100 text-emerald-600 font-bold uppercase py-1 px-3">May 2024 Cycle Active</Badge>
          </CardHeader>
          <Table>
            <TableHeader className="bg-slate-50/50">
               <TableRow>
                 <TableHead className="font-bold text-slate-900">Personnel</TableHead>
                 <TableHead className="font-bold text-slate-900">Department</TableHead>
                 <TableHead className="font-bold text-slate-900">Position</TableHead>
                 <TableHead className="font-bold text-slate-900">Base Honoraria</TableHead>
                 <TableHead className="font-bold text-slate-900">Calculated Pay</TableHead>
                 <TableHead className="text-right font-bold text-slate-900">Status</TableHead>
               </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-64 text-center">
                    <div className="animate-pulse flex flex-col items-center gap-2">
                       <Landmark size={32} className="text-slate-200" />
                       <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Accessing Treasury Hub...</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : staff.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-64 text-center">
                    <p className="text-sm font-bold text-slate-500">No personnel registered in the payroll hub</p>
                  </TableCell>
                </TableRow>
              ) : (
                staff.map((s) => (
                   <TableRow key={s.id} className="hover:bg-slate-50/50 transition-colors group">
                     <TableCell>
                       <div className="flex items-center gap-3">
                         <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-black text-xs text-slate-500 shadow-inner">
                           {s.displayName?.[0] || 'P'}
                         </div>
                         <div>
                            <p className="text-sm font-black text-slate-900 uppercase tracking-tight">{s.displayName}</p>
                            <p className="text-[10px] text-slate-400 font-bold tracking-widest uppercase">{s.role || 'Staff'}</p>
                         </div>
                       </div>
                     </TableCell>
                     <TableCell>
                        <Badge variant="outline" className="text-[9px] uppercase font-black tracking-widest border-2 border-slate-200 text-slate-500">
                          {s.department?.replace(/_/g, ' ') || 'General'}
                        </Badge>
                     </TableCell>
                     <TableCell className="text-xs font-bold text-slate-600 uppercase tracking-tight">Barangay Employee</TableCell>
                     <TableCell className="text-xs font-bold text-slate-500">₱12,500.00</TableCell>
                     <TableCell className="font-black text-slate-900">₱12,500.00</TableCell>
                     <TableCell className="text-right">
                        <Badge className="bg-emerald-50 text-emerald-600 border-emerald-100 font-black text-[10px] uppercase tracking-widest">READY</Badge>
                     </TableCell>
                   </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </Card>
      </div>
    </PortalLayout>
  );
}
