import React, { useState, useEffect } from 'react';
import PortalLayout from '@/src/components/layout/PortalLayout';
import { cn } from '@/lib/utils';
import { 
  Calendar, Clock, Users, MapPin, Search, Plus, 
  Video, FileText, ChevronRight, CheckCircle2, 
  AlertCircle, History, UserCheck, MoreVertical
} from 'lucide-react';
import { 
  Card, CardContent, CardHeader, CardTitle, CardDescription 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { collection, query, onSnapshot, orderBy, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/src/lib/firebase';
import { motion, AnimatePresence } from 'motion/react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';

export default function Sessions() {
  const [sessions, setSessions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newSession, setNewSession] = useState({
    title: '',
    date: '',
    time: '',
    location: 'Session Hall',
    type: 'Regular Session',
    status: 'Scheduled'
  });

  useEffect(() => {
    const q = query(collection(db, 'sessions'), orderBy('date', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setSessions(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleCreateSession = async () => {
    try {
      await addDoc(collection(db, 'sessions'), {
        ...newSession,
        createdAt: serverTimestamp(),
      });
      setIsAddOpen(false);
    } catch (error) {
      console.error("Error creating session:", error);
    }
  };

  return (
    <PortalLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
              <div className="p-2 bg-blue-100 text-blue-600 rounded-xl">
                <Calendar size={28} />
              </div>
              Council Sessions
            </h2>
            <p className="text-sm font-medium text-slate-500 mt-1">
              Sanggunian Calendar, Agenda and Minutes Management
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" className="h-11 px-4 rounded-xl border-slate-200">
              <Video size={18} className="mr-2" /> Live Broadcast
            </Button>
            
            <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
              <DialogTrigger render={
                <Button className="h-11 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 shadow-lg font-bold">
                  <Plus size={18} className="mr-2" /> Schedule Session
                </Button>
              } />
              <DialogContent className="sm:max-w-[450px]">
                <DialogHeader>
                  <DialogTitle className="text-xl font-bold">Schedule Council Session</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="type">Session Type</Label>
                    <select 
                      id="type"
                      className="w-full h-10 px-3 rounded-md border border-slate-200 text-sm"
                      value={newSession.type}
                      onChange={e => setNewSession({...newSession, type: e.target.value})}
                    >
                      <option value="Regular Session">Regular Session</option>
                      <option value="Special Session">Special Session</option>
                      <option value="Committee Hearing">Committee Hearing</option>
                      <option value="Public Consultation">Public Consultation</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="title">Session Title / Agenda</Label>
                    <Input id="title" value={newSession.title} onChange={e => setNewSession({...newSession, title: e.target.value})} placeholder="e.g. 15th Regular Session" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="date">Date</Label>
                      <Input id="date" type="date" value={newSession.date} onChange={e => setNewSession({...newSession, date: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="time">Time</Label>
                      <Input id="time" type="time" value={newSession.time} onChange={e => setNewSession({...newSession, time: e.target.value})} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Venue</Label>
                    <Input id="location" value={newSession.location} onChange={e => setNewSession({...newSession, location: e.target.value})} />
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={handleCreateSession} className="bg-blue-600 hover:bg-blue-700 w-full font-bold">Add to Calendar</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendar View (Simplified) */}
          <div className="lg:col-span-1 space-y-4">
            <Card className="border-slate-200 shadow-sm">
              <CardHeader className="p-4 border-b border-slate-50">
                <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-400">Quick Filters</CardTitle>
              </CardHeader>
              <CardContent className="p-2">
                 {[
                   { label: 'Upcoming', count: 3, color: 'text-emerald-500', bg: 'bg-emerald-50' },
                   { label: 'Finished', count: 42, color: 'text-slate-400', bg: 'bg-slate-50' },
                   { label: 'Special Cases', count: 1, color: 'text-amber-500', bg: 'bg-amber-50' },
                 ].map((filter, i) => (
                   <button key={i} className="w-full p-3 flex items-center justify-between rounded-xl hover:bg-slate-50 transition-all text-left group">
                      <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${filter.color.replace('text', 'bg')}`} />
                        <span className="text-xs font-bold text-slate-700">{filter.label}</span>
                      </div>
                      <span className="text-[10px] font-black text-slate-400 mr-2">{filter.count}</span>
                   </button>
                 ))}
              </CardContent>
            </Card>

            <Card className="border-slate-200 bg-slate-900 shadow-lg text-white">
               <CardContent className="p-6">
                 <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-4">Current Quorum</p>
                 <div className="flex items-center gap-4 mb-6">
                   <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                     <span className="text-3xl font-black italic">11</span>
                   </div>
                   <div>
                     <p className="text-sm font-black text-emerald-400 tracking-tighter italic">REACHED</p>
                     <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Officials Present</p>
                   </div>
                 </div>
                 <Button className="w-full bg-blue-600 hover:bg-blue-700 font-bold h-10">
                   <UserCheck size={16} className="mr-2" /> Start Roll Call
                 </Button>
               </CardContent>
            </Card>
          </div>

          {/* Session List */}
          <div className="lg:col-span-2 space-y-4">
             {isLoading ? (
               <div className="h-48 flex flex-col items-center justify-center text-slate-400 text-xs font-black uppercase tracking-widest animate-pulse">
                 Accessing Archive...
               </div>
             ) : sessions.length === 0 ? (
               <Card className="border-slate-200 border-dashed border-2 bg-transparent h-64 flex flex-col items-center justify-center text-slate-400">
                  <Calendar size={48} className="mb-4 opacity-10" />
                  <p className="text-sm font-bold">No sessions found in system cycle</p>
               </Card>
             ) : (
               <div className="space-y-4">
                 {sessions.map((session) => (
                    <motion.div 
                      key={session.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <Card className="border-slate-200 hover:border-blue-200 transition-all group overflow-hidden">
                        <CardContent className="p-0">
                          <div className="flex flex-col sm:flex-row">
                             <div className="sm:w-32 bg-slate-50 border-r border-slate-100 p-4 flex flex-col items-center justify-center text-center">
                                <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-1">
                                  {session.date ? new Date(session.date).toLocaleString('default', { month: 'short' }) : 'MAY'}
                                </span>
                                <span className="text-3xl font-black text-slate-900 tracking-tighter leading-none">
                                  {session.date ? new Date(session.date).getDate() : '12'}
                                </span>
                                <span className="text-[10px] font-bold text-slate-400 mt-2">
                                  {session.time || '09:00 AM'}
                                </span>
                             </div>
                             <div className="flex-1 p-5 flex flex-col justify-between">
                                <div className="flex items-start justify-between gap-4">
                                   <div>
                                      <Badge variant="outline" className="text-[9px] uppercase font-black tracking-widest border-2 border-slate-200 text-slate-500 mb-2">{session.type}</Badge>
                                      <h3 className="font-extrabold text-slate-900 text-lg tracking-tight group-hover:text-blue-600 transition-colors">{session.title}</h3>
                                      <p className="text-xs font-medium text-slate-500 flex items-center gap-1.5 mt-1">
                                        <MapPin size={12} className="text-slate-300" /> {session.location}
                                      </p>
                                   </div>
                                   <Badge className={cn(
                                     "uppercase font-black tracking-widest text-[9px]",
                                     session.status === 'Scheduled' ? "bg-blue-600" : "bg-emerald-600"
                                   )}>
                                     {session.status}
                                   </Badge>
                                </div>
                                
                                <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-50">
                                   <div className="flex -space-x-2">
                                      {[1,2,3].map(p => (
                                        <div key={p} className="w-7 h-7 rounded-full bg-slate-200 border-2 border-white flex items-center justify-center text-[10px] font-black text-slate-500">
                                          {p}
                                        </div>
                                      ))}
                                      <div className="w-7 h-7 rounded-full bg-slate-50 border-2 border-dashed border-slate-200 flex items-center justify-center text-[8px] font-black text-slate-400">+8</div>
                                   </div>
                                   <div className="flex items-center gap-1">
                                      <Button variant="ghost" size="sm" className="h-8 rounded-lg text-[10px] font-black uppercase text-slate-400 hover:text-blue-600">
                                        <FileText size={14} className="mr-2" /> Minutes
                                      </Button>
                                      <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-slate-400">
                                        <MoreVertical size={16} />
                                      </Button>
                                      <Button size="sm" className="h-8 rounded-lg font-black text-[10px] uppercase tracking-widest bg-slate-900">
                                        Join Hub <ChevronRight size={14} className="ml-1" />
                                      </Button>
                                   </div>
                                </div>
                             </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                 ))}
               </div>
             )}
          </div>
        </div>
      </div>
    </PortalLayout>
  );
}
