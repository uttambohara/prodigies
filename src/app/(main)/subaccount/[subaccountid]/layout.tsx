import NavInfo from "@/components/header/nav-info";
import Sidebar from "@/components/navigation/sidebar";
import { getSubAccountDetails } from "@/lib/queries";
import React from "react";

export default async function SubAccountPageLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { subAccountId: string };
}) {
  const { subAccountId } = params;
  const agency = await getSubAccountDetails(subAccountId);

  return (
    <div className="grid md:grid-cols-[280px_1fr] h-screen grid-cols-[0px_1fr]  transition-all">
      <div className="border-r border-slate-200 dark:border-zinc-200/10">
        <div className="hidden md:block ">
          <Sidebar
            agencyId={agency?.id!}
            subAccountId={params.subAccountId}
            type={"subaccount"}
          />
        </div>
      </div>

      <div>
        <NavInfo />
        <main className="h-full">{children}</main>
      </div>
    </div>
  );
}
