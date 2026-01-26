export function NextView(props: {
  onNextSubproblem: () => void
  onNewProblem: () => void
  onMarkPageDone: () => void
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
      </div>
    </div>
  )
}
