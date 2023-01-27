import { AuthForm } from '@auth';
import Head from 'next/head';

export function AuthPage({ view }: { view: 'signin' | 'signup' | 'forgot-password' | 'reset-password' }) {
  const pageTitle = `${view === 'signin' ? 'Sign in' : 'Sign up'} - awesome.saas`;
  return (
    <>
      <Head>
        <title>{pageTitle}</title>
      </Head>
      <div className="bg-gray-100 dark:bg-gray-800">
        <div className="grid min-h-screen lg:grid-cols-2">
          <div className="flex items-center justify-center p-12 bg-white dark:bg-gray-900">
            <AuthForm view={view} />
          </div>
        </div>
      </div>
    </>
  );
}
