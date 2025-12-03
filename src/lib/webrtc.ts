/**
 * POP WebRTC P2P Connection Module
 * Handles peer-to-peer connections using WebRTC DataChannel
 */

export type ConnectionState = 'disconnected' | 'connecting' | 'connected' | 'failed';

export interface PeerMessage {
  type: 'chat' | 'file' | 'system' | 'ping';
  payload: unknown;
  timestamp: number;
  sender: string;
}

export interface ConnectionOffer {
  type: 'offer' | 'answer';
  sdp: string;
  iceCandidates: RTCIceCandidateInit[];
}

// STUN servers for NAT traversal (free, public servers)
const ICE_SERVERS: RTCIceServer[] = [
  { urls: 'stun:stun.l.google.com:19302' },
  { urls: 'stun:stun1.l.google.com:19302' },
  { urls: 'stun:stun2.l.google.com:19302' },
  { urls: 'stun:stun.services.mozilla.com' },
];

export class P2PConnection {
  private peerConnection: RTCPeerConnection | null = null;
  private dataChannel: RTCDataChannel | null = null;
  private iceCandidates: RTCIceCandidateInit[] = [];
  private iceGatheringComplete = false;
  
  public onStateChange: ((state: ConnectionState) => void) | null = null;
  public onMessage: ((message: PeerMessage) => void) | null = null;
  public onError: ((error: Error) => void) | null = null;
  
  private state: ConnectionState = 'disconnected';
  
  constructor() {
    this.createPeerConnection();
  }
  
