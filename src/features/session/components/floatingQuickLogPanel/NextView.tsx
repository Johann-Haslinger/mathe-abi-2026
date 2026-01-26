import { Flag } from 'lucide-react'

export function NextView(props: {
  onNextSubproblem: () => void
  onNewProblem: () => void
  onMarkPageDone: () => void
  onFinishExercise: () => void
}) {
  return (
    <div className="space-y-3">
      <div className="text-xs font-semibold text-slate-300">Wie geht’s weiter?</div>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={props.onNextSubproblem}
          className="rounded-md bg-slate-800 px-3 py-2 text-xs font-semibold text-slate-50 hover:bg-slate-700"
        >
          Nächste Teilaufgabe
        </button>
        <button
          type="button"
          onClick={props.onNewProblem}
          className="rounded-md bg-slate-800 px-3 py-2 text-xs font-semibold text-slate-50 hover:bg-slate-700"
        >
          Neue Aufgabe
        </button>
        <button
          type="button"
          onClick={props.onMarkPageDone}
          className="rounded-md bg-slate-800 px-3 py-2 text-xs font-semibold text-slate-50 hover:bg-slate-700"
        >
          Seite fertig
        </button>
        <button
          type="button"
          onClick={props.onFinishExercise}
          className="ml-auto inline-flex items-center gap-2 rounded-md bg-emerald-600 px-3 py-2 text-xs font-semibold text-white hover:bg-emerald-500"
        >
          <Flag className="h-4 w-4" />
          Übung fertig
        </button>
      </div>
    </div>
  )
}
