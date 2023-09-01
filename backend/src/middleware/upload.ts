import multer from "multer";
import { v4 as uuidv4 } from "uuid";
import { Request } from 'express-jwt';

// Setup multer storage
const storage = multer.diskStorage({
    destination: (req:Request, file: Express.Multer.File, cb) => {
        cb(null, './uploads/')
    },
    filename: (req:Request, file:Express.Multer.File, cb) => {
        const fileName = `${uuidv4()}-${file.originalname}`
        cb(null, fileName)
    }
});

export const upload = multer({ storage:storage });


