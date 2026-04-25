import { useEffect, useState } from 'react';
import { patientService } from '../../services';
import { Spinner } from '../../components/ui/Spinner';
import Badge from '../../components/ui/Badge';
import { Activity, Calendar, User, ChevronDown, ChevronUp, Pill } from 'lucide-react';

const formatDate = (d) => new Date(d).toLocaleDateString('en-IN', { dateStyle: 'medium' });

const TreatmentCard = ({ t }) => {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-3">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="font-bold text-slate-900">{t.diagnosis}</h3>
          <p className="text-sm text-slate-500 flex items-center gap-1 mt-0.5">
            <User size={12} />Dr. {t.doctorName} · {t.hospitalId?.name}
          </p>
        </div>
        <Badge variant={t.status === 'active' ? 'green' : t.status === 'completed' ? 'blue' : 'red'}>{t.status}</Badge>
      </div>

      <p className="text-sm text-slate-700">{t.treatmentDetails}</p>

      {t.followUpDate && (
        <div className="flex items-center gap-2 text-sm text-amber-700 bg-amber-50 px-3 py-2 rounded-lg">
          <Calendar size={14} />
          Follow-up: {formatDate(t.followUpDate)}
        </div>
      )}

      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-1 text-xs text-blue-600 font-medium hover:text-blue-800"
      >
        {expanded ? <><ChevronUp size={14} />Hide details</> : <><ChevronDown size={14} />Show medications</>}
      </button>

      {expanded && (
        <div className="space-y-3 pt-2 border-t border-slate-100">
          {t.medications?.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold text-slate-600 mb-2 flex items-center gap-1"><Pill size={12} />MEDICATIONS</h4>
              <div className="space-y-2">
                {t.medications.map((m, i) => (
                  <div key={i} className="bg-slate-50 rounded-lg p-3 text-xs">
                    <p className="font-semibold text-slate-800">{m.name} — {m.dosage}</p>
                    <p className="text-slate-500">{m.frequency} · {m.duration}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
          {t.lifestyleAdvice && (
            <div>
              <h4 className="text-xs font-semibold text-slate-600 mb-2">LIFESTYLE ADVICE</h4>
              <p className="text-xs text-slate-700 bg-green-50 p-3 rounded-lg">{t.lifestyleAdvice}</p>
            </div>
          )}
        </div>
      )}

      <p className="text-xs text-slate-400">{formatDate(t.createdAt)}</p>
    </div>
  );
};

const TreatmentsPage = () => {
  const [treatments, setTreatments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    patientService.getTreatments().then((r) => setTreatments(r.data.data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex justify-center pt-20"><Spinner size="lg" /></div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">My Treatments</h1>
        <p className="text-slate-500 text-sm mt-1">{treatments.length} treatment records</p>
      </div>
      {treatments.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-16 text-center">
          <Activity size={48} className="text-slate-200 mx-auto mb-4" />
          <p className="text-slate-500 font-medium">No treatments yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {treatments.map((t) => <TreatmentCard key={t._id} t={t} />)}
        </div>
      )}
    </div>
  );
};

export default TreatmentsPage;
