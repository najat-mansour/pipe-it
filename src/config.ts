import type { MigrationConfig } from "drizzle-orm/migrator";

process.loadEnvFile();

type DBConfig = {
  dbUrl: string;
  schemaPath: string;
  migrationConfig: MigrationConfig;
}

type APIConfig = {
  port: number,
  dbConfig: DBConfig
};

export const apiConfig: APIConfig = {
  port: Number(process.env.PORT),
  dbConfig: {
    dbUrl: process.env.DB_URL as string,
    schemaPath: process.env.SCHEMA_Path as string,
    migrationConfig: {
      migrationsFolder: process.env.MIGRATION_FOLDER as string
    }
  },
}
