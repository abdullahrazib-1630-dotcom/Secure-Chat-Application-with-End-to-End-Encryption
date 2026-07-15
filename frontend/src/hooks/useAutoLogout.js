import { useEffect } from 'react';

const useAutoLogout = (onLogout, timeoutMs = 15 * 60 * 1000) => {
  useEffect(() => {
    let timer;
    const reset = () => {
      clearTimeout(timer);
      timer = setTimeout(() => onLogout?.(), timeoutMs);
    };

    ['click', 'keydown', 'mousemove', 'scroll'].forEach((event) => window.addEventListener(event, reset));
    reset();

    return () => {
      clearTimeout(timer);
      ['click', 'keydown', 'mousemove', 'scroll'].forEach((event) => window.removeEventListener(event, reset));
    };
  }, [onLogout, timeoutMs]);
};

export default useAutoLogout;
