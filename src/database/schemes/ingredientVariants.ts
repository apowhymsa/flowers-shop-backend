import mongoose, {Schema} from "mongoose";

const IngredientVariantSchema = new mongoose.Schema({
    vType: {type: String, required: true},
    count: {type: String, required: true},
});

export const IngredientVariantModel = mongoose.model('IngredientVariant', IngredientVariantSchema);

export const getIngredientVariants = () => IngredientVariantModel.find({});
export const getIngredientVariantById = (id: string) => IngredientVariantModel.findById(id);
export const createIngredientVariant = (values: Record<string, any>) => new IngredientVariantModel(values).save().then(ingredientVariant => ingredientVariant.toObject());
export const updateIngredientVariantById = (id: string, values: Record<string, any>) => IngredientVariantModel.findByIdAndUpdate(id, values, {new: true});
export const deleteIngredientVariantById = (id: string) => IngredientVariantModel.findByIdAndDelete(id);
