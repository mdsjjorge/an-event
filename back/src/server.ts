import { app } from "./app.js";
import { connectDatabase } from "./config/database.js";
import { env } from "./config/env.js";
import { seedDatabase } from "./seed/seedDatabase.js";

const startServer = async () => {
  try {
    await connectDatabase();
    await seedDatabase();

    app.listen(env.PORT, env.HOST, () => {
      console.log(`API running on http://${env.HOST}:${env.PORT}`);
    });
  } catch (error) {
    console.error("Failed to start API", error);
    process.exit(1);
  }
};

void startServer();
