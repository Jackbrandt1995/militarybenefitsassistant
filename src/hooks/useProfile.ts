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

    const [profileRes, serviceRes, educationRes, employmentRes, depositRes, dependentsRes] = await Promise.all([
      supabase.from('profiles').select('*').eq('id', user.id).single(),
      supabase.from('service_periods').select('*').eq('user_id', user.id).order('sort_order'),
      supabase.from('education_history').select('*').eq('user_id', user.id).order('sort_order'),
      supabase.from('employment_history').select('*').eq('user_id', user.id).order('sort_order'),
      supabase.from('direct_deposit').select('*').eq('user_id', user.id).maybeSingle(),
      supabase.from('dependents').select('*').eq('user_id', user.id).order('sort_order'),
    ]);

    setProfile({
      profile: profileRes.data as Profile,
      servicePeriods: (serviceRes.data || []) as ServicePeriod[],
      educationHistory: (educationRes.data || []) as EducationRecord[],
      employmentHistory: (employmentRes.data || []) as EmploymentRecord[],
      directDeposit: (depositRes.data as DirectDeposit) || null,
      dependents: (dependentsRes.data || []) as Dependent[],
    });

    setLoading(false);
  }, [user, supabase]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) return;
    await supabase.from('profiles').update(updates).eq('id', user.id);
    await fetchProfile();
  };

  const addServicePeriod = async (period: Partial<ServicePeriod>) => {
    if (!user) return;
    await supabase.from('service_periods').insert({ ...period, user_id: user.id });
    await fetchProfile();
  };

  const updateServicePeriod = async (id: string, updates: Partial<ServicePeriod>) => {
    if (!user) return;
    await supabase.from('service_periods').update(updates).eq('id', id);
    await fetchProfile();
  };

  const deleteServicePeriod = async (id: string) => {
    if (!user) return;
    await supabase.from('service_periods').delete().eq('id', id);
    await fetchProfile();
  };

  const addEducation = async (record: Partial<EducationRecord>) => {
    if (!user) return;
    await supabase.from('education_history').insert({ ...record, user_id: user.id });
    await fetchProfile();
  };

  const updateEducation = async (id: string, updates: Partial<EducationRecord>) => {
    if (!user) return;
    await supabase.from('education_history').update(updates).eq('id', id);
    await fetchProfile();
  };

  const deleteEducation = async (id: string) => {
    if (!user) return;
    await supabase.from('education_history').delete().eq('id', id);
    await fetchProfile();
  };

  const addEmployment = async (record: Partial<EmploymentRecord>) => {
    if (!user) return;
    await supabase.from('employment_history').insert({ ...record, user_id: user.id });
    await fetchProfile();
  };

  const updateEmployment = async (id: string, updates: Partial<EmploymentRecord>) => {
    if (!user) return;
    await supabase.from('employment_history').update(updates).eq('id', id);
    await fetchProfile();
  };

  const deleteEmployment = async (id: string) => {
    if (!user) return;
    await supabase.from('employment_history').delete().eq('id', id);
    await fetchProfile();
  };

  const updateDirectDeposit = async (deposit: Partial<DirectDeposit>) => {
    if (!user) return;
    const existing = profile?.directDeposit;
    if (existing) {
      await supabase.from('direct_deposit').update(deposit).eq('id', existing.id);
    } else {
      await supabase.from('direct_deposit').insert({ ...deposit, user_id: user.id });
    }
    await fetchProfile();
  };

  const addDependent = async (dep: Partial<Dependent>) => {
    if (!user) return;
    await supabase.from('dependents').insert({ ...dep, user_id: user.id });
    await fetchProfile();
  };

  const deleteDependent = async (id: string) => {
    if (!user) return;
    await supabase.from('dependents').delete().eq('id', id);
    await fetchProfile();
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
