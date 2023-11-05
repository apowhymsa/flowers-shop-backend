import mongoose from 'mongoose';
import * as process from "process";

mongoose.connect(process.env['MONGO_URI'])
    .then(() => console.log('MongoDB connected'))
    .catch((error: Error) => console.error(`Error: ${error.message}`));