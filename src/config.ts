import type { MigrationConfig } from "drizzle-orm/migrator";

process.loadEnvFile();

type DBConfig = {
  dbUrl: string;
  schemaPath: string;
  migrationConfig: MigrationConfig;
};

type JWTConfig = {
  expiredIn: number;
  secretKey: string;
};

type EmailConfig = {
  address: string;
  token: string;
};

type ExternalAPIsKeys = {
  gemini: string;
  deepL: string;
  weatherBit: string;
  apiFootball: string;
}

type APIConfig = {
  port: number;
  refreshTokenExpiredIn: number;
  dbConfig: DBConfig;
  jwtConfig: JWTConfig;
  emailConfig: EmailConfig;
  externalApisKeys: ExternalAPIsKeys;
};

export const apiConfig: APIConfig = {
  port: Number(process.env.PORT as string),
  refreshTokenExpiredIn: Number(process.env.REFRESH_TOKEN_EXPIRED_IN as string),
  dbConfig: {
    dbUrl: process.env.DB_URL as string,
    schemaPath: "./src/db/schema.ts",
    migrationConfig: {
      migrationsFolder: "./src/db/migrations",
    },
  },
  jwtConfig: {
    expiredIn: Number(process.env.JWT_EXPIRED_IN),
    secretKey: process.env.JWT_SECRET_KEY as string
  },
  emailConfig: {
    address: process.env.EMAIL_ADDRESS as string,
    token: process.env.EMAIL_TOKEN as string
  },
  externalApisKeys: {
    gemini: process.env.GEMINI_API_KEY as string,
    deepL: process.env.DEEPL_API_KEY as string,
    weatherBit: process.env.ONE_WEATHER_API_KEY as string,
    apiFootball: process.env.API_FOOTBALL_API_KEY as string
  }
};
