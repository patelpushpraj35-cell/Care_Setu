const { db } = require('./config/firebase');
const { collection, getDocs } = require('firebase/firestore');

const checkDB = async () => {
  try {
    const snapshot = await getDocs(collection(db, 'users'));
    console.log(`Total users found: ${snapshot.size}`);
    snapshot.docs.forEach(d => {
      console.log(`- ${d.data().email} (${d.data().role})`);
    });
    process.exit(0);
  } catch (error) {
    console.error('Error checking DB:', error);
    process.exit(1);
  }
};

checkDB();
