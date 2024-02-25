import { getCurrentUser, verifyAndAcceptInvitation } from "@/lib/queries";
import { redirect } from "next/navigation";

export default async function SubAccount() {
  //
  const agency = await verifyAndAcceptInvitation();
  if (!agency) return <div>Unauthorized</div>;

  const user = await getCurrentUser();
  if (!user) return redirect("/sign-in");

  const subAccountDefault = user.Agency?.SubAccount[0];
  return redirect(`/subaccount/${subAccountDefault?.id}`);
}
