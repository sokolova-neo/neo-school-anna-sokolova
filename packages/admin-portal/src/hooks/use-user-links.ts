export interface UseUserLinks {
  overviewLink: string;
  transactionsLink: string;
}

const useUserLinks = ({ id }: { id: string }): UseUserLinks => {
  const overviewLink = `/users/${id}/details`;
  const transactionsLink = `/users/${id}/transactions`;

  return {
    overviewLink,
    transactionsLink,
  };
};

export { useUserLinks };
