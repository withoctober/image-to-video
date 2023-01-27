import { AuthView } from '@auth';
import { ColorModeToggle, Logo } from '@common';
import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import { SigninForm } from './SigninForm';
import { SignupForm } from './SignupForm';

export function AuthForm({ view }: { view: AuthView }) {
  const { t } = useTranslation('auth');
  return (
    <div className="flex flex-col justify-between w-full h-full max-w-lg gap-6">
      <div>
        <Link href="/">&larr; {t('backToHomepage')}</Link>
      </div>

      <div>
        <Logo />

        {view === 'signin' && <SigninForm />}
        {view === 'signup' && <SignupForm />}
      </div>

      <div className="flex items-center justify-between italic text-gray-400">
        <p>© by awesome.saas</p>

        <ColorModeToggle />
      </div>
    </div>
  );
}
