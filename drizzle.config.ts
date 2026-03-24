import { defineConfig } from "drizzle-kit";
import { apiConfig } from "./src/config";

export default defineConfig({
  schema: apiConfig.dbConfig.schemaPath,
  out: apiConfig.dbConfig.migrationConfig.migrationsFolder,
  dialect: "postgresql",
  dbCredentials: {
   url: apiConfig.dbConfig.dbUrl,
  },
});