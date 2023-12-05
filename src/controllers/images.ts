import express from "express";
import path from "path";

export const getImage = (req: express.Request, res: express.Response) => {
    const {imageName} = req.params;

    if (!imageName) {
        return res.sendStatus(403);
    }

    const imagePath = path.resolve(__dirname, `../../uploads/${imageName}`);
    let imageType = '';

    switch (true) {
        case imageName.endsWith('.png'): {
            imageType = 'image/png';
            break;
        }
        case imageName.endsWith('.jpg'): {
            imageType = 'image/jpeg';
            break;
        }
        case imageName.endsWith('.jpeg'): {
            imageType = 'image/jpeg';
            break;
        }
    }

    res.setHeader('Cache-Control', 'public, max-age=43200, must-revalidate');
    res.setHeader('Content-Type', imageType);

    return res.sendFile(imagePath);
}