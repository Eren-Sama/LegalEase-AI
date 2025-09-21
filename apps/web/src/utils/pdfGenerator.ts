import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

interface AnalysisData {
  documentType?: string;
  confidence?: number;
  summary?: string;
  keyParties?: Array<{ name: string; role: string }>;
  financialAnalysis?: {
    totalContractValue?: string;
    identifiedAmounts?: Array<{
      value: string;
      currency: string;
      description: string;
      type: string;
      frequency?: string;
      dueDate?: string;
    }>;
    paymentSchedule?: Array<{
      phase: string;
      amount: string;
      dueDate: string;
      triggers: string[];
    }>;
    penalties?: Array<{
      type: string;
      amount: string;
      conditions: string;
    }>;
    bonuses?: Array<{
      type: string;
      amount: string;
      conditions: string;
    }>;
    financialRisks?: Array<{
      risk: string;
      impact: string;
      likelihood: string;
    }>;
  };
  keyClauses?: Array<{
    title: string;
    content: string;
    explanation: string;
    importance: string;
    risks: string[];
    recommendations: string[];
  }>;
  riskAssessment?: {
    overallRisk?: string;
    criticalRisks?: Array<{
      type: string;
      description: string;
      impact: string;
      mitigation: string;
    }>;
  };
  timeline?: Array<{
    date: string;
    event: string;
    importance: string;
  }>;
  actionableInsights?: Array<{
    priority: string;
    action: string;
    deadline: string;
    reason: string;
  }>;
}

