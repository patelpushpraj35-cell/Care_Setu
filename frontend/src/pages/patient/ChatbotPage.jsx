import { useState, useRef, useEffect } from 'react';
import { chatbotService } from '../../services';
import Button from '../../components/ui/Button';
import { Spinner } from '../../components/ui/Spinner';
import { MessageCircle, Send, Bot, User, RefreshCw, Volume2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

const ChatbotPage = () => {
  const [options] = useState([
    { id: 'scheme', title: 'Government Schemes', description: 'Ayushman Bharat, PM-JAY & more', icon: '🏛️', defaultPrompt: 'What are the main government healthcare schemes in India and how can I apply?' },
    { id: 'treatment', title: 'Understand Treatment', description: 'Get prescriptions explained simply', icon: '💊', defaultPrompt: 'Can you explain my treatment plan in simple language?' },
    { id: 'report', title: 'Explain Lab Report', description: 'Understand your test results', icon: '🔬', defaultPrompt: 'Help me understand my medical lab report values.' },
  ]);
  const [activeType, setActiveType] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const startChat = (opt) => {
    setActiveType(opt.id);
    setMessages([
      { role: 'assistant', text: `Hi! I'm your CareSetu AI assistant. I'll help you with **${opt.title}**.\n\n${opt.description}. Ask me anything!` },
    ]);
    setInput(opt.defaultPrompt);
  };

  const sendMessage = async (text) => {
    const userMsg = text || input;
    if (!userMsg.trim()) return;
    setMessages((m) => [...m, { role: 'user', text: userMsg }]);
    setInput('');
    setLoading(true);
    try {
      const { data } = await chatbotService.chat(userMsg, activeType);
      setMessages((m) => [...m, { role: 'assistant', text: data.data.response }]);
    } catch {
      setMessages((m) => [...m, { role: 'assistant', text: 'Sorry, I could not process your request. Please try again.' }]);
    } finally {
      setLoading(false);
    }
  };

  const reset = () => { setActiveType(null); setMessages([]); setInput(''); };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">AI Health Assistant</h1>
          <p className="text-slate-500 text-sm mt-1">Powered by Google Gemini</p>
        </div>
        {activeType && (
          <Button size="sm" variant="secondary" icon={RefreshCw} onClick={reset}>New Chat</Button>
        )}
      </div>

      {/* Option Cards */}
      {!activeType && (
        <div className="space-y-4">
          <p className="text-slate-600 text-sm font-medium">Choose a topic to get started:</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {options.map((opt) => (
              <button
                key={opt.id}
                onClick={() => startChat(opt)}
                className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 text-left hover:border-blue-400 hover:shadow-md transition-all group"
              >
                <span className="text-3xl mb-3 block">{opt.icon}</span>
                <h3 className="font-semibold text-slate-900 group-hover:text-blue-700 transition-colors">{opt.title}</h3>
                <p className="text-xs text-slate-500 mt-1">{opt.description}</p>
              </button>
            ))}
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <Bot size={20} className="text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-800">
                <p className="font-semibold">CareSetu AI is here to help!</p>
                <p className="text-blue-600 mt-1">Select a topic above to get personalized healthcare guidance. All responses are for informational purposes — always consult your doctor.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Chat Interface */}
      {activeType && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col" style={{ height: '60vh' }}>
          <div className="px-4 py-3 border-b border-slate-100 flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
              <Bot size={16} className="text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-800">CareSetu AI</p>
              <p className="text-xs text-green-600 flex items-center gap-1"><span className="w-1.5 h-1.5 bg-green-500 rounded-full inline-block" /> Online</p>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg, i) => (
              <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'user' ? 'bg-blue-600' : 'bg-slate-100'}`}>
                  {msg.role === 'user' ? <User size={14} className="text-white" /> : <Bot size={14} className="text-slate-600" />}
                </div>
                <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm ${msg.role === 'user' ? 'bg-blue-600 text-white rounded-tr-sm' : 'bg-slate-100 text-slate-800 rounded-tl-sm'}`}>
                  {msg.role === 'assistant' ? (
                    <div className="relative">
                      <div className="prose prose-sm max-w-none pr-8">
                        <ReactMarkdown>{msg.text}</ReactMarkdown>
                      </div>
                      <button 
                        onClick={() => {
                          const utterance = new SpeechSynthesisUtterance(msg.text.replace(/[*_#]/g, ''));
                          window.speechSynthesis.cancel();
                          window.speechSynthesis.speak(utterance);
                        }}
                        className="absolute top-0 right-0 text-slate-400 hover:text-blue-600 transition-colors"
                        title="Read aloud"
                      >
                        <Volume2 size={16} />
                      </button>
                    </div>
                  ) : msg.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
                  <Bot size={14} className="text-slate-600" />
                </div>
                <div className="bg-slate-100 rounded-2xl px-4 py-3 flex items-center gap-2">
                  <Spinner size="sm" />
                  <span className="text-xs text-slate-500">Thinking...</span>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          <div className="p-4 border-t border-slate-100">
            <div className="flex gap-2">
              <input
                className="flex-1 rounded-xl border border-slate-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Type your question..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                disabled={loading}
              />
              <Button onClick={() => sendMessage()} loading={loading} disabled={!input.trim()} icon={Send}>
                Send
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatbotPage;
