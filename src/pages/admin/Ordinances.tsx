import React, { useState, useEffect } from 'react';
import PortalLayout from '@/src/components/layout/PortalLayout';
import { cn } from '@/lib/utils';
import { 
  Shield, Scale, Search, Plus, Filter, FileText, 
  Eye, Edit, Trash2, CheckCircle2, AlertTriangle,
  History, Bookmark, Download, Share2
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
import { Textarea } from '@/components/ui/textarea';

export default function Ordinances() {
  const [ordinances, setOrdinances] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newDoc, setNewDoc] = useState({
    title: '',
    docNumber: '',
    type: 'Ordinance',
    content: '',
    status: 'Approved'
  });

  useEffect(() => {
    const q = query(collection(db, 'legislative'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setOrdinances(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleAddDoc = async () => {
    try {
      await addDoc(collection(db, 'legislative'), {
        ...newDoc,
        createdAt: serverTimestamp(),
      });
      setIsAddOpen(false);
      setNewDoc({ title: '', docNumber: '', type: 'Ordinance', content: '', status: 'Approved' });
    } catch (error) {
      console.error("Error adding doc:", error);
    }
  };

  return (
    <PortalLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
              <div className="p-2 bg-rose-100 text-rose-600 rounded-xl">
                <Shield size={28} />
              </div>
              Legislative Repository
            </h2>
            <p className="text-sm font-medium text-slate-500 mt-1">
              Barangay Ordinances, Resolutions and Administrative Orders
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" className="h-11 px-4 rounded-xl border-slate-200">
              <History size={18} className="mr-2" /> Session Logs
            </Button>
            
            <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
              <DialogTrigger render={
                <Button className="h-11 px-6 rounded-xl bg-rose-600 hover:bg-rose-700 shadow-lg font-bold">
                  <Plus size={18} className="mr-2" /> New Enactment
                </Button>
              } />
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle className="text-xl font-bold">Register New Enactment</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                       <Label htmlFor="type">Document Type</Label>
                       <select 
                         id="type"
                         className="w-full h-10 px-3 rounded-md border border-slate-200 text-sm"
                         value={newDoc.type}
                         onChange={e => setNewDoc({...newDoc, type: e.target.value})}
                       >
                         <option value="Ordinance">Ordinance</option>
                         <option value="Resolution">Resolution</option>
                       </select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="docNum">Document #</Label>
                      <Input id="docNum" value={newDoc.docNumber} onChange={e => setNewDoc({...newDoc, docNumber: e.target.value})} placeholder="e.g. 2024-001" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="title">Enactment Title</Label>
                    <Input id="title" value={newDoc.title} onChange={e => setNewDoc({...newDoc, title: e.target.value})} placeholder="Short descriptive title" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="content">Summary/Content</Label>
                    <Textarea id="content" className="h-32" value={newDoc.content} onChange={e => setNewDoc({...newDoc, content: e.target.value})} placeholder="Detailed description of the law..." />
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={handleAddDoc} className="bg-rose-600 hover:bg-rose-700 w-full font-black uppercase tracking-widest text-xs h-12">Submit to Repository</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Categories Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Admin Orders', count: 12, icon: Scale, color: 'text-blue-600', bg: 'bg-blue-50' },
            { label: 'Social Welfare', count: 8, icon: Bookmark, color: 'text-emerald-600', bg: 'bg-emerald-50' },
            { label: 'Infrastructure', count: 5, icon: FileText, color: 'text-amber-600', bg: 'bg-amber-50' },
            { label: 'Safety/BPSO', count: 14, icon: Shield, color: 'text-rose-600', bg: 'bg-rose-50' },
          ].map((cat, i) => (
            <Card key={i} className="border-slate-200 hover:shadow-md transition-all cursor-pointer group">
              <CardContent className="pt-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`${cat.bg} ${cat.color} p-2 rounded-lg group-hover:rotate-12 transition-transform`}>
                    <cat.icon size={18} />
                  </div>
                  <span className="text-xs font-bold text-slate-700">{cat.label}</span>
                </div>
                <span className="text-sm font-black text-slate-900">{cat.count}</span>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* List Section */}
        <Card className="border-slate-200 shadow-sm overflow-hidden">
          <CardHeader className="bg-white border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4 p-6">
            <div className="flex-1 max-w-md relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <Input placeholder="Search Ordinances/Resolutions..." className="pl-10 h-11 border-slate-200 rounded-xl" />
            </div>
            <div className="flex items-center gap-2">
               <Button variant="outline" className="rounded-xl border-slate-200">
                  <Download size={16} className="mr-2" /> PDF Export
               </Button>
            </div>
          </CardHeader>
          
          <Table>
            <TableHeader className="bg-slate-50/50">
              <TableRow>
                <TableHead className="font-bold text-slate-900">Document #</TableHead>
                <TableHead className="font-bold text-slate-900">Title</TableHead>
                <TableHead className="font-bold text-slate-900">Type</TableHead>
                <TableHead className="font-bold text-slate-900">Status</TableHead>
                <TableHead className="font-bold text-slate-900">Enacted On</TableHead>
                <TableHead className="text-right font-bold text-slate-900">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-64 text-center">
                    <div className="animate-pulse flex flex-col items-center gap-2">
                       <Shield size={32} className="text-slate-200" />
                       <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Accessing Ledger...</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : ordinances.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-64 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <Scale size={40} className="text-slate-100" />
                      <p className="text-sm font-bold text-slate-900">Legislative Repository is Empty</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                ordinances.map((ord) => (
                  <TableRow key={ord.id} className="hover:bg-slate-50/50 transition-colors group">
                    <TableCell className="font-black text-slate-900 text-xs">#{ord.docNumber}</TableCell>
                    <TableCell>
                      <div className="max-w-md">
                        <p className="text-sm font-bold text-slate-800 leading-tight line-clamp-1">{ord.title}</p>
                        <p className="text-[10px] text-slate-400 font-medium uppercase mt-1 italic">Vetted for Baluarte Compliance</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={cn(
                        "text-[9px] uppercase font-black tracking-widest border-2",
                        ord.type === 'Ordinance' ? "bg-amber-50 text-amber-700 border-amber-100" : "bg-blue-50 text-blue-700 border-blue-100"
                      )}>
                        {ord.type}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={cn(
                        "text-[9px] uppercase font-black tracking-widest border-2",
                        ord.status === 'Approved' ? "border-emerald-200 text-emerald-600 bg-emerald-50" : "border-slate-200 text-slate-400"
                      )}>
                        {ord.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs text-slate-500 font-medium">
                      {ord.createdAt?.toDate?.() ? ord.createdAt.toDate().toLocaleDateString() : 'Active'}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1 opacity-20 group-hover:opacity-100 transition-opacity">
                        <Button size="icon" variant="ghost" className="h-8 w-8 rounded-lg text-slate-400 hover:text-blue-600">
                           <Eye size={16} />
                        </Button>
                        <Button size="icon" variant="ghost" className="h-8 w-8 rounded-lg text-slate-400 hover:text-rose-600">
                           <Share2 size={16} />
                        </Button>
                        <Button size="icon" variant="ghost" className="h-8 w-8 rounded-lg text-slate-400 hover:text-red-500">
                           <Trash2 size={16} />
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
