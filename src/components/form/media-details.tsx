"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";
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
import { createMedia } from "@/lib/queries";
import { useModal } from "@/providers/modal-provider";
import { useState } from "react";
import { useToast } from "../ui/use-toast";
import UploadFile from "../upload-file";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  name: z.string().min(2),
  link: z.string().min(2),
});

type FormSchema = z.infer<typeof formSchema>;

export function MediaDetails({ subaccountid }: { subaccountid: string }) {
  const [updating, setUpdating] = useState(false);
  const data = useModal();
  const { toast } = useToast();
  const router = useRouter();
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      link: "",
    },
  });

  async function onSubmit(value: FormSchema) {
    try {
      setUpdating(true);
      const media = await createMedia({
        media: {
          id: uuidv4(),
          type: null,
          name: value.name,
          link: value.link,
          subAccountId: subaccountid as string,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });

      toast({
        title: "📸 Media uploaded!",
        description: `Media, ${media.response.name} updated!`,
      });

      router.refresh();
      data?.onClose();
    } catch (err) {
      console.log(err);
    } finally {
      setUpdating(false);
    }
  }
  // ...

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>File name</FormLabel>
              <FormControl>
                <Input
                  placeholder="Agency name"
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
          name="link"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Media file</FormLabel>
              <FormControl>
                <UploadFile endpoint={"imageUploader"} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={updating}>
          Update media
        </Button>
      </form>
    </Form>
  );
}
