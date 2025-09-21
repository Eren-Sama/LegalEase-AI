// Document processing utilities
export function extractTextFromHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '').trim();
}

export function countWords(text: string): number {
  return text.trim().split(/\s+/).length;
}

export function countSentences(text: string): number {
  return text.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
}

export function estimateReadingTime(text: string, wordsPerMinute = 200): number {
  const wordCount = countWords(text);
  return Math.ceil(wordCount / wordsPerMinute);
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3) + '...';
}

export function highlightText(text: string, searchTerm: string): string {
  if (!searchTerm) return text;
  
  const regex = new RegExp(`(${searchTerm})`, 'gi');
  return text.replace(regex, '<mark>$1</mark>');
}