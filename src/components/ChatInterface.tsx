import React, { useState } from 'react';
import { openai } from '../lib/openai';
import { Button } from './ui/button';
import Dialog from './ui/dialog';
import { Textarea } from './ui/textarea';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatInterfaceProps {
  transcript: string;
  onComplete: () => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ transcript, onComplete }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');

  const askGPT4oMini = async (messages: Message[]) => {
    // Implement the logic to interact with GPT-4o-mini
    // This is a placeholder implementation
    return "This is a placeholder response from GPT-4o-mini.";
  };

  const handleSend = async () => {
    if (input.trim()) {
      const userMessage: Message = { role: 'user', content: input };
      setMessages([...messages, userMessage]);
      setInput('');

      const response = await askGPT4oMini([...messages, userMessage]);
      const assistantMessage: Message = { role: 'assistant', content: response };
      setMessages([...messages, userMessage, assistantMessage]);
    }
  };

  return (
    <Dialog isOpen={true} onClose={() => {}} title="Chat Interface">
      <div className="chat-interface">
        <div className="messages">
          {messages.map((msg, index) => (
            <div key={index} className={`message ${msg.role}`}>
              {msg.content}
            </div>
          ))}
        </div>
        <Textarea
          value={input}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setInput(e.target.value)}
          placeholder="Type your message..."
        />
        <Button onClick={handleSend}>Send</Button>
      </div>
    </Dialog>
  );
};

export default ChatInterface;
