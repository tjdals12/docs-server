import Template from 'models/template/template';
import Joi from 'joi';

/**
 * @author      minz-logger
 * @date        2019. 09. 26
 * @description 양식 목록 조회
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
        const templates = await Template
            .find()
            .skip((page - 1) * 10)
            .limit(10)
            .populate({ path: 'templateGb' });

        const count = await Template.countDocuments();

        ctx.set('total', count);
        ctx.set('Last-Page', Math.ceil(count / 10));

        ctx.res.ok({
            data: templates,
            message: 'Success - templateCtrl > list'
        });
    } catch (e) {
        ctx.res.internalServerError({
            data: [],
            message: `Error - templateCtrl > list: ${e.message}`
        });
    }
};

/**
 * @author      minz-logger
 * @date        2019. 09. 26
 * @description 양식 추가
 */
export const add = async (ctx) => {
    let {
        templateGb,
        templateName,
        templateType,
        templatePath,
        templateDescription
    } = ctx.request.body;

    const schema = Joi.object().keys({
        templateGb: Joi.string().required(),
        templateName: Joi.string().required(),
        templateType: Joi.string().required(),
        templatePath: Joi.string().required(),
        templateDescription: Joi.string().required()
    });

    const result = Joi.validate(ctx.request.body, schema);

    if (result.error) {
        ctx.res.badRequest({
            data: result.error,
            message: 'Fail - templateCtrl > add'
        });

        return;
    }

    try {
        const template = await Template.saveTemplate({ templateGb, templateName, templateType, templatePath, templateDescription });

        ctx.res.ok({
            data: template,
            message: 'Success - templateCtrl > add'
        });
    } catch (e) {
        ctx.res.internalServerError({
            data: ctx.request.body,
            message: `Error - templateCtrl > add: ${e.message}`
        });
    }
};

/**
 * @author      minz-logger
 * @date        2019. 09. 26
 * @description 양식 조회
 */
export const one = async (ctx) => {
    let { id } = ctx.params;

    try {
        const template = await Template
            .findOne({ _id: id })
            .populate({ path: 'templateGb' });

        ctx.res.ok({
            data: template,
            message: 'Success templateCtrl > one'
        });
    } catch (e) {
        ctx.res.internalServerError({
            data: id,
            message: `Error - templateCtrl > one: ${e.message}`
        });
    }
};

/**
 * @author      minz-logger
 * @date        2019. 09. 26
 * @description 양식 수정
 */
export const edit = async (ctx) => {
    let { id } = ctx.params;

    let {
        templateGb,
        templateName,
        templateType,
        templatePath,
        templateDescription
    } = ctx.request.body;

    const schema = Joi.object().keys({
        templateGb: Joi.string().required(),
        templateName: Joi.string().required(),
        templateType: Joi.string().required(),
        templatePath: Joi.string().required(),
        templateDescription: Joi.string().required()
    });

    const result = Joi.validate(ctx.request.body, schema);

    if (result.error) {
        ctx.res.badRequest({
            data: result.error,
            message: 'Fail - templateCtrl > edit'
        });

        return;
    }

    try {
        const template = await Template.editTemplate(id, {
            templateGb,
            templateName,
            templateType,
            templatePath,
            templateDescription
        });

        ctx.res.ok({
            data: template,
            message: 'Success - templateCtrl > edit'
        });
    } catch (e) {
        ctx.res.internalServerError({
            data: ctx.request.body,
            message: `Error - templateCtrl > edit: ${e.message}`
        });
    }
};