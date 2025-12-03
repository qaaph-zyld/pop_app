import { Shield, Users, Lock, Zap, Plus, UserPlus } from 'lucide-react';

interface HomeScreenProps {
  username: string;
  onUsernameChange: (username: string) => void;
  onCreateRoom: () => void;
  onJoinRoom: () => void;
}

export function HomeScreen({ 
  username, 
  onUsernameChange, 
  onCreateRoom, 
  onJoinRoom 
}: HomeScreenProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      {/* Logo */}
      <div className="mb-8 text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-700 mb-4">
          <Shield className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-4xl font-bold text-white mb-2">POP</h1>
        <p className="text-gray-400 text-lg">Private Open Protocol</p>
      </div>
      
      {/* Features */}
      <div className="grid grid-cols-3 gap-4 mb-8 max-w-md">
        <div className="flex flex-col items-center text-center">
          <div className="w-10 h-10 rounded-lg bg-gray-800 flex items-center justify-center mb-2">
            <Lock className="w-5 h-5 text-emerald-500" />
          </div>
          <span className="text-xs text-gray-400">E2E Encrypted</span>
        </div>
        <div className="flex flex-col items-center text-center">
          <div className="w-10 h-10 rounded-lg bg-gray-800 flex items-center justify-center mb-2">
            <Users className="w-5 h-5 text-emerald-500" />
          </div>
          <span className="text-xs text-gray-400">P2P Direct</span>
        </div>
        <div className="flex flex-col items-center text-center">
          <div className="w-10 h-10 rounded-lg bg-gray-800 flex items-center justify-center mb-2">
            <Zap className="w-5 h-5 text-emerald-500" />
          </div>
          <span className="text-xs text-gray-400">No Servers</span>
        </div>
      </div>
      
      {/* Username input */}
      <div className="w-full max-w-sm mb-6">
        <label className="block text-sm text-gray-400 mb-2">Your Anonymous Name</label>
        <input
          type="text"
          value={username}
          onChange={(e) => onUsernameChange(e.target.value)}
          className="input-field w-full text-center text-lg"
          placeholder="Enter a username..."
        />
      </div>
      
      {/* Action buttons */}
      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-sm">
        <button
          onClick={onCreateRoom}
          className="btn-primary flex-1 flex items-center justify-center gap-2 py-3"
        >
          <Plus className="w-5 h-5" />
          Create Room
        </button>
        <button
          onClick={onJoinRoom}
          className="btn-secondary flex-1 flex items-center justify-center gap-2 py-3"
        >
          <UserPlus className="w-5 h-5" />
          Join Room
        </button>
      </div>
      
      {/* Footer */}
      <div className="mt-12 text-center text-sm text-gray-600">
        <p>No registration. No tracking. No logs.</p>
        <p className="mt-1">Messages exist only between you and your peer.</p>
      </div>
    </div>
  );
}
