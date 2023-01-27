import { AuthPage, AuthView } from '@auth';
import { GetStaticPaths, GetStaticProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

const authViews: AuthView[] = ['signup', 'signin', 'forgot-password', 'reset-password'];

export const getStaticProps: GetStaticProps = async ({ locale, params }) => {
  const view = params?.view as string;

  if (!view || !authViews.includes(view as AuthView)) {
    return {
      redirect: {
        destination: '/',
        permanent: true,
      },
    };
  }

  return {
    props: {
      ...(await serverSideTranslations(locale!, ['common', 'auth'])),
      view,
    },
  };
};

export const getStaticPaths: GetStaticPaths = ({ locales }) => ({
  paths: locales?.map((locale) => authViews.map((view) => ({ params: { view }, locale }))).flat() ?? [],
  fallback: false,
});

const AuthActionPage = ({ view }: { view: AuthView }) => <AuthPage view={view} />;

export default AuthActionPage;
