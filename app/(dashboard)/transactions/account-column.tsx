import { useAccount } from "@/features/accounts/hooks/use-account";

type Props = {
  account: string;
  accountId: string | null;
};

export const AccountColumn = ({ account, accountId }: Props) => {
  const { openModal } = useAccount();

  const onClick = () => {
    if (accountId) openModal(accountId);
  };
  return (
    <div
      onClick={onClick}
      className="flex cursor-pointer items-center hover:underline"
    >
      {account}
    </div>
  );
};
