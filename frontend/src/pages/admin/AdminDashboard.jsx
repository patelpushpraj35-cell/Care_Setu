import { useEffect, useState } from 'react';
import { adminService } from '../../services';
import { StatCard } from '../../components/ui/Card';
import { Users, Building2, FileText, Activity, Clock } from 'lucide-react';
import { Spinner } from '../../components/ui/Spinner';
import Badge from '../../components/ui/Badge';

const formatTime = d => new Date(d).toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' });

const AdminDashboard = () => {
  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminService.getDashboard().then(r => setData(r.data.data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '5rem' }}><Spinner size="lg" /></div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

      {/* Page Header */}
      <div>
        <h1 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '.25rem' }}>Admin Dashboard</h1>
        <p style={{ fontSize: '.8125rem', color: 'var(--text-muted)' }}>System overview and recent activity</p>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px,1fr))', gap: '1rem' }}>
        <StatCard title="Total Patients"    value={data?.stats?.totalPatients    ?? 0} icon={Users}     color="blue"   />
        <StatCard title="Total Hospitals"   value={data?.stats?.totalHospitals   ?? 0} icon={Building2} color="green"  />
        <StatCard title="Reports Uploaded"  value={data?.stats?.totalReports     ?? 0} icon={FileText}  color="purple" />
        <StatCard title="Treatments Added"  value={data?.stats?.totalTreatments  ?? 0} icon={Activity}  color="orange" />
      </div>

      {/* Recent Activity */}
      <div className="cs-card" style={{ overflow: 'hidden', padding: 0 }}>
        <div className="cs-card-header">
          <span className="cs-card-title">
            <Clock size={15} style={{ color: 'var(--text-faint)' }} />
            Recent Activity
          </span>
        </div>
        <div>
          {(data?.recentActivity || []).length === 0 ? (
            <div className="cs-empty">No activity yet.</div>
          ) : (
            data.recentActivity.map(log => (
              <div
                key={log._id}
                style={{ padding: '.75rem 1.25rem', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', borderBottom: '1px solid var(--border-subtle)' }}
              >
                <div>
                  <p style={{ fontSize: '.8125rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '.125rem' }}>
                    {log.action?.replace(/_/g, ' ')}
                  </p>
                  <p style={{ fontSize: '.75rem', color: 'var(--text-muted)' }}>{log.description}</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '.5rem', flexShrink: 0 }}>
                  <Badge variant={log.role === 'admin' ? 'purple' : log.role === 'hospital' ? 'green' : 'blue'}>
                    {log.role}
                  </Badge>
                  <span style={{ fontSize: '.6875rem', color: 'var(--text-faint)', whiteSpace: 'nowrap' }}>{formatTime(log.createdAt)}</span>
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
