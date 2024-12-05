import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const apiKey = "";

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    // API Base URL
    baseUrl: "",
    // Add Content Type and API Key to Headers
    prepareHeaders: (headers) => {
      headers.set("Content-Type", "application/json");
      headers.set("X-API-KEY", apiKey);
      return headers;
    },
  }),
  // Set tags for invalidations
  tagTypes: ["snarf"],
  endpoints: (builder) => ({
    getSnarfs: builder.query({
      query: () => "/snarf",
      // transformResponse: (res) => res.sort((a, b) => b.id - a.id),
      providesTags: ["snarf"],
    }),
    addSnarf: builder.mutation({
      query: (snarf) => ({
        url: "/snarf",
        method: "POST",
        body: snarf,
      }),
      invalidatesTags: ["snarf"],
    }),
    updateSnarf: builder.mutation({
      query: (snarf) => ({
        url: `/snarf/${snarf.id}`,
        method: "PATCH",
        body: snarf,
      }),
      invalidatesTags: ["snarf"],
    }),
    deleteSnarf: builder.mutation({
      query: ({ id }) => ({
        url: `/snarf/${id}`,
        method: "DELETE",
        body: id,
      }),
      invalidatesTags: ["snarf"],
    }),
  }),
});

export const {
  useGetSnarfsQuery,
  useAddSnarfMutation,
  useUpdateSnarfMutation,
  useDeleteSnarfMutation,
} = apiSlice;

// const [useAddTodoMutation] =
