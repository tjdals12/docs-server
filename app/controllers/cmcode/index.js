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
 *              $ref: '#/definitions/cdminor'
 *          cdFName:
 *              type: string
 *              example: 공종
 *          cdSName:
 *              type: string
 *              example: 공종
 *          timestamp:
 *              $ref: '#/definitions/timestamp'
 *  cdminor:
 *      type: object
 *      required: true
 *          - cdMinor
 *          - cdSName
 *      properties:
 *          cdMinor:
 *              type: string
 *              example: '0001'
 *          cdSName:
 *              type: string
 *              example: '코드명'
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
 * /api/cmcodes/{id}:
 *  get:
 *      tags:
 *          - Cmcode
 *      summary: 상위 공통코드 조회
 *      description: 상위 공통코드 조회
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
 * /api/cmcodes/{major}/minors:
 *  get:
 *      tags: 
 *          - Cmcode
 *      summary: 상위 공통코드 조회 by cdMajor
 *      description: 상위 공통코드 조회 by cdMajor
 *      consumes:
 *          - application/json
 *      produces:
 *          - application/json
 *      parameters:
 *          - in: path
 *            name: major
 *            description: cmcode cdMajor
 *            required: true
 *            type: string
 *            example: '0001'
 *      responses:
 *          200:
 *              description: Successful operation
 *              schema:
 *                  $ref: '#/definitions/cmcode'
 */
cmcode.get('/:major/minors', cmcodeCtrl.oneByMajor);

/**
 * @swagger
 * /api/cmcodes/{id}/{minor}:
 *  get:
 *      tags:
 *          - Cmcode
 *      summary: 하위 공통코드 조회
 *      description: 하위 공통코드 조회
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
 *            example: 5d3ea3a47570f80e3c363e41
 *          - in: path
 *            name: minor
 *            description: cmcode cdMinor
 *            required: true
 *            type: string
 *            example: '0001'
 *      responses:
 *          200:
 *              description: Successful operation
 *              schema:
 *                  $ref: '#/definitions/cmcode'
 */
cmcode.get('/:id/:minor', commonCtrl.checkObjectId, cmcodeCtrl.listWithMinor);

/**
 * @swagger
 * /api/cmcodes:
 *     post:
 *         tags:
 *             - Cmcode
 *         summary: 상위 공통코드 생성
 *         description: 상위 공통코드 생성
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
 *                    cdFName:
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
 * /api/cmcodes/{id}/add:
 *  patch:
 *      tags:
 *          - Cmcode
 *      summary: 하위 공통코드 추가
 *      description: 하위 공통코드 추가
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
 *          - in: body
 *            name: body
 *            description: cdMinor parameters
 *            required: true
 *            schema:
 *              type: object
 *              properties:
 *                  cdMinor:
 *                      type: string
 *                      example: '0001'
 *                  cdSName:
 *                      type: string
 *                      example: '기계'
 *                  cdRef1:
 *                      type: object
 *                      properties:
 *                          status:
 *                              type: string
 *                              example: '01'
 *      responses:
 *          200:
 *              description: Successful operation
 *              schema:
 *                  $ref: '#/definitions/cmcode'
 */
cmcode.patch('/:id/add', commonCtrl.checkObjectId, cmcodeCtrl.addMinor);

/**
 * @swagger
 * /api/cmcodes/{id}/edit:
 *  patch:
 *      tags:
 *          - Cmcode
 *      summary: 상위 공통코드 수정
 *      description: 상위 공통코드 수정
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
 *                  cdFName:
 *                      type: string
 *                      example: 공종 
 *      responses:
 *          200:
 *              description: Successful operation
 *              schema:
 *                  $ref: '#/definitions/cmcode'
 */
cmcode.patch('/:id/edit', commonCtrl.checkObjectId, cmcodeCtrl.editCmcode);

/**
 * @swagger
 * /api/cmcodes/{id}/{minorId}/edit:
 *  patch:
 *      tags: 
 *          - Cmcode
 *      summary: 하위 공통코드 수정
 *      description: 하위 공통코드 수정
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
 *            example: 5d3eb2b26ac8f9112bfead8a
 *          - in: path
 *            name: minorId
 *            description: cdMinor id
 *            required: true
 *            type: string
 *            example: 5d3e40cf742ebd0594392a15
 *          - in: body
 *            name: body
 *            description: cdSName
 *            required: true
 *            schema:
 *              type: object
 *              properties:
 *                  cdMinor:
 *                      type: string
 *                      required: true
 *                      example: '0002'
 *                  cdSName:
 *                      type: string
 *                      required: true
 *                      example: 장치
 *      responses:
 *          200:
 *              description: Successful operation
 *              schema:
 *                  $ref: '#/definitions/cmcode'
 */
cmcode.patch('/:id/:minorId/edit', commonCtrl.checkObjectId, cmcodeCtrl.editMinor);

/**
 * @swagger
 * /api/cmcodes/{id}/delete:
 *  patch:
 *      tags:
 *          - Cmcode
 *      summary: 상위 공통코드 삭제
 *      description: 상위 공통코드 삭제
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

/**
 * @swagger
 * /api/cmcodes/{id}/{minorId}/delete:
 *  patch:
 *      tags:
 *          - Cmcode
 *      summary: 하위 공통코드 삭제
 *      description: 하위 공통코드 삭제
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
 *          - in: path
 *            name: minorId
 *            description: cdMinor id
 *            required: true
 *            type: string
 *            example: 5d3e40cf742ebd0594392a15
 *      responses:
 *          200:
 *              description: Successful operation
 *              schema:
 *                  $ref: '#/definitions/cmcode'
 */
cmcode.patch('/:id/:minorId/delete', commonCtrl.checkObjectId, cmcodeCtrl.deleteCdMinor);

export default cmcode;