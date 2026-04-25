import { useEffect, useState } from 'react';
import { patientService } from '../../services';
import { Spinner } from '../../components/ui/Spinner';
import Badge from '../../components/ui/Badge';
import { FileText, ExternalLink } from 'lucide-react';

const formatDate = (d) => new Date(d).toLocaleDateString('en-IN', { dateStyle: 'medium' });
const REPORT_TYPE_COLORS = { blood_test: 'red', xray: 'blue', mri: 'purple', ct_scan: 'orange', urine_test: 'yellow', ecg: 'green', other: 'default' };

const ReportsPage = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    patientService.getReports().then((r) => setReports(r.data.data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex justify-center pt-20"><Spinner size="lg" /></div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">My Medical Reports</h1>
        <p className="text-slate-500 text-sm mt-1">{reports.length} reports on record</p>
      </div>

      {reports.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-16 text-center">
          <FileText size={48} className="text-slate-200 mx-auto mb-4" />
          <p className="text-slate-500 font-medium">No reports yet</p>
          <p className="text-slate-400 text-sm mt-1">Reports uploaded by hospitals will appear here</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reports.map((r) => (
            <div key={r._id} className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                    <FileText size={18} className="text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-800 text-sm">{r.description}</h3>
                    <p className="text-xs text-slate-500">By {r.hospitalId?.name || 'Unknown Hospital'}</p>
                  </div>
                </div>
                <Badge variant={REPORT_TYPE_COLORS[r.reportType] || 'default'}>
                  {r.reportType?.replace('_', ' ')}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">{formatDate(r.createdAt)}</span>
                <a
                  href={r.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 font-medium"
                >
                  <ExternalLink size={12} /> View File
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReportsPage;
