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
 * @author minz-logger
 * @date 2019. 09. 04
 * @desscription 업체 공식 문서 목록 조회 by vendor
 */
export const listByVendor = async (ctx) => {
    const { vendor } = ctx.params;

    const { ObjectId } = Types;

    if (!ObjectId.isValid(vendor)) {
        ctx.res.badRequest({
            data: vendor,
            message: 'Fail - vendorLetterCtrl > listByVendor'
        });

        return;
    }

    try {
        const vendorLetters = await VendorLetter.listByVendor(vendor);

        ctx.res.ok({
            data: vendorLetters,
            message: 'Success - vendorLetterCtrl > listByVendor'
        });
    } catch (e) {
        ctx.res.internalServerError({
            data: [],
            message: 'Error - vendorLetterCtrl > listByVendor'
        });
    }
};

/**
 * @author      minz-logger
 * @date        2019. 09. 07
 * @description 업체 공식 문서 통계
 */
export const statisticsByTransmittal = async (ctx) => {
    let { vendor } = ctx.params;

    try {
        const statisticsByTransmittal = await VendorLetter.statisticsByTransmittal(vendor);

        ctx.res.ok({
            data: statisticsByTransmittal,
            message: 'Success - vendorLetterCtrl > statisticsByTransmittal'
        });
    } catch (e) {
        ctx.res.internalServerError({
            data: vendor,
            message: `Error - vendorLetterCtrl > statisticsByTransmittal: ${e.message}`
        });
    }
};

/**
 * @author      minz-logger
 * @date        2019. 09. 04
 * @description 업체 공식 문서 검색
 */
export const search = async (ctx) => {
    let page = parseInt(ctx.query.page || 1, 10);
    let {
        vendor,
        senderGb,
        sender,
        receiverGb,
        receiver,
        officialNumber,
        receiveDate,
        targetDate,
        letterStatus,
        cancelYn
    } = ctx.request.body;

    const { ObjectId } = Types;

    const query = {
        vendor: ObjectId.isValid(vendor) ? vendor : '',
        senderGb: senderGb ? senderGb : '',
        sender: sender ? sender : '',
        receiverGb: receiverGb ? receiverGb : '',
        receiver: receiver ? receiver : '',
        officialNumber: officialNumber ? officialNumber : '',
        receiveDate: receiveDate ? receiveDate : '2010-01-01',
        targetDate: targetDate ? targetDate : '9999-12-31',
        letterStatus: letterStatus ? letterStatus : '',
        cancelYn: cancelYn ? cancelYn : ''
    };

    try {
        let vendorLetters = await VendorLetter.searchVendorLetter(query, page);
        vendorLetters = vendorLetters.map(vendorLetter => {
            return {
                ...vendorLetter,
                senderGb: vendorLetter.senderGb === '01' ? 'CLIENT' : (vendorLetter.senderGb === '02' ? 'CONTRACTOR' : 'VENDOR'),
                receiverGb: vendorLetter.receiveGb === '01' ? 'CLIENT' : (vendorLetter.receiverGb === '02' ? 'CONTRACTOR' : 'VENDOR')
            };
        });

        const countQuery = await VendorLetter.searchVendorLetterCount(query);

        ctx.set('Last-Page', Math.ceil((countQuery[0] ? countQuery[0].count : 1) / 10));

        ctx.res.ok({
            data: vendorLetters,
            message: 'Success - vendorLetterCtrl > search'
        });
    } catch (e) {
        ctx.res.internalServerError({
            data: ctx.request.body,
            message: `Error - vendorLetterCtrl > ${e.message}`
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
            data: e,
            message: `Error - vendorLetterCtrl > ${e.message}`
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
        deleteDocuments: Joi.array().items(Joi.string()),
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
            id: Joi.optional(),
            documentNumber: Joi.string().required(),
            documentTitle: Joi.string().required(),
            documentRev: Joi.string().required()
        })).min(1).required()
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
            data: e,
            message: `Error - vendorLetterCtrl > addPartial: ${e.message}`
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
    let { yn, reason } = ctx.request.body;

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
        const vendorLetter = await VendorLetter.deleteVendorLetter({ id, yn, reason });

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
 * @date        2019. 08. 29
 * @description 업체 공식 문서 상태 변경
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
            message: 'Fail - vendorLetterCtrl > inOut'
        });

        return;
    }

    try {
        const vendorLetter = await VendorLetter.inOutVendorLetter(id, inOutGb, officialNumber, status, resultCode, replyCode, date);

        ctx.res.ok({
            data: vendorLetter,
            message: 'Success - vendorLetterCtrl > inOut'
        });
    } catch (e) {
        ctx.res.internalServerError({
            data: { id, ...ctx.requesst.body },
            message: `Error - vendorLetterCtrl > ${e.message}`
        });
    }
};

/**
 * @author      minz-logger
 * @date        2019. 08. 27
 * @description 업체 공식 문서 상태 삭제
 */
export const deleteInOut = async (ctx) => {
    let { id } = ctx.params;
    let { targetId } = ctx.request.body;

    const schema = Joi.object().keys({
        targetId: Joi.string().required()
    });

    const result = Joi.validate(ctx.request.body, schema);

    if (result.error) {
        ctx.res.badRequest({
            data: result.error,
            message: 'Fail - vendorLetterCtrl > deleteInOut'
        });

        return;
    }

    try {
        const vendorLetter = await VendorLetter.deleteInOut(id, targetId);

        ctx.res.ok({
            data: vendorLetter,
            message: 'Succeess - vendorLetterCtrl > deleteInOut'
        });
    } catch (e) {
        ctx.res.internalServerError({
            data: { id, targetId },
            message: 'Error - vendorLetterCtrl > deleteInOut'
        });
    }
};