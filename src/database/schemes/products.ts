import mongoose, { Schema } from "mongoose";

const ProductSchema = new mongoose.Schema({
  title: { type: String, required: true },
  categoryID: {
    type: Schema.Types.ObjectId,
    ref: "ProductCategory",
    required: true,
  },
  isAvailable: { type: Boolean },
  image: { type: String, required: true },
  variants: [
    {
      discount: {
        state: { type: Boolean, required: true },
        percent: { type: String, required: true },
      },
      price: { type: Number, required: true },
      title: { type: String, required: true },
      ingredients: [
        {
          ingredient: {
            id: {
              type: Schema.Types.ObjectId,
              ref: "Ingredient",
              required: true,
            },
            variantID: {
              type: Schema.Types.ObjectId,
              ref: "IngredientVariant",
              required: true,
            },
          },
          count: { type: String, required: true },
        },
      ],
    },
  ],
});

export const ProductModel = mongoose.model("Product", ProductSchema);
//'variants.ingredients.ingredient.id', 'variants.ingredients.ingredient.variantID'
export const getProducts = (filter: any) => ProductModel.find(filter);
export const getProductsByCategoryId = (id: string) =>
  ProductModel.find({ categoryID: id });
export const getProductByCategoryId = (cId: string) => ProductModel.findOne({categoryID: cId});
export const getProductByIngredientId = (iId: string) => ProductModel.findOne({
  'variants.ingredients.ingredient.id': iId
});
export const getProductById = (id: string) => ProductModel.findById(id);
export const getProductsByIds = (ids: string[]) =>
  ProductModel.find().where("_id").in(ids);
export const getProductByTitle = (title: string) =>
  ProductModel.findOne({ title });
export const getProductsByTitleIncludes = (searchTitle: string) =>
  ProductModel.find({ title: { $regex: searchTitle, $options: "i" } });
export const createProduct = (values: Record<string, any>) =>
  new ProductModel(values)
    .save()
    .then((product) => product.populate(["categoryID"]));
export const updateProductById = (id: string, values: Record<string, any>) =>
  ProductModel.findByIdAndUpdate(id, values, { new: true });
export const deleteProductById = (id: string) =>
  ProductModel.findByIdAndDelete(id);
export const getProductsCount = () => ProductModel.countDocuments({});
