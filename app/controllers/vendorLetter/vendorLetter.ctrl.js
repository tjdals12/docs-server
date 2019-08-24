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
            .populate({ path: 'documents', populate: { path: 'documentGb' } })
            .skip((page - 1) * 10)
            .limit(10)
            .sort({ 'timestamp.regDt': -1 });

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