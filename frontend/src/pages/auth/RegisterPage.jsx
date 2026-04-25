import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { authService } from '../../services';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { Heart, User, Mail, Lock, Phone, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const COMMON_CONDITIONS = ['Diabetes', 'Hypertension', 'Asthma', 'Heart Disease', 'Thyroid', 'Arthritis', 'Cancer', 'Kidney Disease', 'Liver Disease', 'HIV/AIDS'];

const RegisterPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    name: '', email: '', password: '', mobileNumber: '',
    emergencyContact: { name: '', phone: '', relation: '' },
    bloodGroup: '', medicalHistory: [], aadhaarNumber: '',
    address: { street: '', city: '', state: '', pincode: '' },
    dateOfBirth: '', gender: '',
  });

  const set = (field, val) => setForm((f) => ({ ...f, [field]: val }));
  const setNested = (parent, field, val) => setForm((f) => ({ ...f, [parent]: { ...f[parent], [field]: val } }));
  const toggleCondition = (c) =>
    set('medicalHistory', form.medicalHistory.includes(c) ? form.medicalHistory.filter((x) => x !== c) : [...form.medicalHistory, c]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await authService.registerPatient(form);
      login(data.data.token, data.data.user);
      toast.success('Registration successful! Welcome to CareSetu.');
      navigate('/patient/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed.');
      setStep(1);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 flex items-center justify-center p-6">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Heart size={28} className="text-blue-600 fill-blue-600" />
            <span className="text-2xl font-bold text-slate-900">CareSetu</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900">Patient Registration</h1>
          <p className="text-slate-500 text-sm mt-1">Create your free healthcare account</p>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center justify-center gap-2 mb-6">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${s <= step ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-500'}`}>
                {s}
              </div>
              {s < 3 && <div className={`h-0.5 w-12 ${s < step ? 'bg-blue-600' : 'bg-slate-200'}`} />}
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 md:p-8">
          {error && (
            <div className="flex items-center gap-2 p-3 mb-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              <AlertCircle size={16} /> {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Step 1: Basic Info */}
            {step === 1 && (
              <div className="space-y-4">
                <h2 className="font-semibold text-slate-800 mb-4">Basic Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input id="name" label="Full Name" required icon={User} placeholder="Rahul Sharma"
                    value={form.name} onChange={(e) => set('name', e.target.value)} />
                  <Input id="email" type="email" label="Email Address" required icon={Mail} placeholder="rahul@example.com"
                    value={form.email} onChange={(e) => set('email', e.target.value)} />
                  <Input id="password" type="password" label="Password" required icon={Lock} placeholder="Min 6 characters"
                    value={form.password} onChange={(e) => set('password', e.target.value)} />
                  <Input id="mobile" label="Mobile Number" required icon={Phone} placeholder="9876543210"
                    value={form.mobileNumber} onChange={(e) => set('mobileNumber', e.target.value)} />
                  <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium text-slate-700">Date of Birth</label>
                    <input type="date" className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={form.dateOfBirth} onChange={(e) => set('dateOfBirth', e.target.value)} />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium text-slate-700">Gender</label>
                    <select className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={form.gender} onChange={(e) => set('gender', e.target.value)}>
                      <option value="">Select gender</option>
                      <option>Male</option><option>Female</option><option>Other</option>
                    </select>
                  </div>
                </div>
                <Button type="button" fullWidth onClick={() => { if (!form.name || !form.email || !form.password || !form.mobileNumber) { setError('Please fill all required fields.'); return; } setError(''); setStep(2); }}>
                  Next →
                </Button>
              </div>
            )}

            {/* Step 2: Medical Info */}
            {step === 2 && (
              <div className="space-y-4">
                <h2 className="font-semibold text-slate-800 mb-4">Medical Information</h2>
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-slate-700">Blood Group <span className="text-red-500">*</span></label>
                  <div className="grid grid-cols-4 gap-2">
                    {BLOOD_GROUPS.map((bg) => (
                      <button key={bg} type="button" onClick={() => set('bloodGroup', bg)}
                        className={`py-2 rounded-lg text-sm font-medium border transition-colors ${form.bloodGroup === bg ? 'bg-blue-600 text-white border-blue-600' : 'border-slate-300 text-slate-700 hover:bg-slate-50'}`}>
                        {bg}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-slate-700">Medical History (select all that apply)</label>
                  <div className="flex flex-wrap gap-2">
                    {COMMON_CONDITIONS.map((c) => (
                      <button key={c} type="button" onClick={() => toggleCondition(c)}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${form.medicalHistory.includes(c) ? 'bg-blue-600 text-white border-blue-600' : 'border-slate-300 text-slate-600 hover:bg-slate-50'}`}>
                        {c}
                      </button>
                    ))}
                  </div>
                </div>
                <Input id="aadhaar" label="Aadhaar Number" placeholder="12-digit Aadhaar (stored securely)"
                  helper="Your Aadhaar will be masked in the system" maxLength={12}
                  value={form.aadhaarNumber} onChange={(e) => set('aadhaarNumber', e.target.value)} />
                <div className="flex gap-3 pt-2">
                  <Button type="button" variant="secondary" fullWidth onClick={() => setStep(1)}>← Back</Button>
                  <Button type="button" fullWidth onClick={() => { if (!form.bloodGroup) { setError('Please select a blood group.'); return; } setError(''); setStep(3); }}>Next →</Button>
                </div>
              </div>
            )}

            {/* Step 3: Contact & Emergency */}
            {step === 3 && (
              <div className="space-y-4">
                <h2 className="font-semibold text-slate-800 mb-4">Contact & Emergency Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input id="ec-name" label="Emergency Contact Name" required placeholder="Father/Mother/Spouse"
                    value={form.emergencyContact.name} onChange={(e) => setNested('emergencyContact', 'name', e.target.value)} />
                  <Input id="ec-phone" label="Emergency Contact Phone" required placeholder="9876543210"
                    value={form.emergencyContact.phone} onChange={(e) => setNested('emergencyContact', 'phone', e.target.value)} />
                  <Input id="ec-rel" label="Relation" placeholder="Father / Spouse / Friend"
                    value={form.emergencyContact.relation} onChange={(e) => setNested('emergencyContact', 'relation', e.target.value)} />
                  <Input id="city" label="City" placeholder="New Delhi"
                    value={form.address.city} onChange={(e) => setNested('address', 'city', e.target.value)} />
                  <Input id="state" label="State" placeholder="Delhi"
                    value={form.address.state} onChange={(e) => setNested('address', 'state', e.target.value)} />
                  <Input id="pincode" label="Pincode" placeholder="110001" maxLength={6}
                    value={form.address.pincode} onChange={(e) => setNested('address', 'pincode', e.target.value)} />
                </div>
                <div className="flex gap-3 pt-2">
                  <Button type="button" variant="secondary" fullWidth onClick={() => setStep(2)}>← Back</Button>
                  <Button type="submit" fullWidth loading={loading} variant="success">
                    Create Account ✓
                  </Button>
                </div>
              </div>
            )}
          </form>
        </div>

        <p className="text-center text-sm text-slate-600 mt-4">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-600 font-semibold hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
