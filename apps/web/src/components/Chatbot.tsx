'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageCircle, 
  Send, 
  X, 
  Bot, 
  User as UserIcon,
  Minimize2,
  Maximize2,
  Languages,
  Volume2,
  VolumeX,
  Copy,
  ThumbsUp,
  ThumbsDown,
  RotateCcw,
  Sparkles
} from 'lucide-react';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  language?: string;
  citations?: string[];
}

interface ChatbotProps {
  documentContext?: {
    title: string;
    content: string;
    type: string;
  };
  onClose?: () => void;
}

export default function Chatbot({ documentContext, onClose }: ChatbotProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [language, setLanguage] = useState('en');
  const [isMuted, setIsMuted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'zh', name: '中文', flag: '🇨🇳' },
    { code: 'ja', name: '日本語', flag: '🇯🇵' },
    { code: 'hi', name: 'हिंदी', flag: '🇮🇳' },
    { code: 'ar', name: 'العربية', flag: '🇸🇦' }
  ];

  const suggestedQuestions = documentContext ? [
    "📋 What are the key terms and conditions?",
    "⚠️ Are there any risks I should be aware of?", 
    "📝 What are my obligations in this document?",
    "❌ What happens if I want to terminate this agreement?",
    "💰 Are there any hidden fees or penalties?",
    "📖 Can you summarize this document in simple terms?",
    "🔍 What are the most important clauses?",
    "📅 What are the important dates and deadlines?",
    "🤝 Who are the parties involved?",
    "⚖️ What are my legal rights in this document?",
    "🚩 What should I be careful about?",
    "💡 Do you recommend any changes?"
  ] : [
    "🤖 How can LegalEase AI help me?",
    "📄 What types of documents can you analyze?",
    "🎯 How accurate is the AI analysis?",
    "🧠 Can you explain legal terms in simple language?",
    "🌍 What languages do you support?",
    "📤 How do I upload a document?",
    "🔒 Is my data secure and confidential?",
    "⚡ How fast is the analysis process?",
    "💼 What industries do you cover?",
    "📊 Can you compare different documents?",
    "🎓 Can you help me learn legal concepts?",
    "📱 Do you have mobile support?"
  ];

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && !isMinimized && messages.length === 0) {
      // Welcome message
      const welcomeMessage: Message = {
        id: 'welcome',
        content: documentContext 
          ? `Hi! I'm your AI legal assistant. I've analyzed "${documentContext.title}" and I'm ready to answer any questions you have about it.`
          : "Hello! I'm your AI legal assistant. I can help you understand legal documents, explain complex terms, and answer questions about contracts and agreements. How can I assist you today?",
        sender: 'bot',
        timestamp: new Date(),
        language
      };
      setMessages([welcomeMessage]);
    }
  }, [isOpen, isMinimized, documentContext, language]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage.trim(),
      sender: 'user',
      timestamp: new Date(),
      language
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const botResponse = generateBotResponse(userMessage.content);
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: botResponse.content,
        sender: 'bot',
        timestamp: new Date(),
        language,
        ...(botResponse.citations && { citations: botResponse.citations })
      };

      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);

      // Text-to-speech if not muted
      if (!isMuted && 'speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(botResponse.content);
        utterance.lang = getLanguageCode(language);
        speechSynthesis.speak(utterance);
      }
    }, 1000 + Math.random() * 2000);
  };

  const generateBotResponse = (userInput: string): { content: string; citations?: string[] } => {
    const input = userInput.toLowerCase();
    
    if (documentContext) {
      if (input.includes('summary') || input.includes('summarize')) {
        return {
          content: `Here's a summary of "${documentContext.title}":\n\nThis ${documentContext.type} contains several key provisions:\n• Payment terms and obligations\n• Liability and risk allocation\n• Termination conditions\n• Dispute resolution procedures\n\nThe document appears to be a standard agreement with some clauses that may benefit from review. Would you like me to explain any specific section in detail?`,
          citations: ['Section 3: Payment Terms', 'Section 7: Liability', 'Section 12: Termination']
        };
      }
      
      if (input.includes('risk') || input.includes('danger')) {
        return {
          content: `Based on my analysis, I've identified a few areas that warrant attention:\n\n🔴 **High Risk**: Unlimited liability clause in Section 7\n🟡 **Medium Risk**: Auto-renewal terms in Section 4\n🟡 **Review Recommended**: Broad indemnification language\n\nWould you like me to explain any of these risks in more detail?`,
          citations: ['Section 7: Liability Provisions', 'Section 4: Renewal Terms']
        };
      }

      if (input.includes('obligation') || input.includes('responsibility')) {
        return {
          content: `Your main obligations under this agreement include:\n\n1. **Payment**: Monthly fees of specified amount\n2. **Compliance**: Following all terms and conditions\n3. **Data Protection**: Maintaining confidentiality\n4. **Notice**: Providing required notifications\n\nMost of these are standard, but I recommend reviewing the payment and notice requirements carefully.`,
          citations: ['Section 2: Payment Obligations', 'Section 9: Compliance Requirements']
        };
      }

      if (input.includes('terminate') || input.includes('cancel')) {
        return {
          content: `Regarding termination:\n\n• You can terminate with 30 days written notice\n• The other party can terminate for breach with 15 days cure period\n• Automatic termination occurs if payment is 60+ days late\n• Upon termination, you must return all confidential materials\n\nNote: There may be termination fees - check Section 11 for details.`,
          citations: ['Section 11: Termination Provisions', 'Section 15: Post-Termination Obligations']
        };
      }

      if (input.includes('fee') || input.includes('cost') || input.includes('penalty')) {
        return {
          content: `I've found several fee-related provisions:\n\n💰 **Monthly Fee**: Base service charge\n⚠️ **Late Fees**: 1.5% per month on overdue amounts\n⚠️ **Termination Fee**: Early cancellation penalty may apply\n💡 **Additional Costs**: Third-party expenses may be charged\n\nRecommendation: Negotiate caps on additional fees and clarify what constitutes "reasonable" expenses.`,
          citations: ['Section 3: Fees and Charges', 'Section 8: Additional Costs']
        };
      }
    }

    // General responses
    const responses = [
      {
        content: `I'd be happy to help with that! ${documentContext ? `Based on "${documentContext.title}", ` : ''}I can provide detailed analysis and explanations. Could you be more specific about what aspect you'd like me to focus on?`
      },
      {
        content: `That's a great question! I use advanced AI to analyze legal documents and provide insights in plain English. I can identify risks, explain terms, and suggest areas for review. What specific information are you looking for?`
      },
      {
        content: `I can help you understand complex legal language by breaking it down into simple terms. Legal documents can be confusing, but I'm here to make them clearer for you. What would you like me to explain?`
      }
    ];

    return responses[Math.floor(Math.random() * responses.length)] || {
      content: `I'd be happy to help! Please let me know what specific information you're looking for about ${documentContext ? `"${documentContext.title}"` : 'your legal documents'}.`
    };
  };

  const getLanguageCode = (lang: string): string => {
    const langMap: { [key: string]: string } = {
      'en': 'en-US',
      'es': 'es-ES',
      'fr': 'fr-FR',
      'de': 'de-DE',
      'zh': 'zh-CN',
      'ja': 'ja-JP',
      'hi': 'hi-IN',
      'ar': 'ar-SA'
    };
    return langMap[lang] || 'en-US';
  };

  const handleSuggestedQuestion = (question: string) => {
    setInputMessage(question);
    setTimeout(() => {
      handleSendMessage();
    }, 100);
  };

  const copyMessage = (content: string) => {
    navigator.clipboard.writeText(content);
  };

  if (!isOpen) {
    return (
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full shadow-2xl hover:shadow-blue-500/25 flex items-center justify-center z-50 transition-all duration-300"
      >
        <MessageCircle className="w-6 h-6" />
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-pulse"></div>
      </motion.button>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={{ 
        opacity: 1, 
        scale: 1, 
        y: 0,
        height: isMinimized ? 60 : 600,
        width: isMinimized ? 300 : 400
      }}
      className="fixed bottom-6 right-6 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 z-50 overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Bot className="w-6 h-6" />
            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white animate-pulse"></div>
          </div>
          <div>
            <h3 className="font-semibold text-sm">AI Legal Assistant</h3>
            <p className="text-xs opacity-90">Always here to help</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="text-xs bg-white/20 rounded px-2 py-1 border-0 text-white"
          >
            {languages.map(lang => (
              <option key={lang.code} value={lang.code} className="text-gray-800">
                {lang.flag} {lang.name}
              </option>
            ))}
          </select>
          
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="p-1 hover:bg-white/20 rounded transition-colors"
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
          
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-1 hover:bg-white/20 rounded transition-colors"
          >
            {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
          </button>
          
          <button
            onClick={() => {
              setIsOpen(false);
              onClose?.();
            }}
            className="p-1 hover:bg-white/20 rounded transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Messages */}
          <div className="h-96 overflow-y-auto p-4 space-y-4">
            <AnimatePresence>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className={`flex gap-3 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {message.sender === 'bot' && (
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                  )}
                  
                  <div className={`max-w-xs group ${
                    message.sender === 'user' 
                      ? 'bg-blue-600 text-white rounded-2xl rounded-br-md' 
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-2xl rounded-bl-md'
                  } p-3 shadow-sm relative`}>
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    
                    {message.citations && (
                      <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-600">
                        <p className="text-xs opacity-70 mb-1">Sources:</p>
                        {message.citations.map((citation, idx) => (
                          <div key={idx} className="text-xs opacity-80 bg-white/10 rounded px-2 py-1 mb-1">
                            {citation}
                          </div>
                        ))}
                      </div>
                    )}
                    
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                      <button
                        onClick={() => copyMessage(message.content)}
                        className="p-1 hover:bg-white/20 rounded text-xs"
                        title="Copy message"
                      >
                        <Copy className="w-3 h-3" />
                      </button>
                      {message.sender === 'bot' && (
                        <>
                          <button className="p-1 hover:bg-white/20 rounded text-xs" title="Helpful">
                            <ThumbsUp className="w-3 h-3" />
                          </button>
                          <button className="p-1 hover:bg-white/20 rounded text-xs" title="Not helpful">
                            <ThumbsDown className="w-3 h-3" />
                          </button>
                        </>
                      )}
                    </div>
                    
                    <div className="text-xs opacity-50 mt-1">
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                  
                  {message.sender === 'user' && (
                    <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <UserIcon className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
            
            {isTyping && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex gap-3"
              >
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="bg-gray-100 dark:bg-gray-700 rounded-2xl rounded-bl-md p-3">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                  </div>
                </div>
              </motion.div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Suggested Questions */}
          {messages.length <= 1 && (
            <div className="px-4 pb-4">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-500" />
                {documentContext ? 'Ask about this document:' : 'Try asking:'}
              </p>
              <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto">
                {suggestedQuestions.map((question, idx) => (
                  <motion.button
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    onClick={() => handleSuggestedQuestion(question)}
                    className="text-sm p-3 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 hover:from-blue-50 hover:to-indigo-50 dark:hover:from-gray-600 dark:hover:to-gray-500 rounded-xl text-left transition-all duration-200 hover:shadow-md border border-gray-200 dark:border-gray-600 hover:border-blue-200 dark:hover:border-blue-500"
                  >
                    <span className="block text-gray-800 dark:text-gray-200 font-medium">
                      {question}
                    </span>
                  </motion.button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Ask me anything about this document..."
                className="flex-1 px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-xl border-0 text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white dark:focus:bg-gray-600 transition-colors"
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim()}
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </>
      )}
    </motion.div>
  );
}