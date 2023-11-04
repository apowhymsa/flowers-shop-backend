import mongoose from 'mongoose';
import * as process from "process";

mongoose.connect(process.env['MONGO_URI'])
    .then(() => import('./schemes/users'))
    .catch((error: Error) => console.error(`Error: ${error.message}`));