import Router from 'koa-router';
import * as vendorCtrl from './vendor.ctrl';
import * as commonCtrl from 'controllers/common.ctrl';

const vendor = new Router();

/**
 * @swagger
 * definitions:
 *  vendor:
 *      type: object
 *      required:
 *          - vendorGb
 *          - vendorName
 *          - officialName
 *          - part
 *          - partNumber
 *          - countryCd
 *          - effStaDt
 *          - effEndDt
 *      properties:
 *          vendorGb:
 *              type: string
 *              example: '01'
 *          vendorName:
 *              type: string
 *              example: 성민테크
 *          vendorPerson:
 *              type: array
 *              items:
 *                  type: string
 *                  format: ObjectId
 *                  example: 5d33ef877cceb91244d16fdd
 *          officialName:
 *              type: string
 *              example: SMT
 *          part:
 *              type: string
 *              example: '0001'
 *          partName:
 *              type: string
 *              example: R-001
 *          countryCd:
 *              type: string
 *              example: '01'
 *          effStaDt:
 *              type: string
 *              format: date
 *              example: 2019-07-02
 *          effEndDt:
 *              type: string
 *              format: date
 *              example: 2019-08-31
 *          timestamp:
 *              $ref: '#/definitions/timestamp'
 *  person:
 *      type: object
 *      required:
 *          - name
 *          - position
 *          - email
 *          - contactNumber
 *          - task
 *      properties:
 *          name:
 *              type: string
 *              example: 이성민
 *          position:
 *              type: string
 *              example: 사원
 *          email:
 *              type: string
 *              example: lll2slll@naver.com
 *          contactNumber:
 *              type: string
 *              example: '010-4143-3664'
 *          task:
 *              type: string
 *              example: '개발'
 *          timestamp:
 *              $ref: '#/definitions/timestamp'
 */

/**
 * @swagger
 * /api/vendors:
 *     get:
 *      tags:
 *          - Vendor
 *      summary: 업체 목록 조회
 *      description: 업체 목록 조회
 *      produces:
 *          - application/json
 *      responses:
 *          200:
 *              description: Successful operation
 *              schema:
 *                  $ref: '#/definitions/vendor'
 */
vendor.get('/', vendorCtrl.list);

/**
 * @swagger
 * /api/vendors/forselect:
 *  get:
 *      tags:
 *          - Vendor
 *      summary: 업체 목록 조회 (For select)
 *      description: 업체 목록 조회 (For select)
 *      produces:
 *          - application/json
 *      responses:
 *          200:    
 *              description: Successful operation
 *              schema:
 *                  $ref: '#/definitions/vendor'
 */
vendor.get('/forselect', vendorCtrl.listForSelect);

/**
 * @swagger
 * /api/vendors/search:
 *  post:
 *      tags:
 *          - Vendor
 *      summary: 업체 검색
 *      description: 업체 검색
 *      consumes:
 *          - application/json
 *      produces:
 *          - application/json
 *      parameters:
 *          - in: body
 *            name: body
 *            description: search parameters
 *            schema:
 *              type: object
 *              properties:
 *                  vendorGb:
 *                      type: string
 *                      example: '01'
 *                  countryCd:
 *                      type: string
 *                      example: '01'
 *                  vendorName:
 *                      type: string
 *                      example: 성민테크
 *                  officialName:
 *                      type: string
 *                      example: SMT
 *                  part:
 *                      type: string
 *                      example: 5d33ef877cceb91244d16fdd
 *                  partNumber:
 *                      type: string
 *                      example: R-001
 *                  effStaDt:
 *                      type: string
 *                      example: '2000-01-01'
 *                  effEndDt:
 *                      type: string
 *                      example: '9999-12-31'
 *      responses:
 *          200:
 *              description: Successful operation
 *              schema:
 *                  $ref: '#/definitions/vendor'
 */
vendor.post('/search', vendorCtrl.search);

/**
 * @swagger
 * /api/vendors/{id}:
 *  get:
 *      tags:
 *          - Vendor
 *      summary: 업체 개별 조회
 *      description: 업체 개별 조회
 *      consumes:
 *          - application/json
 *      produces:
 *          - application/json
 *      parameters:
 *          - in: path
 *            name: id
 *            description: vendor id
 *            required: true
 *            type: string
 *            example: 5d33ef877cceb91244d16fdd
 *      responses:
 *          200:
 *              description: Successful operation
 *              schema:
 *                  $ref: '#/definitions/vendor'
 */
vendor.get('/:id', commonCtrl.checkObjectId, vendorCtrl.getVendor);

