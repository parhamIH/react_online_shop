import { useCallback, useEffect, useState } from 'react';

export function useAsyncData(loader, deps = [], defaultValue = null) {
  const [data, setData] = useState(defaultValue);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const run = useCallback(() => {
    let cancelled = false;

    setLoading(true);
    setError(null);

    Promise.resolve(loader())
      .then((result) => {
        if (!cancelled) {
          setData(result);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err);
          setData(defaultValue);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => {
    const cancel = run();
    return cancel;
  }, [run]);

  const refetch = useCallback(() => {
    run();
  }, [run]);

  return { data, loading, error, refetch };
}
