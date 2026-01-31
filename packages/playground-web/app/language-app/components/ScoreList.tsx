export default function ScoreList() {
  const scores = [
    { id: 1, title: '모의고사 14회', score: 92, date: '1월 28일', status: 'pass' },
    { id: 2, title: '모의고사 13회', score: 88, date: '1월 27일', status: 'pass' },
    { id: 3, title: '모의고사 12회', score: 76, date: '1월 25일', status: 'review' },
    { id: 4, title: '모의고사 11회', score: 95, date: '1월 24일', status: 'pass' },
  ];

  return (
    <div className="flex flex-col gap-[var(--rm-spacing-3)]">
      {scores.map((item) => (
        <div
          key={item.id}
          className="flex items-center justify-between p-[var(--rm-spacing-5)] bg-[var(--rm-bg-surface-default)] rounded-[var(--rm-radius-2xl)] shadow-[var(--rm-shadow-1)] hover:shadow-[var(--rm-shadow-2)] transition-shadow cursor-pointer"
        >
          <div className="flex flex-col gap-[2px]">
            <span className="text-[16px] font-semibold text-[var(--rm-color-neutral-900)]">
              {item.title}
            </span>
            <span className="text-[13px] text-[var(--rm-color-neutral-500)]">{item.date}</span>
          </div>

          <div className="flex items-center gap-[var(--rm-spacing-4)]">
            <div
              className={`
              px-[var(--rm-spacing-3)] py-[var(--rm-spacing-1)] rounded-full text-xs font-bold
              ${
                item.status === 'pass'
                  ? 'bg-[var(--rm-bg-brand-subtle)] text-[var(--rm-color-brand-600)]'
                  : 'bg-[var(--rm-color-neutral-100)] text-[var(--rm-color-neutral-500)]'
              }
            `}
            >
              {item.score}점
            </div>
            <div className="w-8 h-8 rounded-full bg-[var(--rm-bg-surface-subtle)] flex items-center justify-center text-[var(--rm-color-neutral-400)]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
