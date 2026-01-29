const BottomNav = () => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex justify-center pb-8 pt-4 pointer-events-none">
      <div className="flex items-center gap-2 px-6 py-3 bg-[--lm-background-surface]/90 backdrop-blur-xl rounded-[--lm-radius-full] border border-[--lm-border-subtle] shadow-[--lm-elevation-card-hover] pointer-events-auto">
        <NavItem active>홈</NavItem>
        <NavItem>달력</NavItem>
        <button className="group relative mx-2">
          <div className="absolute -inset-1 bg-gradient-to-r from-[--lm-brand-500] to-[--lm-brand-600] rounded-full blur opacity-40 group-hover:opacity-100 transition duration-[--lm-motion-duration-complex]"></div>
          <div className="relative flex items-center justify-center w-12 h-12 bg-gradient-to-tr from-[--lm-brand-500] to-[--lm-brand-600] rounded-full text-white shadow-lg transform group-active:scale-95 transition-transform duration-[--lm-motion-duration-moderate]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
          </div>
        </button>
        <NavItem>차트</NavItem>
        <NavItem>설정</NavItem>
      </div>
    </nav>
  );
};
const NavItem = ({ children, active }: { children: React.ReactNode; active?: boolean }) => (
  <button
    className={`flex flex-col items-center px-3 py-1 rounded-[--lm-radius-md] transition-all duration-[--lm-motion-duration-moderate] ${active ? 'text-[--lm-brand-emphasis]' : 'text-[--lm-text-tertiary] hover:text-[--lm-text-secondary]'}`}
  >
    <span className="text-[11px] font-[--lm-font-weight-bold] tracking-tight">{children}</span>
    {active && (
      <div className="mt-1 w-1 h-1 rounded-full bg-[--lm-brand-default] shadow-[0_0_8px_var(--lm-brand-500)]"></div>
    )}
  </button>
);
export default BottomNav;
