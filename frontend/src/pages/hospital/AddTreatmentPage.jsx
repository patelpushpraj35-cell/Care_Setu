import { useState } from 'react';
import { hospitalService } from '../../services';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { Stethoscope, Plus, Trash2, CheckCircle, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const AddTreatmentPage = () => {
  const [form, setForm] = useState({
    patientId: '', doctorName: '', diagnosis: '', treatmentDetails: '',
    lifestyleAdvice: '', followUpDate: '', medications: [],
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const addMed = () => setForm((f) => ({
    ...f, medications: [...f.medications, { name: '', dosage: '', frequency: '', duration: '' }]
  }));
  const removeMed = (i) => setForm((f) => ({ ...f, medications: f.medications.filter((_, idx) => idx !== i) }));
  const updateMed = (i, field, val) => setForm((f) => {
    const meds = [...f.medications];
    meds[i] = { ...meds[i], [field]: val };
    return { ...f, medications: meds };
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await hospitalService.addTreatment(form);
      toast.success('Treatment added successfully!');
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add treatment.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="max-w-md mx-auto pt-16 text-center space-y-4">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle size={32} className="text-green-600" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">Treatment Added!</h2>
        <p className="text-slate-500 text-sm">The patient can now view their treatment plan.</p>
        <Button onClick={() => { setSuccess(false); setForm({ patientId: '', doctorName: '', diagnosis: '', treatmentDetails: '', lifestyleAdvice: '', followUpDate: '', medications: [] }); }} fullWidth>
          Add Another Treatment
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Add Treatment</h1>
        <p className="text-slate-500 text-sm mt-1">Record a doctor's prescription and treatment plan for a patient</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        {error && (
          <div className="flex items-center gap-2 p-3 mb-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            <AlertCircle size={16} />{error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input id="pid" label="Patient ID" required placeholder="Patient MongoDB ID"
              value={form.patientId} onChange={(e) => setForm({ ...form, patientId: e.target.value })}
              helper="Get from patient QR scan" />
            <Input id="doc" label="Doctor Name" required placeholder="Dr. Ramesh Gupta"
              value={form.doctorName} onChange={(e) => setForm({ ...form, doctorName: e.target.value })} />
          </div>

          <Input id="diag" label="Diagnosis" required placeholder="e.g., Type 2 Diabetes with Hypertension"
            value={form.diagnosis} onChange={(e) => setForm({ ...form, diagnosis: e.target.value })} />

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-slate-700">Treatment Details <span className="text-red-500">*</span></label>
            <textarea required rows={3} placeholder="Detailed treatment plan..."
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={form.treatmentDetails} onChange={(e) => setForm({ ...form, treatmentDetails: e.target.value })} />
          </div>

          {/* Medications */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-medium text-slate-700">Medications</label>
              <Button type="button" size="sm" variant="ghost" icon={Plus} onClick={addMed}>Add</Button>
            </div>
            {form.medications.map((m, i) => (
              <div key={i} className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-3 p-3 bg-slate-50 rounded-lg">
                <input placeholder="Name" className="rounded border border-slate-300 px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                  value={m.name} onChange={(e) => updateMed(i, 'name', e.target.value)} />
                <input placeholder="Dosage" className="rounded border border-slate-300 px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                  value={m.dosage} onChange={(e) => updateMed(i, 'dosage', e.target.value)} />
                <input placeholder="Frequency" className="rounded border border-slate-300 px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                  value={m.frequency} onChange={(e) => updateMed(i, 'frequency', e.target.value)} />
                <div className="flex gap-1">
                  <input placeholder="Duration" className="flex-1 rounded border border-slate-300 px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                    value={m.duration} onChange={(e) => updateMed(i, 'duration', e.target.value)} />
                  <button type="button" onClick={() => removeMed(i)} className="p-1 text-red-500 hover:text-red-700"><Trash2 size={14} /></button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-slate-700">Lifestyle Advice</label>
            <textarea rows={2} placeholder="Diet tips, exercise, restrictions..."
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={form.lifestyleAdvice} onChange={(e) => setForm({ ...form, lifestyleAdvice: e.target.value })} />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-slate-700">Follow-up Date</label>
            <input type="date" className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={form.followUpDate} onChange={(e) => setForm({ ...form, followUpDate: e.target.value })} />
          </div>

          <Button type="submit" fullWidth loading={loading} icon={Stethoscope} size="lg">Save Treatment</Button>
        </form>
      </div>
    </div>
  );
};

export default AddTreatmentPage;
