import express from "express";
import {create, deleteById, getAll, getById, updateById} from "../controllers/products";
import multer from "multer";
import path from "path";

// Настройка Multer для обработки файлов
const storage = multer.diskStorage({
    destination: './uploads/', // Папка, куда сохранять загруженные файлы
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
        // cb(null, file.originalname);
    },
});

const upload = multer({ storage: storage });

export default (router: express.Router) => {
    router.get('/product/:id', getById);
    router.get('/products', getAll);
    router.put('/product', upload.single('image'), create);
    router.put('/product/:id', upload.single('image'),  updateById);
    router.delete('/product/:id', deleteById);
}