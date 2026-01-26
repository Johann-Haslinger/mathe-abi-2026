import { useEffect, useMemo, useState } from 'react'
import type { AttemptResult, ExercisePageStatus } from '../../../domain/models'
import { DefaultView } from './floatingQuickLogPanel/DefaultView'
import { NextView } from './floatingQuickLogPanel/NextView'
import { ReviewView } from './floatingQuickLogPanel/ReviewView'

type PanelView = 'default' | 'review' | 'next'

export function FloatingQuickLogPanel(props: {
  assetId: string
  pageNumber: number
  exerciseStatus: ExercisePageStatus
  problemIdx: number
  subproblemLabel: string
  attemptStartedAtMs: number | null
  onProblemIdxChange: (idx: number) => void
  onSubproblemLabelChange: (label: string) => void
  onStartAttempt: () => void
  onCancelAttempt: () => void
  onSaveAttempt: (input: {
    result: AttemptResult
    note?: string
    errorType?: string
  }) => Promise<void> | void
  onNextSubproblem: () => void
  onNewProblem: () => void
  onMarkProgress: () => void
  onFinishExercise: () => void
}) {
  const [nowMs, setNowMs] = useState(() => Date.now())

  useEffect(() => {
    if (!props.attemptStartedAtMs) return
    const t = window.setInterval(() => setNowMs(Date.now()), 250)
    return () => window.clearInterval(t)
  }, [props.attemptStartedAtMs])

  const seconds = useMemo(() => {
    if (!props.attemptStartedAtMs) return 0
    return Math.max(0, Math.floor((nowMs - props.attemptStartedAtMs) / 1000))
  }, [nowMs, props.attemptStartedAtMs])

  const [view, setView] = useState<PanelView>('default')


  return (
    <div className="fixed bottom-4 right-4 z-40 w-[min(420px,calc(100vw-2rem))]">
      <div className="rounded-xl border border-slate-800 bg-slate-950/90 p-3 shadow-xl backdrop-blur">
        {view === 'default' ? (
          <DefaultView
            pageNumber={props.pageNumber}
            exerciseStatus={props.exerciseStatus}
            problemIdx={props.problemIdx}
            subproblemLabel={props.subproblemLabel}
            seconds={seconds}
            attemptStartedAtMs={props.attemptStartedAtMs}
            onProblemIdxChange={props.onProblemIdxChange}
            onSubproblemLabelChange={props.onSubproblemLabelChange}
            onStartAttempt={() => {
              props.onStartAttempt()
              setView('default')
            }}
            onStopAttempt={() => {
              props.onCancelAttempt()
              setView('default')
            }}
            onOpenReview={() => setView('review')}
          />
        ) : null}

        {view === 'review' ? (
          <ReviewView
            seconds={seconds}
            onClose={() => setView('default')}
            onSave={async (input) => {
              await props.onSaveAttempt(input)
              setView('next')
            }}
          />
        ) : null}

        {view === 'next' ? (
          <NextView
            onNextSubproblem={() => {
              props.onNextSubproblem()
              setView('default')
            }}
            onNewProblem={() => {
              props.onNewProblem()
              setView('default')
            }}
            onMarkProgress={() => {
              props.onMarkProgress()
              setView('default')
            }}
            onFinishExercise={() => {
              props.onFinishExercise()
              setView('default')
            }}
          />
        ) : null}
      </div>
    </div>
  )
}

