import DocumentIndex from 'models/documentIndex/documentIndex';
import XLSX from 'xlsx';
import moment from 'moment';
import Joi from 'joi';
import { Types } from 'mongoose';

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
            message: 'Page can\'t be less than 1'
        });

        return;
    }

    try {
        const documentIndexes = await DocumentIndex
            .find()
            .populate({ path: 'vendor', populate: { path: 'part' } })
            .populate({ path: 'list', populate: { path: 'documentGb' } })
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
 * @date        2019. 08. 15
 * @description 문서목록 목록 조회 (For select)
 */
export const listForSelect = async (ctx) => {
    try {
        const documentIndexes = await DocumentIndex
            .find({}, { _id: 1, vendor: 1 })
            .populate({ path: 'vendor', select: 'vendorName partNumber', populate: { path: 'part', select: 'cdSName' } })
            .sort({ 'timestamp.regDt': -1 });

        ctx.res.ok({
            data: documentIndexes,
            message: 'Success - documentIndexCtrl > listForSelect'
        });
    } catch (e) {
        ctx.res.internalServerError({
            data: [],
            message: 'Erorr - documentIndexCtrl > listForSelect'
        });
    }
};

/**
 * @author      minz-logger
 * @date        2019. 08. 17
 * @description 문서목록 검색
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

    let {
        part,
        partNumber,
        vendorName,
        officialName
    } = ctx.request.body;

    const { ObjectId } = Types;

    const query = {
        part: ObjectId.isValid(part) ? part : '',
        partNumber: partNumber ? partNumber : '',
        vendorName: vendorName ? vendorName : '',
        officialName: officialName ? officialName : ''
    };

    try {
        const documentIndexes = await DocumentIndex.searchDocumentIndexes(query, page);
        const countQuery = await DocumentIndex.searchDocumentIndexesCount(query);

        ctx.set('Last-Page', Math.ceil((countQuery[0] ? countQuery[0].count : 1) / 10));

        ctx.res.ok({
            data: documentIndexes,
            message: 'Success - documentIndexCtrl > search'
        });
    } catch (e) {
        ctx.res.internalServerError({
            data: ctx.request.body,
            message: 'Error - documentIndexCtrl > search'
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
        list: Joi.array().items(Joi.object().keys({
            documentNumber: Joi.string().required(),
            documentTitle: Joi.string().required(),
            documentGb: Joi.string().required(),
            plan: Joi.string().required()
        })).required()
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
 * @date        2019. 08. 15
 * @description 문서목록 개별 추가
 */
export const addPartial = async (ctx) => {
    let { id } = ctx.params;
    let { list } = ctx.request.body;

    const schema = Joi.object().keys({
        list: Joi.array().items(Joi.object()).required()
    });

    const result = Joi.validate(ctx.request.body, schema);

    if (result.error) {
        ctx.res.badRequest({
            data: result.error,
            message: 'Fail - documentIndexCtrl > addPartial'
        });

        return;
    }

    try {
        const documentIndex = await DocumentIndex.addPartial({ id, list });

        ctx.res.ok({
            data: documentIndex,
            message: 'Success - documentIndexCtrl > addPartial'
        });
    } catch (e) {
        ctx.res.internalServerError({
            data: ctx.request.body,
            message: 'Erro - documentIndexCtrl > addPartial'
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
            .populate({ path: 'vendor', populate: { path: 'part' } })
            .populate({ path: 'list', populate: { path: 'documentGb trackingDocument' } });

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
 * @date        2019. 09. 07
 * @description 문서목록 Overall
 */
export const overall = async (ctx) => {
    let { id } = ctx.params;

    try {
        const overall = await DocumentIndex.documentIndexOverall(id);

        ctx.res.ok({
            data: overall[0] ? overall[0] : {},
            messge: 'Success - documentIndexCtrl > overall'
        });
    } catch (e) {
        ctx.res.internalServerError({
            data: id,
            message: `Error - documentIndexCtrl > overall: ${e.messge}`
        });
    }
};

/**
 * @author      minz-logger
 * @date        2019. 09. 07
 * @description 문서목록 상태별 통계
 */
export const statisticsByStatus = async (ctx) => {
    let { id } = ctx.params;

    try {
        const statisticsByStatus = await DocumentIndex.statisticsByStatus(id);

        ctx.res.ok({
            data: statisticsByStatus,
            message: 'Success - documentIndexCtrl > statisticsByStatus'
        });
    } catch (e) {
        ctx.res.internalServerError({
            data: id,
            message: `Error - documentIndexCtrl > statisticsByStatus: ${e.messge}`
        });
    }
};

/**
 * @author      minz-logger
 * @date        2019. 08. 22
 * @description 문서정보 추적
 */
export const trackingDocument = async (ctx) => {
    let { id } = ctx.params;
    let page = parseInt(ctx.query.page || 1, 10);

    if (page < 1) {
        ctx.res.badRequest({
            data: page,
            message: 'Page can\'t be less than 1'
        });

        return;
    }

    try {
        const list = await DocumentIndex.trackingDocument(id, page);
        const listCountQuery = await DocumentIndex.trackingDocumentCount(id);

        ctx.set('Last-Page', Math.ceil((listCountQuery[0] ? listCountQuery[0].count : 1) / 5));

        ctx.res.ok({
            data: list,
            message: 'Success - documentIndexCtrl > trackingDocument'
        });
    } catch (e) {
        ctx.res.internalServerError({
            data: id,
            message: `Error - documentIndexCtrl > trackingDocument: ${e.message}`
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
        list,
        deleteList
    } = ctx.request.body;

    const schema = Joi.object().keys({
        vendor: Joi.string().required(),
        list: list.length === 0
            ? Joi.array().items(Joi.object().keys()).required()
            : Joi.array().items(Joi.object().keys({
                _id: Joi.string().optional(),
                documentNumber: Joi.string().required(),
                documentTitle: Joi.string().required(),
                documentGb: Joi.string().required(),
                plan: Joi.string().required()
            })).required(),
        deleteList: Joi.array().items(Joi.object()).required()
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
        const documentIndex = await DocumentIndex.editDocumentIndex({ id, vendor, list, deleteList });

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
            message: 'Page can\'t be less than 1'
        });

        return;
    }

    try {
        await DocumentIndex.deleteDocumentIndex(id);

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