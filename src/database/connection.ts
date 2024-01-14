import mongoose from "mongoose";
import * as process from "process";
import {createDeliveryPrice, getCurrentDeliveryPrice} from "./schemes/delivery";

mongoose.set("bufferCommands", false);
mongoose
  //   .connect(process.env["MONGO_URI"])
  .connect(
    "mongodb+srv://whymsa:2hpqKFnHm5eOIlOF@clumbaflowersshop.1i2zo6j.mongodb.net/?retryWrites=true&w=majority",
  )
  .then(async () => {
    console.log("MongoDB connected");
    try {
      const deliveryPriceCount = await getCurrentDeliveryPrice().countDocuments({});

      if (deliveryPriceCount <= 0) {
        const newDelivery = await createDeliveryPrice({price: '12'});
      }

    } catch (err) {
      console.log(err);
    }
  })
  .catch((error: Error) => console.error(`Error: ${error.message}`));
