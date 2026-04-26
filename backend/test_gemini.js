require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

const testGemini = async () => {
  try {
    console.log('Testing Gemini API with gemini-2.5-flash...');
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    const result = await model.generateContent('Hello');
    console.log('✅ Gemini Success:', result.response.text());
    process.exit(0);
  } catch (error) {
    console.error('❌ Gemini Error:', error.message);
    process.exit(1);
  }
};

testGemini();
