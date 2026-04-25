import api from './api';

export const authService = {
  registerPatient: (data) => api.post('/auth/register/patient', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
};

export const adminService = {
  getDashboard: () => api.get('/admin/dashboard'),
  registerHospital: (data) => api.post('/admin/hospitals/register', data),
  getAllHospitals: () => api.get('/admin/hospitals'),
  toggleHospital: (id) => api.patch(`/admin/hospitals/${id}/toggle`),
  getAllPatients: () => api.get('/admin/patients'),
  getPatientDetails: (id) => api.get(`/admin/patients/${id}/details`),
};

export const patientService = {
  getDashboard: () => api.get('/patient/dashboard'),
  getProfile: () => api.get('/patient/profile'),
  updateProfile: (data) => api.put('/patient/profile', data),
  getReports: () => api.get('/patient/reports'),
  getTreatments: () => api.get('/patient/treatments'),
  getQRData: () => api.get('/patient/qr'),
};

export const hospitalService = {
  getDashboard: () => api.get('/hospital/dashboard'),
  getProfile: () => api.get('/hospital/profile'),
  getPatientByQR: (patientId) => api.get(`/hospital/patient/${patientId}`),
  getMyPatients: () => api.get('/hospital/patients'),
  uploadReport: (formData) =>
    api.post('/hospital/reports', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  addTreatment: (data) => api.post('/hospital/treatments', data),
  updateMedicalHistory: (patientId, data) =>
    api.patch(`/hospital/patient/${patientId}/medical-history`, data),
};

export const chatbotService = {
  getOptions: () => api.get('/chatbot/options'),
  chat: (message, type) => api.post('/chatbot/chat', { message, type }),
};
