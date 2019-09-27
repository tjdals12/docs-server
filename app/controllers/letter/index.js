import Router from 'koa-router';
import * as commonCtrl from 'controllers/common.ctrl';
import * as letterCtrl from './letter.ctrl';

const letter = new Router();

/**
 * @swagger
 * definitions:
 *  letter:
 *      type: object
 *      required:
 *          - letterGb
 *          - letterTitle
 *          - senderGb
 *          - sender
 *          - receiverGb
 *          - receiver
 *          - officialNumber
 *          - sendDate
 *      properties:
 *          letterGb:
 *              type: string
 *              example: '02'
 *          letterTitle:
 *              type: string
 *              example: 'ABC-DEF-T-R-001-001 검토요청의 건'
 *          senderGb:
 *              type: string
 *              example: '02'
 *          sender:
 *              type: string
 *              example: '이성민 사원'
 *          receiverGb:
 *              type: string
 *              example: '01'
 *          receiver:
 *              type: string
 *              example: '김형준 대리'
 *          officialNumber:
 *              type: string
 *              example: 'HENC-HTC-T-R-001-001'
 *          sendDate:
 *              type: string
 *              format: date-time
 *              example: 2019-10-22 17:25:47
 *          replyRequired:
 *              type: string
 *              example: 'NO'
 *          targetDate:
 *              type: string
 *              format: date-time
 *              example: 2019-10-29 10:11:34
 *          replyYn:
 *              type: string
 *              example: 'YES'
 *          replyDate:
 *              type: string
 *              example: 2019-10-27 10:11:34
 *          timestamp: 
 *              $ref: '#/definitions/timestamp'
 */

/**
 * @swagger
 * /api/letters:
 *  get:
 *      tags:
 *          - Letter
 *      summary: 공식문서 목록 조회
 *      description: 공식문서 목록 조회
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
 *              description: Succeessful operation
 *              schema:
 *                  $ref: '#/definitions/letter'
 */
letter.get('/', letterCtrl.list);

/**
 * @swagger
 * /api/letters/search:
 *  post:
 *      tags:
 *          - Letter
 *      summary: 공식문서 검색
 *      description: 공식문서 검색
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
 *                  senderGb:
 *                      type: string
 *                      example: '02'
 *                  sender:
 *                      type: string
 *                      example: '이성민'
 *                  receiverGb:
 *                      type: string
 *                      example: '01'
 *                  receiver:
 *                      type: string
 *                      example: '전체'
 *                  letterGb:
 *                      type: string
 *                      example: '02'
 *                  officialNumber:
 *                      type: string
 *                      example: 'HENC-'
 *                  letterTitle:
 *                      type: string
 *                      example: '요청'
 *                  replyRequired:
 *                      type: string
 *                      example: 'YES'
 *                  replyYn:
 *                      type: string
 *                      example: 'NO'
 *                  sendDate:
 *                      type: string
 *                      format: date-time
 *                      example: 2019-09-19
 *                  targetDate:
 *                      type: string
 *                      format: date-time
 *                      example: 2019-09-27
 *      responses:
 *          200:
 *              description: Successful operation
 *              schema:
 *                  $ref: '#/definitions/letter'
 */
letter.post('/search', letterCtrl.search);

/**
 * @swagger
 * /api/letters:
 *  post:
 *      tags:
 *          - Letter
 *      summary: 공식문서 추가
 *      description: 공식문서 추가
 *      consumes:
 *          - application/json
 *      produces:
 *          - application/json
 *      parameters:
 *          - in: body
 *            name: body
 *            description: letter parameters
 *            required: true
 *            schema:
 *              type: object
 *              properties:
 *                  letterGb:
 *                      type: string
 *                      example: '02'
 *                  letterTitle:
 *                      type: string
 *                      example: 'HENC-HTC-T-R-001-001 검토요청의 건'
 *                  senderGb:
 *                      type: string
 *                      example: '02'
 *                  sender:
 *                      type: string
 *                      example: '이성민 사원'
 *                  receiverGb:
 *                      type: string
 *                      example: '01'
 *                  receiver:
 *                      type: string
 *                      example: '김상현 대리'
 *                  sendDate:
 *                      type: string
 *                      format: date-time
 *                      example: 2019-09-16 17:02:37
 *                  replyRequired:
 *                      type: string
 *                      example: 'NO'
 *      responses:
 *          200:
 *              description: Successful operation
 *              schema:
 *                  $ref: '#/definitions/letter'
 */
