import { SideNavItem, Box } from '@neofinancial/morpheus-components';
import { usePathname, useRouter } from 'next/navigation';
import { useUserLinks } from '../../hooks/use-user-links';

const UserSidebar = ({ userId }: { userId: string }): React.ReactElement => {
  const pathname = usePathname();
  const { push } = useRouter();
  const { overviewLink, transactionsLink } = useUserLinks({ id: userId });

  return (
    <Box width={276} marginTop="spaceXXL" marginLeft="spaceXL">
      <SideNavItem
        isExpanded
        onClick={() => push(overviewLink)}
        selected={pathname.endsWith('/details')}
        title="Customer details"
      />
      <SideNavItem
        isExpanded
        onClick={() => push(transactionsLink)}
        selected={pathname.endsWith('/transactions')}
        title="Transactions"
      />
    </Box>
  );
};

export { UserSidebar };
