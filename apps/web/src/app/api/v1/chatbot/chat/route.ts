import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// Validation schema for chat requests
const chatRequestSchema = z.object({
  message: z.string().min(1).max(2000),
  documentContext: z.string().optional(),
  conversationHistory: z.array(z.object({
    role: z.enum(['user', 'bot']),
    content: z.string()
  })).optional().default([])
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate request body
    const validationResult = chatRequestSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { success: false, error: 'Invalid request format', details: validationResult.error.errors },
        { status: 400 }
      );
    }

    const { message, documentContext, conversationHistory = [] } = validationResult.data;

    // Generate AI response using mock implementation
    const botResponse = await generateMockAIResponse(message, !!documentContext, conversationHistory);

    return NextResponse.json({
      success: true,
      data: {
        response: botResponse,
        suggestions: generateFollowUpSuggestions(message, !!documentContext),
        hasDocumentContext: !!documentContext
      }
    });

  } catch (error: any) {
    console.error('Chatbot API error:', error);
    
    // Fallback response
    const fallbackResponse = "I apologize, but I'm having trouble processing your question right now. Please try rephrasing your question or feel free to ask about legal concepts, document types, or general legal processes.";

    return NextResponse.json({
      success: true,
      data: {
        response: fallbackResponse,
        suggestions: [
          "What types of legal documents can you help with?",
          "How do I find a qualified attorney?",
          "What are common contract terms to watch for?"
        ],
        hasDocumentContext: false,
        isRetry: true
      }
    });
  }
}

// Mock AI response function - Replace with actual AI integration
async function generateMockAIResponse(message: string, hasDocumentContext: boolean, conversationHistory: any[]): Promise<string> {
  const messageLower = message.toLowerCase();
  
  if (hasDocumentContext) {
    // Document-specific responses
    if (messageLower.includes('risk') || messageLower.includes('danger') || messageLower.includes('problem')) {
      return `Based on my analysis of the document, here are the key risks I've identified:

1. **Liability exposure** - There may be clauses that increase your financial responsibility
2. **Termination conditions** - Review the conditions under which the agreement can be ended
3. **Payment obligations** - Ensure you understand all payment terms and deadlines
4. **Compliance requirements** - Check for regulatory or legal compliance obligations

I recommend having a qualified attorney review these specific clauses to ensure they align with your interests.`;
    }
    
    if (messageLower.includes('summary') || messageLower.includes('summarize') || messageLower.includes('overview')) {
      return `Here's a comprehensive summary of the document:

**Document Type:** Legal Agreement/Contract

**Key Components:**
• **Parties involved** - The main entities bound by this agreement
• **Terms and conditions** - Specific obligations and requirements for each party
• **Payment structure** - How and when payments should be made
• **Duration** - The time period this agreement covers
• **Termination clause** - Conditions under which the agreement ends

**Notable Points:**
This appears to be a standard agreement with some clauses that may benefit from professional review. Pay particular attention to liability, termination, and payment sections.

Would you like me to elaborate on any specific section?`;
    }
    
    if (messageLower.includes('payment') || messageLower.includes('money') || messageLower.includes('fee')) {
      return `Regarding payment terms in the document:

**Payment Structure:**
• Payment amounts and schedules are clearly defined
• Late payment penalties may apply
• Payment methods are specified

**Key Considerations:**
• Ensure payment deadlines are realistic for your situation
• Review any late fee or penalty clauses
• Confirm the total financial obligation is as expected
• Check for any automatic renewal or recurring payment terms

**Recommendation:** Verify that all payment terms align with your budget and cash flow expectations.`;
    }
    
    if (messageLower.includes('terminate') || messageLower.includes('cancel') || messageLower.includes('end')) {
      return `Here's what you need to know about termination:

**Termination Conditions:**
• Review the specific conditions that allow termination
• Check notice requirements (how much advance notice is needed)
• Understand any penalties or fees for early termination
• Note any post-termination obligations

**Important:** Some agreements have automatic renewal clauses, so make sure you understand the timing requirements for termination.

**Advice:** If you're considering termination, ensure you follow the exact procedures outlined in the agreement to avoid potential legal issues.`;
    }

    return `Thank you for your question about the document. I can help you understand:

• **Legal terms and clauses** - Breaking down complex language into plain English
• **Risks and obligations** - Identifying what you're responsible for
• **Key provisions** - Highlighting the most important parts
• **Recommendations** - Suggesting areas that might need attention

Please feel free to ask about specific sections, terms, or concepts you'd like me to explain in more detail.`;
  } else {
    // General legal responses
    if (messageLower.includes('contract') || messageLower.includes('agreement')) {
      return `Here's what you should know about contracts and agreements:

**Essential Elements of a Valid Contract:**
1. **Offer and acceptance** - Clear terms proposed and agreed to
2. **Consideration** - Something of value exchanged by both parties
3. **Legal capacity** - Parties must be legally able to enter contracts
4. **Legal purpose** - The contract cannot be for illegal activities

**Before Signing Any Contract:**
• Read everything carefully, including fine print
• Understand your obligations and rights
• Check termination and cancellation policies
• Verify payment terms and schedules
• Consider having a lawyer review important contracts

**Remember:** Once signed, contracts are legally binding, so take time to understand them fully.`;
    }

    if (messageLower.includes('lawyer') || messageLower.includes('attorney') || messageLower.includes('legal advice')) {
      return `Here's guidance on when and how to work with legal professionals:

**When to Consult an Attorney:**
• Complex business transactions
• Real estate purchases or sales
• Employment disputes
• Family law matters (divorce, custody)
• Criminal charges
• Personal injury claims
• Estate planning

**How to Find a Good Lawyer:**
• Ask for referrals from trusted sources
• Check your state bar association's directory
• Read online reviews and ratings
• Schedule consultations to find the right fit
• Verify their experience in your specific legal area

**Cost Considerations:**
• Many lawyers offer free initial consultations
• Fee structures vary (hourly, flat fee, contingency)
• Legal aid may be available for qualifying individuals

**Important:** While I can provide general information, specific legal situations always require personalized advice from a qualified attorney.`;
    }

    if (messageLower.includes('business') || messageLower.includes('company') || messageLower.includes('startup')) {
      return `Here's essential legal information for businesses:

**Business Structure Options:**
• **Sole Proprietorship** - Simplest, but no liability protection
• **LLC** - Flexible structure with liability protection
• **Corporation** - More complex, but strong liability protection
• **Partnership** - Good for multiple owners, shared responsibilities

**Key Legal Documents for Business:**
• Operating agreements or bylaws
• Employment contracts and policies
• Terms of service and privacy policies
• Vendor and supplier agreements
• Insurance policies

**Compliance Considerations:**
• Business licenses and permits
• Tax registration and filings
• Employment law compliance
• Industry-specific regulations

**Recommendation:** Consult with a business attorney to choose the right structure and ensure proper legal setup for your specific situation.`;
    }

    if (messageLower.includes('ai') || messageLower.includes('accuracy') || messageLower.includes('reliable')) {
      return `About AI legal analysis and its limitations:

**What AI Can Do Well:**
• Identify common legal terms and clauses
• Highlight potential areas of concern
• Provide general legal education and information
• Help you understand document structure and content
• Suggest questions to ask your lawyer

**AI Limitations:**
• Cannot replace personalized legal advice
• May miss nuanced legal issues
• Cannot represent you in legal proceedings
• Laws vary by jurisdiction and change over time
• Complex legal strategies require human expertise

**Best Practice:**
Use AI as a helpful tool for initial document review and legal education, but always consult with qualified attorneys for important legal decisions and specific advice.

**Accuracy:** While AI tools are continuously improving, legal matters are complex and fact-specific, making human expertise essential for critical decisions.`;
    }

    return `Hello! I'm your AI legal assistant, and I'm here to help with:

**General Legal Questions:**
• Understanding legal concepts and terminology
• Explaining different types of legal documents
• Providing guidance on legal processes
• Helping you know when to consult an attorney

**Document Analysis:**
• Upload a document for specific analysis
• Risk assessment and clause explanation
• Plain English summaries of complex legal text

**Remember:** I provide educational information, not legal advice. For specific legal situations, always consult with a qualified attorney.

What legal topic would you like to explore today?`;
  }
}

