import { default as Pino } from "pino";

export const logger = Pino({
  name: "MyRecipesAWSApp",
  level: "info",
});
