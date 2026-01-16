import React, { useState, useEffect, useRef } from 'react';
import { Play, Sparkles, Send, Bot, User, ExternalLink, X, MessageSquare, Maximize2, Minimize2 } from 'lucide-react';
import { sendMessageToGemini } from '../../services/geminiService';
import { Message, ChatState, Page } from '../../lockwood-types';
import { Tooltip } from '../Tooltip';

interface HeroProps {
  onNavigate?: (page: Page) => void;
}

export const Hero: React.FC<HeroProps> = ({ onNavigate }) => {
  // Chat State
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: 'Welcome to Lockwood & Carter. I can help you find exclusive off-plan properties in Dubai. Ask me to compare projects near Dubai South!', timestamp: Date.now() }
  ]);
  const [input, setInput] = useState('');
  const [chatState, setChatState] = useState<ChatState>(ChatState.IDLE);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isChatOpen) {
      scrollToBottom();
    }
  }, [messages, isChatOpen]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: Message = { role: 'user', text: input, timestamp: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setChatState(ChatState.LOADING);

    const response = await sendMessageToGemini(messages, input);

    const botMsg: Message = {
      role: 'model',
      text: response.text,
      timestamp: Date.now(),
      groundingMetadata: response.groundingMetadata
    };
    setMessages(prev => [...prev, botMsg]);
    setChatState(ChatState.SUCCESS);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSend();
  };

  return (
    
    <section className="relative min-h-screen bg-gradient-to-b from-[#1e3a8a] via-[#0a192f] to-[#020617] pt-32 pb-20 overflow-hidden flex flex-col items-center justify-center">
      {/* Background Glows */}
      <div className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] bg-blue-600/30 rounded-full blur-[120px]" />
      <div className="absolute bottom-0 right-[-5%] w-[600px] h-[600px] bg-lc-gold/20 rounded-full blur-[100px]" />
      <div className="absolute top-[30%] right-[20%] w-[500px] h-[500px] bg-indigo-500/20 rounded-full blur-[100px]" />

      <div className="container mx-auto px-4 text-center z-10 flex flex-col items-center justify-center h-full">

        {/* Headline - Matched to Screenshot Layout */}
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-8 leading-[1.1] tracking-tight drop-shadow-2xl">
          Dubai Real Estate<br />
          <span className="text-white block mt-2 mb-2">Exploration</span>
          <span className="gold-text-3d">Simplified by AI</span>
        </h1>
  
        {/* Subheadline - Adjusted opacity for contrast */}
        <p className="text-blue-100/90 text-lg md:text-2xl max-w-3xl mx-auto mb-12 leading-relaxed font-light tracking-wide">
          Experience the future of property search with the world's first Voice-Activated Real Estate Advisor.
        </p>

      {/* AI Badge - Exact Screenshot Match */}
        <div className="mt-8 inline-flex items-center gap-3 bg-[#0a1535]/60 border border-white/10 backdrop-blur-md text-blue-50 text-xs md:text-sm font-medium pl-5 pr-1.5 py-1.5 rounded-full mb-8 shadow-2xl shadow-blue-900/20 group cursor-default">
          <div className="bg-transparent p-0">
            <Sparkles size={14} className="text-lc-gold animate-pulse" fill="currentColor" />
          </div>
          <span className="tracking-wide">Unlock interactive Voice AI Advisor DARIE</span>
          <Tooltip content="Sign up for exclusive features" position="bottom">
            <button
              onClick={() => onNavigate?.('REGISTER')}
              className="bg-[#facc15] hover:bg-[#eab308] text-white px-4 py-1.5 rounded-full bg-gradient-to-r from-lc-gold to-orange-500 hover:from-lc-goldHover hover:to-orange-600 transition-all shadow-lg flex items-center gap-1 group-hover:scale-105 ml-2">
              Register Now
            </button>
          </Tooltip>
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 w-full max-w-md sm:max-w-none">
          {/* Watch Demo Centered as per screenshot preference often */}
          <Tooltip content="A glimpse of Dubai" position="bottom">
            <button
              onClick={() => window.open('https://youtu.be/NAW8S7wxOWA', '_blank')}
              className="w-full sm:w-auto bg-transparent border border-white/30 text-white px-8 py-3 rounded-md font-medium transition-all flex items-center justify-center gap-2 hover:bg-white/5 hover:border-white/60"
            >
              <Play size={16} fill="currentColor" />
              Why Invest in Dubai?
            </button>
          </Tooltip>
        </div>
      </div>

      {/* Floating Chat Widget */}
      <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end gap-4">

        {/* Chat Window */}
        {isChatOpen && (
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 w-[90vw] sm:w-[400px] h-[600px] max-h-[80vh] flex flex-col overflow-hidden animate-in slide-in-from-bottom-10 fade-in duration-300">
            {/* Header */}
            <div className="bg-lc-navy text-white p-4 flex items-center justify-between shadow-md">
              <div className="flex items-center gap-3">
                <div className="bg-lc-gold p-1.5 rounded-lg relative">
                  <Bot size={18} className="text-white" />
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-lc-gold"></span>
                </div>
                <div>
                  <h3 className="font-bold text-sm">L&C Real Estate Advisor</h3>
                  <p className="text-[10px] text-blue-200 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" /> Online
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsChatOpen(false)}
                className="text-white/70 hover:text-white hover:bg-white/10 p-1 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 bg-gray-50 space-y-4">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                  <div className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} w-full gap-2`}>
                    {msg.role === 'model' && (
                      <div className="w-6 h-6 rounded-full bg-lc-gold/10 flex items-center justify-center flex-shrink-0 mt-1">
                        <Bot size={12} className="text-lc-gold" />
                      </div>
                    )}

                    <div className={`max-w-[85%] p-3 rounded-xl text-sm leading-relaxed shadow-sm chat-message
                      ${msg.role === 'user'
                        ? 'bg-lc-gold text-white rounded-tr-none'
                        : 'bg-white text-gray-700 border border-gray-100 rounded-tl-none'}`}
                    >
                      <div dangerouslySetInnerHTML={{ __html: msg.text }} />
                    </div>
                  </div>

                  {/* Sources Display */}
                  {msg.role === 'model' && msg.groundingMetadata?.groundingChunks && (
                    <div className="ml-8 mt-2 max-w-[85%] bg-blue-50/50 p-2 rounded-lg border border-blue-100">
                      <p className="text-[10px] text-gray-500 font-semibold mb-1 uppercase tracking-wider">Sources</p>
                      <div className="flex flex-wrap gap-2">
                        {msg.groundingMetadata.groundingChunks.map((chunk: any, i: number) => {
                          if (chunk.web?.uri) {
                            return (
                              <a
                                key={i}
                                href={chunk.web.uri}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1 text-[10px] bg-white text-blue-600 px-2 py-1 rounded border border-gray-200 hover:border-blue-300 transition-colors"
                              >
                                {chunk.web.title || "PropSearch Data"} <ExternalLink size={8} />
                              </a>
                            );
                          }
                          return null;
                        })}
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {chatState === ChatState.LOADING && (
                <div className="flex justify-start gap-2">
                  <div className="w-6 h-6 rounded-full bg-lc-gold/10 flex items-center justify-center mt-1">
                    <Bot size={12} className="text-lc-gold" />
                  </div>
                  <div className="bg-white p-3 rounded-xl rounded-tl-none border border-gray-100 flex gap-1 items-center">
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" />
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-75" />
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-150" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-3 bg-white border-t border-gray-100">
              {messages.length === 1 && (
                <div className="flex gap-2 overflow-x-auto pb-2 mb-2 scrollbar-hide">
                  <button onClick={() => { setInput("Compare Emaar South vs Altair 52"); }} className="whitespace-nowrap bg-gray-50 border border-gray-200 text-[10px] text-gray-600 px-3 py-1 rounded-full hover:border-lc-gold hover:text-lc-gold transition-colors">
                    📊 Compare Projects
                  </button>
                  <button onClick={() => { setInput("3BR prices in Dubai South"); }} className="whitespace-nowrap bg-gray-50 border border-gray-200 text-[10px] text-gray-600 px-3 py-1 rounded-full hover:border-lc-gold hover:text-lc-gold transition-colors">
                    💰 3BR Prices
                  </button>
                </div>
              )}
              <div className="relative">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="Ask about Dubai properties..."
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg py-3 pl-4 pr-10 text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-lc-gold focus:border-lc-gold"
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim()}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-lc-gold hover:text-lc-goldHover disabled:opacity-50 disabled:cursor-not-allowed p-1.5 rounded-md transition-colors"
                >
                  <Send size={16} />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Toggle Button */}
        <Tooltip content={isChatOpen ? "Close chat" : "Chat with AI Advisor"} position="left">
          <button
            onClick={() => setIsChatOpen(!isChatOpen)}
            className={`group flex items-center justify-center w-14 h-14 rounded-full shadow-xl transition-all duration-300 hover:scale-110 relative
              ${isChatOpen ? 'bg-white text-lc-navy hover:bg-gray-100' : 'bg-lc-gold text-white hover:bg-lc-goldHover'}`}
          >
            {isChatOpen ? <X size={24} /> : <MessageSquare size={24} fill="currentColor" />}

            {/* Online Indicator on Floating Button */}
            {!isChatOpen && (
              <span className="absolute top-0 right-0 flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-4 w-4 bg-green-500 border-2 border-lc-navy"></span>
              </span>
            )}
          </button>
        </Tooltip>
      </div>

    </section>
  );
};
