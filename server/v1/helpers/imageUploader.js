/* eslint-disable consistent-return */
import multer from 'multer';
import { existsSync, mkdirSunc, mkdirSync } from 'fs';
import path from 'path';
import APIResponse from './Response';
import statusCodes from './status';

/**
 * Multer diskStorage
 */
const diskStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, `./upload/images/${req.params.id}/`),
  filename: (req, file, cb) => cb(null, `${file.originalname}`),
});

/**
 * Validate File
 * @param {object} req
 * @param file
 * @param cb
 */
const validateFile = (req, file, cb) => {
  const fileTypes = /jpeg|jpg|png/;
  const extensionName = fileTypes.test(path.extname(file.originalname).toLowerCase());
  const mimeType = fileTypes.test(file.mimetype);
  if (mimeType && extensionName) {
    return cb(null, true);
  }
  cb('Error: Allowed file types include: jpeg, jpg and png', false);
};

/**
 * Multer upload object
 */
const upload = multer({
  storage: diskStorage,
  limits: { fileSize: 500000 },
  // eslint-disable-next-line consistent-return
  fileFilter: validateFile,
}).array('images', 5);

/**
 * Processes file upload
 * @param {object} req
 * @param {object} res
 * @param {object} next
 */
const processUpload = (req, res, next) => {
  const response = new APIResponse();
  const meetupFolder = `./upload/images/${req.params.id}/`;
  if (!existsSync(meetupFolder)) {
    mkdirSync(meetupFolder, { recursive: true });
  }
  upload(req, res, (err) => {
    if (err) {
      response.setFailure(statusCodes.badRequest, err);
      return response.send(res);
    }
    next();
  });
};

export default processUpload;
