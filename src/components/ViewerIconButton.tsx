import type { ReactNode } from 'react';

export function ViewerIconButton(props: {
  ariaLabel: string;
  onClick: () => void;
  children: ReactNode;
  className?: string;
}) {
  return (
    <button
      type="button"
      aria-label={props.ariaLabel}
      onClick={props.onClick}
      className={`inline-flex size-12 text-2xl cursor-pointer hover:scale-105 active:scale-95 items-center justify-center rounded-full border-[0.5px] border-black/10 bg-black/5  text-black dark:text-white dark:bg-white/5 dark:border-white/10 backdrop-blur transition hover:bg-black/45 active:bg-black/55 ${props.className}`}
    >
      {props.children}
    </button>
  );
}
