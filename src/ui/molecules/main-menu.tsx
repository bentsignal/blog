import { useState } from "react";
import { Menu } from "lucide-react";
import * as Auth from "@/ui/atoms/auth";
import * as Popover from "@/ui/atoms/popover";
import { Separator } from "@/ui/atoms/separator";
import { ThemeToggle } from "@/ui/molecules/theme-toggle";

export default function MainMenu() {
  const [open, setOpen] = useState(false);

  return (
    <div
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      className="flex cursor-pointer items-center"
    >
      <Popover.Frame open={open} onOpenChange={setOpen}>
        <Popover.Trigger className="cursor-pointer p-2 pl-8 outline-none!">
          <Menu className="size-4.5 cursor-pointer" />
        </Popover.Trigger>
        <Popover.Content className="-mt-1 mr-4 flex w-auto min-w-32 flex-col items-start p-1 sm:min-w-52">
          <Auth.PrimaryButton />
          {/* <Auth.DeleteAccountButton /> */}
          <Separator className="my-1" />
          <ThemeToggle />
        </Popover.Content>
      </Popover.Frame>
    </div>
  );
}
