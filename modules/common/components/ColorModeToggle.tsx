import { useTheme } from 'next-themes';
import { FaMoon, FaSun } from 'react-icons/fa';
import { Button } from './Button';

export function ColorModeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <Button intent="primary-ghost" onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
      <FaMoon className="block dark:hidden" />
      <FaSun className="hidden dark:block" />
    </Button>
  );
}
