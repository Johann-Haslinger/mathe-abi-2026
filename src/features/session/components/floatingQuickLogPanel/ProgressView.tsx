import { Flag, Square, Timer } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useStudyStore } from '../../stores/studyStore';
import { PanelViewHeader, type DragGripProps } from './PanelViewHeader';
import { MutedText } from './TextHighlight';

export function ProgressView(props: {
  gripProps: DragGripProps;
  onFinish: () => void;
  onCancel: () => void;
}) {
  const { attemptStartedAtMs } = useStudyStore();
  const [nowMs, setNowMs] = useState(() => Date.now());

  useEffect(() => {
    if (!attemptStartedAtMs) return;
    const t = window.setInterval(() => setNowMs(Date.now()), 1000);
    return () => window.clearInterval(t);
  }, [attemptStartedAtMs]);

  const seconds = useMemo(() => {
    if (!attemptStartedAtMs) return 0;
    return Math.max(0, Math.floor((nowMs - attemptStartedAtMs) / 1000));
  }, [nowMs, attemptStartedAtMs]);

  return (
    <div className="h-full">
      <PanelViewHeader
        right={
          <div className="text-right text-xs font-semibold">
            <MutedText>Timer </MutedText>
            <span className="tabular-nums text-white/90">{formatDuration(seconds)}</span>
          </div>
        }
        gripProps={props.gripProps}
      />

      <div className="mt-3 flex items-center justify-between gap-2">
        <span className="inline-flex items-center gap-2 rounded-md bg-black/30 px-2 py-1 text-xs text-white/90">
          <Timer className="h-4 w-4 text-white/60" />
          <span className="tabular-nums">{formatDuration(seconds)}</span>
        </span>
      </div>

      <div className="mt-4 flex items-center justify-end gap-2">
        <button
          type="button"
          onClick={props.onCancel}
          className="inline-flex items-center gap-2 rounded-md bg-white/10 px-3 py-2 text-sm font-semibold text-white/80 hover:bg-white/15 hover:text-white"
        >
          <Square className="h-4 w-4" />
          Cancel
        </button>
        <button
          type="button"
          onClick={props.onFinish}
          className="inline-flex items-center gap-2 rounded-md bg-indigo-500 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-400"
        >
          <Flag className="h-4 w-4" />
          Fertig
        </button>
      </div>
    </div>
  );
}

function formatDuration(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}
