import { Queue, Worker } from "bullmq";
import { config } from "dotenv";
config();
export const codeQueue = new Queue("codeQueue", {
  connection: {
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT),
    password: process.env.REDIS_PASSWORD,
    maxRetriesPerRequest:3,
    retryStrategy: (times):number|Error => {
      if (times >= 5) {
        return new Error("Retry limit reached");
      }
      return Math.min(times * 50, 2000);
    },
  },
});