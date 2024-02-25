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
import { upsertAgency } from "@/lib/queries";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { Switch } from "../ui/switch";
import UploadFile from "../upload-file";
import { Agency } from "@prisma/client";

const formSchema = z.object({
  name: z.string().min(2),
  agencyLogo: z.string().min(2),
  companyEmail: z.string().min(2),
  companyPhone: z.string().min(2),
  whiteLabel: z.boolean(),
  address: z.string().min(2),
  city: z.string().min(2),
  zipCode: z.string().min(2),
  state: z.string().min(2),
  country: z.string().min(2),
});

type FormSchema = z.infer<typeof formSchema>;

interface AgencyDetails {
  agency?: Partial<Agency> | null;
}

export function AgencyDetails({ agency }: AgencyDetails) {
  const [updating, setIsUpdating] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  // ...
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: agency?.name || "",
      agencyLogo: agency?.agencyLogo || "",
      companyEmail: agency?.companyEmail || "",
      companyPhone: agency?.companyPhone || "",
      whiteLabel: agency?.whiteLabel || false,
      address: agency?.address || "",
      city: agency?.city || "",
      zipCode: agency?.zipCode || "",
      state: agency?.state || "",
      country: agency?.country || "",
    },
  });

  async function onSubmit(values: FormSchema) {
    try {
      setIsUpdating(true);
      // Create agency
      const agencyData = await upsertAgency({
        agency: {
          ...values,
          id: agency?.id || uuidv4(),
          connectAccountId: null,
          customerId: "",
          goal: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });

      if (agencyData?.error) {
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: `${agencyData.error}`,
        });
      }

      if (agencyData?.status === "updated") {
        toast({
          title: `✅ Agency updated!`,
          description: `Updated agency at ${new Date().toLocaleDateString()}`,
        });
      }

      if (agencyData.status === "success" && agencyData?.response) {
        toast({
          title: `🏫 Agency, ${agencyData?.response.name} created`,
          description: `${
            agencyData.response.users[0].name
          } at ${new Date().toLocaleDateString()}`,
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
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="agencyLogo"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormControl>
                  <UploadFile endpoint="imageUploader" {...field} />
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
            name="whiteLabel"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                <div className="space-y-0.5">
                  <FormLabel>White label</FormLabel>
                  <FormDescription>
                    Turning on whitelabel mode will show your agency logo to all
                    sub accounts by default. You can overwrite this
                    functionality through sub account settings.
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Address</FormLabel>
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
            Save Agency Information
          </Button>
        </div>
      </form>
    </Form>
  );
}
