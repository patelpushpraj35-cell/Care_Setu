import { useState, useRef, useEffect } from 'react';
import { hospitalService } from '../../services';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import { Spinner } from '../../components/ui/Spinner';
import { QrCode, Search, User, Droplets, Phone, FileText, Activity, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
// html5-qrcode scanner
import { Html5QrcodeScanner } from 'html5-qrcode';

const formatDate = (d) => new Date(d).toLocaleDateString('en-IN', { dateStyle: 'medium' });

const ScanQRPage = () => {
  const [scanning, setScanning] = useState(false);
  const [manualId, setManualId] = useState('');
  const [patientData, setPatientData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const scannerRef = useRef(null);

  const fetchPatient = async (id) => {
    if (!id?.trim()) return;
    setLoading(true);
    setError('');
    setPatientData(null);
    try {
      const { data } = await hospitalService.getPatientByQR(id.trim());
      setPatientData(data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Patient not found.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!scanning) {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(() => {});
        scannerRef.current = null;
      }
      return;
    }

    // Prevent double rendering in React Strict Mode
    if (scannerRef.current) return;

    const scanner = new Html5QrcodeScanner('qr-reader', { fps: 10, qrbox: 250, rememberLastUsedCamera: true });
    scannerRef.current = scanner;

    scanner.render(
      (decodedText) => {
        try {
          const parsed = JSON.parse(decodedText);
          fetchPatient(parsed.patientId || decodedText);
        } catch {
          fetchPatient(decodedText);
        }
        if (scannerRef.current) {
          scannerRef.current.clear().catch(() => {});
          scannerRef.current = null;
        }
        setScanning(false);
      },
      (err) => {
        // Ignored, happens constantly when no QR is found
      }
    );

    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(() => {});
        scannerRef.current = null;
      }
    };
  }, [scanning]);

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Scan Patient QR</h1>
        <p className="text-slate-500 text-sm mt-1">Scan or enter Patient ID to access their records</p>
      </div>

      {/* Scan Options */}
      {!patientData && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-4">
            <Button icon={QrCode} fullWidth onClick={() => setScanning(!scanning)}>
              {scanning ? 'Stop Scanning' : 'Open QR Scanner'}
            </Button>
            {scanning && (
              <div className="bg-blue-50 border border-blue-200 text-blue-700 text-sm p-3 rounded-lg flex items-start gap-2">
                <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
                <p>Please click <strong>&quot;Request Camera Permissions&quot;</strong> below and allow your browser to use the camera.</p>
              </div>
            )}
            {scanning && <div id="qr-reader" className="w-full rounded-lg overflow-hidden border border-slate-200" />}

            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-slate-200" />
              <span className="text-xs text-slate-400 font-medium">OR</span>
              <div className="h-px flex-1 bg-slate-200" />
            </div>

            <div className="flex gap-2">
              <input
                className="flex-1 rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter Patient ID, Email, or Mobile..."
                value={manualId}
                onChange={(e) => setManualId(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') fetchPatient(manualId); }}
              />
              <Button icon={Search} onClick={() => fetchPatient(manualId)} loading={loading}>Search</Button>
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                <AlertCircle size={16} />{error}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Patient Data */}
      {loading && <div className="flex justify-center pt-10"><Spinner size="lg" /></div>}

      {patientData && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-slate-800">Patient Found</h2>
            <Button size="sm" variant="secondary" onClick={() => { setPatientData(null); setManualId(''); }}>
              Search Another
            </Button>
          </div>

          {/* Patient Header */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center text-white text-xl font-bold">
                {patientData.user?.name?.[0]}
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-slate-900">{patientData.user?.name}</h3>
                <p className="text-sm text-slate-500">{patientData.user?.email}</p>
              </div>
              {patientData.profile?.bloodGroup && (
                <span className="flex items-center gap-1 bg-red-50 text-red-700 px-3 py-1.5 rounded-full font-bold text-sm">
                  <Droplets size={14} />{patientData.profile.bloodGroup}
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
              <div className="bg-slate-50 p-3 rounded-lg">
                <p className="text-xs text-slate-500">Mobile</p>
                <p className="font-semibold">{patientData.profile?.mobileNumber || '—'}</p>
              </div>
              <div className="bg-slate-50 p-3 rounded-lg">
                <p className="text-xs text-slate-500">Emergency</p>
                <p className="font-semibold text-xs">{patientData.profile?.emergencyContact?.phone || '—'}</p>
              </div>
              <div className="bg-slate-50 p-3 rounded-lg">
                <p className="text-xs text-slate-500">City</p>
                <p className="font-semibold">{patientData.profile?.address?.city || '—'}</p>
              </div>
              <div className="bg-slate-50 p-3 rounded-lg">
                <p className="text-xs text-slate-500">Conditions</p>
                <p className="font-semibold">{patientData.profile?.medicalHistory?.length || 0}</p>
              </div>
            </div>

            {patientData.profile?.medicalHistory?.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {patientData.profile.medicalHistory.map((c) => <Badge key={c} variant="red">{c}</Badge>)}
              </div>
            )}
          </div>

          {/* Reports */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
            <div className="px-5 py-4 border-b border-slate-100">
              <h3 className="font-semibold text-slate-800 flex items-center gap-2"><FileText size={16} />Reports ({patientData.reports?.length})</h3>
            </div>
            <div className="divide-y divide-slate-100">
              {patientData.reports?.length ? patientData.reports.slice(0, 5).map((r) => (
                <div key={r._id} className="px-5 py-3 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{r.description}</p>
                    <p className="text-xs text-slate-500">{r.hospitalId?.name} · {formatDate(r.createdAt)}</p>
                  </div>
                  <Badge variant="blue">{r.reportType?.replace('_', ' ')}</Badge>
                </div>
              )) : <p className="py-6 text-center text-slate-400 text-sm">No reports</p>}
            </div>
          </div>

          {/* Treatments */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
            <div className="px-5 py-4 border-b border-slate-100">
              <h3 className="font-semibold text-slate-800 flex items-center gap-2"><Activity size={16} />Treatments ({patientData.treatments?.length})</h3>
            </div>
            <div className="divide-y divide-slate-100">
              {patientData.treatments?.length ? patientData.treatments.slice(0, 5).map((t) => (
                <div key={t._id} className="px-5 py-3">
                  <p className="text-sm font-medium">{t.diagnosis}</p>
                  <p className="text-xs text-slate-500">Dr. {t.doctorName} · {formatDate(t.createdAt)}</p>
                </div>
              )) : <p className="py-6 text-center text-slate-400 text-sm">No treatments</p>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScanQRPage;
