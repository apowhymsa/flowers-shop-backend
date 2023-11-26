import express from "express";
import {create, deleteById, getAll, getById, updateById} from "../controllers/productCategories";
import multer from "multer";

// Настройка Multer для обработки файлов
const storage = multer.diskStorage({
    destination: './uploads/', // Папка, куда сохранять загруженные файлы
    filename: function (req, file, cb) {
        // cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
        // console.log(file.originalname, file.filename);
        cb(null, file.originalname);
    },
});

const upload = multer({ storage: storage });

export default (router: express.Router) => {
    router.get('/productCategory/:id', getById);
    router.get('/productCategories', getAll);
    router.put('/productCategory', upload.single('image'), create);
    router.put('/productCategory/:id',upload.single('image'), updateById);
    router.delete('/productCategory/:id', deleteById);
}