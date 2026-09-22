'use client';

import { UserDetails } from '../../../../features/user-details/user-details';

export default function UserPage({ params }: { params: { id: string } }) {
  return <UserDetails userId={params.id} />;
}
