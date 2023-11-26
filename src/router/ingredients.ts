import express from "express";
import {isAuthenticated} from "../middlewares";
import multer from 'multer';
import path from 'path';
import {create, deleteById, getAll, getByCategoryId, getById, updateById} from "../controllers/ingredients";

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
    router.get('/ingredient/:id', getById)
    router.get('/ingredients/:cID', getByCategoryId)
    router.get('/ingredients', getAll);
    router.put('/ingredient', upload.single('image'), create);
    router.put('/ingredient/:id', upload.single('image'),  updateById);
    router.delete('/ingredient/:id', deleteById);
}