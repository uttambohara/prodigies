"use client";

import CustomModal from "@/components/custom-modal";
import { UserDetails } from "@/components/form/user-details";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getCurrentUser, getUser } from "@/lib/queries";
import { useModal } from "@/providers/modal-provider";
import { Prisma, Role } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import clsx from "clsx";
import {
  ArrowUpDown,
  Edit,
  MoreHorizontal,
  Paperclip,
  Trash,
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

type UserType = Prisma.PromiseReturnType<typeof getCurrentUser>;

export const columns: ColumnDef<UserType>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const userData = row.original;
      return (
        <div className="flex items-center gap-2">
          <div className="relative h-12 w-12 shrink-0">
            <Image
              src={userData?.avatarUrl!}
              alt={"User Avatar"}
              fill
              priority
              className="object-cover rounded-full"
            />
          </div>
          <div>
            <h2>{userData?.name}</h2>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "email",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Email
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "accounts",
    header: "Owned Accounts",
    cell: ({ row }) => {
      const userData = row.original;
      const isOwner = userData?.role === Role.AGENCY_OWNER;

      if (isOwner) {
        return (
          <Badge>
            🙋‍♂️ Owner of agency -
            <span className="italic"> {userData?.Agency?.name}</span>
          </Badge>
        );
      }

      // Sub account user

      return <Badge variant={"outline"}>💅 Not registered</Badge>;
    },
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => {
      const userData = row.original;

      return (
        <div
          className={clsx("px-3 py-1 rounded-full text-white text-xs w-fit", {
            "bg-green-600": userData?.role === Role.AGENCY_OWNER,
            "bg-red-500": userData?.role === Role.AGENCY_ADMIN,
            "bg-gray-600": userData?.role === Role.SUBACCOUNT_GUEST,
            "bg-orange-600": userData?.role === Role.SUBACCOUNT_USER,
          })}
        >
          {clsx({
            "Agency Owner": userData?.role === Role.AGENCY_OWNER,
            "Agency Admin": userData?.role === Role.AGENCY_ADMIN,
            "Subaccount Guest": userData?.role === Role.SUBACCOUNT_GUEST,
            "Subaccount User": userData?.role === Role.SUBACCOUNT_USER,
          })}
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const [open, setOpen] = useState(false);
      const userData = row.original;
      const data = useModal();

      return (
        <AlertDialog>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => {
                  navigator.clipboard.writeText(userData?.email!);
                }}
                className="flex items-center gap-2"
              >
                <Paperclip size={14} />
                <span> Copy email</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex items-center gap-2">
                <button
                  onClick={() =>
                    data?.onOpen(
                      <CustomModal
                        title={"User details"}
                        description={"Edit your user details!"}
                      >
                        <UserDetails user={userData!} />
                      </CustomModal>,
                      async function () {
                        return { user: await getUser(userData?.id!) };
                      }
                    )
                  }
                  className="flex items-center gap-2"
                >
                  <Edit size={14} />
                  <span> Edit details</span>
                </button>
              </DropdownMenuItem>

              <AlertDialogTrigger asChild>
                <DropdownMenuItem
                  className="flex items-center gap-2"
                  onClick={() => {}}
                >
                  <Trash size={14} />
                  <span> Remove user</span>
                </DropdownMenuItem>
              </AlertDialogTrigger>
            </DropdownMenuContent>
          </DropdownMenu>

          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the
                user from the server!
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction className="bg-red-700">
                Continue
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      );
    },
  },
];
