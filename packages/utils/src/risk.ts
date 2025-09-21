// Risk calculation utilities
export type RiskLevel = 'low' | 'medium' | 'high' | 'critical';

/**
 * Calculate risk score based on factors
 */
export function calculateRiskScore(factors: {
  financial: number;
  legal: number;
  operational: number;
  compliance: number;
}): number {
  const weights = {
    financial: 0.3,
    legal: 0.4,
    operational: 0.2,
    compliance: 0.1
  };
  
  return (
    factors.financial * weights.financial +
    factors.legal * weights.legal +
    factors.operational * weights.operational +
    factors.compliance * weights.compliance
  );
}

/**
 * Get risk level from score
 */
export function getRiskLevel(score: number): RiskLevel {
  if (score >= 80) return 'critical';
  if (score >= 60) return 'high';
  if (score >= 30) return 'medium';
  return 'low';
}

/**
 * Get risk color for UI
 */
export function getRiskColor(level: RiskLevel): string {
  const colors = {
    low: '#10B981',
    medium: '#F59E0B',
    high: '#EF4444',
    critical: '#991B1B'
  };
  
  return colors[level];
}