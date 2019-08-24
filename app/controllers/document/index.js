import Router from 'koa-router';
import * as commonCtrl from 'controllers/common.ctrl';
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
 *         consumes:
 *             - application/json
 *         produces:
 *             - application/json
 *         parameters:
 *             - in: query
 *               name: page
 *               description: page number
 *               type: string
 *               example: 1
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
 * /api/documents/search:
 *  post:
 *      tags:
 *          - Document
 *      summary: 문서 검색
 *      description: 문서 검색
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
 *          - in: body
 *            name: body
 *            description: search parameters
 *            required: true
 *            schema:
 *              type: object
 *              properties:
 *                   documentGb:
 *                      type: string
 *                      example: ""
 *                   documentNumber:
 *                      type: string
 *                      example: "R-001"
 *                   documentTitle:
 *                      type: string
 *                      example: "Schedule"
 *                   documentRev:
 *                      type: string
 *                      example: "A"
 *                   documentStatus:
 *                      type: string
 *                      example: "01"
 *                   deleteYn:
 *                      type: string
 *                      example: "NO"
 *                   holdYn:
 *                      type: string
 *                      example: "NO"
 *                   delayGb:
 *                      type: string
 *                      example: "01"
 *                   regDtSta:
 *                      type: string
 *                      example: "2000-01-01"
 *                   regDtEnd:
 *                      type: string
 *                      example: "9999-12-31"
 *                   level:
 *                      type: string
 *                      example: 0
 *      responses:
 *          200:
 *              description: Successful operation
 *              schema:
 *                  $ref: '#/definitions/document'
 */
document.post('/search', documentCtrl.search);

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
 *                      example: 5d40020eedf1961ced85a652
 *                  documentNumber:
 *                      type: string
 *                      example: VP-ABC-R-001-001
 *                  documentTitle:
 *                      type: string
 *                      example: Vendor Print Index & Schedule
 *                  documentGb:
 *                      type: string
 *                      example: 5d400221edf1961ced85a654
 *                  documentRev:
 *                      type: string
 *                      example: Rev.A
 *                  officialNumber:
 *                      type: string
 *                      example: ABC-DEF-T-R-001-001
 *                  memo:
 *                      type: string
 *                      example: 최초 접수
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
 * /api/documents/{id}:
 *  get:
 *      tags:
 *          - Document
 *      summary: 문서 개별 조회
 *      description: 문서 개별 조회
 *      consumes:
 *          - application/json
 *      produces:
 *          - application/json
 *      parameters:
 *          - in: path
 *            name: id
 *            descrpition: document id
 *            required: true
 *            type: string
 *            example: 5d366060bf3208038ea06f13
 *      responses:
 *          200:
 *              description: Successful operation
 *              schema:
 *                  $ref: '#/definitions/document'
 */
document.get('/:id', documentCtrl.one);

/**
 * @swagger
 * /api/documents/{id}/edit:
 *  patch:
 *      tags:
 *          - Document
 *      summary: 문서 수정
 *      description: 문서 수정
 *      consumes:
 *          - application/json
 *      produces:
 *          - application/json
 *      parameters:
 *          - in: path
 *            name: id
 *            description: document id
 *            required: true
 *            type: string
 *            example: 5d366ffdb984ac07b72e9126
 *          - in: body
 *            name: body
 *            description: edit parameters
 *            required: true
 *            schema:
 *              type: object
 *              properties:
 *                  vendor:
 *                      type: string
 *                      example: 5d366ffdb984ac07b72e9126
 *                  part:
 *                      type: string
 *                      example: 5d40020eedf1961ced85a652
 *                  documentNumber:
 *                      type: string
 *                      example: VP-ABC-R-001-001
 *                  documentTitle:
 *                      type: string
 *                      example: Drawing
 *                  documentGb:
 *                      type: string
 *                      example: 5d400221edf1961ced85a654
 *                  documentRev: 
 *                      type: string
 *                      example: 'Rev.A'
 *                  officialNumber:
 *                      type: string
 *                      example: ABC-DEF-T-R-001-001
 *                  memo:
 *                      type: string
 *                      example: 'API 테스트 - 수정'
 *      responses:
 *          200:
 *              description: Successful operation
 *              schema:
 *                  $ref: '#/definitions/document'
 */
document.patch('/:id/edit', commonCtrl.checkObjectId, documentCtrl.edit);

