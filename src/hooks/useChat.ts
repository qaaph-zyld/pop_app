/**
 * POP Chat Hook
 * Manages P2P connection and messaging state
 */

import { useState, useCallback, useRef, useEffect } from 'react';
import { P2PConnection, encodeOffer, decodeOffer, type PeerMessage, type ConnectionState } from '../lib/webrtc';
import { generateKey, exportKey, importKey, encryptMessage, decryptMessage, generateUsername } from '../lib/crypto';
import type { Message, AppScreen } from '../lib/types';

export function useChat() {
  const [screen, setScreen] = useState<AppScreen>('home');
  const [username, setUsername] = useState(() => generateUsername());
  const [messages, setMessages] = useState<Message[]>([]);
  const [connectionState, setConnectionState] = useState<ConnectionState>('disconnected');
  const [connectionOffer, setConnectionOffer] = useState('');
  const [isInitiator, setIsInitiator] = useState(false);
  const [peerUsername, setPeerUsername] = useState('');
  
  const connectionRef = useRef<P2PConnection | null>(null);
  const encryptionKeyRef = useRef<CryptoKey | null>(null);
  
  // Initialize connection
  useEffect(() => {
    connectionRef.current = new P2PConnection();
    
    connectionRef.current.onStateChange = (state) => {
      setConnectionState(state);
      if (state === 'connected') {
        addSystemMessage('Connected! Your conversation is end-to-end encrypted.');
      } else if (state === 'disconnected' && screen === 'chat') {
        addSystemMessage('Peer disconnected.');
      }
    };
    
    connectionRef.current.onMessage = async (message) => {
      await handleIncomingMessage(message);
    };
    
    return () => {
      connectionRef.current?.disconnect();
    };
  }, []);
  
  const addSystemMessage = useCallback((content: string) => {
    const msg: Message = {
      id: crypto.randomUUID(),
      type: 'system',
      content,
      sender: 'system',
      timestamp: Date.now(),
      isOwn: false,
    };
    setMessages(prev => [...prev, msg]);
  }, []);
  
  const handleIncomingMessage = async (peerMessage: PeerMessage) => {
    if (!encryptionKeyRef.current) return;
    
    if (peerMessage.type === 'system') {
      const payload = peerMessage.payload as { username?: string };
      if (payload.username) {
        setPeerUsername(payload.username);
        addSystemMessage(`${payload.username} joined the chat.`);
      }
      return;
    }
    
    if (peerMessage.type === 'chat') {
      try {
        const decryptedContent = await decryptMessage(
          peerMessage.payload as string,
          encryptionKeyRef.current
        );
        
        const msg: Message = {
          id: crypto.randomUUID(),
          type: 'chat',
          content: decryptedContent,
          sender: peerMessage.sender,
          timestamp: peerMessage.timestamp,
          isOwn: false,
        };
        setMessages(prev => [...prev, msg]);
      } catch (error) {
        console.error('Failed to decrypt message:', error);
      }
    }
    
    if (peerMessage.type === 'file') {
      const payload = peerMessage.payload as {
        name: string;
        size: number;
        mimeType: string;
        data: string;
      };
      
      const msg: Message = {
        id: crypto.randomUUID(),
        type: 'file',
        content: `Sent a file: ${payload.name}`,
        sender: peerMessage.sender,
        timestamp: peerMessage.timestamp,
        isOwn: false,
        file: payload,
      };
      setMessages(prev => [...prev, msg]);
    }
  };
  
  // Create a new chat room (initiator)
  const createRoom = useCallback(async () => {
    if (!connectionRef.current) return;
    
    setIsInitiator(true);
    setScreen('create');
    
    // Generate encryption key
    const key = await generateKey();
    encryptionKeyRef.current = key;
    const keyString = await exportKey(key);
    
    // Create WebRTC offer
    const offer = await connectionRef.current.createOffer();
    const encodedOffer = encodeOffer(offer);
    
    // Combine key and offer
    const fullOffer = `${keyString}|${encodedOffer}`;
    setConnectionOffer(fullOffer);
  }, []);
  
  // Join an existing room
  const joinRoom = useCallback(async (inviteCode: string) => {
    if (!connectionRef.current) return;
    
    try {
      // Parse invite code
      const normalizedCode = inviteCode.replace(/\s/g, '');
      const [keyString, encodedOffer] = normalizedCode.split('|');
      
      if (!keyString || !encodedOffer) {
        throw new Error('Invalid invite code');
      }
      
      // Import encryption key
      const key = await importKey(keyString);
      encryptionKeyRef.current = key;
      
      // Decode and accept offer
      const offer = decodeOffer(encodedOffer);
      const answer = await connectionRef.current.acceptOffer(offer);
      
      // Encode answer for sharing back
      const encodedAnswer = encodeOffer(answer);
      setConnectionOffer(encodedAnswer);
      setIsInitiator(false);
      setScreen('join');
    } catch (error) {
      console.error('Failed to join room:', error);
      addSystemMessage('Failed to join room. Invalid invite code.');
    }
  }, [addSystemMessage]);
  
  // Complete connection (initiator receives answer)
  const completeConnection = useCallback(async (answerCode: string) => {
    if (!connectionRef.current) return;
    
    try {
      const normalizedAnswerCode = answerCode.replace(/\s/g, '');
      const answer = decodeOffer(normalizedAnswerCode);
      await connectionRef.current.completeConnection(answer);
      
      // Send username to peer
      setTimeout(() => {
        connectionRef.current?.sendMessage({
          type: 'system',
          payload: { username },
          timestamp: Date.now(),
          sender: username,
        });
      }, 500);
      
      setScreen('chat');
    } catch (error) {
      console.error('Failed to complete connection:', error);
      // Reset connection state so UI is not stuck in 'connecting'
      connectionRef.current?.disconnect();
      addSystemMessage('Failed to connect. Invalid answer code.');
    }
  }, [username, addSystemMessage]);
  
  // Go to chat after joining
  const goToChat = useCallback(() => {
    // Send username to peer
    setTimeout(() => {
      connectionRef.current?.sendMessage({
        type: 'system',
        payload: { username },
        timestamp: Date.now(),
        sender: username,
      });
    }, 500);
    
    setScreen('chat');
  }, [username]);
  
  // Send a chat message
  const sendMessage = useCallback(async (content: string) => {
    if (!connectionRef.current || !encryptionKeyRef.current) return;
    
    try {
      const encryptedContent = await encryptMessage(content, encryptionKeyRef.current);
      
      const success = connectionRef.current.sendMessage({
        type: 'chat',
        payload: encryptedContent,
        timestamp: Date.now(),
        sender: username,
      });
      
      if (success) {
        const msg: Message = {
          id: crypto.randomUUID(),
          type: 'chat',
          content,
          sender: username,
          timestamp: Date.now(),
          isOwn: true,
        };
        setMessages(prev => [...prev, msg]);
      }
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  }, [username]);
  
  // Send a file
  const sendFile = useCallback(async (file: File) => {
    if (!connectionRef.current) return;
    
    const success = await connectionRef.current.sendFile(file, username);
    
    if (success) {
      const msg: Message = {
        id: crypto.randomUUID(),
        type: 'file',
        content: `Sent a file: ${file.name}`,
        sender: username,
        timestamp: Date.now(),
        isOwn: true,
        file: {
          name: file.name,
          size: file.size,
          mimeType: file.type,
          data: '',
        },
      };
      setMessages(prev => [...prev, msg]);
    }
  }, [username]);
  
  // Disconnect and reset
  const disconnect = useCallback(() => {
    connectionRef.current?.disconnect();
    setMessages([]);
    setConnectionOffer('');
    setScreen('home');
    setPeerUsername('');
    encryptionKeyRef.current = null;
  }, []);
  
  return {
    screen,
    setScreen,
    username,
    setUsername,
    messages,
    connectionState,
    connectionOffer,
    isInitiator,
    peerUsername,
    createRoom,
    joinRoom,
    completeConnection,
    goToChat,
    sendMessage,
    sendFile,
    disconnect,
  };
}
