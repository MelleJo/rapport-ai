import HypotheekWizard from '../../../components/HypotheekForm';
import ChatInterface from '../../../components/ChatInterface';
import { useState } from 'react';

export default function HypotheekPage() {
  const [transcript, setTranscript] = useState('');
  const [showChat, setShowChat] = useState(false);

  const handleTranscriptComplete = (transcriptText: string) => {
    setTranscript(transcriptText);
    setShowChat(true);
  };

  const handleChatComplete = () => {
    setShowChat(false);
    // Continue with report generation
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Hypotheekadvies Generator</h1>
        <div className="bg-white rounded-lg shadow-lg p-6">
          <HypotheekWizard />
          {showChat && (
            <ChatInterface
              transcript={transcript}
              onComplete={handleChatComplete}
            />
          )}
        </div>
      </div>
    </div>
  );
}
