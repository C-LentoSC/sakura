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

  const quickReplies = [
    { 
      id: 1, 
      textKey: 'chatbot.quickReplies.booking', 
      responseKey: 'chatbot.responses.booking',
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
          id: Date.now(),
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
      id: Date.now(),
      text: t(reply.textKey),
      sender: 'user',
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMessage]);
    setShowQuickReplies(false);

    // Add bot response after delay
    setTimeout(() => {
      const botMessage: Message = {
        id: Date.now() + 1,
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
        className="fixed bottom-6 right-6 z-50 w-16 h-16 sm:w-14 sm:h-14 bg-gradient-to-br from-pink-400 to-pink-500 rounded-full shadow-lg hover:shadow-2xl flex items-center justify-center transition-all duration-500 hover:scale-110 group"
        aria-label="Open chat"
      >
        {/* Sakura petal decoration */}
        <div className="absolute -top-1 -right-1 w-4 h-4 text-white/40 opacity-70 group-hover:opacity-100 transition-opacity">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C8 2 5 5 5 9c0 4 3 7 7 7s7-3 7-7c0-4-3-7-7-7zm0 12c-3 0-5-2-5-5s2-5 5-5 5 2 5 5-2 5-5 5z"/>
          </svg>
        </div>
        
        {isOpen ? (
          <svg className="w-6 h-6 sm:w-7 sm:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <div className="relative">
            <svg className="w-6 h-6 sm:w-7 sm:h-7 text-white group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            {/* Notification badge */}
            <span className="absolute -top-2 -right-2 w-5 h-5 bg-white rounded-full flex items-center justify-center text-primary text-xs font-bold animate-pulse shadow-md">
              1
            </span>
          </div>
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-[calc(100vw-3rem)] sm:w-120 h-[780px] bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-primary/10">
          {/* Decorative top border */}
          <div className="h-1 bg-gradient-to-r from-primary via-pink-300 to-rose-300"></div>
          
          {/* Header */}
          <div className="bg-gradient-to-br from-rose-50/80 to-pink-50/60 px-6 py-4 flex items-center gap-4 border-b border-primary/5">
            <div className="relative w-12 h-12 rounded-full bg-gradient-to-br from-primary/10 to-pink-100 flex items-center justify-center">
              {/* Sakura icon */}
              <svg className="w-6 h-6 text-primary" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2l2.4 7.2h7.6l-6 4.8 2.4 7.2-6-4.8-6 4.8 2.4-7.2-6-4.8h7.6z"/>
              </svg>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
            </div>
            <div className="flex-1">
              <h3 className="text-secondary font-sakura text-lg font-semibold">Sakura Assistant</h3>
              <p className="text-secondary/60 text-sm">{t('chatbot.online')}</p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="w-8 h-8 rounded-full hover:bg-primary/10 flex items-center justify-center transition-colors group"
            >
              <svg className="w-5 h-5 text-secondary/60 group-hover:text-primary transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-gradient-to-b from-rose-50/30 via-pink-50/20 to-transparent">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex items-end gap-2 max-w-[85%] ${message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  {/* Avatar */}
                  {message.sender === 'bot' && (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/10 to-pink-100 flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-primary" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2l2.4 7.2h7.6l-6 4.8 2.4 7.2-6-4.8-6 4.8 2.4-7.2-6-4.8h7.6z"/>
                      </svg>
                    </div>
                  )}
                  
                  <div
                    className={`px-4 py-3 text-sm leading-relaxed ${
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
            <div className="px-5 py-4 border-t border-primary/5 bg-gradient-to-r from-rose-50/50 to-pink-50/30">
              <p className="text-xs text-secondary/60 mb-3 font-medium">{t('chatbot.quickRepliesTitle')}</p>
              <div className="flex flex-wrap gap-2">
                {quickReplies.map((reply) => (
                  <button
                    key={reply.id}
                    onClick={() => handleQuickReply(reply)}
                    className="px-3 py-2 text-xs bg-white/80 backdrop-blur-sm hover:bg-gradient-to-r hover:from-primary hover:to-pink-400 text-secondary hover:text-white rounded-full transition-all duration-300 border border-primary/15 hover:border-transparent hover:scale-105 shadow-sm hover:shadow-md font-medium inline-flex items-center gap-2"
                  >
                    <span className="group-hover:text-white">{reply.icon}</span>
                    {t(reply.textKey)}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input Area */}
          <div className="p-5 border-t border-primary/5 bg-gradient-to-r from-rose-50/30 to-pink-50/20">
            <div className="flex gap-3">
              <input
                type="text"
                placeholder={t('chatbot.inputPlaceholder')}
                className="flex-1 px-4 py-3 rounded-2xl border border-primary/20 focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none text-sm transition-all bg-white/90 backdrop-blur-sm placeholder:text-secondary/50"
              />
              <button className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-pink-400 flex items-center justify-center hover:scale-110 transition-all duration-300 shadow-md hover:shadow-lg">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
