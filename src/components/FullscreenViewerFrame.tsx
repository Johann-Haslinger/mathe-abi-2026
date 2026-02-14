import { type ReactNode } from 'react';

export type FullscreenViewerFrameProps = {
  children: ReactNode;
  overlayLeft?: ReactNode;
  overlayRight?: ReactNode;
  overlayInfo?: ReactNode;
};

export function FullscreenViewerFrame(props: FullscreenViewerFrameProps) {
  return (
    <div className="fixed dark:bg-[#1D3352] inset-0 z-40">
      <div className="absolute inset-0" />
      {props.children}

      {props.overlayLeft ? (
        <div className="absolute left-3 z-10" style={{ top: 72 }}>
          {props.overlayLeft}
        </div>
      ) : null}

      {props.overlayRight ? (
        <div className="absolute right-6 z-10 flex items-center gap-2" style={{ top: 72 }}>
          {props.overlayRight}
        </div>
      ) : null}

      {props.overlayInfo ? (
        <div className="absolute inset-0 z-20 pointer-events-none">
          <div className="absolute right-3 pointer-events-auto" style={{ top: 128 }}>
            {props.overlayInfo}
          </div>
        </div>
      ) : null}
    </div>
  );
}
