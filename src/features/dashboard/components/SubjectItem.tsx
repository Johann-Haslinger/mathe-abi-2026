import { ArrowRight, Pencil } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import type { Subject } from '../../../domain/models';
import { useSubjectGradient } from '../../../ui/hooks/useSubjectColors';

export function SubjectItem(props: { subject: Subject; onEdit: (subject: Subject) => void }) {
  const { subject: s, onEdit } = props;
  const location = useLocation();
  const { topHex, bottomHex } = useSubjectGradient(s);

  return (
    <li
      style={{
        backgroundColor: bottomHex,
        color: topHex,
      }}
      className="min-h-52 group cursor-pointer hover:scale-105 transition-all duration-300 justify-around flex flex-col rounded-none p-5"
    >
      <div className="flex items-start justify-between gap-3">
        <Link
          to={`/subjects/${s.id}`}
          state={{ from: location.pathname }}
          className="group flex min-w-0 flex-1 flex-col"
          aria-label={`Öffne Fach ${s.name}`}
        >
          <span className="truncate text-3xl font-semibold leading-tight text-inherit">
            {s.name}
          </span>
        </Link>

        <div className="flex items-end gap-1">
          <button
            type="button"
            onClick={() => onEdit(s)}
            className="rounded-md p-2 invisible group-hover:visible text-current/85 hover:bg-black/10 hover:text-current"
            aria-label="Bearbeiten"
          >
            <Pencil className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="mt-auto flex items-end justify-end">
        <span
          style={{ backgroundColor: topHex, color: bottomHex }}
          className="inline-flex h-9 w-9 items-center justify-center rounded-full text-current/90 transition-colors group-hover:bg-black/15"
        >
          <span className="sr-only">Öffnen</span>
          <ArrowRight className="size-6" aria-hidden />
        </span>
      </div>
    </li>
  );
}
