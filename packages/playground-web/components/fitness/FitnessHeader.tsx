import { ArrowRight } from 'lucide-react';

export default function FitnessHeader() {
  return (
    <header className="flex flex-col gap-6 py-8 px-6 bg-neutral-900/50 backdrop-blur-md sticky top-0 z-10 border-b border-white/5">
      <div className="flex justify-between items-start">
        <div>
          <div className="text-xs font-medium tracking-[0.2em] text-cyan-500 uppercase mb-2">
            Today's Session
          </div>
          <h1 className="text-3xl font-light text-white leading-tight">
            Upper Body <br />
            <span className="font-semibold text-neutral-400">Power & Control</span>
          </h1>
        </div>
        <div className="text-right">
          <div className="text-xs font-medium text-neutral-500 uppercase tracking-wider mb-1">
            Trainer
          </div>
          <div className="text-sm text-white font-medium">Sarah Connor</div>
        </div>
      </div>

      <div className="flex items-center justify-between mt-2">
        <div className="flex gap-4 text-sm text-neutral-400">
          <span className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-500"></span>
            08:00 AM
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-neutral-600"></span>
            60 Min
          </span>
        </div>
        <button className="group flex items-center gap-2 text-xs font-medium text-white uppercase tracking-widest hover:text-cyan-400 transition-colors">
          Details
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </button>
      </div>
    </header>
  );
}
