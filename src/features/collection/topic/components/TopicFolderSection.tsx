import { FolderPlus } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import type { Folder } from '../../../../domain/models';
import { useFoldersStore } from '../../../../stores/foldersStore';
import { FolderTree } from './FolderTree';
import { UpsertFolderModal } from '../modals/UpsertFolderModal';

export function TopicFolderSection() {
  const { topicId } = useParams();
  const {
    foldersByTopic,
    loadingByTopic,
    errorByTopic,
    refreshByTopic,
    createFolder,
    renameFolder,
    deleteFolder,
  } = useFoldersStore();

  useEffect(() => {
    if (topicId) void refreshByTopic(topicId);
  }, [topicId, refreshByTopic]);

  const folders: Folder[] = useMemo(
    () => (topicId ? foldersByTopic[topicId] ?? [] : []),
    [foldersByTopic, topicId],
  );
  const loading = topicId ? loadingByTopic[topicId] ?? false : false;
  const error = topicId ? errorByTopic[topicId] : undefined;

  const [createOpen, setCreateOpen] = useState(false);

  const [editOpen, setEditOpen] = useState(false);
  const [editing, setEditing] = useState<Folder | null>(null);

  if (!topicId) return null;

  return (
    <>
      <section className="dark:bg-white/3 border-white/3 border min-h-60 rounded-2xl p-4 lg:col-span-1">
        <div className="flex items-center justify-between gap-3">
          <div className="text-sm font-semibold text-slate-200">Folder</div>
          <button
            type="button"
            onClick={() => setCreateOpen(true)}
            className="inline-flex items-center gap-2 rounded-md bg-slate-800 px-3 py-2 text-xs font-semibold text-slate-50 hover:bg-slate-700"
          >
            <FolderPlus className="h-4 w-4" />
            Folder
          </button>
        </div>

        {error ? (
          <div className="mt-3 rounded-md border border-rose-900/60 bg-rose-950/30 px-3 py-2 text-sm text-rose-200">
            {error}
          </div>
        ) : null}

        {loading ? (
          <div className="mt-3 text-sm text-slate-400">Lade…</div>
        ) : folders.length === 0 ? (
          <div className="mt-3 text-sm text-slate-400">
            Noch keine Folder. Optional: lege Folder für bessere Übersicht an.
          </div>
        ) : (
          <FolderTree
            folders={folders}
            onRename={(f) => {
              setEditing(f);
              setEditOpen(true);
            }}
            onDelete={(f) => {
              if (
                window.confirm(
                  `Folder „${f.name}“ löschen? (Unterfolder werden eine Ebene hochgezogen)`,
                )
              ) {
                void deleteFolder(f.id, topicId);
              }
            }}
          />
        )}
      </section>

      <UpsertFolderModal
        open={createOpen}
        mode="create"
        folders={folders}
        onClose={() => setCreateOpen(false)}
        onSave={async (input) => {
          await createFolder({
            topicId,
            name: input.name,
            iconEmoji: input.iconEmoji,
            parentFolderId: input.parentFolderId,
          });
        }}
      />

      <UpsertFolderModal
        open={editOpen}
        mode="edit"
        folders={folders}
        initial={
          editing
            ? {
                name: editing.name,
                iconEmoji: editing.iconEmoji,
                parentFolderId: editing.parentFolderId,
              }
            : undefined
        }
        onClose={() => {
          setEditOpen(false);
          setEditing(null);
        }}
        onSave={async (input) => {
          if (!editing) return;
          await renameFolder(editing.id, topicId, {
            name: input.name,
            iconEmoji: input.iconEmoji,
          });
        }}
      />
    </>
  );
}
