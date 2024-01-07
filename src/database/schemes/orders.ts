import mongoose, { Schema } from "mongoose";
import moment from "moment-timezone";

const OrderSchema = new mongoose.Schema({
  userID: { type: Schema.Types.ObjectId, ref: "User" },
  description: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  userFullName: { type: String, required: true },
  shippingAddress: { type: String, required: true },
  products: [
    {
      product_id: { type: Schema.Types.ObjectId, ref: "Product" },
      productVariant: {
        title: { type: String },
        id: { type: String },
      },
      count: { type: Number },
    },
  ],
  payment: {
    status: { type: Boolean, required: true },
    amount: { type: String, required: true },
    liqpayPaymentID: { type: String, requried: true },
  },
  status: {
    type: String,
    enum: ["processing", "packing", "shipping", "waiting", "complete"],
    default: "processing",
  },
  createdAt: {
    type: String,
    required: true,
  },
});

export const OrderModel = mongoose.model("Order", OrderSchema);

export const getOrders = () => OrderModel.find({});
export const getUserOrders = (id: string) => OrderModel.find({ userID: id });
export const getOrderById = (id: string) => OrderModel.findById(id);
export const createOrder = (values: Record<any, any>) =>
  new OrderModel(values).save().then((order) => order.toObject());
export const updateOrderStatusById = (id: string, status: string) =>
  OrderModel.findByIdAndUpdate(id, { status: status });
