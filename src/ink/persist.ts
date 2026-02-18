import { useEffect } from 'react';
import { inkRepo } from '../repositories';
import { useInkStore } from './inkStore';
import type { InkStroke } from './types';

export function useInkHydrate(input: { studySessionId: string; assetId: string } | null) {
  const setContext = useInkStore((s) => s.setContext);
  const hydrate = useInkStore((s) => s.hydrate);

  useEffect(() => {
    let cancelled = false;
    async function run() {
      if (!input) {
        setContext(null);
        hydrate([]);
        return;
      }
      setContext(input);
      const strokes: InkStroke[] = await inkRepo.listBySessionAsset(input);
      if (cancelled) return;
      hydrate(strokes);
    }
    void run();
    return () => {
      cancelled = true;
    };
  }, [input, setContext, hydrate]);
}
