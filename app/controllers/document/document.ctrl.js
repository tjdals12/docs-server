import Document from '../../models/document/document';
import Joi from 'joi';

/**
 * @author      minz-logger
 * @date        2019. 07. 21
 * @description 문서 목록 조회
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
        const documents = await Document
            .find()
            .skip(((page - 1) * 10))
            .limit(10)
            .sort({ 'timestamp.regDt': -1 });

        const count = await Document.countDocuments();

        ctx.set('Last-Page', Math.ceil(count / 10));

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
 * @date        2019. 07. 23
 * @description 문서 개별 조회
 */
export const one = async (ctx) => {
    let { id } = ctx.params;

    try {
        const document = await Document.findById(id);

        ctx.res.ok({
            data: document,
            message: 'Success - documentCtrl > one'
        });
    } catch (e) {
        ctx.res.internalServerError({
            data: ctx.param,
            message: 'Error - documentCtrl > one'
        });
    }
};

/**
 * @author      minz-logger
 * @date        2019. 07. 23
 * @description 문서 수정
 */
export const edit = async (ctx) => {
    let { id } = ctx.params;
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

    const schema = Joi.object().keys({
        vendor: Joi.string().required(),
        part: Joi.string().required(),
        documentNumber: Joi.string().required(),
        documentTitle: Joi.string().required(),
        documentGb: Joi.string().required(),
        documentRev: Joi.string().required(),
        officialNumber: Joi.string().required(),
        memo: Joi.string().required()
    });

    const result = Joi.validate(ctx.request.body, schema);

    if (result.error) {
        ctx.res.badRequest({
            data: ctx.request.body,
            message: 'Fail - documentCtrl > edit'
        });

        return;
    }

    try {
        const document = await Document.editDocument({ id, vendor, part, documentNumber, documentTitle, documentGb, documentRev, officialNumber, memo });

        ctx.res.ok({
            data: document,
            message: 'Success - documentCtrl > edit'
        });
    } catch (e) {
        ctx.res.internalServerError({
            data: ctx.request.body,
            message: 'Error - documentCtrl > edit'
        });
    }
};

/**
 * @author      minz-logger
 * @date        2019. 07. 21
 * @description 문서 삭제
 */
export const deleteOne = async (ctx) => {
    let { id } = ctx.params;
    let { yn, reason } = ctx.request.body;

    const schema = Joi.object().keys({
        yn: Joi.string().required(),
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
        const document = await Document.deleteDocument(id, yn, reason);

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
    const { id } = ctx.params;
    const { inOutGb, officialNumber, status, resultCode, replyCode } = ctx.request.body;

    const schema = Joi.object().keys({
        inOutGb: Joi.string().required(),
        officialNumber: Joi.string(),
        status: Joi.string(),
        resultCode: Joi.string(),
        replyCode: Joi.string()
    });

    const result = Joi.validate(ctx.request.body, schema);

    if (result.error) {
        ctx.res.badRequest({
            data: result.error,
            message: 'Fail - documentCtrl > inOut'
        });

        return;
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

/**
 * @author      minz-logger
 * @date        2019. 07. 23
 * @description 문서 보류
 */
export const hold = async (ctx) => {
    let { id } = ctx.params;
    let { yn, reason } = ctx.request.body;

    const schema = Joi.object().keys({
        yn: Joi.string().required(),
        reason: Joi.string().required()
    });

    const result = Joi.validate(ctx.request.body, schema);

    if (result.error) {
        ctx.res.badRequest({
            data: { id, yn, reason },
            message: result.error
        });

        return;
    }

    try {
        const document = await Document.holdDocument(id, yn, reason);

        ctx.res.ok({
            data: document,
            message: 'Success - documentCtrl > hold'
        });
    } catch (e) {
        ctx.res.internalServerError({
            data: ctx.request.body,
            message: 'Error - documentCtrl > hold'
        });
    }
};