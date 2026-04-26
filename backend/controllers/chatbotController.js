const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Gemini client
let genAI;
try {
  genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
} catch (e) {
  console.warn('Gemini API not configured properly.');
}

/**
 * System context for CareSetu's healthcare chatbot
 */
const SYSTEM_CONTEXT = `You are CareSetu AI Assistant — a helpful, empathetic healthcare chatbot designed for Indian patients. 
You specialize in:
1. Explaining Indian government healthcare schemes (like Ayushman Bharat, Pradhan Mantri Jan Arogya Yojana, etc.)
2. Simplifying medical treatment instructions in easy-to-understand language (Hindi/English)
3. Explaining lab reports in simple, non-technical terms

Always:
- Be warm, clear, and compassionate
- Use simple language (avoid heavy medical jargon)
- Mention when to consult a doctor
- Format responses clearly with bullet points where useful
- Keep responses concise but comprehensive
- CRITICAL: Respond in the EXACT SAME LANGUAGE as the user's query. If the user asks in Hindi, you MUST reply in Hindi. If the user asks in English, you MUST reply in English.`;

/**
 * @route   POST /api/chatbot/chat
 * @desc    Send a message to Gemini AI and get a response
 * @access  Patient (authenticated)
 */
const chat = async (req, res) => {
  try {
    const { message, type } = req.body; // type: 'scheme' | 'treatment' | 'report' | 'general'

    if (!message || !message.trim()) {
      return res.status(400).json({ success: false, message: 'Message is required.' });
    }

    if (!genAI || !process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_gemini_api_key_here') {
      // Return a mock response for demo purposes
      const mockResponses = {
        scheme: `**Government Healthcare Schemes in India:**\n\n• **Ayushman Bharat - PM-JAY**: Provides health cover of ₹5 lakh per family per year for secondary and tertiary hospitalization.\n\n• **CGHS (Central Government Health Scheme)**: For central government employees and pensioners.\n\n• **Rashtriya Swasthya Bima Yojana (RSBY)**: For BPL families - provides cashless hospitalization.\n\n• **Janani Suraksha Yojana**: Cash assistance for pregnant women from poor families.\n\nTo check eligibility for PM-JAY, visit: pmjay.gov.in or call 14555.`,
        treatment: `**Understanding Your Treatment:**\n\nI'll help you understand your doctor's instructions in simple language.\n\n📋 **General Tips:**\n• Take medicines exactly as prescribed - same time every day\n• Never skip doses even if you feel better\n• Complete the full course of antibiotics\n• Stay hydrated and rest well\n• Follow the diet restrictions your doctor mentioned\n\n⚠️ **Always consult your doctor** if you experience side effects or feel worse.`,
        report: `**Understanding Your Lab Report:**\n\n🔬 **Common Terms Explained:**\n• **Hemoglobin**: Should be 12-17 g/dL. Low = anemia, may need iron\n• **Blood Sugar (Fasting)**: Normal is 70-100 mg/dL\n• **Creatinine**: Kidney function marker, normal 0.6-1.2 mg/dL\n• **WBC Count**: White blood cells - fights infection, normal 4000-11000\n\nShare your specific values and I can explain them better. Always discuss results with your doctor.`,
      };

      const responseText = mockResponses[type] || `Thank you for your question! I'm CareSetu AI. Please configure the Gemini API key to enable full AI responses. In the meantime, here are some quick tips:\n\n• Always consult your doctor for medical advice\n• CareSetu helps you track your health records\n• Government schemes like Ayushman Bharat can help with hospital costs\n\nStay healthy! 🏥`;

      return res.json({ success: true, data: { response: responseText, type } });
    }

    // Build context-specific prompt
    let prompt = `${SYSTEM_CONTEXT}\n\nUser Query: ${message}`;
    
    if (type === 'scheme') {
      prompt = `${SYSTEM_CONTEXT}\n\nThe user wants to know about Indian government healthcare schemes. Query: ${message}\n\nProvide specific, accurate information about relevant schemes with eligibility and benefits.`;
    } else if (type === 'treatment') {
      prompt = `${SYSTEM_CONTEXT}\n\nThe user wants to understand their medical treatment or prescription. Query: ${message}\n\nExplain in simple language what the treatment involves, how to take medicines, and lifestyle changes needed.`;
    } else if (type === 'report') {
      prompt = `${SYSTEM_CONTEXT}\n\nThe user wants to understand their medical lab report. Query: ${message}\n\nExplain the values, what they mean in simple terms, and what action (if any) they should take.`;
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    res.json({ success: true, data: { response: text, type } });
  } catch (error) {
    console.error('Chatbot Error:', error);
    res.status(500).json({ success: false, message: 'Chatbot service temporarily unavailable.' });
  }
};

/**
 * @route   GET /api/chatbot/options
 * @desc    Get predefined chatbot option prompts
 * @access  Patient (authenticated)
 */
const getChatOptions = async (req, res) => {
  const options = [
    {
      id: 'scheme',
      title: 'Government Healthcare Schemes',
      description: 'Learn about Ayushman Bharat, PM-JAY, and other Indian health subsidies',
      icon: '🏛️',
      defaultPrompt: 'What are the main government healthcare schemes in India and how can I apply for them?',
    },
    {
      id: 'treatment',
      title: 'Understand My Treatment',
      description: 'Get your doctor\'s prescription explained in simple language',
      icon: '💊',
      defaultPrompt: 'Can you explain my treatment plan and how I should take my medicines?',
    },
    {
      id: 'report',
      title: 'Explain My Lab Report',
      description: 'Understand your blood tests, X-rays, and other medical reports',
      icon: '🔬',
      defaultPrompt: 'Can you help me understand my medical report values and what they mean?',
    },
  ];

  res.json({ success: true, data: options });
};

module.exports = { chat, getChatOptions };
