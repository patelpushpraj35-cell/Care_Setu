import { useEffect, useState } from 'react';
import { hospitalService } from '../../services';
import { StatCard } from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import { Spinner } from '../../components/ui/Spinner';
import { FileText, Activity, Building2 } from 'lucide-react';

const formatDate = (d) => new Date(d).toLocaleDateString('en-IN', { dateStyle: 'medium' });

const HospitalDashboard = () => {
  const [data, setData] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([hospitalService.getDashboard(), hospitalService.getProfile()])
      .then(([dash, prof]) => { setData(dash.data.data); setProfile(prof.data.data.profile); })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex justify-center pt-20"><Spinner size="lg" /></div>;

  return (
    <div className="space-y-6">
      {/* Hospital Banner */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-500 rounded-2xl p-6 text-white">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-xl bg-white/20 flex items-center justify-center">
            <Building2 size={28} />
          </div>
          <div>
            <h1 className="text-2xl font-bold">{profile?.hospitalName || 'Hospital Dashboard'}</h1>
            <p className="text-emerald-100 text-sm mt-1">Reg: {profile?.registrationNumber || '—'}</p>
            {profile?.address?.city && (
              <p className="text-emerald-100 text-sm">{profile.address.city}, {profile.address.state}</p>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <StatCard title="Reports Uploaded" value={data?.reportsCount ?? 0} icon={FileText} color="blue" />
        <StatCard title="Treatments Added" value={data?.treatmentsCount ?? 0} icon={Activity} color="green" />
      </div>

      {/* Recent Reports */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
        <div className="px-5 py-4 border-b border-slate-100">
          <h2 className="font-semibold text-slate-800 flex items-center gap-2"><FileText size={16} />Recent Reports</h2>
        </div>
        <div className="divide-y divide-slate-100">
          {data?.recentReports?.length ? data.recentReports.map((r) => (
            <div key={r._id} className="px-5 py-3 flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-slate-800">{r.description}</p>
                <p className="text-xs text-slate-500">For: {r.patientId?.name}</p>
              </div>
              <p className="text-xs text-slate-400 flex-shrink-0">{formatDate(r.createdAt)}</p>
            </div>
          )) : <p className="py-8 text-center text-slate-400 text-sm">No reports yet.</p>}
        </div>
      </div>

      {/* Recent Treatments */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
        <div className="px-5 py-4 border-b border-slate-100">
          <h2 className="font-semibold text-slate-800 flex items-center gap-2"><Activity size={16} />Recent Treatments</h2>
        </div>
        <div className="divide-y divide-slate-100">
          {data?.recentTreatments?.length ? data.recentTreatments.map((t) => (
            <div key={t._id} className="px-5 py-3 flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-slate-800">{t.diagnosis}</p>
                <p className="text-xs text-slate-500">Patient: {t.patientId?.name} · Dr. {t.doctorName}</p>
              </div>
              <Badge variant={t.status === 'active' ? 'green' : 'default'}>{t.status}</Badge>
            </div>
          )) : <p className="py-8 text-center text-slate-400 text-sm">No treatments yet.</p>}
        </div>
      </div>
    </div>
  );
};

export default HospitalDashboard;
