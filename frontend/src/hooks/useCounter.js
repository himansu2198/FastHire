// src/hooks/useCounter.js
import { useEffect, useRef, useState } from "react";

export function useCounter(target, duration = 800) {
  const [value, setValue] = useState(0);
  const rafRef  = useRef(null);
  const startTs = useRef(null);
  const fromVal = useRef(0);

  useEffect(() => {
    fromVal.current = value;
    startTs.current = null;

    const animate = (ts) => {
      if (!startTs.current) startTs.current = ts;
      const elapsed  = ts - startTs.current;
      const progress = Math.min(elapsed / duration, 1);
      const eased    = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(fromVal.current + (target - fromVal.current) * eased));
      if (progress < 1) rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target]);

  return value;
}