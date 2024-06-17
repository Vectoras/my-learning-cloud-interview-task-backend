// importing node modules
// import https from "https";
import http from "http";
// importing the app
import { app } from "./app/server.js";

// config
const PORT = 8080;

// create the server
const httpServer = http.createServer(app);

// start the server

httpServer.listen(PORT, ()=>{
  console.log(`The http server has been started!`);
})
