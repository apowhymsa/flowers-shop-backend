import express from "express";
import {isAuthenticated} from "../middlewares";
import multer from 'multer';
import path from 'path';
const fs = require('fs');
import {create, deleteById, getAll, getByCategoryId, getById, updateById} from "../controllers/ingredients";

// Настройка Multer для обработки файлов
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadFolder = './uploads/'; // Specify your desired upload folder

        // Check if the folder exists, and create it if not
        if (!fs.existsSync(uploadFolder)) {
            fs.mkdirSync(uploadFolder);
        }

        cb(null, uploadFolder);
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
        // console.log(file.originalname, file.filename);
        // cb(null, file.originalname);
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