// Helper function to generate follow-up suggestions
function generateFollowUpSuggestions(userMessage: string, hasDocumentContext: boolean): string[] {
  const messageLower = userMessage.toLowerCase();
  
  if (hasDocumentContext) {
    // Document-specific suggestions
    if (messageLower.includes('risk') || messageLower.includes('danger')) {
      return [
        "What are the main obligations for each party?",
        "How can I mitigate these risks?",
        "What happens if someone breaches this contract?"
      ];
    } else if (messageLower.includes('payment') || messageLower.includes('money')) {
      return [
        "What are the payment terms and deadlines?",
        "Are there any penalties for late payment?",
        "How is the payment amount calculated?"
      ];
    } else if (messageLower.includes('termination') || messageLower.includes('cancel')) {
      return [
        "What are the termination conditions?",
        "How much notice is required?",
        "What happens to payments after termination?"
      ];
    } else {
      return [
        "What are the key risks in this document?",
        "Can you summarize the main terms?",
        "What should I negotiate or change?"
      ];
    }
  } else {
    // General legal suggestions
    if (messageLower.includes('contract') || messageLower.includes('agreement')) {
      return [
        "What makes a contract legally binding?",
        "How do I review a contract properly?",
        "What are common contract terms to watch for?"
      ];
    } else if (messageLower.includes('law') || messageLower.includes('legal')) {
      return [
        "How do I find a qualified attorney?",
        "What are my legal rights in this situation?",
        "What legal documents might I need?"
      ];
    } else if (messageLower.includes('business') || messageLower.includes('company')) {
      return [
        "What legal structure is best for my business?",
        "What business documents do I need?",
        "How do I protect my business legally?"
      ];
    } else {
      return [
        "What types of legal documents can you help with?",
        "How accurate is AI legal analysis?",
        "When should I consult with a real lawyer?"
      ];
    }
  }
}