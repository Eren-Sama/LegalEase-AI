// Chatbot API client for frontend
export interface ChatMessage {
  role: 'user' | 'bot';
  content: string;
}

export interface ChatRequest {
  message: string;
  documentContext?: string;
  conversationHistory?: ChatMessage[];
}

export interface ChatResponse {
  success: boolean;
  data?: {
    response: string;
    suggestions: string[];
    hasDocumentContext: boolean;
    isRetry?: boolean;
  };
  error?: {
    code: string;
    message: string;
  };
}

export async function sendChatMessage(
  message: string,
  documentContext?: string,
  conversationHistory: ChatMessage[] = []
): Promise<ChatResponse> {
  try {
    const response = await fetch('/api/v1/chatbot/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Add auth token if available
        ...(typeof window !== 'undefined' && localStorage.getItem('authToken') && {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        })
      },
      body: JSON.stringify({
        message,
        documentContext,
        conversationHistory
      })
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error?.message || 'Failed to send message');
    }

    return data;
  } catch (error) {
    console.error('Chat API error:', error);
    
    // Fallback response for offline or error states
    const fallbackResponse = documentContext 
      ? "I'm having trouble connecting to the AI service right now. Please check your connection and try again."
      : "I'm having trouble connecting right now. Here are some things I can usually help with:\n\n• Understanding legal documents\n• Explaining legal terms\n• Identifying risks in contracts\n• General legal guidance\n\nPlease try your question again in a moment.";

    return {
      success: false,
      data: {
        response: fallbackResponse,
        suggestions: documentContext ? [
          "What are the key risks in this document?",
          "Can you summarize the main terms?",
          "What should I be careful about?"
        ] : [
          "What types of documents can you help with?",
          "How do I review a contract?",
          "When should I consult a lawyer?"
        ],
        hasDocumentContext: !!documentContext,
        isRetry: true
      },
      error: {
        code: 'CONNECTION_ERROR',
        message: error instanceof Error ? error.message : 'Unknown error'
      }
    };
  }
}

export default {
  sendChatMessage
};