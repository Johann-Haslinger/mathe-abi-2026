import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type FloatingQuickLogPanelView =
  | 'start'
  | 'config'
  | 'progress'
  | 'progressDetails'
  | 'review'
  | 'next';

type FloatingQuickLogPanelState = {
  view: FloatingQuickLogPanelView;
  x: number;
  y: number;

  setView: (view: FloatingQuickLogPanelView) => void;
  setPosition: (pos: { x: number; y: number }) => void;
  reset: () => void;
};

export const useFloatingQuickLogPanelStore = create<FloatingQuickLogPanelState>()(
  persist(
    (set) => ({
      view: 'start',
      x: 0,
      y: 0,

      setView: (view) => set({ view }),
      setPosition: (pos) => set({ x: pos.x, y: pos.y }),
      reset: () => set({ view: 'start', x: 0, y: 0 }),
    }),
    {
      name: 'mathe-abi-2026:floating-quick-log-panel',
      version: 1,
      partialize: (s) => ({ view: s.view, x: s.x, y: s.y }),
    },
  ),
);
