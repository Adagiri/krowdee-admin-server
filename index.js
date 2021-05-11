import cors from "cors";
import dotEnv from "dotenv";
dotEnv.config();
import express from "express";

import { connection } from "./database/utils/index.js";
import server from "./server.js";


const app = express();
app.use(cors());
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


  function makeid(length) {
    var result           = [];
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result.push(characters.charAt(Math.floor(Math.random() * 
 charactersLength)));
   }
   return result.join('');
}

console.log(makeid(9));