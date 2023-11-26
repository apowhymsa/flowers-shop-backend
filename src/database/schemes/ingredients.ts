import mongoose, {Schema} from "mongoose";

const IngredientSchema = new mongoose.Schema({
    title: {type: String, required: true},
    categoryID: {type: Schema.Types.ObjectId, ref: 'IngredientCategory', required: true},
    variants: [{
        vType: {type: String, required: true},
        // price: {type: String, required: true},
        count: {type: String, required: true},
        // discount: {
        //     state: {type: Boolean, required: false},
        //     amount: {type: String, required: false}
        // }
    }],
    image: {
        data: {type: String, required: true},
        name: {type: String, required: true}
    }
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
