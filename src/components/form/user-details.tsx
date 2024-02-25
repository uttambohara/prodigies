"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getCurrentUser, updateUser, upsertPermission } from "@/lib/queries";
import { useModal } from "@/providers/modal-provider";
import { Prisma, Role } from "@prisma/client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Switch } from "../ui/switch";
import { useToast } from "../ui/use-toast";
import UploadFile from "../upload-file";
import CustomModal from "../custom-modal";

const formSchema = z.object({
  name: z.string().min(2),
  avatarUrl: z.string().min(2),
  email: z.string().min(2),
  role: z.nativeEnum(Role),
});

type FormSchema = z.infer<typeof formSchema>;

interface UserDetailsProps {
  user: Prisma.PromiseReturnType<typeof getCurrentUser>;
}

export function UserDetails({ user }: UserDetailsProps) {
  const { toast } = useToast();
  const router = useRouter();
  const data = useModal();

  console.log({ user });

  // ...
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: data?.data?.user?.name || user?.name || "",
      avatarUrl: data?.data?.user?.avatarUrl || user?.avatarUrl || "",
      email: data?.data?.user?.email || user?.email || "",
      role: data?.data?.user?.role || user?.role || Role.AGENCY_OWNER,
    },
  });

  async function onSubmit(values: FormSchema) {
    try {
      const userData = await updateUser({
        user: {
          ...values,
          id: user?.id || uuidv4(),
          createdAt: new Date(),
          updatedAt: new Date(),
          agencyId: user?.agencyId!,
        },
      });
      if (userData.status === "success") {
        toast({
          title: `🙋‍♂️ User details Updated`,
          description: `Updated ${
            user?.name
          } details at ${new Date().toLocaleDateString()}`,
        });
      }

      router.refresh();
      data?.onClose();
    } catch (err) {
      console.log(err);
    }
  }

  async function handleChange({
    access,
    permissionId,
    email,
    subAccountId,
  }: {
    access: boolean;
    permissionId: string;
    email: string;
    subAccountId: string;
  }) {
    //

    try {
      const permission = await upsertPermission({
        access,
        permissionId,
        email,
        subAccountId,
      });

      if (permission?.status === "success") {
        toast({
          title: "Success",
          description: "The request was successfull",
        });
      }

      router.refresh();
      data?.onOpen(
        <CustomModal
          title={"User details"}
          description={"Edit your user details!"}
        >
          <UserDetails user={permission.user} />
        </CustomModal>
      );
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <div className="space-y-3">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="avatarUrl"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <UploadFile
                    endpoint={"imageUploader"}
                    {...field}
                    type="user"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="shadcn" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="Your email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>User role</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    disabled={user?.role === "AGENCY_OWNER"}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder={user?.role} />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(Role).map(([key, value]) => {
                        const isAgencyOwner = user?.role === "AGENCY_OWNER";
                        if (isAgencyOwner && value === "AGENCY_OWNER") return;
                        return (
                          <SelectItem key={key} value={value}>
                            {value}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex">
            <Button type="submit" className="ml-auto">
              Save User Information
            </Button>
          </div>
        </form>
      </Form>

      {/* Fetature: assigning role*/}
      {user?.role !== "AGENCY_OWNER" && (
        <Card>
          <CardHeader>
            <div className="text-sm">
              <h3>User permission!</h3>
              <p className="text-muted-foreground">
                You can give sub Account access to team members by turning on
                the access control for each subAccounts
              </p>
            </div>
          </CardHeader>
          <CardContent>
            {user?.Agency?.SubAccount.map((sub) => {
              const access = user.Permissions.find(
                (perm) => perm.subAccountId === sub.id
              );

              const mainAccess = user.Permissions[0].access || access?.access;
              const permissionId = access?.id!;

              return (
                <div className="flex justify-between space-y-2" key={sub.id}>
                  <div className="text-sm font-bold">
                    <Image
                      src={sub.subAccountLogo}
                      alt={"Sub acocunt logo"}
                      height={80}
                      width={80}
                    />
                  </div>
                  <Switch
                    checked={mainAccess || false}
                    onCheckedChange={() =>
                      handleChange({
                        access: !mainAccess,
                        permissionId,
                        email: user.email,
                        subAccountId: sub.id,
                      })
                    }
                  />
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
