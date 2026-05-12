import React, { useState, useEffect } from 'react';
import PortalLayout from '@/src/components/layout/PortalLayout';
import { cn } from '@/lib/utils';
import { 
  History, Search, Plus, Filter, Download, 
  Folder, File, MoreVertical, ShieldCheck, 
  Trash2, Upload, ExternalLink, HardDrive, 
  Archive as ArchiveIcon, Lock
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
import { motion } from 'motion/react';

const mockFiles = [
  { name: 'Barangay_Annual_Budget_2023.pdf', size: '2.4 MB', type: 'PDF', date: 'Jan 12, 2024', author: 'Treasury' },
  { name: 'Resident_Health_Audit_Q4.xlsx', size: '1.1 MB', type: 'Excel', date: 'Feb 05, 2024', author: 'Health' },
  { name: 'Resolution_08_Water_Management.docx', size: '450 KB', type: 'Word', date: 'Mar 15, 2024', author: 'Council' },
  { name: 'Brgy_Development_Plan_V2.pdf', size: '5.8 MB', type: 'PDF', date: 'Apr 20, 2024', author: 'General' },
  { name: 'Personnel_Records_Encrypted.dat', size: '12.4 MB', type: 'System', date: 'May 02, 2024', author: 'Admin' },
];

export default function Archive() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredFiles = mockFiles.filter(f => f.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <PortalLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
              <div className="p-2 bg-slate-900 text-white rounded-xl">
                <ArchiveIcon size={28} />
              </div>
              Document Archiving
            </h2>
            <p className="text-sm font-medium text-slate-500 mt-1">
              Centralized Long-term Storage for Legal and Administrative Records
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" className="h-11 px-4 rounded-xl border-slate-200">
               <HardDrive size={18} className="mr-2" /> Storage Usage
            </Button>
            <Button className="h-11 px-6 rounded-xl bg-slate-900 hover:bg-slate-800 shadow-lg font-bold">
               <Upload size={18} className="mr-2" /> Upload New File
            </Button>
          </div>
        </div>

        {/* Categories Bar */}
         <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Financials', count: 124, icon: Folder, color: 'text-blue-600', bg: 'bg-blue-50' },
              { label: 'Resolutions', count: 86, icon: Folder, color: 'text-rose-600', bg: 'bg-rose-50' },
              { label: 'Residency Docs', count: 1450, icon: Folder, color: 'text-emerald-600', bg: 'bg-emerald-50' },
              { label: 'System Backups', count: 12, icon: Lock, color: 'text-slate-600', bg: 'bg-slate-50' },
            ].map((cat, i) => (
              <Card key={i} className="border-slate-200 hover:shadow-md transition-all cursor-pointer group">
                <CardContent className="pt-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`${cat.bg} ${cat.color} p-2 rounded-lg group-hover:scale-110 transition-transform`}>
                      <cat.icon size={18} />
                    </div>
                    <span className="text-xs font-black text-slate-700 uppercase tracking-tight">{cat.label}</span>
                  </div>
                  <span className="text-xs font-black text-slate-400">{cat.count}</span>
                </CardContent>
              </Card>
            ))}
          </div>

        <Card className="border-slate-200 shadow-sm overflow-hidden">
          <CardHeader className="bg-white border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4 p-6">
            <div className="flex-1 max-w-md relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <Input 
                placeholder="Search archived documents..." 
                className="pl-10 h-11 border-slate-200 rounded-xl"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
               <Badge className="bg-slate-900/10 text-slate-900 border-none font-bold py-1 px-4 text-[10px] uppercase tracking-widest">
                 System: 74% Capacity Remaining
               </Badge>
            </div>
          </CardHeader>
          
          <Table>
            <TableHeader className="bg-slate-50/50">
              <TableRow>
                <TableHead className="font-bold text-slate-900">File Name</TableHead>
                <TableHead className="font-bold text-slate-900">Size / Type</TableHead>
                <TableHead className="font-bold text-slate-900">Last Modified</TableHead>
                <TableHead className="font-bold text-slate-900">Authorizing Body</TableHead>
                <TableHead className="text-right font-bold text-slate-900">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredFiles.map((file, i) => (
                <TableRow key={i} className="hover:bg-slate-50/50 transition-colors group">
                  <TableCell>
                    <div className="flex items-center gap-3">
                       <div className="p-2 bg-slate-100 rounded-lg text-slate-500">
                          <File size={16} />
                       </div>
                       <div>
                         <p className="text-sm font-bold text-slate-900 tracking-tight">{file.name}</p>
                         <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Encrypted Storage Unit</p>
                       </div>
                    </div>
                  </TableCell>
                  <TableCell>
                     <div className="flex flex-col">
                        <span className="text-xs font-bold text-slate-700">{file.size}</span>
                        <span className="text-[10px] text-slate-400 uppercase font-black tracking-widest">{file.type} File</span>
                     </div>
                  </TableCell>
                  <TableCell className="text-xs font-bold text-slate-500">{file.date}</TableCell>
                  <TableCell>
                     <Badge variant="outline" className="text-[9px] uppercase font-black tracking-widest border-2 border-slate-200 text-slate-400">
                       {file.author} Hub
                     </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                     <div className="flex items-center justify-end gap-1 opacity-20 group-hover:opacity-100 transition-opacity">
                        <Button size="icon" variant="ghost" className="h-8 w-8 rounded-lg text-slate-400 hover:text-blue-600">
                           <Download size={16} />
                        </Button>
                        <Button size="icon" variant="ghost" className="h-8 w-8 rounded-lg text-slate-400 hover:text-emerald-600">
                           <ExternalLink size={16} />
                        </Button>
                        <Button size="icon" variant="ghost" className="h-8 w-8 rounded-lg text-slate-400 hover:text-red-500">
                           <Trash2 size={16} />
                        </Button>
                     </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-center">
             <Button variant="ghost" className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 group">
                Access Deep Storage Archive <History size={14} className="ml-2 group-hover:rotate-180 transition-transform" />
             </Button>
          </div>
        </Card>
      </div>
    </PortalLayout>
  );
}
