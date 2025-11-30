import { useState } from 'react';
import HeaderLoggedIn from '../components/HeaderLoggedIn';
import Footer from '../components/Footer';
import ProfileHero from '../components/ProfileHero';
import COLORS from '../constants/colors';

export default function Messages() {
  const [selectedChat, setSelectedChat] = useState(null);
  const [messageInput, setMessageInput] = useState('');
  const [messages, setMessages] = useState({});

  const user = {
    name: 'ibtihal',
    email: 'ibtihal@example.com',
    profileImage: null,
    followers: 328,
    following: 94,
    posts: 18
  };

  const conversations = [
    {
      id: 1,
      userName: 'Ibtihal',
      avatar: 'I',
      avatarColor: 'bg-[#FFEA00]',
      lastMessage: 'disponible?',
      unread: true
    },
    {
      id: 2,
      userName: 'Mehdi',
      avatar: 'M',
      avatarColor: 'bg-[#BBFF00]',
      lastMessage: 'disponible?',
      unread: false
    },
    {
      id: 3,
      userName: 'Hadil',
      avatar: 'H',
      avatarColor: 'bg-[#FF66CC]',
      lastMessage: 'disponible?',
      unread: false
    },
    {
      id: 4,
      userName: 'Ahmed',
      avatar: 'A',
      avatarColor: 'bg-[#FF7700]',
      lastMessage: 'disponible?',
      unread: false
    },
    {
      id: 5,
      userName: 'Lina',
      avatar: 'L',
      avatarColor: 'bg-[#BBFF00]',
      lastMessage: 'disponible?',
      unread: false
    },
    {
      id: 6,
      userName: 'Malak',
      avatar: 'M',
      avatarColor: 'bg-[#FFEA00]',
      lastMessage: 'mazalet disponible ?',
      unread: false
    }
  ];

  const defaultMessages = {
    1: [
      { id: 1, sender: 'other', text: 'disponible?', timestamp: Date.now() }
    ],
    2: [
      { id: 1, sender: 'other', text: 'disponible?', timestamp: Date.now() }
    ],
    3: [
      { id: 1, sender: 'other', text: 'disponible?', timestamp: Date.now() }
    ],
    4: [
      { id: 1, sender: 'other', text: 'disponible?', timestamp: Date.now() }
    ],
    5: [
      { id: 1, sender: 'other', text: 'disponible?', timestamp: Date.now() }
    ],
    6: [
      { id: 1, sender: 'other', text: 'mazalet disponible ?', timestamp: Date.now() },
      { id: 2, sender: 'me', text: 'oui', timestamp: Date.now() },
      { id: 3, sender: 'other', text: 'ch7al', timestamp: Date.now() },
      { id: 4, sender: 'me', text: '...', timestamp: Date.now() }
    ]
  };

  const chatMessages = selectedChat ? (messages[selectedChat.id] || defaultMessages[selectedChat.id] || []) : [];

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
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: COLORS.neutral.white }}>
      <HeaderLoggedIn user={user} />
      <ProfileHero user={user} isOwnProfile={true} />

      <div className="max-w-7xl mx-auto px-6 py-8 flex-1 w-full">
        <div className="flex gap-8 border-b mb-6" style={{ borderColor: COLORS.neutral.gray }}>
          <a 
            href="/profile"
            className="pb-3 font-semibold hover:opacity-80 transition-opacity"
            style={{ color: COLORS.text.secondary }}
          >
            Posts
          </a>
          <a 
            href="/wishlist"
            className="pb-3 font-semibold hover:opacity-80 transition-opacity"
            style={{ color: COLORS.text.secondary }}
          >
            WishList
          </a>
          <div 
            className="pb-3 border-b-2 font-semibold cursor-default"
            style={{ 
              color: COLORS.primary.pink,
              borderColor: COLORS.primary.pink 
            }}
          >
            Messages
          </div>
        </div>

        {!selectedChat ? (
          <div className="space-y-3">
            {conversations.map((conv) => (
              <div
                key={conv.id}
                onClick={() => setSelectedChat(conv)}
                className="rounded-lg p-4 flex items-center gap-4 hover:shadow-md transition-shadow cursor-pointer border"
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
                  <h3 className="font-semibold" style={{ color: COLORS.text.primary }}>{conv.userName}</h3>
                  <p className="text-sm truncate" style={{ color: COLORS.text.secondary }}>{conv.lastMessage}</p>
                </div>
                {conv.unread && (
                  <div 
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{ backgroundColor: COLORS.primary.pink }}
                  ></div>
                )}
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
                  className="flex-grow px-4 py-3 border rounded-lg focus:outline-none focus:ring-2"
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
      </div>

      <Footer />
    </div>
  );
}