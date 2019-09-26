import Router from 'koa-router';
import * as templateCtrl from './template.ctrl';
import * as commonCtrl from 'controllers/common.ctrl';

const template = new Router();

/**
 * @swagger
 * definitions:
 *  template:
 *      type: object
 *      required:
 *          - templateGb
 *          - templateName
 *          - templateType
 *          - templatePath
 *          - templateDescription
 *      properties:
 *          templateGb:
 *              type: string
 *              format: ObjectId
 *              example: 5d33ef877cceb91244d16fdd
 *          templateName:
 *              type: string
 *              example: 'Transmittal 양식'
 *          templateType:
 *              type: string
 *              example: 'docx'
 *          templatePath:
 *              type: string
 *              example: 'https://example.storage.com/sample.docx'
 *          templateDescription:
 *              type: string
 *              example: '사업주 송부용 Transmittal 양식'
 *          timestamp:
 *              $ref: '#/definitions/timestamp'
 */

/**
 * @swagger
 * /api/templates:
 *  get:
 *      tags:
 *          - Template
 *      summary: 양식 목록 조회
 *      description: 양식 목록 조회
 *      produces:
 *          - application/json
 *      parameters:
 *          - in: query
 *            name: page
 *            description: page number
 *            type: string
 *            example: 1
 *      responses:
 *          200:
 *              description: Successful operation
 *              schema:
 *                  $ref: '#/definitions/template'
 */
template.get('/', templateCtrl.list);

/**
 * @swagger
 * /api/templates:
 *  post:
 *      tags:
 *          - Template
 *      summary: 양식 추가
 *      description: 양식 추가
 *      consumes:
 *          - application/json
 *      produces:
 *          - application/json
 *      parameters:
 *          - in: body
 *            name: body
 *            description: template parameters
 *            required: true
 *            schema:
 *              type: object
 *              properties:
 *                  templateGb:
 *                      type: string
 *                      example: 5d33ef877cceb91244d16fdd
 *                  templateName:
 *                      type: string
 *                      example: 'Transmittal 양식'
 *                  templateType:
 *                      type: string
 *                      example: 'docx'
 *                  templatePath:
 *                      type: string
 *                      example: 'https://example.storage.com/sample.docx'
 *                  templateDescription:
 *                      type: string
 *                      example: '사업주 송부용 Transmittal 양식'
 *      responses:
 *          200:
 *              description: Successful operation
 *              schema:
 *                  $ref: '#/definitions/template'
 */
template.post('/', templateCtrl.add);

/**
 * @swagger
 * /api/templates/{id}:
 *  get:
 *      tags:
 *          - Template
 *      summary: 양식 조회
 *      description: 양식 조회
 *      consumes:
 *          - application/json
 *      produces:
 *          - application/json
 *      parameters:
 *          - in: path
 *            name: id
 *            description: template id
 *            required: true
 *            type: string
 *            example: 5d33ef877cceb91244d16fdd
 *      responses:
 *          200:
 *              description: Successful operation
 *              schema:
 *                  $ref: '#/definitions/template'
 */
template.get('/:id', commonCtrl.checkObjectId, templateCtrl.one);

export default template;