export async function generateAnalysisPDF(analysisData: AnalysisData, fileName: string = 'legal-analysis.pdf'): Promise<void> {
  try {
    // Create a new PDF document
    const pdfDoc = await PDFDocument.create();
    
    // Add fonts
    const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);
    const timesRomanBoldFont = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);
    const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const helveticaBoldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    // Define colors
    const primaryColor = rgb(0.5, 0.2, 0.8); // Purple
    const headingColor = rgb(0.2, 0.2, 0.2); // Dark gray
    const textColor = rgb(0.3, 0.3, 0.3); // Medium gray
    const accentColor = rgb(0.8, 0.4, 0.0); // Orange
    
    // Page dimensions
    const pageWidth = 595.28; // A4 width in points
    const pageHeight = 841.89; // A4 height in points
    const margin = 50;
    const contentWidth = pageWidth - (2 * margin);

    let currentPage = pdfDoc.addPage([pageWidth, pageHeight]);
    let yPosition = pageHeight - margin;

    // Helper function to add text with automatic page breaks
    const addText = (text: string, fontSize: number, font: any, color: any = textColor, indent: number = 0) => {
      const lines = text.split('\n');
      for (const line of lines) {
        if (yPosition < margin + 50) {
          currentPage = pdfDoc.addPage([pageWidth, pageHeight]);
          yPosition = pageHeight - margin;
        }
        
        // Simple word wrap
        const maxWidth = contentWidth - indent;
        const textWidth = font.widthOfTextAtSize(line, fontSize);
        
        if (textWidth <= maxWidth) {
          currentPage.drawText(line, {
            x: margin + indent,
            y: yPosition,
            size: fontSize,
            font: font,
            color: color,
          });
          yPosition -= fontSize * 1.2;
        } else {
          // Split into multiple lines
          const words = line.split(' ');
          let currentLine = '';
          
          for (const word of words) {
            const testLine = currentLine + (currentLine ? ' ' : '') + word;
            const testWidth = font.widthOfTextAtSize(testLine, fontSize);
            
            if (testWidth <= maxWidth) {
              currentLine = testLine;
            } else {
              if (currentLine) {
                if (yPosition < margin + 50) {
                  currentPage = pdfDoc.addPage([pageWidth, pageHeight]);
                  yPosition = pageHeight - margin;
                }
                currentPage.drawText(currentLine, {
                  x: margin + indent,
                  y: yPosition,
                  size: fontSize,
                  font: font,
                  color: color,
                });
                yPosition -= fontSize * 1.2;
              }
              currentLine = word;
            }
          }
          
          if (currentLine) {
            if (yPosition < margin + 50) {
              currentPage = pdfDoc.addPage([pageWidth, pageHeight]);
              yPosition = pageHeight - margin;
            }
            currentPage.drawText(currentLine, {
              x: margin + indent,
              y: yPosition,
              size: fontSize,
              font: font,
              color: color,
            });
            yPosition -= fontSize * 1.2;
          }
        }
      }
      yPosition -= 10; // Add some extra spacing
    };

    // Helper function to add a section header
    const addSectionHeader = (title: string) => {
      yPosition -= 20;
      addText(title, 18, helveticaBoldFont, primaryColor);
      
      // Add underline
      currentPage.drawLine({
        start: { x: margin, y: yPosition + 5 },
        end: { x: margin + contentWidth, y: yPosition + 5 },
        thickness: 2,
        color: primaryColor,
      });
      yPosition -= 15;
    };

    // Title Page
    addText('LEGAL DOCUMENT ANALYSIS REPORT', 24, helveticaBoldFont, primaryColor);
    yPosition -= 20;
    addText(`Generated on: ${new Date().toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })}`, 12, helveticaFont, textColor);
    yPosition -= 10;
    addText('Powered by LegalEase AI', 12, helveticaFont, accentColor);

    // Executive Summary
    addSectionHeader('EXECUTIVE SUMMARY');
    
    if (analysisData.documentType) {
      addText(`Document Type: ${analysisData.documentType}`, 14, helveticaBoldFont);
    }
    
    if (analysisData.confidence) {
      addText(`Analysis Confidence: ${analysisData.confidence}%`, 14, helveticaBoldFont);
    }

    if (analysisData.summary) {
      addText('Summary:', 14, helveticaBoldFont);
      addText(analysisData.summary, 12, timesRomanFont, textColor, 20);
    }

    // Key Parties
    if (analysisData.keyParties && analysisData.keyParties.length > 0) {
      addSectionHeader('KEY PARTIES');
      analysisData.keyParties.forEach((party, index) => {
        addText(`${index + 1}. ${party.name} - ${party.role}`, 12, helveticaFont);
      });
    }

    // Financial Analysis
    if (analysisData.financialAnalysis) {
      addSectionHeader('FINANCIAL ANALYSIS');
      
      if (analysisData.financialAnalysis.totalContractValue) {
        addText(`Total Contract Value: ${analysisData.financialAnalysis.totalContractValue}`, 14, helveticaBoldFont);
      }

      if (analysisData.financialAnalysis.identifiedAmounts && analysisData.financialAnalysis.identifiedAmounts.length > 0) {
        addText('Financial Terms:', 14, helveticaBoldFont);
        analysisData.financialAnalysis.identifiedAmounts.forEach((amount, index) => {
          addText(`• ${amount.currency} ${amount.value} - ${amount.description} (${amount.type})`, 12, timesRomanFont, textColor, 20);
          if (amount.frequency && amount.frequency !== 'one-time') {
            addText(`  Frequency: ${amount.frequency}`, 11, timesRomanFont, textColor, 25);
          }
          if (amount.dueDate && amount.dueDate !== 'Not specified') {
            addText(`  Due Date: ${amount.dueDate}`, 11, timesRomanFont, textColor, 25);
          }
        });
      }

      if (analysisData.financialAnalysis.paymentSchedule && analysisData.financialAnalysis.paymentSchedule.length > 0) {
        addText('Payment Schedule:', 14, helveticaBoldFont);
        analysisData.financialAnalysis.paymentSchedule.forEach((payment, index) => {
          addText(`• ${payment.phase}: ${payment.amount} (Due: ${payment.dueDate})`, 12, timesRomanFont, textColor, 20);
          if (payment.triggers && payment.triggers.length > 0) {
            addText(`  Triggers: ${payment.triggers.join(', ')}`, 11, timesRomanFont, textColor, 25);
          }
        });
      }

      if (analysisData.financialAnalysis.penalties && analysisData.financialAnalysis.penalties.length > 0) {
        addText('Penalties:', 14, helveticaBoldFont, rgb(0.8, 0.2, 0.2));
        analysisData.financialAnalysis.penalties.forEach((penalty) => {
          addText(`• ${penalty.type}: ${penalty.amount}`, 12, timesRomanFont, rgb(0.8, 0.2, 0.2), 20);
          addText(`  Conditions: ${penalty.conditions}`, 11, timesRomanFont, rgb(0.6, 0.2, 0.2), 25);
        });
      }

      if (analysisData.financialAnalysis.bonuses && analysisData.financialAnalysis.bonuses.length > 0) {
        addText('Bonuses:', 14, helveticaBoldFont, rgb(0.2, 0.6, 0.2));
        analysisData.financialAnalysis.bonuses.forEach((bonus) => {
          addText(`• ${bonus.type}: ${bonus.amount}`, 12, timesRomanFont, rgb(0.2, 0.6, 0.2), 20);
          addText(`  Conditions: ${bonus.conditions}`, 11, timesRomanFont, rgb(0.2, 0.5, 0.2), 25);
        });
      }
    }

    // Risk Assessment
    if (analysisData.riskAssessment) {
      addSectionHeader('RISK ASSESSMENT');
      
      if (analysisData.riskAssessment.overallRisk) {
        const riskColor = analysisData.riskAssessment.overallRisk === 'high' ? rgb(0.8, 0.2, 0.2) :
                         analysisData.riskAssessment.overallRisk === 'medium' ? rgb(0.8, 0.6, 0.0) :
                         rgb(0.2, 0.6, 0.2);
        addText(`Overall Risk Level: ${analysisData.riskAssessment.overallRisk.toUpperCase()}`, 14, helveticaBoldFont, riskColor);
      }

      if (analysisData.riskAssessment.criticalRisks && analysisData.riskAssessment.criticalRisks.length > 0) {
        addText('Critical Risks:', 14, helveticaBoldFont);
        analysisData.riskAssessment.criticalRisks.forEach((risk, index) => {
          addText(`${index + 1}. ${risk.type}`, 13, helveticaBoldFont, rgb(0.8, 0.2, 0.2), 20);
          addText(`Description: ${risk.description}`, 12, timesRomanFont, textColor, 25);
          addText(`Impact: ${risk.impact}`, 12, timesRomanFont, textColor, 25);
          addText(`Mitigation: ${risk.mitigation}`, 12, timesRomanFont, rgb(0.2, 0.6, 0.2), 25);
        });
      }
    }

    // Key Clauses
    if (analysisData.keyClauses && analysisData.keyClauses.length > 0) {
      addSectionHeader('KEY CLAUSES');
      analysisData.keyClauses.forEach((clause, index) => {
        const importanceColor = clause.importance === 'high' ? rgb(0.8, 0.2, 0.2) :
                              clause.importance === 'medium' ? rgb(0.8, 0.6, 0.0) :
                              rgb(0.2, 0.6, 0.2);
        
        addText(`${index + 1}. ${clause.title}`, 14, helveticaBoldFont, importanceColor);
        addText(`Importance: ${clause.importance.toUpperCase()}`, 12, helveticaBoldFont, importanceColor, 20);
        addText(`Explanation: ${clause.explanation}`, 12, timesRomanFont, textColor, 20);
        
        if (clause.risks && clause.risks.length > 0) {
          addText('Risks:', 12, helveticaBoldFont, rgb(0.8, 0.2, 0.2), 20);
          clause.risks.forEach(risk => {
            addText(`• ${risk}`, 11, timesRomanFont, rgb(0.6, 0.2, 0.2), 30);
          });
        }
        
        if (clause.recommendations && clause.recommendations.length > 0) {
          addText('Recommendations:', 12, helveticaBoldFont, rgb(0.2, 0.6, 0.2), 20);
          clause.recommendations.forEach(rec => {
            addText(`• ${rec}`, 11, timesRomanFont, rgb(0.2, 0.5, 0.2), 30);
          });
        }
      });
    }

    // Timeline
    if (analysisData.timeline && analysisData.timeline.length > 0) {
      addSectionHeader('TIMELINE');
      analysisData.timeline.forEach((event, index) => {
        const importanceColor = event.importance === 'high' ? rgb(0.8, 0.2, 0.2) :
                              event.importance === 'medium' ? rgb(0.8, 0.6, 0.0) :
                              rgb(0.2, 0.6, 0.2);
        addText(`${event.date}: ${event.event}`, 12, timesRomanFont, importanceColor);
      });
    }

    // Actionable Insights
    if (analysisData.actionableInsights && analysisData.actionableInsights.length > 0) {
      addSectionHeader('ACTIONABLE INSIGHTS');
      analysisData.actionableInsights.forEach((insight, index) => {
        const priorityColor = insight.priority === 'high' ? rgb(0.8, 0.2, 0.2) :
                            insight.priority === 'medium' ? rgb(0.8, 0.6, 0.0) :
                            rgb(0.2, 0.6, 0.2);
        
        addText(`${index + 1}. ${insight.action}`, 12, helveticaBoldFont, priorityColor);
        addText(`Priority: ${insight.priority.toUpperCase()}`, 11, helveticaBoldFont, priorityColor, 20);
        addText(`Deadline: ${insight.deadline}`, 11, timesRomanFont, textColor, 20);
        addText(`Reason: ${insight.reason}`, 11, timesRomanFont, textColor, 20);
      });
    }

    // Footer on last page
    yPosition = margin + 30;
    addText('This analysis was generated by LegalEase AI and should be reviewed by a qualified legal professional.', 10, helveticaFont, rgb(0.5, 0.5, 0.5));
    addText('© 2024 LegalEase AI. All rights reserved.', 10, helveticaFont, rgb(0.5, 0.5, 0.5));

    // Generate PDF bytes
    const pdfBytes = await pdfDoc.save();

    // Download the PDF
    const blob = new Blob([new Uint8Array(pdfBytes)], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

  } catch (error) {
    console.error('Error generating PDF:', error);
    throw new Error('Failed to generate PDF. Please try again.');
  }
}

// Helper function to clean markdown formatting
export function cleanMarkdown(text: string): string {
  if (!text) return text;
  return text
    .replace(/\*{3}([^*]+)\*{3}/g, '$1') // Remove ***bold***
    .replace(/\*{2}([^*]+)\*{2}/g, '$1') // Remove **bold**  
    .replace(/\*([^*]+)\*/g, '$1') // Remove *italic*
    .replace(/`([^`]+)`/g, '$1') // Remove `code`
    .replace(/#{1,6}\s/g, '') // Remove headers
    .replace(/^\s*[-*+]\s/gm, '• ') // Convert bullet points
    .trim();
}