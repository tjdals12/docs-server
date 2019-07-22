import Document from '../../models/document/document';
import mongoose from 'mongoose';
import Joi from 'joi';

/**
 * @author      minz-logger
 * @date        2019. 07. 21
 * @description 문서 목록 조회
 */
export const list = async (ctx) => {
    try {
        const documents = await Document.find().sort({ 'timestamp.regDt': -1 });

        ctx.res.ok({
            data: documents,
            message: 'Success - documentCtrl > list'
        });
    } catch (e) {
        ctx.res.internalServerError({
            data: [],
            message: 'Error - documentCtrl > list'
        });
    }
};

/**
 * @author      minz-logger
 * @date        2019. 07. 21
 * @description 문서 개별 추가
 */
export const add = async (ctx) => {
    let {
        vendor,
        part,
        documentNumber,
        documentTitle,
        documentGb,
        documentRev,
        officialNumber,
        memo
    } = ctx.request.body;

    const scheam = Joi.object().keys({
        vendor: Joi.string().required(),
        part: Joi.string(),
        documentNumber: Joi.string().required(),
        documentTitle: Joi.string().required(),
        documentGb: Joi.string().required(),
        documentRev: Joi.string().required(),
        officialNumber: Joi.string().required(),
        memo: Joi.string()
    });

    const result = Joi.validate(ctx.request.body, scheam);

    if (result.error) {
        ctx.res.badRequest({
            data: result.error,
            message: 'Fail - documentCtrl > fail'
        });

        return;
    }

    try {
        const document = await Document.saveDocument({
            vendor,
            part,
            documentNumber,
            documentTitle,
            documentGb,
            documentRev,
            officialNumber,
            memo
        });

        ctx.res.ok({
            data: document,
            message: 'Success - documentCtrl > add'
        });
    } catch (e) {
        ctx.res.internalServerError({
            data: ctx.request.body,
            message: 'Error - documentCtrl > add'
        });
    }
};

/**
 * @author      minz-logger
 * @date        2019. 07. 21
 * @description 문서 삭제
 */
export const deleteOne = async (ctx) => {
    let { id, reason } = ctx.request.body;

    const { ObjectId } = mongoose.Types;

    if (!ObjectId.isValid(id)) {
        ctx.res.badRequest({
            data: { id, reason, result: 'Type error - id' },
            message: 'Fail - documentCtrl > deleteOne'
        });
        return;
    }

    const schema = Joi.object().keys({
        id: Joi.string().required(),
        reason: Joi.string().required()
    });

    const result = Joi.validate(ctx.request.body, schema);

    if (result.error) {
        ctx.res.badRequest({
            data: result.error,
            message: 'Fail - documentCtrl > deleteOne'
        });

        return;
    }

    try {
        const document = await Document.deleteDocument(id, reason);

        ctx.res.ok({
            data: document,
            message: 'Success - documentCtrl > deleteOne'
        });
    } catch (e) {
        ctx.res.internalServerError({
            data: { id, reason },
            message: 'Error - documentCtrl > deleteOne'
        });
    }
};

/**
 * @author      minz-logger
 * @date        2019. 07. 22
 * @description 문서 In / Out
 */
export const inOut = async (ctx) => {
    const { id, inOutGb, officialNumber, status, resultCode, replyCode } = ctx.request.body;

    const { ObjectId } = mongoose.Types;

    if (!ObjectId.isValid(id)) {
        ctx.res.badRequest({
            data: { id, inOutGb, result: 'Type error - id' },
            message: 'Fail - documentCtrl > inOut'
        });
    }

    const schema = Joi.object().schema({
        id: Joi.string().required(),
        inOutGb: Joi.string().required(),
        officialNumber: Joi.string(),
        status: Joi.string(),
        resuleCode: Joi.string(),
        replyCode: Joi.string()
    });

    const result = Joi.validate(ctx.request.body, schema);

    if (result.error) {
        ctx.res.badRequest({
            data: result.error,
            message: 'Fail - documentCtrl > inOut'
        });
    }

    try {
        const document = await Document.inOutDocument(id, inOutGb, officialNumber, status, resultCode, replyCode);

        ctx.res.ok({
            data: document,
            message: 'Success - documentCtrl > inOut'
        });
    } catch (e) {
        ctx.res.internalServerError({
            data: { id, inOutGb },
            message: 'Error - documentCtrl > inOut'
        });
    }
};