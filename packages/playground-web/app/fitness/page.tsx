import FitnessHeader from '@/components/fitness/FitnessHeader';
import WorkoutList from '@/components/fitness/WorkoutList';
import SubscriptionBanner from '@/components/fitness/SubscriptionBanner';
import FitnessFooter from '@/components/fitness/FitnessFooter';

export default function FitnessPage() {
  return (
    <main className="min-h-screen bg-neutral-950 text-white font-sans selection:bg-cyan-500/30">
      <div className="mx-auto max-w-md bg-black min-h-screen shadow-2xl shadow-black border-x border-white/5 relative">
        <FitnessHeader />

        <div className="space-y-6">
          <WorkoutList />
          <SubscriptionBanner />
        </div>

        <FitnessFooter />
      </div>
    </main>
  );
}
