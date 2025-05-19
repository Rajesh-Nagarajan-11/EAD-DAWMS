import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables. Please connect to Supabase first.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  
  return { data, error };
}

export async function signUp(email: string, password: string, userData: any) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: userData,
    },
  });
  
  return { data, error };
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  return { error };
}

export async function getCurrentUser() {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

// Assets
export async function getAssets() {
  const { data, error } = await supabase
    .from('assets')
    .select('*')
    .order('createdAt', { ascending: false });
  
  return { data, error };
}

export async function getAssetById(id: string) {
  const { data, error } = await supabase
    .from('assets')
    .select('*')
    .eq('id', id)
    .single();
  
  return { data, error };
}

// Warranties
export async function getWarranties(assetId?: string) {
  let query = supabase
    .from('warranties')
    .select('*')
    .order('endDate', { ascending: true });
  
  if (assetId) {
    query = query.eq('assetId', assetId);
  }
  
  const { data, error } = await query;
  return { data, error };
}

// Maintenance
export async function getMaintenanceTasks(assetId?: string) {
  let query = supabase
    .from('maintenance_tasks')
    .select('*')
    .order('scheduledDate', { ascending: true });
  
  if (assetId) {
    query = query.eq('assetId', assetId);
  }
  
  const { data, error } = await query;
  return { data, error };
}

// Compliance
export async function getComplianceRecords(assetId?: string) {
  let query = supabase
    .from('compliance_records')
    .select('*')
    .order('dueDate', { ascending: true });
  
  if (assetId) {
    query = query.eq('assetId', assetId);
  }
  
  const { data, error } = await query;
  return { data, error };
}

// Depreciation
export const getDepreciationRecords = async (assetId: string) => {
  if (!assetId) {
    return { data: [], error: null };
  }

  try {
    const { data, error } = await supabase
      .from('depreciation_records')
      .select('*')
      .eq('asset_id', assetId)
      .order('year', { ascending: true })
      .order('month', { ascending: true });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error fetching depreciation records:', error);
    return { data: [], error };
  }
};