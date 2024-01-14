import mongoose, {Schema} from "mongoose";
import {IngredientModel} from "./ingredients";
import {IngredientCategoryModel} from "./ingredientCategories";

const DeliverySchema = new mongoose.Schema({
    price: {type: String, required: true, default: '12'},
});

export const DeliveryModel = mongoose.model('Delivery', DeliverySchema);

export const createDeliveryPrice = (values: Record<string, string>) => new DeliveryModel(values).save().then(deliveryPrice => deliveryPrice.toObject());
export const getCurrentDeliveryPrice = () => DeliveryModel.find({});
export const updateDeliveryPrice = (id: string, values: Record<string, string>) => DeliveryModel.findByIdAndUpdate(id, values, {new: true});
