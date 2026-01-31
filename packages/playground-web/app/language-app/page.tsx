'use client';

import AppBar from './components/AppBar';
import ExamCard from './components/ExamCard';
import ScoreList from './components/ScoreList';

export default function LanguageAppPage() {
  return (
    <div className="pb-[80px]">
      {' '}
      {/* Bottom padding for AppBar */}
      <main className="p-[var(--rm-spacing-6)] flex flex-col gap-[var(--rm-spacing-8)]">
        {/* Header / Greeting */}
        <header className="pt-[var(--rm-spacing-4)]">
          <h1 className="text-[24px] font-bold text-[var(--rm-color-neutral-900)] mb-[var(--rm-spacing-1)]">
            오늘의 학습
          </h1>
          <p className="text-[var(--rm-color-neutral-500)] text-sm">
            매일 조금씩 성장하는 나를 만나보세요
          </p>
        </header>

        {/* Hero Card: Today's Exam */}
        <section>
          <ExamCard
            title="실전 모의고사 15회"
            subtitle="수능 영어 영역 (독해)"
            tag="Today"
            duration="45분"
            questionCount={28}
          />
        </section>

        {/* List Section: Past Scores */}
        <section>
          <div className="flex items-center justify-between mb-[var(--rm-spacing-4)]">
            <h2 className="text-[18px] font-semibold text-[var(--rm-color-neutral-900)]">
              지난 학습 기록
            </h2>
            <button className="text-sm text-[var(--rm-color-brand-600)] font-medium">
              모두 보기
            </button>
          </div>
          <ScoreList />
        </section>
      </main>
      <AppBar />
    </div>
  );
}
