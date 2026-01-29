import { useState, useEffect } from "react";

export default function useDebounce<T>(value: T, time: number) {
  const [debounceValue, setDebounceValue] = useState<T>(value);
  useEffect(() => {
    const id = setTimeout(() => {
      setDebounceValue(value);
    }, time)
    return () => {
      clearTimeout(id);
    }
  }, [value, time]);
  return debounceValue
}