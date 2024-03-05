import mongoose, { Schema } from "mongoose";
import moment from "moment-timezone";
import { ProductModel } from "./products";

const OrderSchema = new mongoose.Schema({
  userID: { type: Schema.Types.ObjectId, ref: "User" },
  description: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  userFullName: { type: String, required: true },
  shippingAddress: { type: String, required: true },
  deliveryTime: { type: String, required: true },
  comment: { type: String, default: "" },
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
    bonuses: { type: String, required: true },
    deliveryPrice: { type: String, required: true },
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
  isViewed: { type: Boolean, required: true, default: false },
});

export const OrderModel = mongoose.model("Order", OrderSchema);

export const getOrders = (filterQuery: any) => OrderModel.find(filterQuery);
export const getUserOrders = (id: string) => OrderModel.find({ userID: id });
export const getOrderById = (id: string) => OrderModel.findById(id);
export const createOrder = (values: Record<any, any>) =>
  new OrderModel(values).save().then((order) =>
    order.populate([
      "userID",
      {
        path: "products.product_id",
        model: ProductModel, // Замените Product на ваш объект модели Product
        populate: [
          {
            path: "variants.ingredients.ingredient.id",
            model: "Ingredient", // Замените Ingredient на ваш объект модели Ingredient
          },
          {
            path: "variants.ingredients.ingredient.variantID",
            model: "IngredientVariant", // Замените Ingredient на ваш объект модели Ingredient
          },
        ],
      },
    ])
  );
export const updateOrderStatusById = (id: string, status: string) =>
  OrderModel.findByIdAndUpdate(id, { status: status });
export const updateOrderById = (id: string, values: Record<any, any>) =>
  OrderModel.findByIdAndUpdate(id, values, { new: true });
export const deleteOrdersByUserId = (uId: string) =>
  OrderModel.deleteMany({ userID: uId });
