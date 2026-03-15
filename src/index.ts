import express from "express";
import { apiConfig } from "./config.js";
import userRouter from "./routes/users.js";
import { errorHandlerMiddleware } from "./middlewares/error-handler.js";

const app = express();
const PORT = apiConfig.port;

app.use(express.json());
app.use("/users", userRouter);
app.use(errorHandlerMiddleware);

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
