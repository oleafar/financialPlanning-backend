import { createApp } from "./app.js";
import { env } from "./shared/env.js";

const app = createApp();

app.listen(env.port, () => {
  console.log(`Server running on port ${env.port}`);
});
