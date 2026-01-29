import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '동네핫플 - 우리 동네 핫플레이스',
  description: '내 주변 인기 카페, 맛집, 핫플레이스를 발견하세요',
};

export default function HotPlacesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
