'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ThemeSelector } from '@/components/ui/ThemeSelector';
import { cn } from '@/lib/utils/cn';

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'Presets', href: '/presets' },
  { name: 'Token Editor', href: '/token-editor' },
  { name: 'Component Preview', href: '/component-preview' },
  { name: 'Export', href: '/export' },
];

export function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <span className="font-bold text-xl">Tekton</span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'transition-colors hover:text-foreground/80',
                  pathname === item.href || pathname.startsWith(item.href + '/')
                    ? 'text-foreground'
                    : 'text-foreground/60'
                )}
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-2">
          <ThemeSelector />
        </div>
      </div>
    </header>
  );
}
