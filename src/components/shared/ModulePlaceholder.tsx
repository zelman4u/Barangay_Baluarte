import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Construction } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function ModulePlaceholder({ title }: { title: string }) {
  const navigate = useNavigate();
  
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8">
      <div className="w-20 h-20 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mb-6 animate-pulse">
        <Construction size={40} />
      </div>
      <h2 className="text-3xl font-bold text-slate-900 mb-2">{title}</h2>
      <p className="text-slate-500 max-w-md mx-auto mb-8">
        This module is currently part of the Governance Engine v2.4 roadmap.
        Our engineers are working to bring these advanced capabilities to Barangay Baluarte soon.
      </p>
      <div className="flex gap-4">
        <Button 
          variant="outline" 
          onClick={() => navigate(-1)}
          className="border-slate-200"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Go Back
        </Button>
        <Button 
          className="bg-blue-600 hover:bg-blue-700"
          onClick={() => navigate('/')}
        >
          Return to Portal
        </Button>
      </div>
      
      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-3xl">
        {[
          { label: 'Cloud Database', status: 'Ready' },
          { label: 'Sidebar Integration', status: 'Active' },
          { label: 'Role-Based Access', status: 'Validated' }
        ].map(item => (
          <div key={item.label} className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{item.label}</p>
            <p className="text-xs font-bold text-emerald-600">{item.status}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
