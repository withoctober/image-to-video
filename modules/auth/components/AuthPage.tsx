import { ColorModeToggle, Logo } from '@common';
import { useTranslation } from 'next-i18next';
import Head from 'next/head';
import Link from 'next/link';
import { ForgotPasswordForm } from './ForgotPasswordForm';
import { ResetPasswordForm } from './ResetPasswordForm';
import { SigninForm } from './SigninForm';
import { SignupForm } from './SignupForm';

export function AuthPage({ view }: { view: 'signin' | 'signup' | 'forgot-password' | 'reset-password' }) {
  const { t } = useTranslation('auth');

  const pageTitle = `${view === 'signin' ? 'Sign in' : 'Sign up'} - aviato.`;

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
      </Head>
      <div className="bg-zinc-100 dark:bg-zinc-800">
        <div className="grid min-h-screen lg:grid-cols-2">
          <div className="flex items-center justify-center bg-white p-12 dark:bg-zinc-900">
            <div className="flex h-full w-full max-w-md flex-col justify-between gap-8">
              <div>
                <Link href="/">&larr; {t('backToHomepage')}</Link>
              </div>

              <div>
                <div className="mb-8">
                  <Logo />
                </div>

                {view === 'signin' && <SigninForm />}
                {view === 'signup' && <SignupForm />}
                {view === 'forgot-password' && <ForgotPasswordForm />}
                {view === 'reset-password' && <ResetPasswordForm />}
              </div>

              <div className="flex items-center justify-between italic text-zinc-400">
                <ColorModeToggle />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
