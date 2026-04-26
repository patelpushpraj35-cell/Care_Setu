const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const PatientProfile = require('./models/PatientProfile');
const HospitalProfile = require('./models/HospitalProfile');
const Report = require('./models/Report');
const Treatment = require('./models/Treatment');
const ActivityLog = require('./models/ActivityLog');

const seedData = async () => {
  try {
    // Only seed if empty
    const adminExists = await User.findOne({ role: 'admin' });
    if (adminExists) return;

    console.log('🌱 Seeding In-Memory Database...');

    // ---- Create Admin ----
    const admin = await User.create({
      name: 'CareSetu Admin',
      email: 'admin@caresetu.in',
      password: 'Admin@123',
      role: 'admin',
    });

    // ---- Create Hospitals ----
    const hospitals = await User.create([
      { name: 'AIIMS Delhi', email: 'aiims@caresetu.in', password: 'Hospital@123', role: 'hospital' },
      { name: 'Apollo Hospital', email: 'apollo@caresetu.in', password: 'Hospital@123', role: 'hospital' },
      { name: 'Fortis Healthcare', email: 'fortis@caresetu.in', password: 'Hospital@123', role: 'hospital' },
    ]);

    await HospitalProfile.create([
      {
        userId: hospitals[0]._id,
        hospitalName: 'AIIMS Delhi',
        registrationNumber: 'AIIMS-DL-001',
        address: { street: 'Ansari Nagar', city: 'New Delhi', state: 'Delhi', pincode: '110029' },
        phone: '011-26588500',
        email: 'aiims@caresetu.in',
        specializations: ['Cardiology', 'Neurology', 'Oncology', 'Orthopedics'],
        totalBeds: 2500,
      },
      {
        userId: hospitals[1]._id,
        hospitalName: 'Apollo Hospital',
        registrationNumber: 'APOLLO-MUM-001',
        address: { street: 'Greams Road', city: 'Mumbai', state: 'Maharashtra', pincode: '400001' },
        phone: '022-28216969',
        email: 'apollo@caresetu.in',
        specializations: ['Cardiac Surgery', 'Transplant', 'Cancer Care'],
        totalBeds: 800,
      },
      {
        userId: hospitals[2]._id,
        hospitalName: 'Fortis Healthcare',
        registrationNumber: 'FORTIS-BNG-001',
        address: { street: 'Bannerghatta Road', city: 'Bangalore', state: 'Karnataka', pincode: '560076' },
        phone: '080-66214444',
        email: 'fortis@caresetu.in',
        specializations: ['Pediatrics', 'Gynecology', 'Neurosciences'],
        totalBeds: 600,
      },
    ]);

    // ---- Create Patients ----
    const patients = await User.create([
      { name: 'Rahul Sharma', email: 'rahul@example.com', password: 'Patient@123', role: 'patient' },
      { name: 'Priya Patel', email: 'priya@example.com', password: 'Patient@123', role: 'patient' },
      { name: 'Amit Kumar', email: 'amit@example.com', password: 'Patient@123', role: 'patient' },
      { name: 'Sunita Devi', email: 'sunita@example.com', password: 'Patient@123', role: 'patient' },
    ]);

    await PatientProfile.create([
      {
        userId: patients[0]._id,
        mobileNumber: '9876543210',
        emergencyContact: { name: 'Suresh Sharma', phone: '9876543211', relation: 'Father' },
        bloodGroup: 'B+',
        medicalHistory: ['Diabetes Type 2', 'Hypertension'],
        aadhaarMasked: 'XXXX-XXXX-3456',
        aadhaarEncrypted: Buffer.from('123456789012').toString('base64'),
        address: { street: '12, MG Road', city: 'Delhi', state: 'Delhi', pincode: '110001' },
        dateOfBirth: new Date('1985-06-15'),
        gender: 'Male',
      },
      {
        userId: patients[1]._id,
        mobileNumber: '9876543220',
        emergencyContact: { name: 'Ravi Patel', phone: '9876543221', relation: 'Husband' },
        bloodGroup: 'A+',
        medicalHistory: ['Asthma', 'Thyroid'],
        aadhaarMasked: 'XXXX-XXXX-7890',
        aadhaarEncrypted: Buffer.from('234567890123').toString('base64'),
        address: { street: '45, Andheri West', city: 'Mumbai', state: 'Maharashtra', pincode: '400053' },
        dateOfBirth: new Date('1992-03-22'),
        gender: 'Female',
      },
      {
        userId: patients[2]._id,
        mobileNumber: '9876543230',
        emergencyContact: { name: 'Meera Kumar', phone: '9876543231', relation: 'Wife' },
        bloodGroup: 'O+',
        medicalHistory: ['High Cholesterol'],
        aadhaarMasked: 'XXXX-XXXX-1122',
        aadhaarEncrypted: Buffer.from('345678901234').toString('base64'),
        address: { street: '78, Koramangala', city: 'Bangalore', state: 'Karnataka', pincode: '560034' },
        dateOfBirth: new Date('1978-11-10'),
        gender: 'Male',
      },
    ]);

    // ---- Create Reports ----
    await Report.create([
      {
        patientId: patients[0]._id,
        hospitalId: hospitals[0]._id,
        fileUrl: '/uploads/reports/sample-report.pdf',
        fileName: 'blood-test-report.pdf',
        fileType: 'pdf',
        description: 'Complete Blood Count (CBC) - Quarterly check',
        reportType: 'blood_test',
      },
      {
        patientId: patients[0]._id,
        hospitalId: hospitals[1]._id,
        fileUrl: '/uploads/reports/sample-xray.jpg',
        fileName: 'chest-xray.jpg',
        fileType: 'image',
        description: 'Chest X-Ray - Annual physical',
        reportType: 'xray',
      },
    ]);

    // ---- Create Treatments ----
    await Treatment.create([
      {
        patientId: patients[0]._id,
        hospitalId: hospitals[0]._id,
        doctorName: 'Dr. Ramesh Gupta',
        diagnosis: 'Type 2 Diabetes with Hypertension',
        treatmentDetails: 'Continue Metformin 500mg twice daily. Started Losartan 50mg for BP control.',
        medications: [
          { name: 'Metformin', dosage: '500mg', frequency: 'Twice daily', duration: '3 months' },
        ],
        lifestyleAdvice: 'Low-carb diet. Walk 30 minutes daily.',
        followUpDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        status: 'active',
      },
    ]);

    // ---- Activity Logs ----
    await ActivityLog.create([
      { userId: admin._id, action: 'SYSTEM_SEEDED', description: 'In-Memory Database initialized', role: 'admin' },
    ]);

    console.log('✅ In-Memory Data Seeded Successfully!');
  } catch (error) {
    console.error('❌ In-Memory Seeding Error:', error);
  }
};

// Execute inline
seedData();
