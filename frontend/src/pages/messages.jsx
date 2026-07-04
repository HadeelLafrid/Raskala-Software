import { useState, useEffect } from 'react';
import {  useLocation } from 'react-router-dom';
// import {  useLocation } from 'react-router-dom';
import HeaderLoggedIn from '../components/HeaderLoggedIn';
import Footer from '../components/Footer';
import ProfileHero from '../components/ProfileHero';
import COLORS from '../constants/colors';
import api from '../api/axios';

export default function Messages() {
  // const navigate = useNavigate();
  const location = useLocation();
  
  const [selectedChat, setSelectedChat] = useState(null);
  const [messageInput, setMessageInput] = useState('');
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sendingMessage, setSendingMessage] = useState(false);

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  // Get chatId from URL
  const params = new URLSearchParams(location.search);
  const chatIdFromUrl = params.get("chatId");

  // Fetch conversations on mount
  useEffect(() => {
    fetchConversations();
  }, []);

  // Auto-open chat if URL has chatId parameter
  useEffect(() => {
    if (!loading && chatIdFromUrl && conversations.length > 0) {
      const chat = conversations.find(c => c.chat_id === chatIdFromUrl);
      if (chat) {
        setSelectedChat(chat);
      }
    }
  }, [loading, chatIdFromUrl, conversations]);

  // Fetch messages when chat is selected
  useEffect(() => {
    if (selectedChat) {
      fetchMessages(selectedChat.chat_id);
    }
  }, [selectedChat]);

  const fetchConversations = async () => {
    setLoading(true);
    try {
      const response = await api.get('/chats');
      
      if (response.data.success) {
        const formattedConversations = response.data.conversations.map(conv => ({
          id: conv.chat_id,
          chat_id: conv.chat_id,
          userName: conv.other_user.name,
          avatar: conv.other_user.name.charAt(0).toUpperCase(),
          avatarColor: getRandomColor(),
          lastMessage: conv.last_message || 'No messages yet',
          unread: conv.unread_count > 0,
          unreadCount: conv.unread_count,
          otherUser: conv.other_user,
          item: conv.item,
          lastMessageAt: conv.last_message_at,
        }));
        
        setConversations(formattedConversations);
      }
    } catch (error) {
      console.error('Failed to fetch conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (chatId) => {
    try {
      const response = await api.get(`/chats/${chatId}/messages`);
      
      if (response.data.success) {
        const formattedMessages = response.data.messages.map(msg => ({
          id: msg.message_id,
          sender: msg.is_mine ? 'me' : 'other',
          text: msg.body,
          timestamp: new Date(msg.created_at).getTime(),
          read: msg.read,
          senderInfo: msg.sender,
        }));
        
        setMessages(formattedMessages);
        markAsRead(chatId);
      }
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    }
  };

  const handleSendMessage = async () => {
    if (!messageInput.trim() || !selectedChat) return;

    setSendingMessage(true);
    
    try {
      const response = await api.post('/chats/messages', {
        receiver_id: selectedChat.otherUser.user_id,
        body: messageInput,
        type: 'text',
        item_id: selectedChat.item?.product_id || null,
      });

      if (response.data.success) {
        const newMessage = {
          id: response.data.data.message_id,
          sender: 'me',
          text: messageInput,
          timestamp: Date.now(),
          read: false,
        };

        setMessages(prev => [...prev, newMessage]);
        setMessageInput('');
        fetchConversations();
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      alert('Failed to send message. Please try again.');
    } finally {
      setSendingMessage(false);
    }
  };

  const markAsRead = async (chatId) => {
    try {
      await api.patch(`/chats/${chatId}/read`);
      fetchConversations();
    } catch (error) {
      console.error('Failed to mark as read:', error);
    }
  };

  const getRandomColor = () => {
    const colors = [
      'bg-[#FFEA00]',
      'bg-[#BBFF00]',
      'bg-[#FF66CC]',
      'bg-[#FF7700]',
      'bg-[#00D4FF]',
      'bg-[#FF5555]',
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !sendingMessage) {
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

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-gray-500">Loading conversations...</div>
          </div>
        ) : !selectedChat ? (
          <div className="space-y-3">
            {conversations.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <p>No conversations yet</p>
                <p className="text-sm mt-2">Start chatting by messaging someone!</p>
              </div>
            ) : (
              conversations.map((conv) => (
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
                    <h3 className="font-semibold" style={{ color: COLORS.text.primary }}>
                      {conv.userName}
                    </h3>
                    <p className="text-sm truncate" style={{ color: COLORS.text.secondary }}>
                      {conv.lastMessage}
                    </p>
                    {conv.item && (
                      <p className="text-xs mt-1" style={{ color: COLORS.text.secondary }}>
                        About: {conv.item.title}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    {conv.lastMessageAt && (
                      <span className="text-xs" style={{ color: COLORS.text.secondary }}>
                        {formatTime(new Date(conv.lastMessageAt))}
                      </span>
                    )}
                    {conv.unread && (
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full" 
                        style={{ 
                          backgroundColor: COLORS.primary.pink,
                          color: COLORS.neutral.white 
                        }}>
                        {conv.unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
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
              
              <div>
                <h3 className="font-semibold" style={{ color: COLORS.text.primary }}>
                  {selectedChat.userName}
                </h3>
                {selectedChat.item && (
                  <p className="text-xs" style={{ color: COLORS.text.secondary }}>
                    About: {selectedChat.item.title}
                  </p>
                )}
              </div>
            </div>

            <div className="p-6 overflow-y-auto" style={{ height: 'calc(100% - 140px)' }}>
              <div className="space-y-4">
                {messages.map((msg) => (
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
                  disabled={sendingMessage}
                  className="flex-grow px-4 py-3 border rounded-lg focus:outline-none focus:ring-2"
                  style={{
                    borderColor: COLORS.neutral.gray
                  }}
                />
                <button 
                  onClick={handleSendMessage}
                  disabled={sendingMessage}
                  className="p-3 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
                  style={{ 
                    backgroundColor: COLORS.primary.blue,
                    color: COLORS.neutral.white 
                  }}
                >
                  {sendingMessage ? (
                    <svg className="w-6 h-6 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : (
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                    </svg>
                  )}
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