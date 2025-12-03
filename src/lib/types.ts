/**
 * POP App Type Definitions
 */

export interface Message {
  id: string;
  type: 'chat' | 'file' | 'system';
  content: string;
  sender: string;
  timestamp: number;
  isOwn: boolean;
  file?: FileAttachment;
}

export interface FileAttachment {
  name: string;
  size: number;
  mimeType: string;
  data: string; // base64
}

export interface User {
  username: string;
  isConnected: boolean;
}

export type AppScreen = 'home' | 'create' | 'join' | 'chat';

export interface AppState {
  screen: AppScreen;
  username: string;
  isInitiator: boolean;
  connectionOffer: string;
  messages: Message[];
  isConnected: boolean;
}
