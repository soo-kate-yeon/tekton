export default function FitnessFooter() {
  return (
    <footer className="py-12 px-6 border-t border-white/5 bg-neutral-950 text-neutral-500 text-xs">
      <div className="grid grid-cols-2 gap-8 mb-12">
        <div className="flex flex-col gap-4">
          <span className="uppercase tracking-[0.15em] text-white">Company</span>
          <a href="#" className="hover:text-cyan-500 transition-colors">
            About
          </a>
          <a href="#" className="hover:text-cyan-500 transition-colors">
            Careers
          </a>
          <a href="#" className="hover:text-cyan-500 transition-colors">
            Press
          </a>
        </div>
        <div className="flex flex-col gap-4">
          <span className="uppercase tracking-[0.15em] text-white">Legal</span>
          <a href="#" className="hover:text-cyan-500 transition-colors">
            Privacy
          </a>
          <a href="#" className="hover:text-cyan-500 transition-colors">
            Terms
          </a>
          <a href="#" className="hover:text-cyan-500 transition-colors">
            Cookies
          </a>
        </div>
      </div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="uppercase tracking-[0.2em] font-medium text-white">Equinox</div>
        <div className="opacity-50">© 2026 Equinox Holdings, Inc.</div>
      </div>
    </footer>
  );
}
