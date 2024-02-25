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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { deleteMedia } from "@/lib/queries";
import { Media } from "@prisma/client";
import { format } from "date-fns";
import { FolderOpen, MoreHorizontal, Paperclip, Trash } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { toast } from "../ui/use-toast";
import { useRouter } from "next/navigation";

interface MediaContentProps {
  media: Media[];
}

export default function MediaContent({ media }: MediaContentProps) {
  const [active, setActive] = useState("");
  const router = useRouter();

  async function handleDelete(mediaId: string) {
    try {
      const response = await deleteMedia(mediaId);
      if (response.status === "success") {
        toast({ title: "Media deleted!" });
      }
      router.refresh();
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <AlertDialog>
      <Command className="bg-transparent">
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty className="flex justify-center mt-4">
            <div className="flex items-center gap-2 text-2xl text-muted-foreground">
              <FolderOpen />
              <div>No file found!</div>
            </div>
          </CommandEmpty>
          <CommandGroup className="h-full mt-4">
            <div className="flex items-center gap-6 flex-wrap">
              {media.map((item) => (
                <CommandItem key={item.id} className="flex flex-col gap-2">
                  <div className="relative h-[8rem] w-[14rem] ">
                    <Image
                      src={item.link}
                      alt={item.name}
                      fill
                      priority
                      className="object-cover"
                    />
                  </div>
                  <div className="flex justify-between gap-1 w-full">
                    <div className="w-full">
                      <div className="flex items-center w-full justify-between">
                        <div className="text-muted-foreground">
                          {format(
                            new Date(item.createdAt),
                            "eeee, MMM dd yyyy"
                          )}
                        </div>

                        <DropdownMenu>
                          <DropdownMenuTrigger>
                            <MoreHorizontal size={16} />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem
                              className="flex items-center gap-2"
                              onClick={() =>
                                navigator.clipboard.writeText(item.link)
                              }
                            >
                              <Paperclip size={16} />
                              <span>Copy Image Link</span>
                            </DropdownMenuItem>

                            <AlertDialogTrigger asChild>
                              <DropdownMenuItem
                                className="flex items-center gap-2"
                                onClick={() => setActive(item.id)}
                              >
                                <Trash size={16} />
                                <span>Delete file</span>
                              </DropdownMenuItem>
                            </AlertDialogTrigger>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>

                      <div>{item.name}</div>
                    </div>
                  </div>
                </CommandItem>
              ))}
            </div>

            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete
                  your media from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  className="bg-red-700"
                  onClick={() => handleDelete(active)}
                >
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </CommandGroup>
        </CommandList>
      </Command>
    </AlertDialog>
  );
}
