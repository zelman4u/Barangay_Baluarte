import React, { useState, useEffect } from 'react';
import PortalLayout from '@/src/components/layout/PortalLayout';
import { cn } from '@/lib/utils';
import { 
  Users, Search, UserPlus, Filter, Download as DownloadIcon, 
  MoreHorizontal, Edit, Trash2, Eye, MapPin, 
  Phone, Mail, Calendar, CreditCard, CheckCircle2, XCircle
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
import { collection, query, onSnapshot, orderBy, limit, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/src/lib/firebase';
import { motion } from 'motion/react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';

export default function Residents() {
  const [residents, setResidents] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  // New Resident State
  const [newResident, setNewResident] = useState({
    firstName: '',
    lastName: '',
    middleName: '',
    purok: 'Purok 1',
    gender: 'Male',
    civilStatus: 'Single',
    birthDate: '',
    contactNumber: '',
    voterStatus: 'Yes'
  });

  useEffect(() => {
    const q = query(collection(db, 'residents'), orderBy('lastName'), limit(100));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setResidents(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleAddResident = async () => {
    try {
      await addDoc(collection(db, 'residents'), {
        ...newResident,
        isVerified: true,
        createdAt: serverTimestamp(),
      });
      setIsAddDialogOpen(false);
      setNewResident({
        firstName: '',
        lastName: '',
        middleName: '',
        purok: 'Purok 1',
        gender: 'Male',
        civilStatus: 'Single',
        birthDate: '',
        contactNumber: '',
        voterStatus: 'Yes'
      });
    } catch (error) {
      console.error("Error adding resident:", error);
    }
  };

  const filteredResidents = residents.filter(r => 
    `${r.firstName} ${r.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.purok?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <PortalLayout>
      <div className="space-y-6">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
              <div className="p-2 bg-indigo-100 rounded-xl text-indigo-600">
                <Users size={28} />
              </div>
              Resident Information
            </h2>
            <p className="text-sm font-medium text-slate-500 mt-1">
              Management and Master List of Barangay Baluarte Residents
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" className="h-11 px-4 rounded-xl border-slate-200">
              <DownloadIcon size={18} className="mr-2" /> Export
            </Button>
            
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger render={
                <Button className="h-11 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-900/20 font-bold">
                  <UserPlus size={18} className="mr-2" /> Add Resident
                </Button>
              } />
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle className="text-xl font-bold">New Resident Profile</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input id="firstName" value={newResident.firstName} onChange={e => setNewResident({...newResident, firstName: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input id="lastName" value={newResident.lastName} onChange={e => setNewResident({...newResident, lastName: e.target.value})} />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="birthDate">Birth Date</Label>
                      <Input id="birthDate" type="date" value={newResident.birthDate} onChange={e => setNewResident({...newResident, birthDate: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="purok">Purok</Label>
                      <select 
                        id="purok" 
                        className="w-full h-10 px-3 rounded-md border border-slate-200 text-sm"
                        value={newResident.purok}
                        onChange={e => setNewResident({...newResident, purok: e.target.value})}
                      >
                        {[1,2,3,4,5,6,7].map(n => <option key={n} value={`Purok ${n}`}>Purok {n}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="gender">Gender</Label>
                      <select 
                        id="gender" 
                        className="w-full h-10 px-3 rounded-md border border-slate-200 text-sm"
                        value={newResident.gender}
                        onChange={e => setNewResident({...newResident, gender: e.target.value})}
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contact">Contact Number</Label>
                      <Input id="contact" value={newResident.contactNumber} onChange={e => setNewResident({...newResident, contactNumber: e.target.value})} />
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
                  <Button onClick={handleAddResident} className="bg-indigo-600 hover:bg-indigo-700">Save Resident</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { label: 'Total Population', value: residents.length.toLocaleString(), icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
            { label: 'Registered Voters', value: residents.filter(r => r.voterStatus === 'Yes').length.toLocaleString(), icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
            { label: 'Male Residents', value: residents.filter(r => r.gender === 'Male').length.toLocaleString(), icon: CreditCard, color: 'text-indigo-600', bg: 'bg-indigo-50' },
            { label: 'Female Residents', value: residents.filter(r => r.gender === 'Female').length.toLocaleString(), icon: CreditCard, color: 'text-rose-600', bg: 'bg-rose-50' },
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

        {/* Main Content Area */}
        <Card className="border-slate-200 shadow-sm overflow-hidden">
          <CardHeader className="bg-white border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4 p-6">
            <div className="flex-1 max-w-md relative pb-4 md:pb-0">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <Input 
                placeholder="Search by name or purok..." 
                className="pl-10 h-11 border-slate-200 rounded-xl"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="rounded-lg">
                <Filter size={16} className="mr-2" /> Filter
              </Button>
            </div>
          </CardHeader>
          
          <Table>
            <TableHeader className="bg-slate-50/50">
              <TableRow>
                <TableHead className="font-bold text-slate-900">Name</TableHead>
                <TableHead className="font-bold text-slate-900">Purok</TableHead>
                <TableHead className="font-bold text-slate-900">Age / Gender</TableHead>
                <TableHead className="font-bold text-slate-900">Status</TableHead>
                <TableHead className="font-bold text-slate-900">Contact</TableHead>
                <TableHead className="text-right font-bold text-slate-900">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-64 text-center">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <div className="w-8 h-8 rounded-full border-4 border-slate-200 border-t-indigo-600 animate-spin" />
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Loading Masterlist...</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : filteredResidents.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-64 text-center">
                    <div className="flex flex-col items-center justify-center gap-4">
                      <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-300">
                        <Users size={32} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900">No residents found</p>
                        <p className="text-xs text-slate-500">Try adjusting your search filters</p>
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredResidents.map((resident) => {
                  const age = resident.birthDate ? new Date().getFullYear() - new Date(resident.birthDate).getFullYear() : 'N/A';
                  return (
                    <TableRow key={resident.id} className="hover:bg-slate-50/50 transition-colors group">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-xs ring-2 ring-white">
                            {resident.firstName?.[0]}{resident.lastName?.[0]}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-900 uppercase tracking-tight">{resident.lastName}, {resident.firstName}</p>
                            <p className="text-[10px] text-slate-400 font-medium">UID: {resident.id.slice(0, 8)}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-white text-slate-600 border-slate-200 font-bold uppercase text-[9px] tracking-widest">
                          {resident.purok || 'Unassigned'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="text-xs font-bold text-slate-700">{age} yrs old</span>
                          <span className="text-[10px] text-slate-400 font-medium">{resident.gender}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1.5">
                          {resident.voterStatus === 'Yes' ? (
                            <Badge className="bg-emerald-50 text-emerald-600 border-emerald-100 text-[10px] uppercase font-bold">Voter</Badge>
                          ) : (
                            <Badge variant="outline" className="text-[10px] uppercase font-bold text-slate-400">Non-Voter</Badge>
                          )}
                          {resident.isVerified && (
                             <CheckCircle2 size={14} className="text-blue-500" />
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                         <div className="flex flex-col gap-1">
                          {resident.contactNumber && (
                            <div className="flex items-center gap-1 text-[10px] font-bold text-slate-500">
                              <Phone size={10} className="text-slate-300" /> {resident.contactNumber}
                            </div>
                          )}
                          {resident.email && (
                            <div className="flex items-center gap-1 text-[10px] font-bold text-slate-500">
                              <Mail size={10} className="text-slate-300" /> {resident.email}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger render={
                            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-slate-400 hover:text-indigo-600">
                              <MoreHorizontal size={18} />
                            </Button>
                          } />
                          <DropdownMenuContent align="end" className="w-48 rounded-xl">
                            <DropdownMenuLabel className="text-[10px] font-black uppercase tracking-widest text-slate-400 h-8 flex items-center">Manage Resident</DropdownMenuLabel>
                            <DropdownMenuItem className="gap-2 font-bold text-xs"><Eye size={14} /> Full Profile</DropdownMenuItem>
                            <DropdownMenuItem className="gap-2 font-bold text-xs"><Edit size={14} /> Edit Data</DropdownMenuItem>
                            <DropdownMenuItem className="gap-2 font-bold text-xs"><CreditCard size={14} /> Issue Clearance</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="gap-2 font-bold text-xs text-red-600 focus:text-red-700 focus:bg-red-50"><Trash2 size={14} /> Remove Resident</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </Card>
      </div>
    </PortalLayout>
  );
}
