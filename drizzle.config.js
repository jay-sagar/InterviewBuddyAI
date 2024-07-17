/** @type { import("drizzle-kit").Config } */
export default {
    schema: "./utils/schema.js",
    dialect: 'postgresql',
    dbCredentials: {
      url: 'postgresql://neondb_owner:t6hDbdJvO1uo@ep-falling-scene-a10l4ex5.ap-southeast-1.aws.neon.tech/AI-Mock-Interview?sslmode=require',
    }
  };