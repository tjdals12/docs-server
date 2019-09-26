import Router from 'koa-router';
import { s3Uploader } from 'upload';
import cmcode from 'controllers/cmcode';
import document from 'controllers/document';
import vendor from 'controllers/vendor';
import documentIndex from 'controllers/documentIndex';
import documentInfo from 'controllers/documentInfo';
import vendorLetter from 'controllers/vendorLetter';
import letter from 'controllers/letter';
import project from 'controllers/project';
import template from 'controllers/template';

const api = new Router();

/**
 * @swagger
 * /api/upload:
 *  post:
 *      tags: 
 *          - Upload
 *      summary: S3에 업로드
 *      description: S3에 업로드
 *      consumes:
 *          - multipart/form-data
 *      produces:
 *          - application/json
 *      parameters:
 *          - in: formData
 *            name: uploadFile
 *            description: upload file
 *            type: file
 *      responses:
 *          200:
 *              description: Successful operation
 *              schema:
 *                  type: string
 *                  example: 'uploaded location'
 */
api.post('/upload', s3Uploader.single('uploadFile'), (ctx) => {
    let uploadFile = ctx.req.file;
    ctx.body = uploadFile.location;
});

api.use('/cmcodes', cmcode.routes());
api.use('/documents', document.routes());
api.use('/vendors', vendor.routes());
api.use('/documentindexes', documentIndex.routes());
api.use('/documentinfos', documentInfo.routes());
api.use('/vendorletters', vendorLetter.routes());
api.use('/letters', letter.routes());
api.use('/projects', project.routes());
api.use('/templates', template.routes());

export default api;