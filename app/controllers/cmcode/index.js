import Router from 'koa-router';
import * as commonCtrl from 'controllers/common.ctrl';
import * as cmcodeCtrl from './cmcode.ctrl';

const cmcode = new Router();

/**
 * @swagger
 * definitions:
 *  cmcode:
 *      type: object
 *      required:
 *          - cdMajor
 *          - cdMinor
 *          - cdFName
 *          - cdSName
 *      properties:
 *          cdMajor:
 *              type: string
 *              example: '0001'
 *          cdMinor:
 *              type: string
 *              example: '0001'
 *          cdFName:
 *              type: string
 *              example: 공종
 *          cdSName:
 *              type: string
 *              example: 공종
 *          timestamp:
 *              $ref: '#/definitions/timestamp'
 */

/**
 * @swagger
 * /api/cmcodes:
 *  get:
 *      tags:
 *          - Cmcode
 *      summary: 공통코드 목록 조회
 *      description: 공통코드 목록 조회
 *      produces:
 *          - application/json
 *      responses:
 *          200:
 *              description: Successful operation
 *              schema:
 *                  $ref: '#/definitions/cmcode'
 */
cmcode.get('/', cmcodeCtrl.list);

/**
 * @swagger
 * /api/cmcodes:
 *     post:
 *         tags:
 *             - Cmcode
 *         summary: 공통코드 추가
 *         description: 공통코드 추가
 *         consumes:
 *             - application/json
 *         produces:
 *             - application/json
 *         parameters:
 *             - in: body
 *               name: body
 *               description: cmcode parameters
 *               required: true
 *               schema:
 *                  type: object
 *                  properties:
 *                    cdMajor:
 *                        type: string
 *                        example: '0001'
 *                        required: true
 *                    cdMinor:
 *                        type: string
 *                        example: '0001'
 *                        required: true
 *                    cdFName:
 *                        type: string
 *                        example: 공종
 *                        required: true
 *                    cdSName:
 *                        type: string
 *                        example: 공종
 *                        required: true
 *         responses:
 *             200:
 *                 description: Successful operation
 *                 schema:
 *                     $ref: '#/definitions/cmcode'
 */
cmcode.post('/', cmcodeCtrl.add);

/**
 * @swagger
 * /api/cmcodes/{id}:
 *  get:
 *      tags:
 *          - Cmcode
 *      summary: 공통코드 개별 조회
 *      description: 공통코드 개별 조회
 *      consumes:
 *          - application/json
 *      produces:
 *          - application/json
 *      parameters:
 *          - in: path
 *            name: id
 *            description: cmcode id
 *            required: true
 *            type: string
 *            example: 5d3e4a41709a5107893bfe4c
 *      responses:
 *          200:
 *              description: Successful operation
 *              schema:
 *                  $ref: '#/definitions/cmcode'
 */
cmcode.get('/:id', commonCtrl.checkObjectId, cmcodeCtrl.one);

/**
 * @swagger
 * /api/cmcodes/{id}/edit:
 *  patch:
 *      tags:
 *          - Cmcode
 *      summary: 공통코드 수정
 *      description: 공통코드 수정
 *      consumes:
 *          - application/json
 *      produces:
 *          - application/json
 *      parameters:
 *          - in: path
 *            name: id
 *            description: cmcode id
 *            required: true
 *            type: string
 *            example: 5d3e40cf742ebd0594392a15
 *          - in: body
 *            name: body
 *            description: cmcode parameters
 *            required: true
 *            schema:
 *              type: object
 *              properties:
 *                  cdMajor:
 *                      type: string
 *                      example: '0001'
 *                  cdMinor:
 *                      type: string
 *                      example: '0002'
 *                  cdFName:
 *                      type: string
 *                      example: 공종
 *                  cdSName:
 *                      type: string
 *                      example: 기계   
 *      responses:
 *          200:
 *              description: Successful operation
 *              schema:
 *                  $ref: '#/definitions/cmcode'
 */
cmcode.patch('/:id/edit', commonCtrl.checkObjectId, cmcodeCtrl.editCmcode);

/**
 * @swagger
 * /api/cmcodes/{id}/delete:
 *  patch:
 *      tags:
 *          - Cmcode
 *      summary: 공통코드 삭제
 *      description: 공통코드 삭제
 *      consumes:
 *          - application/json
 *      produces:
 *          - application/json
 *      parameters:
 *          - in: path
 *            name: id
 *            descriptipon: cmcode id
 *            type: string
 *            example: 5d3e40cf742ebd0594392a15
 *      responses:
 *          200:
 *              description: Successful operation
 *              schema:
 *                  $ref: '#/definitions/cmcode'
 */
cmcode.patch('/:id/delete', commonCtrl.checkObjectId, cmcodeCtrl.deleteCmcode);

export default cmcode;