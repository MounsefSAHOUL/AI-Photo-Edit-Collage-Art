import {useEffect, useRef} from 'react';

export function useRenderProfiler(name = 'component') {
  const renders = useRef(0);
  const start = useRef<number | null>(null);

  if (start.current == null) start.current = performance?.now?.() ?? Date.now();
  renders.current += 1;

  useEffect(() => {
    const now = performance?.now?.() ?? Date.now();
    const elapsed = Math.round(now - (start.current ?? now));
    // Log light info so developer can see frequency and duration

    // console.log(`[render-profiler] ${name} renders=${renders.current} elapsed=${elapsed}ms`);
  }, []);
}
