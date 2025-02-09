import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";


const baseUrl = "http://localhost:8080/main";

export const requestApi = createApi({
  reducerPath: "friendRequest", 
  baseQuery: fetchBaseQuery({
    baseUrl,
    credentials: "include",
  }),

  endpoints: (builder) => ({
    findFriend: builder.query({
      query: (username) => ({
        url: "/find-user",
        method: "GET",
        params: { username }, 
      }),
    }),

    sendRequest: builder.mutation({
      query: ({ sender, receiver }) => ({
        url: "/send-request", 
        method: "POST",
        body: { sender, receiver }, 
      }),
    }),

    handleRequest: builder.mutation({
      query: ({ state, senderUsername, receiverUsername }) => ({
        url: "/handle-request", 
        method: "POST",
        body: { state, senderUsername, receiverUsername },
      }),
    }),

    getFriendRequest: builder.query({
      query: (username) => ({
        url: "/get-friend-requests",  
      }),
    }),

    // New endpoint for getting friends
    getFriends: builder.query({
      query: (username) => ({
        url: "/get-friends",  // Assuming you've created a route for this endpoint
        method: "POST",
        body: { username },
      }),
    }),
  }),
});

export const { 
  useFindFriendQuery, 
  useSendRequestMutation, 
  useHandleRequestMutation,
  useGetFriendsQuery, // Exporting the hook for `getFriends`
  useGetFriendRequestQuery
} = requestApi;
