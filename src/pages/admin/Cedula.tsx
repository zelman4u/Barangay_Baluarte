import React, { useState, useEffect } from 'react';
import PortalLayout from '@/src/components/layout/PortalLayout';
import { cn } from '@/lib/utils';
import { 
  ClipboardList, Search, Plus, Filter, Download, 
  Printer, MoreHorizontal, Eye, User, CreditCard,
  CheckCircle2, AlertCircle, History, Landmark
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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';

export default function Cedula() {
  const [cedulas, setCedulas] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newCedula, setNewCedula] = useState({
    residentName: '',
    address: '',
    birthDate: '',
    gender: 'Male',
    civilStatus: 'Single',
    profession: '',
    income: '',
    cedulaNumber: '',
    amountPaid: '',
  });

  useEffect(() => {
    const q = query(collection(db, 'cedulas'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setCedulas(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleIssueCedula = async () => {
    try {
      await addDoc(collection(db, 'cedulas'), {
        ...newCedula,
        createdAt: serverTimestamp(),
        issuedBy: 'Admin',
      });
      setIsAddOpen(false);
    } catch (error) {
      console.error("Error issuing cedula:", error);
    }
  };

  return (
    <PortalLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
              <div className="p-2 bg-amber-100 text-amber-600 rounded-xl">
                <ClipboardList size={28} />
              </div>
              Cedula Management
            </h2>
            <p className="text-sm font-medium text-slate-500 mt-1">
              Community Tax Certificate (CTC) Issuance and Collection
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" className="h-11 px-4 rounded-xl border-slate-200">
              <Download size={18} className="mr-2" /> Summary
            </Button>
            
            <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
              <DialogTrigger render={
                <Button className="h-11 px-6 rounded-xl bg-amber-600 hover:bg-amber-700 shadow-lg font-bold">
                  <Plus size={18} className="mr-2" /> Issue New CTC
                </Button>
              } />
              <DialogContent className="sm:max-w-[550px]">
                <DialogHeader>
                  <DialogTitle className="text-xl font-bold">Issue Community Tax Certificate</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                   <div className="space-y-2">
                     <Label htmlFor="residentName">Full Name</Label>
                     <Input id="residentName" value={newCedula.residentName} onChange={e => setNewCedula({...newCedula, residentName: e.target.value})} placeholder="Resident Full Name" />
                   </div>
                   <div className="grid grid-cols-2 gap-4">
                     <div className="space-y-2">
                       <Label htmlFor="profession">Profession/Job</Label>
                       <Input id="profession" value={newCedula.profession} onChange={e => setNewCedula({...newCedula, profession: e.target.value})} />
                     </div>
                     <div className="space-y-2">
                       <Label htmlFor="income">Annual Salary/Income</Label>
                       <Input id="income" type="number" value={newCedula.income} onChange={e => setNewCedula({...newCedula, income: e.target.value})} />
                     </div>
                   </div>
                   <div className="grid grid-cols-2 gap-4 border-t border-slate-100 pt-4">
                     <div className="space-y-2">
                       <Label htmlFor="cedulaNumber">CTC / Cedula Number</Label>
                       <Input id="cedulaNumber" value={newCedula.cedulaNumber} onChange={e => setNewCedula({...newCedula, cedulaNumber: e.target.value})} placeholder="e.g. CTC-88210" />
                     </div>
                     <div className="space-y-2">
                       <Label htmlFor="amount">Collection Amount (₱)</Label>
                       <Input id="amount" type="number" value={newCedula.amountPaid} onChange={e => setNewCedula({...newCedula, amountPaid: e.target.value})} />
                     </div>
                   </div>
                </div>
                <DialogFooter>
                   <Button onClick={handleIssueCedula} className="bg-amber-600 hover:bg-amber-700 w-full font-black uppercase tracking-widest text-xs h-12">Confirm and Print CTC</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { label: 'Total Issued Today', value: cedulas.length, icon: History, color: 'text-amber-600', bg: 'bg-amber-50' },
            { label: 'Total Revenue', value: '₱42,050', icon: Landmark, color: 'text-emerald-600', bg: 'bg-emerald-50' },
            { label: 'Pending Validations', value: 0, icon: AlertCircle, color: 'text-slate-400', bg: 'bg-slate-50' },
            { label: 'System Compliance', value: '100%', icon: CheckCircle2, color: 'text-blue-600', bg: 'bg-blue-50' },
          ].map((stat, i) => (
            <Card key={i} className="border-slate-200">
               <CardContent className="pt-4 flex items-center gap-4">
                  <div className={`${stat.bg} ${stat.color} p-3 rounded-xl`}>
                    <stat.icon size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">{stat.label}</p>
                    <p className="text-xl font-black text-slate-900 mt-1">{stat.value}</p>
                  </div>
               </CardContent>
            </Card>
          ))}
        </div>

        {/* History Table */}
        <Card className="border-slate-200 shadow-sm overflow-hidden">
          <CardHeader className="bg-white border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4 p-6">
            <div className="flex-1 max-w-md relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <Input placeholder="Search by CTC number or name..." className="pl-10 h-11 border-slate-200 rounded-xl" />
            </div>
          </CardHeader>
          <Table>
             <TableHeader className="bg-slate-50/50">
               <TableRow>
                 <TableHead className="font-bold text-slate-900">CTC Number</TableHead>
                 <TableHead className="font-bold text-slate-900">Full Name</TableHead>
                 <TableHead className="font-bold text-slate-900">Profession</TableHead>
                 <TableHead className="font-bold text-slate-900">Amount Paid</TableHead>
                 <TableHead className="font-bold text-slate-900">Date Issued</TableHead>
                 <TableHead className="text-right font-bold text-slate-900">Actions</TableHead>
               </TableRow>
             </TableHeader>
             <TableBody>
               {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-48 text-center text-slate-400 font-bold uppercase tracking-widest text-[10px]">
                      Accessing Financial Ledger...
                    </TableCell>
                  </TableRow>
               ) : cedulas.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-64 text-center">
                       <div className="flex flex-col items-center gap-4">
                          <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center text-slate-100">
                             <ClipboardList size={32} />
                          </div>
                          <p className="text-sm font-bold text-slate-900">No CTCs issued yet for this cycle</p>
                       </div>
                    </TableCell>
                  </TableRow>
               ) : (
                 cedulas.map((ced) => (
                   <TableRow key={ced.id} className="hover:bg-slate-50/50 transition-colors group">
                     <TableCell className="font-black text-slate-900 text-xs">{ced.cedulaNumber}</TableCell>
                     <TableCell>
                       <div className="flex items-center gap-3">
                         <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center text-[10px] font-black">
                           {ced.residentName?.[0] || 'R'}
                         </div>
                         <p className="text-sm font-bold text-slate-900 uppercase tracking-tighter">{ced.residentName}</p>
                       </div>
                     </TableCell>
                     <TableCell className="text-xs font-medium text-slate-500 uppercase tracking-wide">{ced.profession || 'N/A'}</TableCell>
                     <TableCell className="font-black text-blue-600">₱{parseFloat(ced.amountPaid || 0).toLocaleString()}</TableCell>
                     <TableCell className="text-xs text-slate-500 font-medium">
                       {ced.createdAt?.toDate?.() ? ced.createdAt.toDate().toLocaleDateString() : 'Just now'}
                     </TableCell>
                     <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button size="icon" variant="ghost" className="h-8 w-8 rounded-lg text-slate-400 hover:text-blue-600">
                            <Printer size={16} />
                          </Button>
                          <Button size="icon" variant="ghost" className="h-8 w-8 rounded-lg text-slate-400 hover:text-rose-600">
                            <Eye size={16} />
                          </Button>
                        </div>
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
