import { CognitoUserPool } from "amazon-cognito-identity-js";

export const poolData = {
  UserPoolId: import.meta.env.VITE_POOL_ID || "",
  ClientId: import.meta.env.VITE_CLIENT_ID || "",
};

export const userPool = new CognitoUserPool(poolData);
