import { Button } from '@common';
import { signOut } from 'next-auth/react';
import { AppLayout } from '../../common/components/AppLayout';

export function AdminPage() {
  return (
    <AppLayout>
      <p className="mt-4">Welcome to the admin page</p>

      <Button onClick={() => signOut()}>Sign out</Button>
    </AppLayout>
  );
}
