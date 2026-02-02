import { Pencil, Play, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Topic } from '../../../../domain/models';

export function TopicItem(props: {
  subjectId: string;
  topic: Topic;
  from?: string;
  onStartSession: (topicId: string) => void;
  onEdit: (topic: Topic) => void;
  onDelete: (topic: Topic) => void;
}) {
  const { subjectId, topic: t, from, onStartSession, onEdit, onDelete } = props;

  return (
    <li className="p-4 w-full h-40 hover:scale-105 transition-all duration-300 bg-black/10 ">
      <div className="text-2xl mb-2"> {t.iconEmoji ? `${t.iconEmoji} ` : '📔'} </div>
      <Link
        to={`/subjects/${subjectId}/topics/${t.id}`}
        state={from ? { from } : null}
        className="min-w-0 truncate text-base font-medium text-slate-50 hover:underline"
      >
        {t.name}
      </Link>
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => onStartSession(t.id)}
          className="rounded-md p-2 text-emerald-200 hover:bg-emerald-950/40"
          aria-label="Session starten"
          title="Session starten"
        >
          <Play className="h-4 w-4" />
        </button>

        <button
          type="button"
          onClick={() => onEdit(t)}
          className="rounded-md p-2 text-slate-300 hover:bg-slate-900 hover:text-slate-50"
          aria-label="Bearbeiten"
        >
          <Pencil className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => onDelete(t)}
          className="rounded-md p-2 text-rose-200 hover:bg-rose-950/50"
          aria-label="Löschen"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </li>
  );
}
