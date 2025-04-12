const dotEnv = require("dotenv");
const drizzle = require("drizzle-kit");

dotEnv.config({ path: ".env.local" });

export default drizzle.defineConfig({
  out: "./src/db/migrations",
  schema: "./src/db/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
});
