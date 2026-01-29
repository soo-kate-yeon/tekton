const SummaryCard = () => {
  return (
    <div className="px-6 mb-8">
      <div className="relative overflow-hidden rounded-3xl bg-white border border-neutral-100 p-6 shadow-xl shadow-neutral-200/50">
        <div className="absolute top-0 right-0 p-4 opacity-5">
          <svg
            width="120"
            height="120"
            viewBox="0 0 120 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M10 90 Q 30 70, 50 85 T 90 40"
              stroke="black"
              strokeWidth="4"
              strokeLinecap="round"
            />
          </svg>
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-medium text-neutral-500 uppercase tracking-wider">
              지난달 대비
            </span>
            <span className="flex items-center px-2 py-0.5 rounded-full bg-red-50 text-red-600 text-[10px] font-bold border border-red-100">
              +12.5%
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold text-neutral-900 tracking-tighter">₩1,250,000</span>
          </div>
          <div className="mt-6">
            <div className="flex justify-between items-end mb-2">
              <span className="text-xs text-neutral-400 font-medium">지출 트렌드 (최근 30일)</span>
              <span className="text-xs text-neutral-600 font-semibold">65%</span>
            </div>
            <div className="h-2 w-full bg-neutral-100 rounded-full overflow-hidden border border-neutral-50">
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full"
                style={{ width: '65%' }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default SummaryCard;
