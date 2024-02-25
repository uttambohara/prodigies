"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { useModal } from "@/providers/modal-provider";
import { CSSProperties, useState } from "react";

export default function CustomModal({
  title,
  description,
  children,
  className,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
  className?: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const modalData = useModal();

  if (!modalData?.isOpen) return null;
  return (
    <Dialog open={modalData.isOpen} onOpenChange={modalData.onClose}>
      <DialogContent className={cn(className)}>
        <DialogHeader>
          <DialogTitle className="text-2xl">{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div>{children}</div>
      </DialogContent>
    </Dialog>
  );
}
