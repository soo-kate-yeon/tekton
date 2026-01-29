'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

// 핫플레이스 데이터 타입
interface HotPlace {
  id: number;
  title: string;
  description: string;
  category: string;
  location: string;
  imageUrl: string;
  likes: number;
  isLiked: boolean;
}

// 더미 데이터 생성 함수
function generatePlaces(startId: number, count: number): HotPlace[] {
  const categories = ['카페', '맛집', '술집', '베이커리', '디저트', '브런치', '펍'];
  const locations = ['성수동', '연남동', '을지로', '망원동', '익선동', '한남동', '연희동'];
  const adjectives = ['숨겨진', '핫한', '감성적인', '빈티지한', '모던한', '아늑한', '트렌디한'];
  const nouns = ['공간', '명소', '스팟', '플레이스', '장소', '아지트', '성지'];

  return Array.from({ length: count }, (_, i) => {
    const id = startId + i;
    const category = categories[id % categories.length] ?? '카페';
    const location = locations[id % locations.length] ?? '성수동';
    const adj = adjectives[id % adjectives.length] ?? '숨겨진';
    const noun = nouns[id % nouns.length] ?? '공간';

    return {
      id,
      title: `${location}의 ${adj} ${noun}`,
      description: `${location}에서 발견한 ${adj} ${category}입니다. 특별한 분위기와 함께 잊지 못할 경험을 선사합니다. 주말에는 웨이팅이 있을 수 있어요.`,
      category,
      location,
      imageUrl: `https://picsum.photos/seed/${id}/800/600`,
      likes: Math.floor(Math.random() * 500) + 50,
      isLiked: false,
    };
  });
}

