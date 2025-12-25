import { useState } from 'react';
import { motion } from 'framer-motion';
import PageTransition from '../components/PageTransition';
import { useAuth } from '../context/AuthContext';

export default function AIChat() {
  const { user, isAuthenticated } = useAuth();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!message.trim() || !isAuthenticated) return;

    const userMessage = { role: 'user', text: message, timestamp: new Date() };
    setMessages(prev => [...prev, userMessage]);
    setMessage('');
    setLoading(true);

    // TODO: Integrate with Gemini API
    // For now, show a placeholder response
    setTimeout(() => {
      const aiResponse = {
        role: 'assistant',
        text: 'AI Chat functionality will be integrated with Gemini API. This is a placeholder response.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
      setLoading(false);
    }, 1000);
  };

  return (
    <PageTransition>
      <div className="py-8 max-w-4xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold text-gray-900 mb-8"
        >
          AI Travel Assistant
        </motion.h1>

        {!isAuthenticated ? (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
            <p className="text-gray-700 mb-4">Please log in to use the AI Chat Assistant.</p>
            <button className="bg-teal text-white px-6 py-2 rounded-lg hover:bg-teal/90">
              Login
            </button>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.35 }}
            className="w-full max-w-2xl mx-auto bg-white dark:bg-neutral-900 shadow-lg rounded-2xl p-4 border border-neutral-100 dark:border-neutral-800 overflow-hidden"
          >
            {/* Messages Area */}
            <div className="h-96 overflow-y-auto p-6 space-y-4">
              {messages.length === 0 ? (
                <div className="text-center text-gray-500 py-20">
                  <p>Start a conversation with your AI travel assistant!</p>
                  <p className="text-sm mt-2">Ask about places, trips, food, or anything about Pondicherry.</p>
                </div>
              ) : (
                messages.map((msg, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        msg.role === 'user'
                          ? 'bg-teal text-white'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      <p>{msg.text}</p>
                    </div>
                  </motion.div>
                ))
              )}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 px-4 py-2 rounded-lg">
                    <p className="text-gray-600">Thinking...</p>
                  </div>
                </div>
              )}
            </div>

            {/* Input Area */}
            <div className="border-t p-4 flex gap-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask about places, trips, food..."
                className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSend}
                disabled={loading || !message.trim()}
                className="bg-teal text-white px-6 py-2 rounded-lg hover:bg-teal/90 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Send
              </motion.button>
            </div>
          </motion.div>
        )}
      </div>
    </PageTransition>
  );
}

