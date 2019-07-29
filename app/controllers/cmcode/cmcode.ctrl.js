import Cmcode from 'models/cmcode/cmcode';
import Joi from 'joi';

/**
 * @author      minz-logger
 * @date        2019. 07. 29
 * @description 공통코드 목록 조회
 */
export const list = async (ctx) => {
    try {
        const cmcodes = await Cmcode.find().sort({ cdMajor: 1 });

        ctx.res.success({
            data: cmcodes,
            message: 'Success - cmcodeCtrl > list'
        });
    } catch (e) {
        ctx.res.internalServerError({
            data: [],
            message: 'Error - cmcodeCtrl > list'
        });
    }
};

/**
 * @author      minz-logger
 * @date        2019. 07. 29
 * @description 공통코드 추가
 */
export const add = async (ctx) => {
    let {
        cdMajor,
        cdMinor,
        cdFName,
        cdSName
    } = ctx.request.body;

    const schema = Joi.object().keys({
        cdMajor: Joi.string().required(),
        cdMinor: Joi.string().required(),
        cdFName: Joi.string().required(),
        cdSName: Joi.string().required()
    });

    const result = Joi.validate(ctx.request.body, schema);

    if (result.error) {
        ctx.res.badRequest({
            data: result.error,
            message: 'Fail - cmcodeCtrl > add'
        });

        return;
    }

    try {
        const cmcode = await Cmcode.saveCmcode({ cdMajor, cdMinor, cdFName, cdSName });

        ctx.res.ok({
            data: cmcode,
            message: 'Success - cmcodeCtrl > add'
        });
    } catch (e) {
        ctx.res.internalServerError({
            data: ctx.request.body,
            message: 'Error - cmcodeCtrl > add'
        });
    }
};

/**
 * @author      minz-logger
 * @date        2019. 07. 29
 * @description 공통코드 개별 조회
 */
export const one = async (ctx) => {
    let { id } = ctx.params;

    try {
        const cmcode = await Cmcode.findById(id);

        ctx.res.success({
            data: cmcode,
            message: 'Success - cmcodeCtrl > one'
        });
    } catch (e) {
        ctx.res.internalServerError({
            data: id,
            message: 'Error - cmcodeCtrl > one'
        });
    }
};

/**
 * @author      minz-logger
 * @date        2019. 07. 29
 * @description 공통코드 수정
 */
export const editCmcode = async (ctx) => {
    let { id } = ctx.params;
    let {
        cdMajor,
        cdMinor,
        cdFName,
        cdSName
    } = ctx.request.body;

    const schema = Joi.object().keys({
        cdMajor: Joi.string().required(),
        cdMinor: Joi.string().required(),
        cdFName: Joi.string().required(),
        cdSName: Joi.string().required()
    });

    const result = Joi.validate(ctx.request.body, schema);

    if (result.error) {
        ctx.res.badRequest({
            data: result.error,
            message: 'Fail - cmcodeCtrl > edit'
        });

        return;
    }

    try {
        const cmcode = await Cmcode.editCmcode({ id, cdMajor, cdMinor, cdFName, cdSName });

        ctx.res.success({
            data: cmcode,
            message: 'Success - cmcodeCtrl > edit'
        });
    } catch (e) {
        ctx.res.internalServerError({
            data: ctx.request.body,
            message: 'Error - cmcodeCtrl > editCmcode'
        });
    }
};

/**
 * @author      minz-logger
 * @date        2019. 07. 29
 * @description 공통코드 삭제
 */
export const deleteCmcode = async (ctx) => {
    let { id } = ctx.params;

    try {
        const cmcode = await Cmcode.deleteCmcode(id);

        ctx.res.success({
            data: cmcode,
            message: 'Success - cmcodeCtrl > deleteCmcode'
        });
    } catch (e) {
        ctx.res.internalServerError({
            data: id,
            message: 'Error - cmcodeCtrl > deleteCmcode'
        });
    }
};