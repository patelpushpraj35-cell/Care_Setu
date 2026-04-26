const testLogin = async () => {
  try {
    console.log('Testing login endpoint with fetch...');
    const response = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@caresetu.in',
        password: 'Admin@123'
      })
    });
    
    const data = await response.json();
    if (response.ok) {
      console.log('✅ Login successful!');
      console.log('Token:', data.data.token);
      process.exit(0);
    } else {
      console.error('❌ Login failed:', data.message);
      process.exit(1);
    }
  } catch (error) {
    console.error('❌ Test script error:', error.message);
    process.exit(1);
  }
};

testLogin();
