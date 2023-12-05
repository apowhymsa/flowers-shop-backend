import mongoose, {Schema} from "mongoose";

const ProductCategorySchema = new mongoose.Schema({
    title: {type: String, required: true},
    image: {type: String, required: true}
});

export const ProductCategoryModel = mongoose.model('ProductCategory', ProductCategorySchema);

export const getProductCategories = () => ProductCategoryModel.find({});
export const getProductCategoryById = (id: string) => ProductCategoryModel.findById(id);
export const getProductCategoryByTitle = (title: string) => ProductCategoryModel.findOne({title});
export const createProductCategory = (values: Record<string, any>) => new ProductCategoryModel(values).save().then(productCategory => productCategory.toObject());
export const updateProductCategoryById = (id: string, values: Record<string, any>) => ProductCategoryModel.findByIdAndUpdate(id, values, {new: true});
export const deleteProductCategoryById = (id: string) => ProductCategoryModel.findByIdAndDelete(id);