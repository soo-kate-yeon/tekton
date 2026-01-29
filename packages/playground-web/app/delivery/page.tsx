'use client';

import Link from 'next/link';

export default function DeliveryPage() {
  return (
    <div className="min-h-screen bg-[#f9fafb] text-[#1a1a1a] font-sans selection:bg-[#00aeef] selection:text-white">
      {/* Blue Bottle Theme CSS Variables */}
      <style jsx global>{`
        :root {
          --bb-blue: oklch(0.6 0.16 260);
          --bb-text: oklch(0.2 0.005 150);
          --bb-canvas: oklch(0.98 0.005 150);
          --bb-surface: #ffffff;
          --bb-border: oklch(0.89 0.005 150);
        }
      `}</style>

      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-[var(--bb-border)] px-6 py-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-10 bg-[var(--bb-blue)] clip-path-blue-bottle">
              {/* Blue Bottle Icon Placeholder */}
              <svg viewBox="0 0 100 120" className="w-full h-full text-white fill-current">
                <path d="M50 0 L100 30 L100 90 L50 120 L0 90 L0 30 Z" />
              </svg>
            </div>
            <span className="font-sans font-bold text-xl tracking-tight uppercase">
              Blue Bottle
            </span>
          </Link>
          <nav className="hidden md:flex gap-8 text-sm font-medium uppercase tracking-widest text-neutral-500">
            <a href="#" className="hover:text-[var(--bb-blue)] transition-colors">
              Coffee
            </a>
            <a href="#" className="hover:text-[var(--bb-blue)] transition-colors">
              Shop
            </a>
            <a href="#" className="hover:text-[var(--bb-blue)] transition-colors">
              Subscriptions
            </a>
          </nav>
          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-neutral-100 rounded-full transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>
            <button className="relative p-2 hover:bg-neutral-100 rounded-full transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
              <span className="absolute top-1 right-1 w-4 h-4 bg-[var(--bb-blue)] text-white text-[10px] flex items-center justify-center rounded-full">
                2
              </span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8 space-y-16">
        {/* Promotion Banner */}
        <section className="relative overflow-hidden rounded-3xl bg-neutral-900 aspect-[21/9] flex items-center">
          <img
            src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&q=80&w=1200"
            alt="Promotion Banner"
            className="absolute inset-0 w-full h-full object-cover opacity-60"
          />
          <div className="relative z-10 px-12 space-y-4 max-w-xl">
            <span className="inline-block px-3 py-1 bg-[var(--bb-blue)] text-white text-[10px] font-bold uppercase tracking-[2px] rounded">
              New Season
            </span>
            <h1 className="text-4xl md:text-5xl font-sans font-bold text-white leading-[1.1]">
              시즌 한정: 메이플 콜드브루
            </h1>
            <p className="text-neutral-200 text-lg font-light leading-relaxed">
              가을의 풍미를 한 가득 담은 메이플 콜드브루와 함께 차분한 오후의 여유를 즐겨보세요.
            </p>
            <button className="bg-white text-black px-8 py-3 rounded-full font-medium hover:bg-[var(--bb-blue)] hover:text-white transition-all transform hover:scale-105 active:scale-95">
              지금 주문하기
            </button>
          </div>
        </section>

        {/* Seasonal Menu Section */}
        <section className="space-y-8">
          <div className="flex justify-between items-end border-b border-neutral-200 pb-4">
            <div className="space-y-1">
              <h2 className="text-2xl font-sans font-bold tracking-tight text-[var(--bb-text)]">
                시즌 메뉴 음료
              </h2>
              <p className="text-neutral-500 text-sm">
                오직 지금 이 계좌에서만 만날 수 있는 특별한 맛
              </p>
            </div>
            <a href="#" className="text-sm font-medium text-[var(--bb-blue)] hover:underline">
              모든 메뉴 보기
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Item 1 */}
            <div className="group space-y-4">
              <div className="overflow-hidden rounded-2xl bg-white border border-neutral-100 aspect-square group-hover:shadow-xl transition-all duration-500">
                <img
                  src="https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&q=80&w=600"
                  alt="Winter Latte"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-bold group-hover:text-[var(--bb-blue)] transition-colors">
                  윈터 라떼 (HOT/ICE)
                </h3>
                <p className="text-sm text-neutral-500 line-clamp-2">
                  은은한 향신료의 풍미와 달콤한 시럽이 어우러진 시그니처 라떼
                </p>
                <div className="pt-2 font-medium text-lg">6,800원</div>
              </div>
            </div>

            {/* Item 2 */}
            <div className="group space-y-4">
              <div className="overflow-hidden rounded-2xl bg-white border border-neutral-100 aspect-square group-hover:shadow-xl transition-all duration-500">
                <img
                  src="https://images.unsplash.com/photo-1461023058943-07fcaf18331b?auto=format&fit=crop&q=80&w=600"
                  alt="Maple Cold Brew"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-bold group-hover:text-[var(--bb-blue)] transition-colors">
                  메이플 콜드브루
                </h3>
                <p className="text-sm text-neutral-500 line-clamp-2">
                  12시간 동안 천천히 추출한 콜드브루에 메이플의 진한 달콤함을 더했습니다.
                </p>
                <div className="pt-2 font-medium text-lg">7,200원</div>
              </div>
            </div>

            {/* Item 3 */}
            <div className="group space-y-4">
              <div className="overflow-hidden rounded-2xl bg-white border border-neutral-100 aspect-square group-hover:shadow-xl transition-all duration-500">
                <img
                  src="https://images.unsplash.com/photo-1544787210-2213d2426683?auto=format&fit=crop&q=80&w=600"
                  alt="Spiced Mocha"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-bold group-hover:text-[var(--bb-blue)] transition-colors">
                  스파이스드 모카
                </h3>
                <p className="text-sm text-neutral-500 line-clamp-2">
                  다크 초콜릿의 묵직함과 시나몬, 카다멈의 조화로운 스파이시함
                </p>
                <div className="pt-2 font-medium text-lg">7,500원</div>
              </div>
            </div>
          </div>
        </section>

        {/* Special Discount Section */}
        <section className="bg-white border border-neutral-200 rounded-3xl p-8 md:p-12">
          <div className="flex flex-col md:flex-row gap-12 items-center">
            <div className="md:w-1/3 space-y-6">
              <div className="space-y-2">
                <h2 className="text-3xl font-sans font-bold leading-tight">특별 할인 음료</h2>
                <p className="text-neutral-500 leading-relaxed text-sm">
                  오늘의 추천 할인 음료를 만나보세요. 주문 즉시 제조하여 가장 신선한 상태로 배달해
                  드립니다.
                </p>
              </div>
              <div className="p-4 bg-[var(--bb-canvas)] rounded-2xl border-l-4 border-[var(--bb-blue)]">
                <p className="text-xs font-bold uppercase tracking-widest text-neutral-500 mb-1">
                  Today's Note
                </p>
                <p className="text-sm font-medium italic text-[var(--bb-text)] mt-1">
                  \\\"커피 한 잔이 주는 가장 완벽한 순간을 선사합니다.\\\"
                </p>
              </div>
            </div>

            <div className="md:w-2/3 w-full space-y-4">
              {[
                {
                  name: '플랫 화이트',
                  discount: '15% OFF',
                  originPrice: '6,200',
                  price: '5,270',
                  img: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?auto=format&fit=crop&q=80&w=100',
                },
                {
                  name: '카푸치노',
                  discount: '10% OFF',
                  originPrice: '6,200',
                  price: '5,580',
                  img: 'https://images.unsplash.com/photo-1534778101976-62847782c213?auto=format&fit=crop&q=80&w=100',
                },
                {
                  name: '콜드브루 그로울러 (750ml)',
                  discount: '20% OFF',
                  originPrice: '25,000',
                  price: '20,000',
                  img: 'https://images.unsplash.com/photo-1461023058943-07fcaf18331b?auto=format&fit=crop&q=80&w=100',
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="group flex items-center gap-4 p-4 rounded-2xl hover:bg-neutral-50 border border-transparent hover:border-neutral-100 transition-all cursor-pointer"
                >
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-neutral-100 flex-shrink-0">
                    <img src={item.img} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-bold text-lg">{item.name}</h4>
                        <span className="text-[10px] font-bold text-white bg-red-500 px-1.5 py-0.5 rounded tracking-tighter">
                          {item.discount}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="block text-xs text-neutral-400 line-through">
                          {item.originPrice}원
                        </span>
                        <span className="block font-bold text-lg text-[var(--bb-blue)]">
                          {item.price}원
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="w-10 h-10 flex items-center justify-center rounded-full bg-[var(--bb-blue)] text-white transform scale-0 group-hover:scale-100 transition-transform">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" />
                    </svg>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-neutral-900 text-white py-20 mt-20">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="space-y-6">
            <h3 className="font-sans font-bold text-2xl tracking-tight uppercase">Blue Bottle</h3>
            <p className="text-neutral-500 text-sm leading-relaxed">
              최고의 재료로 만든 신선한 커피를
              <br />
              당신의 집 앞까지 배달해 드립니다.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-sm mb-6 uppercase tracking-widest text-neutral-400">
              Shop
            </h4>
            <ul className="space-y-4 text-sm text-neutral-500">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  전체 메뉴
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  커피 도구
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  기프트 세트
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-sm mb-6 uppercase tracking-widest text-neutral-400">
              Support
            </h4>
            <ul className="space-y-4 text-sm text-neutral-500">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  고객 지원
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  매장 찾기
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  FAQ
                </a>
              </li>
            </ul>
          </div>
          <div className="space-y-6">
            <h4 className="font-bold text-sm mb-6 uppercase tracking-widest text-neutral-400">
              Newsletter
            </h4>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="이메일 주소"
                className="bg-neutral-800 border-none rounded-lg px-4 py-3 text-sm flex-1 focus:ring-2 focus:ring-[var(--bb-blue)] outline-none"
              />
              <button className="bg-[var(--bb-blue)] px-6 py-3 rounded-lg font-bold text-sm">
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
