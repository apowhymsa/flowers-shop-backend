import express from "express";
import {
    createProduct,
    deleteProductById,
    getProductById,
    getProductsByIds,
    getProductByTitle,
    getProducts,
    getProductsByCategoryId,
    getProductsByTitleIncludes,
    updateProductById,
    getProductsCount,
} from "../database/schemes/products";
import {getIngredientById} from "../database/schemes/ingredients";
import path from "path";
import fs from "fs/promises";

export const updateById = async (req: express.Request, res: express.Response,) => {
    try {
        const {id} = req.params;
        const {title, categoryID, variants, isNewImage, image, isNotVisible} = req.body;

        if (!id || !title || !categoryID || !variants) {
            return res.sendStatus(403);
        }

        const foundProduct = await getProductByTitle(title);

        if (foundProduct) {
            if (foundProduct.id !== id) {
                return res.sendStatus(409);
            }
        }

        if (isNewImage) {
            const oldProduct = await getProductById(id);
            const imageName = oldProduct.toObject().image;

            const imagePath = path.resolve(__dirname, `../../uploads/${imageName}`);

            fs.unlink(imagePath).then(() => console.log("deleted")).catch((e) => console.error('delete image error', e));
        }

        const product = await updateProductById(id, {
            title, categoryID, variants, isNotVisible, image: isNewImage ? req.file.filename : image,
        })
            .populate(["categoryID"])
            .exec();

        return res.status(200).json(product).end();
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
};

export const getById = async (req: express.Request, res: express.Response) => {
    try {
        const {id} = req.params;

        if (!id) {
            return res.sendStatus(403);
        }

        const product = await getProductById(id)
            .populate(["categoryID", "variants.ingredients.ingredient.id", "variants.ingredients.ingredient.variantID",])
            .exec();
        return res.status(200).json(product).end();
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
};
export const getByIds = async (req: express.Request, res: express.Response) => {
    try {
        const {ids} = req.body;

        if (!ids) {
            return res.sendStatus(403);
        }

        console.log(ids);

        const IDs = ids.map((id: any) => id.productID);
        const vIDs = ids.map((id: any) => id.variantID);

        const products = await getProductsByIds(IDs)
            .populate(["categoryID", "variants.ingredients.ingredient.id", "variants.ingredients.ingredient.variantID",])
            .exec();

        return res.status(200).json(products).end();
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
};
export const deleteById = async (req: express.Request, res: express.Response,) => {
    try {
        const {id} = req.params;

        if (!id) {
            return res.sendStatus(403);
        }

        const product = await deleteProductById(id);
        const imageName = product.toObject().image;
        const imagePath = path.resolve(__dirname, `../../uploads/${imageName}`);
        fs.unlink(imagePath).then(() => console.log("deleted")).catch((e) => console.log('delete image error', e));

        return res.status(200).json(product).end();
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
};

export const getByCategoryId = async (req: express.Request, res: express.Response,) => {
    const {categoryID} = req.params;
    const {limit} = req.query;

    try {
        const products = await getProductsByCategoryId(categoryID).limit(Number(limit) || 15,)
            .populate(["categoryID"]).exec();

        return res.status(200).json(products);
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
};

export const searchByTitleIncludes = async (req: express.Request, res: express.Response,) => {
    const {includes, onlyVisible} = req.query;

    if (!includes) {
        return res.sendStatus(403);
    }

    const foundProducts = await getProductsByTitleIncludes(includes.toString(), onlyVisible);

    return res.status(200).json(foundProducts);
};

export const getNew = async (req: express.Request, res: express.Response) => {
    // const { limit } = req.query;
    // try {
    //   const newProducts = await getProducts()
    //     .sort({ _id: -1 })
    //     .limit(Number(limit) || 15);
    //   return res.status(200).json(newProducts);
    // } catch (error) {
    //   console.log(error);
    //   return res.sendStatus(500);
    // }
};
export const getAll = async (req: express.Request, res: express.Response) => {
    const {limit, page, sort, categories, price, onlyVisible} = req.query;

    let categoriesFilter = {};
    let priceFilter = {};
    try {
        const priceArray = (price as string).split("-");
        priceFilter = {'variants.0.price': {$gte: Number(priceArray[0]), $lte: Number(priceArray[1])}};

        console.log('priceFilter', priceFilter);

        if (categories !== "all") {
            const categoriesArray = (categories as string).split(",");
            categoriesFilter = {categoryID: {$in: categoriesArray}};
        }

        const query = {
            ...categoriesFilter, ...priceFilter, isNotVisible: onlyVisible ? false : {$in: [true, false]}
        }

        const products = await getProducts(query)
            .sort({_id: sort === "asc" ? 1 : -1})
            .skip((Number(page) - 1) * Number(limit))
            .limit(Number(limit))
            .populate(["categoryID", "variants.ingredients.ingredient.id", "variants.ingredients.ingredient.variantID",])
            .exec();

        // const tmp: any = await getProducts(query).explain("executionStats");
        //
        // console.log('explain', tmp.executionStats.executionStages.filter['$and']);

        const productsCount = await getProducts(query)
            .countDocuments()
            .exec();

        return res
            .status(200)
            .json({products: products, productsCount: productsCount})
            .end();
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
};

export const create = async (req: express.Request, res: express.Response) => {
    try {
        const {title, categoryID, variants, isNotVisible} = req.body;
        const image = req.file.path;

        if (!title || !categoryID || !variants || !image) {
            return res.sendStatus(403);
        }

        const foundProduct = await getProductByTitle(title);

        if (foundProduct) {
            return res.sendStatus(409);
        }

        const product = await createProduct({
            title, categoryID, variants, isNotVisible, image: req.file.filename,
        });

        return res.status(200).json(product).end();
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
};
