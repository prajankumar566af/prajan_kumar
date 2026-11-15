import { useEffect, useState } from "react";

/** const { data, loading, error, isEmpty, reload } = useApi(api.projects) */
export function useApi(fetcher) {
  const [state, setState] = useState({ data: null, loading: true, error: null });
  const [tick, setTick] = useState(0);
  useEffect(() => {
    let live = true;
    setState((s) => ({ ...s, loading: true, error: null }));
    fetcher()
      .then((data) => live && setState({ data, loading: false, error: null }))
      .catch((e) => live && setState({ data: null, loading: false, error: e }));
    return () => { live = false; };
  }, [fetcher, tick]);
  const { data } = state;
  return { ...state, isEmpty: !state.loading && !state.error && Array.isArray(data) && data.length === 0, reload: () => setTick((t) => t + 1) };
}
