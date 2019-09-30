import Router from 'koa-router';
import * as commonCtrl from 'controllers/common.ctrl';
import * as documentInfoCtrl from './documentInfo.ctrl';

const documentInfo = new Router();

/**
 * @swagger
 * definitions:
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
 *          timestamp:
 *              $ref: '#/definitions/timestamp'
 */

/**
 * @swagger
 * /api/documentinfos:
 *  get:
 *      tags:
 *          - Document Info
 *      summary: 문서정보 목록 조회
 *      description: 문서정보 목록 조회 
 *      produces:
 *          - application/json
 *      parameters:
 *          - in: query
 *            name: page
 *            description: page number
 *            type: string
 *            example: 1
 *      ponses:
 *          200:
 *              description: Succeessful operation
 *              schema:
 *                  $ref: '#/definitions/documentInfo'
 */
documentInfo.get('/', documentInfoCtrl.list);

/**
 * @swagger
 * /api/documentinfos/search:
 *  get:
 *      tags:
 *          - Document Info
 *      summary: 문서정보 검색
 *      description: 문서정보 검색
 *      consumes:
 *          - application/json
 *      produces:
 *          - application/json
 *      parameters:
 *          - in: body
 *            name: body
 *            description: search parameters
 *            required: true
 *            schema:
 *              type: object
 *              properties:
 *                  vendor:
 *                      type: string
 *                      example: 5d33ef877cceb91244d16fdd
 *                  documentNumber:
 *                      type: string
 *                      example: VP-NCC-R-001-001
 *                  documentTitle:
 *                      type: string
 *                      example: Index
 *                  documentGb:
 *                      type: string
 *                      example: 5d33ef877cceb91244d16fdd
 *      respones:
 *          200:
 *              description: Successful operation
 *              schema:
 *                  $ref: '#/definitions/documentInfo'
 */
documentInfo.post('/search', documentInfoCtrl.search);

/**
 * @swagger
 * /api/documentinfos/{id}:
 *  get:
 *      tags:
 *          - Document Info
 *      summary: 문서정보 개별 조회
 *      description: 문서정보 개별 조회
 *      consumes:
 *          - application/json
 *      produces:
 *          - application/json
 *      parameters:
 *          - in: path
 *            name: id
 *            description: documentinfo id
 *            required: true
 *            type: string
 *            example: 5d33ef877cceb91244d16fdd
 *      responses:
 *          200:
 *              description: Successful operation
 *              schema:
 *                  $ref: '#/definitions/documentInfo'
 */
documentInfo.get('/:id', commonCtrl.checkObjectId, documentInfoCtrl.one);

/**
 * @swagger
 * /api/documentinfos/{vendor}/latest:
 *  get:
 *      tags:
 *          - Document Info
 *      summary: 최신 문서 목록 조회
 *      description: 최신 문서 목록 조회
 *      consumes:
 *          - application/json
 *      produces:
 *          - application/json
 *      parameters:
 *          - in: query
 *            name: page
 *            description: page number
 *            type: string
 *            example: 1
 *          - in: path
 *            name: vendor
 *            description: vendor id
 *            required: true
 *            type: string
 *            example: 5d33ef877cceb91244d16fdd
 *      responses:
 *          200:
 *              description: Successful operation
 *              schema:
 *                  type: array
 *                  items:
 *                      type: object
 *                      properties:
 *                          _id:
 *                              type: string
 *                              format: ObjectId
 *                              example: 5d33ef877cceb91244d16fdd
 *                          documentNumber:
 *                              type: string
 *                              example: 'VP-NCC-R-001-001'
 *                          documentTitle:
 *                              type: string            
 *                              example: 'Vendor Print Index & Schedule' 
 *                          latestDocument:
 *                              $ref: '#/definitions/document'
 */
documentInfo.get('/:vendor/latest', documentInfoCtrl.latest);

export default documentInfo;