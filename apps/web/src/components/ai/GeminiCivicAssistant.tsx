'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, X, Send, Bot, User } from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

interface GeminiCivicAssistantProps {
  bottomOffset?: string;
}

export function GeminiCivicAssistant({ bottomOffset = 'bottom-20' }: GeminiCivicAssistantProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: 'Namaskara! I am your **Gemini Civic AI** for Namma City. How can I assist you with grievances, utility bills, or transit today?',
      timestamp: 'Just now',
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSend = async (messageText?: string) => {
    const textToSend = messageText || input;
    if (!textToSend.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!messageText) setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          history: messages.map((m) => ({
            role: m.sender === 'user' ? 'user' : 'model',
            content: m.text,
          })),
        }),
      });

      const data = await res.json();
      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'assistant',
        text: data.reply || 'Sorry, I could not process your request at this moment.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch {
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'assistant',
        text: 'Network error connecting to Gemini AI assistant. Please try again.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const samplePrompts = [
    'How do I report a pothole on my street?',
    'How to pay BESCOM electricity bill?',
    'Nearest BBMP Ward office details',
  ];

  return (
    <>
      {/* COMPACT GEMINI SYMBOL TRIGGER (ONLY THE GEMINI ICON) */}
      {!isOpen && (
        <div className={`absolute ${bottomOffset} right-3.5 z-40`}>
          <button
            onClick={() => setIsOpen(true)}
            aria-label="Open Gemini Civic Assistant"
            title="Gemini Civic AI"
            className="w-11 h-11 rounded-full bg-[#176B68] hover:bg-[#125452] text-white shadow-lg shadow-[#176B68]/35 border border-teal-300/40 flex items-center justify-center transition-all transform hover:scale-105 active:scale-95 group focus:outline-none focus:ring-2 focus:ring-[#176B68]/40"
          >
            {/* Authentic Google Gemini 4-Point Sparkle Symbol */}
            <div className="relative flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-amber-300 group-hover:scale-110 transition-transform animate-pulse-gentle" />
            </div>
          </button>
        </div>
      )}

      {/* CHAT MODAL (CONSTRAINED INSIDE THE PHONE SCREEN) */}
      {isOpen && (
        <div className="absolute inset-x-2 bottom-3 top-12 z-50 flex flex-col bg-white rounded-2xl shadow-2xl border border-civic-border overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          {/* Header */}
          <div className="p-3 bg-gradient-to-r from-[#176B68] to-[#125452] text-white flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-amber-300" />
              </div>
              <div>
                <div className="flex items-center gap-1">
                  <h3 className="text-xs font-bold tracking-tight">Gemini Civic AI</h3>
                  <span className="px-1 py-0.2 rounded-full bg-amber-400/25 text-amber-200 text-[8px] font-semibold">
                    3.8
                  </span>
                </div>
                <p className="text-[10px] text-teal-100">Bengaluru Municipal Guide</p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              aria-label="Close Gemini Assistant"
              className="p-1 rounded-lg hover:bg-white/15 text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Prompts */}
          <div className="px-2.5 py-1.5 bg-slate-50 border-b border-civic-border/70 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {samplePrompts.map((prompt, i) => (
              <button
                key={i}
                onClick={() => handleSend(prompt)}
                className="whitespace-nowrap px-2 py-0.5 rounded-full bg-white border border-civic-border hover:border-civic-primary text-[10px] font-medium text-civic-text-muted hover:text-civic-primary transition-colors shrink-0 shadow-2xs"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2.5 bg-[#F8FAF9] text-xs">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex gap-2 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {m.sender === 'assistant' && (
                  <div className="w-6 h-6 rounded-lg bg-teal-100 text-[#176B68] flex items-center justify-center shrink-0 mt-0.5">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-2xl px-3 py-2 text-[11px] leading-relaxed ${
                    m.sender === 'user'
                      ? 'bg-[#176B68] text-white rounded-br-xs shadow-xs'
                      : 'bg-white text-civic-text border border-civic-border rounded-bl-xs shadow-xs'
                  }`}
                >
                  <p className="whitespace-pre-line">{m.text}</p>
                  <span
                    className={`block text-[8px] mt-1 text-right ${
                      m.sender === 'user' ? 'text-teal-200' : 'text-civic-text-muted'
                    }`}
                  >
                    {m.timestamp}
                  </span>
                </div>

                {m.sender === 'user' && (
                  <div className="w-6 h-6 rounded-lg bg-[#176B68]/10 text-[#176B68] flex items-center justify-center shrink-0 mt-0.5">
                    <User className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex items-center gap-1.5 text-xs text-civic-text-muted">
                <div className="w-6 h-6 rounded-lg bg-teal-100 text-[#176B68] flex items-center justify-center">
                  <Sparkles className="w-3.5 h-3.5 animate-spin" />
                </div>
                <div className="px-2.5 py-1.5 bg-white rounded-xl border border-civic-border flex items-center gap-1 shadow-xs">
                  <span className="w-1 h-1 bg-teal-600 rounded-full animate-bounce" />
                  <span className="w-1 h-1 bg-teal-600 rounded-full animate-bounce [animation-delay:0.2s]" />
                  <span className="w-1 h-1 bg-teal-600 rounded-full animate-bounce [animation-delay:0.4s]" />
                  <span className="text-[10px] text-civic-text-muted ml-1">Gemini 3.8 thinking...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Bar */}
          <div className="p-2.5 bg-white border-t border-civic-border flex items-center gap-1.5">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSend();
              }}
              placeholder="Ask anything about civic services..."
              className="flex-1 px-3 py-2 rounded-xl border border-civic-border text-xs focus:outline-none focus:ring-2 focus:ring-[#176B68]/20 focus:border-[#176B68]"
            />
            <button
              onClick={() => handleSend()}
              disabled={!input.trim() || loading}
              aria-label="Send message"
              className="p-2 rounded-xl bg-[#176B68] hover:bg-[#125452] text-white disabled:opacity-40 transition-colors shadow-xs"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
