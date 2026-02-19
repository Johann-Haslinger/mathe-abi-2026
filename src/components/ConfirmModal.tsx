import { Modal } from './Modal';

export function ConfirmModal(props: {
  open: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  cancelLabel?: string;
  confirmTone?: 'danger' | 'primary';
  onConfirm: () => void | Promise<void>;
  onCancel: () => void;
  busy?: boolean;
}) {
  const cancelLabel = props.cancelLabel ?? 'Abbrechen';
  const confirmCls =
    props.confirmTone === 'danger'
      ? 'bg-rose-600 hover:bg-rose-500 text-white'
      : 'bg-indigo-500 hover:bg-indigo-400 text-white';

  return (
    <Modal
      open={props.open}
      onClose={props.busy ? () => {} : props.onCancel}
      footer={
        <>
          <button
            type="button"
            onClick={props.onCancel}
            disabled={props.busy}
            className="rounded-md bg-slate-800 px-3 py-2 text-sm font-semibold text-slate-50 hover:bg-slate-700 disabled:opacity-50"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={props.onConfirm}
            disabled={props.busy}
            className={`rounded-md px-3 py-2 text-sm font-semibold disabled:opacity-50 ${confirmCls}`}
          >
            {props.confirmLabel}
          </button>
        </>
      }
    >
      <div className="max-w-sm">
        <div className="text-sm font-semibold text-slate-100">{props.title}</div>
        <div className="mt-2 text-sm text-slate-300">{props.message}</div>
      </div>
    </Modal>
  );
}
