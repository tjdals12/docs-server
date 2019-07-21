import Document from 'models/document/document';
import InOut from 'models/document/inOut';
import Joi from 'joi';

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
        const documentInOut = new InOut({ officialNumber });
        const document = new Document({ vendor, part, documentNumber, documentTitle, documentGb, documentRev, documentInOut, memo });

        await document.save();

        ctx.body = document;
    } catch (e) {
        console.error(e);
    }
};