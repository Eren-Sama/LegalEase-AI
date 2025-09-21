'use client'

import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, X, Bot, User, Loader2 } from 'lucide-react'
import { sendChatMessage } from '@/lib/chatbot-api'

interface Message {
  id: string
  content: string
  sender: 'user' | 'bot'
  timestamp: Date
}

interface NewChatbotProps {
  isOpen?: boolean
  onClose?: () => void
  documentContext?: string
  title?: string
  expertType?: string
  initialMessage?: string
}

const NewChatbot: React.FC<NewChatbotProps> = ({
  isOpen = true,
  onClose,
  documentContext,
  title = "Legal Expert Chat",
  expertType = "Legal Expert",
  initialMessage = "Hello! I'm your legal expert assistant. How can I help you today?"
}) => {
  const [messages, setMessages] = useState<Message[]>(() => [
    {
      id: '1',
      content: initialMessage,
      sender: 'bot',
      timestamp: new Date()
    }
  ])
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isTyping) return

    const newMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: 'user',
      timestamp: new Date()
    }

    setMessages(prev => [...prev, newMessage])
    setInputValue('')
    setIsTyping(true)

    try {
      // Prepare conversation history for API
      const conversationHistory = messages.map(msg => ({
        role: msg.sender as 'user' | 'bot',
        content: msg.content
      }));

      // Call the chatbot API
      const response = await sendChatMessage(
        newMessage.content,
        documentContext,
        conversationHistory
      );

      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: response.data?.response || "I apologize, but I'm having trouble processing your request right now. Please try again.",
        sender: 'bot',
        timestamp: new Date()
      }

      setMessages(prev => [...prev, botResponse])
      
    } catch (error) {
      console.error('Chat error:', error);
      
      const errorResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: documentContext 
          ? "I'm having trouble analyzing the document right now. Please try rephrasing your question or ask about a specific section."
          : "I'm having connection issues right now. Please try your question again. I'm here to help with legal documents, contracts, and general legal guidance.",
        sender: 'bot',
        timestamp: new Date()
      }
      
      setMessages(prev => [...prev, errorResponse])
    } finally {
      setIsTyping(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl h-[80vh] flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-full">
                <Bot size={20} />
              </div>
              <div>
                <h3 className="font-semibold">{title}</h3>
                <p className="text-sm opacity-90">{expertType}</p>
              </div>
            </div>
            {onClose && (
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/20 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            )}
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex gap-2 max-w-[80%] ${message.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`p-2 rounded-full ${
                    message.sender === 'user' 
                      ? 'bg-blue-100 text-blue-600' 
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {message.sender === 'user' ? <User size={16} /> : <Bot size={16} />}
                  </div>
                  <div className={`p-3 rounded-2xl ${
                    message.sender === 'user'
                      ? 'bg-blue-600 text-white rounded-br-sm'
                      : 'bg-gray-100 text-gray-800 rounded-bl-sm'
                  }`}>
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    <p className={`text-xs mt-1 ${
                      message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'
                    }`}>
                      {message.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-start"
            >
              <div className="flex gap-2 max-w-[80%]">
                <div className="p-2 rounded-full bg-gray-100 text-gray-600">
                  <Bot size={16} />
                </div>
                <div className="p-3 rounded-2xl bg-gray-100 text-gray-800 rounded-bl-sm">
                  <div className="flex items-center gap-1">
                    <Loader2 size={16} className="animate-spin" />
                    <span className="text-sm">Typing...</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestions */}
        {messages.length <= 1 && (
          <div className="border-t p-4 bg-gray-50">
            <p className="text-xs text-gray-600 mb-2">Quick suggestions:</p>
            <div className="flex flex-wrap gap-2">
              {(documentContext ? [
                "What are the key risks in this document?",
                "Can you summarize the main terms?",
                "What should I negotiate?",
                "What are my obligations?"
              ] : [
                "What types of documents can you help with?",
                "How do I review a contract?", 
                "When should I consult a lawyer?",
                "What makes a contract legally binding?"
              ]).map((suggestion, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setInputValue(suggestion);
                    setTimeout(() => handleSendMessage(), 100);
                  }}
                  className="px-3 py-1 text-xs bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-full transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="border-t p-4">
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask your legal question..."
                className="w-full p-3 pr-12 border rounded-xl resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={1}
                style={{ maxHeight: '120px' }}
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isTyping}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Send size={16} />
              </button>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Press Enter to send, Shift+Enter for new line
          </p>
        </div>
      </motion.div>
    </div>
  )
}

export default NewChatbot