'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  AlertTriangle, 
  Shield, 
  XCircle, 
  Clock, 
  TrendingUp,
  Bell,
  X,
  CheckCircle,
  AlertCircle,
  Zap,
  Eye,
  Users,
  DollarSign,
  Scale,
  Building,
  EyeOff
} from 'lucide-react';

interface RiskAlert {
  id: string;
  type: 'critical' | 'high' | 'medium' | 'low';
  category: 'financial' | 'legal' | 'operational' | 'compliance' | 'reputational';
  title: string;
  description: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  urgency: 'immediate' | 'soon' | 'routine';
  likelihood: 'high' | 'medium' | 'low';
  impact: string;
  mitigation: string;
  location?: string;
  timestamp: Date;
  isRead: boolean;
  isActionTaken: boolean;
  recommendedAction?: string;
  deadline?: string;
}

interface RiskAssessment {
  overallRisk: string;
  riskScore: number;
  criticalRisks: any[];
  riskCategories: {
    financial: { score: number; risks: string[] };
    legal: { score: number; risks: string[] };
    operational: { score: number; risks: string[] };
    compliance: { score: number; risks: string[] };
    reputational: { score: number; risks: string[] };
  };
  redFlags: any[];
  recommendedActions: any[];
}

interface RiskAlertSystemProps {
  riskAssessment?: RiskAssessment;
  documentName?: string;
  onAlertClick?: (alert: RiskAlert) => void;
  onDismissAlert?: (alertId: string) => void;
  className?: string;
}

