'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/components/AuthProvider';
import type { UserProfile, Profile, ServicePeriod, EducationRecord, EmploymentRecord, DirectDeposit, Dependent } from '@/types/profile';

export function useProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  const fetchProfile = useCallback(async () => {
    if (!user) return;
    setLoading(true);

    // The 6 direct table reads come back with the *_encrypted columns as stored
    // (ciphertext after the PII backfill, plaintext before). The two API reads
    // return those sensitive values DECRYPTED (server-side, where the key lives),
    // with a plaintext fallback during the transition. We overwrite the in-memory
    // *_encrypted fields with the decrypted plaintext so the profile page and form
    // pre-fill keep working unchanged.
    const [profileRes, serviceRes, educationRes, employmentRes, depositRes, dependentsRes, piiProfile, piiDeposit] = await Promise.all([
      supabase.from('profiles').select('*').eq('id', user.id).single(),
      supabase.from('service_periods').select('*').eq('user_id', user.id).order('sort_order'),
      supabase.from('education_history').select('*').eq('user_id', user.id).order('sort_order'),
      supabase.from('employment_history').select('*').eq('user_id', user.id).order('sort_order'),
      supabase.from('direct_deposit').select('*').eq('user_id', user.id).maybeSingle(),
      supabase.from('dependents').select('*').eq('user_id', user.id).order('sort_order'),
      fetch('/api/profile').then(r => (r.ok ? r.json() : null)).catch(() => null),
      fetch('/api/direct-deposit').then(r => (r.ok ? r.json() : null)).catch(() => null),
    ]);

    const profileRow = profileRes.data as Profile | null;
    if (profileRow && piiProfile?.ssn_decrypted != null) {
      profileRow.ssn_encrypted = piiProfile.ssn_decrypted;
    }
    if (profileRow && piiProfile?.va_file_number_decrypted != null) {
      profileRow.va_file_number = piiProfile.va_file_number_decrypted;
    }

    const directDeposit = (depositRes.data as DirectDeposit) || null;
    if (directDeposit && piiDeposit) {
      if (piiDeposit.routing_number != null) directDeposit.routing_number_encrypted = piiDeposit.routing_number;
      if (piiDeposit.account_number != null) directDeposit.account_number_encrypted = piiDeposit.account_number;
    }

    setProfile({
      profile: profileRow as Profile,
      servicePeriods: (serviceRes.data || []) as ServicePeriod[],
      educationHistory: (educationRes.data || []) as EducationRecord[],
      employmentHistory: (employmentRes.data || []) as EmploymentRecord[],
      directDeposit,
      dependents: (dependentsRes.data || []) as Dependent[],
    });

    setLoading(false);
  }, [user, supabase]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  // Every mutator returns true when the row actually saved. On failure the
  // optimistic merge is rolled back by refetching server truth, so the UI can
  // never keep showing a value the database rejected (RLS, network, etc.).
  const failAndRestore = async (error: unknown, op: string): Promise<false> => {
    console.error(`[useProfile] ${op} failed:`, error);
    await fetchProfile();
    return false;
  };

  // Optimistic update for core profile fields (no refetch on success)
  const updateProfile = async (updates: Partial<Profile>): Promise<boolean> => {
    if (!user) return false;
    setProfile(prev => prev ? { ...prev, profile: { ...prev.profile, ...updates } } : prev);
    const { error } = await supabase.from('profiles').update(updates).eq('id', user.id);
    if (error) return failAndRestore(error, 'updateProfile');
    return true;
  };

  // Service Periods
  const addServicePeriod = async (period: Partial<ServicePeriod>): Promise<boolean> => {
    if (!user) return false;
    const { error } = await supabase.from('service_periods').insert({ ...period, user_id: user.id });
    await fetchProfile(); // Need server-generated ID
    if (error) { console.error('[useProfile] addServicePeriod failed:', error); return false; }
    return true;
  };

  const updateServicePeriod = async (id: string, updates: Partial<ServicePeriod>): Promise<boolean> => {
    if (!user) return false;
    setProfile(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        servicePeriods: prev.servicePeriods.map(sp =>
          sp.id === id ? { ...sp, ...updates } : sp
        ),
      };
    });
    const { error } = await supabase.from('service_periods').update(updates).eq('id', id);
    if (error) return failAndRestore(error, 'updateServicePeriod');
    return true;
  };

  const deleteServicePeriod = async (id: string): Promise<boolean> => {
    if (!user) return false;
    const { error } = await supabase.from('service_periods').delete().eq('id', id);
    await fetchProfile();
    if (error) { console.error('[useProfile] deleteServicePeriod failed:', error); return false; }
    return true;
  };

  // Education
  const addEducation = async (record: Partial<EducationRecord>): Promise<boolean> => {
    if (!user) return false;
    const { error } = await supabase.from('education_history').insert({ ...record, user_id: user.id });
    await fetchProfile();
    if (error) { console.error('[useProfile] addEducation failed:', error); return false; }
    return true;
  };

  const updateEducation = async (id: string, updates: Partial<EducationRecord>): Promise<boolean> => {
    if (!user) return false;
    setProfile(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        educationHistory: prev.educationHistory.map(ed =>
          ed.id === id ? { ...ed, ...updates } : ed
        ),
      };
    });
    const { error } = await supabase.from('education_history').update(updates).eq('id', id);
    if (error) return failAndRestore(error, 'updateEducation');
    return true;
  };

  const deleteEducation = async (id: string): Promise<boolean> => {
    if (!user) return false;
    const { error } = await supabase.from('education_history').delete().eq('id', id);
    await fetchProfile();
    if (error) { console.error('[useProfile] deleteEducation failed:', error); return false; }
    return true;
  };

  // Employment
  const addEmployment = async (record: Partial<EmploymentRecord>): Promise<boolean> => {
    if (!user) return false;
    const { error } = await supabase.from('employment_history').insert({ ...record, user_id: user.id });
    await fetchProfile();
    if (error) { console.error('[useProfile] addEmployment failed:', error); return false; }
    return true;
  };

  const updateEmployment = async (id: string, updates: Partial<EmploymentRecord>): Promise<boolean> => {
    if (!user) return false;
    setProfile(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        employmentHistory: prev.employmentHistory.map(emp =>
          emp.id === id ? { ...emp, ...updates } : emp
        ),
      };
    });
    const { error } = await supabase.from('employment_history').update(updates).eq('id', id);
    if (error) return failAndRestore(error, 'updateEmployment');
    return true;
  };

  const deleteEmployment = async (id: string): Promise<boolean> => {
    if (!user) return false;
    const { error } = await supabase.from('employment_history').delete().eq('id', id);
    await fetchProfile();
    if (error) { console.error('[useProfile] deleteEmployment failed:', error); return false; }
    return true;
  };

  // Direct Deposit
  const updateDirectDeposit = async (deposit: Partial<DirectDeposit>): Promise<boolean> => {
    if (!user) return false;
    setProfile(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        directDeposit: prev.directDeposit
          ? { ...prev.directDeposit, ...deposit }
          : { ...deposit, user_id: user.id } as DirectDeposit,
      };
    });
    const existing = profile?.directDeposit;
    if (existing) {
      const { error } = await supabase.from('direct_deposit').update(deposit).eq('id', existing.id);
      if (error) return failAndRestore(error, 'updateDirectDeposit');
      return true;
    }
    const { error } = await supabase.from('direct_deposit').insert({ ...deposit, user_id: user.id });
    await fetchProfile(); // Need server-generated ID for future updates
    if (error) { console.error('[useProfile] updateDirectDeposit insert failed:', error); return false; }
    return true;
  };

  // Dependents
  const addDependent = async (dep: Partial<Dependent>): Promise<boolean> => {
    if (!user) return false;
    const { error } = await supabase.from('dependents').insert({ ...dep, user_id: user.id });
    await fetchProfile();
    if (error) { console.error('[useProfile] addDependent failed:', error); return false; }
    return true;
  };

  const deleteDependent = async (id: string): Promise<boolean> => {
    if (!user) return false;
    const { error } = await supabase.from('dependents').delete().eq('id', id);
    await fetchProfile();
    if (error) { console.error('[useProfile] deleteDependent failed:', error); return false; }
    return true;
  };

  return {
    profile, loading, fetchProfile,
    updateProfile,
    addServicePeriod, updateServicePeriod, deleteServicePeriod,
    addEducation, updateEducation, deleteEducation,
    addEmployment, updateEmployment, deleteEmployment,
    updateDirectDeposit,
    addDependent, deleteDependent,
  };
}
