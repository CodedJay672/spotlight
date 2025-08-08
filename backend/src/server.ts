import express from "express";
import cors from "cors";

//custom module
import { config } from "./lib/config/index";

const app = express();
app.use(cors());

app.listen(config.port, () => {
  console.log("server is running on port", config.port);
});
