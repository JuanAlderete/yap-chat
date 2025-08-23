import { Button } from "@/components/ui/button";
import { useState } from "react";
import NewChat from "../../components/common/NewChat";

function EmptyChatState() {
  const [openDialog, setOpenDialog] = useState(false);

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  return (
    <>
      <div className="flex flex-col h-full w-full items-center justify-center">
        <h1 className="text-center text-xl font-bold">
          There are no active conversations.
        </h1>
        <p className="text-center text-sm">
          You can create a new conversation or view an existing one.
        </p>
        <div className="flex justify-center gap-2 mt-4">
          <Button onClick={handleOpenDialog}>New conversation</Button>
        </div>
      </div>
      <NewChat openDialog={openDialog} onClose={handleCloseDialog} />
    </>
  );
}

export default EmptyChatState;
