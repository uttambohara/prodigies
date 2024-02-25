"use client";

import { Button } from "../ui/button";
import CustomModal from "../custom-modal";
import { useModal } from "@/providers/modal-provider";
import { MediaDetails } from "../form/media-details";
import { UploadButton } from "@uploadthing/react";
import { UploadCloud } from "lucide-react";

interface MediaHeadingProps {
  subaccountid: string;
}

export default function MediaHeading({ subaccountid }: MediaHeadingProps) {
  const data = useModal();
  return (
    <div className="flex items-center justify-between">
      <h2 className="text-2xl">📸 Media Bucket</h2>
      <Button
        className="flex items-center gap-1"
        onClick={() =>
          data?.onOpen(
            <CustomModal
              title={"Upload media"}
              description={"Upload a file to your media bucket!"}
            >
              <MediaDetails subaccountid={subaccountid} />
            </CustomModal>
          )
        }
      >
        <UploadCloud />
        <span> Upload</span>
      </Button>
    </div>
  );
}
