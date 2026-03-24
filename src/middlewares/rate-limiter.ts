import IORedis from "ioredis";
import rateLimit, { ipKeyGenerator } from "express-rate-limit";
import { RedisReply, RedisStore } from "rate-limit-redis";
import { apiConfig } from "../config.js";

const redis = new IORedis({
  host: apiConfig.redisConfig.host,
  port: apiConfig.redisConfig.port,
});

type RateLimiterParams = {
  windowMs: number;
  max: number;
  message: { message: string };
};
function createLimiter(rateLimiterParams: RateLimiterParams) {
  const rateLimiter = rateLimit({
    store: new RedisStore({
      sendCommand: async (...args: string[]): Promise<RedisReply> => {
        return (await redis.call(args[0], ...args.slice(1))) as RedisReply;
      },
    }),
    windowMs: rateLimiterParams.windowMs,
    max: rateLimiterParams.max,
    message: rateLimiterParams.message,
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: true,
    keyGenerator: (req) => ipKeyGenerator(req.ip!),
  });
  return rateLimiter;
}

export const usersLimiter = createLimiter({
  windowMs: 15 * 60 * 1000, //! 15 minutes
  max: 50,
  message: { message: "Too many requests, try again later after 15 minutes!" },
});

export const webhooksLimiter = createLimiter({
  windowMs: 5 * 60 * 1000, //! 5 minutes
  max: 15,
  message: { message: "Too many requests, try again after 5 minutes!" },
});

export const tasksLimiter = createLimiter({
  windowMs: 1 * 60 * 1000, //! 1 minute
  max: 500,
  message: { message: "Too many requests, try again after 1 minute!" },
});
