import { useMemo } from 'react'
import type { Subject } from '../../domain/models'
import { useSubjectsStore } from '../../stores/subjectsStore'
import { useThemeStore } from '../../stores/themeStore'
import { resolveSubjectGradient, resolveSubjectTones } from '../subjectColorResolvers'
import { DEFAULT_SUBJECT_COLOR } from '../subjectColors'

function useSubjectFromParam(subjectOrId?: Subject | string): Subject | undefined {
  const subjects = useSubjectsStore((s) => s.subjects)
  if (!subjectOrId) return undefined
  if (typeof subjectOrId === 'string') return subjects.find((s) => s.id === subjectOrId)
  return subjectOrId
}

export function useSubjectTones(subjectOrId?: Subject | string) {
  const theme = useThemeStore((s) => s.effectiveTheme)
  const subject = useSubjectFromParam(subjectOrId)
  const assignment = subject?.color ?? DEFAULT_SUBJECT_COLOR

  return useMemo(() => resolveSubjectTones(assignment, theme), [assignment, theme])
}

export function useSubjectGradient(subjectOrId?: Subject | string) {
  const theme = useThemeStore((s) => s.effectiveTheme)
  const subject = useSubjectFromParam(subjectOrId)
  const assignment = subject?.color ?? DEFAULT_SUBJECT_COLOR

  return useMemo(() => resolveSubjectGradient(assignment, theme), [assignment, theme])
}

