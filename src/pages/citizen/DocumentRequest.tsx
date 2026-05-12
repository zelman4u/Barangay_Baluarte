import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { FileText, Send, CheckCircle } from 'lucide-react';
import MainLayout from '@/src/components/layout/MainLayout';
import { db, auth, handleFirestoreError, OperationType } from '@/src/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const formSchema = z.object({
  documentType: z.string().min(1, 'Please select a document type'),
  purpose: z.string().min(10, 'Please provide a detailed purpose (min 10 chars)'),
  deliveryMethod: z.string().min(1, 'Please select a delivery method'),
  additionalNotes: z.string().optional(),
});

export default function DocumentRequest() {
  const [submitted, setSubmitted] = React.useState(false);
  const { register, handleSubmit, setValue, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: any) => {
    try {
      await addDoc(collection(db, 'document_requests'), {
        ...data,
        userId: auth.currentUser?.uid,
        userName: auth.currentUser?.displayName,
        status: 'Pending',
        createdAt: serverTimestamp(),
      });
      setSubmitted(true);
    } catch (err: any) {
      handleFirestoreError(err, OperationType.CREATE, 'document_requests');
    }
  };

  if (submitted) {
    return (
      <MainLayout>
        <div className="max-w-2xl mx-auto py-20 px-4 text-center">
          <div>
            <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle size={40} />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 mb-4">Request Submitted Successfully!</h1>
            <p className="text-slate-500 mb-8">
              Your request for a {formSchema.parse({}).documentType} has been received. 
              You will receive an email and SMS notification once it is ready for pickup or delivery.
            </p>
            <Button variant="outline" onClick={() => window.location.href = '/'}>Back to Home</Button>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto py-12 px-4">
        <div className="flex items-center gap-4 mb-8">
          <div className="bg-blue-600 p-3 rounded-2xl text-white shadow-lg">
            <FileText size={28} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Document Request</h1>
            <p className="text-slate-500 text-sm">Official certificates and clearances from Barangay Baluarte</p>
          </div>
        </div>

        <Card className="border-slate-200">
          <CardHeader>
            <CardTitle>Request Details</CardTitle>
            <CardDescription>Fill out the form below to process your request.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Document Type</Label>
                  <Select onValueChange={(val: string) => setValue('documentType', val)}>
                    <SelectTrigger className="border-slate-200 bg-slate-50/50">
                      <SelectValue placeholder="Select document..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Brgy Clearance">Barangay Clearance</SelectItem>
                      <SelectItem value="Certificate of Indigency">Certificate of Indigency</SelectItem>
                      <SelectItem value="Certificate of Residency">Certificate of Residency</SelectItem>
                      <SelectItem value="Cedula">Brgy Cedula (CTC)</SelectItem>
                      <SelectItem value="First Time Job Seeker">First Time Job Seeker Certification</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.documentType && <p className="text-xs text-red-500">{(errors.documentType.message as string) || 'Required'}</p>}
                </div>

                <div className="space-y-2">
                  <Label>Delivery Method</Label>
                  <Select onValueChange={(val: string) => setValue('deliveryMethod', val)}>
                    <SelectTrigger className="border-slate-200 bg-slate-50/50">
                      <SelectValue placeholder="Select method..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Pick-up">Pick-up at Brgy Hall</SelectItem>
                      <SelectItem value="E-copy">E-copy (Email/PDF)</SelectItem>
                      <SelectItem value="Home Delivery">Purok Home Delivery (Senior/PWD only)</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.deliveryMethod && <p className="text-xs text-red-500">{(errors.deliveryMethod.message as string) || 'Required'}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Purpose of Request</Label>
                <Textarea 
                  {...register('purpose')}
                  placeholder="e.g. For employment, scholarship, bank transaction..." 
                  className="min-h-[100px] border-slate-200 bg-slate-50/50"
                />
                {errors.purpose && <p className="text-xs text-red-500">{errors.purpose.message as string}</p>}
              </div>

              <div className="space-y-2">
                <Label>Additional Notes (Optional)</Label>
                <Textarea 
                  {...register('additionalNotes')}
                  placeholder="Any special instructions..." 
                  className="min-h-[80px] border-slate-200 bg-slate-50/50"
                />
              </div>

              <div className="pt-4 flex flex-col sm:flex-row gap-4">
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="bg-blue-600 hover:bg-blue-700 flex-1 h-12 shadow-md shadow-blue-500/10"
                >
                  {isSubmitting ? 'Processing...' : (
                    <>Submit Request <Send size={16} className="ml-2" /></>
                  )}
                </Button>
                <Button variant="ghost" type="button" onClick={() => window.history.back()} className="h-12 border border-slate-200">
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Requirements Tip */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-50 p-4 rounded-xl border border-dashed border-slate-200">
             <h4 className="text-xs font-bold text-slate-500 mb-2 uppercase tracking-tight">Requirement</h4>
             <p className="text-sm text-slate-600">Valid ID needed for verification upon pickup.</p>
          </div>
          <div className="bg-slate-50 p-4 rounded-xl border border-dashed border-slate-200">
             <h4 className="text-xs font-bold text-slate-500 mb-2 uppercase tracking-tight">Processing</h4>
             <p className="text-sm text-slate-600">Most documents are processed within 24 hours.</p>
          </div>
          <div className="bg-slate-50 p-4 rounded-xl border border-dashed border-slate-200">
             <h4 className="text-xs font-bold text-slate-500 mb-2 uppercase tracking-tight">Security</h4>
             <p className="text-sm text-slate-600">Documents feature a unique verification QR code.</p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
