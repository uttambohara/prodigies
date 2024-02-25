"use server";
import { clerkClient, currentUser } from "@clerk/nextjs";
import { Agency, Prisma, SubAccount, User } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";
import { prisma } from "./prisma";

export async function saveActivityLogNotification({
  agencyId,
  subAccountId,
  notification,
}: {
  agencyId?: string;
  subAccountId?: string;
  notification: string;
}) {
  const user = await getCurrentUser();
  if (!user) return null;
  if (!agencyId) {
    if (!subAccountId) {
      throw new Error("Either agencyId or subAccountId should exist!");
    }
    const response = await prisma.notification.create({
      data: {
        notification,
        agencyId: agencyId!,
        subAccountId,
        userId: user.id,
      },
    });
    return response;
  } else {
    const response = await prisma.notification.create({
      data: {
        notification,
        agencyId,
        subAccountId,
        userId: user.id,
      },
    });
    return response;
  }
}

export async function getCurrentUser() {
  const authUser = await currentUser();
  if (!authUser) return null;
  const response = await prisma.user.findFirst({
    where: {
      email: authUser.emailAddresses[0].emailAddress,
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

  return response;
}

export async function createTeamUser(values: User) {
  const response = await prisma.user.create({
    data: {
      ...values,
    },
  });
  return response;
}

export async function verifyAndAcceptInvitation() {
  const authUser = await currentUser();
  if (!authUser) return null;
  const invitationExists = await prisma.invitation.findFirst({
    where: {
      email: authUser.emailAddresses[0].emailAddress,
      status: "PENDING",
    },
  });

  if (invitationExists) {
    await createTeamUser({
      id: uuidv4(),
      name: `${authUser.firstName} ${authUser.lastName}`,
      avatarUrl: authUser.imageUrl,
      email: authUser.emailAddresses[0].emailAddress,
      createdAt: new Date(),
      updatedAt: new Date(),
      role: invitationExists.role,
      agencyId: invitationExists.agencyId,
    });

    await saveActivityLogNotification({
      agencyId: invitationExists.agencyId,
      notification: `Invitation of ${authUser.firstName} ${authUser.lastName} accepted!`,
      subAccountId: undefined,
    });

    await prisma.invitation.delete({
      where: {
        id: invitationExists.id,
      },
    });
    const agency = await prisma.agency.findFirst({
      where: {
        id: invitationExists.id,
      },
    });
    return agency;
  } else {
    const agency = await prisma.agency.findFirst({
      where: {
        users: {
          some: {
            email: authUser.emailAddresses[0].emailAddress,
          },
        },
      },
    });

    return agency;
  }
}

export async function upsertAgency({ agency }: { agency: Agency }) {
  const user = await currentUser();
  if (!user) return { error: "Unauthorized!" };

  const response = await prisma.agency.upsert({
    where: {
      id: agency.id,
    },
    update: agency,
    create: {
      ...agency,
      SidebarOption: {
        create: [
          {
            name: "Dashboard",
            icon: "category",
            link: `/agency/${agency.id}`,
          },
          {
            name: "Launchpad",
            icon: "clipboardIcon",
            link: `/agency/${agency.id}/launchpad`,
          },
          {
            name: "Billing",
            icon: "payment",
            link: `/agency/${agency.id}/billing`,
          },
          {
            name: "Settings",
            icon: "settings",
            link: `/agency/${agency.id}/settings`,
          },
          {
            name: "Sub Accounts",
            icon: "person",
            link: `/agency/${agency.id}/all-subaccounts`,
          },
          {
            name: "Team",
            icon: "shield",
            link: `/agency/${agency.id}/team`,
          },
        ],
      },
      users: {
        create: {
          name: `${user.firstName} ${user.lastName}`,
          email: user.emailAddresses[0].emailAddress,
          avatarUrl: user.imageUrl,
          role: "AGENCY_OWNER",
        },
      },
    },
    include: {
      users: true,
    },
  });

  if (agency.id) return { status: "updated" };
  return { status: "success", response };
}

export async function getAgencyDetails(agencyId: string) {
  const details = await prisma.agency.findFirst({
    where: {
      id: agencyId,
    },
    include: {
      SidebarOption: true,
      SubAccount: {
        include: {
          Permissions: true,
        },
      },
      users: true,
    },
  });
  return details;
}

export async function getSubAccountDetails(subAccountId: string) {
  const response = await prisma.subAccount.findFirst({
    where: {
      id: subAccountId,
    },
    include: {
      Agency: true,
      Permissions: true,
      SidebarOption: true,
    },
  });
  return response;
}

export async function updateUser({ user }: { user: User }) {
  const response = await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      ...user,
    },
  });

  return { status: "success", response };
}

