import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Sparkles, Loader2, Volume2, StopCircle } from 'lucide-react';
import { createPersonalShopperChat, generateSpeech } from '../services/geminiService';
import { Product, ChatMessage } from '../types';
import { Chat } from '@google/genai';
import { VoiceInput } from './VoiceInput';

interface AIChatProps {
  products: Product[];
}

export const AIChat: React.FC<AIChatProps> = ({ products }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: 'init', role: 'model', text: "Hi! I'm Lumi. Looking for something specific or need a gift idea? Ask me anything!" }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatSessionRef = useRef<Chat | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Audio state
  const [isPlaying, setIsPlaying] = useState<string | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceNodeRef = useRef<AudioBufferSourceNode | null>(null);

  useEffect(() => {
    if (isOpen && !chatSessionRef.current) {
      chatSessionRef.current = createPersonalShopperChat(products);
    }
  }, [isOpen, products]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (textOverride?: string | React.MouseEvent | React.KeyboardEvent) => {
    const textToSend = typeof textOverride === 'string' ? textOverride : input;

    if (!textToSend.trim() || !chatSessionRef.current) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: textToSend
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const response = await chatSessionRef.current.sendMessage({ message: userMsg.text });
      const text = response.text || "I'm having trouble thinking right now. Try again?";
      
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text
      }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: "Sorry, I encountered a connection error. Please check your API key setup.",
        isError: true
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handlePlayAudio = async (text: string, id: string) => {
    if (isPlaying === id) {
      // Stop
      sourceNodeRef.current?.stop();
      setIsPlaying(null);
      return;
    }

    // Stop current if any
    if (isPlaying) sourceNodeRef.current?.stop();

    setIsPlaying(id);
    
    // Initialize AudioContext if needed
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
    }

    const audioBuffer = await generateSpeech(text);
    if (audioBuffer && audioContextRef.current) {
      const source = audioContextRef.current.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(audioContextRef.current.destination);
      source.onended = () => setIsPlaying(null);
      source.start();
      sourceNodeRef.current = source;
    } else {
      setIsPlaying(null);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSend();
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end pointer-events-none">
      {/* Chat Window */}
      {isOpen && (
        <div className="bg-white pointer-events-auto rounded-2xl shadow-2xl border border-gray-100 w-[360px] h-[500px] flex flex-col mb-4 overflow-hidden transform transition-all duration-300 origin-bottom-right">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary to-slate-800 p-4 flex justify-between items-center text-white">
            <div className="flex items-center gap-2">
              <Sparkles size={18} className="text-yellow-300" />
              <div>
                <h3 className="font-semibold text-sm">Lumi Assistant</h3>
                <p className="text-xs text-slate-300">Personal Shopper AI</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:bg-white/10 p-1 rounded-full transition">
              <X size={18} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 bg-slate-50 space-y-3">
            {messages.map((msg) => (
              <div 
                key={msg.id} 
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed relative group ${
                    msg.role === 'user' 
                      ? 'bg-primary text-white rounded-br-none' 
                      : msg.isError 
                        ? 'bg-red-50 text-red-600 border border-red-100'
                        : 'bg-white text-slate-700 shadow-sm border border-gray-100 rounded-bl-none'
                  }`}
                >
                  {msg.text}
                  {msg.role === 'model' && !msg.isError && (
                    <button 
                      onClick={() => handlePlayAudio(msg.text, msg.id)}
                      className={`absolute -right-8 bottom-0 p-1.5 rounded-full hover:bg-slate-200 transition-colors ${isPlaying === msg.id ? 'text-accent' : 'text-slate-400 opacity-0 group-hover:opacity-100'}`}
                      title="Read Aloud"
                    >
                      {isPlaying === msg.id ? <StopCircle size={14} /> : <Volume2 size={14} />}
                    </button>
                  )}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white p-3 rounded-2xl rounded-bl-none shadow-sm border border-gray-100 flex gap-1">
                  <span className="w-2 h-2 bg-slate-300 rounded-full animate-bounce"></span>
                  <span className="w-2 h-2 bg-slate-300 rounded-full animate-bounce delay-100"></span>
                  <span className="w-2 h-2 bg-slate-300 rounded-full animate-bounce delay-200"></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-3 bg-white border-t border-gray-100">
            <div className="relative flex items-center">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Ask about products..."
                className="w-full pl-4 pr-24 py-3 bg-slate-50 border border-transparent focus:bg-white focus:border-primary/20 focus:ring-4 focus:ring-primary/5 rounded-xl text-sm outline-none transition-all"
              />
              <div className="absolute right-2 flex items-center gap-1">
                <VoiceInput onTranscript={handleSend} />
                <button 
                  onClick={handleSend}
                  disabled={!input.trim() || isTyping}
                  className="p-2 bg-primary text-white rounded-lg hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Send size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toggle Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="pointer-events-auto bg-primary hover:bg-slate-800 text-white rounded-full p-4 shadow-lg shadow-primary/30 transition-all hover:scale-105 active:scale-95 flex items-center gap-2 group"
      >
        {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
        {!isOpen && <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 ease-out whitespace-nowrap text-sm font-medium">Ask AI</span>}
      </button>
    </div>
  );
};