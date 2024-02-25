import { UserButton } from "@clerk/nextjs";
import { ModeToggle } from "../mode-toggle";
import { Bell } from "lucide-react";

export default function NavInfo() {
  return (
    <header className="border-b border-slate-200 p-3 px-4 flex dark:border-zinc-200/10">
      <div className="ml-auto flex items-center gap-3">
        <ModeToggle />
        <UserButton appearance={{ elements: { avatarBox: "h-10 w-10" } }} />
        <div className="h-10 w-10 bg-primary text-white rounded-full flex items-center justify-center">
          <Bell />
        </div>
      </div>
    </header>
  );
}
