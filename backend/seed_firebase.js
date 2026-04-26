const { db } = require('./config/firebase');
const { collection, setDoc, doc, getDocs, deleteDoc, query } = require('firebase/firestore');
const bcrypt = require('bcryptjs');

const seedFirebase = async () => {
  try {
    console.log('🌱 Starting Firebase Firestore Seeding...');

    // Helper to clear a collection
    const clearCollection = async (colName) => {
      const q = query(collection(db, colName));
      const snapshot = await getDocs(q);
      const deletePromises = snapshot.docs.map(d => deleteDoc(d.ref));
      await Promise.all(deletePromises);
      console.log(`🗑️ Cleared collection: ${colName}`);
    };

    // Clear existing data
    await clearCollection('users');
    await clearCollection('patientProfiles');
    await clearCollection('hospitalProfiles');
    await clearCollection('reports');
    await clearCollection('treatments');
    await clearCollection('activityLogs');

    const salt = await bcrypt.genSalt(12);

    // ---- Create Admin ----
    const adminId = 'admin_demo_id';
    const adminData = {
      name: 'CareSetu Admin',
      email: 'admin@caresetu.in',
      password: await bcrypt.hash('Admin@123', salt),
      role: 'admin',
      isActive: true,
      createdAt: new Date().toISOString()
    };
    await setDoc(doc(db, 'users', adminId), adminData);
    console.log('👤 Admin demo created');

    // ---- Create Hospital ----
    const hospitalId = 'hospital_demo_id';
    const hospitalUserData = {
      name: 'AIIMS Delhi',
      email: 'aiims@caresetu.in',
      password: await bcrypt.hash('Hospital@123', salt),
      role: 'hospital',
      isActive: true,
      createdAt: new Date().toISOString()
    };
    await setDoc(doc(db, 'users', hospitalId), hospitalUserData);

    await setDoc(doc(db, 'hospitalProfiles', hospitalId), {
      userId: hospitalId,
      hospitalName: 'AIIMS Delhi',
      registrationNumber: 'AIIMS-DL-001',
      address: { street: 'Ansari Nagar', city: 'New Delhi', state: 'Delhi', pincode: '110029' },
      phone: '011-26588500',
      email: 'aiims@caresetu.in',
      specializations: ['Cardiology', 'Neurology', 'Oncology', 'Orthopedics'],
      totalBeds: 2500,
      createdAt: new Date().toISOString()
    });
    console.log('🏥 Hospital demo created');

    // ---- Create Patient ----
    const patientId = 'patient_demo_id';
    const patientUserData = {
      name: 'Rahul Sharma',
      email: 'rahul@example.com',
      password: await bcrypt.hash('Patient@123', salt),
      role: 'patient',
      isActive: true,
      createdAt: new Date().toISOString()
    };
    await setDoc(doc(db, 'users', patientId), patientUserData);

    await setDoc(doc(db, 'patientProfiles', patientId), {
      userId: patientId,
      mobileNumber: '9876543210',
      emergencyContact: { name: 'Suresh Sharma', phone: '9876543211', relation: 'Father' },
      bloodGroup: 'B+',
      medicalHistory: ['Diabetes Type 2', 'Hypertension'],
      aadhaarMasked: 'XXXX-XXXX-3456',
      address: { street: '12, MG Road', city: 'Delhi', state: 'Delhi', pincode: '110001' },
      dateOfBirth: '1985-06-15',
      gender: 'Male',
      createdAt: new Date().toISOString()
    });
    console.log('👥 Patient demo created');

    // ---- Create Demo Report ----
    await setDoc(doc(collection(db, 'reports')), {
      patientId: patientId,
      hospitalId: hospitalId,
      hospitalName: 'AIIMS Delhi',
      fileUrl: '/uploads/reports/sample-report.pdf',
      fileName: 'blood-test-report.pdf',
      fileType: 'pdf',
      description: 'Complete Blood Count (CBC) - Quarterly check',
      reportType: 'blood_test',
      createdAt: new Date().toISOString()
    });

    // ---- Create Demo Treatment ----
    await setDoc(doc(collection(db, 'treatments')), {
      patientId: patientId,
      hospitalId: hospitalId,
      hospitalName: 'AIIMS Delhi',
      doctorName: 'Dr. Ramesh Gupta',
      diagnosis: 'Type 2 Diabetes with Hypertension',
      treatmentDetails: 'Continue Metformin 500mg twice daily.',
      medications: [{ name: 'Metformin', dosage: '500mg', frequency: 'Twice daily', duration: '3 months' }],
      lifestyleAdvice: 'Low-carb diet. Walk 30 minutes daily.',
      status: 'active',
      createdAt: new Date().toISOString()
    });

    console.log('\n✅ Firebase Seeding completed successfully!\n');
    console.log('📧 Credentials:');
    console.log('ADMIN    → admin@caresetu.in / Admin@123');
    console.log('HOSPITAL → aiims@caresetu.in / Hospital@123');
    console.log('PATIENT  → rahul@example.com / Patient@123');
    
  } catch (error) {
    console.error('❌ Firebase Seeding failed:', error);
  }
};

seedFirebase();