const RiskAlertSystem: React.FC<RiskAlertSystemProps> = ({
  riskAssessment,
  documentName,
  onAlertClick,
  onDismissAlert,
  className = ''
}) => {
  const [alerts, setAlerts] = useState<RiskAlert[]>([]);
  const [showAllAlerts, setShowAllAlerts] = useState(false);
  const [filterType, setFilterType] = useState<'all' | 'critical' | 'high' | 'medium' | 'low'>('all');

  // Generate alerts from risk assessment
  useEffect(() => {
    if (!riskAssessment) return;

    const generatedAlerts: RiskAlert[] = [];

    // Generate alerts from critical risks
    if (riskAssessment.criticalRisks) {
      riskAssessment.criticalRisks.forEach((risk, index) => {
        generatedAlerts.push({
          id: `critical-${index}`,
          type: risk.severity || 'high',
          category: 'legal',
          title: risk.type || 'Critical Risk Detected',
          description: risk.description || 'A critical risk has been identified in this document.',
          severity: risk.severity || 'high',
          urgency: risk.urgency || 'immediate',
          likelihood: risk.likelihood || 'medium',
          impact: risk.impact || 'High impact to business operations',
          mitigation: risk.mitigation || 'Review with legal counsel immediately',
          timestamp: new Date(),
          isRead: false,
          isActionTaken: false,
          recommendedAction: risk.mitigation,
          deadline: risk.urgency === 'immediate' ? '24 hours' : '1 week'
        });
      });
    }

    // Generate alerts from red flags
    if (riskAssessment.redFlags) {
      riskAssessment.redFlags.forEach((flag, index) => {
        generatedAlerts.push({
          id: `redflag-${index}`,
          type: flag.severity || 'critical',
          category: 'compliance',
          title: `🚩 Red Flag: ${flag.flag}`,
          description: `Critical issue detected: ${flag.flag}`,
          severity: flag.severity || 'critical',
          urgency: 'immediate',
          likelihood: 'high',
          impact: 'Potential legal or financial exposure',
          mitigation: flag.recommendation || 'Immediate review required',
          location: flag.location,
          timestamp: new Date(),
          isRead: false,
          isActionTaken: false,
          recommendedAction: flag.recommendation,
          deadline: '24 hours'
        });
      });
    }

    // Generate alerts from risk categories
    Object.entries(riskAssessment.riskCategories || {}).forEach(([category, data]) => {
      if (data.score > 75) {
        data.risks.forEach((risk, index) => {
          generatedAlerts.push({
            id: `${category}-${index}`,
            type: data.score > 90 ? 'critical' : 'high',
            category: category as any,
            title: `${category.charAt(0).toUpperCase() + category.slice(1)} Risk Alert`,
            description: risk,
            severity: data.score > 90 ? 'critical' : 'high',
            urgency: data.score > 90 ? 'immediate' : 'soon',
            likelihood: 'medium',
            impact: `${category} operations may be affected`,
            mitigation: `Address ${category} concerns with appropriate stakeholders`,
            timestamp: new Date(),
            isRead: false,
            isActionTaken: false,
            deadline: data.score > 90 ? '48 hours' : '1 week'
          });
        });
      }
    });

    setAlerts(generatedAlerts.sort((a, b) => {
      const severityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
      return severityOrder[b.severity] - severityOrder[a.severity];
    }));
  }, [riskAssessment]);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-600 bg-red-50 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800';
      case 'high': return 'text-orange-600 bg-orange-50 border-orange-200 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-800';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800';
      case 'low': return 'text-blue-600 bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800';
      default: return 'text-gray-600 bg-gray-50 border-gray-200 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'financial': return DollarSign;
      case 'legal': return Scale;
      case 'operational': return Users;
      case 'compliance': return Shield;
      case 'reputational': return Building;
      default: return AlertTriangle;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'financial': return 'text-green-600';
      case 'legal': return 'text-purple-600';
      case 'operational': return 'text-blue-600';
      case 'compliance': return 'text-orange-600';
      case 'reputational': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const handleMarkAsRead = (alertId: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, isRead: true } : alert
    ));
  };

  const handleTakeAction = (alertId: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, isActionTaken: true, isRead: true } : alert
    ));
  };

  const handleDismissAlert = (alertId: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== alertId));
    if (onDismissAlert) onDismissAlert(alertId);
  };

  const filteredAlerts = filterType === 'all' 
    ? alerts 
    : alerts.filter(alert => alert.severity === filterType);

  const criticalAlertsCount = alerts.filter(a => a.severity === 'critical' && !a.isActionTaken).length;
  const unreadAlertsCount = alerts.filter(a => !a.isRead).length;

  if (!alerts.length) return null;

  return (
    <div className={`${className}`}>
      {/* Alert Summary Bar */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-red-500 to-orange-500 text-white p-4 rounded-lg mb-6 shadow-lg"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-6 h-6" />
              <span className="font-bold text-lg">Risk Alerts</span>
            </div>
            {criticalAlertsCount > 0 && (
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="flex items-center space-x-1 bg-white/20 px-3 py-1 rounded-full"
              >
                <Zap className="w-4 h-4" />
                <span className="text-sm font-medium">
                  {criticalAlertsCount} Critical
                </span>
              </motion.div>
            )}
          </div>
          
          <div className="flex items-center space-x-4">
            <span className="text-sm opacity-90">
              {unreadAlertsCount} unread • {alerts.length} total
            </span>
            <button
              onClick={() => setShowAllAlerts(!showAllAlerts)}
              className="bg-white/20 hover:bg-white/30 px-3 py-1 rounded-full text-sm font-medium transition-colors"
            >
              {showAllAlerts ? 'Hide' : 'View All'}
            </button>
          </div>
        </div>
        
        {documentName && (
          <p className="text-sm opacity-90 mt-2">
            Document: {documentName}
          </p>
        )}
      </motion.div>

      {/* Critical Alerts - Always Visible */}
      <AnimatePresence>
        {alerts.filter(a => a.severity === 'critical').map((alert, index) => (
          <motion.div
            key={alert.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ delay: index * 0.1 }}
            className={`border-2 rounded-xl p-4 mb-4 ${getSeverityColor(alert.severity)} ${
              !alert.isRead ? 'ring-2 ring-red-500 ring-opacity-50' : ''
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3 flex-1">
                <div className="flex-shrink-0">
                  {React.createElement(getCategoryIcon(alert.category), {
                    className: `w-6 h-6 ${getCategoryColor(alert.category)}`
                  })}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {alert.title}
                    </h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getSeverityColor(alert.severity)}`}>
                      {alert.severity.toUpperCase()}
                    </span>
                    {alert.urgency === 'immediate' && (
                      <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
                        URGENT
                      </span>
                    )}
                  </div>
                  
                  <p className="text-gray-700 dark:text-gray-300 mb-3">
                    {alert.description}
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3 text-sm">
                    <div>
                      <span className="font-medium">Impact:</span>
                      <p className="text-gray-600 dark:text-gray-400">{alert.impact}</p>
                    </div>
                    <div>
                      <span className="font-medium">Recommended Action:</span>
                      <p className="text-gray-600 dark:text-gray-400">{alert.mitigation}</p>
                    </div>
                  </div>
                  
                  {alert.deadline && (
                    <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 mb-3">
                      <Clock className="w-4 h-4" />
                      <span>Deadline: {alert.deadline}</span>
                    </div>
                  )}
                  
                  <div className="flex items-center space-x-2">
                    {!alert.isRead && (
                      <button
                        onClick={() => handleMarkAsRead(alert.id)}
                        className="flex items-center space-x-1 text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full hover:bg-blue-200 transition-colors"
                      >
                        <Eye className="w-3 h-3" />
                        <span>Mark Read</span>
                      </button>
                    )}
                    
                    {!alert.isActionTaken && (
                      <button
                        onClick={() => handleTakeAction(alert.id)}
                        className="flex items-center space-x-1 text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full hover:bg-green-200 transition-colors"
                      >
                        <CheckCircle className="w-3 h-3" />
                        <span>Action Taken</span>
                      </button>
                    )}
                    
                    {alert.isActionTaken && (
                      <span className="flex items-center space-x-1 text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full">
                        <CheckCircle className="w-3 h-3" />
                        <span>Resolved</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>
              
              <button
                onClick={() => handleDismissAlert(alert.id)}
                className="flex-shrink-0 p-1 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-full transition-colors"
              >
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* All Alerts Section */}
      <AnimatePresence>
        {showAllAlerts && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            {/* Filter Buttons */}
            <div className="flex items-center space-x-2 mb-4">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Filter:</span>
              {(['all', 'critical', 'high', 'medium', 'low'] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setFilterType(type)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                    filterType === type
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-400 dark:hover:bg-gray-600'
                  }`}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                  {type !== 'all' && (
                    <span className="ml-1">
                      ({alerts.filter(a => a.severity === type).length})
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Non-Critical Alerts */}
            <div className="space-y-3">
              {filteredAlerts.filter(a => a.severity !== 'critical').map((alert, index) => (
                <motion.div
                  key={alert.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`border rounded-lg p-4 ${getSeverityColor(alert.severity)} ${
                    !alert.isRead ? 'ring-1 ring-orange-400 ring-opacity-50' : ''
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3 flex-1">
                      <div className="flex-shrink-0">
                        {React.createElement(getCategoryIcon(alert.category), {
                          className: `w-5 h-5 ${getCategoryColor(alert.category)}`
                        })}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h4 className="font-medium text-gray-900 dark:text-white">
                            {alert.title}
                          </h4>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getSeverityColor(alert.severity)}`}>
                            {alert.severity}
                          </span>
                        </div>
                        
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                          {alert.description}
                        </p>
                        
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <span>Impact: {alert.likelihood} likelihood</span>
                          {alert.deadline && <span>Due: {alert.deadline}</span>}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {!alert.isRead && (
                        <button
                          onClick={() => handleMarkAsRead(alert.id)}
                          className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                        >
                          <Eye className="w-4 h-4 text-gray-500" />
                        </button>
                      )}
                      
                      <button
                        onClick={() => handleDismissAlert(alert.id)}
                        className="p-1 hover:bg-red-100 dark:hover:bg-red-900/30 rounded transition-colors"
                      >
                        <X className="w-4 h-4 text-gray-500" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {filteredAlerts.length === 0 && showAllAlerts && (
        <div className="text-center py-8">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            No {filterType === 'all' ? '' : filterType} alerts
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            All {filterType === 'all' ? '' : filterType} risk alerts have been addressed.
          </p>
        </div>
      )}
    </div>
  );
};

export default RiskAlertSystem;