export default function HotPlacesPage() {
  const [places, setPlaces] = useState<HotPlace[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  // 초기 데이터 로드
  useEffect(() => {
    setPlaces(generatePlaces(0, 5));
    setPage(1);
  }, []);

  // 추가 데이터 로드
  const loadMore = useCallback(() => {
    if (isLoading || !hasMore) {
      return;
    }

    setIsLoading(true);

    // 네트워크 지연 시뮬레이션
    setTimeout(() => {
      const newPlaces = generatePlaces(page * 5, 5);
      setPlaces((prev) => [...prev, ...newPlaces]);
      setPage((prev) => prev + 1);
      setIsLoading(false);

      // 50개 이후로는 더 이상 로드하지 않음 (데모용)
      if (page >= 9) {
        setHasMore(false);
      }
    }, 800);
  }, [isLoading, hasMore, page]);

  // Intersection Observer 설정
  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        const firstEntry = entries[0];
        if (firstEntry?.isIntersecting) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );

    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [loadMore]);

  // 좋아요 토글
  const toggleLike = (id: number) => {
    setPlaces((prev) =>
      prev.map((place) =>
        place.id === id
          ? {
              ...place,
              isLiked: !place.isLiked,
              likes: place.isLiked ? place.likes - 1 : place.likes + 1,
            }
          : place
      )
    );
  };

  return (
    <div className="min-h-screen bg-[--atomic-semantic-background-canvas]">
      {/* Sticky Header */}
      <header className="sticky top-0 z-50 bg-[--atomic-semantic-background-surface-default]/95 backdrop-blur-sm border-b border-[--atomic-semantic-border-default-subtle]">
        <div className="max-w-lg mx-auto px-4 h-14 flex items-center justify-between">
          <h1 className="font-display font-bold text-xl text-[--atomic-color-brand-500]">
            동네핫플
          </h1>
          <div className="flex items-center gap-2">
            <button
              className="p-2 rounded-full hover:bg-[--atomic-semantic-background-surface-emphasis] transition-colors"
              aria-label="검색"
            >
              <svg
                className="w-5 h-5 text-[--atomic-color-neutral-700]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>
            <button
              className="p-2 rounded-full hover:bg-[--atomic-semantic-background-surface-emphasis] transition-colors"
              aria-label="필터"
            >
              <svg
                className="w-5 h-5 text-[--atomic-color-neutral-700]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Category Tabs */}
      <div className="sticky top-14 z-40 bg-[--atomic-semantic-background-surface-default] border-b border-[--atomic-semantic-border-default-subtle]">
        <div className="max-w-lg mx-auto px-4 overflow-x-auto scrollbar-hide">
          <div className="flex gap-2 py-3">
            {['전체', '카페', '맛집', '술집', '베이커리', '디저트', '브런치'].map(
              (category, idx) => (
                <button
                  key={category}
                  className={`px-4 py-1.5 rounded-full text-sm font-sans font-medium whitespace-nowrap transition-colors ${
                    idx === 0
                      ? 'bg-[--atomic-color-brand-500] text-white'
                      : 'bg-[--atomic-semantic-background-surface-emphasis] text-[--atomic-color-neutral-700] hover:bg-[--atomic-color-neutral-200]'
                  }`}
                >
                  {category}
                </button>
              )
            )}
          </div>
        </div>
      </div>

      {/* Feed */}
      <main className="max-w-lg mx-auto px-4 py-4 pb-24">
        <div className="space-y-5">
          {places.map((place) => (
            <article
              key={place.id}
              className="bg-[--atomic-semantic-background-surface-default] rounded-xl overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.08)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.1)] transition-shadow"
            >
              {/* Image */}
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={place.imageUrl}
                  alt={place.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                {/* Category Badge */}
                <span className="absolute top-3 left-3 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-sans font-semibold text-[--atomic-color-brand-500]">
                  {place.category}
                </span>
              </div>

              {/* Content */}
              <div className="p-4">
                <h2 className="font-display font-bold text-xl text-[--atomic-color-neutral-900] leading-tight">
                  {place.title}
                </h2>
                <p className="mt-2 font-sans text-sm text-[--atomic-color-neutral-600] leading-relaxed line-clamp-2">
                  {place.description}
                </p>

                {/* Meta */}
                <div className="mt-3 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-[--atomic-color-neutral-500]">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    <span className="text-xs font-sans">{place.location}</span>
                  </div>

                  <button
                    onClick={() => toggleLike(place.id)}
                    className="flex items-center gap-1.5 group"
                    aria-label={place.isLiked ? '좋아요 취소' : '좋아요'}
                  >
                    <svg
                      className={`w-5 h-5 transition-colors ${
                        place.isLiked
                          ? 'fill-[--atomic-color-brand-500] text-[--atomic-color-brand-500]'
                          : 'text-[--atomic-color-neutral-400] group-hover:text-[--atomic-color-brand-500]'
                      }`}
                      fill={place.isLiked ? 'currentColor' : 'none'}
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                      />
                    </svg>
                    <span
                      className={`text-xs font-sans font-medium ${
                        place.isLiked
                          ? 'text-[--atomic-color-brand-500]'
                          : 'text-[--atomic-color-neutral-500]'
                      }`}
                    >
                      {place.likes}
                    </span>
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Load More Trigger */}
        <div ref={loadMoreRef} className="py-8 flex justify-center">
          {isLoading && (
            <div className="flex items-center gap-2 text-[--atomic-color-neutral-500]">
              <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              <span className="text-sm font-sans">더 많은 핫플 불러오는 중...</span>
            </div>
          )}
          {!hasMore && (
            <p className="text-sm font-sans text-[--atomic-color-neutral-400]">
              모든 핫플레이스를 확인했어요! 🎉
            </p>
          )}
        </div>
      </main>

      {/* Floating Action Button */}
      <button
        className="fixed bottom-6 right-6 w-14 h-14 bg-[--atomic-color-brand-500] text-white rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all flex items-center justify-center"
        aria-label="새 핫플레이스 추가"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      </button>
    </div>
  );
}
