import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, FileDown, ArrowLeft, Bot, User as UserIcon, Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { generatePoCStream } from '../services/geminiService';
import { GenerateContentResponse } from '@google/genai';
import PptxGenJS from 'pptxgenjs';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

export default function PocGenerator({ onBack }: { onBack: () => void }) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hello! I'm AICreated. Tell me about your project concept, and I'll generate a professional Proof of Concept document for you."
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    const botMessageId = (Date.now() + 1).toString();
    const botMessage: Message = {
      id: botMessageId,
      role: 'assistant',
      content: ''
    };
    
    setMessages(prev => [...prev, botMessage]);

    try {
      const streamResponse = await generatePoCStream(input);
      let fullContent = '';
      
      for await (const chunk of streamResponse) {
        const c = chunk as GenerateContentResponse;
        if (c.text) {
          fullContent += c.text;
          setMessages(prev => prev.map(msg => 
            msg.id === botMessageId ? { ...msg, content: fullContent } : msg
          ));
        }
      }

      if (!fullContent) {
        setMessages(prev => prev.map(msg => 
          msg.id === botMessageId ? { ...msg, content: "I'm sorry, I couldn't generate the PoC. Please try again." } : msg
        ));
      }
    } catch (error) {
      console.error("Streaming error:", error);
      setMessages(prev => prev.map(msg => 
        msg.id === botMessageId ? { ...msg, content: "Error: Failed to connect to the AI service. Please ensure your API key is configured." } : msg
      ));
    } finally {
      setIsLoading(false);
    }
  };

  const downloadPoC = (content: string) => {
    const pptx = new PptxGenJS();
    pptx.layout = 'LAYOUT_16x9';

    // Split content by '---' to get individual slides
    const slidesData = content.split(/\n---\n|\n---|\n ---/);

    slidesData.forEach((slideContent) => {
      const slide = pptx.addSlide();
      slide.background = { color: '020617' }; // Dark background matching the app

      const lines = slideContent.split('\n').filter(line => line.trim() !== '');
      let title = "AICreated Presentation";
      const bodyLines: string[] = [];

      lines.forEach(line => {
        if (line.startsWith('## ')) {
          title = line.replace('## ', '').trim();
        } else if (line.startsWith('# ')) {
          title = line.replace('# ', '').trim();
        } else if (line.trim().length > 0) {
          // Remove markdown formatting like bold, italics for PPTX text
          const cleanLine = line.replace(/[*_~`]/g, '').replace(/^[-*]\s+/, '').trim();
          if (cleanLine) bodyLines.push(cleanLine);
        }
      });

      // Add Title
      slide.addText(title, {
        x: 0.5,
        y: 0.5,
        w: '90%',
        h: 1,
        fontSize: 36,
        bold: true,
        color: '22D3EE', // Cyan 400
        align: 'center',
        fontFace: 'Arial'
      });

      // Add Body
      if (bodyLines.length > 0) {
        slide.addText(
          bodyLines.map(text => ({ text, options: { bullet: true, breakLine: true } })),
          {
            x: 0.8,
            y: 1.8,
            w: '80%',
            h: 3.5,
            fontSize: 18,
            color: 'CBD5E1', // Slate 300
            valign: 'top',
            fontFace: 'Arial',
            lineSpacing: 24
          }
        );
      }

      // Add Footer
      slide.addText('© 2026 AICreated • Professional PoC Presentation', {
        x: 0,
        y: 5.2,
        w: '100%',
        h: 0.3,
        fontSize: 10,
        color: '475569', // Slate 600
        align: 'center',
        fontFace: 'Arial'
      });
    });

    pptx.writeFile({ fileName: 'PoC_Presentation.pptx' });
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] mt-16 max-w-4xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors group"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span>Back to Home</span>
        </button>
        <div className="flex items-center gap-2 px-3 py-1 bg-cyan-500/10 border border-cyan-500/20 rounded-full">
          <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest">AICreated PoC Engine</span>
        </div>
      </div>

      {/* Chat Area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto space-y-6 pr-4 custom-scrollbar"
      >
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div className={`
                flex-shrink-0 w-10 h-10 rounded-2xl flex items-center justify-center
                ${msg.role === 'assistant' 
                  ? 'bg-slate-800 text-cyan-400 border border-white/5 shadow-lg' 
                  : 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20'}
              `}>
                {msg.role === 'assistant' ? <Bot size={20} /> : <UserIcon size={20} />}
              </div>
              
              <div className={`
                max-w-[85%] rounded-3xl p-6 shadow-sm
                ${msg.role === 'assistant' 
                  ? 'bg-slate-900/50 border border-white/5 text-slate-200' 
                  : 'bg-slate-800 text-white border border-white/10'}
              `}>
                <div className="prose prose-invert max-w-none prose-sm">
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                </div>
                
                {msg.role === 'assistant' && msg.id !== '1' && (
                  <button 
                    onClick={() => downloadPoC(msg.content)}
                    className="mt-4 flex items-center gap-2 text-xs font-bold text-cyan-400 hover:text-cyan-300 transition-colors bg-cyan-400/10 px-3 py-2 rounded-xl group"
                  >
                    <FileDown size={14} className="group-hover:translate-y-0.5 transition-transform" />
                    Download PPTX Presentation
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex gap-4"
          >
            <div className="flex-shrink-0 w-10 h-10 rounded-2xl bg-slate-800 text-cyan-400 border border-white/5 flex items-center justify-center shadow-lg">
              <Bot size={20} className="animate-pulse" />
            </div>
            <div className="bg-slate-800/50 border border-white/5 rounded-3xl px-6 py-4 flex items-center gap-3">
              <Loader2 size={18} className="animate-spin text-cyan-400" />
              <span className="text-sm text-slate-400 font-medium italic">AICreated is generating your PoC...</span>
            </div>
          </motion.div>
        )}
      </div>

      {/* Input Area */}
      <div className="mt-6">
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/20 to-violet-500/20 rounded-[32px] blur opacity-0 group-focus-within:opacity-100 transition duration-1000" />
          <div className="relative flex items-center gap-2 bg-[#020617] border border-white/10 p-2 rounded-[28px] shadow-2xl">
            <textarea 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Describe your project concept (e.g., A real-time monitoring app for solar farms)"
              className="flex-1 bg-transparent border-none focus:ring-0 text-slate-200 placeholder:text-slate-600 px-4 py-3 resize-none min-h-[56px] max-h-32 text-sm"
              rows={1}
            />
            <button 
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className={`
                w-12 h-12 rounded-2xl flex items-center justify-center transition-all active:scale-95
                ${input.trim() && !isLoading 
                  ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20 hover:bg-cyan-400' 
                  : 'bg-slate-800 text-slate-600'}
              `}
            >
              <Send size={20} />
            </button>
          </div>
        </div>
        <p className="text-[10px] text-center mt-3 text-slate-500 font-medium uppercase tracking-tighter">
          Powered by Gemini 3 Flash • Built by AICreated
        </p>
      </div>
    </div>
  );
}
