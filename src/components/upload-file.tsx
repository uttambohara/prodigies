import { UploadDropzone } from "@/lib/uploadthing";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import Image from "next/image";
import { forwardRef } from "react";

interface UploadFileProps {
  endpoint: "imageUploader";
  type?: "user";
  value: string;
  onChange: (value: string) => void;
}

const UploadFile = forwardRef(
  ({ value, onChange, type, endpoint }: UploadFileProps, ref) => {
    console.log({ value });
    const fileType = value && value.split(".")[1];
    const isPdf = fileType === "pdf";

    if (fileType && isPdf) {
      return <div>Pdf</div>;
    }

    if (!isPdf && fileType) {
      return (
        <div className="w-full flex justify-center">
          <div
            className={cn(
              "relative h-[8rem] w-[12rem]",
              type === "user" && "h-[8rem] w-[8rem]"
            )}
          >
            <Image
              src={value}
              alt="Logo"
              fill
              priority
              className={cn(
                "object-contain rounded-md",
                type === "user" && "object-cover rounded-full"
              )}
            />

            <button
              className="flex gap-1 items-center absolute left-[50%] translate-x-[-50%] bottom-2 bg-gray-800/10 backdrop-blur-sm text-white text-xs p-1"
              onClick={() => {
                onChange("");
              }}
            >
              <X size={14} />
              <span> Cancel</span>
            </button>
          </div>
        </div>
      );
    }

    return (
      <UploadDropzone
        endpoint={endpoint}
        onClientUploadComplete={(res) => {
          // Do something with the response
          onChange(res?.[0].url);
        }}
        onUploadError={(error: Error) => {
          // Do something with the error.
          alert(`ERROR! ${error.message}`);
        }}
      />
    );
  }
);

UploadFile.displayName = "UploadFile";
export default UploadFile;
