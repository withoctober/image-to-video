import { Button } from '@common';
import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import { AppLayout } from '../../common/components/AppLayout';

export function DashboardPage() {
  const { data: session } = useSession();

  return (
    <AppLayout>
      <p className="mt-4">Welcome to the dashboard</p>

      <Link href="/admin">Admin &rarr;</Link>

      <Button onClick={() => signOut()}>Sign out</Button>
    </AppLayout>
  );
}
