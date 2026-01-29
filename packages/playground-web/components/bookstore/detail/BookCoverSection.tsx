'use client';

interface BookCoverSectionProps {
  coverColor: string;
  title: string;
}

export function BookCoverSection({ coverColor, title }: BookCoverSectionProps) {
  return (
    <section className="px-6 md:px-10 pt-6 md:pt-8 pb-6 md:pb-8">
      <div className="flex justify-center md:justify-start">
        <div
          className="w-full max-w-[300px] md:max-w-[400px] aspect-[2/3] rounded-[var(--atomic-radius-lg)] shadow-2xl relative overflow-hidden"
          style={{ backgroundColor: coverColor }}
        >
          {/* Mock Cover Design */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
          <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-white">
            <div className="text-center space-y-4">
              <span className="text-6xl md:text-7xl block opacity-80">📖</span>
              <h3 className="text-2xl md:text-3xl font-[family-name:var(--font-serif)] font-bold leading-tight opacity-90">
                {title}
              </h3>
            </div>
          </div>

          {/* Decorative corner accent */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-bl-full" />
        </div>
      </div>
    </section>
  );
}
