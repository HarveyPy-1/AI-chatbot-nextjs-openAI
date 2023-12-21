"use client";

import Link from "next/link";
import logo from "@/public/assets/images/logo.png";
import Image from "next/image";
import { UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";
import AddNoteDialog from "@/components/ui/addNoteDialog";

const NavBar = () => {
  const [showAddNoteDialog, setShowAddNoteDialog] = useState(false);
  return (
    <>
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
            <Button onClick={() => setShowAddNoteDialog(true)}>
              <Plus size={20} className="mr-2" /> Add Note
            </Button>
          </div>
        </div>
      </div>
      {/* Note that you can use the conventional "showAddNoteDialog && <AddNoteDialog />" however, this method completely unmounts the component and any inputted data is lost. The way it's done below just opens and closes the dialog and input is kept so you can continue to write even after you close the dialog */}
      <AddNoteDialog open={showAddNoteDialog} setOpen={setShowAddNoteDialog} />
    </>
  );
};
export default NavBar;
