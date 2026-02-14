import Redis from "ioredis";
import { config } from "dotenv";
config();
const host = process.env.REDIS_HOST || "127.0.0.1";
const port = Number(process.env.REDIS_PORT)|| 6379;
const password = process.env.REDIS_PASSWORD||"";
export const redis = new Redis({
  host: host,
  port: port,
  password: password,
  maxRetriesPerRequest:3,
  retryStrategy: (times):number|Error => {
    if (times >= 5) {
      return new Error("Retry limit reached");
    }
    return Math.min(times * 50, 2000);
  },
});
redis.on("error", (err) => {
  console.error("Redis connection error:", err);
});
redis.on("connect",()=>{
  console.log("Connected to Redis successfully");
});
export const pub = new Redis({
  host: host,
  port: port,
  password: password,
});
export const sub = new Redis({
  host: host,
  port: port,
  password: password,
});