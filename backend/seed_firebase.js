const { db } = require('./config/firebase');
const bcrypt = require('bcryptjs');

const seedFirebase = async () => {
  try {
    console.log('🌱 Starting Firebase Admin Seeding...');

    // Helper to clear a collection
    const clearCollection = async (colName) => {
      const snapshot = await db.collection(colName).get();
      const batch = db.batch();
      snapshot.docs.forEach(d => batch.delete(d.ref));
      await batch.commit();
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
    await db.collection('users').doc(adminId).set(adminData);
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
    await db.collection('users').doc(hospitalId).set(hospitalUserData);

    await db.collection('hospitalProfiles').doc(hospitalId).set({
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
    await db.collection('users').doc(patientId).set(patientUserData);

    await db.collection('patientProfiles').doc(patientId).set({
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

    console.log('\n✅ Firebase Admin Seeding completed successfully!\n');
    
  } catch (error) {
    console.error('❌ Firebase Seeding failed:', error);
  }
};

seedFirebase();
