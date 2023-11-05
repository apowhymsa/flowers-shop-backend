import mongoose from "mongoose";

const IngredientSchema = new mongoose.Schema({
    title: {type: String, required: true},
    categoryID: {type: String, required: true}, // text: 30sm price of each count of each
    variants: [{
        vType: {type: String, required: true},
        price: {type: String, required: true},
        count: {type: String, required: true}
    }]
});

export const IngredientModel = mongoose.model('Ingredient', IngredientSchema);

export const getIngredients = () => IngredientModel.find({});
export const getIngredientByTitle = (title: string) => IngredientModel.findOne({title})
export const getIngredientById = (id: string) => IngredientModel.findById(id);
export const getIngredientsByCategoryId = (cId: string) => IngredientModel.find({categoryID: cId});
// export const getUserBySessionToken = (sessionToken: string) => UserModel.findOne({
//     'authentication.sessionToken': sessionToken
// });
export const createIngredient = (values: Record<string, any>) => new IngredientModel(values).save().then(ingredient => ingredient.toObject());
export const updateIngredientById = (id: string, values: Record<string, any>) => IngredientModel.findByIdAndUpdate(id, values, {new: true});
export const deleteIngredientById = (id: string) => IngredientModel.findByIdAndDelete(id);
