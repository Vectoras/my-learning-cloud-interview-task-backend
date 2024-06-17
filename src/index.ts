// importing node modules
// import https from "https";
import http from "http";
// importing npm modules
import mongoose from "mongoose";
// importing the app
import { app } from "./app/server.js";

// config
const PORT = process.env.SERVER_PORT || "8080";
const DB_CONNECTION_STRING = process.env.DB_CONNECTION_STRING ?? "missing connection string";

// create the server
const httpServer = http.createServer(app);

// connect to the database
let dbSuccessfulConnection = true;
console.log('\nConnecting to the database ...');
try {
  await mongoose.connect(DB_CONNECTION_STRING);
} catch (error) {
  console.log(`\nError when connecting to the database! \nDB_CONNECTION_STRING: ${DB_CONNECTION_STRING} \nerror: ${String(error)}`);
  dbSuccessfulConnection = false;
}

if (dbSuccessfulConnection) {
  console.log("\nSuccessfully connected to the database");

  // start the server
  httpServer.listen(PORT, () => {
    console.log(`\nThe http server has been started! http://localhost:${PORT}`);
  });
}
