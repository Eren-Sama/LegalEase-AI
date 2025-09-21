'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Shield, Globe, Zap, Users, Award } from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';

interface HeroProps {
  className?: string;
}

export function Hero({ className }: HeroProps) {
  const router = useRouter();
  const { user } = useAuth();

  const handleGetStarted = () => {
    if (user) {
      router.push('/dashboard');
    } else {
      router.push('/auth/signup');
    }
  };

  return (
    <section className={cn(
      'relative min-h-screen flex items-center justify-center overflow-hidden',
      'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50',
      'dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20',
      className
    )}>
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-blue-400/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-indigo-400/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-blue-400/30 rounded-full"
            animate={{
              y: [-20, -100],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: i * 0.5,
            }}
            style={{
              left: `${10 + i * 15}%`,
              bottom: '20%',
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 text-center relative z-10">
        {/* Premium Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 mb-8 px-4 py-2 rounded-full
                     bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm
                     border border-blue-200/50 dark:border-blue-700/50
                     text-blue-700 dark:text-blue-300 text-sm font-medium
                     shadow-lg shadow-blue-500/10"
        >
          <Sparkles className="w-4 h-4" />
          <span>Powered by Advanced AI • Trusted by Legal Professionals</span>
          <Award className="w-4 h-4" />
        </motion.div>

        {/* Main Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-5xl md:text-7xl xl:text-8xl font-bold mb-6
                     bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600
                     bg-clip-text text-transparent
                     leading-tight tracking-tight"
        >
          Legal<span className="text-blue-600">Ease</span>
          <span className="block text-4xl md:text-5xl xl:text-6xl mt-2 text-gray-800 dark:text-gray-200">
            AI
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-4xl mx-auto
                     font-light leading-relaxed"
        >
          Transform complex legal documents into{' '}
          <span className="text-blue-600 dark:text-blue-400 font-semibold">clear, understandable language</span>{' '}
          with our AI-powered platform. Get instant analysis, risk assessment, and plain-English summaries.
        </motion.p>

        {/* Feature Pills */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-wrap justify-center gap-3 mb-12"
        >
          {[
            { icon: Globe, text: '20+ Languages' },
            { icon: Zap, text: 'Instant Analysis' },
            { icon: Users, text: 'Team Collaboration' },
          ].map((feature, i) => (
            <div
              key={i}
              className="flex items-center gap-2 px-4 py-2 rounded-full
                         bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm
                         border border-gray-200/50 dark:border-gray-700/50
                         text-gray-700 dark:text-gray-300 text-sm font-medium
                         shadow-lg shadow-gray-500/5"
            >
              <feature.icon className="w-4 h-4 text-blue-600" />
              <span>{feature.text}</span>
            </div>
          ))}
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <button
            onClick={handleGetStarted}
            className="group relative px-8 py-4 text-lg font-semibold text-white
                       bg-gradient-to-r from-blue-600 to-indigo-600
                       hover:from-blue-700 hover:to-indigo-700
                       rounded-xl shadow-xl shadow-blue-500/25
                       hover:shadow-2xl hover:shadow-blue-500/40
                       transform hover:scale-105 transition-all duration-300
                       border border-blue-500/20
                       min-w-[200px]"
          >
            <span className="flex items-center justify-center gap-2">
              {user ? (
                <>
                  Go to Dashboard
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                </>
              ) : (
                <>
                  Get Started Free
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                </>
              )}
            </span>
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-400 to-indigo-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
          </button>
        </motion.div>
      </div>

      {/* Gradient Overlay */}
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-white dark:from-gray-900 to-transparent"></div>
    </section>
  );
}