import Router from 'koa-router';
import upload from 'upload';
import * as commonCtrl from 'controllers/common.ctrl';
import * as documentIndexCtrl from './documentIndex.ctrl';

const documentIndex = new Router();

/**
 * @swagger
 * definitions:
 *  documentIndex:
 *      type: object
 *      required:
 *          - vendor
 *          - list
 *      properties:
 *          vendor:
 *              type: string
 *              format: ObjectId
 *          list:
 *              type: array
 *              items:
 *                  type: string
 *                  format: ObjectId
 *          timestamp:
 *              $ref: '#/definitions/timestamp'
 *  documentInfo:
 *      type: object
 *      required:
 *          - documentNumber
 *          - documentTitle
 *          - plan
 *      properties:
 *          documentNumber:
 *              type: string
 *              example: VP-ABC-DEF-R-001-001
 *          documentTitle:
 *              type: string
 *              example: Vendor Print Index & Schedule
 *          plan:
 *              type: date
 *              format: date-time
 *              default: 9999-12-31 23:59:59
 *          trackingDocument:
 *              type: array
 *              items:
 *                  type: string
 *          removeYn:
 *              type: object
 *              properties:
 *                  yn:
 *                      type: string
 *                      default: N
 *                  deleteDt:
 *                      type: string
 *                      format: date-time
 *                      default: 9999-12-31 23:59:59
 *                  reason:
 *                      type: string
 *                      default: 이력없음.
 */

/**
 * @swagger
 * /api/documentindex:
 *  get:
 *      tags:
 *          - Document Index
 *      summary: 문서목록 목록 조회
 *      description: 문서목록 목록 조회
 *      produces:
 *          - application/json
 *      responses:
 *          200:
 *              description: Successful operation
 *              schema:
 *                  $ref: '#/definitions/documentIndex'
 */
documentIndex.get('/', documentIndexCtrl.list);

/**
 * @swagger
 * /api/documentindex/readexcel:
 *  post:
 *      tags:
 *          - Document Index
 *      summary: 엑셀 파일 읽기
 *      description: 엑셀 파일 읽기
 *      consumes:
 *          - multipart/form-data
 *      produces:
 *          - application/json
 *      parameters:
 *          - in: formData
 *            name: indexes
 *            type: file
 *            required: true
 *      responses:
 *          200:
 *              description: Successful operation
 *              schema:
 *                  type: object
 *                  properties:
 *                      number:
 *                          type: string
 *                          example: VP-NCC-R-001-001
 *                      title:
 *                          type: string
 *                          example: Vendor Print Index & Schedule
 *                      plan:
 *                          type: date
 *                          example: 2019-09-21
 */
documentIndex.post('/readexcel', upload.single('indexes'), documentIndexCtrl.readExcel);

/**
 * @swagger
 * /api/documentindex:
 *  post:
 *      tags:
 *          - Document Index
 *      summary: 문서목록 생성
 *      description: 문서목록 생성
 *      consumes:
 *          - application/json
 *      produces:
 *          - application/json
 *      parameters:
 *          - in: body
 *            name: body
 *            description: documentIndex parameters
 *            required: true
 *            schema:
 *              type: object
 *              properties:
 *                  vendor:
 *                      type: string
 *                      example: 5d33ef877cceb91244d16fdd
 *                  list:
 *                      type: array
 *                      example: [{ number: 'VP-NCC-R-001-001', title: 'Vendor Print Index & Schedule', plan: '2019-09-23'}]
 *                      items:
 *                          type: object
 *      responses:
 *          200:
 *              description: Successful operation
 *              schema:
 *                  $ref: '#/definitions/documentIndex'
 */
documentIndex.post('/', documentIndexCtrl.create);

/**
 * @swagger
 * /api/documentindex/{id}:
 *  get:
 *      tags:
 *          - Document Index
 *      summary: 문서목록 개별 조회
 *      description: 문서목록 개별 조회
 *      consumes:
 *          - application/json
 *      produces:
 *          - application/json
 *      parameters:
 *          - in: path
 *            name: id
 *            description: documentindex id
 *            required: true
 *            type: string
 *      responses:
 *          200:
 *              description: Successful operation
 *              schema:
 *                  $ref: '#/definitions/documentIndex'
 */
documentIndex.get('/:id', commonCtrl.checkObjectId, documentIndexCtrl.one);

/**
 * @swagger
 * /api/documentindex/{id}/edit:
 *  patch:
 *      tags:
 *          - Document Index
 *      summary: 문서목록 수정
 *      description: 문서목록 수정
 *      consumes:
 *          - application/json
 *      produces:
 *          - application/json
 *      parameters:
 *          - in: path
 *            name: id
 *            description: documentindex id
 *            required: true
 *            type: string
 *          - in: body
 *            name: body
 *            description: documentindex parameters
 *            required: true
 *            schema:
 *              type: object
 *              properties:
 *                  vendor:
 *                      type: string
 *                      example: 5d33ef877cceb91244d16fdd
 *                  list:
 *                      type: array
 *                      example: [ '5d33ef877cceb91244d16fdd' ]
 *                      items:
 *                          type: string
 *      responses:
 *          description: Successful operation
 *          schema:
 *              $ref: '#/definitions/documentIndex'
 */
documentIndex.patch('/:id/edit', commonCtrl.checkObjectId, documentIndexCtrl.editDocumentIndex);

/**
 * @swagger
 * /api/documentindex/{id}/delete:
 *  patch:
 *      tags:
 *          - Document Index
 *      summary: 문서목록 삭제
 *      description: 문서목록 삭제
 *      consumes:
 *          - application/json
 *      produces:
 *          - application/json  
 *      parameters:
 *          - in: path
 *            name: id
 *            description: documentindex id
 *            required: true
 *            type: string
 *      responses:
 *          200:
 *              description: Successful operation
 *              schema:
 *                  $ref: '#/definitions/documentIndex'
 */
documentIndex.patch('/:id/delete', commonCtrl.checkObjectId, documentIndexCtrl.deleteDocumentIndex);

/**
 * @swagger
 * /api/documentinfo/{id}/documentinfo/delete:
 *  patch:
 *      tags:
 *          - Document Index
 *      summary: 문서정보 삭제
 *      description: 문서정보 삭제
 *      produces:
 *          - application/json
 *      consumes:
 *          - application/json
 *      parameters:
 *          - in: path
 *            name: id
 *            description: documentIndex id
 *            required: true
 *            type: string
 *          - in: body
 *            name: body
 *            description: documentInfo id
 *            required: true
 *            schema:
 *              type: object
 *              properties:
 *                  targetId:
 *                      type: string
 *                      example: 5d33ef877cceb91244d16fdd
 *      responses:
 *          200:
 *              description: Successful operation
 *              schema:
 *                  $ref: '#/definitions/documentIndex'
 */
documentIndex.patch('/:id/documentinfo/delete', commonCtrl.checkObjectId, documentIndexCtrl.deleteDocumentInfo);

export default documentIndex;