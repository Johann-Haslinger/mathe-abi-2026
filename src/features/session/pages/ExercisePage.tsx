import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Modal } from '../../../components/Modal'
import type { Asset, AssetFile, Attempt, ExercisePageStatus, Problem, Subproblem } from '../../../domain/models'
import { assetFileStore, assetRepo, attemptRepo, exerciseRepo, problemRepo, subproblemRepo } from '../../../repositories'
import { useActiveSessionStore } from '../../../stores/activeSessionStore'
import { ErrorPage } from '../../common/ErrorPage'
import { NotFoundPage } from '../../common/NotFoundPage'
import { AssetViewer } from '../viewer/AssetViewer'

export function ExercisePage() {
  const { assetId } = useParams()
  const navigate = useNavigate()
  const { active, start, end } = useActiveSessionStore()

  const { asset, file, pdfData, loading, error } = useExerciseAssetData(assetId)
  const [pageNumber, setPageNumber] = useState(1)
  const { exerciseStatus } = useExerciseStatus(asset?.id)

  const [detailsOpen, setDetailsOpen] = useState(false)
  const { detailsLoading, detailsError, problems } = useExerciseDetails(detailsOpen, asset?.id)

  const state = useMemo(() => {
    if (!assetId) return { kind: 'notfound' as const }
    if (loading) return { kind: 'loading' as const }
    if (error) return { kind: 'error' as const, error }
    if (!asset) return { kind: 'notfound' as const }
    if (asset.type !== 'exercise') return { kind: 'notfound' as const }

    if (!active) return { kind: 'noSession' as const, asset }
    if (active.subjectId !== asset.subjectId || active.topicId !== asset.topicId)
      return { kind: 'wrongSession' as const, asset }

    return { kind: 'ready' as const, asset }
  }, [assetId, loading, error, asset, active])

  if (state.kind === 'notfound') return <NotFoundPage />
  if (state.kind === 'loading') return <div className="text-sm text-slate-400">Lade…</div>
  if (state.kind === 'error')
    return <ErrorPage title="Fehler beim Laden" message={state.error} />

  const a = state.asset

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h1 className="truncate text-2xl font-semibold text-slate-50">
            {a.title}
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Übung – starte hier, dann geht’s in den PDF-Study-Mode.
          </p>
        </div>
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="rounded-md bg-slate-800 px-3 py-2 text-sm font-semibold text-slate-50 hover:bg-slate-700"
        >
          Zurück
        </button>
      </div>

      <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-4">
        <div className="text-sm font-semibold text-slate-200">Aktionen</div>
        <div className="mt-3 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => {
              if (state.kind === 'ready') {
                navigate(`/study/${a.id}`)
                return
              }
            }}
            className="rounded-md bg-indigo-500 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-400 disabled:opacity-60"
            disabled={state.kind !== 'ready'}
          >
            Weiter lernen
          </button>

          <button
            type="button"
            onClick={() => {
              if (state.kind === 'noSession') {
                start({ subjectId: a.subjectId, topicId: a.topicId })
                navigate(`/study/${a.id}`)
              }
            }}
            className="rounded-md bg-emerald-600 px-3 py-2 text-sm font-semibold text-white hover:bg-emerald-500 disabled:opacity-60"
            disabled={state.kind !== 'noSession'}
          >
            Session starten
          </button>

          <button
            type="button"
            onClick={() => {
              if (state.kind === 'wrongSession') {
                // show modal below (handled by state)
              }
            }}
            className="rounded-md bg-slate-800 px-3 py-2 text-sm font-semibold text-slate-50 hover:bg-slate-700 disabled:opacity-60"
            disabled={state.kind !== 'wrongSession'}
          >
            Session wechseln
          </button>

          <button
            type="button"
            onClick={() => setDetailsOpen(true)}
            className="ml-auto rounded-md bg-slate-800 px-3 py-2 text-sm font-semibold text-slate-50 hover:bg-slate-700"
            disabled={!asset}
          >
            Details
          </button>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-slate-400">
          <span className="rounded bg-slate-900 px-2 py-0.5">
            Übungsstatus: {exerciseStatus}
          </span>
        </div>
      </div>

      {file ? (
        <AssetViewer
          title={a.title}
          file={file}
          pdfData={pdfData}
          pageNumber={pageNumber}
          onPageNumberChange={setPageNumber}
        />
      ) : (
        <div className="rounded-md border border-rose-900/60 bg-rose-950/30 px-3 py-2 text-sm text-rose-200">
          Datei nicht gefunden (local file missing).
        </div>
      )}

      <Modal
        open={state.kind === 'wrongSession'}
        title="Session wechseln?"
        onClose={() => navigate(-1)}
        footer={
          <>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="rounded-md bg-slate-800 px-3 py-2 text-sm font-semibold text-slate-50 hover:bg-slate-700"
            >
              Abbrechen
            </button>
            <button
              type="button"
              onClick={() => {
                end()
                start({ subjectId: a.subjectId, topicId: a.topicId })
                navigate(`/study/${a.id}`)
              }}
              className="rounded-md bg-indigo-500 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-400"
            >
              Wechseln & starten
            </button>
          </>
        }
      >
        <div className="text-sm text-slate-300">
          Du hast eine aktive Session in einem anderen Thema. Für korrektes
          Tracking solltest du wechseln.
        </div>
      </Modal>

      <Modal
        open={detailsOpen}
        title="Übung – Details"
        onClose={() => setDetailsOpen(false)}
        footer={
          <button
            type="button"
            onClick={() => setDetailsOpen(false)}
            className="rounded-md bg-slate-800 px-3 py-2 text-sm font-semibold text-slate-50 hover:bg-slate-700"
          >
            Schließen
          </button>
        }
      >
        {detailsLoading ? <div className="text-sm text-slate-400">Lade…</div> : null}
        {detailsError ? (
          <div className="rounded-md border border-rose-900/60 bg-rose-950/30 px-3 py-2 text-sm text-rose-200">
            {detailsError}
          </div>
        ) : null}

        {!detailsLoading && !detailsError ? (
          problems.length ? (
            <div className="space-y-3">
              {problems.map((p) => (
                <div key={p.problem.id} className="rounded-lg border border-slate-800 bg-slate-950/40 p-3">
                  <div className="text-sm font-semibold text-slate-100">
                    Aufgabe {p.problem.idx}
                  </div>
                  <div className="mt-2 space-y-2">
                    {p.subproblems.map((sp) => (
                      <div key={sp.subproblem.id} className="rounded-md border border-slate-800 bg-slate-950/30 p-2">
                        <div className="flex items-center justify-between gap-3">
                          <div className="text-sm font-semibold text-slate-100">
                            Teilaufgabe {sp.subproblem.label}
                          </div>
                          <span className="text-xs text-slate-400">
                            Versuche: {sp.attempts.length}
                          </span>
                        </div>
                        {sp.attempts.length ? (
                          <div className="mt-2 space-y-2">
                            {sp.attempts.map((a) => (
                              <div key={a.id} className="rounded-md border border-slate-800 bg-slate-950/50 p-2">
                                <div className="flex items-start justify-between gap-3">
                                  <div className="min-w-0">
                                    <div className="text-xs text-slate-400">
                                      {new Date(a.endedAtMs).toLocaleString()} · {formatDuration(a.seconds)}
                                    </div>
                                    {a.errorType ? (
                                      <div className="mt-1 text-xs text-rose-200">Fehler: {a.errorType}</div>
                                    ) : null}
                                    {a.note ? (
                                      <div className="mt-1 text-xs text-slate-200">Notiz: {a.note}</div>
                                    ) : null}
                                  </div>
                                  <ResultBadge result={a.result} />
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="mt-2 text-sm text-slate-400">Keine Attempts erfasst.</div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-sm text-slate-400">
              Für diese Übung sind noch keine Problems/Subproblems erfasst.
            </div>
          )
        ) : null}
      </Modal>
    </div>
  )
}

function useExerciseStatus(assetId: string | undefined) {
  const [exerciseStatus, setExerciseStatus] = useState<ExercisePageStatus>('unknown')

  useEffect(() => {
    let cancelled = false
    async function run() {
      if (!assetId) return
      const ex = await exerciseRepo.getByAsset(assetId)
      if (cancelled) return
      setExerciseStatus(ex?.status ?? 'unknown')
    }
    void run()
    return () => {
      cancelled = true
    }
  }, [assetId])

  return { exerciseStatus }
}

type PageDetails = {
  detailsLoading: boolean
  detailsError: string | null
  problems: Array<{
    problem: Problem
    subproblems: Array<{ subproblem: Subproblem; attempts: Attempt[] }>
  }>
}

function useExerciseDetails(open: boolean, assetId: string | undefined): PageDetails {
  const [detailsLoading, setDetailsLoading] = useState(false)
  const [detailsError, setDetailsError] = useState<string | null>(null)
  const [problems, setProblems] = useState<PageDetails['problems']>([])

  useEffect(() => {
    let cancelled = false
    async function run() {
      if (!open) return
      if (!assetId) return
      setDetailsLoading(true)
      setDetailsError(null)
      try {
        const exercise = await exerciseRepo.getByAsset(assetId)
        if (!exercise) {
          if (!cancelled) setProblems([])
          return
        }
        const probs = await problemRepo.listByExercise(exercise.id)
        const subs = await subproblemRepo.listByProblemIds(probs.map((p) => p.id))
        const attempts = await attemptRepo.listBySubproblemIds(subs.map((s) => s.id))

        const attemptsBySub = new Map<string, Attempt[]>()
        for (const a of attempts) {
          const arr = attemptsBySub.get(a.subproblemId) ?? []
          arr.push(a)
          attemptsBySub.set(a.subproblemId, arr)
        }
        for (const [k, arr] of attemptsBySub.entries()) {
          arr.sort((a, b) => b.endedAtMs - a.endedAtMs)
          attemptsBySub.set(k, arr)
        }

        const subsByProblem = new Map<string, Subproblem[]>()
        for (const s of subs) {
          const arr = subsByProblem.get(s.problemId) ?? []
          arr.push(s)
          subsByProblem.set(s.problemId, arr)
        }
        for (const [k, arr] of subsByProblem.entries()) {
          arr.sort((a, b) => a.label.localeCompare(b.label))
          subsByProblem.set(k, arr)
        }

        const grouped = probs
          .slice()
          .sort((a, b) => a.idx - b.idx)
          .map((p) => ({
            problem: p,
            subproblems: (subsByProblem.get(p.id) ?? []).map((sp) => ({
              subproblem: sp,
              attempts: attemptsBySub.get(sp.id) ?? [],
            })),
          }))
        if (!cancelled) setProblems(grouped)
      } catch (e) {
        if (!cancelled) setDetailsError(e instanceof Error ? e.message : 'Fehler')
      } finally {
        if (!cancelled) setDetailsLoading(false)
      }
    }
    void run()
    return () => {
      cancelled = true
    }
  }, [open, assetId])

  return { detailsLoading, detailsError, problems }
}

function ResultBadge(props: { result: Attempt['result'] }) {
  const label = props.result === 'correct' ? '✅' : props.result === 'partial' ? '🟨' : '❌'
  const cls =
    props.result === 'correct'
      ? 'bg-emerald-950/40 text-emerald-200 border-emerald-900/50'
      : props.result === 'partial'
        ? 'bg-amber-950/40 text-amber-200 border-amber-900/50'
        : 'bg-rose-950/40 text-rose-200 border-rose-900/50'
  return (
    <span className={`inline-flex items-center rounded-md border px-2 py-1 text-sm ${cls}`}>
      {label}
    </span>
  )
}

function formatDuration(seconds: number) {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${String(s).padStart(2, '0')}`
}

function useExerciseAssetData(assetId: string | undefined) {
  const [asset, setAsset] = useState<Asset | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [file, setFile] = useState<AssetFile | null>(null)
  const [pdfData, setPdfData] = useState<Uint8Array | null>(null)

  useEffect(() => {
    let cancelled = false
    async function run() {
      if (!assetId) return
      setLoading(true)
      setError(null)
      try {
        const a = await assetRepo.get(assetId)
        if (!cancelled) setAsset(a ?? null)

        if (a) {
          const f = await assetFileStore.get(a.id)
          if (!cancelled && f) {
            setFile(f)
            const isPdf =
              f.mimeType === 'application/pdf' ||
              f.originalName.toLowerCase().endsWith('.pdf')
            if (isPdf) {
              const buf = await f.blob.arrayBuffer()
              setPdfData(new Uint8Array(buf).slice(0))
            } else {
              setPdfData(null)
            }
          } else if (!cancelled) {
            setFile(null)
            setPdfData(null)
          }
        } else if (!cancelled) {
          setFile(null)
          setPdfData(null)
        }
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Fehler')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    void run()
    return () => {
      cancelled = true
    }
  }, [assetId])

  return { asset, file, pdfData, loading, error }
}

