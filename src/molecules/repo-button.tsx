import Link from "next/link";
import { Button } from "@/atoms/button";
import * as Icons from "@/atoms/icon";

export const RepoButton = () => {
  return (
    <Link
      href="https://github.com/bentsignal/how-i-code"
      target="_blank"
      className="transition-opacity duration-300"
    >
      <Button variant="outline">
        Repo
        <Icons.Github />
      </Button>
    </Link>
  );
};
