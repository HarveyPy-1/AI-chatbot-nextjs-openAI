import { cn } from "@/lib/utils";
import { useChat } from "ai/react";
import { XCircle } from "lucide-react";
import { Input } from "./input";
import { Button } from "./button";
import { Message } from "ai";

interface AIChatBoxProps {
  open: boolean;
  onClose: () => void;
}

const AIChatBox = ({ open, onClose }: AIChatBoxProps) => {
  // using vercel's ai sdk. makes everything easy
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    setMessages,
    isLoading,
    error,
  } = useChat(); // automatically sends a request to "/api/chat"
  return (
    <div
      className={cn(
        "bottom-0 right-0 z-10 w-full max-w-[500px] p-1 xl:right-36",
        open ? "fixed" : "hidden",
      )}
    >
      <button onClick={onClose} className="mb-1 ms-auto block">
        <XCircle size={30} />
      </button>
      <div className="flex h-[600px] flex-col rounded border bg-background shadow-xl">
        <div className="h-full">
          {messages.map((message) => (
            <ChatMessage message={message} key={message.id} />
          ))}
        </div>
        <form onSubmit={handleSubmit} className="m-3 flex gap-1">
          <Input
            value={input}
            onChange={handleInputChange}
            placeholder="Say something..."
          />
          <Button type="submit">Send</Button>
        </form>
      </div>
    </div>
  );
};
export default AIChatBox;

// single prop, no need to create interface
function ChatMessage({ message: { role, content } }: { message: Message }) {
  return (
    <div className="mb-4">
      <div>{role}</div>
      <div>{content}</div>
    </div>
  );
}
