import React, { ReactNode, useState, useEffect } from 'react';
import { 
  FlaskConical, 
  Presentation, 
  Workflow, 
  Users, 
  Linkedin, 
  ChevronRight,
  LogOut,
  Loader2
} from 'lucide-react';
import { motion } from 'motion/react';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import { auth } from './lib/firebase';
import Auth from './Auth';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [visitorCount, setVisitorCount] = useState(12842);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisitorCount(prev => prev + Math.floor(Math.random() * 2));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center">
        <Loader2 className="text-cyan-500 animate-spin" size={40} />
      </div>
    );
  }

  if (!user) {
    return <Auth />;
  }

  return (
    <div className="min-h-screen text-white font-sans selection:bg-cyan-500/30">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#020617]/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <div className="text-2xl font-bold tracking-tight">
              <span className="text-cyan-400">AI</span>Created
            </div>
            
            <div className="hidden md:flex items-center gap-4 text-sm font-medium text-slate-400">
              <div className="flex items-center gap-2 bg-slate-800/30 px-3 py-1 rounded-full border border-white/5">
                <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.5)] animate-pulse" />
                <span className="text-cyan-500 text-[10px] font-bold tracking-widest">LIVE</span>
                <span className="w-px h-3 bg-white/10 mx-1" />
                <div className="flex items-center gap-1.5 whitespace-nowrap">
                  <Users size={14} className="text-slate-500" />
                  <span className="text-slate-100">{visitorCount.toLocaleString()}</span>
                  <span className="text-slate-500">Visitors</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex flex-col items-end mr-2">
              <span className="text-[10px] text-slate-500 uppercase font-bold tracking-tighter">Welcome</span>
              <span className="text-xs text-slate-300 font-medium">
                {user.displayName && user.displayName.trim() !== '' ? user.displayName : (user.email || 'Member')}
              </span>
            </div>
            <button 
              onClick={handleLogout}
              className="bg-slate-800 hover:bg-red-500/10 hover:text-red-400 text-slate-300 border border-white/5 px-4 py-2 rounded-full text-sm font-bold transition-all active:scale-95 flex items-center gap-2 group" 
              id="logout-button"
            >
              <LogOut size={16} className="group-hover:-translate-x-1 transition-transform" />
              Log out
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="group cursor-pointer mb-12"
          >
            <div className="flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/20 px-5 py-2 rounded-full text-cyan-400 text-sm font-semibold hover:bg-cyan-500/20 transition-all hover:scale-105 shadow-xl shadow-cyan-950/20">
              <span className="animate-bounce">🎁</span>
              AICreated is giving you 30% off for Pro 1 Year
              <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl md:text-7xl font-extrabold tracking-tight mb-16 text-slate-50"
          >
            Thank you for coming.<br />
            <span className="text-slate-500">What can I help you?</span>
          </motion.h1>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl mx-auto">
            <Card 
              icon={<FlaskConical />}
              title="Create PoC"
              description="I can help you to plan your Proof of Concept for your project"
              color="bg-cyan-500/20 text-cyan-400"
              delay={0.2}
            />
            <Card 
              icon={<Presentation />}
              title="Create Slide Presentation"
              description="Let me prepare your presentation slide with modern style"
              color="bg-violet-500/20 text-violet-400"
              delay={0.3}
            />
            <Card 
              icon={<Workflow />}
              title="Create Diagram Workflow"
              description="Makes your presentation look professional with diagram design"
              color="bg-emerald-500/20 text-emerald-400"
              delay={0.4}
            />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-20 px-4">
        <div className="max-w-7xl mx-auto pt-12 border-t border-white/5 flex flex-col items-center gap-6">
          <div className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-slate-800 group-hover:border-blue-500 transition-colors">
              <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Jekry" alt="Jekry Tehe" className="w-full h-full object-cover" />
            </div>
            <a 
              href="https://www.linkedin.com/in/jekry-tehe-564126147/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-slate-900 px-5 py-2.5 rounded-full border border-white/5 hover:border-blue-500/50 hover:bg-slate-800 transition-all active:scale-95"
            >
              <div className="text-blue-500">
                <Linkedin size={20} fill="currentColor" className="stroke-none" />
              </div>
              <span className="text-sm font-bold">Jekry Tehe</span>
              <span className="w-px h-3 bg-white/10" />
              <span className="text-xs text-slate-500 font-medium tracking-wide">Connect on LinkedIn</span>
            </a>
          </div>
          
          <div className="text-slate-600 text-xs font-medium tracking-widest uppercase py-1">
            © 2026 AICreated. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

function Card({ 
  icon, 
  title, 
  description, 
  color, 
  delay = 0, 
}: { 
  icon: ReactNode, 
  title: string, 
  description: string, 
  color: string,
  delay?: number,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.6, ease: "easeOut" }}
      className="group relative"
      id={`card-${title.toLowerCase().replace(/\s+/g, '-')}`}
    >
      <div className={`
        relative overflow-hidden h-full
        bg-slate-900 border border-white/5 rounded-3xl p-8
        hover:bg-slate-800/80 hover:border-cyan-500/30 transition-all duration-500
        cursor-pointer hover:-translate-y-2 flex flex-col items-center text-center
      `}>
        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-8 transition-all duration-500 group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(6,182,212,0.2)] ${color}`}>
          {React.cloneElement(icon as React.ReactElement, { size: 32 })}
        </div>
        
        <h3 className="text-xl font-bold mb-4 group-hover:text-white transition-colors text-slate-100">
          {title}
        </h3>
        <p className="text-base text-slate-400 leading-relaxed group-hover:text-slate-300 transition-colors">
          {description}
        </p>

        {/* Shine effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
      </div>
    </motion.div>
  );
}

