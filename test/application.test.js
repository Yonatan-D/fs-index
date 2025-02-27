// import express from "express";
import { Application } from "../src/lib/application.js";

// const app = express();
const app = new Application();
// app.Throw('Hello World');
app.listen(20001, () => {
  console.log("Server is running on port 20001");
});