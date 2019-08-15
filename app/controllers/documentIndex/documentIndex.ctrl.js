import DocumentIndex from 'models/documentIndex/documentIndex';
import XLSX from 'xlsx';
import moment from 'moment';
import Joi from 'joi';

/**
 * @author      minz-logger
 * @date        2019. 08. 13
 * @description 문서목록 목록 조회
 */
export const list = async (ctx) => {
    let page = parseInt(ctx.query.page || 1, 10);

    if (page < 1) {
        ctx.res.badRequest({
            data: page,
            message: 'Fail - documentIndexCtrl > list'
        });

        return;
    }

    try {
        const documentIndexes = await DocumentIndex
            .find()
            .populate({ path: 'vendor', populate: { path: 'part' } })
            .populate({ path: 'list' })
            .skip((page - 1) * 10)
            .limit(10)
            .sort({ 'timestamp.regDt': -1 });

        const count = await DocumentIndex.countDocuments();

        ctx.set('Last-Page', Math.ceil(count / 10));

        ctx.res.ok({
            data: documentIndexes,
            message: 'Success - documentIndexCtrl > list'
        });
    } catch (e) {
        ctx.res.internalServerError({
            data: [],
            message: 'Error - documentIndexCtrl > list'
        });
    }
};

/**
 * @author      minz-logger
 * @date        2019. 08. 12
 * @description 엑셀 읽기
 */
export const readExcel = async (ctx) => {
    try {
        const workbook = XLSX.readFile(ctx.req.file.path);
        const excelData = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]], { header: ['documentNumber', 'documentTitle', 'plan'] });

        const result = excelData.map((row) => {
            return {
                ...row,
                plan: typeof row.plan === 'number' ? moment('1900-01-01').add(row.plan, 'days') : moment(row.plan.replace(/[.\-/]/g, ''))
            };
        });

        ctx.res.ok({
            data: result,
            message: 'Success - documentIndexCtrl > readExcel'
        });
    } catch (e) {
        ctx.res.internalServerError({
            data: [],
            message: 'Error - documentIndexCtrl > readExcel'
        });
    }
};

/**
 * @author      minz-logger
 * @date        2019. 08. 12
 * @description 문서목록 생성
 */
export const create = async (ctx) => {
    let {
        vendor,
        list
    } = ctx.request.body;

    const schema = Joi.object().keys({
        vendor: Joi.string().required(),
        list: Joi.array().items(Joi.object()).required()
    });

    const result = Joi.validate(ctx.request.body, schema);

    if (result.error) {
        ctx.res.badRequest({
            data: {
                vendor,
                list
            },
            message: 'Fail - documentIndexCtrl > create'
        });

        return;
    }

    try {
        const documentIndex = await DocumentIndex.saveDocumentIndex({ vendor, list });

        ctx.res.ok({
            data: documentIndex,
            message: 'Success - documentIndexCtrl > create'
        });
    } catch (e) {
        ctx.res.internalServerError({
            data: ctx.request.body,
            message: 'Error - documentIndexCtrl > create'
        });
    }
};

/**
 * @author      minz-logger
 * @date        2019. 08. 13
 * @description 문서목록 개별 조회
 */
export const one = async (ctx) => {
    let { id } = ctx.params;

    try {
        const documentIndex = await DocumentIndex
            .findById(id)
            .populate({ path: 'vendor' })
            .populate({ path: 'list' });

        ctx.res.ok({
            data: documentIndex,
            message: 'Success - documentIndexCtrl > one'
        });
    } catch (e) {
        ctx.res.internalServerError({
            data: id,
            message: 'Error - documentIndexCtrl > one'
        });
    }
};

/**
 * @author      minz-logger
 * @date        2019. 08. 13
 * @description 문서목록 수정
 */
export const editDocumentIndex = async (ctx) => {
    let { id } = ctx.params;
    let {
        vendor,
        list
    } = ctx.request.body;

    const schema = Joi.object().keys({
        vendor: Joi.string().required(),
        list: Joi.array().items(Joi.string()).required()
    });

    const result = Joi.validate(ctx.request.body, schema);

    if (result.error) {
        ctx.res.badRequest({
            data: result.error,
            message: 'Fail - documentIndexCtrl > editDocumentIndex'
        });

        return;
    }

    try {
        const documentIndex = await DocumentIndex.editDocumentIndex({ id, vendor, list });

        ctx.res.ok({
            data: documentIndex,
            message: 'Success - documentIndexCtrl > editDocumentIndex'
        });
    } catch (e) {
        ctx.res.internalServerError({
            data: ctx.request.body,
            message: 'Error - documentIndexCtrl > editDocumentIndex'
        });
    }
};

/**
 * @author      minz-logger
 * @date        2019. 08. 13
 * @description 문서목록 삭제
 */
export const deleteDocumentIndex = async (ctx) => {
    let { id } = ctx.params;
    let page = parseInt(ctx.query.page || 1, 10);

    if (page < 1) {
        ctx.res.badRequest({
            data: page,
            message: 'Fail - documentIndexCtrl > deleteDocumentIndex'
        });

        return;
    }

    try {
        await DocumentIndex.findOneAndDelete({ _id: id });

        const documentIndexes = await DocumentIndex
            .find()
            .populate({ path: 'vendor', populate: { path: 'part' } })
            .populate({ path: 'list' })
            .skip((page - 1) * 10)
            .limit(10)
            .sort({ 'timestamp.regDt': -1 });

        const count = await DocumentIndex.countDocuments();

        ctx.set('Last-Page', Math.ceil(count / 10));

        ctx.res.ok({
            data: documentIndexes,
            message: 'Success - documentIndexCtrl > deleteDocumentIndex'
        });
    } catch (e) {
        ctx.res.internalServerError({
            data: id,
            message: 'Error - documentIndexCtrl > deleteDocumentIndex'
        });
    }
};

/**
 * @author      minz-logger
 * @date        2019. 08. 13
 * @description 문서정보 삭제
 */
export const deleteDocumentInfo = async (ctx) => {
    let { id } = ctx.params;
    let {
        targetId,
        reason
    } = ctx.request.body;

    const schema = Joi.object().keys({
        targetId: Joi.string().required(),
        reason: Joi.string().required()
    });

    const result = Joi.validate(ctx.request.body, schema);

    if (result.error) {
        ctx.res.badRequest({
            data: result.error,
            message: 'Fail - documentIndexCtrl > deleteDocumentInfo'
        });

        return;
    }

    try {
        const documentIndex = await DocumentIndex.deleteDocumentInfo(id, targetId, reason);

        ctx.res.ok({
            data: documentIndex,
            message: 'Success - documentIndexCtrl > deleteDocumentInfo'
        });
    } catch (e) {
        ctx.res.internalServerError({
            data: ctx.request.body,
            message: 'Error - documentIndexCtrl > deleteDocumentInfo'
        });
    }
};