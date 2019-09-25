import Router from 'koa-router';
import * as commonCtrl from 'controllers/common.ctrl';
import * as projectCtrl from './project.ctrl';

const project = new Router();

/**
 * @swagger
 * definitions:
 *  project:
 *      type: object
 *      required:
 *          - projectGb
 *          - projectName
 *          - projectCode
 *          - effStaDt
 *          - effEndDt
 *          - client
 *          - clientCode
 *          - contractor
 *          - contractorCode
 *          - memo
 *      properties:
 *          projectGb:
 *              type: string
 *              format: Objectid
 *              example: 5d33ef877cceb91244d16fdd
 *          projectName:
 *              type: string
 *              example: 'Methane Gas Sales & CFU/ARO2 Project'
 *          projectCode:
 *              type: string
 *              example: 'NCC'
 *          effStaDt:
 *              type: string
 *              format: date-time
 *              example: '2017-03-01'
 *          effEndDt:
 *              type: string
 *              format: date-time
 *              example: '2018-10-31'
 *          client:
 *              type: string
 *              example: '한화토탈'
 *          clientCode:
 *              type: string
 *              example: 'HTC'
 *          contractor:
 *              type: string
 *              example: '한화건설'
 *          contractorCode:
 *              type: string
 *              example: 'HENC'
 *          memo:
 *              type: string
 *              example: '프로젝트 설명'
 *          timestamp:
 *              $ref: '#/definitions/timestamp'
 */

/**
 * @swagger
 * /api/projects:
 *  get:
 *      tags:
 *          - Project
 *      summary: 프로젝트 목록 조회
 *      description: 프로젝트 목록 조회
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
 *              description: Successful operation
 *              schema:
 *                  $ref: '#/definitions/project'
 */
project.get('/', projectCtrl.list);

/**
 * @swagger
 * /api/projects/forselect:
 *  get:
 *      tags:
 *          - Project
 *      summary: 프로젝트 목록 조회 (For select)
 *      description: 프로젝트 목록 조회 (For select)    
 *      produces:
 *          - application/json
 *      responses:
 *          200:
 *              description: Successful operation
 *              schema:
 *                  $ref: '#/definitions/project'
 */
project.get('/forselect', projectCtrl.listForSelect);

/**
 * @swagger
 * /api/projects:
 *  post:
 *      tags:
 *          - Project
 *      summary: 프로젝트 추가
 *      description: 프로젝트 추가
 *      consumes:
 *          - application/json
 *      produces:
 *          - application/json
 *      parameters:
 *          - in: body
 *            name: body
 *            description: project parameters
 *            required: true
 *            type: object
 *            schema:
 *              type: object
 *              properties:
 *                  projectGb:
 *                      type: string
 *                      example: 5d33ef877cceb91244d16fdd
 *                  projectName:
 *                      type: string
 *                      example: 'Methane Gas Sales & CFU/ARO2 Project'
 *                  projectCode:
 *                      type: string
 *                      example: 'NCC'
 *                  effStaDt:
 *                      type: string
 *                      format: date-time
 *                      example: '2017-03-01'
 *                  effEndDt:
 *                      type: string
 *                      format: date-time
 *                      example: '2018-10-31'
 *                  client:
 *                      type: string
 *                      example: '한화토탈'
 *                  clientCode:
 *                      type: string
 *                      example: 'HTC'
 *                  contractor:
 *                      type: string
 *                      example: '한화건설'
 *                  contractorCode:
 *                      type: string
 *                      example: 'HENC'
 *                  memo:
 *                      type: string
 *                      example: '프로젝트 설명'
 *      responses:
 *          200:
 *              description: Successful operation
 *              schema:
 *                  $ref: '#/definitions/project'
 */
project.post('/', projectCtrl.add);

/**
 * @swagger
 * /api/projects/{id}:
 *  get:
 *      tags:
 *          - Project
 *      summary: 프로젝트 조회
 *      description: 프로젝트 조회
 *      consumes:
 *          - application/json
 *      produces:
 *          - application/json
 *      parameters:
 *          - in: path
 *            name: id
 *            description: project id
 *            required: true
 *            type: string
 *            example: 5d33ef877cceb91244d16fdd
 *      responses:
 *          200:
 *              description: Successful operation
 *              schema:
 *                  $ref: '#/definitions/project'
 */
project.get('/:id', commonCtrl.checkObjectId, projectCtrl.one);

/**
 * @swagger
 * /api/projects/{id}/edit:
 *  patch:
 *      tags:
 *          - Project
 *      summary: 프로젝트 수정
 *      description: 프로젝트 수정
 *      consumes:
 *          - application/json
 *      produces:
 *          - application/json
 *      parameters:
 *          - in: path
 *            name: id
 *            description: project id
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
 *                  projectGb:
 *                      type: string
 *                      example: 5d33ef877cceb91244d16fdd
 *                  projectName:
 *                      type: string
 *                      example: 'High Purity N-Heptane Project'
 *                  projectCode:
 *                      type: string
 *                      example: 'HPN'
 *                  effStaDt:
 *                      type: string
 *                      format: date-time
 *                      example: '2016-07-01'
 *                  effEndDt:
 *                      type: string
 *                      format: date-time
 *                      example: '2017-10-31'
 *                  client:
 *                      type: string
 *                      example: '한화토탈'
 *                  clientCode:
 *                      type: string
 *                      example: 'HTC'
 *                  contractor:
 *                      type: string
 *                      example: '한화건설'
 *                  contractorCode:
 *                      type: string
 *                      example: 'HENC'
 *                  memo:
 *                      type: string
 *                      example: '고순도 솔벤트 12,600 ton/year 생산 설비 신설'
 *      responses:
 *          200:
 *              description: Successful operation
 *              schema:
 *                  $ref: '#/definitions/project'
 */
project.patch('/:id/edit', commonCtrl.checkObjectId, projectCtrl.edit);

export default project;