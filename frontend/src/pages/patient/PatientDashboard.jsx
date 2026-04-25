import { useEffect, useState } from 'react';
import { patientService } from '../../services';
import { StatCard } from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import { Spinner } from '../../components/ui/Spinner';
import { FileText, Activity, User, Droplets, Phone, MapPin } from 'lucide-react';

const formatDate = (d) => new Date(d).toLocaleDateString('en-IN', { dateStyle: 'medium' });

const PatientDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    patientService.getDashboard().then((r) => setData(r.data.data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex justify-center pt-20"><Spinner size="lg" /></div>;

  const { user, profile, recentReports, recentTreatments } = data || {};

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-500 rounded-2xl p-6 text-white">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Welcome, {user?.name?.split(' ')[0]}! 👋</h1>
            <p className="text-blue-100 mt-1 text-sm">Your health dashboard is ready</p>
            {profile?.bloodGroup && (
              <div className="flex items-center gap-2 mt-3">
                <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                  <Droplets size={14} /> {profile.bloodGroup}
                </span>
              </div>
            )}
          </div>
          <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center text-3xl font-bold">
            {user?.name?.[0]}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <StatCard title="My Reports" value={recentReports?.length ?? 0} icon={FileText} color="blue" />
        <StatCard title="My Treatments" value={recentTreatments?.length ?? 0} icon={Activity} color="green" />
      </div>

      {/* Profile Summary */}
      {profile && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
          <h2 className="font-semibold text-slate-800 mb-3 flex items-center gap-2"><User size={16} />Profile Summary</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
            <div className="bg-slate-50 rounded-lg p-3">
              <p className="text-xs text-slate-500 mb-1">Mobile</p>
              <p className="font-semibold flex items-center gap-1"><Phone size={12} />{profile.mobileNumber || '—'}</p>
            </div>
            <div className="bg-slate-50 rounded-lg p-3">
              <p className="text-xs text-slate-500 mb-1">Aadhaar</p>
              <p className="font-semibold text-xs">{profile.aadhaarMasked || 'Not provided'}</p>
            </div>
            <div className="bg-slate-50 rounded-lg p-3">
              <p className="text-xs text-slate-500 mb-1">City</p>
              <p className="font-semibold flex items-center gap-1"><MapPin size={12} />{profile.address?.city || '—'}</p>
            </div>
            <div className="bg-slate-50 rounded-lg p-3">
              <p className="text-xs text-slate-500 mb-1">Conditions</p>
              <p className="font-semibold">{profile.medicalHistory?.length || 0} recorded</p>
            </div>
          </div>
          {profile.medicalHistory?.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {profile.medicalHistory.map((c) => <Badge key={c} variant="blue">{c}</Badge>)}
            </div>
          )}
        </div>
      )}

      {/* Recent Reports */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="font-semibold text-slate-800 flex items-center gap-2"><FileText size={16} />Recent Reports</h2>
        </div>
        <div className="divide-y divide-slate-100">
          {recentReports?.length ? recentReports.map((r) => (
            <div key={r._id} className="px-5 py-3 flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-slate-800">{r.description}</p>
                <p className="text-xs text-slate-500">By {r.hospitalId?.name}</p>
              </div>
              <div className="text-right flex-shrink-0">
                <Badge variant="blue">{r.reportType?.replace('_', ' ')}</Badge>
                <p className="text-xs text-slate-400 mt-1">{formatDate(r.createdAt)}</p>
              </div>
            </div>
          )) : <p className="text-center py-8 text-slate-400 text-sm">No reports yet.</p>}
        </div>
      </div>

      {/* Recent Treatments */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
        <div className="px-5 py-4 border-b border-slate-100">
          <h2 className="font-semibold text-slate-800 flex items-center gap-2"><Activity size={16} />Recent Treatments</h2>
        </div>
        <div className="divide-y divide-slate-100">
          {recentTreatments?.length ? recentTreatments.map((t) => (
            <div key={t._id} className="px-5 py-3">
              <div className="flex items-center justify-between mb-1">
                <p className="text-sm font-semibold text-slate-800">{t.diagnosis}</p>
                <Badge variant={t.status === 'active' ? 'green' : 'default'}>{t.status}</Badge>
              </div>
              <p className="text-xs text-slate-500">Dr. {t.doctorName} · {t.hospitalId?.name}</p>
              <p className="text-xs text-slate-400 mt-1">{formatDate(t.createdAt)}</p>
            </div>
          )) : <p className="text-center py-8 text-slate-400 text-sm">No treatments yet.</p>}
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;
