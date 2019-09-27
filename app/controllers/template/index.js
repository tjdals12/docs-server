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
 * /api/templates/forselect:
 *  get:
 *      tags:
 *          - Template
 *      summary: 양식 목록 조회 (For select)
 *      description: 양식 목록 조회 (For select)
 *      produces:
 *          - application/json
 *      responses:
 *          200:
 *              description: Successful operation
 *              schema:
 *                  type: array
 *                  items:
 *                      type: object
 *                      properties:
 *                          templateName:
 *                              type: string
 *                              example: 'Transmittal 양식'
 *                          templateGb:
 *                              $ref: '#/definitions/cdminor'
 */
template.get('/forselect', templateCtrl.listForSelect);

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

/**
 * @swagger
 * /api/templates/{id}/edit:
 *  patch:
 *      tags:
 *          - Template
 *      summary: 양식 수정
 *      description: 양식 수정
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
 *          - in: body
 *            name: body
 *            description: edit parameters
 *            required: true
 *            schema:
 *              type: object
 *              properties:
 *                  templateGb:
 *                      type: string
 *                      example: 5d8c69e07ff3d804e4b569ce
 *                  templateName:
 *                      type: string
 *                      example: '월간보고서 양식'
 *                  templateType:
 *                      type: string
 *                      example: 'xlsx'
 *                  templatePath:
 *                      type: string
 *                      example: 'https://example.storage.com/sample.xlsx'
 *                  templateDescription:
 *                      type: string
 *                      example: '월간회의용 보고서 양식(= 월간진도보고서)'
 *      responses:
 *          200:
 *              description: Successful operation
 *              schema:
 *                  $ref: '#/definitions/template'
 */
template.patch('/:id/edit', commonCtrl.checkObjectId, templateCtrl.edit);

/**
 * @swagger
 * /api/templates/download:
 *  post:
 *      tags:
 *          - Template
 *      summary: 양식 다운로드
 *      description: 양식 다운로드
 *      consumes:
 *          - application/json
 *      produces:
 *          - application/vnd.openxmlformats-officedocument.wordprocessingml.document
 *      parameters:
 *          - in: body
 *            name: body
 *            description: download parameters
 *            required: true
 *            schema:
 *              type: object
 *              properties:
 *                  key:
 *                      type: string
 *                      example: 'letter'
 *                  target:
 *                      type: string
 *                      example: 5d8b1f0f82141d53d52fb229
 *                  template:
 *                      type: string
 *                      example: 5d8c6a367ff3d804e4b569d0
 *      responses:
 *          200:
 *              description: Successful operation
 *              schema:
 *                  type: file
 */
template.post('/download', templateCtrl.download);

export default template;