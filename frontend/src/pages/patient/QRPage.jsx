import { useEffect, useState } from 'react';
import { patientService } from '../../services';
import { Spinner } from '../../components/ui/Spinner';
import { QrCode, Download, Shield } from 'lucide-react';
import { QRCodeCanvas as QRCode } from 'qrcode.react';

const QRPage = () => {
  const [qrData, setQrData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    patientService.getQRData().then((r) => setQrData(r.data.data)).finally(() => setLoading(false));
  }, []);

  const downloadQR = () => {
    const canvas = document.querySelector('#patient-qr canvas');
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = `caresetu-qr-${qrData.patientId}.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  if (loading) return <div className="flex justify-center pt-20"><Spinner size="lg" /></div>;

  return (
    <div className="space-y-6 max-w-xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">My QR Code</h1>
        <p className="text-slate-500 text-sm mt-1">Show this to hospitals for instant access to your records</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 text-center space-y-6">
        <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-medium">
          <QrCode size={16} /> Patient Identity QR
        </div>

        <div id="patient-qr" className="flex justify-center">
          <div className="p-4 border-4 border-blue-600 rounded-2xl bg-white shadow-lg">
            <QRCode
              value={qrData?.qrData || qrData?.patientId || 'N/A'}
              size={200}
              level="H"
              includeMargin={false}
            />
          </div>
        </div>

        <div className="space-y-1">
          <h2 className="text-xl font-bold text-slate-900">{qrData?.name}</h2>
          <div className="inline-flex items-center gap-2 bg-red-50 text-red-700 px-3 py-1 rounded-full text-sm font-bold">
            Blood Group: {qrData?.bloodGroup}
          </div>
          <p className="text-xs text-slate-400 mt-2 font-mono break-all">ID: {qrData?.patientId}</p>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-left">
          <div className="flex items-start gap-2">
            <Shield size={16} className="text-amber-600 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-amber-800">
              This QR code contains your patient ID. When scanned by an authorized hospital, they can access your medical records and history instantly — no paperwork needed.
            </p>
          </div>
        </div>

        <button
          onClick={downloadQR}
          className="w-full flex items-center justify-center gap-2 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors"
        >
          <Download size={18} />
          Download QR Code
        </button>
      </div>
    </div>
  );
};

export default QRPage;
