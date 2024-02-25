import { SubAccountsLists } from "@/components/all-subaccounts/subaccount-list";
import { getAllSubAccounts, getCurrentUser } from "@/lib/queries";

export default async function AllSubAccounts({
  params,
}: {
  params: { agencyId: string };
}) {
  const user = await getCurrentUser();
  const subAccounts = await getAllSubAccounts(params.agencyId);

  const subAccountWithPermission = subAccounts?.filter((sub) =>
    sub.Permissions.find((per) => per.email === user?.email)
  );

  return (
    <div className="container py-4">
      <h2 className="text-2xl mb-4">📦Manage Subaccount</h2>
      <SubAccountsLists subAccountWithPermission={subAccountWithPermission} />
    </div>
  );
}