  private createPeerConnection() {
    this.peerConnection = new RTCPeerConnection({
      iceServers: ICE_SERVERS,
    });
    
    this.peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        this.iceCandidates.push(event.candidate.toJSON());
      }
    };
    
    this.peerConnection.onicegatheringstatechange = () => {
      if (this.peerConnection?.iceGatheringState === 'complete') {
        this.iceGatheringComplete = true;
      }
    };
    
    this.peerConnection.onconnectionstatechange = () => {
      const state = this.peerConnection?.connectionState;
      switch (state) {
        case 'connected':
          this.updateState('connected');
          break;
        case 'disconnected':
        case 'closed':
          this.updateState('disconnected');
          break;
        case 'failed':
          this.updateState('failed');
          break;
        case 'connecting':
          this.updateState('connecting');
          break;
      }
    };
    
    this.peerConnection.ondatachannel = (event) => {
      this.setupDataChannel(event.channel);
    };
  }
  
  private setupDataChannel(channel: RTCDataChannel) {
    this.dataChannel = channel;
    
    this.dataChannel.onopen = () => {
      console.log('DataChannel opened');
      this.updateState('connected');
    };
    
    this.dataChannel.onclose = () => {
      console.log('DataChannel closed');
      this.updateState('disconnected');
    };
    
    this.dataChannel.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data) as PeerMessage;
        this.onMessage?.(message);
      } catch (error) {
        console.error('Failed to parse message:', error);
      }
    };
    
    this.dataChannel.onerror = (error) => {
      console.error('DataChannel error:', error);
      this.onError?.(new Error('DataChannel error'));
    };
  }
  
  private updateState(newState: ConnectionState) {
    if (this.state !== newState) {
      this.state = newState;
      this.onStateChange?.(newState);
    }
  }
  
  public getState(): ConnectionState {
    return this.state;
  }
  
  // Create an offer (initiator)
  public async createOffer(): Promise<ConnectionOffer> {
    if (!this.peerConnection) {
      throw new Error('PeerConnection not initialized');
    }
    
    this.updateState('connecting');
    
    // Create data channel
    const channel = this.peerConnection.createDataChannel('pop-chat', {
      ordered: true,
    });
    this.setupDataChannel(channel);
    
    // Create offer
    const offer = await this.peerConnection.createOffer();
    await this.peerConnection.setLocalDescription(offer);
    
    // Wait for ICE gathering to complete
    await this.waitForIceGathering();
    
    return {
      type: 'offer',
      sdp: this.peerConnection.localDescription?.sdp || '',
      iceCandidates: this.iceCandidates,
    };
  }
  
  // Accept an offer and create answer (responder)
  public async acceptOffer(offer: ConnectionOffer): Promise<ConnectionOffer> {
    if (!this.peerConnection) {
      throw new Error('PeerConnection not initialized');
    }
    
    this.updateState('connecting');
    
    // Set remote description
    await this.peerConnection.setRemoteDescription({
      type: 'offer',
      sdp: offer.sdp,
    });
    
    // Add ICE candidates
    for (const candidate of offer.iceCandidates) {
      await this.peerConnection.addIceCandidate(candidate);
    }
    
    // Create answer
    const answer = await this.peerConnection.createAnswer();
    await this.peerConnection.setLocalDescription(answer);
    
    // Wait for ICE gathering
    await this.waitForIceGathering();
    
    return {
      type: 'answer',
      sdp: this.peerConnection.localDescription?.sdp || '',
      iceCandidates: this.iceCandidates,
    };
  }
  
  // Complete connection with answer (initiator)
  public async completeConnection(answer: ConnectionOffer): Promise<void> {
    if (!this.peerConnection) {
      throw new Error('PeerConnection not initialized');
    }
    
    await this.peerConnection.setRemoteDescription({
      type: 'answer',
      sdp: answer.sdp,
    });
    
    for (const candidate of answer.iceCandidates) {
      await this.peerConnection.addIceCandidate(candidate);
    }
  }
  
  private waitForIceGathering(): Promise<void> {
    return new Promise((resolve) => {
      if (this.iceGatheringComplete || this.peerConnection?.iceGatheringState === 'complete') {
        resolve();
        return;
      }
      
      const checkInterval = setInterval(() => {
        if (this.iceGatheringComplete || this.peerConnection?.iceGatheringState === 'complete') {
          clearInterval(checkInterval);
          resolve();
        }
      }, 100);
      
      // Timeout after 5 seconds
      setTimeout(() => {
        clearInterval(checkInterval);
        resolve();
      }, 5000);
    });
  }
  
  // Send a message
  public sendMessage(message: PeerMessage): boolean {
    if (!this.dataChannel || this.dataChannel.readyState !== 'open') {
      console.error('DataChannel not open');
      return false;
    }
    
    try {
      this.dataChannel.send(JSON.stringify(message));
      return true;
    } catch (error) {
      console.error('Failed to send message:', error);
      return false;
    }
  }
  
  // Send a file
  public async sendFile(file: File, sender: string): Promise<boolean> {
    if (!this.dataChannel || this.dataChannel.readyState !== 'open') {
      return false;
    }
    
    try {
      const arrayBuffer = await file.arrayBuffer();
      const base64 = btoa(
        new Uint8Array(arrayBuffer).reduce(
          (data, byte) => data + String.fromCharCode(byte),
          ''
        )
      );
      
      const message: PeerMessage = {
        type: 'file',
        payload: {
          name: file.name,
          size: file.size,
          mimeType: file.type,
          data: base64,
        },
        timestamp: Date.now(),
        sender,
      };
      
      return this.sendMessage(message);
    } catch (error) {
      console.error('Failed to send file:', error);
      return false;
    }
  }
  
  // Disconnect
  public disconnect() {
    this.dataChannel?.close();
    this.peerConnection?.close();
    this.dataChannel = null;
    this.peerConnection = null;
    this.iceCandidates = [];
    this.iceGatheringComplete = false;
    this.updateState('disconnected');
    
    // Recreate for next connection
    this.createPeerConnection();
  }
}

// Encode connection offer to shareable string
export function encodeOffer(offer: ConnectionOffer): string {
  const json = JSON.stringify(offer);
  return btoa(json);
}

// Decode connection offer from string
export function decodeOffer(encoded: string): ConnectionOffer {
  const json = atob(encoded);
  return JSON.parse(json);
}
