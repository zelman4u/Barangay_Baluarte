import React, { useState, useEffect } from 'react';
import PortalLayout from '@/src/components/layout/PortalLayout';
import { cn } from '@/lib/utils';
import { 
  FileText, Search, Filter, CheckCircle2, XCircle, 
  Clock, Printer, MoreHorizontal, Eye, ArrowUpRight,
  ShieldCheck, AlertCircle, Calendar
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
import { 
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { collection, query, onSnapshot, orderBy, updateDoc, doc, serverTimestamp, where } from 'firebase/firestore';
import { db } from '@/src/lib/firebase';
import { motion, AnimatePresence } from 'motion/react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function Clearance() {
  const [requests, setRequests] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('pending');

  useEffect(() => {
    const q = query(collection(db, 'document_requests'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setRequests(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleStatusUpdate = async (requestId: string, newStatus: string) => {
    try {
      await updateDoc(doc(db, 'document_requests', requestId), {
        status: newStatus,
        processedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error("Error updating request status:", error);
    }
  };

  const filteredRequests = requests.filter(r => {
    if (activeTab === 'pending') return r.status === 'Pending' || !r.status;
    if (activeTab === 'approved') return r.status === 'Approved' || r.status === 'Ready for Pickup';
    if (activeTab === 'rejected') return r.status === 'Rejected';
    return true;
  });

  return (
    <PortalLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
              <div className="p-2 bg-emerald-100 rounded-xl text-emerald-600">
                <FileText size={28} />
              </div>
              Document Requests
            </h2>
            <p className="text-sm font-medium text-slate-500 mt-1">
              Process Barangay Clearances and Indidency Certificates
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button className="bg-slate-900 hover:bg-slate-800 font-bold h-11 px-6 rounded-xl shadow-lg">
              <Printer size={18} className="mr-2" /> Print Batch
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { label: 'Pending Requests', value: requests.filter(r => r.status === 'Pending' || !r.status).length, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
            { label: 'Approved Today', value: requests.filter(r => r.status === 'Approved').length, icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
            { label: 'Total Processed', value: requests.filter(r => r.status && r.status !== 'Pending').length, icon: ShieldCheck, color: 'text-blue-600', bg: 'bg-blue-50' },
          ].map((stat, i) => (
            <Card key={i} className="border-slate-200">
              <CardContent className="pt-4 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">{stat.label}</p>
                  <p className="text-2xl font-black text-slate-900 mt-2">{stat.value}</p>
                </div>
                <div className={`${stat.bg} ${stat.color} p-3 rounded-xl`}>
                  <stat.icon size={22} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Interface */}
        <Card className="border-slate-200 shadow-sm overflow-hidden">
          <Tabs defaultValue="pending" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="px-6 pt-6 border-b border-slate-100">
              <TabsList className="bg-slate-100/50 p-1 rounded-xl h-11">
                <TabsTrigger value="pending" className="rounded-lg px-6 font-bold text-xs uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:shadow-sm">Pending</TabsTrigger>
                <TabsTrigger value="approved" className="rounded-lg px-6 font-bold text-xs uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:shadow-sm">Approved</TabsTrigger>
                <TabsTrigger value="rejected" className="rounded-lg px-6 font-bold text-xs uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:shadow-sm">Rejected</TabsTrigger>
              </TabsList>
            </div>

            <CardHeader className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 bg-slate-50/30">
              <div className="flex-1 max-w-md relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <Input placeholder="Search requests..." className="pl-10 h-11 border-slate-200 bg-white rounded-xl" />
              </div>
              <Button variant="outline" size="sm" className="bg-white rounded-lg border-slate-200">
                <Filter size={16} className="mr-2" /> Filter
              </Button>
            </CardHeader>

            <TabsContent value={activeTab} className="m-0">
              <Table>
                <TableHeader className="bg-slate-50/50">
                  <TableRow>
                    <TableHead className="font-bold text-slate-900">Requester</TableHead>
                    <TableHead className="font-bold text-slate-900">Document Type</TableHead>
                    <TableHead className="font-bold text-slate-900">Purpose</TableHead>
                    <TableHead className="font-bold text-slate-900">Date Requested</TableHead>
                    <TableHead className="font-bold text-slate-900">Status</TableHead>
                    <TableHead className="text-right font-bold text-slate-900">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={6} className="h-48 text-center text-slate-400 font-bold uppercase tracking-widest text-[10px]">
                        Syncing with secure node...
                      </TableCell>
                    </TableRow>
                  ) : filteredRequests.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="h-64 text-center">
                        <div className="flex flex-col items-center justify-center gap-4">
                          <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-200">
                            <FileText size={32} />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-900">No {activeTab} requests</p>
                            <p className="text-xs text-slate-500">Wait for residents to submit via portal</p>
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredRequests.map((req) => (
                      <TableRow key={req.id} className="hover:bg-slate-50/50 transition-colors group">
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-slate-900 font-black text-[10px]">
                              {req.userName?.[0] || 'R'}
                            </div>
                            <p className="text-sm font-bold text-slate-900 uppercase tracking-tighter">{req.userName}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className="bg-indigo-50 text-indigo-700 border-indigo-100 font-bold uppercase text-[9px] tracking-widest">
                            {req.documentType}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <p className="text-xs text-slate-600 line-clamp-1 max-w-[200px]">{req.purpose}</p>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                            <Calendar size={14} className="text-slate-300" />
                            {req.createdAt?.toDate?.() ? req.createdAt.toDate().toLocaleDateString() : 'Just now'}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={cn(
                            "text-[9px] uppercase font-black tracking-widest border-2",
                            req.status === 'Approved' ? "border-emerald-200 text-emerald-600 bg-emerald-50" :
                            req.status === 'Rejected' ? "border-red-200 text-red-600 bg-red-50" :
                            "border-amber-200 text-amber-600 bg-amber-50"
                          )}>
                            {req.status || 'Pending'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            {req.status !== 'Approved' && req.status !== 'Rejected' && (
                              <>
                                <Button 
                                  size="icon" 
                                  variant="ghost" 
                                  className="h-9 w-9 text-emerald-600 hover:bg-emerald-50 rounded-xl"
                                  onClick={() => handleStatusUpdate(req.id, 'Approved')}
                                  title="Approve"
                                >
                                  <CheckCircle2 size={18} />
                                </Button>
                                <Button 
                                  size="icon" 
                                  variant="ghost" 
                                  className="h-9 w-9 text-red-500 hover:bg-red-50 rounded-xl"
                                  onClick={() => handleStatusUpdate(req.id, 'Rejected')}
                                  title="Reject"
                                >
                                  <XCircle size={18} />
                                </Button>
                              </>
                            )}
                            <DropdownMenu>
                              <DropdownMenuTrigger render={
                                <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl text-slate-400">
                                  <MoreHorizontal size={18} />
                                </Button>
                              } />
                              <DropdownMenuContent align="end" className="w-48 rounded-2xl">
                                <DropdownMenuLabel className="text-[10px] font-black uppercase text-slate-400 h-8 flex items-center">Request Options</DropdownMenuLabel>
                                <DropdownMenuItem className="font-bold text-xs gap-2"><Eye size={14} /> View Details</DropdownMenuItem>
                                <DropdownMenuItem className="font-bold text-xs gap-2"><Printer size={14} /> Print Document</DropdownMenuItem>
                                <DropdownMenuItem className="font-bold text-xs gap-2"><ArrowUpRight size={14} /> View Resident</DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="font-bold text-xs gap-2 text-red-500"><AlertCircle size={14} /> Flag Issue</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </PortalLayout>
  );
}
