import Link from "next/link";
import logo from "@/public/assets/images/logo.png";
import Image from "next/image";
import { UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const NavBar = () => {
  return (
    <div className="p-2 shadow">
      <div className="m-auto flex max-w-7xl flex-wrap items-center justify-between gap-3">
        <Link href={"/notes"} className="flex items-center gap-3">
          <Image src={logo} alt="logo" width={50} height={40} />
          <span className="font-bold">AI Notes</span>
        </Link>
        <div className="flex items-center gap-2">
          <UserButton
            afterSignOutUrl="/"
            appearance={{
              elements: { avatarBox: { width: "2.5rem", height: "2.5rem" } },
            }}
          />
          <Button>
            <Plus size={20} className="mr-2" /> Add Note
          </Button>
        </div>
      </div>
    </div>
  );
};
export default NavBar;
