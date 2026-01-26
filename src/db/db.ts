import Dexie, { type Table } from 'dexie'
import type {
  Asset,
  AssetFile,
  Attempt,
  Exercise,
  Folder,
  Problem,
  StudySession,
  Subject,
  Subproblem,
  Topic,
} from '../domain/models'

export class AbiDb extends Dexie {
  subjects!: Table<Subject, string>
  topics!: Table<Topic, string>
  folders!: Table<Folder, string>
  assets!: Table<Asset, string>
  assetFiles!: Table<AssetFile, string>

  studySessions!: Table<StudySession, string>
  exercises!: Table<Exercise, string>
  problems!: Table<Problem, string>
  subproblems!: Table<Subproblem, string>
  attempts!: Table<Attempt, string>

  constructor() {
    super('abi-lernapp')

    this.version(1).stores({
      subjects: 'id, createdAtMs',
      topics: 'id, subjectId, orderIndex, createdAtMs',
      folders: 'id, topicId, parentFolderId, orderIndex, createdAtMs',
      assets: 'id, subjectId, topicId, folderId, type, createdAtMs',
      assetFiles: 'assetId',
    })

    
    this.version(2).stores({
      subjects: 'id, name',
      topics: 'id, subjectId, orderIndex',
      folders: 'id, topicId, parentFolderId, orderIndex',
      assets: 'id, subjectId, topicId, folderId, type, createdAtMs',
      assetFiles: 'assetId',
    })

    this.version(3).stores({
      subjects: 'id, name',
      topics: 'id, subjectId, orderIndex',
      folders: 'id, topicId, parentFolderId, orderIndex',
      assets: 'id, subjectId, topicId, folderId, type, createdAtMs',
      assetFiles: 'assetId',

      studySessions: 'id, subjectId, topicId, startedAtMs, endedAtMs',
      exercisePages: 'id, [assetId+pageNumber], assetId, pageNumber, status',
      problems: 'id, [pageId+idx], pageId, idx',
      subproblems: 'id, [problemId+label], problemId, label',
      attempts:
        'id, studySessionId, subproblemId, startedAtMs, endedAtMs, result',
    })

      this.version(4).stores({
      subjects: 'id, name',
      topics: 'id, subjectId, orderIndex',
      folders: 'id, topicId, parentFolderId, orderIndex',
      assets: 'id, subjectId, topicId, folderId, type, createdAtMs',
      assetFiles: 'assetId',

      studySessions: 'id, subjectId, topicId, startedAtMs, endedAtMs',
      exercises: 'id, assetId, status',
      problems: 'id, [exerciseId+idx], exerciseId, idx',
      subproblems: 'id, [problemId+label], problemId, label',
      attempts:
        'id, studySessionId, subproblemId, startedAtMs, endedAtMs, result',
    })
  }
}

export const db = new AbiDb()

