import AccountHeader from '@/components/account-book/AccountHeader';
import SummaryCard from '@/components/account-book/SummaryCard';
import TransactionList from '@/components/account-book/TransactionList';
import BottomNav from '@/components/account-book/BottomNav';

export default function AccountBookPage() {
  return (
    <main className="min-h-screen bg-[--lm-background-canvas] text-[--lm-text-primary] font-[--lm-font-family-sans] selection:bg-[--lm-brand-subtle] selection:text-[--lm-brand-emphasis] overflow-x-hidden">
      {/* Mobile-focused container */}
      <div className="mx-auto max-w-md bg-[--lm-background-surface] min-h-screen shadow-[--lm-elevation-card-hover] border-x border-[--lm-border-subtle] relative">
        {/* Decorative background glow using brand color */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-64 bg-[--lm-brand-default]/5 blur-[100px] pointer-events-none"></div>

        <AccountHeader />

        <div className="relative z-10">
          <SummaryCard />
          <TransactionList />
        </div>

        <BottomNav />
      </div>
    </main>
  );
}
