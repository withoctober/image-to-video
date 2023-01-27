import { SocialSigninButton } from '@auth';
import { Button, Input } from '@common';
import { signIn } from 'next-auth/react';
import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import SigninModeSwitch, { SigninMode } from './SigninModeSwitch';

export function SigninForm() {
  const { t } = useTranslation('auth');
  const [signinMode, setSigninMode] = useState(SigninMode.MagicLink);

  const { register, handleSubmit } = useForm<{
    email: string;
    password?: string;
  }>();

  return (
    <>
      <h1 className="mt-6 text-3xl font-bold">Welcome back</h1>

      <p className="mt-2 text-gray-500">
        Welcome to awesome.saas. Please enter your credentials, to sign in. Don&quot;t have an account yet?{' '}
        <Link href="/auth/signup">Create new account &rarr;</Link>
      </p>

      <SigninModeSwitch activeMode={signinMode} onChange={setSigninMode} className="mt-4" />

      <form className="flex flex-col items-stretch gap-4 mt-6" onSubmit={(e) => handleSubmit(() => {})(e)}>
        <div>
          <label htmlFor="email" className="block mb-1 font-semibold">
            {t('form.fields.email')}
          </label>
          <Input type="email" {...register('email', { required: true })} required autoComplete="email" />
        </div>

        {signinMode === 'password' && (
          <div>
            <label htmlFor="password" className="block mb-1 font-semibold">
              {t('form.fields.password')}
            </label>
            <Input
              type="password"
              {...register('password', { required: true })}
              required
              autoComplete="current-password"
            />
          </div>
        )}

        <Button>{t('form.signinButton')} &rarr;</Button>
      </form>

      <div className="flex flex-col w-full max-w-full gap-3 mt-12 md:flex-row">
        <SocialSigninButton provider="google" onClick={() => signIn('google')} />
        <SocialSigninButton provider="twitter" onClick={() => signIn('twitter')} />
        <SocialSigninButton provider="apple" onClick={() => signIn('apple')} />
      </div>
    </>
  );
}
