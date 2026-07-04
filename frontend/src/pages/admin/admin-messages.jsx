import { useState } from 'react';
import AdminSidebar from '../../components/admin/adminSidebar';
import AdminNavbar from '../../components/admin/adminNavbar';
import COLORS from '../../constants/colors';

export default function AdminMessages() {
  const [selectedChat, setSelectedChat] = useState(null);
  const [messageInput, setMessageInput] = useState('');
  const [messages, setMessages] = useState({});

  const conversations = [
    {
      id: 1,
      userName: 'Hanane',
      avatar: 'H',
      avatarColor: 'bg-[#FFEA00]',
      lastMessage: 'i declined a post for Hanane mamadou...',
      unread: false
    },
    {
      id: 2,
      userName: 'Malak Abd',
      avatar: 'M',
      avatarColor: 'bg-[#00BFFF]',
      lastMessage: 'ubna kima hak b1 eylak khtina...',
      unread: false
    },
    {
      id: 3,
      userName: 'Hanna',
      avatar: 'H',
      avatarColor: 'bg-[#BBFF00]',
      lastMessage: 'nrsal post b1 i7asbouli khamouni...',
      unread: false
    },
    {
      id: 4,
      userName: 'Maroine',
      avatar: 'M',
      avatarColor: 'bg-[#FFEA00]',
      lastMessage: 'i declined a post for chayma...',
      unread: false
    },
    {
      id: 5,
      userName: 'Hanna',
      avatar: 'H',
      avatarColor: 'bg-[#BBFF00]',
      lastMessage: 'rana jazyin b1 raki khtrouni...',
      unread: false
    }
  ];

const [defaultMessages] = useState(() => ({
    1: [
      { id: 1, sender: 'other', text: 'i declined a post for Hanane mamadou...', timestamp: Date.now() }
    ],
    2: [
      { id: 1, sender: 'other', text: 'ubna kima hak b1 eylak khtina...', timestamp: Date.now() }
    ],
    3: [
      { id: 1, sender: 'other', text: 'nrsal post b1 i7asbouli khamouni...', timestamp: Date.now() }
    ],
    4: [
      { id: 1, sender: 'other', text: 'i declined a post for chayma...', timestamp: Date.now() }
    ],
    5: [
      { id: 1, sender: 'other', text: 'rana jazyin b1 raki khtrouni...', timestamp: Date.now() }
    ]
  }));
  const chatMessages = selectedChat ? (messages[selectedChat.id] || defaultMessages[selectedChat.id] || []) : [];

  // Helper function to format timestamp
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const handleSendMessage = () => {
    if (!messageInput.trim() || !selectedChat) return;

    const newMessage = {
      id: Date.now(),
      sender: 'me',
      text: messageInput,
      timestamp: Date.now()
    };

    setMessages(prev => ({
      ...prev,
      [selectedChat.id]: [...(prev[selectedChat.id] || defaultMessages[selectedChat.id] || []), newMessage]
    }));

    setMessageInput('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main area */}
      <div className="flex-1 flex flex-col">
        {/* Top navbar */}
        <AdminNavbar />

        {/* Page content */}
        <main className="flex-1 bg-gray-100 p-6">
          {!selectedChat ? (
            <div className="space-y-3">
              {conversations.map((conv) => (
                <div
                  key={conv.id}
                  onClick={() => setSelectedChat(conv)}
                  className="rounded-lg p-4 flex items-start gap-4 hover:shadow-md transition-shadow cursor-pointer border"
                  style={{
                    backgroundColor: COLORS.neutral.white,
                    borderColor: COLORS.neutral.gray
                  }}
                >
                  <div
                    className={`${conv.avatarColor} w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg flex-shrink-0`}
                    style={{ color: COLORS.text.primary }}
                  >
                    {conv.avatar}
                  </div>
                  <div className="flex-grow min-w-0">
                    <h3 className="font-semibold mb-1" style={{ color: COLORS.text.primary }}>{conv.userName}</h3>
                    <p className="text-sm truncate" style={{ color: COLORS.text.secondary }}>{conv.lastMessage}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div
              className="rounded-lg overflow-hidden border"
              style={{
                height: '600px',
                backgroundColor: COLORS.neutral.white,
                borderColor: COLORS.neutral.gray
              }}
            >
              <div
                className="px-6 py-4 flex items-center gap-4 border-b"
                style={{
                  backgroundColor: COLORS.neutral.gray,
                  borderColor: COLORS.neutral.gray
                }}
              >
                <button
                  onClick={() => setSelectedChat(null)}
                  className="hover:opacity-70"
                  style={{ color: COLORS.text.primary }}
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>

                <div
                  className={`${selectedChat.avatarColor} w-10 h-10 rounded-full flex items-center justify-center font-bold`}
                  style={{ color: COLORS.text.primary }}
                >
                  {selectedChat.avatar}
                </div>

                <h3 className="font-semibold" style={{ color: COLORS.text.primary }}>{selectedChat.userName}</h3>
              </div>

              <div className="p-6 overflow-y-auto" style={{ height: 'calc(100% - 140px)' }}>
                <div className="space-y-4">
                  {chatMessages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                    >
                      {msg.sender === 'other' && (
                        <div
                          className={`${selectedChat.avatarColor} w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm mr-3 flex-shrink-0`}
                          style={{ color: COLORS.text.primary }}
                        >
                          {selectedChat.avatar}
                        </div>
                      )}

                      <div
                        className="max-w-xs lg:max-w-md px-4 py-2 rounded-lg"
                        style={{
                          backgroundColor: msg.sender === 'me' ? COLORS.primary.blue : COLORS.neutral.gray,
                          color: msg.sender === 'me' ? COLORS.neutral.white : COLORS.text.primary
                        }}
                      >
                        {msg.sender === 'other' && (
                          <p className="font-semibold text-sm mb-1">{selectedChat.userName}</p>
                        )}
                        <p className="text-sm">{msg.text}</p>
                        <p className="text-xs opacity-70 mt-1">
                          {formatTime(msg.timestamp)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t px-6 py-4" style={{ borderColor: COLORS.neutral.gray }}>
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="send a message"
                    className="flex-1 px-4 py-3 border rounded-lg focus:outline-none focus:ring-2"
                    style={{
                      borderColor: COLORS.neutral.gray,
                      '--tw-ring-color': COLORS.primary.blue
                    }}
                  />
                  <button
                    onClick={handleSendMessage}
                    className="p-3 rounded-lg hover:opacity-90 transition-opacity"
                    style={{
                      backgroundColor: COLORS.primary.blue,
                      color: COLORS.neutral.white
                    }}
                  >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}