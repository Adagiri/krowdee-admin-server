import cors from "cors";
import dotEnv from "dotenv";
dotEnv.config();
import express from "express";

import { connection } from "./database/utils/index.js";
import server from "./server.js";

const app = express();
// enable cors
var corsOptions = {
  origin: "http://localhost:3001",
  "Access-Control-Allow-Credentials": "http://localhost:3001",
  "Access-Control-Allow-Origin": true,
  credentials: true, // <-- REQUIRED backend setting
};
app.use(cors(corsOptions));
app.use(express.json());

const PORT = process.env.PORT || 6000;

server.applyMiddleware({ app, path: "/graphql" });

connection()
  .then(() => {
    app.listen(PORT, () => {
      console.log("Graphql running on", server.graphqlPath, "on port", PORT);
    });
  })
  .catch((error) => console.log(error));