/**
 * @swagger
 * /api/vendors:
 *  post:
 *      tags:
 *          - Vendor
 *      summary: 업체 추가
 *      description: 업체 추가
 *      consumes:
 *          - application/json
 *      produces:
 *          - application/json
 *      parameters:
 *          - in: body
 *            name: body
 *            required: true
 *            schema:
 *              type: object
 *              properties:
 *                  vendorGb:
 *                      type: string
 *                      example: '01'
 *                  countryCd:
 *                      type: string
 *                      example: '01'
 *                  part:
 *                      type: string
 *                      example: 5d33ef877cceb91244d16fdd
 *                  partNumber:
 *                      type: string
 *                      example: R-001
 *                  vendorName:
 *                      type: string
 *                      example: 성민테크
 *                  officialName:
 *                      type: string
 *                      example: SMT
 *                  itemName:
 *                      type: string
 *                      example: Centrifugal Water Pump (CWP)
 *                  effStaDt:
 *                      type: string
 *                      example: 2019-08-03
 *                  effEndDt:
 *                      type: string
 *                      example: 2020-01-23
 *                  persons:
 *                      type: array
 *                      example: [ 
 *                                  { name: '이성민',
 *                                    position: '사원',
 *                                    email: 'lll2slll@naver.com', 
 *                                    contactNumber: '010-4143-3664', 
 *                                    task: '개발' }
 *                                ]
 *                      items:
 *                          type: object
 *      responses:
 *          200:
 *              description: Successful operator
 *              schema:
 *                  $ref: '#/definitions/vendor'
 */
vendor.post('/', vendorCtrl.create);

/**
 * @swagger
 * /api/vendors/{id}/edit:
 *  patch:  
 *      tags:
 *          - Vendor
 *      summary: 업체 수정
 *      description: 업체 수정
 *      consumes:
 *          - application/json
 *      produces:
 *          - application/json
 *      parameters:
 *          - in: path
 *            name: id
 *            description: vendor id
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
 *                  vendorGb:
 *                      type: string
 *                      example: '02'
 *                  countryCd:
 *                      type: string
 *                      example: '02'
 *                  part:
 *                      type: string
 *                      example: 5d33ef877cceb91244d16fdd
 *                  partNumber:
 *                      type: string
 *                      example: S-001
 *                  vendorName:
 *                      type: string
 *                      example: 성은테크
 *                  officialName:
 *                      type: string
 *                      example: SUT
 *                  itemName:
 *                      type: string
 *                      example: Boiler Feed Water Pump
 *                  effStaDt:
 *                      type: string
 *                      example: 2019-08-20
 *                  effEndDt:
 *                      type: string             
 *                      example: 2020-02-21
 *      responses:
 *          200:
 *              description: Successful operation
 *              schema:
 *                  $ref: '#/definitions/vendor'
 */
vendor.patch('/:id/edit', commonCtrl.checkObjectId, vendorCtrl.editVendor);

/**
 * @swagger
 * /api/vendors/{id}/delete:
 *  patch:
 *      tags:
 *          - Vendor
 *      summary: 업체 삭제
 *      description: 업체 삭제
 *      consumes:
 *          - application/json
 *      produces:
 *          - application/json
 *      parameters:
 *          - in: path
 *            name: id
 *            description: vendor id
 *            required: true
 *            type: string
 *            example: 5d33ef877cceb91244d16fdd
 *      responses:
 *          200:
 *              description: Successful operation
 *              schema:
 *                  $ref: '#/definitions/vendor'
 */
vendor.patch('/:id/delete', commonCtrl.checkObjectId, vendorCtrl.deleteVendor);

/**
 * @swagger
 * /api/vendors/{id}/add:
 *  post:
 *      tags:
 *          - Vendor
 *      summary: 담당자 추가
 *      description: 담당자 추가
 *      consumes:
 *          - application/json
 *      produces:
 *          - application/json
 *      parameters:
 *          - in: path
 *            name: id
 *            description: vendor id
 *            required: true
 *            type: string
 *            example: 5d33ef877cceb91244d16fdd
 *          - in: body
 *            name: body
 *            description: person parameters
 *            required: true
 *            schema:
 *              type: array
 *              items:
 *                  type: object
 *                  properties:
 *                      name:
 *                          type: string
 *                          example: 이성민
 *                      position:
 *                          type: string
 *                          example: 사원
 *                      email:
 *                          type: string
 *                          example: lll2slll@naver.com
 *                      contactNumber:
 *                          type: string
 *                          example: '010-4143-3664'
 *                      task:
 *                          type: string
 *                          example: 개발
 *      responses:
 *          200:
 *              description: Successful operation
 *              schema:
 *                  $ref: '#/definitions/vendor'
 */
vendor.post('/:id/add', vendorCtrl.addPerson);

/**
 * @swagger
 * /api/vendors/{id}/{personId}/delete:
 *  patch:
 *      tags:
 *          - Vendor
 *      summary: 담당자 삭제
 *      description: 담당자 삭제
 *      consumes:
 *          - application/json
 *      produces:
 *          - application/json
 *      parameters:
 *          - in: path
 *            name: id
 *            description: vendor id
 *            required: true
 *            type: string
 *            example: 5d33ef877cceb91244d16fdd
 *          - in: path
 *            name: personId
 *            description: person id
 *            required: true
 *            type: string
 *            example: 5d33ef877cceb91244d16fdd
 *      responses:
 *          200:
 *              description: Successful operation
 *              schema:
 *                  $ref: '#/definitions/vendor'
 */
vendor.patch('/:id/:personId/delete', commonCtrl.checkObjectId, vendorCtrl.deletePerson);

export default vendor;