import Router from 'koa-router';
import * as commonCtrl from 'controllers/commonCtrl';
import * as documentCtrl from './document.ctrl';

const document = new Router();

/**
 * @swagger
 * definitions:
 *  document:
 *      type: object
 *      required:
 *          - vendor
 *          - documentNumber
 *          - documentTitle
 *          - documentGb
 *          - documentRev
 *          - officialNumber
 *      properties:
 *          vendor:
 *              type: string
 *              format: ObjectId
 *          part:
 *              type: string
 *              default: 00
 *          documentNumber:
 *              type: string
 *              example: VP-ABC-S-001-001
 *          documentTitle:
 *              type: string
 *              example: Vendor Print Index & Schedule
 *          documentInOut:
 *              type: array
 *              items:
 *                  type: object
 *                  properties:
 *                      inOutGb:
 *                          type: string
 *                          default: 01 (업체로부터 접수)
 *                      officialNumber:
 *                          type: string
 *                      timestamp:
 *                          $ref: '#/definitions/timestamp'
 *          documentGb:
 *              type: string
 *          documentStatus:
 *              type: array
 *              items:
 *                  type: object
 *                  properties:
 *                      status: 
 *                          type: string
 *                          default: 01 (접수)
 *                      resultCode:
 *                          type: string
 *                      replyCode:
 *                          type: string
 *                      timestamp:
 *                          $ref: '#/definitions/timestamp'
 *          documentRev:
 *              type: string
 *              example: 'Rev.A'
 *          level:
 *              type: number
 *              default: 0
 *          memo:
 *              type: string
 *          holdYn:
 *              type: array
 *              items:
 *                  type: object
 *                  properties:
 *                      yn:
 *                          type: string
 *                          default: N
 *                      effStaDt:
 *                          type: string
 *                          format: date-time
 *                          example: 2019-07-21 16:21:22
 *                      effEndDt:
 *                          type: string
 *                          format: date-time
 *                          example: 9999-12-31 23:59:59
 *                      reason:
 *                          type: string
 *                          default: 이력없음.
 *          deleteYn:
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
 *          delayGb:
 *              type: string
 *              default: 01 (여유)
 *          chainingDocument:
 *              type: array
 *              items:
 *                  type: string
 *                  format: ObjectId
 *          timestamp:
 *              $ref: '#/definitions/timestamp'
 *  timestamp:
 *      type: object
 *      properties:
 *          regId:
 *              type: string
 *              default: SYSTEM
 *          regDt:
 *              type: string
 *              format: date-time
 *              default: new Date()
 *              example: 2019-07-21 16:22:56
 *          updId:
 *              type: string
 *              default: SYSTEM
 *          updDt:
 *              type: string
 *              format: date-time
 *              default: new Date()
 *              example: 2019-07-21 16:22:56
 */

/**
 * @swagger
 * /api/documents:
 *     get:
 *         tags:
 *             - Document
 *         summary: 문서 목록 조회
 *         description: 문서 목록 조회
 *         produces:
 *             - application/json
 *         responses:
 *             200:
 *                 description: Successful operation
 *                 schema:
 *                      type: array
 *                      items:
 *                          $ref: '#/definitions/document'
 */
document.get('/', documentCtrl.list);

/**
 * @swagger
 * /api/documents:
 *  post:
 *      tags:
 *          - Document
 *      summary: 문서 개별 추가
 *      description: 문서 개별 추가
 *      consumes:
 *          - application/json
 *      produces:
 *          - application/json
 *      parameters:
 *          - in: body
 *            name: body
 *            description: document parameter
 *            required: true
 *            schema:
 *              type: object
 *              properties:
 *                  vendor:
 *                      type: object
 *                      example: 5d33ef877cceb91244d16fdd
 *                  part:
 *                      type: string
 *                      example: '00'
 *                  documentNumber:
 *                      type: string
 *                      example: VP-ABC-R-001-001
 *                  documentTitle:
 *                      type: string
 *                      example: Vendor Print Index & Schedule
 *                  documentGb:
 *                      type: string
 *                      example: '01'
 *                  documentRev:
 *                      type: string
 *                      example: Rev.A
 *                  officialNumber:
 *                      type: string
 *                      example: ABC-DEF-T-R-001-001
 *                  memo:
 *                      type: string
 *                      example: 최소 접수
 *      responses:
 *          200:
 *              description: Successful operation
 *              schema:
 *                  type: object
 *                  $ref: '#/definitions/document'
 */
document.post('/', documentCtrl.add);

/**
 * @swagger
 * /api/documents:
 *  delete:
 *      tags:
 *          - Document
 *      summary: 문서 삭제
 *      description: 문서 삭제
 *      consumes:
 *          - application/json
 *      produces:
 *          - application/json  
 *      parameters:
 *          - in: body
 *            name: body
 *            description: delete parameter
 *            required: true
 *            schema:
 *              type: object
 *              properties:
 *                  id:
 *                      type: string
 *                      format: ObjectId
 *                  reason:
 *                      type: string
 *                      example: 'API 테스트 - 삭제'
 *      responses:
 *          200:
 *              description: Successful operation
 *              schema:
 *                  $ref: '#/definitions/document'
 */
document.delete('/', commonCtrl.checkObjectId, documentCtrl.deleteOne);

/**
 * @swagger
 * /api/documents:
 *  patch:
 *      tags:
 *          - Document
 *      summary: 문서 In / Out
 *      description: 문서 In / Out
 *      consumes:
 *          - application/json
 *      produces:
 *          - application/json
 *      parameters:
 *          - in: body
 *            name: body
 *            description: inOut parameters
 *            required: true
 *            schema:
 *              type: object
 *              properties:
 *                id:
 *                    type: string
 *                    format: ObjectId
 *                    required: true
 *                inOutGb:
 *                    type: string
 *                    example: '10'
 *                    required: true
 *                officialNumber:
 *                    type: string
 *                    example: 'ABC-DEF-T-R-001-001'
 *                status:
 *                    type: string
 *                    example: '10'
 *                    required: true
 *                resultCode:
 *                    type: string
 *                    example: '01'
 *                replyCode:
 *                    type: string
 *                    example: '01'
 *      responses:
 *          200:
 *              description: Successful operation
 *              schema:
 *                  $ref: '#/definitions/document'
 */
document.patch('/', commonCtrl.checkObjectId, documentCtrl.inOut);

export default document;