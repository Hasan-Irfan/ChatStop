import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseUrl = "http://localhost:8080/main";

export const messageApi = createApi({
  reducerPath: "messageApi", 
  baseQuery: fetchBaseQuery({
    baseUrl,
    credentials: "include",
  }),

  endpoints: (builder) => ({
    sendMessage: builder.mutation({
      query: ({ sender, recipient, message }) => ({
        url: "/send-message",
        method: "POST",
        body: { sender, recipient, message },
      }),
    }),

    getConversation: builder.query({
      query: ({ friend }) => ({
        url: `/messages/${friend}`,  
      }),
    }),
  }),
});

export const { 
  useSendMessageMutation,
  useGetConversationQuery
} = messageApi;
