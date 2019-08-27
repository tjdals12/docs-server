import DocumentInfo from 'models/documentIndex/documentInfo';
import { Types } from 'mongoose';

/**
 * @author      minz-logger
 * @date        2019. 08. 25
 * @description 문서정보 목록 조회
 */
export const list = async (ctx) => {
    let page = parseInt(ctx.query.page || 1, 10);

    try {
        const documentInfos = await DocumentInfo
            .find()
            .skip((page - 1) * 10)
            .limit(10)
            .sort({ 'timestamp.regDt': -1 })
            .populate({ path: 'vendor', populate: { path: 'part' } })
            .populate({ path: 'documentGb' });

        const count = await DocumentInfo.countDocuments();

        ctx.set('Last-Page', Math.ceil(count / 10));

        ctx.res.ok({
            data: documentInfos,
            message: 'Success - documentInfoCtrl > list'
        });
    } catch (e) {
        ctx.res.internalServerError({
            data: [],
            message: 'Error - documentInfoCtrl > list'
        });
    }
};

/**
 * @author      minz-logger
 * @date        2019. 08. 26
 * @description 문서정보 검색
 */
export const search = async (ctx) => {
    let page = parseInt(ctx.query.page || 1, 10);

    if (page < 1) {
        ctx.res.badRequest({
            data: page,
            message: 'Fail - documentInfoCtrl > search'
        });

        return;
    }

    let {
        vendor,
        documentNumber,
        documentTitle,
        documentGb
    } = ctx.request.body;

    const { ObjectId } = Types;

    const query = {
        vendor: ObjectId.isValid(vendor) ? vendor : '',
        documentNumber: documentNumber === '' ? '' : documentNumber,
        documentTitle: documentTitle === '' ? '' : documentTitle,
        documentGb: ObjectId.isValid(documentGb) ? documentGb : ''
    };

    try {
        const documentInfos = await DocumentInfo.searchDocumentInfos(query, page);
        const count = await DocumentInfo.searchDocumentInfosCount(query);

        ctx.set('Last-Page', Math.ceil(count / 10));

        ctx.res.ok({
            data: documentInfos,

            message: 'Success - documentInfoCtrl > search'
        });
    } catch (e) {
        ctx.res.internalServerError({
            data: ctx.request.body,
            message: 'Error - documentInfoCtrl > search'
        });
    }
};

/**
 * @author      minz-logger
 * @date        2019. 08. 26
 * @description 문서정보 개별 조회
 */
export const one = async (ctx) => {
    let { id } = ctx.params;

    try {
        const documentInfo = await DocumentInfo
            .findOne({ _id: id })
            .populate({ path: 'vendor', populate: { path: 'part' } })
            .populate({ path: 'documentGb' })
            .populate({ path: 'trackingDocument', populate: { path: 'part documentGb' } });

        ctx.res.ok({
            data: documentInfo,
            message: 'Success - documentInfoCtrl > one'
        });
    } catch (e) {
        ctx.res.internalServerError({
            data: id,
            message: 'Error - documentInfoCtrl > one'
        });
    }
};