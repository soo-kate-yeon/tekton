export default function AppBar() {
  const tabs = [
    { id: 'exam', label: '시험', icon: <ExamIcon />, active: true },
    { id: 'practice', label: '연습', icon: <PracticeIcon />, active: false },
    { id: 'learn', label: '학습', icon: <LearnIcon />, active: false },
    { id: 'profile', label: '마이', icon: <ProfileIcon />, active: false },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[var(--rm-color-white)]/80 backdrop-blur-lg border-t border-[var(--rm-border-default-subtle)] pb-[env(safe-area-inset-bottom)]">
      <div className="mx-auto max-w-[480px] h-[80px] flex items-center justify-around px-[var(--rm-spacing-2)]">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`
              flex flex-col items-center justify-center gap-[4px] w-16 h-16 rounded-[var(--rm-radius-xl)] transition-colors
              ${
                tab.active
                  ? 'text-[var(--rm-color-brand-600)]'
                  : 'text-[var(--rm-color-neutral-400)] hover:text-[var(--rm-color-neutral-600)]'
              }
            `}
          >
            {tab.icon}
            <span className="text-[11px] font-medium">{tab.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}

function ExamIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
      <polyline points="14 2 14 8 20 8" />
      <path d="M12 13v.01" />
      <path d="M12 17v.01" />
    </svg>
  );
}

function PracticeIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
    </svg>
  );
}

function LearnIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
  );
}

function ProfileIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}
