import { useEffect, useState } from 'react';
import { hospitalService } from '../../services';
import { Spinner } from '../../components/ui/Spinner';
import Badge from '../../components/ui/Badge';
import { Users, Droplets, Phone, MapPin } from 'lucide-react';

const HospitalPatientsPage = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    hospitalService.getMyPatients().then((r) => setPatients(r.data.data)).finally(() => setLoading(false));
  }, []);

  const filtered = patients.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">My Patients</h1>
        <p className="text-slate-500 text-sm mt-1">Patients who have received care from this hospital</p>
      </div>

      <div className="relative">
        <input
          className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Search patients..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="flex justify-center pt-20"><Spinner size="lg" /></div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-16 text-center">
          <Users size={48} className="text-slate-200 mx-auto mb-4" />
          <p className="text-slate-500 font-medium">No patients yet</p>
          <p className="text-slate-400 text-sm mt-1">Scan a patient QR to add records</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((p) => (
            <div key={p._id} className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold">
                  {p.name[0]}
                </div>
                <div className="min-w-0">
                  <h3 className="font-semibold text-slate-900 truncate">{p.name}</h3>
                  <p className="text-xs text-slate-500 truncate">{p.email}</p>
                </div>
                {p.profile?.bloodGroup && (
                  <span className="ml-auto flex items-center gap-1 bg-red-50 text-red-700 px-2 py-0.5 rounded-full text-xs font-bold flex-shrink-0">
                    <Droplets size={11} />{p.profile.bloodGroup}
                  </span>
                )}
              </div>
              {p.profile && (
                <div className="space-y-1 text-xs text-slate-500">
                  {p.profile.mobileNumber && <p className="flex items-center gap-1"><Phone size={11} />{p.profile.mobileNumber}</p>}
                  {p.profile.address?.city && <p className="flex items-center gap-1"><MapPin size={11} />{p.profile.address.city}, {p.profile.address.state}</p>}
                </div>
              )}
              {p.profile?.medicalHistory?.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {p.profile.medicalHistory.slice(0, 3).map((c) => <Badge key={c} variant="blue">{c}</Badge>)}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HospitalPatientsPage;
