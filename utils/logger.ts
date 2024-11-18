import pino from "pino";

export const logger = pino({
  level: process.env.AWS_LAMBDA_LOG_LEVEL || "info",
  formatters: {
    bindings: (_bindings) => {
      return { nodeVersion: process.version };
    },
    level: (label) => {
      return { level: label.toUpperCase() };
    },
  },
  timestamp: () => `,"timestamp":"${new Date(Date.now()).toISOString()}"`,
});
