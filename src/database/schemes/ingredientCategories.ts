import mongoose from "mongoose";
import {IngredientModel} from "./ingredients";

const IngredientCategorySchema = new mongoose.Schema({
    title: {type: String, required: true}
});

export const IngredientCategoryModel = mongoose.model('IngredientCategory', IngredientCategorySchema);

export const getIngredientCategories = () => IngredientCategoryModel.find({});
export const getIngredientCategoryById = (id: string) => IngredientCategoryModel.findById(id)
export const getIngredientCategoryByTitle = (title: string) => IngredientCategoryModel.findOne({title});
export const createIngredientCategory = (values: Record<string, any>) => new IngredientCategoryModel(values).save().then(ingredientCategory => ingredientCategory.toObject());
export const updateIngredientCategoryById = (id: string, values: Record<string, any>) => IngredientCategoryModel.findByIdAndUpdate(id, values, {new: true});
export const deleteIngredientCategoryById = (id: string) => IngredientCategoryModel.findByIdAndDelete(id);
