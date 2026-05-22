import { useEffect, useMemo, useState } from 'react';
import { CalendarClock, CheckCircle2, Flag, Hash, Plus, WandSparkles } from 'lucide-react';
import { quickAddExample } from '../../data/marketingTasks.js';

const TYPE_SPEED = 42;
const HOLD_MS = 1800;

function QuickAddPreview() {
  const [typedText, setTypedText] = useState('');
  const [captured, setCaptured] = useState(false);
  const sourceText = quickAddExample.naturalLanguage;

  useEffect(() => {
    let timeoutId;

    if (typedText.length < sourceText.length) {
      timeoutId = window.setTimeout(() => {
        setTypedText(sourceText.slice(0, typedText.length + 1));
      }, TYPE_SPEED);
    } else if (!captured) {
      timeoutId = window.setTimeout(() => setCaptured(true), 420);
    } else {
      timeoutId = window.setTimeout(() => {
        setCaptured(false);
        setTypedText('');
      }, HOLD_MS);
    }

    return () => window.clearTimeout(timeoutId);
  }, [captured, sourceText, typedText]);

  const parsedChips = useMemo(() => [
    { icon: CalendarClock, label: quickAddExample.dueLabel, tone: 'text-blue-700 bg-blue-50 border-blue-100' },
    { icon: Hash, label: quickAddExample.project, tone: 'text-violet-700 bg-violet-50 border-violet-100' },
    { icon: Flag, label: quickAddExample.priority, tone: 'text-red-700 bg-red-50 border-red-100' }
  ], []);

  return (
    <section
      className="mx-auto mt-12 w-full max-w-4xl px-4 sm:px-6 lg:px-8"
      id="quick-add-preview"
    >
      <div className="rounded-lg border border-slate-200 bg-white shadow-soft">
        <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3 sm:px-5">
          <div className="flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-md bg-slate-100 text-slate-700">
              <WandSparkles size={17} />
            </span>
            <div>
              <p className="text-sm font-semibold text-ink">Quick Add</p>
              <p className="text-xs text-slate-500">Natural language capture</p>
            </div>
          </div>
          <span className="rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
            Live preview
          </span>
        </div>

        <div className="grid gap-0 md:grid-cols-[1fr_0.9fr]">
          <div className="border-b border-slate-200 p-4 sm:p-5 md:border-b-0 md:border-r">
            <div className="flex min-h-14 items-center gap-3 rounded-md border border-slate-200 bg-slate-50 px-3 py-3">
              <Plus className="shrink-0 text-accent" size={20} />
              <span className="min-w-0 flex-1 text-sm font-medium text-ink sm:text-base">
                {typedText}
                <span className="ml-0.5 inline-block h-5 w-0.5 translate-y-1 bg-accent" />
              </span>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {parsedChips.map((chip) => {
                const Icon = chip.icon;

                return (
                  <span
                    className={[
                      'inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold transition',
                      typedText.length > sourceText.indexOf(chip.label.split(',')[0])
                        ? chip.tone
                        : 'border-slate-200 bg-white text-slate-400'
                    ].join(' ')}
                    key={chip.label}
                  >
                    <Icon size={13} />
                    {chip.label}
                  </span>
                );
              })}
            </div>

            <p className="mt-5 text-sm leading-6 text-slate-600">
              Capture the messy thought once. ProjectNest turns the date, project, and priority into
              structured task data before your team loses context.
            </p>
          </div>

          <div className="bg-panel p-4 sm:p-5">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm font-semibold text-ink">Inbox</p>
              <span className="text-xs font-medium text-slate-500">4 tasks</span>
            </div>

            <div className="space-y-3">
              <div
                className={[
                  'rounded-md border bg-white p-3 transition duration-500',
                  captured
                    ? 'translate-y-0 border-accent opacity-100 shadow-sm'
                    : '-translate-y-2 border-slate-200 opacity-40'
                ].join(' ')}
              >
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 text-accent" size={18} />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-ink">{quickAddExample.title}</p>
                    <div className="mt-2 flex flex-wrap gap-2 text-xs">
                      <span className="rounded-full bg-blue-50 px-2 py-1 font-medium text-blue-700">
                        {quickAddExample.dueLabel}
                      </span>
                      <span className="rounded-full bg-violet-50 px-2 py-1 font-medium text-violet-700">
                        #{quickAddExample.project}
                      </span>
                      <span className="rounded-full bg-red-50 px-2 py-1 font-medium text-red-700">
                        {quickAddExample.priority}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {['Draft workspace handoff', 'Review team billing notes', 'Plan Sprint2 kickoff'].map((title) => (
                <div className="rounded-md border border-slate-200 bg-white p-3" key={title}>
                  <div className="flex items-center gap-3">
                    <span className="h-4 w-4 rounded-full border border-slate-300" />
                    <p className="text-sm font-medium text-slate-700">{title}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default QuickAddPreview;
