import NavInfo from "@/components/header/nav-info";
import Sidebar from "@/components/navigation/sidebar";
import React from "react";

export default function AgencyPageLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { agencyId: string };
}) {
  return (
    <div className="grid md:grid-cols-[280px_1fr] h-screen grid-cols-[0px_1fr]  transition-all">
      <div className="border-r border-slate-200 dark:border-zinc-200/10">
        <div className="hidden md:block ">
          <Sidebar agencyId={params.agencyId} type={"agency"} />
        </div>
      </div>

      <div>
        <NavInfo />
        <main>{children}</main>
      </div>
    </div>
  );
}
