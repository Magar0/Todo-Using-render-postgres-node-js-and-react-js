const dotEnv = require("dotenv");
const drizzle = require("drizzle-kit");

dotEnv.config({ path: ".env" });

export default drizzle.defineConfig({
  out: "./src/db/migrations",
  schema: "./src/db/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
});
