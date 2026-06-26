import { useEffect, useRef, useState } from 'react';

export function useSlider({ total, autoplay = true, interval = 4000, infinite = true }) {
  const [current, setCurrent] = useState(0);
  const timerRef = useRef(null);

  const goTo = (index) => {
    if (total === 0) return;
    setCurrent(((index % total) + total) % total);
  };

  const next = () => {
    if (total === 0) return;
    setCurrent((prev) => {
      if (prev + 1 >= total) return infinite ? 0 : prev;
      return prev + 1;
    });
  };

  const prev = () => {
    if (total === 0) return;
    setCurrent((prev) => {
      if (prev - 1 < 0) return infinite ? total - 1 : 0;
      return prev - 1;
    });
  };

  useEffect(() => {
    if (!autoplay || total <= 1) return undefined;
    timerRef.current = setInterval(next, interval);
    return () => clearInterval(timerRef.current);
  }, [autoplay, interval, total, current]);

  return { current, goTo, next, prev };
}
