import { ArrowRight, PlayCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import MarketingNavbar from '../components/marketing/MarketingNavbar.jsx';
import QuickAddPreview from '../components/marketing/QuickAddPreview.jsx';
import { marketingTasks, viewModes } from '../data/marketingTasks.js';

function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-ink">
      <MarketingNavbar />

      <main>
        <section className="relative overflow-hidden border-b border-slate-200">
          <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-6xl flex-col items-center px-4 pb-12 pt-16 text-center sm:px-6 sm:pt-20 lg:px-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-sm font-semibold text-slate-600 shadow-sm">
              Built for solo focus and shared workspaces
            </div>

            <h1 className="mt-8 max-w-4xl text-balance text-4xl font-bold leading-tight tracking-normal text-ink sm:text-5xl lg:text-6xl">
              Organize every task the moment it crosses your mind.
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
              ProjectNest helps you capture work fast, route it into the right project, and track
              progress across personal lists and secure team workspaces.
            </p>

            <div className="mt-8 flex w-full flex-col justify-center gap-3 sm:w-auto sm:flex-row">
              <Link
                className="inline-flex items-center justify-center gap-2 rounded-md bg-ink px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
                to="/register"
              >
                Start for Free
                <ArrowRight size={17} />
              </Link>
              <a
                className="inline-flex items-center justify-center gap-2 rounded-md border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-accent hover:text-accent"
                href="#quick-add-preview"
              >
                <PlayCircle size={17} />
                See it in action
              </a>
            </div>

            <QuickAddPreview />

            <div className="mt-6 flex flex-wrap items-center justify-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
              <span>{marketingTasks.length} reusable dummy tasks</span>
              <span className="h-1 w-1 rounded-full bg-slate-300" />
              <span>{viewModes.join(' / ')} data ready</span>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default LandingPage;
