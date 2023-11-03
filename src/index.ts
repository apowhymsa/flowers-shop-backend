import {config} from 'dotenv';
config();

import './database/connection';

import express from 'express';
import http from 'http';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import cors from 'cors';
import * as process from "process";

const app = express();

app.use(cors({
    credentials: true
}))

app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());

const server = http.createServer(app);
server.listen(process.env['PORT'], () => console.log(`Server running: ${process.env['PORT']}`))