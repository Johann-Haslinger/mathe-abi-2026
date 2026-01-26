import { Link } from 'react-router-dom'

export function ErrorPage(props: {
  title?: string
  message: string
  details?: string
  backTo?: string
  backLabel?: string
}) {
  const backTo = props.backTo ?? '/dashboard'
  const backLabel = props.backLabel ?? 'Zurück'

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold text-slate-50">
        {props.title ?? 'Fehler'}
      </h1>
      <div className="rounded-md border border-rose-900/60 bg-rose-950/30 px-3 py-2 text-sm text-rose-200">
        {props.message}
      </div>
      {props.details ? (
        <pre className="overflow-auto rounded-md border border-slate-800 bg-slate-950/60 px-3 py-2 text-xs text-slate-300">
          {props.details}
        </pre>
      ) : null}
      <Link
        to={backTo}
        className="inline-flex rounded-md bg-slate-800 px-3 py-2 text-sm font-semibold text-slate-50 hover:bg-slate-700"
      >
        {backLabel}
      </Link>
    </div>
  )
}

