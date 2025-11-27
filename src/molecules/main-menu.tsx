import { useState } from "react";
import { Menu, X } from "lucide-react";
import * as Auth from "@/atoms/auth";
import * as Popover from "@/atoms/popover";
import { Separator } from "@/atoms/separator";
import * as Theme from "@/atoms/theme";

export default function MainMenu() {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex cursor-pointer items-center">
      <Popover.Frame open={open} onOpenChange={setOpen}>
        <Popover.Trigger className="cursor-pointer p-3 pl-8 outline-none!">
          {open ? (
            <X className="size-4.5 cursor-pointer" />
          ) : (
            <Menu className="size-4.5 cursor-pointer" />
          )}
        </Popover.Trigger>
        <Popover.Content className="-mt-2 mr-4 flex w-auto min-w-32 flex-col items-start p-1 sm:min-w-52">
          <Auth.PrimaryButton />
          {/* <Auth.DeleteAccountButton /> */}
          <Separator className="my-1" />
          <Theme.ToggleButton />
        </Popover.Content>
      </Popover.Frame>
    </div>
  );
}