letter.post('/', letterCtrl.add);

/**
 * @swagger
 * /api/letters/ref/search:
 *  get:
 *      tags:
 *          - Letter
 *      summary: 참조할 문서 검색
 *      description: 참조할 문서 검색
 *      consumes:
 *          - application/json
 *      produces:
 *          - application/json
 *      parameters:
 *          - in: query
 *            name: keyword
 *            description: search keyword
 *            required: true
 *            type: string
 *            example: R-001
 *      responses:
 *          200:
 *              description: Successful operation
 *              schema:
 *                  type: array
 *                  items:
 *                      type: object
 *                      example: [ { _id: 5d33ef877cceb91244d16fdd, description: 'Boilder Feed Water Pump(성민테크) SMT-HENC-T-R-001-001 / 2019-09-21' } ]
 *                      properties:
 *                          _id:
 *                              type: string
 *                              format: ObjectId
 *                          description:
 *                              type: string
 */
letter.get('/ref/search', letterCtrl.referenceSearch);

/**
 * @swagger
 * /api/letters/{id}:
 *  get:
 *      tags:
 *          - Letter
 *      summary: 공식문서 조회
 *      description: 공식문서 조회
 *      consumes:
 *          - application/json
 *      produces:
 *          - application/json
 *      parameters:
 *          - in: path
 *            name: id
 *            description: letter id
 *            required: true
 *            type: string
 *            example: 5d33ef877cceb91244d16fdd
 *      responses:
 *          200:
 *              description: Successful operation
 *              schema:
 *                  $ref: '#/definitions/letter'
 */
letter.get('/:id', commonCtrl.checkObjectId, letterCtrl.one);

/**
 * @swagger
 * /api/letters/{id}/edit:
 *  patch:
 *      tags:
 *          - Letter
 *      summary: 공식문서 수정
 *      description: 공식문서 수정
 *      consumes:
 *          - application/json
 *      produces:
 *          - application/json
 *      parameters:
 *          - in: path
 *            name: id
 *            description: letter id
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
 *                  letterGb:
 *                      type: string
 *                      example: '02'
 *                  letterTitle:
 *                      type: string
 *                      example: 'HENC-HTC-T-R-001-028 검토요청의 건'
 *                  senderGb:
 *                      type: string
 *                      example: '02'
 *                  sender:
 *                      type: string
 *                      example: '김미경 사원'
 *                  receiverGb:
 *                      type: string
 *                      example: '01'
 *                  receiver:
 *                      type: string
 *                      example: '전체'
 *                  sendDate:
 *                      type: string
 *                      format: date
 *                      example: 2019-09-23
 *                  replyRequired:
 *                      type: string
 *                      example: 'NO'
 *      responses:
 *          200:
 *              description: Successful operation
 *              schema:
 *                  $ref: '#/definitions/letter'
 */
letter.patch('/:id/edit', commonCtrl.checkObjectId, letterCtrl.edit);

/**
 * @swagger
 * /api/letters/{id}/cancel:
 *  patch:
 *      tags:
 *          - Letter
 *      summary: 공식문서 취소
 *      description: 공식문서 취소
 *      consumes:
 *          - application/json
 *      produces:
 *          - application/json
 *      parameters:
 *          - in: path
 *            name: id
 *            description: letter id
 *            required: true
 *            type: string
 *            example: 5d33ef877cceb91244d16fdd
 *          - in: body
 *            name: body
 *            description: cancel parameters
 *            required: true
 *            schema:
 *              type: object
 *              properties:
 *                  yn:
 *                      type: string
 *                      example: 'YES'
 *                  reason:
 *                      type: string
 *                      example: '잘못 작성됨.'
 *      responses:
 *          200:
 *              description: Successful operation
 *              schema:
 *                  $ref: '#/definitions/letter'
 */
letter.patch('/:id/cancel', commonCtrl.checkObjectId, letterCtrl.cancel);

export default letter;