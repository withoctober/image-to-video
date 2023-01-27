import { useMemo } from 'react';

export enum SigninMode {
  Password = 'password',
  MagicLink = 'magic-link',
}

export default function SigninModeSwitch({
  activeMode,
  onChange,
  className,
}: {
  activeMode: SigninMode;
  onChange: (mode: SigninMode) => void;
  className?: string;
}) {
  const modes = useMemo<Array<{ key: SigninMode; title: string }>>(
    () => [
      {
        key: SigninMode.MagicLink,
        title: 'Magic Link',
      },
      {
        key: SigninMode.Password,
        title: 'Password',
      },
    ],
    []
  );

  return (
    <div className={`${className} flex justify-center w-full border-b-2 border-gray-100 dark:border-gray-700`}>
      {modes.map((mode) => (
        <button
          key={mode.key}
          type="button"
          className={`block px-6 py-2 w-1/2 mb-[-2px] border-b-2  text-sm ${
            mode.key === activeMode
              ? 'border-primary-500 font-bold text-primary-700 dark:text-primary-300'
              : 'border-transparent'
          }`}
          onClick={() => onChange(mode.key)}
        >
          {mode.title}
        </button>
      ))}
    </div>
  );
}
