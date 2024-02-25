"use client";
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
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { deleteSubAccount, getAllSubAccounts } from "@/lib/queries";
import { Prisma } from "@prisma/client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";
import { Button } from "../ui/button";
import { useToast } from "../ui/use-toast";

type SubAccountsListsProps = {
  subAccountWithPermission: Prisma.PromiseReturnType<typeof getAllSubAccounts>;
};

export function SubAccountsLists({
  subAccountWithPermission,
}: SubAccountsListsProps) {
  const [open, setOpen] = React.useState(false);
  const [isUpdating, setIsUpdating] = React.useState(false);
  const { toast } = useToast();
  const router = useRouter();

  async function handleDelete(subAccountId: string) {
    try {
      setIsUpdating(true);
      const response = await deleteSubAccount(subAccountId);
      if (response?.status === "success") {
        toast({
          title: "Subaccount deleted!",
        });
      }
      if (response?.error) {
        toast({
          variant: "destructive",
          title: response.error,
        });
      }

      router.refresh();
    } catch (err) {
      console.log(err);
    } finally {
      setIsUpdating(false);
    }
  }

  return (
    <Command>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Sub accounts">
          {subAccountWithPermission.map((subAccount) => (
            <CommandItem key={subAccount.id}>
              <div className="flex items-center gap-2 justify-between w-full">
                <div className="flex items-center gap-2">
                  <div>
                    <Image
                      src={subAccount.subAccountLogo}
                      alt={"Subaccount logo"}
                      height={80}
                      width={80}
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h2>{subAccount.name}</h2>
                    <p className="text-muted-foreground">
                      {subAccount.address}
                    </p>
                  </div>
                </div>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant={"destructive"}>Delete</Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Are you absolutely sure?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently
                        delete your subaccount{" "}
                        <span className="font-bold italic text-xl">
                          <Image
                            src={subAccount.subAccountLogo}
                            alt={"Sub Account logo"}
                            height={80}
                            width={80}
                          />
                        </span>
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel disabled={isUpdating}>
                        Cancel
                      </AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDelete(subAccount.id)}
                        className="bg-red-700"
                        disabled={isUpdating}
                      >
                        Continue
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  );
}
