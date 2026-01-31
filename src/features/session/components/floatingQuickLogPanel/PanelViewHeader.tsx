import { GripVertical } from 'lucide-react';
import type React from 'react';

export type DragGripProps = Pick<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onPointerDown'>;

export function PanelViewHeader(props: {
  left?: React.ReactNode;
  right?: React.ReactNode;
  gripProps?: DragGripProps;
}) {
  return (
    <div className="flex items-start justify-between gap-3">
      <div className="min-w-0">{props.left}</div>
      <div className="flex items-center gap-1">
        {props.right}
        {props.gripProps ? (
          <button
            type="button"
            className="inline-flex items-center justify-center text-white/60 hover:text-white/90"
            aria-label="Verschieben"
            title="Ziehen zum Verschieben"
            {...props.gripProps}
          >
            <GripVertical className="size-4.5" />
          </button>
        ) : null}
      </div>
    </div>
  );
}
