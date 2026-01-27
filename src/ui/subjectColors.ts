import { SubjectColorId, type SubjectColorAssignment } from '../domain/models'

export type ThemeMode = 'light' | 'dark'

export type SubjectColorTones = {
  lightHex: string
  darkHex: string
}

export type SubjectColorOption = {
  id: SubjectColorId
  name: string
}

export const subjectColorOptions: SubjectColorOption[] = [
  { id: SubjectColorId.Green, name: 'Grün' },
  { id: SubjectColorId.LightBlue, name: 'Hellblau' },
  { id: SubjectColorId.Orange, name: 'Orange' },
  { id: SubjectColorId.Red, name: 'Rot' },
  { id: SubjectColorId.DarkBlue, name: 'Dunkelblau' },
]

export const SUBJECT_COLOR_PALETTES: Record<ThemeMode, Record<SubjectColorId, SubjectColorTones>> =
  {
    light: {
      [SubjectColorId.Green]: { lightHex: '#86EFAC', darkHex: '#16A34A' },
      [SubjectColorId.LightBlue]: { lightHex: '#93C5FD', darkHex: '#2563EB' },
      [SubjectColorId.Orange]: { lightHex: '#FDBA74', darkHex: '#EA580C' },
      [SubjectColorId.Red]: { lightHex: '#FDA4AF', darkHex: '#E11D48' },
      [SubjectColorId.DarkBlue]: { lightHex: '#A5B4FC', darkHex: '#1D4ED8' },
    },
    dark: {
      [SubjectColorId.Green]: { lightHex: '#22C55E', darkHex: '#14532D' },
      [SubjectColorId.LightBlue]: { lightHex: '#3B82F6', darkHex: '#1E3A8A' },
      [SubjectColorId.Orange]: { lightHex: '#F97316', darkHex: '#7C2D12' },
      [SubjectColorId.Red]: { lightHex: '#FB7185', darkHex: '#881337' },
      [SubjectColorId.DarkBlue]: { lightHex: '#60A5FA', darkHex: '#172554' },
    },
  }

export const DEFAULT_SUBJECT_COLOR: SubjectColorAssignment = {
  colorId: SubjectColorId.DarkBlue,
  toneOrder: 'lightTop',
}

