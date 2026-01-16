
import React from 'react';
import { Mic, Map as MapIcon, BarChart3 } from 'lucide-react';

export const Features: React.FC = () => {
  return (
    <section className="py-24 bg-gradient-to-b from-[#020617] to-[#0a192f] relative overflow-hidden" id="features">
        
        {/* Radial Gradient Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-blue-500/10 rounded-full blur-[120px]" />

      <div className="container mx-auto px-4 relative z-10">
        
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Everything You Need to Dominate Dubai Real Estate</h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Powerful AI-driven tools that transform how you discover, analyze, and invest in properties
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Card 1 */}
          <div className="group bg-[#112240] rounded-2xl p-8 border border-white/5 hover:border-cyan-400/50 transition-all duration-300 hover:-translate-y-2 relative overflow-hidden shadow-[0_0_30px_-5px_rgba(34,211,238,0.3)]">
             <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
             
             <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center mb-8 shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform duration-300">
                <Mic size={32} className="text-white" />
             </div>
             
             <h3 className="text-2xl font-bold text-white mb-4">Voice-Driven AI Assistant</h3>
             <p className="text-slate-400 leading-relaxed">
               Engage in natural conversations with our Gemini Live-powered AI. Ask questions, explore neighborhoods, and discover properties through intuitive voice commands.
             </p>
          </div>

          {/* Card 2 */}
          <div className="group bg-[#112240] rounded-2xl p-8 border border-white/5 hover:border-cyan-400/50 transition-all duration-300 hover:-translate-y-2 relative overflow-hidden shadow-[0_0_30px_-5px_rgba(34,211,238,0.3)]">
             <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
             
             <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center mb-8 shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform duration-300">
                <MapIcon size={32} className="text-white" />
             </div>
             
             <h3 className="text-2xl font-bold text-white mb-4">Immersive 3D Map Exploration</h3>
             <p className="text-slate-400 leading-relaxed">
               Navigate Dubai's skyline with Google Maps 3D. Visualize properties in their real-world context, explore communities, and understand spatial relationships instantly.
             </p>
          </div>

          {/* Card 3 */}
          <div className="group bg-[#112240] rounded-2xl p-8 border border-white/5 hover:border-cyan-400/50 transition-all duration-300 hover:-translate-y-2 relative overflow-hidden shadow-[0_0_30px_-5px_rgba(34,211,238,0.3)]">
             <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
             
             <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center mb-8 shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform duration-300">
                <BarChart3 size={32} className="text-white" />
             </div>
             
             <h3 className="text-2xl font-bold text-white mb-4">Market Intelligence Engine</h3>
             <p className="text-slate-400 leading-relaxed">
               Access real-time market data, investment trends, and AI-powered insights. Make data-driven decisions with comprehensive analytics and comparative analysis.
             </p>
          </div>

        </div>

      </div>
    </section>
  );
};
