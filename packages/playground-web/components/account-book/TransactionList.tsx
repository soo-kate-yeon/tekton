const transactions = [
  {
    id: 1,
    category: '식비',
    title: '점심 식사',
    amount: '₩12,000',
    method: '현대카드',
    icon: '🍱',
    color: 'bg-[--lm-brand-subtle] text-[--lm-brand-emphasis]',
  },
  {
    id: 2,
    category: '교통',
    title: '시내버스',
    amount: '₩1,250',
    method: 'KB계좌',
    icon: '🚌',
    color: 'bg-[--lm-background-emphasis] text-[--lm-text-secondary]',
  },
  {
    id: 3,
    category: '주거',
    title: '수도광열비',
    amount: '₩85,000',
    method: '신한카드',
    icon: '🏠',
    color: 'bg-[--lm-brand-subtle] text-[--lm-brand-emphasis]',
  },
];
const TransactionList = () => {
  return (
    <div className="px-6 pb-32">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-[--lm-font-weight-bold] text-[--lm-text-primary]">
          최신 지출 내역
        </h3>
        <button className="text-xs font-[--lm-font-weight-semibold] text-[--lm-brand-emphasis] hover:opacity-80 transition-opacity">
          전체보기
        </button>
      </div>
      <div className="space-y-4">
        {transactions.map((tx) => (
          <div
            key={tx.id}
            className="group flex items-center justify-between p-[--lm-spacing-4] rounded-[--lm-radius-xl] bg-[--lm-background-surface] border border-[--lm-border-subtle] hover:border-[--lm-brand-subtle] transition-all duration-[--lm-motion-duration-moderate]"
          >
            <div className="flex items-center gap-4">
              <div
                className={`w-12 h-12 flex items-center justify-center rounded-[--lm-radius-md] text-xl ${tx.color} border border-[--lm-border-subtle] shadow-sm`}
              >
                {tx.icon}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.5 rounded-[--lm-radius-xs] ${tx.color} border border-current/10`}
                  >
                    {tx.category}
                  </span>
                  <p className="text-sm font-[--lm-font-weight-semibold] text-[--lm-text-primary]">
                    {tx.title}
                  </p>
                </div>
                <p className="text-[11px] text-[--lm-text-tertiary] mt-0.5">{tx.method}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-bold text-[--lm-text-primary] tracking-tight">
                {tx.amount}
              </p>
              <p className="text-[10px] text-[--lm-text-tertiary] mt-0.5">18:32</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default TransactionList;
