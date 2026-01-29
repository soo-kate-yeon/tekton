import Link from 'next/link';

const demos = [
  {
    title: 'Blue Bottle Delivery',
    description: '블루보틀 테마의 프리미엄 커피 배달 서비스 데모',
    href: '/delivery',
    theme: 'Blue Bottle v2',
    icon: '☕️',
  },
  {
    title: 'The Atlantic',
    description: '고품격 저널리즘 스타일의 뉴스 매거진 레이아웃',
    href: '/news',
    theme: 'Atlantic Magazine',
    icon: '📰',
  },
  {
    title: '동네핫플',
    description: '모바일 무한스크롤 핫플레이스 피드',
    href: '/hotplaces',
    theme: 'Atlantic Magazine',
    icon: '📍',
  },
  {
    title: 'Dashboard',
    description: 'Linear Minimal 테마 기반 대시보드',
    href: '/dashboard',
    theme: 'Linear Minimal',
    icon: '📊',
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[--atomic-semantic-background-canvas]">
      {/* Header */}
      <header className="border-b border-[--atomic-semantic-border-default-subtle] bg-[--atomic-semantic-background-surface-default]">
        <div className="max-w-4xl mx-auto px-6 py-8 text-center">
          <h1 className="font-display font-bold text-4xl md:text-5xl text-[--atomic-color-brand-500] mb-3">
            Tekton Playground
          </h1>
          <p className="font-serif text-lg text-[--atomic-color-neutral-600]">
            OKLCH 기반 디자인 토큰 생성기 데모
          </p>
        </div>
      </header>

      {/* Demo Links */}
      <section className="max-w-4xl mx-auto px-6 py-12">
        <h2 className="font-sans font-bold text-xs tracking-widest uppercase text-[--atomic-color-neutral-400] mb-6">
          Demo Pages
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {demos.map((demo) => (
            <Link
              key={demo.href}
              href={demo.href}
              className="group block p-6 bg-[--atomic-semantic-background-surface-default] rounded-xl border border-[--atomic-semantic-border-default-subtle] hover:border-[--atomic-color-brand-500] hover:shadow-lg transition-all"
            >
              <div className="flex items-start gap-4">
                <span className="text-3xl">{demo.icon}</span>
                <div className="flex-1">
                  <h3 className="font-display font-bold text-xl text-[--atomic-color-neutral-900] group-hover:text-[--atomic-color-brand-500] transition-colors">
                    {demo.title}
                  </h3>
                  <p className="mt-1 font-serif text-sm text-[--atomic-color-neutral-600]">
                    {demo.description}
                  </p>
                  <div className="mt-3 flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-[--atomic-semantic-background-surface-emphasis] rounded text-xs font-sans font-medium text-[--atomic-color-neutral-500]">
                      {demo.theme}
                    </span>
                  </div>
                </div>
                <svg
                  className="w-5 h-5 text-[--atomic-color-neutral-300] group-hover:text-[--atomic-color-brand-500] group-hover:translate-x-1 transition-all"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Info Section */}
      <section className="max-w-4xl mx-auto px-6 pb-12">
        <div className="p-6 bg-[--atomic-semantic-background-surface-emphasis] rounded-xl">
          <h3 className="font-sans font-bold text-sm text-[--atomic-color-neutral-700] mb-2">
            Tekton MCP 사용법
          </h3>
          <p className="font-serif text-sm text-[--atomic-color-neutral-600] leading-relaxed">
            Tekton MCP를 통해 테마를 선택하고 블루프린트를 생성한 후, 코드로 내보내어 페이지를 만들
            수 있습니다. 현재 <strong>Atlantic Magazine</strong>과 <strong>Hims</strong> 테마가 사용
            가능합니다.
          </p>
        </div>
      </section>
    </main>
  );
}
