import { Link } from 'react-router-dom';
import { CheckSquare, Menu } from 'lucide-react';

function MarketingNavbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link className="flex items-center gap-2 text-lg font-semibold text-ink" to="/">
          <span className="grid h-8 w-8 place-items-center rounded-md bg-accent text-white">
            <CheckSquare size={18} strokeWidth={2.4} />
          </span>
          ProjectNest
        </Link>

        <div className="hidden items-center gap-7 text-sm font-medium text-slate-600 md:flex">
          <a className="transition hover:text-ink" href="#quick-add-preview">Product</a>
          <a className="transition hover:text-ink" href="#view-data">Views</a>
          <a className="transition hover:text-ink" href="#pricing">Pricing</a>
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <Link className="text-sm font-semibold text-slate-700 transition hover:text-ink" to="/login">
            Log in
          </Link>
          <Link
            className="rounded-md bg-ink px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700"
            to="/register"
          >
            Start for free
          </Link>
        </div>

        <button
          aria-label="Open navigation"
          className="grid h-10 w-10 place-items-center rounded-md border border-slate-200 text-slate-700 md:hidden"
          type="button"
        >
          <Menu size={20} />
        </button>
      </nav>
    </header>
  );
}

export default MarketingNavbar;
