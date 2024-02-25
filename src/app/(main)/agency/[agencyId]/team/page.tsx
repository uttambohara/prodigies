import { prisma } from "@/lib/prisma";
import { columns } from "./columns";
import { DataTable } from "./data-table";

export default async function Team({
  params,
}: {
  params: { agencyId: string };
}) {
  const { agencyId } = params;
  const data = await prisma.user.findMany({
    where: {
      agencyId,
    },
    include: {
      Permissions: true,
      Agency: {
        include: {
          SubAccount: true,
        },
      },
    },
  });
  return (
    <div className="container py-6">
      <DataTable columns={columns} data={data} agencyId={params.agencyId} />
    </div>
  );
}
