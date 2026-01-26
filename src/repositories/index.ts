import { IndexedDbAssetFileStore } from './local/IndexedDbAssetFileStore'
import {
  LocalAssetRepository,
  LocalFolderRepository,
  LocalSubjectRepository,
  LocalTopicRepository,
} from './local/LocalRepositories'
import {
  LocalAttemptRepository,
  LocalExerciseRepository,
  LocalProblemRepository,
  LocalStudySessionRepository,
  LocalSubproblemRepository,
} from './study/local/LocalStudyRepositories'

export const subjectRepo = new LocalSubjectRepository()
export const topicRepo = new LocalTopicRepository()
export const folderRepo = new LocalFolderRepository()
export const assetRepo = new LocalAssetRepository()
export const assetFileStore = new IndexedDbAssetFileStore()

export const studySessionRepo = new LocalStudySessionRepository()
export const exerciseRepo = new LocalExerciseRepository()
export const problemRepo = new LocalProblemRepository()
export const subproblemRepo = new LocalSubproblemRepository()
export const attemptRepo = new LocalAttemptRepository()

