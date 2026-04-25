import { useEffect, useState } from 'react';
import { adminService } from '../../services';
import { StatCard } from '../../components/ui/Card';
import { Users, Building2, FileText, Activity, Clock } from 'lucide-react';
import { Spinner } from '../../components/ui/Spinner';
import Badge from '../../components/ui/Badge';

const formatTime = (d) => new Date(d).toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' });

const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminService.getDashboard()
      .then((r) => setData(r.data.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex justify-center pt-20"><Spinner size="lg" /></div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Admin Dashboard</h1>
        <p className="text-slate-500 text-sm mt-1">System overview and recent activity</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard title="Total Patients" value={data?.stats?.totalPatients ?? 0} icon={Users} color="blue" />
        <StatCard title="Total Hospitals" value={data?.stats?.totalHospitals ?? 0} icon={Building2} color="green" />
        <StatCard title="Reports Uploaded" value={data?.stats?.totalReports ?? 0} icon={FileText} color="purple" />
        <StatCard title="Treatments Added" value={data?.stats?.totalTreatments ?? 0} icon={Activity} color="orange" />
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2">
          <Clock size={18} className="text-slate-400" />
          <h2 className="font-semibold text-slate-800">Recent Activity</h2>
        </div>
        <div className="divide-y divide-slate-100">
          {(data?.recentActivity || []).length === 0 ? (
            <p className="text-center py-8 text-slate-400 text-sm">No activity yet.</p>
          ) : (
            data.recentActivity.map((log) => (
              <div key={log._id} className="px-6 py-3 flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-slate-800">{log.action?.replace(/_/g, ' ')}</p>
                  <p className="text-xs text-slate-500">{log.description}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Badge variant={log.role === 'admin' ? 'purple' : log.role === 'hospital' ? 'green' : 'blue'}>
                    {log.role}
                  </Badge>
                  <span className="text-xs text-slate-400">{formatTime(log.createdAt)}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
