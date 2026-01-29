import { Play, Clock, Flame } from 'lucide-react';

const workouts = [
  {
    id: 1,
    title: 'Core Crusher',
    category: 'Strength',
    duration: '20 min',
    intensity: 'High',
    image: 'bg-neutral-800', // Placeholder for now
  },
  {
    id: 2,
    title: 'Morning Flow',
    category: 'Yoga',
    duration: '30 min',
    intensity: 'Low',
    image: 'bg-neutral-800',
  },
  {
    id: 3,
    title: 'HIIT Blast',
    category: 'Cardio',
    duration: '15 min',
    intensity: 'Extreme',
    image: 'bg-neutral-800',
  },
];

export default function WorkoutList() {
  return (
    <div className="px-6 py-8">
      <h2 className="text-sm font-medium text-neutral-400 uppercase tracking-widest mb-6">
        Recommended for You
      </h2>
      <div className="flex flex-col gap-4">
        {workouts.map((workout) => (
          <div
            key={workout.id}
            className="group relative flex items-center justify-between p-4 rounded-xl bg-neutral-900/40 border border-white/5 hover:bg-neutral-800/40 hover:border-cyan-500/30 transition-all duration-300"
          >
            <div className="flex items-center gap-4">
              <div
                className={`w-12 h-12 rounded-lg ${workout.image} flex items-center justify-center text-neutral-600`}
              >
                <Flame className="w-5 h-5 group-hover:text-cyan-400 transition-colors" />
              </div>
              <div>
                <h3 className="text-white font-medium text-lg leading-none mb-1 group-hover:text-cyan-100 transition-colors">
                  {workout.title}
                </h3>
                <div className="flex items-center gap-3 text-xs text-neutral-500">
                  <span>{workout.category}</span>
                  <span className="w-1 h-1 rounded-full bg-neutral-700"></span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {workout.duration}
                  </span>
                </div>
              </div>
            </div>

            <button className="flex items-center justify-center w-10 h-10 rounded-full bg-white/5 text-white hover:bg-cyan-500 hover:text-black transition-all transform group-hover:scale-110">
              <Play className="w-4 h-4 fill-current" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
