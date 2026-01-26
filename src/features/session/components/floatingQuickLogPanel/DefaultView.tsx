import { Flag, Play, Square, Timer, X } from 'lucide-react'
import type { ExercisePageStatus } from '../../../../domain/models'

export function DefaultView(props: {
  pageNumber: number
  exerciseStatus: ExercisePageStatus
  problemIdx: number
  subproblemLabel: string
  seconds: number
  attemptStartedAtMs: number | null
  onProblemIdxChange: (idx: number) => void
  onSubproblemLabelChange: (label: string) => void
  onStartAttempt: () => void
  onStopAttempt: () => void
  onOpenReview: () => void
}) {
  return (
    <>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-xs font-semibold text-slate-300">Quick Log</div>
          <div className="mt-0.5 flex flex-wrap items-center gap-2 text-xs text-slate-400">
            <span className="rounded bg-slate-900 px-2 py-0.5">
              Seite: {props.pageNumber}
            </span>
            <span className="rounded bg-slate-900 px-2 py-0.5">
              Übung: {props.exerciseStatus}
            </span>
          </div>
        </div>
        {props.attemptStartedAtMs ? (
          <button
            type="button"
            onClick={props.onStopAttempt}
            className="rounded-md p-2 text-slate-300 hover:bg-slate-900 hover:text-slate-50"
            aria-label="Timer stoppen"
            title="Timer stoppen"
          >
            <X className="h-4 w-4" />
          </button>
        ) : null}
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2">
        <label className="block">
          <div className="text-xs font-semibold text-slate-300">Aufgabe</div>
          <input
            inputMode="numeric"
            value={String(props.problemIdx)}
            onChange={(e) => {
              const n = Number(e.target.value)
              if (Number.isFinite(n) && n > 0) props.onProblemIdxChange(n)
            }}
            className="mt-1 w-full rounded-md border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-slate-50 outline-none ring-indigo-500/30 focus:ring-2"
          />
        </label>

        <label className="block">
          <div className="text-xs font-semibold text-slate-300">Teilaufgabe</div>
          <input
            value={props.subproblemLabel}
            onChange={(e) => props.onSubproblemLabelChange(e.target.value)}
            className="mt-1 w-full rounded-md border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-slate-50 outline-none ring-indigo-500/30 focus:ring-2"
          />
        </label>
      </div>

      <div className="mt-3 flex items-center justify-between gap-2">
        <span className="inline-flex items-center gap-2 rounded bg-slate-900 px-2 py-1 text-sm text-slate-200">
          <Timer className="h-4 w-4 text-slate-300" />
          {formatDuration(props.seconds)}
        </span>

        {!props.attemptStartedAtMs ? (
          <button
            type="button"
            onClick={props.onStartAttempt}
            className="inline-flex items-center gap-2 rounded-md bg-emerald-600 px-3 py-2 text-sm font-semibold text-white hover:bg-emerald-500"
          >
            <Play className="h-4 w-4" />
            Start
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={props.onOpenReview}
              className="inline-flex items-center gap-2 rounded-md bg-indigo-500 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-400"
            >
              <Flag className="h-4 w-4" />
              Aufgabe fertig
            </button>
            <button
              type="button"
              onClick={props.onStopAttempt}
              className="inline-flex items-center gap-2 rounded-md bg-slate-800 px-3 py-2 text-sm font-semibold text-slate-50 hover:bg-slate-700"
            >
              <Square className="h-4 w-4" />
              Stop
            </button>
          </div>
        )}
      </div>
    </>
  )
}

function formatDuration(seconds: number) {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${String(s).padStart(2, '0')}`
}
