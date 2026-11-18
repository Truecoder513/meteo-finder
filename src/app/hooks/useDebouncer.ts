import { useEffect, useState } from "react";

/**
 * Renvoie `value` seulement quand elle n'a plus changé pendant `delay` ms,
 * c'est-à-dire quand l'utilisateur a fini de taper.
 *
 * @example
 * const debouncedQuery = useDebouncer(query, 400);
 * useEffect(() => { search(debouncedQuery) }, [debouncedQuery]);
 */
export function useDebouncer<T>(value: T, delay = 400): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    // Chaque frappe annule le minuteur précédent.
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}
