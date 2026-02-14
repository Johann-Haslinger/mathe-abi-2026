import { Download, ExternalLink, Trash2 } from 'lucide-react';
import type { Asset, ExercisePageStatus } from '../../../../domain/models';
import { assetTypeLabel } from '../utils/assetTypeLabel';

export function AssetItem(props: {
  asset: Asset;
  folderLabel: string;
  exerciseStatus?: ExercisePageStatus;
  onOpen: () => void;
  onDownload: () => void;
  onDelete: () => void;
}) {
  const { asset: a } = props;

  return (
    <li className="flex items-start justify-between gap-3 px-3 py-2">
      <div className="min-w-0">
        <div className="truncate text-sm font-semibold text-black dark:text-white">{a.title}</div>
        <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-white/70">
          <span className="rounded-full bg-black/5 dark:bg-white/3 px-2 py-0.5">
            {assetTypeLabel(a.type)}
          </span>
          {a.type === 'exercise' ? (
            <span className="rounded-full bg-black/5 dark:bg-white/3 px-2 py-0.5">
              Status: {props.exerciseStatus ?? 'unknown'}
            </span>
          ) : null}
          <span className="rounded-full bg-black/5 dark:bg-white/3 px-2 py-0.5">
            Folder: {props.folderLabel}
          </span>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-1">
        <button
          type="button"
          onClick={props.onOpen}
          className="rounded-md p-2 text-slate-300 hover:bg-slate-900 hover:text-slate-50"
          aria-label="Öffnen"
          title="Öffnen"
        >
          <ExternalLink className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={props.onDownload}
          className="rounded-md p-2 text-slate-300 hover:bg-slate-900 hover:text-slate-50"
          aria-label="Download"
          title="Download"
        >
          <Download className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={props.onDelete}
          className="rounded-md p-2 text-rose-200 hover:bg-rose-950/50"
          aria-label="Löschen"
          title="Löschen"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </li>
  );
}
