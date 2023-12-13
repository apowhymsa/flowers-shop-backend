import express from "express";
import {createComment, getCommentsByProductId} from "../database/schemes/comments";

export const create = async (req: express.Request, res: express.Response) => {
    const {
        productID, rating, commentText, publishingDate, dateInMs, userID
    } = req.body;

    if (!productID || !rating || !commentText || !publishingDate || !dateInMs || !userID) {
        return res.sendStatus(403);
    }

    try {
        const comments = await createComment({
            productID, rating, commentText, publishingDate, dateInMs, userID
        });

        return res.status(200).json(comments);
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
}
export const getByProductId = async (req: express.Request, res: express.Response) => {
    const {productID} = req.params;

    if (!productID) {
        return res.sendStatus(403);
    }

    try {
        const comments = await getCommentsByProductId(productID).sort({_id: -1}).populate('userID').exec();

        return res.status(200).json(comments);
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
}