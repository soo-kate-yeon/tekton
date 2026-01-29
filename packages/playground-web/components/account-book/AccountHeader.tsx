const AccountHeader = () => {
  return (
    <header className="flex justify-between items-center px-6 py-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-neutral-900">가계부</h1>
        <p className="text-sm text-neutral-500 mt-1">지속 가능한 소비 습관의 시작</p>
      </div>
      <div className="relative group">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full blur opacity-20 group-hover:opacity-40 transition duration-300"></div>
        <img
          src="https://i.pravatar.cc/150?u=user1"
          alt="User Profile"
          className="relative w-12 h-12 rounded-full border-2 border-white object-cover shadow-sm"
        />
      </div>
    </header>
  );
};
export default AccountHeader;
