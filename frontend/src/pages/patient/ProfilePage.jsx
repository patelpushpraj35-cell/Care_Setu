import { useEffect, useState } from 'react';
import { patientService } from '../../services';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { Spinner } from '../../components/ui/Spinner';
import { User, Save, Phone, MapPin } from 'lucide-react';
import toast from 'react-hot-toast';

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const COMMON_CONDITIONS = ['Diabetes', 'Hypertension', 'Asthma', 'Heart Disease', 'Thyroid', 'Arthritis', 'Cancer', 'Kidney Disease'];

const PatientProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({});

  useEffect(() => {
    patientService.getProfile().then((r) => {
      setUser(r.data.data.user);
      setProfile(r.data.data.profile);
      const p = r.data.data.profile;
      setForm({
        name: r.data.data.user.name,
        mobileNumber: p?.mobileNumber || '',
        bloodGroup: p?.bloodGroup || '',
        medicalHistory: p?.medicalHistory || [],
        city: p?.address?.city || '',
        state: p?.address?.state || '',
        pincode: p?.address?.pincode || '',
        ecName: p?.emergencyContact?.name || '',
        ecPhone: p?.emergencyContact?.phone || '',
        ecRelation: p?.emergencyContact?.relation || '',
      });
    }).finally(() => setLoading(false));
  }, []);

  const toggle = (c) => setForm((f) => ({
    ...f, medicalHistory: f.medicalHistory.includes(c) ? f.medicalHistory.filter((x) => x !== c) : [...f.medicalHistory, c]
  }));

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await patientService.updateProfile({
        name: form.name,
        mobileNumber: form.mobileNumber,
        bloodGroup: form.bloodGroup,
        medicalHistory: form.medicalHistory,
        address: { city: form.city, state: form.state, pincode: form.pincode },
        emergencyContact: { name: form.ecName, phone: form.ecPhone, relation: form.ecRelation },
      });
      toast.success('Profile updated successfully!');
    } catch {
      toast.error('Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="flex justify-center pt-20"><Spinner size="lg" /></div>;

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">My Profile</h1>
        <p className="text-slate-500 text-sm mt-1">Manage your personal and medical information</p>
      </div>

      {/* Avatar */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center text-white text-2xl font-bold">
          {user?.name?.[0]}
        </div>
        <div>
          <h2 className="text-lg font-bold text-slate-900">{user?.name}</h2>
          <p className="text-slate-500 text-sm">{user?.email}</p>
          <p className="text-xs text-blue-600 font-medium mt-0.5">Patient Account</p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-5">
        {/* Basic */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4">
          <h3 className="font-semibold text-slate-800 flex items-center gap-2"><User size={16} />Basic Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input id="name" label="Full Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <Input id="mobile" label="Mobile" icon={Phone} value={form.mobileNumber} onChange={(e) => setForm({ ...form, mobileNumber: e.target.value })} />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700">Blood Group</label>
            <div className="flex flex-wrap gap-2 mt-2">
              {BLOOD_GROUPS.map((bg) => (
                <button key={bg} type="button" onClick={() => setForm({ ...form, bloodGroup: bg })}
                  className={`px-4 py-1.5 rounded-lg text-sm font-medium border transition-colors ${form.bloodGroup === bg ? 'bg-blue-600 text-white border-blue-600' : 'border-slate-300 text-slate-700 hover:bg-slate-50'}`}>
                  {bg}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700">Medical History</label>
            <div className="flex flex-wrap gap-2 mt-2">
              {COMMON_CONDITIONS.map((c) => (
                <button key={c} type="button" onClick={() => toggle(c)}
                  className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${form.medicalHistory?.includes(c) ? 'bg-blue-600 text-white border-blue-600' : 'border-slate-300 text-slate-600 hover:bg-slate-50'}`}>
                  {c}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Address */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4">
          <h3 className="font-semibold text-slate-800 flex items-center gap-2"><MapPin size={16} />Address</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input id="city" label="City" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
            <Input id="state" label="State" value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} />
            <Input id="pin" label="Pincode" value={form.pincode} onChange={(e) => setForm({ ...form, pincode: e.target.value })} />
          </div>
        </div>

        {/* Emergency Contact */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4">
          <h3 className="font-semibold text-slate-800">Emergency Contact</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input id="ecn" label="Name" value={form.ecName} onChange={(e) => setForm({ ...form, ecName: e.target.value })} />
            <Input id="ecp" label="Phone" value={form.ecPhone} onChange={(e) => setForm({ ...form, ecPhone: e.target.value })} />
            <Input id="ecr" label="Relation" value={form.ecRelation} onChange={(e) => setForm({ ...form, ecRelation: e.target.value })} />
          </div>
        </div>

        <Button type="submit" icon={Save} loading={saving} fullWidth size="lg">Save Changes</Button>
      </form>
    </div>
  );
};

export default PatientProfilePage;
