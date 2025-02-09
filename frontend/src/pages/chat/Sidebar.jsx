import { useState } from "react";
import { useGetFriendsQuery, useSendRequestMutation } from "../../services/requestApi";

export const Sidebar = ({ setSelectedFriend }) => {
  const [activeTab, setActiveTab] = useState("friends");
  const [search, setSearch] = useState("");
  const username = localStorage.getItem("username");

  const { data: friendsData, isLoading, error } = useGetFriendsQuery(username);
  const [sendRequest, { isLoading: isSending }] = useSendRequestMutation();
  const friends = friendsData?.friends || [];

  const handleSendRequest = async () => {
    if (!search.trim()) return alert("Please enter a username!");

    try {
      await sendRequest({ sender: username, receiver: search }).unwrap();
      alert(`Friend request sent to ${search}`);
      setSearch("");
    } catch (err) {
      alert(err?.data?.message || "Error sending request");
    }
  };

  return (
    <div className="w-80 bg-white shadow-lg flex flex-col border-r border-gray-300">
      <div className="flex justify-between p-4 border-b bg-[#FFEDD5]">
        <button
          className={`w-1/2 text-lg font-semibold py-2 rounded-t-md ${
            activeTab === "friends"
              ? "bg-white text-[#D97706] border-b-4 border-[#D97706]"
              : "text-gray-600"
          }`}
          onClick={() => setActiveTab("friends")}
        >
          Friends
        </button>
        <button
          className={`w-1/2 text-lg font-semibold py-2 rounded-t-md ${
            activeTab === "add"
              ? "bg-white text-[#D97706] border-b-4 border-[#D97706]"
              : "text-gray-600"
          }`}
          onClick={() => setActiveTab("add")}
        >
          Add Friends
        </button>
      </div>

      {activeTab === "friends" && (
        <div className="p-4 space-y-3">
          {isLoading ? (
            <p className="text-gray-500">Loading friends...</p>
          ) : error ? (
            <p className="text-red-500">Error loading friends</p>
          ) : friends.length > 0 ? (
            friends.map((friend, index) => (
              <div
                key={index}
                className="flex justify-between items-center p-3 rounded-lg cursor-pointer hover:bg-orange-100 bg-white shadow-md"
                onClick={() => setSelectedFriend(friend)}
              >
                <span className="text-gray-700">{friend}</span>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No friends yet</p>
          )}
        </div>
      )}

      {activeTab === "add" && (
        <div className="p-4">
          <input
            type="text"
            placeholder="Search username..."
            className="w-full px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-[#D97706] bg-gray-100"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button
            className="mt-3 w-full bg-[#D97706] text-white py-2 rounded-full hover:bg-[#B45309] disabled:bg-gray-400"
            onClick={handleSendRequest}
            disabled={isSending}
          >
            {isSending ? "Sending..." : "Send Request"}
          </button>
        </div>
      )}
    </div>
  );
};