export async function createInvitation(
  agencyId: string,
  values: Prisma.InvitationCreateWithoutAgencyInput
) {
  const invitationExists = await prisma.invitation.findFirst({
    where: {
      email: values.email,
    },
  });
  if (invitationExists) return { error: "Invitaiton already exists!" };

  //
  const response = await prisma.invitation.create({
    data: {
      email: values.email,
      role: values.role,
      agencyId,
      status: "PENDING",
    },
  });

  return { status: "success", response };
}

export async function upserSubAccount({
  subAccount,
}: {
  subAccount: SubAccount;
}) {
  const user = await currentUser();
  if (!user) return { error: "Unauthorized!" };

  const response = await prisma.subAccount.upsert({
    where: {
      id: subAccount.id,
    },
    update: subAccount,
    create: {
      ...subAccount,
      SidebarOption: {
        create: [
          {
            name: "Launchpad",
            icon: "clipboardIcon",
            link: `/subaccount/${subAccount.id}/launchpad`,
          },
          {
            name: "Settings",
            icon: "settings",
            link: `/subaccount/${subAccount.id}/settings`,
          },
          {
            name: "Funnels",
            icon: "pipelines",
            link: `/subaccount/${subAccount.id}/funnels`,
          },
          {
            name: "Media",
            icon: "database",
            link: `/subaccount/${subAccount.id}/media`,
          },
          {
            name: "Automations",
            icon: "chip",
            link: `/subaccount/${subAccount.id}/automations`,
          },
          {
            name: "Pipelines",
            icon: "flag",
            link: `/subaccount/${subAccount.id}/pipelines`,
          },
          {
            name: "Contacts",
            icon: "person",
            link: `/subaccount/${subAccount.id}/contacts`,
          },
          {
            name: "Dashboard",
            icon: "category",
            link: `/subaccount/${subAccount.id}`,
          },
        ],
      },
      Permissions: {
        create: {
          access: true,
          email: user.emailAddresses[0].emailAddress,
        },
      },
      Pipeline: {
        create: { name: "Lead Cycle" },
      },
    },
  });

  if (subAccount.id) return { status: "updated" };
  return { status: "success", response };
}

export async function getAllSubAccounts(agencyId: string) {
  const response = await prisma.subAccount.findMany({
    where: {
      agencyId,
    },
    include: {
      Agency: true,
      Permissions: true,
    },
  });

  return response;
}

export async function deleteSubAccount(subAccountId: string) {
  const user = await getCurrentUser();
  if (!user) return null;
  if (user.role !== "AGENCY_OWNER") return { error: "Unauthorized!" };

  const response = await prisma.subAccount.delete({
    where: {
      id: subAccountId,
    },
  });

  return { status: "success" };
}

export async function upsertPermission({
  permissionId,
  access,
  email,
  subAccountId,
}: {
  permissionId: string;
  access: boolean;
  email: string;
  subAccountId: string;
}) {
  const response = await prisma.permissions.upsert({
    where: {
      id: permissionId || uuidv4(),
    },
    update: {
      access,
    },
    create: {
      access,
      email,
      subAccountId,
    },
  });

  return { status: "success", response };
}

export async function getUser(userid: string) {
  const response = await prisma.user.findFirst({
    where: {
      id: userid,
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

  return response;
}
