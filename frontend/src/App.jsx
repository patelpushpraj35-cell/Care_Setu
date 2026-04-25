import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardLayout from './layouts/DashboardLayout';

// Auth Pages
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import HospitalsPage from './pages/admin/HospitalsPage';
import AdminPatientsPage from './pages/admin/AdminPatientsPage';

// Patient Pages
import PatientDashboard from './pages/patient/PatientDashboard';
import QRPage from './pages/patient/QRPage';
import ReportsPage from './pages/patient/ReportsPage';
import TreatmentsPage from './pages/patient/TreatmentsPage';
import ChatbotPage from './pages/patient/ChatbotPage';
import PatientProfilePage from './pages/patient/ProfilePage';

// Hospital Pages
import HospitalDashboard from './pages/hospital/HospitalDashboard';
import ScanQRPage from './pages/hospital/ScanQRPage';
import HospitalPatientsPage from './pages/hospital/HospitalPatientsPage';
import UploadReportPage from './pages/hospital/UploadReportPage';
import AddTreatmentPage from './pages/hospital/AddTreatmentPage';

const App = () => (
  <AuthProvider>
    <BrowserRouter>
      <Toaster position="top-right" toastOptions={{ duration: 3000, style: { fontFamily: 'Inter, sans-serif', fontSize: '14px' } }} />
      <Routes>
        {/* Public */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Admin */}
        <Route path="/admin" element={
          <ProtectedRoute roles={['admin']}><DashboardLayout /></ProtectedRoute>
        }>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="hospitals" element={<HospitalsPage />} />
          <Route path="patients" element={<AdminPatientsPage />} />
        </Route>

        {/* Patient */}
        <Route path="/patient" element={
          <ProtectedRoute roles={['patient']}><DashboardLayout /></ProtectedRoute>
        }>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<PatientDashboard />} />
          <Route path="qr" element={<QRPage />} />
          <Route path="reports" element={<ReportsPage />} />
          <Route path="treatments" element={<TreatmentsPage />} />
          <Route path="chatbot" element={<ChatbotPage />} />
          <Route path="profile" element={<PatientProfilePage />} />
        </Route>

        {/* Hospital */}
        <Route path="/hospital" element={
          <ProtectedRoute roles={['hospital']}><DashboardLayout /></ProtectedRoute>
        }>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<HospitalDashboard />} />
          <Route path="scan" element={<ScanQRPage />} />
          <Route path="patients" element={<HospitalPatientsPage />} />
          <Route path="reports/upload" element={<UploadReportPage />} />
          <Route path="treatments/add" element={<AddTreatmentPage />} />
        </Route>

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  </AuthProvider>
);

export default App;
