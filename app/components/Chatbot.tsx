'use client';

import { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export default function Chatbot() {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [showQuickReplies, setShowQuickReplies] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messageIdCounter = useRef(0);

  const quickReplies = [
    { 
      id: 1, 
      textKey: 'chatbot.quickReplies.bookings', 
      responseKey: 'chatbot.responses.bookings',
      icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
    },
    { 
      id: 2, 
      textKey: 'chatbot.quickReplies.services', 
      responseKey: 'chatbot.responses.services',
      icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
    },
    { 
      id: 3, 
      textKey: 'chatbot.quickReplies.pricing', 
      responseKey: 'chatbot.responses.pricing',
      icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
    },
    { 
      id: 4, 
      textKey: 'chatbot.quickReplies.hours', 
      responseKey: 'chatbot.responses.hours',
      icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
    },
    { 
      id: 5, 
      textKey: 'chatbot.quickReplies.location', 
      responseKey: 'chatbot.responses.location',
      icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
    },
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Welcome message
      setTimeout(() => {
        setMessages([{
          id: messageIdCounter.current++,
          text: t('chatbot.welcome'),
          sender: 'bot',
          timestamp: new Date(),
        }]);
      }, 500);
    }
  }, [isOpen, messages.length, t]);

  const handleQuickReply = (reply: typeof quickReplies[0]) => {
    // Add user message
    const userMessage: Message = {
      id: messageIdCounter.current++,
      text: t(reply.textKey),
      sender: 'user',
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMessage]);
    setShowQuickReplies(false);

    // Add bot response after delay
    setTimeout(() => {
      const botMessage: Message = {
        id: messageIdCounter.current++,
        text: t(reply.responseKey),
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, botMessage]);
      
      // Show quick replies again after response
      setTimeout(() => {
        setShowQuickReplies(true);
      }, 500);
    }, 1000);
  };

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-pink-400 to-pink-500 rounded-full shadow-lg hover:shadow-2xl flex items-center justify-center transition-all duration-500 hover:scale-110 group"
        aria-label="Open chat"
      >
        {/* Sakura petal decoration */}
        <div className="absolute -top-1 -right-1 w-4 h-4 text-white/40 opacity-70 group-hover:opacity-100 transition-opacity">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C8 2 5 5 5 9c0 4 3 7 7 7s7-3 7-7c0-4-3-7-7-7zm0 12c-3 0-5-2-5-5s2-5 5-5 5 2 5 5-2 5-5 5z"/>
          </svg>
        </div>
        
        {isOpen ? (
          <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <div className="relative">
            <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            {/* Notification badge */}
            <span className="absolute -top-1.5 -right-1.5 w-4 h-4 sm:w-5 sm:h-5 bg-white rounded-full flex items-center justify-center text-primary text-xs font-bold animate-pulse shadow-md">
              1
            </span>
          </div>
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed inset-x-2 bottom-20 sm:bottom-24 sm:right-6 sm:left-auto z-50 w-auto sm:w-96 md:w-[420px] h-[calc(100vh-6rem)] sm:h-[500px] md:h-[600px] lg:h-[650px] bg-white/95 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-primary/10">
          {/* Decorative top border */}
          <div className="h-1 bg-gradient-to-r from-primary via-pink-300 to-rose-300"></div>
          
          {/* Header */}
          <div className="bg-gradient-to-br from-rose-50/80 to-pink-50/60 px-4 sm:px-6 py-3 sm:py-4 flex items-center gap-3 sm:gap-4 border-b border-primary/5">
            <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-primary/10 to-pink-100 flex items-center justify-center">
              {/* Sakura icon */}
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-primary" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2l2.4 7.2h7.6l-6 4.8 2.4 7.2-6-4.8-6 4.8 2.4-7.2-6-4.8h7.6z"/>
              </svg>
              <div className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-green-400 rounded-full border-2 border-white"></div>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-secondary font-sakura text-base sm:text-lg font-semibold truncate">Sakura Assistant</h3>
              <p className="text-secondary/60 text-xs sm:text-sm">{t('chatbot.online')}</p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-full hover:bg-primary/10 flex items-center justify-center transition-colors group flex-shrink-0"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-secondary/60 group-hover:text-primary transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 sm:p-4 md:p-5 space-y-3 sm:space-y-4 bg-gradient-to-b from-rose-50/30 via-pink-50/20 to-transparent">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex items-end gap-2 max-w-[90%] sm:max-w-[85%] ${message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  {/* Avatar */}
                  {message.sender === 'bot' && (
                    <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-primary/10 to-pink-100 flex items-center justify-center flex-shrink-0">
                      <svg className="w-3 h-3 sm:w-4 sm:h-4 text-primary" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2l2.4 7.2h7.6l-6 4.8 2.4 7.2-6-4.8-6 4.8 2.4-7.2-6-4.8h7.6z"/>
                      </svg>
                    </div>
                  )}
                  
                  <div
                    className={`px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm leading-relaxed ${
                      message.sender === 'user'
                        ? 'bg-gradient-to-br from-primary to-pink-400 text-white rounded-2xl rounded-br-md shadow-md'
                        : 'bg-white/90 backdrop-blur-sm border border-primary/10 text-secondary rounded-2xl rounded-bl-md shadow-sm'
                    }`}
                  >
                    {message.text}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Replies */}
          {showQuickReplies && (
            <div className="px-3 sm:px-4 md:px-5 py-3 sm:py-4 border-t border-primary/5 bg-gradient-to-r from-rose-50/50 to-pink-50/30">
              <p className="text-xs text-secondary/60 mb-2 sm:mb-3 font-medium">{t('chatbot.quickRepliesTitle')}</p>
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {quickReplies.map((reply) => (
                  <button
                    key={reply.id}
                    onClick={() => handleQuickReply(reply)}
                    className="px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs bg-white/80 backdrop-blur-sm hover:bg-gradient-to-r hover:from-primary hover:to-pink-400 text-secondary hover:text-white rounded-full transition-all duration-300 border border-primary/15 hover:border-transparent hover:scale-105 shadow-sm hover:shadow-md font-medium inline-flex items-center gap-1.5 sm:gap-2"
                  >
                    <span className="group-hover:text-white flex-shrink-0">{reply.icon}</span>
                    <span className="truncate">{t(reply.textKey)}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

        </div>
      )}
    </>
  );
}
