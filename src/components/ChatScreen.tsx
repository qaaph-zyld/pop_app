import { useState, useRef, useEffect } from 'react';
import { Send, Paperclip, LogOut, Shield, Download } from 'lucide-react';
import type { Message } from '../lib/types';
import type { ConnectionState } from '../lib/webrtc';

interface ChatScreenProps {
  peerUsername: string;
  messages: Message[];
  connectionState: ConnectionState;
  onSendMessage: (content: string) => void;
  onSendFile: (file: File) => void;
  onDisconnect: () => void;
}

export function ChatScreen({
  peerUsername,
  messages,
  connectionState,
  onSendMessage,
  onSendFile,
  onDisconnect,
}: ChatScreenProps) {
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() && connectionState === 'connected') {
      onSendMessage(inputValue.trim());
      setInputValue('');
    }
  };
  
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onSendFile(file);
    }
    e.target.value = '';
  };
  
  const downloadFile = (message: Message) => {
    if (!message.file) return;
    
    const binary = atob(message.file.data);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    
    const blob = new Blob([bytes], { type: message.file.mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = message.file.name;
    a.click();
    URL.revokeObjectURL(url);
  };
  
  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-950">
      {/* Header */}
      <header className="bg-gray-900 border-b border-gray-800 px-4 py-3">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-semibold text-white">
                {peerUsername || 'Waiting for peer...'}
              </h1>
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${connectionState === 'connected' ? 'bg-emerald-500' : 'bg-yellow-500'}`} />
                <span className="text-xs text-gray-400">
                  {connectionState === 'connected' ? 'E2E Encrypted' : 'Connecting...'}
                </span>
              </div>
            </div>
          </div>
          
          <button
            onClick={onDisconnect}
            className="p-2 rounded-lg text-gray-400 hover:text-red-400 hover:bg-gray-800 transition-colors"
            title="Disconnect"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </header>
      
      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        <div className="max-w-3xl mx-auto space-y-4">
          {messages.map((message) => (
            <div key={message.id}>
              {message.type === 'system' ? (
                <div className="flex justify-center">
                  <span className="text-xs text-gray-500 bg-gray-900 px-3 py-1 rounded-full">
                    {message.content}
                  </span>
                </div>
              ) : (
                <div className={`flex ${message.isOwn ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[75%] ${message.isOwn ? 'order-2' : ''}`}>
                    {!message.isOwn && (
                      <span className="text-xs text-gray-500 ml-2 mb-1 block">
                        {message.sender}
                      </span>
                    )}
                    <div
                      className={`rounded-2xl px-4 py-2 ${
                        message.isOwn
                          ? 'bg-emerald-600 text-white rounded-tr-sm'
                          : 'bg-gray-800 text-gray-100 rounded-tl-sm'
                      }`}
                    >
                      {message.type === 'file' && message.file ? (
                        <div className="flex items-center gap-3">
                          <div className="flex-1">
                            <p className="font-medium text-sm">{message.file.name}</p>
                            <p className="text-xs opacity-70">
                              {formatFileSize(message.file.size)}
                            </p>
                          </div>
                          {!message.isOwn && message.file.data && (
                            <button
                              onClick={() => downloadFile(message)}
                              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                            >
                              <Download className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      ) : (
                        <p className="text-sm whitespace-pre-wrap break-words">
                          {message.content}
                        </p>
                      )}
                    </div>
                    <span className={`text-xs text-gray-600 mt-1 block ${message.isOwn ? 'text-right mr-2' : 'ml-2'}`}>
                      {formatTime(message.timestamp)}
                    </span>
                  </div>
                </div>
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>
      
      {/* Input */}
      <div className="bg-gray-900 border-t border-gray-800 px-4 py-3">
        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto flex items-center gap-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={connectionState !== 'connected'}
            className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors disabled:opacity-50"
          >
            <Paperclip className="w-5 h-5" />
          </button>
          
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={connectionState === 'connected' ? 'Type a message...' : 'Waiting for connection...'}
            disabled={connectionState !== 'connected'}
            className="input-field flex-1"
          />
          
          <button
            type="submit"
            disabled={!inputValue.trim() || connectionState !== 'connected'}
            className="btn-primary p-2"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
        
        <p className="text-center text-xs text-gray-600 mt-2 max-w-3xl mx-auto">
          Messages are encrypted with AES-256-GCM and never stored on any server
        </p>
      </div>
    </div>
  );
}
