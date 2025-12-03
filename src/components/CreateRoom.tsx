import { useState } from 'react';
import { Copy, Check, ArrowLeft, ArrowRight, Loader2 } from 'lucide-react';
import type { ConnectionState } from '../lib/webrtc';

interface CreateRoomProps {
  connectionOffer: string;
  connectionState: ConnectionState;
  onCompleteConnection: (answerCode: string) => void;
  onBack: () => void;
}

export function CreateRoom({
  connectionOffer,
  connectionState,
  onCompleteConnection,
  onBack,
}: CreateRoomProps) {
  const [copied, setCopied] = useState(false);
  const [answerCode, setAnswerCode] = useState('');
  const [step, setStep] = useState<1 | 2>(1);
  
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(connectionOffer);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };
  
  const handleConnect = () => {
    if (answerCode.trim()) {
      onCompleteConnection(answerCode.trim());
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Header */}
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
        
        <h1 className="text-2xl font-bold text-white mb-2">Create a Secure Room</h1>
        <p className="text-gray-400 mb-8">Share the invite code with your friend</p>
        
        {/* Steps */}
        <div className="flex items-center gap-4 mb-8">
          <div className={`flex items-center gap-2 ${step === 1 ? 'text-emerald-500' : 'text-gray-500'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${step === 1 ? 'bg-emerald-500 text-white' : 'bg-gray-800 text-gray-400'}`}>
              1
            </div>
            <span className="text-sm">Share Code</span>
          </div>
          <div className="flex-1 h-px bg-gray-800" />
          <div className={`flex items-center gap-2 ${step === 2 ? 'text-emerald-500' : 'text-gray-500'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${step === 2 ? 'bg-emerald-500 text-white' : 'bg-gray-800 text-gray-400'}`}>
              2
            </div>
            <span className="text-sm">Enter Response</span>
          </div>
        </div>
        
        {step === 1 ? (
          <>
            {/* Invite code display */}
            <div className="card mb-4">
              <label className="block text-sm text-gray-400 mb-2">Your Invite Code</label>
              <div className="relative">
                <textarea
                  readOnly
                  value={connectionOffer}
                  className="input-field w-full h-32 text-xs font-mono resize-none pr-12"
                />
                <button
                  onClick={copyToClipboard}
                  className="absolute top-2 right-2 p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors"
                >
                  {copied ? (
                    <Check className="w-4 h-4 text-emerald-500" />
                  ) : (
                    <Copy className="w-4 h-4 text-gray-400" />
                  )}
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Send this code to your friend via any secure channel
              </p>
            </div>
            
            <button
              onClick={() => setStep(2)}
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              Next: Enter Response
              <ArrowRight className="w-4 h-4" />
            </button>
          </>
        ) : (
          <>
            {/* Answer code input */}
            <div className="card mb-4">
              <label className="block text-sm text-gray-400 mb-2">Friend's Response Code</label>
              <textarea
                value={answerCode}
                onChange={(e) => setAnswerCode(e.target.value)}
                placeholder="Paste the response code from your friend..."
                className="input-field w-full h-32 text-xs font-mono resize-none"
              />
              <p className="text-xs text-gray-500 mt-2">
                Your friend will send you a response code after accepting your invite
              </p>
            </div>
            
            <div className="flex gap-4">
              <button
                onClick={() => setStep(1)}
                className="btn-secondary flex-1"
              >
                Back
              </button>
              <button
                onClick={handleConnect}
                disabled={!answerCode.trim() || connectionState === 'connecting'}
                className="btn-primary flex-1 flex items-center justify-center gap-2"
              >
                {connectionState === 'connecting' ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Connecting...
                  </>
                ) : (
                  'Connect'
                )}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
