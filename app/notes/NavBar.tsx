"use client";

import Link from "next/link";
import logo from "@/public/assets/images/logo.png";
import Image from "next/image";
import { UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";
import ModifyNoteDialog from "@/components/ui/modifyNoteDialog";
import ThemeToggle from "@/components/ui/themeToggle";
import {dark} from "@clerk/themes"
import { useTheme } from "next-themes";
import AIChatButton from "@/components/ui/aiChatButton";



const NavBar = () => {
  // toggle dialog open or closed
  const [showModifyNoteDialog, setShowModifyNoteDialog] = useState(false);

  const {theme} = useTheme()

  return (
    <>
      <div className="p-2 shadow">
        <div className="m-auto flex max-w-7xl flex-wrap items-center justify-between gap-3">
          <Link href={"/notes"} className="flex items-center gap-3">
            <Image src={logo} alt="logo" width={50} height={40} priority />
            <span className="font-bold">AI Notes</span>
          </Link>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <UserButton
              afterSignOutUrl="/"
              appearance={{
                baseTheme: theme === "dark" ? dark : undefined,
                elements: { avatarBox: { width: "2.5rem", height: "2.5rem" } },
              }}
            />
            <Button onClick={() => setShowModifyNoteDialog(true)}>
              <Plus size={20} className="mr-2" /> Add Note
            </Button>
            <AIChatButton />
          </div>
        </div>
      </div>
      {/* Note that you can use the conventional "showModifyNoteDialog && <AddNoteDialog />" however, this method completely unmounts the component and any inputted data is lost. The way it's done below just opens and closes the dialog and input is kept so you can continue to write even after you close the dialog */}
      <ModifyNoteDialog
        open={showModifyNoteDialog}
        setOpen={setShowModifyNoteDialog}
      />
    </>
  );
};
export default NavBar;
