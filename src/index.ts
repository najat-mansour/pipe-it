import express from "express";
import { apiConfig } from "./config.js";
import { errorHandlerMiddleware } from "./middlewares/error-handler.js";
import userRouter from "./routes/users.js";
import refreshTokensRouter from "./routes/refresh-tokens.js";
import webhooksRouter from "./routes/webhooks.js";
import tasksRouter from "./routes/tasks.js";

const app = express();
const PORT = apiConfig.port;

app.use(express.json());
app.use("/users", userRouter);
app.use("/refresh-tokens", refreshTokensRouter);
app.use("/webhooks", webhooksRouter);
app.use("/tasks", tasksRouter);
app.use(errorHandlerMiddleware);

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