/**
 * @swagger
 * /api/documents/{id}/delete:
 *  patch:
 *      tags:
 *          - Document
 *      summary: 문서 삭제
 *      description: 문서 삭제
 *      consumes:
 *          - application/json
 *      produces:
 *          - application/json  
 *      parameters:
 *          - in: path
 *            name: id
 *            description: document id
 *            required: true
 *            type: string
 *            example: 5d366ffdb984ac07b72e9126
 *          - in: body
 *            name: body
 *            description: delete parameter
 *            required: true
 *            schema:
 *              type: object
 *              properties:
 *                  yn:
 *                      type: string
 *                      example: YES
 *                  reason:
 *                      type: string
 *                      example: 'API 테스트 - 삭제'
 *      responses:
 *          200:
 *              description: Successful operation
 *              schema:
 *                  $ref: '#/definitions/document'
 */
document.patch('/:id/delete', commonCtrl.checkObjectId, documentCtrl.deleteOne);

/**
 * @swagger
 * /api/documents/delete:
 *  patch:
 *      tags:
 *          - Document
 *      summary: 문서 일괄 삭제
 *      description: 문서 일괄 삭제
 *      consumes:
 *          - application/json
 *      produces:
 *          - application/json
 *      parameters:
 *          - in: body
 *            name: body
 *            description: document ids
 *            required: true
 *            schema:
 *              type: object
 *              properties:
 *                  ids:
 *                      type: array
 *                      example: ['5d366ffdb984ac07b72e9126', '5d366ffdb984ac07b72e9126']
 *                      items:
 *                          type: string
 *      responses:
 *          200:
 *              description: Successful operation
 *              schema:
 *                  $ref: '#/definitions/document'
 */
document.patch('/delete', documentCtrl.deleteMany);

/**
 * @swagger
 * /api/documents/{id}/inout:
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
 *          - in: path
 *            name: id
 *            description: document id
 *            required: true
 *            type: string
 *            example: 5d366facb82dc107a4699999
 *          - in: body
 *            name: body
 *            description: inOut parameters
 *            required: true
 *            schema:
 *              type: object
 *              properties:
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
 *                date:
 *                    type: string
 *                    formate: date-time
 *                    example: '2018-12-05 14:34:12'
 *      responses:
 *          200:
 *              description: Successful operation
 *              schema:
 *                  $ref: '#/definitions/document'
 */
document.patch('/:id/inout', commonCtrl.checkObjectId, documentCtrl.inOut);

/**
 * @swagger
 * /api/documents/{id}/inout/delete:
 *  patch:
 *      tags:
 *          - Document
 *      summary: 문서 In / Out 삭제
 *      description: 문서 In / Out 삭제
 *      consumes:
 *          - application/json
 *      produces:
 *          - application/json
 *      parameters:
 *          - in: path
 *            name: id
 *            description: document id
 *            required: true
 *            type: string
 *            example: 5d366facb82dc107a4699999
 *          - in: body
 *            name: body
 *            description: documentInOut or documentStatus id
 *            required: string
 *            schema:
 *              properties:
 *                  targetId:
 *                      type: string
 *                      example: 5d366facb82dc107a4699999
 *      responses:
 *          200:
 *              description: Successful operation
 *              schema:
 *                  $ref: '#/definitions/document'
 */
document.patch('/:id/inout/delete', commonCtrl.checkObjectId, documentCtrl.deleteInOut);

/**
 * @swagger
 * /api/documents/{id}/hold:
 *  patch:
 *      tags:
 *          - Document
 *      summary: 문서 보류
 *      description: 문서 보류
 *      consumes:
 *          - application/json
 *      produces:
 *          - application/json
 *      parameters:
 *          - in: path
 *            name: id
 *            description: document id
 *            required: true
 *            type: string
 *            example: 5d366060bf3208038ea06f13
 *          - in: body
 *            name: body
 *            description: hold parameters
 *            required: true
 *            schema:
 *              type: object
 *              properties:
 *                  yn:
 *                      type: string
 *                      example: YES
 *                  reason: 
 *                      type: string
 *                      example: 'API 테스트 - 보류'
 *      responses:
 *          200:
 *              description: Successful operation
 *              schema:
 *                  $ref: '#/definitions/document'
 */
document.patch('/:id/hold', commonCtrl.checkObjectId, documentCtrl.hold);

export default document;