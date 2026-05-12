import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UserPlus, CheckCircle, ShieldCheck } from 'lucide-react';
import MainLayout from '@/src/components/layout/MainLayout';
import { db, auth, handleFirestoreError, OperationType } from '@/src/lib/firebase';
import { setDoc, doc, serverTimestamp } from 'firebase/firestore';

const formSchema = z.object({
  firstName: z.string().min(2, 'First name is too short'),
  lastName: z.string().min(2, 'Last name is too short'),
  middleName: z.string().optional(),
  birthDate: z.string().min(1, 'Birth date is required'),
  gender: z.string().min(1, 'Gender is required'),
  civilStatus: z.string().min(1, 'Civil status is required'),
  purok: z.string().min(1, 'Purok is required'),
  contactNumber: z.string().min(10, 'Enter a valid contact number'),
  bloodType: z.string().optional(),
  voterStatus: z.string().min(1, 'Voter status is required'),
});

export default function ResidentRegistration() {
  const [submitted, setSubmitted] = React.useState(false);
  const { register, handleSubmit, setValue, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: any) => {
    if (!auth.currentUser) return;
    try {
      // Save to residents collection linked to auth user
      await setDoc(doc(db, 'residents', auth.currentUser.uid), {
        ...data,
        userId: auth.currentUser.uid,
        email: auth.currentUser.email,
        registrationStatus: 'Pending',
        isApproved: false,
        createdAt: serverTimestamp(),
      });
      // Also update residents_users mapping for auth logic
      await setDoc(doc(db, 'residents_users', auth.currentUser.uid), {
        uid: auth.currentUser.uid,
        email: auth.currentUser.email,
        role: 'resident',
        department: 'citizen_portal',
        isApproved: false
      });
      setSubmitted(true);
    } catch (err: any) {
      handleFirestoreError(err, OperationType.WRITE, `residents/${auth.currentUser.uid}`);
    }
  };

  if (submitted) {
    return (
      <MainLayout>
         <div className="max-w-2xl mx-auto py-24 px-4 text-center">
            <div className="w-24 h-24 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
              <ShieldCheck size={48} />
            </div>
            <h1 className="text-4xl font-bold text-slate-900 mb-6 tracking-tight">Registration Submitted</h1>
            <p className="text-slate-600 mb-10 text-lg leading-relaxed">
              Your resident profile for <span className="font-bold text-slate-800 underline decoration-blue-500 underline-offset-4">Barangay Baluarte</span> is now being reviewed by the Secretary's office. 
              Verification usually takes 1-2 working days.
            </p>
            <div className="flex gap-4 justify-center">
               <Button className="bg-blue-600" onClick={() => window.location.href = '/'}>Go to Citizen Portal</Button>
            </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto py-12 px-4 pb-32">
        <div className="flex items-center gap-5 mb-10">
          <div className="bg-slate-900 p-4 rounded-3xl text-white shadow-xl shadow-slate-900/10">
            <UserPlus size={32} />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-slate-900 tracking-tight">Resident Registration</h1>
            <p className="text-slate-500 mt-1">Official Digital Profiling for Barangay Baluarte Members</p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Personal Info */}
          <Card className="border-slate-200 overflow-hidden shadow-sm">
            <CardHeader className="bg-slate-50 border-b border-slate-100">
              <CardTitle className="text-lg">Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="pt-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label>First Name</Label>
                  <Input {...register('firstName')} placeholder="Juan" className="border-slate-200" />
                  {errors.firstName && <p className="text-xs text-red-500">{errors.firstName.message as string}</p>}
                </div>
                <div className="space-y-2">
                  <Label>Middle Name</Label>
                  <Input {...register('middleName')} placeholder="Protacio" className="border-slate-200" />
                </div>
                <div className="space-y-2">
                  <Label>Last Name</Label>
                  <Input {...register('lastName')} placeholder="Dela Cruz" className="border-slate-200" />
                  {errors.lastName && <p className="text-xs text-red-500">{errors.lastName.message as string}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label>Birth Date</Label>
                  <Input {...register('birthDate')} type="date" className="border-slate-200" />
                  {errors.birthDate && <p className="text-xs text-red-500">{errors.birthDate.message as string}</p>}
                </div>
                <div className="space-y-2">
                  <Label>Gender</Label>
                  <Select onValueChange={(v: string) => setValue('gender', v)}>
                    <SelectTrigger className="border-slate-200"><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.gender && <p className="text-xs text-red-500">{(errors.gender.message as string) || 'Required'}</p>}
                </div>
                <div className="space-y-2">
                  <Label>Civil Status</Label>
                  <Select onValueChange={(v: string) => setValue('civilStatus', v)}>
                    <SelectTrigger className="border-slate-200"><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Single">Single</SelectItem>
                      <SelectItem value="Married">Married</SelectItem>
                      <SelectItem value="Widowed">Widowed</SelectItem>
                      <SelectItem value="Separated">Separated</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.civilStatus && <p className="text-xs text-red-500">{(errors.civilStatus.message as string) || 'Required'}</p>}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Location & Contact */}
          <Card className="border-slate-200 overflow-hidden shadow-sm">
             <CardHeader className="bg-slate-50 border-b border-slate-100">
              <CardTitle className="text-lg">Location & Contact</CardTitle>
            </CardHeader>
            <CardContent className="pt-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Purok / Area</Label>
                  <Select onValueChange={(v: string) => setValue('purok', v)}>
                    <SelectTrigger className="border-slate-200"><SelectValue placeholder="Select Purok" /></SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5, 6, 7].map(num => (
                        <SelectItem key={num} value={`Purok ${num}`}>Purok {num}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.purok && <p className="text-xs text-red-500">{errors.purok.message as string}</p>}
                </div>
                <div className="space-y-2">
                  <Label>Contact Number</Label>
                  <Input {...register('contactNumber')} placeholder="0917XXXXXXX" className="border-slate-200" />
                  {errors.contactNumber && <p className="text-xs text-red-500">{errors.contactNumber.message as string}</p>}
                </div>
              </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                   <Label>Voter Status in Baluarte</Label>
                   <Select onValueChange={(v: string) => setValue('voterStatus', v)}>
                    <SelectTrigger className="border-slate-200"><SelectValue placeholder="Are you a registered voter?" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Registered">Registered Voter</SelectItem>
                      <SelectItem value="Not Registered">Not Registered</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.voterStatus && <p className="text-xs text-red-500">{(errors.voterStatus.message as string) || 'Required'}</p>}
                </div>
                <div className="space-y-2">
                  <Label>Blood Type (Optional)</Label>
                  <Input {...register('bloodType')} placeholder="e.g. O+" className="border-slate-200" />
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 flex items-start gap-4">
             <ShieldCheck className="text-blue-600 flex-shrink-0 mt-1" size={24} />
             <div>
                <h4 className="font-bold text-slate-900 text-sm">Data Privacy Agreement</h4>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  By clicking 'Submit Registration', you agree to the collection and processing of your personal information 
                  strictly for Barangay public service and administrative purposes, in accordance with the Data Privacy Act of 2012.
                </p>
             </div>
          </div>

          <div className="flex gap-4">
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="bg-slate-900 hover:bg-slate-800 text-white flex-1 h-14 text-lg font-bold rounded-2xl shadow-xl shadow-slate-900/20"
            >
              {isSubmitting ? 'Registering...' : 'Complete Registration'}
            </Button>
            <Button type="button" variant="ghost" onClick={() => window.history.back()} className="h-14 border border-slate-200 rounded-2xl px-8">
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </MainLayout>
  );
}
