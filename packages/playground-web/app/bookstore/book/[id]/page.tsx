import { notFound } from 'next/navigation';
import { getBookById } from '@/lib/mock-book-data';
import { DetailHeader } from '@/components/bookstore/detail/DetailHeader';
import { BookCoverSection } from '@/components/bookstore/detail/BookCoverSection';
import { BookInfoSection } from '@/components/bookstore/detail/BookInfoSection';
import { BookSummary } from '@/components/bookstore/detail/BookSummary';
import { TableOfContents } from '@/components/bookstore/detail/TableOfContents';
import { FloatingCTA } from '@/components/bookstore/detail/FloatingCTA';

interface BookDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function BookDetailPage({ params }: BookDetailPageProps) {
  const { id } = await params;
  const book = getBookById(id);

  if (!book) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[var(--atomic-semantic-background-canvas)] pb-32 md:pb-20">
      <DetailHeader />

      <main>
        <BookCoverSection coverColor={book.coverColor} title={book.title} />
        <BookInfoSection
          title={book.title}
          author={book.author}
          price={book.price}
          category={book.category}
          rating={book.rating}
        />
        <BookSummary paragraphs={book.summary} />
        <TableOfContents chapters={book.tableOfContents} />
      </main>

      <FloatingCTA price={book.price} />
    </div>
  );
}
