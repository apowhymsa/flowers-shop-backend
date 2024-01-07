import mongoose from "mongoose";
import * as process from "process";

mongoose.set("bufferCommands", false);
mongoose
  //   .connect(process.env["MONGO_URI"])
  .connect(
    "mongodb+srv://whymsa:2hpqKFnHm5eOIlOF@clumbaflowersshop.1i2zo6j.mongodb.net/?retryWrites=true&w=majority",
  )
  .then(() => console.log("MongoDB connected"))
  .catch((error: Error) => console.error(`Error: ${error.message}`));
