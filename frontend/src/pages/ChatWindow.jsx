import React, { useState } from 'react';
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Send } from "lucide-react";
import { motion } from "framer-motion";

const GEMINI_API_URL = "http://localhost:5000/api/chat"; // ✅ proxy endpoint

export default function ChatWindow() {
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Hello! How can I assist you today?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

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
      const botReply = data.reply || "I'm sorry, I couldn’t process that.";
      setMessages([...newMessages, { sender: 'bot', text: botReply }]);
    } catch (error) {
      setMessages([
        ...newMessages,
        { sender: 'bot', text: 'There was an error connecting to the server.' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-blue-50">
      <Card className="w-full max-w-md p-4 shadow-lg rounded-2xl bg-white">
        <CardContent className="flex flex-col space-y-4">
          <div className="h-96 overflow-y-auto space-y-3 p-2 border rounded-xl bg-blue-100">
            {messages.map((msg, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`px-4 py-2 rounded-xl max-w-[75%] text-white text-sm ${
                    msg.sender === 'user' ? 'bg-blue-500' : 'bg-blue-400'
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
