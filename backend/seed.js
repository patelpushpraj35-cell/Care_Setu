require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const PatientProfile = require('./models/PatientProfile');
const HospitalProfile = require('./models/HospitalProfile');
const Report = require('./models/Report');
const Treatment = require('./models/Treatment');
const ActivityLog = require('./models/ActivityLog');

const connectDB = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('✅ Connected to MongoDB for seeding...');
};

const seedData = async () => {
  await connectDB();

  // Clear existing data
  await Promise.all([
    User.deleteMany({}),
    PatientProfile.deleteMany({}),
    HospitalProfile.deleteMany({}),
    Report.deleteMany({}),
    Treatment.deleteMany({}),
    ActivityLog.deleteMany({}),
  ]);
  console.log('🗑️  Cleared existing data');

  // ---- Create Admin ----
  const admin = await User.create({
    name: 'CareSetu Admin',
    email: 'admin@caresetu.in',
    password: 'Admin@123',
    role: 'admin',
  });
  console.log(`👤 Admin created: ${admin.email}`);

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
  console.log(`🏥 ${hospitals.length} hospitals created`);

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
    {
      userId: patients[3]._id,
      mobileNumber: '9876543240',
      emergencyContact: { name: 'Ramesh Devi', phone: '9876543241', relation: 'Son' },
      bloodGroup: 'AB-',
      medicalHistory: ['Arthritis', 'Osteoporosis'],
      aadhaarMasked: 'XXXX-XXXX-5566',
      aadhaarEncrypted: Buffer.from('456789012345').toString('base64'),
      address: { street: '23, Civil Lines', city: 'Jaipur', state: 'Rajasthan', pincode: '302006' },
      dateOfBirth: new Date('1955-08-30'),
      gender: 'Female',
    },
  ]);
  console.log(`👥 ${patients.length} patients created`);

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
    {
      patientId: patients[1]._id,
      hospitalId: hospitals[0]._id,
      fileUrl: '/uploads/reports/sample-report.pdf',
      fileName: 'thyroid-panel.pdf',
      fileType: 'pdf',
      description: 'Thyroid Function Test (T3, T4, TSH)',
      reportType: 'blood_test',
    },
    {
      patientId: patients[2]._id,
      hospitalId: hospitals[2]._id,
      fileUrl: '/uploads/reports/sample-report.pdf',
      fileName: 'lipid-profile.pdf',
      fileType: 'pdf',
      description: 'Lipid Profile - Cholesterol panel',
      reportType: 'blood_test',
    },
  ]);
  console.log('📋 Reports created');

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
        { name: 'Losartan', dosage: '50mg', frequency: 'Once daily morning', duration: '3 months' },
        { name: 'Aspirin', dosage: '75mg', frequency: 'Once daily', duration: 'Ongoing' },
      ],
      lifestyleAdvice: 'Low-carb diet. Avoid sugar and processed foods. Walk 30 minutes daily. Monitor BP at home.',
      followUpDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      status: 'active',
    },
    {
      patientId: patients[1]._id,
      hospitalId: hospitals[0]._id,
      doctorName: 'Dr. Sunita Mehta',
      diagnosis: 'Hypothyroidism with Asthma',
      treatmentDetails: 'Thyronorm 50mcg prescribed. Inhaler (Seretide) for asthma management.',
      medications: [
        { name: 'Thyronorm', dosage: '50mcg', frequency: 'Once daily empty stomach', duration: 'Ongoing' },
        { name: 'Seretide Inhaler', dosage: '1 puff', frequency: 'Twice daily', duration: '3 months' },
      ],
      lifestyleAdvice: 'Avoid goitrogenic foods (cabbage, broccoli excess). Keep rescue inhaler handy. Avoid cold air.',
      followUpDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
      status: 'active',
    },
    {
      patientId: patients[2]._id,
      hospitalId: hospitals[2]._id,
      doctorName: 'Dr. Arjun Singh',
      diagnosis: 'Hypercholesterolemia',
      treatmentDetails: 'Atorvastatin 20mg prescribed for cholesterol management.',
      medications: [
        { name: 'Atorvastatin', dosage: '20mg', frequency: 'Once daily at night', duration: '6 months' },
        { name: 'Omega-3', dosage: '1g', frequency: 'Twice daily', duration: '6 months' },
      ],
      lifestyleAdvice: 'Heart-healthy diet. Avoid saturated fats. Exercise 5 days/week. Quit smoking if applicable.',
      followUpDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
      status: 'active',
    },
  ]);
  console.log('💊 Treatments created');

  // ---- Activity Logs ----
  await ActivityLog.create([
    { userId: admin._id, action: 'SYSTEM_SEEDED', description: 'Demo data seeded successfully', role: 'admin' },
    { userId: patients[0]._id, action: 'PATIENT_REGISTERED', description: 'Patient Rahul Sharma registered', role: 'patient' },
    { userId: hospitals[0]._id, action: 'HOSPITAL_REGISTERED', description: 'AIIMS Delhi registered', role: 'hospital' },
    { userId: patients[1]._id, action: 'PATIENT_REGISTERED', description: 'Patient Priya Patel registered', role: 'patient' },
  ]);

  console.log('\n✅ Seeding completed successfully!\n');
  console.log('📧 Login Credentials:');
  console.log('─────────────────────────────────────────');
  console.log('ADMIN    → admin@caresetu.in / Admin@123');
  console.log('HOSPITAL → aiims@caresetu.in / Hospital@123');
  console.log('PATIENT  → rahul@example.com / Patient@123');
  console.log('─────────────────────────────────────────\n');

  await mongoose.connection.close();
  process.exit(0);
};

seedData().catch((err) => {
  console.error('❌ Seeding failed:', err);
  process.exit(1);
});
