import { useState } from 'react';
import { hospitalService } from '../../services';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { Upload, FileText, AlertCircle, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const REPORT_TYPES = ['blood_test', 'xray', 'mri', 'ct_scan', 'urine_test', 'ecg', 'other'];

const UploadReportPage = () => {
  const [form, setForm] = useState({ patientId: '', description: '', reportType: 'other' });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) { setError('Please select a file.'); return; }
    setLoading(true);
    setError('');
    try {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('patientId', form.patientId);
      fd.append('description', form.description);
      fd.append('reportType', form.reportType);
      await hospitalService.uploadReport(fd);
      toast.success('Report uploaded successfully!');
      setSuccess(true);
      setForm({ patientId: '', description: '', reportType: 'other' });
      setFile(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Upload failed.');
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
        <h2 className="text-xl font-bold text-slate-900">Report Uploaded!</h2>
        <p className="text-slate-500 text-sm">The patient can now view this report in their portal.</p>
        <Button onClick={() => setSuccess(false)} fullWidth>Upload Another Report</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Upload Report</h1>
        <p className="text-slate-500 text-sm mt-1">Upload medical reports for patients (PDF or image)</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        {error && (
          <div className="flex items-center gap-2 p-3 mb-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            <AlertCircle size={16} />{error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            id="patientId" label="Patient ID" required
            placeholder="Enter patient MongoDB ID (from QR scan)"
            value={form.patientId}
            onChange={(e) => setForm({ ...form, patientId: e.target.value })}
            helper="Scan patient QR to get their ID, then paste it here"
          />

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-slate-700">Report Type</label>
            <select
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={form.reportType}
              onChange={(e) => setForm({ ...form, reportType: e.target.value })}
            >
              {REPORT_TYPES.map((t) => (
                <option key={t} value={t}>{t.replace('_', ' ').toUpperCase()}</option>
              ))}
            </select>
          </div>

          <Input
            id="desc" label="Description" required
            placeholder="e.g., Complete Blood Count - June 2024"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-slate-700">File <span className="text-red-500">*</span></label>
            <div
              className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${file ? 'border-green-400 bg-green-50' : 'border-slate-300 hover:border-blue-400 hover:bg-blue-50'}`}
              onClick={() => document.getElementById('file-input').click()}
            >
              {file ? (
                <div className="space-y-1">
                  <FileText size={32} className="text-green-600 mx-auto" />
                  <p className="text-sm font-semibold text-green-700">{file.name}</p>
                  <p className="text-xs text-green-600">{(file.size / 1024).toFixed(1)} KB</p>
                </div>
              ) : (
                <div className="space-y-1">
                  <Upload size={32} className="text-slate-400 mx-auto" />
                  <p className="text-sm text-slate-600 font-medium">Click to upload file</p>
                  <p className="text-xs text-slate-400">PDF, JPEG, PNG up to 10MB</p>
                </div>
              )}
              <input
                id="file-input" type="file" className="hidden"
                accept=".pdf,.jpg,.jpeg,.png,.webp"
                onChange={(e) => setFile(e.target.files[0])}
              />
            </div>
          </div>

          <Button type="submit" fullWidth loading={loading} icon={Upload} size="lg">
            Upload Report
          </Button>
        </form>
      </div>
    </div>
  );
};

export default UploadReportPage;
