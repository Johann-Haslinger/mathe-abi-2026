import type {
  Attempt,
  AttemptResult,
  ExercisePage,
  ExercisePageStatus,
  Problem,
  StudySession,
  Subproblem,
} from '../../domain/models'

export interface StudySessionRepository {
  create(input: { subjectId: string; topicId: string; startedAtMs: number }): Promise<StudySession>
  end(id: string, endedAtMs: number): Promise<void>
  get(id: string): Promise<StudySession | undefined>
}

export interface ExercisePageRepository {
  getByAssetAndPage(assetId: string, pageNumber: number): Promise<ExercisePage | undefined>
  upsert(input: {
    assetId: string
    pageNumber: number
    status: ExercisePageStatus
  }): Promise<ExercisePage>
  setStatus(id: string, status: ExercisePageStatus): Promise<void>
}

export interface ProblemRepository {
  getOrCreate(input: { pageId: string; idx: number }): Promise<Problem>
}

export interface SubproblemRepository {
  getOrCreate(input: { problemId: string; label: string }): Promise<Subproblem>
}

export interface AttemptRepository {
  create(input: {
    studySessionId: string
    subproblemId: string
    startedAtMs: number
    endedAtMs: number
    seconds: number
    result: AttemptResult
    note?: string
    errorType?: string
  }): Promise<Attempt>
  listBySubproblem(subproblemId: string): Promise<Attempt[]>
  listForSessionAssetPage(input: {
    studySessionId: string
    assetId: string
    pageNumber: number
  }): Promise<Array<{ attempt: Attempt; problemIdx: number; subproblemLabel: string }>>
}

