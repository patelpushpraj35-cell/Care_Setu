import { useEffect, useState } from 'react';
import { adminService } from '../../services';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Modal from '../../components/ui/Modal';
import Badge from '../../components/ui/Badge';
import { Spinner } from '../../components/ui/Spinner';
import { Building2, Plus, ToggleLeft, ToggleRight, MapPin, Phone } from 'lucide-react';
import toast from 'react-hot-toast';

const HospitalsPage = () => {
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '', hospitalName: '', registrationNumber: '', phone: '', city: '', state: '' });

  const load = () => adminService.getAllHospitals().then((r) => setHospitals(r.data.data)).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const handleRegister = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await adminService.registerHospital({
        ...form,
        address: { city: form.city, state: form.state },
      });
      toast.success('Hospital registered successfully!');
      setModalOpen(false);
      setForm({ name: '', email: '', password: '', hospitalName: '', registrationNumber: '', phone: '', city: '', state: '' });
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggle = async (id) => {
    try {
      await adminService.toggleHospital(id);
      toast.success('Status updated');
      load();
    } catch { toast.error('Failed to update status'); }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Hospital Management</h1>
          <p className="text-slate-500 text-sm mt-1">{hospitals.length} hospitals registered</p>
        </div>
        <Button icon={Plus} onClick={() => setModalOpen(true)}>Register Hospital</Button>
      </div>

      {loading ? (
        <div className="flex justify-center pt-20"><Spinner size="lg" /></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {hospitals.map((h) => (
            <div key={h._id} className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                    <Building2 size={20} className="text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-800 text-sm">{h.profile?.hospitalName || h.name}</h3>
                    <p className="text-xs text-slate-500">{h.email}</p>
                  </div>
                </div>
                <Badge variant={h.isActive ? 'green' : 'red'}>{h.isActive ? 'Active' : 'Inactive'}</Badge>
              </div>
              {h.profile && (
                <div className="space-y-1">
                  {h.profile.address?.city && (
                    <p className="text-xs text-slate-500 flex items-center gap-1">
                      <MapPin size={12} />{h.profile.address.city}, {h.profile.address.state}
                    </p>
                  )}
                  {h.profile.phone && (
                    <p className="text-xs text-slate-500 flex items-center gap-1"><Phone size={12} />{h.profile.phone}</p>
                  )}
                  <p className="text-xs text-slate-400">Reg: {h.profile.registrationNumber}</p>
                </div>
              )}
              <button
                onClick={() => handleToggle(h._id)}
                className={`w-full flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-medium border transition-colors ${h.isActive ? 'border-red-200 text-red-600 hover:bg-red-50' : 'border-green-200 text-green-600 hover:bg-green-50'}`}
              >
                {h.isActive ? <><ToggleRight size={14} /> Deactivate</> : <><ToggleLeft size={14} /> Activate</>}
              </button>
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Register New Hospital">
        <form onSubmit={handleRegister} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input id="h-name" label="Contact Name" required placeholder="Admin Name"
              value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <Input id="h-hname" label="Hospital Name" required placeholder="AIIMS Delhi"
              value={form.hospitalName} onChange={(e) => setForm({ ...form, hospitalName: e.target.value })} />
            <Input id="h-email" type="email" label="Email" required placeholder="hospital@email.com"
              value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            <Input id="h-pass" type="password" label="Password" required placeholder="Min 6 characters"
              value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
            <Input id="h-reg" label="Registration No." required placeholder="AIIMS-DL-001"
              value={form.registrationNumber} onChange={(e) => setForm({ ...form, registrationNumber: e.target.value })} />
            <Input id="h-phone" label="Phone" placeholder="011-12345678"
              value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            <Input id="h-city" label="City" placeholder="New Delhi"
              value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
            <Input id="h-state" label="State" placeholder="Delhi"
              value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} />
          </div>
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="secondary" fullWidth onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button type="submit" fullWidth loading={submitting}>Register Hospital</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default HospitalsPage;
