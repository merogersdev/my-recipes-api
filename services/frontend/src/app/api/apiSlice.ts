import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { CognitoUser } from "amazon-cognito-identity-js";
import { setCredentials } from "../../features/auth/authSlice";

const apiKey = "";

const baseQuery = fetchBaseQuery({
  // API Base URL
  baseUrl: "",
  // Add Content Type and API Key to Headers
  prepareHeaders: async (headers) => {
    // Grab Cognito Tokens
    let cognitoTokens = (await fetchAuthSession()).tokens;
    let token: any = cognitoTokens?.idToken?.toString();

    // Add Token to Authorization Header
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    // Set Content Type and API Key
    headers.set("Content-Type", "application/json");
    headers.set("X-API-KEY", apiKey);
    return headers;
  },
});

// TODO: Fix any types
const baseQueryWithReauth = async (args: any, api: any, extraOptions: any) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result?.error?.status === 403) {
    console.log("sending refresh token");

    // send refresh token to get new access token
    const refreshResult: any = await baseQuery(
      "/auth/refresh",
      api,
      extraOptions
    );

    if (refreshResult?.data) {
      // store the new token
      api.dispatch(setCredentials({ ...refreshResult.data }));

      result = await baseQuery(args, api, extraOptions);
    } else {
      if (refreshResult?.error?.status === 403) {
        refreshResult.error.data.message = "Your login has expired. ";
      }
      return refreshResult;
    }
  }

  return result;
};

export const apiSlice = createApi({
  baseQuery: baseQueryWithReauth,

  tagTypes: ["Recipes", "User"],
  endpoints: (_builder) => ({}),
});
