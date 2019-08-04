import Cmcode from '../../models/cmcode/cmcode';
import Joi from 'joi';
import { Types } from 'mongoose';

/**
 * @author      minz-logger
 * @date        2019. 07. 29
 * @description 공통코드 목록 조회
 */
export const list = async (ctx) => {
    try {
        const cmcodes = await Cmcode.find().populate({ path: 'cdMinors' });

        ctx.res.ok({
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
 * @description 상위 공통코드 조회
 */
export const one = async (ctx) => {
    let { id } = ctx.params;

    try {
        const cmcode = await Cmcode.findById(id).populate({ path: 'cdMinors' });

        ctx.res.ok({
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
 * @author minz-logger
 * @date 2019. 07. 29
 * @description 상위 공통코드 조회 by cdMajor
 */
export const oneByMajor = async (ctx) => {
    let { major } = ctx.params;

    if (!major) {
        ctx.res.badRequest({
            data: major,
            message: 'Fail - cmcodeCtrl > oneByMajor'
        });

        return;
    }

    try {
        const cmcode = await Cmcode.findOne({ cdMajor: major }).populate({ path: 'cdMinors' }).sort({ 'cdMinors.cdMinor': 1 });

        ctx.res.ok({
            data: cmcode,
            message: 'Success - cmcodeCtrl > oneByMajor'
        });
    } catch (e) {
        ctx.res.internalServerError({
            data: major,
            message: 'Error - cmcodeCtrl > oneByMajor'
        });
    }
};

/**
 * @author      minz-logger
 * @date        2019. 07. 29
 * @description 하위 공통코드 조회
 */
export const listWithMinor = async (ctx) => {
    let { id, minor } = ctx.params;

    if (!minor) {
        ctx.res.badRequest({
            data: { id, minor },
            message: 'Fail - cmcodeCtrl > listWithMinor'
        });

        return;
    }

    try {
        const cmcode = await Cmcode.findWithMinor({ id, minor });

        ctx.res.ok({
            data: cmcode,
            message: 'Success - cmcodeCtrl > listWithMinor'
        });
    } catch (e) {
        ctx.res.internalServerError({
            data: { id, minor },
            message: 'Error - cmcodeCtrl > listWithMinor'
        });
    }
};

/**
 * @author      minz-logger
 * @date        2019. 07. 29
 * @description 상위 공통코드 생성
 */
export const add = async (ctx) => {
    let {
        cdMajor,
        cdFName
    } = ctx.request.body;

    const schema = Joi.object().keys({
        cdMajor: Joi.string().required(),
        cdFName: Joi.string().required()
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
        const cmcode = await Cmcode.saveCmcodeMajor({ cdMajor, cdFName });

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
 * @description 하위 공통코드 추가
 */
export const addMinor = async (ctx) => {
    let { id } = ctx.params;
    let { cdMinor, cdSName, cdRef1 } = ctx.request.body;

    const schema = Joi.object().keys({
        cdMinor: Joi.string().required(),
        cdSName: Joi.string().required(),
        cdRef1: Joi.alternatives(Joi.string(), Joi.object())
    });

    const result = Joi.validate(ctx.request.body, schema);

    if (result.error) {
        ctx.res.badRequest({
            data: result.error,
            message: 'Fail - cmcodeCtrl > addMinor'
        });

        return;
    }

    try {
        const cmcode = await Cmcode.saveCmcodeMinor({ id, cdMinor, cdSName, cdRef1 });

        ctx.res.ok({
            data: cmcode,
            message: 'Success - cmcodeCtrl > addMinor'
        });
    } catch (e) {
        ctx.res.internalServerError({
            data: ctx.request.body,
            message: 'Error - cmcodeCtrl > addMinor'
        });
    }
};

/**
 * @author      minz-logger
 * @date        2019. 07. 29
 * @description 상위 공통코드 수정
 */
export const editCmcode = async (ctx) => {
    let { id } = ctx.params;
    let {
        cdMajor,
        cdFName
    } = ctx.request.body;

    const schema = Joi.object().keys({
        cdMajor: Joi.string().required(),
        cdFName: Joi.string().required()
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
        const cmcode = await Cmcode.editCmcode({ id, cdMajor, cdFName });

        ctx.res.ok({
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
 * @description 하위 공통코드 수정
 */
export const editMinor = async (ctx) => {
    let { id, minorId } = ctx.params;
    let {
        cdMinor,
        cdSName
    } = ctx.request.body;

    if (!Types.ObjectId.isValid(minorId)) {
        ctx.res.badRequest({
            data: {
                id, minorId, cdMinor, cdSName
            },
            message: 'Fail - cmcodeCtrl > editMinor'
        });

        return;
    }

    const schema = Joi.object().keys({
        cdMinor: Joi.string().required(),
        cdSName: Joi.string().required()
    });

    const result = Joi.validate(ctx.request.body, schema);

    if (result.error) {
        ctx.res.badRequest({
            data: result.error,
            message: 'Fail - cmcodeCtrl > editMinor'
        });

        return;
    }

    try {
        const cmcode = await Cmcode.editMinor({ id, minorId, cdMinor, cdSName });

        ctx.res.ok({
            data: cmcode,
            message: 'Succeess - cmcodeCtrl > editMinor'
        });
    } catch (e) {
        ctx.res.internalServerError({
            data: ctx.request.body,
            message: 'Error - cmcodeCtrl > editMinor'
        });
    }
};

/**
 * @author      minz-logger
 * @date        2019. 07. 29
 * @description 상위 공통코드 삭제
 */
export const deleteCmcode = async (ctx) => {
    let { id } = ctx.params;

    try {
        const cmcode = await Cmcode.deleteCmcode(id);

        ctx.res.ok({
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

/**
 * @author      minz-logger
 * @date        2019. 07. 29
 * @description 하위 공통코드 삭제
 */
export const deleteCdMinor = async (ctx) => {
    let { id, minorId } = ctx.params;

    if (!Types.ObjectId.isValid(minorId)) {
        ctx.res.badRequest({
            data: { id, minorId },
            message: 'Fail - cmcodeCtrl > deleteCdMinor'
        });

        return;
    }

    try {
        const cmcode = await Cmcode.deleteCdMinor({ id, minorId });

        ctx.res.ok({
            data: cmcode,
            message: 'Success - cmcodeCtrl > deleteCdMinor'
        });
    } catch (e) {
        ctx.res.internalServerError({
            data: { id, minorId },
            message: 'Error - cmcodeCtrl > deleteCdMinor'
        });
    }
};