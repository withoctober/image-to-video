import { SocialSigninButton } from '@auth';
import { Button, Input } from '@common';
import { signIn } from 'next-auth/react';
import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import { useForm } from 'react-hook-form';

export function SignupForm({
  onSignup,
}: {
  onSignup?: (data: { email: string; password: string; name: string }) => Promise<void>;
}) {
  const { t } = useTranslation('auth');
  const { register, handleSubmit } = useForm<{
    email: string;
    password: string;
    name: string;
  }>();

  return (
    <>
      <h1 className="mt-6 text-3xl font-bold">{t('signup.title')}</h1>

      <p className="mt-2 text-gray-500">
        {t('signup.message')} {t('signup.alreadyHaveAccount')}{' '}
        <Link href="/auth/signin">{t('signup.signIn')} &rarr;</Link>
      </p>

      <form
        className="flex flex-col items-stretch gap-4 mt-6"
        onSubmit={(e) => handleSubmit(onSignup ?? (() => {}))(e)}
      >
        <div>
          <label htmlFor="email" className="block mb-1 font-semibold">
            {t('form.fields.name')} *
          </label>
          <Input type="text" {...register('name', { required: true })} required autoComplete="full-name" />
        </div>

        <div>
          <label htmlFor="email" className="block mb-1 font-semibold">
            {t('form.fields.email')} *
          </label>
          <Input type="email" {...register('email', { required: true })} required autoComplete="email" />
        </div>

        <div>
          <label htmlFor="password" className="block mb-1 font-semibold">
            {t('form.fields.password')} *
          </label>
          <Input type="password" {...register('password', { required: true })} required autoComplete="new-password" />
        </div>

        <Button>{t('form.signupButton')} &rarr;</Button>
      </form>

      <div className="flex flex-col w-full max-w-full gap-3 mt-12 md:flex-row">
        <SocialSigninButton provider="google" onClick={() => signIn('google')} />
        <SocialSigninButton provider="twitter" onClick={() => signIn('twitter')} />
        <SocialSigninButton provider="apple" onClick={() => signIn('apple')} />
      </div>
    </>
  );
}
