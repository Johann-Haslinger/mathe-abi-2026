import type React from 'react';

export type DragGripProps = Pick<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onPointerDown'>;

export function PanelViewHeader(props: { left?: React.ReactNode; right?: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <div className="min-w-0">{props.left}</div>
      <div className="flex items-center gap-1">{props.right}</div>
    </div>
  );
}
