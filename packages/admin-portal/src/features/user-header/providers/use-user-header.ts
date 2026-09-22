import { useRouter } from 'next/navigation';

import { getTimezoneOffsetByProvince } from '../../../lib/timezone';
import { formatName } from '../../../lib/formatter';

import {
  useUserDetailsQuery,
  mapToUser,
} from '../../user-details/api/use-user-details-query';

export interface UseUserHeaderResult {
  onExit: VoidFunction;
  timeZoneText: string;
  displayName: string;
  loading: boolean;
  error?: Error;
}

const useUserHeader = ({ userId }: { userId: string }): UseUserHeaderResult => {
  const router = useRouter();

  const { error, loading, data } = useUserDetailsQuery({
    variables: {
      input: userId,
    },
  });

  const onExit = () => {
    router.push('/');
  };

  const timeZoneText = data?.user?.province
    ? `${'Dates will be displayed in'} ${getTimezoneOffsetByProvince(data?.user?.province)}`
    : 'Customer timezone could not be determined - Dates will be displayed in UTC';

  return {
    onExit,
    timeZoneText,
    displayName: data?.user ? formatName(mapToUser(data.user)) : '',
    loading,
    error,
  };
};

export { useUserHeader };
