import { useEffect, useState } from 'react';
import { patientService } from '../../services';
import { StatCard } from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import { Spinner } from '../../components/ui/Spinner';
import { FileText, Activity, User, Droplets, Phone, MapPin } from 'lucide-react';

const formatDate = d => new Date(d).toLocaleDateString('en-IN', { dateStyle: 'medium' });

const PatientDashboard = () => {
  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    patientService.getDashboard().then(r => setData(r.data.data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '5rem' }}><Spinner size="lg" /></div>;

  const { user, profile, recentReports, recentTreatments } = data || {};

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

      {/* Welcome Banner */}
      <div className="cs-banner-blue">
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '1.375rem', fontWeight: 800, color: '#fff', marginBottom: '.25rem' }}>
              Welcome, {user?.name?.split(' ')[0]}! 👋
            </h1>
            <p style={{ color: 'rgba(255,255,255,.7)', fontSize: '.8125rem' }}>Your health dashboard is ready</p>
            {profile?.bloodGroup && (
              <div style={{ marginTop: '.75rem' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '.375rem', background: 'rgba(255,255,255,.2)', padding: '.25rem .75rem', borderRadius: '99px', fontSize: '.75rem', fontWeight: 700, color: '#fff' }}>
                  <Droplets size={12} /> {profile.bloodGroup}
                </span>
              </div>
            )}
          </div>
          <div style={{ width: '3rem', height: '3rem', borderRadius: '50%', background: 'rgba(255,255,255,.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem', fontWeight: 800, color: '#fff', flexShrink: 0 }}>
            {user?.name?.[0]}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))', gap: '1rem' }}>
        <StatCard title="My Reports"    value={recentReports?.length    ?? 0} icon={FileText} color="blue"  />
        <StatCard title="My Treatments" value={recentTreatments?.length ?? 0} icon={Activity} color="green" />
      </div>

      {/* Profile Summary */}
      {profile && (
        <div className="cs-card" style={{ padding: 0, overflow: 'hidden' }}>
          <div className="cs-card-header">
            <span className="cs-card-title"><User size={15} />Profile Summary</span>
          </div>
          <div style={{ padding: '1rem 1.25rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(130px,1fr))', gap: '.75rem' }}>
              {[
                { label: 'Mobile', icon: Phone, value: profile.mobileNumber || '—' },
                { label: 'Aadhaar', icon: null, value: profile.aadhaarMasked || 'Not provided' },
                { label: 'City', icon: MapPin, value: profile.address?.city || '—' },
                { label: 'Conditions', icon: null, value: `${profile.medicalHistory?.length || 0} recorded` },
              ].map(item => (
                <div key={item.label} style={{ background: 'var(--bg-subtle)', borderRadius: 'var(--radius)', padding: '.75rem' }}>
                  <p style={{ fontSize: '.625rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.05em', color: 'var(--text-faint)', marginBottom: '.25rem' }}>{item.label}</p>
                  <p style={{ fontSize: '.8125rem', fontWeight: 600, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '.25rem' }}>
                    {item.icon && <item.icon size={11} />}
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
            {profile.medicalHistory?.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '.375rem', marginTop: '.75rem' }}>
                {profile.medicalHistory.map(c => <Badge key={c} variant="blue">{c}</Badge>)}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Recent Reports */}
      <div className="cs-card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="cs-card-header">
          <span className="cs-card-title"><FileText size={15} />Recent Reports</span>
        </div>
        <div>
          {recentReports?.length ? recentReports.map(r => (
            <div key={r._id} style={{ padding: '.75rem 1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', borderBottom: '1px solid var(--border-subtle)' }}>
              <div>
                <p style={{ fontSize: '.8125rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '.125rem' }}>{r.description}</p>
                <p style={{ fontSize: '.75rem', color: 'var(--text-muted)' }}>By {r.hospitalId?.name}</p>
              </div>
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <Badge variant="blue">{r.reportType?.replace('_', ' ')}</Badge>
                <p style={{ fontSize: '.6875rem', color: 'var(--text-faint)', marginTop: '.25rem' }}>{formatDate(r.createdAt)}</p>
              </div>
            </div>
          )) : <div className="cs-empty">No reports yet.</div>}
        </div>
      </div>

      {/* Recent Treatments */}
      <div className="cs-card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="cs-card-header">
          <span className="cs-card-title"><Activity size={15} />Recent Treatments</span>
        </div>
        <div>
          {recentTreatments?.length ? recentTreatments.map(t => (
            <div key={t._id} style={{ padding: '.75rem 1.25rem', borderBottom: '1px solid var(--border-subtle)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '.25rem' }}>
                <p style={{ fontSize: '.8125rem', fontWeight: 600, color: 'var(--text-primary)' }}>{t.diagnosis}</p>
                <Badge variant={t.status === 'active' ? 'green' : 'default'}>{t.status}</Badge>
              </div>
              <p style={{ fontSize: '.75rem', color: 'var(--text-muted)' }}>Dr. {t.doctorName} · {t.hospitalId?.name}</p>
              <p style={{ fontSize: '.6875rem', color: 'var(--text-faint)', marginTop: '.25rem' }}>{formatDate(t.createdAt)}</p>
            </div>
          )) : <div className="cs-empty">No treatments yet.</div>}
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;
