"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { upserSubAccount, upsertAgency } from "@/lib/queries";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { Switch } from "../ui/switch";
import UploadFile from "../upload-file";
import { Agency } from "@prisma/client";
import { useModal } from "@/providers/modal-provider";

const formSchema = z.object({
  name: z.string().min(2),
  subAccountLogo: z.string().min(2),
  companyEmail: z.string().min(2),
  companyPhone: z.string().min(2),
  address: z.string().min(2),
  city: z.string().min(2),
  zipCode: z.string().min(2),
  state: z.string().min(2),
  country: z.string().min(2),
});

type FormSchema = z.infer<typeof formSchema>;

interface AgencyDetails {
  agencyId: string;
}

export function SubAccountDetails({ agencyId }: AgencyDetails) {
  const [updating, setIsUpdating] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const data = useModal();
  // ...
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      subAccountLogo: "",
      companyEmail: "",
      companyPhone: "",
      address: "",
      city: "",
      zipCode: "",
      state: "",
      country: "",
    },
  });

  async function onSubmit(values: FormSchema) {
    try {
      setIsUpdating(true);
      // Create agency
      const subAccountData = await upserSubAccount({
        subAccount: {
          ...values,
          id: uuidv4(),
          connectAccountId: null,
          createdAt: new Date(),
          updatedAt: new Date(),
          goal: 0,
          agencyId,
        },
      });

      if (subAccountData?.error) {
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: `${subAccountData.error}`,
        });
      }

      if (subAccountData?.status === "updated") {
        toast({
          title: `✅ Sub Account updated!`,
          description: `Updated sub account at ${new Date().toLocaleDateString()}`,
        });
      }

      if (subAccountData.status === "success" && subAccountData?.response) {
        toast({
          title: `🏫 Sub Account, ${subAccountData?.response.name} created`,
          description: `${
            subAccountData.response.name
          } at ${new Date().toLocaleDateString()}`,
        });
      }

      router.refresh();
      data?.onClose();
    } catch (err) {
      console.log(err);
    } finally {
      setIsUpdating(false);
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 h-[30rem] overflow-y-scroll p-1"
      >
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="subAccountLogo"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormControl>
                  <UploadFile {...field} endpoint="imageUploader" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex flex-col gap-4 md:flex-row">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Agency Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Name" {...field} disabled={updating} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="companyEmail"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Agency Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Email" {...field} disabled={updating} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="companyPhone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Company Number</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Phone number"
                    {...field}
                    disabled={updating}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="123 Street"
                    {...field}
                    disabled={updating}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex flex-col gap-4 md:flex-row">
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>City</FormLabel>
                  <FormControl>
                    <Input placeholder="City" {...field} disabled={updating} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="state"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>State</FormLabel>
                  <FormControl>
                    <Input placeholder="State" {...field} disabled={updating} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="zipCode"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Zip Code</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Zip Code"
                      {...field}
                      disabled={updating}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="country"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Country</FormLabel>
                <FormControl>
                  <Input placeholder="Country" {...field} disabled={updating} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex">
          <Button type="submit" disabled={updating} className="ml-auto">
            Save Sub Account Information
          </Button>
        </div>
      </form>
    </Form>
  );
}
