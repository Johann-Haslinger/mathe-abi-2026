import { create } from 'zustand'
import type { AttemptResult, ExercisePageStatus } from '../../../domain/models'
import {
  attemptRepo,
  exercisePageRepo,
  problemRepo,
  studySessionRepo,
  subproblemRepo,
} from '../../../repositories'

type StudyState = {
  studySessionId: string | null
  attemptStartedAtMs: number | null
  problemIdx: number
  subproblemLabel: string
  pageStatusByKey: Record<string, ExercisePageStatus>

  ensureStudySession: (input: {
    subjectId: string
    topicId: string
    startedAtMs: number
  }) => Promise<string>

  setProblemIdx: (idx: number) => void
  setSubproblemLabel: (label: string) => void

  startAttempt: () => void
  cancelAttempt: () => void

  loadPageStatus: (assetId: string, pageNumber: number) => Promise<void>
  setPageStatus: (
    assetId: string,
    pageNumber: number,
    status: ExercisePageStatus,
  ) => Promise<void>

  logAttempt: (input: {
    assetId: string
    pageNumber: number
    problemIdx: number
    subproblemLabel: string
    endedAtMs: number
    result: AttemptResult
    note?: string
    errorType?: string
  }) => Promise<void>

  reset: () => void
}

function key(assetId: string, pageNumber: number) {
  return `${assetId}:${pageNumber}`
}

export const useStudyStore = create<StudyState>((set, get) => ({
  studySessionId: null,
  attemptStartedAtMs: null,
  problemIdx: 1,
  subproblemLabel: 'a',
  pageStatusByKey: {},

  ensureStudySession: async ({ subjectId, topicId, startedAtMs }) => {
    const existing = get().studySessionId
    if (existing) return existing
    const created = await studySessionRepo.create({ subjectId, topicId, startedAtMs })
    set({ studySessionId: created.id })
    return created.id
  },

  setProblemIdx: (idx) => set({ problemIdx: idx }),
  setSubproblemLabel: (label) => set({ subproblemLabel: label }),

  startAttempt: () => {
    if (get().attemptStartedAtMs) return
    set({ attemptStartedAtMs: Date.now() })
  },

  cancelAttempt: () => set({ attemptStartedAtMs: null }),

  loadPageStatus: async (assetId, pageNumber) => {
    const page = await exercisePageRepo.getByAssetAndPage(assetId, pageNumber)
    set((s) => ({
      pageStatusByKey: {
        ...s.pageStatusByKey,
        [key(assetId, pageNumber)]: page?.status ?? 'unknown',
      },
    }))
  },

  setPageStatus: async (assetId, pageNumber, status) => {
    const page = await exercisePageRepo.upsert({ assetId, pageNumber, status })
    set((s) => ({
      pageStatusByKey: { ...s.pageStatusByKey, [key(assetId, pageNumber)]: page.status },
    }))
  },

  logAttempt: async (input) => {
    const { studySessionId, attemptStartedAtMs } = get()
    if (!studySessionId) throw new Error('No studySessionId')
    if (!attemptStartedAtMs) throw new Error('No running attempt')

    const startedAtMs = attemptStartedAtMs
    const endedAtMs = input.endedAtMs
    const seconds = Math.max(1, Math.round((endedAtMs - startedAtMs) / 1000))

    const page = await exercisePageRepo.upsert({
      assetId: input.assetId,
      pageNumber: input.pageNumber,
      status: 'partial',
    })

    const problem = await problemRepo.getOrCreate({
      pageId: page.id,
      idx: input.problemIdx,
    })

    const subproblem = await subproblemRepo.getOrCreate({
      problemId: problem.id,
      label: input.subproblemLabel,
    })

    await attemptRepo.create({
      studySessionId,
      subproblemId: subproblem.id,
      startedAtMs,
      endedAtMs,
      seconds,
      result: input.result,
      note: input.note,
      errorType: input.errorType,
    })

    set((s) => ({
      attemptStartedAtMs: null,
      pageStatusByKey: { ...s.pageStatusByKey, [key(input.assetId, input.pageNumber)]: page.status },
    }))
  },

  reset: () =>
    set({
      studySessionId: null,
      attemptStartedAtMs: null,
      problemIdx: 1,
      subproblemLabel: 'a',
      pageStatusByKey: {},
    }),
}))

