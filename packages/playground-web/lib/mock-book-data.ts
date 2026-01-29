export interface BookDetail {
  id: string;
  title: string;
  author: string;
  price: string;
  category: string;
  coverColor: string;
  rating: number;
  summary: string[];
  tableOfContents: {
    chapter: number;
    title: string;
  }[];
}

const BOOK_DETAILS: Record<string, BookDetail> = {
  minimalism: {
    id: 'minimalism',
    title: 'The Art of Minimalism',
    author: 'Elena Hartwell',
    price: '$22.99',
    category: 'Design',
    coverColor: 'var(--atomic-color-brand-500)',
    rating: 4.8,
    summary: [
      'In a world overflowing with excess, "The Art of Minimalism" offers a refreshing perspective on living with intention. This comprehensive guide explores how reducing physical and mental clutter can lead to a more fulfilling, purposeful life.',
      "Drawing from philosophy, psychology, and real-world case studies, author Elena Hartwell demonstrates that minimalism is not about deprivation—it's about making room for what truly matters. Whether you're looking to simplify your home, streamline your workflow, or cultivate inner peace, this book provides practical frameworks and actionable insights.",
      'Through beautifully illustrated examples and step-by-step exercises, readers will learn to identify their core values, eliminate distractions, and create spaces that inspire creativity and calm. Perfect for designers, entrepreneurs, and anyone seeking a more intentional approach to modern living.',
    ],
    tableOfContents: [
      { chapter: 1, title: 'The Philosophy of Less' },
      { chapter: 2, title: 'Decluttering Your Physical Space' },
      { chapter: 3, title: 'Minimalism in Design' },
      { chapter: 4, title: 'Digital Minimalism' },
      { chapter: 5, title: 'Mindful Consumption' },
      { chapter: 6, title: 'Creating Intentional Routines' },
      { chapter: 7, title: 'Minimalist Aesthetics' },
      { chapter: 8, title: 'Sustaining a Minimalist Lifestyle' },
    ],
  },
  'clean-code': {
    id: 'clean-code',
    title: 'Clean Code',
    author: 'Robert C. Martin',
    price: '$24.99',
    category: 'Technology',
    coverColor: 'var(--atomic-color-neutral-300)',
    rating: 4.9,
    summary: [
      "Even bad code can function. But if code isn't clean, it can bring a development organization to its knees. Every year, countless hours and significant resources are lost because of poorly written code.",
      'This book is a must for any developer, software engineer, project manager, team lead, or systems analyst with an interest in producing better code. You will learn the difference between good and bad code, and how to write good code and transform bad code into good code.',
    ],
    tableOfContents: [
      { chapter: 1, title: 'Clean Code' },
      { chapter: 2, title: 'Meaningful Names' },
      { chapter: 3, title: 'Functions' },
      { chapter: 4, title: 'Comments' },
      { chapter: 5, title: 'Formatting' },
      { chapter: 6, title: 'Objects and Data Structures' },
      { chapter: 7, title: 'Error Handling' },
      { chapter: 8, title: 'Boundaries' },
    ],
  },
};

export function getBookById(id: string): BookDetail | null {
  return BOOK_DETAILS[id] || null;
}

export function getAllBookIds(): string[] {
  return Object.keys(BOOK_DETAILS);
}
