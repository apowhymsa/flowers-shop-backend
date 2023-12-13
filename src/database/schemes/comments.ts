import mongoose, {Schema} from "mongoose";
import {IngredientModel} from "./ingredients";

const CommentSchema = new mongoose.Schema({
    productID: {type: Schema.Types.ObjectId, ref: 'Product'},
    rating: {type: String, required: true},
    commentText: {type: String, required: true},
    publishingDate: {type: String, required: true},
    dateInMs: {type: String, required: true},
    userID: {type: Schema.Types.ObjectId, ref: 'User'}
});

export const CommentModel = mongoose.model('Comment', CommentSchema);

export const getComments = () => CommentModel.find({});
export const getCommentById = (id: string) => CommentModel.findById(id)
export const getCommentsByProductId = (id: string) => CommentModel.find({productID: id});
export const createComment = (values: Record<any, any>) => new CommentModel(values).save().then(comment => comment.populate('userID'));
// export const updateIngredientCategoryById = (id: string, values: Record<string, any>) => IngredientCategoryModel.findByIdAndUpdate(id, values, {new: true});
export const deleteCommentById = (id: string) => CommentModel.findByIdAndDelete(id);
