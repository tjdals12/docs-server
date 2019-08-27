import VendorLetter from 'models/vendorLetter/vendorLetter';
import Joi from 'joi';
import { Types } from 'mongoose';

/**
 * @author      minz-logger
 * @date        2019. 08. 23
 * @description 업체 공식 문서 목록 조회
 */
export const list = async (ctx) => {
    let page = parseInt(ctx.query.page || 1, 10);

    try {
        const vendorLetters = await VendorLetter
            .find()
            .populate({ path: 'vendor', populate: { path: 'part' } })
            .populate({ path: 'documents', populate: { path: 'documentGb' } })
            .skip((page - 1) * 10)
            .limit(10)
            .sort({ 'timestamp.regDt': -1 });

        const count = await VendorLetter.countDocuments();

        ctx.set('Last-Page', Math.ceil(count / 10));

        ctx.res.ok({
            data: vendorLetters,
            message: 'Success - vendorLetterCtrl > list'
        });
    } catch (e) {
        ctx.res.internalServerError({
            data: [],
            message: 'Error - vendorLetterCtrl > list'
        });
    }
};

/**
 * @author      minz-logger
 * @date        2019. 08. 25
 * @description 업체 공식 문서 개별 조회
 */
export const one = async (ctx) => {
    let { id } = ctx.params;

    try {
        const vendorLetter = await VendorLetter
            .findOne({ _id: id })
            .populate({ path: 'vendor', populate: 'part' })
            .populate({ path: 'documents', populate: { path: 'part documentGb' } });

        ctx.res.ok({
            data: vendorLetter,
            message: 'Success - vendorLetterCtrl > one'
        });
    } catch (e) {
        ctx.res.internalServerError({
            data: id,
            message: 'Error - vendorLetterCtrl > one'
        });
    }
};

/**
 * @author      minz-logger
 * @date        2019. 08. 24
 * @description 업체 공식 문서 접수
 */
export const receive = async (ctx) => {
    let {
        vendor,
        senderGb,
        sender,
        receiverGb,
        receiver,
        officialNumber,
        receiveDocuments,
        receiveDate,
        targetDate
    } = ctx.request.body;

    const { ObjectId } = Types;

    if (!ObjectId.isValid(vendor)) {
        ctx.res.badRequest({
            data: { vendor: vendor },
            message: 'Fail - vendorLetterCtrl > receive'
        });
        return;
    }

    const schema = Joi.object().keys({
        vendor: Joi.string().required(),
        senderGb: Joi.string().required(),
        sender: Joi.string().required(),
        receiverGb: Joi.string().required(),
        receiver: Joi.string().required(),
        officialNumber: Joi.string().required(),
        receiveDocuments: Joi.array().items(Joi.object()).required(),
        receiveDate: Joi.string().required(),
        targetDate: Joi.string().required()
    });

    const result = Joi.validate(ctx.request.body, schema);

    if (result.error) {
        ctx.res.badRequest({
            data: result.error,
            message: 'Error - vendorLetterCtrl > receive'
        });
        return;
    }

    try {
        const vendorLetter = await VendorLetter.receiveVendorLetter({
            vendor,
            senderGb,
            sender,
            receiverGb,
            receiver,
            officialNumber,
            receiveDocuments,
            receiveDate,
            targetDate
        });

        ctx.res.ok({
            data: vendorLetter,
            message: 'Success - vendorLetterCtrl > receive'
        });
    } catch (e) {
        ctx.res.internalServerError({
            data: ctx.request.body,
            message: 'Error - vendorLetterCtrl > receive'
        });
    }
};

/**
 * @author      minz-logger
 * @date        2019. 08. 26
 * @description 업체 공식 문서 수정
 */
