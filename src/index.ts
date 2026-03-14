import express from "express";
import { apiConfig } from "./config";

const app = express();
const PORT = apiConfig.port;

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});