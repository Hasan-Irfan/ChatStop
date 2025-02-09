import { useState, useEffect } from "react";
import { Navbar } from "./Navbar";
import { Sidebar } from "./Sidebar";
import { ChatWindow } from "./ChatWindow";

export const ChatPage = () => {
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="flex flex-col h-screen bg-[#F4F6FA]">
      <Navbar />

      <div className="flex flex-1">
        {(!isMobile || !selectedFriend) && (
          <Sidebar setSelectedFriend={setSelectedFriend} />
        )}

        {(!isMobile || selectedFriend) && (
          <ChatWindow selectedFriend={selectedFriend} setSelectedFriend={setSelectedFriend} />
        )}
      </div>
    </div>
  );
};

export default ChatPage;
