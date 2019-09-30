import Document from '../../models/document/document';
import Joi from 'joi';
import mongoose from 'mongoose';

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
            .populate({
                path: 'vendor',
                populate: { path: 'part vendorPerson' }
            })
            .populate({ path: 'part' })
            .populate({ path: 'documentGb' })
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
 * @date        2019. 08. 02
 * @description 문서 검색
 */
export const search = async (ctx) => {
    let page = parseInt(ctx.query.page || 1, 10);

    if (page < 1) {
        ctx.res.badRequest({
            data: page,
            message: 'Page can\'t be less than 1'
        });

        return;
    }

    const {
        documentGb,
        documentNumber,
        documentTitle,
        documentRev,
        documentStatus,
        deleteYn,
        holdYn,
        delayGb,
        regDtSta,
        regDtEnd,
        level
    } = ctx.request.body;

    const { ObjectId } = mongoose.Types;

    const query = {
        documentGb: ObjectId.isValid(documentGb) ? documentGb : '',
        documentNumber: documentNumber ? documentNumber : '',
        documentTitle: documentTitle ? documentTitle : '',
        documentRev: documentRev ? documentRev : '',
        documentStatus: documentStatus ? documentStatus : '',
        deleteYn: deleteYn ? deleteYn : '',
        holdYn: holdYn ? holdYn : '',
        delayGb: delayGb ? delayGb : '',
        regDtSta: regDtSta ? regDtSta : '2000-01-01',
        regDtEnd: regDtEnd ? regDtEnd : '9999-12-31',
        level: parseInt(level || -1, 10)
    };

    try {
        const documents = await Document.searchDocuments(query, page);
        const countQuery = await Document.searchDocumentsCount(query);

        ctx.set('Last-Page', Math.ceil((countQuery[0] ? countQuery[0].count : 1) / 10));

        ctx.res.ok({
            data: documents,
            message: 'Success - documentCtrl > search'
        });
    } catch (e) {
        ctx.res.internalServerError({
            data: ctx.request.body,
            message: 'Error - documentCtrl > search'
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
        part: Joi.string().required(),
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
        const document = await Document
            .findById(id)
            .populate({ path: 'vendor', populate: { path: 'part vendorPerson' } })
            .populate({ path: 'part' })
            .populate({ path: 'documentGb' });

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
        level,
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
        level: Joi.number().required(),
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
        const document = await Document.editDocument({ id, vendor, part, documentNumber, documentTitle, documentGb, documentRev, level, officialNumber, memo });

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
 * @date        2019. 08. 01
 * @description 문서 일괄 삭제
 */
export const deleteMany = async (ctx) => {
    let page = parseInt(ctx.query.page || 1, 10);
    let { ids } = ctx.request.body;

    if (page < 1) {
        ctx.res.badRequest({
            data: page,
            message: 'Page can\'t be less than 1'
        });

        return;
    }

    const schema = Joi.object().keys({
        ids: Joi.array().items(Joi.string()).required()
    });

    const result = Joi.validate(ctx.request.body, schema);

    if (result.error) {
        ctx.res.badRequest({
            data: result.error,
            message: 'Fail - documentCtrl > deleteMany'
        });

        return;
    }

    try {
        await Document.deleteDocuments(ids);

        const documents = await Document
            .find()
            .populate({ path: 'part' })
            .populate({ path: 'documentGb' })
            .skip(((page - 1) * 10))
            .limit(10)
            .sort({ 'timestamp.regDt': -1 });

        const count = await Document.countDocuments();

        ctx.set('Last-Page', Math.ceil(count / 10));

        ctx.res.ok({
            data: documents,
            message: 'Success - documentCtrl > deleteMany'
        });
    } catch (e) {
        ctx.res.internalServerError({
            data: ids,
            message: 'Error - documentCtrl > deleteMany'
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
    const { inOutGb, officialNumber, status, resultCode, replyCode, date } = ctx.request.body;

    const schema = Joi.object().keys({
        inOutGb: Joi.string().required(),
        officialNumber: Joi.string(),
        status: Joi.string(),
        resultCode: Joi.string(),
        replyCode: Joi.string(),
        date: Joi.string()
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
        const document = await Document.inOutDocument(id, inOutGb, officialNumber, status, resultCode, replyCode, date);

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
 * @date        2019. 07. 31
 * @description 문서 In / Out 삭제
 */
export const deleteInOut = async (ctx) => {
    const { id } = ctx.params;
    const { targetId } = ctx.request.body;

    const schema = Joi.object().keys({
        targetId: Joi.string().required()
    });

    const result = Joi.validate(ctx.request.body, schema);

    if (result.error) {
        ctx.res.badRequest({
            data: { id, targetId },
            message: 'Fail - documentCtrl > deleteInOut'
        });

        return;
    }

    try {
        const document = await Document.deleteInOutDocument(id, targetId);

        ctx.res.ok({
            data: document,
            message: 'Success - documentCtrl > deleteInOut'
        });
    } catch (e) {
        ctx.res.internalServerError({
            data: { id, targetId },
            message: 'Error - documentCtrl > deleteInOut'
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