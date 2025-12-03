import { useState } from 'react';
import { Copy, Check, ArrowLeft, Loader2 } from 'lucide-react';
import type { ConnectionState } from '../lib/webrtc';

interface JoinRoomProps {
  connectionOffer: string; // The answer to share back
  connectionState: ConnectionState;
  onJoinRoom: (inviteCode: string) => void;
  onGoToChat: () => void;
  onBack: () => void;
}

export function JoinRoom({
  connectionOffer,
  connectionState,
  onJoinRoom,
  onGoToChat,
  onBack,
}: JoinRoomProps) {
  const [inviteCode, setInviteCode] = useState('');
  const [copied, setCopied] = useState(false);
  const [hasJoined, setHasJoined] = useState(false);
  
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(connectionOffer);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };
  
  const handleJoin = () => {
    if (inviteCode.trim()) {
      onJoinRoom(inviteCode.trim());
      setHasJoined(true);
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
        
        <h1 className="text-2xl font-bold text-white mb-2">Join a Secure Room</h1>
        <p className="text-gray-400 mb-8">Enter the invite code from your friend</p>
        
        {!hasJoined ? (
          <>
            {/* Invite code input */}
            <div className="card mb-4">
              <label className="block text-sm text-gray-400 mb-2">Invite Code</label>
              <textarea
                value={inviteCode}
                onChange={(e) => setInviteCode(e.target.value)}
                placeholder="Paste the invite code here..."
                className="input-field w-full h-32 text-xs font-mono resize-none"
              />
            </div>
            
            <button
              onClick={handleJoin}
              disabled={!inviteCode.trim()}
              className="btn-primary w-full"
            >
              Join Room
            </button>
          </>
        ) : (
          <>
            {/* Response code to share back */}
            <div className="card mb-4">
              <label className="block text-sm text-gray-400 mb-2">Your Response Code</label>
              <p className="text-xs text-gray-500 mb-3">
                Send this code back to your friend to complete the connection
              </p>
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
            </div>
            
            <button
              onClick={onGoToChat}
              disabled={connectionState === 'connecting'}
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              {connectionState === 'connecting' ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Waiting for connection...
                </>
              ) : connectionState === 'connected' ? (
                'Enter Chat'
              ) : (
                'Continue to Chat'
              )}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
