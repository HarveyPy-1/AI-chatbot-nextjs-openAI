import { useState } from "react";
import AIChatBox from "./aiChatBox";
import { Button } from "./button";
import { Bot } from "lucide-react";

const AIChatButton = () => {
  const [chatBoxOpen, setChatBoxOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setChatBoxOpen(true)}>
        <Bot size={20} className="mr-2" /> AI Chat
      </Button>
      <AIChatBox open={chatBoxOpen} onClose={() => setChatBoxOpen(false)} />
    </>
  );
};
export default AIChatButton;
