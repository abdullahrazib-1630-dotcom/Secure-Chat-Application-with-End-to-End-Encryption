import { useEffect, useState } from 'react';

const useTheme = () => {
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('theme', theme);
  }, [theme]);

  return { theme, setTheme, toggleTheme: () => setTheme((t) => (t === 'dark' ? 'light' : 'dark')) };
};

export default useTheme;
