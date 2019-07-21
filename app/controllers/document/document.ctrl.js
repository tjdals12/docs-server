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

        ctx.body = documents;
    } catch (e) {
        console.error(e);
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
        ctx.status = 400;
        ctx.body = result.error;
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

        ctx.body = document;
    } catch (e) {
        console.error(e);
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
        ctx.status = 400;
        ctx.body = 'Type Error - id';
        return;
    }

    const schema = Joi.object().keys({
        id: Joi.string().required(),
        reason: Joi.string().required()
    });

    const result = Joi.validate(ctx.request.body, schema);

    if (result.error) {
        ctx.status = 400;
        ctx.body = result.error;
        return;
    }

    try {
        const document = await Document.deleteDocument(id, reason);

        ctx.body = document;
    } catch (e) {
        console.error(e);
    }
};