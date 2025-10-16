import React, { useState } from 'react';
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Send, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const GEMINI_API_URL = "http://localhost:5000/api/chat";

export default function ChatWindow() {
  const [messages, setMessages] = useState([
    { sender: 'bot', text: '👋 Hey there! I’m Speedo Assistant — ready to help you with anything you need.' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { sender: 'user', text: input }];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch(GEMINI_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input }),
      });

      const data = await response.json();
      let botReply = data.reply || "Hmm, I didn’t quite get that — could you try rephrasing?";

      // ✂️ Keep replies short (2–3 lines)
      if (botReply.length > 250) {
        botReply = botReply.split('.').slice(0, 2).join('.') + '...';
      }

      // 💬 Add friendly personality if needed
      const friendlyIntros = [
        "Sure thing! ",
        "Got it! ",
        "Here’s what I found: ",
        "Absolutely! ",
        "No problem — "
      ];
      const intro = friendlyIntros[Math.floor(Math.random() * friendlyIntros.length)];
      botReply = intro + botReply.charAt(0).toUpperCase() + botReply.slice(1);

      setMessages([...newMessages, { sender: 'bot', text: botReply }]);
    } catch (error) {
      setMessages([
        ...newMessages,
        { sender: 'bot', text: '⚠️ Oops! I ran into a small issue connecting to the server. Please try again.' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 font-sans relative">
      {/* --- BACK ICON --- */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="absolute top-4 left-4 flex items-center space-x-2 cursor-pointer text-blue-600 hover:text-blue-800"
        onClick={() => navigate(-1)}
      >
        <ArrowLeft size={22} />
        <span className="text-sm font-medium">Back</span>
      </motion.div>

      {/* --- CHAT WINDOW --- */}
      <Card className="w-full max-w-md p-4 shadow-xl rounded-2xl bg-white">
        <motion.h2
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-xl font-semibold text-center text-blue-600 mb-2"
        >
          Speedo Assistant 💬
        </motion.h2>

        <CardContent className="flex flex-col space-y-4">
          <div className="h-96 overflow-y-auto space-y-3 p-2 border rounded-xl bg-blue-50">
            {messages.map((msg, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`px-4 py-2 rounded-xl max-w-[75%] text-sm text-white shadow-md ${
                    msg.sender === 'user' ? 'bg-blue-600' : 'bg-blue-400'
                  }`}
                >
                  {msg.text}
                </div>
              </motion.div>
            ))}
          </div>

          <div className="flex items-center space-x-2">
            <Input
              type="text"
              placeholder="Type a message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            />
            <Button onClick={sendMessage} disabled={loading}>
              <Send size={18} />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
