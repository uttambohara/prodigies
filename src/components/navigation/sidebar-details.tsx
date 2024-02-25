"use client";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { icons } from "@/lib/constants";
import { getAgencyDetails, getSubAccountDetails } from "@/lib/queries";
import {
  AgencySidebarOption,
  Prisma,
  SubAccount,
  SubAccountSidebarOption,
} from "@prisma/client";
import { ChevronsUpDown, Compass } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "../ui/button";
import { useModal } from "@/providers/modal-provider";
import CustomModal from "../custom-modal";
import { SubAccountDetails } from "../form/subaccount-details";

interface SidebarDetailsProps {
  details?:
    | Prisma.PromiseReturnType<typeof getAgencyDetails>
    | Prisma.PromiseReturnType<typeof getSubAccountDetails>;
  logo?: string;
  agencyId: string;
  sidebarOptions?: AgencySidebarOption[] | SubAccountSidebarOption[];
  subAccounts?:
    | ({
        Permissions: {
          id: string;
          email: string;
          subAccountId: string;
          access: boolean;
        }[];
      } & SubAccount)[]
    | undefined;
}

export default function SidebarDetails({
  details,
  agencyId,
  logo,
  sidebarOptions,
  subAccounts,
}: SidebarDetailsProps) {
  const data = useModal();

  return (
    <div className="py-4 px-2 space-y-4">
      <div className="relative h-16 w-full">
        <Image
          src={logo!}
          alt="Logo"
          className="object-contain"
          fill
          priority
        />
      </div>

      <Popover>
        <PopoverTrigger asChild>
          <button className="border w-full rounded-md text-sm px-3 hover:bg-secondary">
            <div className="flex items-center gap-2 justify-between">
              {/* Chevron button */}
              <div className="flex items-center gap-2">
                <Compass />
                <div className="flex flex-col items-start">
                  <div>{details?.name}</div>
                  <div className="text-muted-foreground">
                    {details?.address}
                  </div>
                </div>
              </div>

              <ChevronsUpDown size={18} />
            </div>
          </button>
        </PopoverTrigger>

        <PopoverContent className="w-[22rem] ml-8 px-2">
          <Command>
            <CommandInput placeholder="Type a command or search..." />
            <div className="space-y-3">
              <CommandList>
                <CommandEmpty>No results found.</CommandEmpty>
                <CommandGroup heading="Agency">
                  <CommandItem className="flex items-center gap-4">
                    <div className="relative h-9 w-12">
                      <Image
                        src={logo!}
                        alt={"Logo"}
                        fill
                        priority
                        className="object-contain"
                      />
                    </div>

                    <div>
                      <h2>{details?.name}</h2>
                      <div>{details?.address}</div>
                    </div>
                  </CommandItem>
                </CommandGroup>

                {!!subAccounts?.length && (
                  <CommandGroup heading="Sub Accounts">
                    {subAccounts.map((subAccount) => (
                      <CommandItem
                        key={subAccount.id}
                        className="flex items-center gap-4"
                      >
                        <div className="relative h-9 w-12">
                          <Image
                            src={subAccount.subAccountLogo!}
                            alt={"Logo"}
                            fill
                            priority
                            className="object-contain"
                          />
                        </div>

                        <div>
                          <h2>{subAccount?.name}</h2>
                          <div>{subAccount?.address}</div>
                        </div>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                )}
              </CommandList>

              <Button
                className="w-full"
                onClick={() =>
                  data?.onOpen(
                    <CustomModal
                      title={"Create a subaccount"}
                      description={
                        "You can switch between your agency account and the sub account from the sidebar."
                      }
                    >
                      <SubAccountDetails agencyId={agencyId} />
                    </CustomModal>
                  )
                }
              >
                Create sub accounts
              </Button>
            </div>
          </Command>
        </PopoverContent>
      </Popover>

      <Command className="bg-transparent">
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          {!!sidebarOptions?.length && (
            <CommandGroup>
              {sidebarOptions?.map(
                (item: AgencySidebarOption | SubAccountSidebarOption) => {
                  const iconFound = icons.find(
                    (icon) => icon.value === item.icon
                  );
                  if (!iconFound) return;
                  const displayIcon = <iconFound.path />;
                  return (
                    <CommandItem key={item.id}>
                      <Link
                        href={item.link}
                        className="flex items-center gap-3"
                      >
                        {displayIcon}
                        <div>{item.name}</div>
                      </Link>
                    </CommandItem>
                  );
                }
              )}
            </CommandGroup>
          )}
        </CommandList>
      </Command>
    </div>
  );
}
