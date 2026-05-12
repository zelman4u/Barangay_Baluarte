export type UserRole = 
  | 'super_admin'
  | 'barangay_captain'
  | 'secretary'
  | 'treasurer'
  | 'kagawad'
  | 'lupon_member'
  | 'tanod'
  | 'bhw'
  | 'sk_official'
  | 'drrm_officer'
  | 'senior_officer'
  | 'resident';

export type Department = 
  | 'administration_governance'
  | 'justice_public_safety'
  | 'health_social_welfare'
  | 'youth_drrm_environment'
  | 'citizen_portal';

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  role: UserRole;
  department: Department;
  isApproved: boolean;
  residentId?: string;
}

export interface Resident {
  id: string;
  firstName: string;
  lastName: string;
  birthDate: string;
  purok: string;
  householdId: string;
  voterStatus: boolean;
  contactNumber: string;
}
