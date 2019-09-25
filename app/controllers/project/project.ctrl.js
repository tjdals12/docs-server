import Project from 'models/project/project';
import Joi from 'joi';

/**
 * @author      minz-logger
 * @date        2019. 09. 23
 * @description 프로젝트 목록 조회
 */
export const list = async (ctx) => {
    let page = parseInt(ctx.query.page || 1, 10);

    if (page < 1) {
        ctx.res.badRequest({
            data: page,
            message: 'Page can\'t be less than 1'
        });

        return;
    }

    try {
        const projects = await Project
            .find()
            .skip((page - 1) * 10)
            .limit(10)
            .populate({ path: 'projectGb' });

        const count = await Project.countDocuments();

        ctx.set('Total', count);
        ctx.set('Last-Page', Math.ceil(count / 10));

        ctx.res.ok({
            data: projects,
            message: 'Success - projectCtrl'
        });
    } catch (e) {
        ctx.internalServerError({
            data: [],
            message: `Error - projectCtrl > list: ${e.message}`
        });
    }
};

/**
 * @author      minz-logger
 * @date        2019. 09. 25
 * @description 프로젝트 목록 조회 (For select)
 */
export const listForSelect = async (ctx) => {
    try {
        const projects = await Project.find({}, { projectName: 1, projectCode: 1 });

        ctx.res.ok({
            data: projects,
            message: 'Success - projectCtrl > listForSelect'
        });
    } catch (e) {
        ctx.res.internalServerError({
            data: [],
            message: `Error - projectCtrl > listForSelect: ${e.message}`
        });
    }
};

/**
 * @author      minz-logger
 * @date        2019. 09. 23
 * @description 프로젝트 추가
 */
export const add = async (ctx) => {
    let {
        projectGb,
        projectName,
        projectCode,
        effStaDt,
        effEndDt,
        client,
        clientCode,
        contractor,
        contractorCode,
        memo
    } = ctx.request.body;

    const schema = Joi.object().keys({
        projectGb: Joi.string().required(),
        projectName: Joi.string().required(),
        projectCode: Joi.string().required(),
        effStaDt: Joi.string().required(),
        effEndDt: Joi.string().required(),
        client: Joi.string().required(),
        clientCode: Joi.string().required(),
        contractor: Joi.string().required(),
        contractorCode: Joi.string().required(),
        memo: Joi.string().optional(),
    });

    const result = Joi.validate(ctx.request.body, schema);

    if (result.error) {
        ctx.res.badRequest({
            data: result.error,
            message: 'Fail - projectCtrl > add'
        });

        return;
    }

    try {
        const project = await Project.saveProject({
            projectGb,
            projectName,
            projectCode,
            effStaDt,
            effEndDt,
            client,
            clientCode,
            contractor,
            contractorCode,
            memo
        });

        ctx.res.ok({
            data: project,
            message: 'Success - projectCtrl'
        });
    } catch (e) {
        ctx.res.internalServerError({
            data: ctx.request.body,
            message: `Error - projectCtrl > add: ${e.message}`
        });
    }
};

/**
 * @author      minz-logger
 * @date        2019. 09. 23
 * @description 프로젝트 조회
 */
export const one = async (ctx) => {
    let { id } = ctx.params;

    try {
        const project = await Project
            .findOne({ _id: id })
            .populate({ path: 'projectGb' });

        ctx.res.ok({
            data: project,
            message: 'Success - projectCtrl'
        });
    } catch (e) {
        ctx.res.internalServerError({
            data: id,
            message: `Error - projectCtrl > one: ${e.message}`
        });
    }
};

/**
 * @author minz-logger
 * @date 2019. 09. 24
 * @description 프로젝트 수정
 */
export const edit = async (ctx) => {
    let { id } = ctx.params;

    let {
        projectGb,
        projectName,
        projectCode,
        effStaDt,
        effEndDt,
        client,
        clientCode,
        contractor,
        contractorCode,
        memo
    } = ctx.request.body;

    const schema = Joi.object().keys({
        projectGb: Joi.string().required(),
        projectName: Joi.string().required(),
        projectCode: Joi.string().required(),
        effStaDt: Joi.string().required(),
        effEndDt: Joi.string().required(),
        client: Joi.string().required(),
        clientCode: Joi.string().required(),
        contractor: Joi.string().required(),
        contractorCode: Joi.string().required(),
        memo: Joi.string().optional()
    });

    const result = Joi.validate(ctx.request.body, schema);

    if (result.error) {
        ctx.res.badRequest({
            data: result.error,
            message: 'Fail - projectCtrl > edit'
        });
        return;
    }

    try {
        const project = await Project.editProject(id, {
            projectGb,
            projectName,
            projectCode,
            effStaDt,
            effEndDt,
            client,
            clientCode,
            contractor,
            contractorCode,
            memo
        });

        ctx.res.ok({
            data: project,
            message: 'Success - projectCtrl > edit'
        });
    } catch (e) {
        ctx.res.internalServerError({
            data: ctx.request.body,
            message: `Error - projectCtrl > edit: ${e.message}`
        });
    }
};