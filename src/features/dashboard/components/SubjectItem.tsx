import { Pencil, Trash2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { Subject } from '../../../domain/models'
import { useSubjectGradient } from '../../../ui/hooks/useSubjectColors'

export function SubjectItem(props: {
  subject: Subject
  onEdit: (subject: Subject) => void
  onDelete: (subject: Subject) => void
}) {
  const { subject: s, onEdit, onDelete } = props
  const { topHex, bottomHex } = useSubjectGradient(s)

  return (
    <li
      style={{
        backgroundColor: bottomHex,
        color: topHex,
      }}
      className="rounded-xl p-4"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            {s.iconEmoji ? (
              <span className="text-base leading-none" aria-hidden>
                {s.iconEmoji}
              </span>
            ) : null}
            <span
              className="mt-0.5 inline-block h-3 w-3 shrink-0 rounded-full"
              aria-hidden
            />
            <Link
              to={`/subjects/${s.id}`}
              className="truncate text-sm font-semibold text-inherit hover:underline"
            >
              {s.name}
            </Link>
          </div>
          <div className="mt-1 text-xs text-current/70">
            Themen, Assets, Reviews kommen als nächstes.
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => onEdit(s)}
            className="rounded-md p-2 text-current/85 hover:bg-black/10 hover:text-current"
            aria-label="Bearbeiten"
          >
            <Pencil className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => onDelete(s)}
            className="rounded-md p-2 text-current/85 hover:bg-black/10 hover:text-current"
            aria-label="Löschen"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </li>
  )
}

