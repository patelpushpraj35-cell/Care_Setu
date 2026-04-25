import { useEffect, useState } from 'react';
import { adminService } from '../../services';
import Modal from '../../components/ui/Modal';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import { Spinner } from '../../components/ui/Spinner';
import { User, Search, Eye, Droplets, Phone } from 'lucide-react';

const AdminPatientsPage = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);
  const [details, setDetails] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  useEffect(() => {
    adminService.getAllPatients().then((r) => setPatients(r.data.data)).finally(() => setLoading(false));
  }, []);

  const openDetails = async (patient) => {
    setSelected(patient);
    setDetailLoading(true);
    try {
      const { data } = await adminService.getPatientDetails(patient._id);
      setDetails(data.data);
    } finally {
      setDetailLoading(false);
    }
  };

  const filtered = patients.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Patient Overview</h1>
        <p className="text-slate-500 text-sm mt-1">{patients.length} registered patients</p>
      </div>

      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="flex justify-center pt-20"><Spinner size="lg" /></div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                {['Patient', 'Contact', 'Blood Group', 'Medical History', 'Actions'].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((p) => (
                <tr key={p._id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xs">
                        {p.name[0]}
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">{p.name}</p>
                        <p className="text-xs text-slate-500">{p.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    <div className="flex items-center gap-1 text-xs"><Phone size={12} />{p.profile?.mobileNumber || '—'}</div>
                  </td>
                  <td className="px-4 py-3">
                    {p.profile?.bloodGroup ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-red-50 text-red-700 text-xs font-bold rounded">
                        <Droplets size={12} />{p.profile.bloodGroup}
                      </span>
                    ) : <span className="text-slate-400 text-xs">—</span>}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {(p.profile?.medicalHistory || []).slice(0, 2).map((c) => (
                        <Badge key={c} variant="blue">{c}</Badge>
                      ))}
                      {(p.profile?.medicalHistory || []).length > 2 && (
                        <Badge variant="default">+{p.profile.medicalHistory.length - 2}</Badge>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <Button size="sm" variant="ghost" icon={Eye} onClick={() => openDetails(p)}>View</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <p className="text-center py-10 text-slate-400">No patients found.</p>
          )}
        </div>
      )}

      <Modal isOpen={!!selected} onClose={() => { setSelected(null); setDetails(null); }} title={`Patient: ${selected?.name}`} size="lg">
        {detailLoading ? (
          <div className="flex justify-center py-10"><Spinner /></div>
        ) : details ? (
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div><span className="text-slate-500">Blood Group:</span> <strong>{details.profile?.bloodGroup}</strong></div>
              <div><span className="text-slate-500">Mobile:</span> <strong>{details.profile?.mobileNumber}</strong></div>
              <div><span className="text-slate-500">City:</span> <strong>{details.profile?.address?.city || '—'}</strong></div>
              <div><span className="text-slate-500">Aadhaar:</span> <strong>{details.profile?.aadhaarMasked || '—'}</strong></div>
            </div>
            <div>
              <h3 className="font-semibold text-slate-700 mb-2">Reports ({details.reports?.length})</h3>
              {details.reports?.length ? details.reports.map((r) => (
                <div key={r._id} className="py-2 border-b border-slate-100 text-sm">
                  <span className="font-medium">{r.description}</span>
                  <span className="text-slate-400 ml-2">— {r.hospitalId?.name}</span>
                </div>
              )) : <p className="text-slate-400 text-sm">No reports</p>}
            </div>
            <div>
              <h3 className="font-semibold text-slate-700 mb-2">Treatments ({details.treatments?.length})</h3>
              {details.treatments?.length ? details.treatments.map((t) => (
                <div key={t._id} className="py-2 border-b border-slate-100 text-sm">
                  <span className="font-medium">{t.diagnosis}</span>
                  <span className="text-slate-400 ml-2">Dr. {t.doctorName}</span>
                </div>
              )) : <p className="text-slate-400 text-sm">No treatments</p>}
            </div>
          </div>
        ) : null}
      </Modal>
    </div>
  );
};

export default AdminPatientsPage;
