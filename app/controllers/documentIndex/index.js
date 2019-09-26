import Router from 'koa-router';
import { localUploader } from 'upload';
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
 */

/**
 * @swagger
 * /api/documentindexes:
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
 * /api/documentindexes/search:
 *  post:
 *      tags:
 *          - Document Index
 *      summary: 문서목록 검색
 *      description: 문서목록 검색
 *      consumes:
 *          - application/json
 *      produces:
 *          - application/json
 *      parameters:
 *          - in: query
 *            name: page
 *            description: page number
 *            required: true
 *            type: number
 *            example: 1
 *          - in: body
 *            name: body
 *            descripition: search parameters
 *            required: true
 *            schema:
 *              type: object
 *              properties:
 *                  part:
 *                      type: string
 *                      example: 5d33ef877cceb91244d16fdd
 *                  partNumber:
 *                      type: string
 *                      example: R-001
 *                  officialName:
 *                      type: string
 *                      example: JWT
 *                  vendorName: 
 *                      type: string
 *                      example: 테크
 *      responses:
 *          200:
 *              descripition: Successful operation
 *              schema:
 *                  $ref: '#/definitions/documentIndex'
 */
documentIndex.post('/search', documentIndexCtrl.search);

/**
 * @swagger
 * /api/documentindexes/forselect:
 *  get:
 *      tags:
 *          - Document Index
 *      summary: 문서목록 목록 조회 (For select)
 *      description: 문서목록 목록 조회 (For select)
 *      produces:
 *          - application/json
 *      responses:
 *          200:
 *              description: Successful operation
 *              schema:
 *                  $ref: '#/definitions/documentIndex'
 */
documentIndex.get('/forselect', documentIndexCtrl.listForSelect);

/**
 * @swagger
 * /api/documentindexes/readexcel:
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
documentIndex.post('/readexcel', localUploader.single('indexes'), documentIndexCtrl.readExcel);

/**
 * @swagger
 * /api/documentindexes:
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
 * /api/documentindexes/{id}/add:
 *  patch:
 *      tags:
 *          - Document Index
 *      summary: 문서목록 개별 추가
 *      description: 문서목록 개별 추가
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
 *            example: 5d33ef877cceb91244d16fdd
 *          - in: body
 *            name: body
 *            description: documentindex parameters
 *            required: true
 *            schema:
 *              type: object
 *              properties:
 *                  list:
 *                      type: array
 *                      items:
 *                          type: object
 *                          properties:
 *                              documentNumber:
 *                                  type: string
 *                                  example: VP-NCC-R-001-004
 *                              documentTitle:
 *                                  type: string
 *                                  example: Inspection Test & Plan
 *                              plan:
 *                                  type: string
 *                                  format: date 
 *                                  example: 2019-09-11
 *      responses:
 *          200:    
 *              description: Successful operation
 *              schema:
 *                  $ref: '#/definitions/documentIndex'
 */
documentIndex.patch('/:id/add', commonCtrl.checkObjectId, documentIndexCtrl.addPartial);

/**
 * @swagger
 * /api/documentindexes/{id}:
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
 *            example: 5d33ef877cceb91244d16fdd
 *      responses:
 *          200:
 *              description: Successful operation
 *              schema:
 *                  $ref: '#/definitions/documentIndex'
 */
documentIndex.get('/:id', commonCtrl.checkObjectId, documentIndexCtrl.one);

/**
 * @swagger
 * /api/documentindexes/{id}/overall:
 *  get:
 *      tags:
 *          - Document Index
 *      summary: 문서목록 Overall
 *      description: 문서목록 Overall
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
 *            example: 5d33ef877cceb91244d16fdd
 *      responses:
 *          200:
 *              description: Successful operation
 */
documentIndex.get('/:id/overall', commonCtrl.checkObjectId, documentIndexCtrl.overall);

/**
 * @swagger
 * /api/documentindexes/{id}/statisticsbystatus:
 *  get:
 *      tags:
 *          - Document Index
 *      summary: 문서정보 Status 통계
 *      description: 문서정보 Status 통계
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
 *            example: 5d33ef877cceb91244d16fdd
 *      responses:
 *          200:
 *              description: Successful operation
 */
documentIndex.get('/:id/statisticsbystatus', commonCtrl.checkObjectId, documentIndexCtrl.statisticsByStatus);

/**
 * @swagger
 * /api/documentindexes/{id}/trackingdocument:
 *  get:
 *      tags:
 *          - Document Index
 *      summary: 문서목록 개별 조회 Detail
 *      descriptipon: 문서목록 개별 조회 Detaii
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
 *            example: 5d51826fb1bd6f04d7e8368a
 *      responses:
 *          200:
 *              description: Successful operation
 *              schema:
 *                  type: object
 *                  properties:
 *                      overral:
 *                          type: object
 *                          properties:
 *                              _id:
 *                                  type: string 
 *                                  example: 5d33ef877cceb91244d16fdd
 *                              indexTotal: 
 *                                  type: number
 *                                  example: 12
 *                              receiveTotal: 
 *                                  type: number
 *                                  example: 4
 *                              firstTotal: 
 *                                  type: number
 *                                  example: 2
 *                              deleteTotal: 
 *                                  type: number
 *                                  example: 0
 *                              holdTotal:
 *                                  type: number
 *                                  example: 0
 *                              delayTotal:
 *                                  type: number
 *                                  example: 0
 *                      staticsByStatus:
 *                          type: array
 *                          items:
 *                              type: object
 *                              properties:
 *                                  status:
 *                                      type: string
 *                                      example: '01'
 *                                  statusName:
 *                                      type: string
 *                                      example: 접수
 *                                  count:
 *                                      type: number
 *                                      example: 3
 *                      list:
 *                          type: array
 *                          items:
 *                              $ref: '#/definitions/documentInfo'
 */
documentIndex.get('/:id/trackingdocument', commonCtrl.checkObjectId, documentIndexCtrl.trackingDocument);

/**
 * @swagger
 * /api/documentindexes/{id}/edit:
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
 * /api/documentindexes/{id}/delete:
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