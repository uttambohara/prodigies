import { AgencyDetails } from "@/components/form/agency-details";
import FormHeading from "@/components/heading/form-heading";
import { getCurrentUser, verifyAndAcceptInvitation } from "@/lib/queries";
import { redirect } from "next/navigation";

export default async function Agency() {
  // user/ agency
  const agency = await verifyAndAcceptInvitation();
  const user = await getCurrentUser();

  if (agency) {
    if (user?.role === "SUBACCOUNT_GUEST" || user?.role === "SUBACCOUNT_USER") {
      return redirect(`/agency/${agency.id}/subaccount`);
    }

    if (user?.role === "AGENCY_ADMIN" || user?.role === "AGENCY_OWNER") {
      return redirect(`/agency/${agency.id}`);
    }
  }

  return (
    <div className="container max-w-screen-md space-y-6 py-6">
      <FormHeading
        title={"Create an agency"}
        description={
          "Lets create an agency for your business. You can edit agency settings later from the agency settings tab."
        }
      />
      <AgencyDetails />
    </div>
  );
}
