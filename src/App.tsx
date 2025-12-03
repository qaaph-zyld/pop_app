import { useChat } from './hooks/useChat';
import { HomeScreen } from './components/HomeScreen';
import { CreateRoom } from './components/CreateRoom';
import { JoinRoom } from './components/JoinRoom';
import { ChatScreen } from './components/ChatScreen';

function App() {
  const {
    screen,
    setScreen,
    username,
    setUsername,
    messages,
    connectionState,
    connectionOffer,
    peerUsername,
    createRoom,
    joinRoom,
    completeConnection,
    goToChat,
    sendMessage,
    sendFile,
    disconnect,
  } = useChat();
  
  const handleJoinClick = () => {
    setScreen('join');
  };

  const handleBack = () => {
    disconnect();
  };

  return (
    <>
      {screen === 'home' && (
        <HomeScreen
          username={username}
          onUsernameChange={setUsername}
          onCreateRoom={createRoom}
          onJoinRoom={handleJoinClick}
        />
      )}
      
      {screen === 'create' && (
        <CreateRoom
          connectionOffer={connectionOffer}
          connectionState={connectionState}
          onCompleteConnection={completeConnection}
          onBack={handleBack}
        />
      )}
      
      {screen === 'join' && (
        <JoinRoom
          connectionOffer={connectionOffer}
          connectionState={connectionState}
          onJoinRoom={joinRoom}
          onGoToChat={goToChat}
          onBack={handleBack}
        />
      )}
      
      {screen === 'chat' && (
        <ChatScreen
          peerUsername={peerUsername}
          messages={messages}
          connectionState={connectionState}
          onSendMessage={sendMessage}
          onSendFile={sendFile}
          onDisconnect={disconnect}
        />
      )}
    </>
  );
}

export default App;
