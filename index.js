import env from "dotenv";
import express from "express";
import bodyParser from "body-parser";
import client from "./config/connection.js";
import userRouter from "./routes/userRoutes.js";
const port = process.env.PORT || 3000;
env.config();
const app = express();
console.log(process.env.PORT);

app.use(bodyParser.json());
client.connect();

app.use("/api/user", userRouter);

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
