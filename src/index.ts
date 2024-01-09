import { config } from "dotenv";
config();

import "./database/connection";

import express from "express";
import http from "http";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import compression from "compression";
import cors from "cors";
import * as process from "process";
import router from "./router";
import fs from "fs";
import { Server } from "socket.io";
import { OrderModel } from "./database/schemes/orders";
import { startMailing } from "./helpers";

const app = express();

app.use(
  cors({
    // origin: 'https://clumba-web-shop.vercel.app',
    origin: 'http://localhost:3000',
    credentials: true,
  }),
);

app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000"],
    credentials: true,
  },
});

const changeStream = OrderModel.watch();

changeStream.on("change", (change) => {
  if (change.operationType === "insert") {
    console.log("Change occurred:", change.documentKey);
    io.emit("update", change.documentKey); // Emit a WebSocket event on change
  }
});

server.listen(process.env["PORT"], () =>
  console.log(`Server running: ${process.env["PORT"]}`),
);

app.use("/", router());
