import Router from 'koa-router';
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
letter.get('/:id', letterCtrl.one);

export default letter;