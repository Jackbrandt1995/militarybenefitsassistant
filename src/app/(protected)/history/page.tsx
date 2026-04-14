'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/components/AuthProvider';
import type { FormSubmission } from '@/types/profile';
import { FileText } from 'lucide-react';

export default function HistoryPage() {
  const { user } = useAuth();
  const [submissions, setSubmissions] = useState<FormSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    if (!user) return;
    supabase
      .from('form_submissions')
      .select('*')
      .eq('user_id', user.id)
      .order('generated_at', { ascending: false })
      .then(({ data }) => {
        setSubmissions((data || []) as FormSubmission[]);
        setLoading(false);
      });
  }, [user, supabase]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-700" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Form History</h1>

      {submissions.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-lg border">
          <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h2 className="text-lg font-medium text-gray-900 mb-1">No forms generated yet</h2>
          <p className="text-gray-500">When you generate a filled PDF, it will appear here.</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Form</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Date Generated</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {submissions.map(sub => (
                <tr key={sub.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-mono text-gray-600">{sub.form_id}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{sub.form_name}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(sub.generated_at).toLocaleDateString('en-US', {
                      year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
