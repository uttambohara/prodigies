import { AgencyDetails } from "@/components/form/agency-details";
import { UserDetails } from "@/components/form/user-details";

import FormHeading from "@/components/heading/form-heading";
import { getCurrentUser } from "@/lib/queries";
import { redirect } from "next/navigation";

export default async function Settings() {
  const user = await getCurrentUser();
  if (!user) return redirect("/sign-in");

  return (
    <div className="container py-6">
      <div className="md:flex-row flex flex-col gap-6">
        <div className="flex-1 border border-slate-200 p-6 rounded-md bg-card dark:border-zinc-200/10">
          <FormHeading
            title={"👋 Agency Information"}
            description={"Please enter agency details!"}
          />
          <AgencyDetails agency={user.Agency} />
        </div>

        <div className="flex-1 border border-slate-200 p-6 rounded-md bg-card dark:border-zinc-200/10">
          <FormHeading
            title={"🙋‍♂️ User Details"}
            description={"Add or update your information!"}
          />
          <UserDetails user={user} />
        </div>
      </div>
    </div>
  );
}
