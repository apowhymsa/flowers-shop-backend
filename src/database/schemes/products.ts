import mongoose, {Schema} from "mongoose";

const ProductSchema = new mongoose.Schema({
    title: {type: String, required: true},
    categoryID: {type: Schema.Types.ObjectId, ref: 'ProductCategory', required: true},
    image: {type: String, required: true},
    variants: [{
        discount: {
            state: {type: Boolean, required: true},
            percent: {type: String, required: true}
        },
        price: {type: String, required: true},
        title: {type: String, required: true},
        ingredients: [{
            ingredient: {
                id: {type: Schema.Types.ObjectId, ref: 'Ingredient', required: true},
                variantID: {type: Schema.Types.ObjectId, ref: 'IngredientVariant', required: true}
            },
            count: {type: String, required: true}
        }]
    }]
});

export const ProductModel = mongoose.model('Product', ProductSchema);
//'variants.ingredients.ingredient.id', 'variants.ingredients.ingredient.variantID'
export const getProducts = () => ProductModel.find({});
// export const getProductCategoryById = (id: string) => ProductCategoryModel.findById(id);
export const getProductById = (id: string) => ProductModel.findById(id);
export const getProductByTitle = (title: string) => ProductModel.findOne({title});
export const createProduct = (values: Record<string, any>) => new ProductModel(values).save().then(product => product.populate(['categoryID']));
export const updateProductById = (id: string, values: Record<string, any>) => ProductModel.findByIdAndUpdate(id, values, {new: true});
export const deleteProductById = (id: string) => ProductModel.findByIdAndDelete(id);