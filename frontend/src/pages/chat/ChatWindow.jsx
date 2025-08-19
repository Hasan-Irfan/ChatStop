import { useState, useEffect } from "react";
import {
  useGetConversationQuery,
  useSendMessageMutation,
} from "../../services/messageApi";
import { useSelector } from "react-redux";
import { io } from "socket.io-client"; 


export const ChatWindow = ({ selectedFriend, setSelectedFriend }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const username = localStorage.getItem("username");
  const [socket, setSocket] = useState(null);
  // const socket = useSelector((state) => state.socket);

  const {
    data: chatHistory,
    isLoading,
    error,
    refetch 
  } = useGetConversationQuery(
    { friend: selectedFriend },
    {
      skip: !selectedFriend,
    }
  );

  const user = useSelector((state) => state.user);
  console.log(user.username);

  useEffect(() => {
    if (user && user.username) {
      const newSocket = io("http://localhost:8080", {});
      setSocket(newSocket);

      newSocket.emit("join", user.username);

      return () => {
        newSocket.disconnect();
      };
    } else {
      setSocket(null);
    }
  }, [user]);

  const [sendMessage] = useSendMessageMutation();

  useEffect(() => {
    if (selectedFriend) {
      refetch();
    }
  }, [selectedFriend, refetch]);

  useEffect(() => {
    if (chatHistory) {
      setMessages(chatHistory.data || []);
    }
  }, [chatHistory]);

  useEffect(() => {
    if (!socket) return;

    socket.on("newMessage", (message) => {
      if (message.sender === selectedFriend || message.sender === username) {
        setMessages((prevMessages) => [...prevMessages, message]);
      }
    });
    return () => {
      socket.off("newMessage");
    };
  }, [socket, selectedFriend, username]);

  const handleSendMessage = async () => {
  if (!newMessage.trim() || !selectedFriend) return;

  const messageObj = {
    sender: username,
    recipient: selectedFriend,
    message: newMessage,
  };

  try {
    await sendMessage(messageObj).unwrap();

    if (socket) {
      socket.emit("sendMessage", messageObj);
    }

    refetch(); // Refetch messages to ensure UI is updated

    // Don't manually update messages state - let socket or refetch handle it
    setNewMessage("");
  } catch (error) {
    console.error("Failed to send message:", error);
  }
};

  // const handleSendMessage = async () => {
  //   if (!newMessage.trim() || !selectedFriend) return;

  //   const messageObj = {
  //     sender: username,
  //     recipient: selectedFriend,
  //     message: newMessage,
  //   };

  //   try {
  //     await sendMessage(messageObj).unwrap();

  //     if (socket) {
  //       socket.emit("sendMessage", messageObj);
  //     }

  //     setMessages((prevMessages) => [
  //       ...prevMessages,
  //       { sender: username, message: newMessage, timestamp: new Date() },
  //     ]);

  //     setNewMessage("");
  //   } catch (error) {
  //     console.error("Failed to send message:", error);
  //   }
  // };

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-lg w-full">
      {/* Mobile Back Button */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-700 text-white py-4 px-6 font-semibold text-lg shadow-lg rounded-t-lg flex items-center">
        <button
          className="mr-4 text-white md:hidden hover:scale-105 transition-transform"
          onClick={() => setSelectedFriend(null)}
        >
          ⬅ Back
        </button>
        {selectedFriend || "Select a friend"}
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 overflow-y-auto bg-[#F4F6FA] max-h-[calc(100vh-200px)]">
        {isLoading ? (
          <p>Loading messages...</p>
        ) : messages?.length === 0 ? (
          <p className="text-gray-500">No messages yet.</p> 
        ) :  error ? (
          <p className="text-red-500">Error loading messages</p>
        ) : (
          messages?.map((msg, index) => (
            <div
              key={index}
              className={`mb-3 ${
                msg.sender === username ? "text-right" : "text-left"
              }`}
            >
              <div
                className={`inline-block px-4 py-2 rounded-xl shadow-md ${
                  msg.sender === username
                    ? "bg-orange-500 text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                {msg.message}
                <span className="block text-xs text-gray-800">
                  {new Date(msg.timestamp).toLocaleTimeString()}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Input Field */}
      <div className="p-3 border-t flex items-center bg-white shadow-md">
        <input
          type="text"
          placeholder="Type a message..."
          className="flex-1 px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500 bg-gray-100"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === "Enter") handleSendMessage();
          }}
        />
        <button
          className="ml-3 bg-gradient-to-r from-orange-500 to-orange-700 text-white px-6 py-2 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
          onClick={handleSendMessage}
        >
          Send
        </button>
      </div>
    </div>
  );
};
