import {
  Eraser,
  Highlighter,
  Minimize2,
  Paintbrush,
  PenTool,
  Pencil,
  Redo2,
  Undo2,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { useInkActions } from '../../../../ink/actions';
import { useInkStore } from '../../../../ink/inkStore';
import type { InkBrush } from '../../../../ink/types';

function isProbablyIpad() {
  const ua = navigator.userAgent || '';
  const platform = (navigator.platform || '').toLowerCase();
  const maxTouch = navigator.maxTouchPoints || 0;
  return /ipad/i.test(ua) || (platform.includes('mac') && maxTouch > 1);
}

const COLORS = ['#111827', '#2563eb', '#dc2626', '#16a34a', '#7c3aed', '#f59e0b'] as const;

export function InkToolbar(props: { activeAttemptId: string | null }) {
  const [open, setOpen] = useState(false);
  const brush = useInkStore((s) => s.brush);
  const setBrush = useInkStore((s) => s.setBrush);
  const color = useInkStore((s) => s.color);
  const setColor = useInkStore((s) => s.setColor);
  const undoStackLen = useInkStore((s) => s.undoStack.length);
  const redoStackLen = useInkStore((s) => s.redoStack.length);

  const { undoWithPersist, redoWithPersist } = useInkActions();

  const toolButtons = useMemo(
    () =>
      [
        { id: 'pencil', label: 'Pencil', icon: <Pencil className="h-5 w-5" /> },
        { id: 'pen', label: 'Pen', icon: <PenTool className="h-5 w-5" /> },
        { id: 'marker', label: 'Marker', icon: <Highlighter className="h-5 w-5" /> },
        { id: 'eraser', label: 'Eraser', icon: <Eraser className="h-5 w-5" /> },
      ] as const satisfies Array<{ id: InkBrush; label: string; icon: React.ReactNode }>,
    [],
  );

  if (!isProbablyIpad()) return null;
  if (!props.activeAttemptId) return null;

  if (!open) {
    return (
      <div className="absolute bottom-4 left-4 z-50 pointer-events-auto">
        <button
          type="button"
          aria-label="Stift öffnen"
          onClick={() => setOpen(true)}
          className="h-12 w-12 rounded-2xl border border-white/10 bg-slate-950/70 text-slate-100 shadow-xl backdrop-blur hover:bg-slate-950/80 active:scale-[0.98]"
        >
          <Paintbrush className="mx-auto h-5 w-5" />
        </button>
      </div>
    );
  }

  return (
    <div className="absolute bottom-4 left-4 z-50 pointer-events-auto">
      <div className="w-[min(320px,calc(100vw-32px))] rounded-3xl border border-white/10 bg-slate-950/70 p-3 text-slate-100 shadow-xl backdrop-blur">
        <div className="flex items-center justify-between">
          <div className="text-sm font-semibold">Stift</div>
          <button
            type="button"
            aria-label="Minimieren"
            onClick={() => setOpen(false)}
            className="rounded-xl border border-white/10 bg-white/5 p-2 hover:bg-white/10"
          >
            <Minimize2 className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-3 grid grid-cols-4 gap-2">
          {toolButtons.map((t) => (
            <button
              key={t.id}
              type="button"
              aria-label={t.label}
              onClick={() => setBrush(t.id)}
              className={`flex h-11 items-center justify-center rounded-2xl border text-slate-100 ${
                brush === t.id
                  ? 'border-white/50 bg-white/10'
                  : 'border-white/10 bg-white/5 hover:bg-white/10'
              }`}
            >
              {t.icon}
            </button>
          ))}
        </div>

        <div className="mt-3 flex items-center gap-2">
          {COLORS.map((c) => (
            <button
              key={c}
              type="button"
              aria-label={`Farbe ${c}`}
              onClick={() => setColor(c)}
              className={`h-8 w-8 rounded-xl border ${
                color === c ? 'border-white/60' : 'border-white/10'
              }`}
              style={{ background: c }}
            />
          ))}
        </div>

        <div className="mt-3 flex items-center justify-between gap-2">
          <button
            type="button"
            aria-label="Undo"
            disabled={undoStackLen === 0}
            onClick={() => void undoWithPersist()}
            className="flex flex-1 items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 py-2 text-sm font-semibold disabled:opacity-40"
          >
            <Undo2 className="h-4 w-4" />
            Undo
          </button>
          <button
            type="button"
            aria-label="Redo"
            disabled={redoStackLen === 0}
            onClick={() => void redoWithPersist()}
            className="flex flex-1 items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 py-2 text-sm font-semibold disabled:opacity-40"
          >
            <Redo2 className="h-4 w-4" />
            Redo
          </button>
        </div>
      </div>
    </div>
  );
}
