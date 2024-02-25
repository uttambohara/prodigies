import {
  getAgencyDetails,
  getCurrentUser,
  getSubAccountDetails,
} from "@/lib/queries";
import {
  AgencySidebarOption,
  Prisma,
  SubAccount,
  SubAccountSidebarOption,
} from "@prisma/client";
import SidebarDetails from "./sidebar-details";

interface SubAccountProps {
  type: "subaccount";
  subAccountId: string;
  agencyId: string;
}
interface AgencyProps {
  type: "agency";
  agencyId: string;
}
type SidebarProps = SubAccountProps | AgencyProps;

export default async function Sidebar(props: SidebarProps) {
  const user = await getCurrentUser();
  // Agency
  let details:
    | Prisma.PromiseReturnType<typeof getAgencyDetails>
    | Prisma.PromiseReturnType<typeof getSubAccountDetails>;
  let logo: string | undefined;
  let subAccounts:
    | ({
        Permissions: {
          id: string;
          email: string;
          subAccountId: string;
          access: boolean;
        }[];
      } & SubAccount)[]
    | undefined;

  let sidebarOptions:
    | AgencySidebarOption[]
    | SubAccountSidebarOption[]
    | undefined;

  if (props.type === "agency") {
    details = await getAgencyDetails(props.agencyId);
    logo = details?.whiteLabel ? details.agencyLogo : "/assets/plura-logo.svg";
    subAccounts = details?.SubAccount.filter((sub) =>
      sub.Permissions.find((per) => per.email === user?.email)
    );
    sidebarOptions = details?.SidebarOption;
  } else {
    details = await getSubAccountDetails(props.subAccountId);
    logo = details?.subAccountLogo;
    sidebarOptions = details?.SidebarOption;
  }

  return (
    <>
      <SidebarDetails
        details={details!}
        logo={logo}
        sidebarOptions={sidebarOptions}
        subAccounts={subAccounts}
        agencyId={props.agencyId}
      />
    </>
  );
}
