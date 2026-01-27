import type { SubjectColorAssignment } from '../domain/models'
import { SUBJECT_COLOR_PALETTES, type ThemeMode } from './subjectColors'

export type ResolvedSubjectTones = {
  lightHex: string
  darkHex: string
}

export type ResolvedSubjectGradient = {
  topHex: string
  bottomHex: string
}

export function resolveSubjectTones(
  assignment: SubjectColorAssignment,
  theme: ThemeMode,
): ResolvedSubjectTones {
  const tones = SUBJECT_COLOR_PALETTES[theme][assignment.colorId]
  return { lightHex: tones.lightHex, darkHex: tones.darkHex }
}

export function resolveSubjectGradient(
  assignment: SubjectColorAssignment,
  theme: ThemeMode,
): ResolvedSubjectGradient {
  const { lightHex, darkHex } = resolveSubjectTones(assignment, theme)
  if (assignment.toneOrder === 'darkTop') {
    return { topHex: darkHex, bottomHex: lightHex }
  }
  return { topHex: lightHex, bottomHex: darkHex }
}

