export default function ExamCard({
  title,
  subtitle,
  tag,
  duration,
  questionCount,
}: {
  title: string;
  subtitle: string;
  tag: string;
  duration: string;
  questionCount: number;
}) {
  return (
    <div className="relative overflow-hidden bg-[var(--rm-bg-surface-default)] rounded-[var(--rm-radius-3xl)] p-[var(--rm-spacing-8)] shadow-[var(--rm-shadow-3)] transition-transform active:scale-[0.98]">
      {/* Decorative Background Circle */}
      <div className="absolute -right-8 -top-8 w-32 h-32 bg-[var(--rm-bg-brand-subtle)] rounded-full opacity-50 blur-2xl" />

      <div className="relative z-10 flex flex-col items-start gap-[var(--rm-spacing-6)]">
        <span className="inline-flex items-center px-[var(--rm-spacing-3)] py-[var(--rm-spacing-1)] rounded-full bg-[var(--rm-bg-brand-subtle)] text-[var(--rm-color-brand-600)] text-xs font-bold uppercase tracking-wider">
          {tag}
        </span>

        <div className="space-y-[var(--rm-spacing-1)]">
          <h3 className="text-[28px] font-extrabold text-[var(--rm-color-neutral-900)] leading-tight">
            {title}
          </h3>
          <p className="text-[16px] text-[var(--rm-color-neutral-500)] font-medium">{subtitle}</p>
        </div>

        <div className="flex items-center gap-[var(--rm-spacing-4)] mt-[var(--rm-spacing-2)]">
          <div className="flex items-center gap-[var(--rm-spacing-2)]">
            <div className="w-8 h-8 rounded-full bg-[var(--rm-bg-surface-emphasis)] flex items-center justify-center text-[var(--rm-color-neutral-500)]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
            </div>
            <span className="text-sm font-semibold text-[var(--rm-color-neutral-700)]">
              {duration}
            </span>
          </div>
          <div className="flex items-center gap-[var(--rm-spacing-2)]">
            <div className="w-8 h-8 rounded-full bg-[var(--rm-bg-surface-emphasis)] flex items-center justify-center text-[var(--rm-color-neutral-500)]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
                <polyline points="10 9 9 9 8 9" />
              </svg>
            </div>
            <span className="text-sm font-semibold text-[var(--rm-color-neutral-700)]">
              {questionCount}문항
            </span>
          </div>
        </div>

        <button className="w-full mt-[var(--rm-spacing-4)] py-[var(--rm-spacing-4)] rounded-[var(--rm-radius-2xl)] bg-[var(--rm-bg-brand-default)] text-[var(--rm-color-white)] font-bold text-lg shadow-[var(--rm-shadow-2)] hover:bg-[var(--rm-bg-brand-emphasis)] transition-colors">
          시험 시작하기
        </button>
      </div>
    </div>
  );
}
