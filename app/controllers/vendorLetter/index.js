import Router from 'koa-router';
import * as vendorLetterCtrl from './vendorLetter.ctrl';

const vendorLetter = new Router();

/**
 * @swagger
 * definitions:
 *  vendorLetter:
 *      type: object
 *      required:
 *          - vendor
 *          - senderGb
 *          - sender
 *          - receiverGb
 *          - receiver
 *          - officialNumber
 *          - documents
 *          - targetDate
 *      properties:
 *          vendor:
 *              type: string
 *              format: ObjectId
 *              example: 5d33ef877cceb91244d16fdd
 *          senderGb:
 *              type: string
 *              example: '01'
 *          sender:
 *              type: string
 *              example: 홍길동 대리
 *          receiverGb:
 *              type: string
 *              example: '02'
 *          receiver:
 *              type: string
 *              example: 이성민 사원
 *          officialNumber:
 *              type: string
 *              example: ABC-DEF-T-R-001-001
 *          receiveDate:
 *              type: string
 *              format: date-time
 *              example: 2019-07-21 16:21:22
 *          targetDate:
 *              type: string
 *              format: date-time
 *              example: 2019-08-05 13:37:55
 *          letterStatus:
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
 *          timestamp:
 *              $ref: '#/definitions/timestamp'
 */

/**
 * @swagger
 * /api/vendorletters:
 *  get:
 *      tags:
 *          - Vendor Letter
 *      summary: 업체 공식 문서 목록 조회
 *      description: 업체 공식 문서 목록 조회
 *      produces:
 *          - application/json  
 *      responses:
 *          200:
 *              description: Successful operation
 *              schema:
 *                  $ref: '#/definitions/vendorLetter'
 */
vendorLetter.get('/', vendorLetterCtrl.list);

export default vendorLetter;