export const edit = async (ctx) => {
    let { id } = ctx.params;
    let {
        vendor,
        senderGb,
        sender,
        receiverGb,
        receiver,
        officialNumber,
        deleteDocuments,
        receiveDate,
        targetDate
    } = ctx.request.body;

    const { ObjectId } = Types;

    if (!ObjectId.isValid(vendor)) {
        ctx.res.badRequest({
            data: { vendor: vendor },
            message: 'Fail - vendorLetterCtlr > edit'
        });
        return;
    }

    const schema = Joi.object().keys({
        vendor: Joi.string().required(),
        senderGb: Joi.string().required(),
        sender: Joi.string().required(),
        receiverGb: Joi.string().required(),
        receiver: Joi.string().required(),
        officialNumber: Joi.string().required(),
        deleteDocuments: Joi.array().items(Joi.string()).required(),
        receiveDate: Joi.string().required(),
        targetDate: Joi.string().required()
    });

    const result = Joi.validate(ctx.request.body, schema);

    if (result.error) {
        ctx.res.badRequest({
            data: result.error,
            message: 'Fail - vendorLetterCtrl > edit'
        });
        return;
    }

    try {
        const vendorLetter = await VendorLetter.editVendorLetter({
            id,
            vendor,
            senderGb,
            sender,
            receiverGb,
            receiver,
            officialNumber,
            deleteDocuments,
            receiveDate,
            targetDate
        });

        ctx.res.ok({
            data: vendorLetter,
            message: 'Success - vendorLetterCtrl > edit'
        });
    } catch (e) {
        ctx.res.internalServerError({
            data: ctx.request.body,
            message: 'Error - vendorLetterCtrl > edit'
        });
    }
};

/**
 * @author      minz-logger
 * @date        2019. 08. 25
 * @description 업체 공식 문서에 문서 추가
 */
export const addPartial = async (ctx) => {
    let { id } = ctx.params;
    let {
        receiveDocuments
    } = ctx.request.body;

    const schema = Joi.object().keys({
        receiveDocuments: Joi.array().items(Joi.object().keys({
            documentNumber: Joi.string().required(),
            documentTitle: Joi.string().required(),
            documentRev: Joi.string().required()
        })).required()
    });

    const result = Joi.validate(ctx.request.body, schema);

    if (result.error) {
        ctx.res.badRequest({
            data: result.error,
            message: 'Fail - vendorLetterCtrl > addPartial'
        });
        return;
    }

    try {
        const vendorLetter = await VendorLetter.addDocumentInVendorLetter({ id, receiveDocuments });

        ctx.res.ok({
            data: vendorLetter,
            message: 'Success - vendorLetterCtrl > addPartial'
        });
    } catch (e) {
        ctx.res.internalServerError({
            data: { id, receiveDocuments },
            message: 'Error - vendorLetterCtrl > addPartial'
        });
    }
};

/**
 * @author      minz-logger
 * @date        2019. 08. 26
 * @description 업체 공식 문서 삭제
 */
export const deleteVendorLetter = async (ctx) => {
    let { id } = ctx.params;
    let { reason } = ctx.request.body;

    const schema = Joi.object().keys({
        yn: Joi.string().required(),
        reason: Joi.string().required()
    });

    const result = Joi.validate(ctx.request.body, schema);

    if (result.error) {
        ctx.res.badRequest({
            data: result.error,
            message: 'Fail - vendorLetterCtrl > deleteVendorLetter'
        });

        return;
    }

    try {
        const vendorLetter = await VendorLetter.deleteVendorLetter({ id, reason });

        ctx.res.ok({
            data: vendorLetter,
            message: 'Success - vendorLetterCtrl > deleteVendorLetter'
        });
    } catch (e) {
        ctx.res.internalServerError({
            data: { id, reason },
            message: 'Error - vendorLetterCtrl > deleteVendorLetter'
        });
    }
};

/**
 * @author      minz-logger
 * @date        2019. 08. 27
 * @description 업체 공식 문서 Status 삭제
 */
export const deleteStatus = async (ctx) => {
    let { id } = ctx.params;
    let { targetId } = ctx.request.body;

    const schema = Joi.object().keys({
        targetId: Joi.string().required()
    });

    const result = Joi.validate(ctx.request.body, schema);

    if (result.error) {
        ctx.res.badRequest({
            data: result.error,
            message: 'Fail - vendorLetterCtrl > deleteStatus'
        });

        return;
    }

    try {
        const vendorLetter = await VendorLetter.deleteStatus(id, targetId);

        ctx.res.ok({
            data: vendorLetter,
            message: 'Succeess - vendorLetterCtrl > deleteStatus'
        });
    } catch (e) {
        ctx.res.internalServerError({
            data: { id, targetId },
            message: 'Error - vendorLetterCtrl > deleteStatus'
        });
    }
};