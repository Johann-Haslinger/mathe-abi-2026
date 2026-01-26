import { db } from '../../../db/db'
import type { ExercisePage, Problem, StudySession, Subproblem, Attempt } from '../../../domain/models'
import { newId } from '../../../lib/id'
import type {
  AttemptRepository,
  ExercisePageRepository,
  ProblemRepository,
  StudySessionRepository,
  SubproblemRepository,
} from '../interfaces'

export class LocalStudySessionRepository implements StudySessionRepository {
  async create(input: {
    subjectId: string
    topicId: string
    startedAtMs: number
  }): Promise<StudySession> {
    const row: StudySession = {
      id: newId(),
      subjectId: input.subjectId,
      topicId: input.topicId,
      startedAtMs: input.startedAtMs,
    }
    await db.studySessions.add(row)
    return row
  }

  async end(id: string, endedAtMs: number): Promise<void> {
    await db.studySessions.update(id, { endedAtMs })
  }

  async get(id: string): Promise<StudySession | undefined> {
    return db.studySessions.get(id)
  }
}

export class LocalExercisePageRepository implements ExercisePageRepository {
  async getByAssetAndPage(
    assetId: string,
    pageNumber: number,
  ): Promise<ExercisePage | undefined> {
    return db.exercisePages
      .where('[assetId+pageNumber]')
      .equals([assetId, pageNumber])
      .first()
  }

  async upsert(input: {
    assetId: string
    pageNumber: number
    status: ExercisePage['status']
  }): Promise<ExercisePage> {
    const existing = await this.getByAssetAndPage(input.assetId, input.pageNumber)
    if (existing) {
      const next: ExercisePage = { ...existing, status: input.status }
      await db.exercisePages.put(next)
      return next
    }
    const row: ExercisePage = {
      id: newId(),
      assetId: input.assetId,
      pageNumber: input.pageNumber,
      status: input.status,
    }
    await db.exercisePages.add(row)
    return row
  }

  async setStatus(id: string, status: ExercisePage['status']): Promise<void> {
    await db.exercisePages.update(id, { status })
  }
}

export class LocalProblemRepository implements ProblemRepository {
  async getOrCreate(input: { pageId: string; idx: number }): Promise<Problem> {
    const existing = await db.problems
      .where('[pageId+idx]')
      .equals([input.pageId, input.idx])
      .first()
    if (existing) return existing

    const row: Problem = { id: newId(), pageId: input.pageId, idx: input.idx }
    await db.problems.add(row)
    return row
  }
}

export class LocalSubproblemRepository implements SubproblemRepository {
  async getOrCreate(input: { problemId: string; label: string }): Promise<Subproblem> {
    const existing = await db.subproblems
      .where('[problemId+label]')
      .equals([input.problemId, input.label])
      .first()
    if (existing) return existing

    const row: Subproblem = {
      id: newId(),
      problemId: input.problemId,
      label: input.label.trim(),
    }
    await db.subproblems.add(row)
    return row
  }
}

export class LocalAttemptRepository implements AttemptRepository {
  async create(input: {
    studySessionId: string
    subproblemId: string
    startedAtMs: number
    endedAtMs: number
    seconds: number
    result: Attempt['result']
    note?: string
    errorType?: string
  }): Promise<Attempt> {
    const row: Attempt = {
      id: newId(),
      studySessionId: input.studySessionId,
      subproblemId: input.subproblemId,
      startedAtMs: input.startedAtMs,
      endedAtMs: input.endedAtMs,
      seconds: input.seconds,
      result: input.result,
      note: input.note?.trim() || undefined,
      errorType: input.errorType?.trim() || undefined,
    }
    await db.attempts.add(row)
    return row
  }

  async listBySubproblem(subproblemId: string): Promise<Attempt[]> {
    return db.attempts.where('subproblemId').equals(subproblemId).toArray()
  }

  async listForSessionAssetPage(input: {
    studySessionId: string
    assetId: string
    pageNumber: number
  }): Promise<Array<{ attempt: Attempt; problemIdx: number; subproblemLabel: string }>> {
    const page = await db.exercisePages
      .where('[assetId+pageNumber]')
      .equals([input.assetId, input.pageNumber])
      .first()
    if (!page) return []

    const problems = await db.problems.where('pageId').equals(page.id).toArray()
    if (problems.length === 0) return []

    const problemIdxById = new Map(problems.map((p) => [p.id, p.idx]))
    const subproblems = await db.subproblems.where('problemId').anyOf(problems.map((p) => p.id)).toArray()
    if (subproblems.length === 0) return []

    const subproblemMetaById = new Map(
      subproblems.map((sp) => [
        sp.id,
        { problemIdx: problemIdxById.get(sp.problemId) ?? 0, subproblemLabel: sp.label },
      ]),
    )
    const subproblemIds = new Set(subproblems.map((sp) => sp.id))

    const attempts = await db.attempts
      .where('studySessionId')
      .equals(input.studySessionId)
      .toArray()

    return attempts
      .filter((a) => subproblemIds.has(a.subproblemId))
      .map((a) => {
        const meta = subproblemMetaById.get(a.subproblemId)
        return {
          attempt: a,
          problemIdx: meta?.problemIdx ?? 0,
          subproblemLabel: meta?.subproblemLabel ?? '?',
        }
      })
      .sort((a, b) => a.attempt.endedAtMs - b.attempt.endedAtMs)
  }
}

