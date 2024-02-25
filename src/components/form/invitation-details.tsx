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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Role } from "@prisma/client";
import { createInvitation } from "@/lib/queries";
import { useState } from "react";
import { useToast } from "../ui/use-toast";
import { clerkClient } from "@clerk/nextjs";
import { useModal } from "@/providers/modal-provider";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  email: z.string().min(2),
  role: z.nativeEnum(Role),
});

type FormSchema = z.infer<typeof formSchema>;
export function InvitationDetails({ agencyId }: { agencyId: string }) {
  const { toast } = useToast();
  const [isUpdating, setIsUpdating] = useState(false);
  const data = useModal();
  const router = useRouter();
  // ...
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      role: "SUBACCOUNT_USER",
    },
  });

  async function onSubmit(values: FormSchema) {
    try {
      setIsUpdating(true);

      const invitation = await createInvitation(agencyId, values);

      if (invitation.status === "success") {
        toast({
          title: "🥳Invitaiton sent",
          description: ` Invitation sent to ${invitation.response?.email}`,
        });
      }

      if (invitation.error) {
        toast({
          variant: "destructive",
          description: `${invitation.error}`,
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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="Email" {...field} disabled={isUpdating} />
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
                <FormLabel>Role</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={isUpdating}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(Role).map(([key, value]) => {
                        if (value === "AGENCY_OWNER") return null;
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
        </div>

        <Button type="submit" disabled={isUpdating} className="w-full">
          Send invitation
        </Button>
      </form>
    </Form>
  );
}
