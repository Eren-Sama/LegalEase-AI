'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Settings, 
  User, 
  Bell, 
  Lock, 
  Palette, 
  Globe, 
  Monitor,
  Sun,
  Moon,
  Check,
  ChevronDown,
  Shield,
  Download,
  Trash2,
  Eye,
  EyeOff
} from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';
import { useI18n, languages as supportedLanguages, type SupportedLanguage } from '@/contexts/i18n-context';

interface UserSettingsProps {
  onClose?: () => void;
}

type ThemeMode = 'light' | 'dark' | 'system';

export default function UserSettings({ onClose }: UserSettingsProps) {
  const { user, updateUserProfile } = useAuth();
  const { currentLanguage, setLanguage } = useI18n();
  const [activeTab, setActiveTab] = useState('appearance');
  const [themeMode, setThemeMode] = useState<ThemeMode>('system');
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    desktop: false,
    marketing: false
  });
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  // Profile update states
  const [profileForm, setProfileForm] = useState({
    displayName: user?.displayName || '',
    username: user?.email?.split('@')[0] || '',
    email: user?.email || '',
    bio: ''
  });
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateMessage, setUpdateMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as ThemeMode || 'system';
    setThemeMode(savedTheme);
    
    // Apply the saved theme immediately
    applyTheme(savedTheme);
  }, []);

  const applyTheme = (mode: ThemeMode) => {
    const root = document.documentElement;
    
    if (mode === 'system') {
      const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (systemDark) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    } else {
      if (mode === 'dark') {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    }
  };

  const handleThemeChange = (mode: ThemeMode) => {
    setThemeMode(mode);
    localStorage.setItem('theme', mode);
    applyTheme(mode);
    
    // Trigger a custom event for other components
    window.dispatchEvent(new CustomEvent('theme-change', { detail: mode }));
  };

  const handleLanguageChange = (langCode: SupportedLanguage) => {
    setLanguage(langCode);
    setShowLanguageDropdown(false);
    
    // Update document language attribute for proper RTL/LTR support
    if (typeof document !== 'undefined') {
      document.documentElement.lang = langCode;
      
      // Apply RTL for Arabic
      if (langCode === 'ar') {
        document.documentElement.dir = 'rtl';
      } else {
        document.documentElement.dir = 'ltr';
      }
    }
    
    // Store language preference
    localStorage.setItem('preferredLanguage', langCode);
    
    // In a real app, you would trigger a language change throughout the app
    console.log(`Language changed to: ${supportedLanguages[langCode].name}`);
  };

  const handleNotificationChange = (key: keyof typeof notifications) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  // Profile update functions
  const handleProfileFormChange = (field: keyof typeof profileForm, value: string) => {
    setProfileForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleUpdateProfile = async () => {
    setIsUpdating(true);
    setUpdateMessage(null);
    
    try {
      await updateUserProfile({
        displayName: profileForm.displayName,
        bio: profileForm.bio,
        // Add other fields as needed
      });
      
      setUpdateMessage({
        type: 'success',
        text: 'Profile updated successfully!'
      });
    } catch (error) {
      setUpdateMessage({
        type: 'error',
        text: 'Failed to update profile. Please try again.'
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // In a real app, you'd upload to a file service like Firebase Storage
    const reader = new FileReader();
    reader.onload = async (e) => {
      const photoURL = e.target?.result as string;
      try {
        await updateUserProfile({ avatar: photoURL });
        setUpdateMessage({
          type: 'success',
          text: 'Profile photo updated successfully!'
        });
      } catch (error) {
        setUpdateMessage({
          type: 'error',
          text: 'Failed to update profile photo.'
        });
      }
    };
    reader.readAsDataURL(file);
  };

  // Update profile form when user changes
  useEffect(() => {
    if (user) {
      setProfileForm({
        displayName: user.displayName || '',
        username: user.email?.split('@')[0] || '',
        email: user.email || '',
        bio: '' // You'd get this from user profile data
      });
    }
  }, [user]);

  const tabs = [
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'account', label: 'Account', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'privacy', label: 'Privacy & Security', icon: Shield },
    { id: 'language', label: 'Language & Region', icon: Globe },
  ];

  const currentLanguageData = supportedLanguages[currentLanguage];

  return (
    <div className="w-full max-w-5xl mx-auto overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <Settings className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Settings & Preferences</h2>
              <p className="text-blue-100">Customize your LegalEase AI experience</p>
            </div>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-full"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      <div className="flex min-h-[500px] max-h-[600px]">
        {/* Sidebar */}
        <div className="w-64 bg-gray-50 dark:bg-gray-700/50 border-r border-gray-200 dark:border-gray-600 p-4">
          <div className="space-y-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <motion.button
                  key={tab.id}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all text-left text-sm ${
                    activeTab === tab.id
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600/50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="font-medium">{tab.label}</span>
                </motion.button>
              );
            })}
          </div>

          {/* User Profile Section */}
          <div className="mt-6 p-3 bg-white/50 dark:bg-gray-600/30 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <div>
                <div className="font-medium text-gray-900 dark:text-white text-sm">
                  {user?.name || 'User'}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Premium Plan
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6 overflow-y-auto">
          {/* Account Tab */}
          {activeTab === 'account' && (
            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">Account Settings</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-8">
                  Update your profile information and account preferences.
                </p>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Profile Information */}
                  <div className="space-y-6">
                    <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Profile Information</h4>
                    
                    {/* Profile Picture */}
                    <div className="flex items-center gap-6">
                      <div className="relative">
                        <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
                          {user?.photoURL ? (
                            <img 
                              src={user.photoURL} 
                              alt="Profile" 
                              className="w-20 h-20 rounded-full object-cover"
                            />
                          ) : (
                            <User className="w-8 h-8 text-white" />
                          )}
                        </div>
                        <button className="absolute -bottom-2 -right-2 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm hover:bg-blue-700 transition-colors">
                          ✎
                        </button>
                      </div>
                      <div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handlePhotoUpload}
                          className="hidden"
                          id="photo-upload"
                        />
                        <label
                          htmlFor="photo-upload"
                          className="cursor-pointer px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors mr-3"
                        >
                          Change Photo
                        </label>
                        <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                          Remove
                        </button>
                      </div>
                    </div>

                    {/* Update Message */}
                    {updateMessage && (
                      <div className={`p-4 rounded-lg ${
                        updateMessage.type === 'success' 
                          ? 'bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200 border border-green-200 dark:border-green-800' 
                          : 'bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200 border border-red-200 dark:border-red-800'
                      }`}>
                        {updateMessage.text}
                      </div>
                    )}

                    {/* Name Fields */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Display Name
                        </label>
                        <input
                          type="text"
                          value={profileForm.displayName}
                          onChange={(e) => handleProfileFormChange('displayName', e.target.value)}
                          className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Your display name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Username
                        </label>
                        <input
                          type="text"
                          value={profileForm.username}
                          onChange={(e) => handleProfileFormChange('username', e.target.value)}
                          className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="username"
                        />
                      </div>
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={profileForm.email}
                        onChange={(e) => handleProfileFormChange('email', e.target.value)}
                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="your.email@example.com"
                      />
                    </div>

                    {/* Bio */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Bio
                      </label>
                      <textarea
                        rows={3}
                        value={profileForm.bio}
                        onChange={(e) => handleProfileFormChange('bio', e.target.value)}
                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                        placeholder="Tell us about yourself..."
                      />
                    </div>

                    <button 
                      onClick={handleUpdateProfile}
                      disabled={isUpdating}
                      className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {isUpdating ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Updating...
                        </>
                      ) : (
                        'Update Profile'
                      )}
                    </button>
                  </div>

                  {/* Account Security */}
                  <div className="space-y-6">
                    <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Account Security</h4>
                    
                    {/* Email Verification Status */}
                    <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                      <div className="flex items-center gap-3">
                        <Check className="w-5 h-5 text-green-600" />
                        <div>
                          <div className="text-sm font-medium text-green-800 dark:text-green-200">Email Verified</div>
                          <div className="text-sm text-green-600 dark:text-green-400">Your email address is verified</div>
                        </div>
                      </div>
                    </div>

                    {/* Change Password */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Current Password
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          className="w-full p-3 pr-12 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Enter current password"
                        />
                        <button
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                        >
                          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        New Password
                      </label>
                      <input
                        type="password"
                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter new password"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Confirm new password"
                      />
                    </div>

                    <button className="w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition-colors font-medium">
                      Change Password
                    </button>

                    {/* Account Deletion */}
                    <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                      <h5 className="text-sm font-medium text-red-800 dark:text-red-200 mb-2">Danger Zone</h5>
                      <p className="text-sm text-red-600 dark:text-red-400 mb-3">
                        Once you delete your account, there is no going back. This action cannot be undone.
                      </p>
                      <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium">
                        Delete Account
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Appearance Tab */}
          {activeTab === 'appearance' && (
            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">Appearance</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-8">
                  Customize the look and feel of your LegalEase AI interface.
                </p>

                {/* Theme Settings */}
                <div className="mb-8">
                  <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Theme Mode</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                      { mode: 'light', label: 'Light', desc: 'Clean and bright interface', icon: Sun },
                      { mode: 'dark', label: 'Dark', desc: 'Easy on the eyes', icon: Moon },
                      { mode: 'system', label: 'System', desc: 'Match your device', icon: Monitor }
                    ].map(({ mode, label, desc, icon: Icon }) => (
                      <motion.button
                        key={mode}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleThemeChange(mode as ThemeMode)}
                        className={`p-6 rounded-xl border-2 transition-all text-center ${
                          themeMode === mode
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                            : 'border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-500'
                        }`}
                      >
                        <Icon className={`w-8 h-8 mx-auto mb-3 ${
                          themeMode === mode ? 'text-blue-600' : 'text-gray-600 dark:text-gray-400'
                        }`} />
                        <div className={`font-medium mb-1 ${
                          themeMode === mode ? 'text-blue-900 dark:text-blue-100' : 'text-gray-900 dark:text-gray-100'
                        }`}>{label}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">{desc}</div>
                        {themeMode === mode && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="mt-2 mx-auto w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center"
                          >
                            <Check className="w-4 h-4 text-white" />
                          </motion.div>
                        )}
                      </motion.button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Language & Region Tab */}
          {activeTab === 'language' && (
            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">Language & Region</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-8">
                  Choose your preferred language and regional settings. The entire website will be updated to reflect your choice.
                </p>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Language Selection */}
                  <div>
                    <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Interface Language</h4>
                    <div className="relative">
                      <button
                        onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
                        className="w-full p-4 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl flex items-center justify-between hover:border-blue-400 dark:hover:border-blue-500 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{currentLanguageData?.flag}</span>
                          <div>
                            <div className="font-medium text-gray-900 dark:text-white">
                              {currentLanguageData?.name}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {currentLanguageData?.nativeName}
                            </div>
                          </div>
                        </div>
                        <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${
                          showLanguageDropdown ? 'rotate-180' : ''
                        }`} />
                      </button>

                      {showLanguageDropdown && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl shadow-lg z-50 max-h-80 overflow-y-auto"
                        >
                          {Object.entries(supportedLanguages).map(([code, lang]) => (
                            <button
                              key={code}
                              onClick={() => handleLanguageChange(code as SupportedLanguage)}
                              className={`w-full p-4 flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-600/50 transition-colors first:rounded-t-xl last:rounded-b-xl ${
                                currentLanguage === code ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                              }`}
                            >
                              <span className="text-2xl">{lang.flag}</span>
                              <div className="flex-1 text-left">
                                <div className="font-medium text-gray-900 dark:text-white">
                                  {lang.name}
                                </div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                  {lang.nativeName}
                                </div>
                              </div>
                              {currentLanguage === code && (
                                <Check className="w-5 h-5 text-blue-600" />
                              )}
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </div>
                  </div>

                  {/* Language Features */}
                  <div>
                    <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Language Features</h4>
                    <div className="space-y-4">
                      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                        <div className="flex items-center gap-2 mb-2">
                          <Globe className="w-5 h-5 text-blue-600" />
                          <span className="font-medium text-blue-900 dark:text-blue-100">Multilingual Support</span>
                        </div>
                        <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1 ml-7">
                          <li>• Interface language changes immediately</li>
                          <li>• Document analysis adapts to your language</li>
                          <li>• AI Assistant supports multilingual conversations</li>
                          <li>• RTL support for Arabic and other languages</li>
                        </ul>
                      </div>

                      <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl">
                        <div className="flex items-center gap-2 mb-2">
                          <Check className="w-5 h-5 text-green-600" />
                          <span className="font-medium text-green-900 dark:text-green-100">Current Status</span>
                        </div>
                        <p className="text-sm text-green-800 dark:text-green-200 ml-7">
                          Language preference saved and synchronized across all features
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">Notifications</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-8">
                  Manage how and when you receive notifications from LegalEase AI.
                </p>

                <div className="space-y-6">
                  {Object.entries({
                    email: {
                      label: 'Email Notifications',
                      desc: 'Receive important updates and analysis results via email',
                      icon: Bell
                    },
                    push: {
                      label: 'Push Notifications',
                      desc: 'Browser notifications for real-time updates',
                      icon: Bell
                    },
                    desktop: {
                      label: 'Desktop Notifications',
                      desc: 'System-level notifications on your device',
                      icon: Monitor
                    },
                    marketing: {
                      label: 'Marketing Communications',
                      desc: 'Product updates, tips, and promotional content',
                      icon: Bell
                    }
                  }).map(([key, { label, desc, icon: Icon }]) => (
                    <div key={key} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                      <div className="flex items-center gap-4">
                        <Icon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                        <div>
                          <div className="font-medium text-gray-900 dark:text-gray-100">{label}</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">{desc}</div>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={notifications[key as keyof typeof notifications]}
                          onChange={() => handleNotificationChange(key as keyof typeof notifications)}
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Account Tab */}
          {activeTab === 'account' && (
            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">Account Settings</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-8">
                  Manage your account information and preferences.
                </p>

                <div className="space-y-6">
                  <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
                        <User className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <h4 className="text-xl font-semibold text-gray-900 dark:text-white">
                          {user?.name || 'User'}
                        </h4>
                        <p className="text-gray-600 dark:text-gray-400">{user?.email}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="px-3 py-1 bg-gradient-to-r from-amber-400 to-orange-400 text-white text-sm font-medium rounded-full">
                            Premium Plan
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Privacy & Security Tab */}
          {activeTab === 'privacy' && (
            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">Privacy & Security</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-8">
                  Manage your privacy settings and security preferences.
                </p>

                <div className="space-y-6">
                  <div className="p-6 bg-green-50 dark:bg-green-900/20 rounded-xl">
                    <div className="flex items-center gap-3 mb-4">
                      <Shield className="w-6 h-6 text-green-600" />
                      <h4 className="text-lg font-semibold text-green-900 dark:text-green-100">Data Protection</h4>
                    </div>
                    <ul className="space-y-2 text-green-800 dark:text-green-200">
                      <li>• All documents are encrypted in transit and at rest</li>
                      <li>• Your data is never shared with third parties</li>
                      <li>• GDPR and CCPA compliant</li>
                      <li>• Regular security audits and updates</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}