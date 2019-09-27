import path from 'path';
import multer from 'koa-multer';
import multerS3 from 'multer-s3';
import AWS from 'aws-sdk';

AWS.config.loadFromPath(__dirname + '/configs/awsconfig.json');
const s3 = new AWS.S3();

// Local Storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'upload/');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

export const localUploader = multer({ storage: storage });

// S3 Storage
const storageS3 = multerS3({
    s3: s3,
    bucket: 'docs-server',
    key: function (req, file, cb) {
        let extension = path.extname(file.originalname);
        cb(null, Date.now().toString() + extension);
    }
});

export const s3Uploader = multer({ storage: storageS3 });