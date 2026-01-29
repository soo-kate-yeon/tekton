import { Sparkles, ChevronRight } from 'lucide-react';

export default function SubscriptionBanner() {
  return (
    <div className="px-6 pb-8">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-cyan-900/20 to-neutral-900 border border-cyan-500/20 p-6">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <Sparkles className="w-24 h-24 text-cyan-500" />
        </div>

        <div className="relative z-10">
          <div className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-[10px] font-bold uppercase tracking-widest mb-3 border border-cyan-500/20">
            Premium Access
          </div>
          <h3 className="text-xl font-light text-white mb-2">Unlock your full potential</h3>
          <p className="text-sm text-neutral-400 mb-6 max-w-[80%]">
            Renew your subscription today to access exclusive Master Classes and personalized
            nutrition plans.
          </p>

          <button className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg bg-white text-black font-medium text-sm hover:bg-cyan-500 transition-colors">
            Renew Subscription <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
