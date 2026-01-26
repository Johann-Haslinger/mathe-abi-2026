import { useEffect, useMemo, useState } from 'react'
import { Modal } from '../../../components/Modal'
import type { Attempt, StudySession } from '../../../domain/models'
import { assetRepo, attemptRepo, studySessionRepo } from '../../../repositories'

export type SessionSummaryState = {
  studySessionId?: string
  subjectId: string
  topicId: string
  startedAtMs: number
  endedAtMs: number
}

export function SessionSummaryModal(props: {
  open: boolean
  onClose: () => void
  summary: SessionSummaryState | null
  subjectName?: string
  topicName?: string
}) {
  const { session, details, assetTitleById, loading, error } = useSessionSummaryData(
    props.open,
    props.summary,
  )
  const stats = useSessionSummaryStats(details, session, props.summary)

  const headline = props.topicName
    ? `Session beendet – ${props.topicName}`
    : 'Session beendet'

  const message = useMotivationMessage(stats)

  const groups = useSessionPageGroups(details, assetTitleById)
  const [expandedKey, setExpandedKey] = useExpandedGroupKey(props.open, groups.map((g) => g.key))

  return (
    <Modal
      open={props.open}
      title={headline}
      onClose={props.onClose}
      footer={
        <button
          type="button"
          onClick={props.onClose}
          className="rounded-md bg-indigo-500 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-400"
        >
          Weiter im Thema
        </button>
      }
    >
      <div className="space-y-4">
        <div className="text-sm text-slate-200">{message}</div>

        {loading ? <div className="text-sm text-slate-400">Lade…</div> : null}
        {error ? (
          <div className="rounded-md border border-rose-900/60 bg-rose-950/30 px-3 py-2 text-sm text-rose-200">
            {error}
          </div>
        ) : null}

        {!loading && !error ? (
          <>
            <div className="grid grid-cols-2 gap-2">
              <StatCard label="Dauer" value={formatDuration(stats.totalSeconds)} />
              <StatCard label="Arbeitszeit" value={formatDuration(stats.workSeconds)} />
              <StatCard label="Versuche" value={String(stats.attempts)} />
              <StatCard label="Ergebnis" value={`✅ ${stats.correct}  🟨 ${stats.partial}  ❌ ${stats.wrong}`} />
            </div>

            <div className="mt-4 space-y-2">
              <div className="text-xs font-semibold text-slate-400">
                Bearbeitete Seiten
              </div>
              {groups.length === 0 ? (
                <div className="text-sm text-slate-400">
                  Keine Seiten bearbeitet (keine Attempts).
                </div>
              ) : (
                <div className="space-y-2">
                  {groups.map((g) => {
                    const open = expandedKey === g.key
                    return (
                      <div
                        key={g.key}
                        className="rounded-lg border border-slate-800 bg-slate-950/40"
                      >
                        <button
                          type="button"
                          onClick={() => setExpandedKey(open ? null : g.key)}
                          className="flex w-full items-center justify-between gap-3 px-3 py-2 text-left"
                        >
                          <div className="min-w-0">
                            <div className="truncate text-sm font-semibold text-slate-100">
                              {g.title}
                            </div>
                            <div className="mt-0.5 text-xs text-slate-400">
                              Versuche: {g.stats.attempts} · ✅ {g.stats.correct} · 🟨 {g.stats.partial} · ❌ {g.stats.wrong} · Zeit:{' '}
                              {formatDuration(g.stats.workSeconds)}
                            </div>
                          </div>
                          <div className="text-xs font-semibold text-slate-400">
                            {open ? '–' : '+'}
                          </div>
                        </button>

                        {open ? (
                          <div className="space-y-2 border-t border-slate-800 px-3 py-3">
                            {g.rows.map((r) => (
                              <div
                                key={r.attempt.id}
                                className="rounded-md border border-slate-800 bg-slate-950/30 p-2"
                              >
                                <div className="flex items-start justify-between gap-3">
                                  <div className="min-w-0">
                                    <div className="text-sm font-semibold text-slate-100">
                                      Aufgabe {r.problemIdx}
                                      {r.subproblemLabel}
                                    </div>
                                    <div className="mt-0.5 text-xs text-slate-400">
                                      {formatDuration(r.attempt.seconds)} ·{' '}
                                      {new Date(r.attempt.endedAtMs).toLocaleTimeString()}
                                    </div>
                                  </div>
                                  <ResultBadge result={r.attempt.result} />
                                </div>
                                {r.attempt.errorType ? (
                                  <div className="mt-2 text-xs text-rose-200">
                                    Fehler: {r.attempt.errorType}
                                  </div>
                                ) : null}
                                {r.attempt.note ? (
                                  <div className="mt-1 text-xs text-slate-200">
                                    Notiz: {r.attempt.note}
                                  </div>
                                ) : null}
                              </div>
                            ))}
                          </div>
                        ) : null}
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </>
        ) : null}
      </div>
    </Modal>
  )
}

function useSessionSummaryData(open: boolean, summary: SessionSummaryState | null) {
  const [session, setSession] = useState<StudySession | null>(null)
  const [details, setDetails] = useState<
    Array<{
      attempt: Attempt
      assetId: string
      pageNumber: number
      problemIdx: number
      subproblemLabel: string
    }>
  >([])
  const [assetTitleById, setAssetTitleById] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    async function run() {
      if (!open || !summary) return
      const id = summary.studySessionId
      setLoading(true)
      setError(null)
      try {
        if (id) {
          const s = await studySessionRepo.get(id)
          const d = await attemptRepo.listDetailsByStudySession(id)
          const assetIds = Array.from(new Set(d.map((x) => x.assetId)))
          const assets = await Promise.all(assetIds.map((aid) => assetRepo.get(aid)))
          const titles: Record<string, string> = {}
          for (const a of assets) {
            if (a) titles[a.id] = a.title
          }
          if (!cancelled) {
            setSession(s ?? null)
            setDetails(d)
            setAssetTitleById(titles)
          }
        } else if (!cancelled) {
          setSession(null)
          setDetails([])
          setAssetTitleById({})
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
  }, [open, summary])

  return { session, details, assetTitleById, loading, error }
}

function useSessionSummaryStats(
  details: Array<{ attempt: Attempt }>,
  session: StudySession | null,
  summary: SessionSummaryState | null,
) {
  return useMemo(() => {
    const attempts = details.map((d) => d.attempt)
    const correct = attempts.filter((a) => a.result === 'correct').length
    const partial = attempts.filter((a) => a.result === 'partial').length
    const wrong = attempts.filter((a) => a.result === 'wrong').length
    const workSeconds = attempts.reduce((acc, a) => acc + a.seconds, 0)
    const startedAtMs = session?.startedAtMs ?? summary?.startedAtMs ?? 0
    const endedAtMs = session?.endedAtMs ?? summary?.endedAtMs ?? 0
    const totalSeconds =
      startedAtMs && endedAtMs
        ? Math.max(0, Math.floor((endedAtMs - startedAtMs) / 1000))
        : 0
    return {
      correct,
      partial,
      wrong,
      workSeconds,
      totalSeconds,
      attempts: attempts.length,
    }
  }, [details, session, summary])
}

function useMotivationMessage(stats: {
  attempts: number
  correct: number
  wrong: number
}) {
  return useMemo(() => {
    if (stats.attempts === 0) return 'Stark, dass du gestartet hast. Morgen wieder 1 Schritt.'
    if (stats.attempts < 4) return 'Guter Start. Konstanz schlägt alles.'
    if (stats.correct >= stats.wrong) return 'Sehr solide Session. Du bist auf Kurs.'
    return 'Auch harte Sessions zählen – du weißt jetzt, was du üben musst.'
  }, [stats.attempts, stats.correct, stats.wrong])
}

function useSessionPageGroups(
  details: Array<{
    attempt: Attempt
    assetId: string
    pageNumber: number
    problemIdx: number
    subproblemLabel: string
  }>,
  assetTitleById: Record<string, string>,
) {
  return useMemo(() => {
    type Row = {
      attempt: Attempt
      problemIdx: number
      subproblemLabel: string
    }
    type Group = {
      key: string
      assetId: string
      pageNumber: number
      title: string
      rows: Row[]
      stats: { attempts: number; correct: number; partial: number; wrong: number; workSeconds: number }
    }

    const map = new Map<string, Group>()
    for (const d of details) {
      const key = `${d.assetId}:${d.pageNumber}`
      const title = `${assetTitleById[d.assetId] ?? 'Übung'} · Seite ${d.pageNumber}`
      const existing = map.get(key)
      const row: Row = {
        attempt: d.attempt,
        problemIdx: d.problemIdx,
        subproblemLabel: d.subproblemLabel,
      }
      if (!existing) {
        map.set(key, {
          key,
          assetId: d.assetId,
          pageNumber: d.pageNumber,
          title,
          rows: [row],
          stats: {
            attempts: 0,
            correct: 0,
            partial: 0,
            wrong: 0,
            workSeconds: 0,
          },
        })
      } else {
        existing.rows.push(row)
      }
    }

    const groups = Array.from(map.values())
    for (const g of groups) {
      g.rows.sort((a, b) => a.attempt.endedAtMs - b.attempt.endedAtMs)
      g.stats.attempts = g.rows.length
      g.stats.correct = g.rows.filter((r) => r.attempt.result === 'correct').length
      g.stats.partial = g.rows.filter((r) => r.attempt.result === 'partial').length
      g.stats.wrong = g.rows.filter((r) => r.attempt.result === 'wrong').length
      g.stats.workSeconds = g.rows.reduce((acc, r) => acc + r.attempt.seconds, 0)
    }
    // earliest page first (deterministic)
    groups.sort((a, b) => {
      if (a.assetId !== b.assetId) return a.assetId.localeCompare(b.assetId)
      return a.pageNumber - b.pageNumber
    })
    return groups
  }, [details, assetTitleById])
}

function useExpandedGroupKey(open: boolean, keys: string[]) {
  const [userExpandedKey, setUserExpandedKey] = useState<string | null>(null)
  const expandedKey = open ? (userExpandedKey ?? keys[0] ?? null) : null
  return [expandedKey, setUserExpandedKey] as const
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

function StatCard(props: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-slate-800 bg-slate-950/40 p-3">
      <div className="text-xs font-semibold text-slate-400">{props.label}</div>
      <div className="mt-1 text-sm font-semibold text-slate-100">{props.value}</div>
    </div>
  )
}

function formatDuration(seconds: number) {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${String(s).padStart(2, '0')}`
}
