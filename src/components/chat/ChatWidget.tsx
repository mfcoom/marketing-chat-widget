'use client';

import { useState, useEffect, useRef } from 'react';

export interface ChatWidgetConfig {
  name: string;
  subtitle?: string;
  avatarSrc?: string;
  initialGreeting: string;
}

export interface ChatHistoryMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatWidgetProps {
  config: ChatWidgetConfig;
  onMessage: (message: string, history: ChatHistoryMessage[]) => Promise<string>;
}

export default function ChatWidget({ config, onMessage }: ChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatHistoryMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasOpenedOnce, setHasOpenedOnce] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Add initial greeting on first open
  useEffect(() => {
    if (isOpen && !hasOpenedOnce && messages.length === 0) {
      setMessages([{ role: 'assistant', content: config.initialGreeting }]);
      setHasOpenedOnce(true);
    }
  }, [isOpen, hasOpenedOnce, messages.length, config.initialGreeting]);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedInput = inputValue.trim();
    if (!trimmedInput || isLoading) return;

    // Add user message
    const userMessage: ChatHistoryMessage = { role: 'user', content: trimmedInput };
    const updatedHistory = [...messages, userMessage];
    setMessages(updatedHistory);
    setInputValue('');
    setIsLoading(true);

    try {
      // Call onMessage with user input and history
      const reply = await onMessage(trimmedInput, updatedHistory);

      // Add assistant reply
      setMessages([...updatedHistory, { role: 'assistant', content: reply }]);
    } catch (error) {
      console.error('Error in chat widget:', error);

      // Add error message
      setMessages([
        ...updatedHistory,
        {
          role: 'assistant',
          content: 'Sorry, something went wrong on my side. Please try again in a moment.',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Get initials from name
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((word) => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <>
      {/* Chat Panel */}
      {isOpen && (
        <div className="fixed bottom-20 right-4 left-4 sm:left-auto sm:w-96 max-w-sm rounded-lg shadow-2xl bg-slate-900 text-slate-50 flex flex-col h-[500px] z-50">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-700">
            <div className="flex-1">
              <h3 className="font-semibold text-lg">{config.name}</h3>
              {config.subtitle && (
                <p className="text-xs text-slate-400">{config.subtitle}</p>
              )}
            </div>
            <button
              onClick={handleToggle}
              className="text-slate-400 hover:text-slate-200 transition-colors"
              aria-label="Close chat"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-lg px-4 py-2 ${
                    message.role === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-800 text-slate-100'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {isLoading && (
              <div className="flex justify-start">
                <div className="max-w-[80%] rounded-lg px-4 py-2 bg-slate-800 text-slate-100">
                  <p className="text-sm text-slate-400">
                    {config.name} is thinking...
                  </p>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t border-slate-700 px-4 py-3">
            <form onSubmit={handleSubmit} className="flex gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Type a message..."
                disabled={isLoading}
                className="flex-1 bg-slate-800 text-slate-100 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 disabled:opacity-50 disabled:cursor-not-allowed placeholder-slate-500"
              />
              <button
                type="submit"
                disabled={isLoading || !inputValue.trim()}
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-2 text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Send
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Floating Button */}
      <button
        onClick={handleToggle}
        className="fixed bottom-4 right-4 w-14 h-14 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg transition-all hover:scale-110 flex items-center justify-center z-50"
        aria-label={isOpen ? 'Close chat' : 'Open chat'}
      >
        {config.avatarSrc ? (
          <img
            src={config.avatarSrc}
            alt={config.name}
            className="w-full h-full rounded-full object-cover"
          />
        ) : (
          <span className="text-lg font-bold">{getInitials(config.name)}</span>
        )}
      </button>
    </>
  );
}
