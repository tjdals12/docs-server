import Vendor from '../../models/vendor/vendor';
import Joi from 'joi';
import { Types } from 'mongoose';

/**
 * @author      minz-logger
 * @date        2019. 08. 04
 * @description 업체 목록 조회
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
        const vendors = await Vendor
            .find()
            .skip((page - 1) * 8)
            .limit(8)
            .sort({ 'timestamp.regDt': -1 })
            .populate({ path: 'part' })
            .populate({ path: 'vendorPerson' });

        const count = await Vendor.countDocuments();

        ctx.set('Last-Page', Math.ceil(count / 8));

        ctx.res.ok({
            data: vendors,
            message: 'Success - vendorCtrl > list'
        });
    } catch (e) {
        ctx.res.internalServerError({
            data: [],
            message: 'Error - vendorCtrl > list'
        });
    }
};

/**
 * @author      minz-logger
 * @date        2019. 08. 06
 * @description 업체 목록 조회 (For select)
 */
export const listForSelect = async (ctx) => {
    try {
        const vendors = await Vendor
            .find({}, { _id: 1, vendorName: 1, part: 1, partNumber: 1 })
            .sort({ 'partNumber': 1 })
            .populate({ path: 'part' });

        ctx.res.ok({
            data: vendors,
            message: 'Success - vendorCtrl > listOnlyName'
        });
    } catch (e) {
        ctx.res.internalServerError({
            data: [],
            message: 'Error - vendorCtrl > listOnlyName'
        });
    }
};

/**
 * @author      minz-logger
 * @date        2019. 08. 05
 * @description 업체 검색
 */
export const search = async (ctx) => {
    let page = parseInt(ctx.query.page || 1, 10);

    const {
        vendorGb,
        countryCd,
        vendorName,
        officialName,
        part,
        partNumber,
        effStaDt,
        effEndDt
    } = ctx.request.body;

    const { ObjectId } = Types;

    const query = {
        vendorGb: vendorGb ? vendorGb : '',
        countryCd: countryCd ? countryCd : '',
        vendorName: vendorName ? vendorName : '',
        officialName: officialName ? officialName : '',
        part: ObjectId.isValid(part) ? part : '',
        partNumber: partNumber ? partNumber : '',
        effStaDt: effStaDt ? effStaDt : '2000-01-01',
        effEndDt: effEndDt ? effEndDt : '9999-12-31'
    };

    try {
        const vendors = await Vendor.searchVendors(query, page);
        const countQuery = await Vendor.searchVendorsCount(query);

        ctx.set('Last-Page', Math.ceil((countQuery[0] ? countQuery[0].count : 1) / 8));

        ctx.res.ok({
            data: vendors,
            message: 'Success - vendorCtrl > search'
        });
    } catch (e) {
        ctx.res.internalServerError({
            data: ctx.request.body,
            message: 'Error - vendorCtrl > search'
        });
    }
};

/**
 * @author      minz-logger
 * @date        2019. 08. 05
 * @description 업체 개별 조회
 */
export const getVendor = async (ctx) => {
    let { id } = ctx.params;

    try {
        const vendor = await Vendor.findOne({ _id: id }).populate({ path: 'part' }).populate({ path: 'vendorPerson' });

        ctx.res.ok({
            data: vendor,
            message: 'Success - vendorCtrl > list'
        });
    } catch (e) {
        ctx.res.internalServerError({
            data: id,
            message: 'Error - vendorCtrl > list'
        });
    }
};

/**
 * @author      minz-logger
 * @date        2019. 08. 04
 * @description 업체 추가
 */
export const create = async (ctx) => {
    let {
        vendorGb,
        countryCd,
        part,
        partNumber,
        vendorName,
        officialName,
        itemName,
        effStaDt,
        effEndDt,
        persons
    } = ctx.request.body;

    const schema = Joi.object().keys({
        vendorGb: Joi.string().required(),
        countryCd: Joi.string().required(),
        part: Joi.string().required(),
        partNumber: Joi.string().required(),
        vendorName: Joi.string().required(),
        officialName: Joi.string().required(),
        itemName: Joi.string().required(),
        effStaDt: Joi.string().required(),
        effEndDt: Joi.string().required(),
        persons: Joi.array().items(Joi.object())
    });

    const result = Joi.validate(ctx.request.body, schema);

    if (result.error) {
        ctx.res.badRequest({
            data: result.error,
            message: 'Fail - vendorCtrl > create'
        });

        return;
    }

    try {
        const vendor = await Vendor.saveVendor({
            vendorGb,
            countryCd,
            part,
            partNumber,
            vendorName,
            officialName,
            itemName,
            effStaDt,
            effEndDt,
            persons
        });

        ctx.res.ok({
            data: vendor,
            message: 'Success - vendorCtrl > create'
        });
    } catch (e) {
        ctx.res.internalServerError({
            data: ctx.request.body,
            message: 'Error - vendorCtrl > create'
        });
    }
};

/**
 * @author      minz-logger
 * @date        2019. 08. 04
 * @description 업체 수정
 */
export const editVendor = async (ctx) => {
    let { id } = ctx.params;
    let {
        vendorGb,
        countryCd,
        part,
        partNumber,
        vendorName,
        officialName,
        itemName,
        effStaDt,
        effEndDt
    } = ctx.request.body;

    const schema = Joi.object().keys({
        vendorGb: Joi.string().required(),
        countryCd: Joi.string().required(),
        part: Joi.string().required(),
        partNumber: Joi.string().required(),
        vendorName: Joi.string().required(),
        officialName: Joi.string().required(),
        itemName: Joi.string().required(),
        effStaDt: Joi.string().required(),
        effEndDt: Joi.string().required()
    });

    const result = Joi.validate(ctx.request.body, schema);

    if (result.error) {
        ctx.res.badRequest({
            data: result.error,
            message: 'Fail - vendorCtrl > editVendor'
        });

        return;
    }

    try {
        const vendor = await Vendor.editVendor(id, {
            vendorGb,
            countryCd,
            part,
            partNumber,
            vendorName,
            officialName,
            itemName,
            effStaDt,
            effEndDt
        });

        ctx.res.ok({
            data: vendor,
            message: 'Success - vendorCtrl > editVendor'
        });
    } catch (e) {
        ctx.res.internalServerError({
            data: ctx.body.request,
            message: 'Error - vendorCtrl > editVendor'
        });
    }
};

/**
 * @author      inz-logger
 * @date        2019. 08. 04
 * @description 업체 삭제
 */
export const deleteVendor = async (ctx) => {
    let { id } = ctx.params;

    try {
        await Vendor.deleteVendor(id);

        ctx.res.ok({
            data: id,
            message: 'Success - vendorCtrl > deleteVendor'
        });
    } catch (e) {
        ctx.res.internalServerError({
            data: id,
            message: 'Error - vendorCtrl > delete'
        });
    }
};

/**
 * @author      minz-logger
 * @date        2019. 08. 04
 * @description 담당자 추가
 */
export const addPerson = async (ctx) => {
    let { id } = ctx.params;
    let {
        persons
    } = ctx.request.body;

    const schema = Joi.object().keys({
        persons: Joi.array().items(Joi.object().keys({
            index: Joi.number(),
            name: Joi.string().required(),
            position: Joi.string().required(),
            task: Joi.string().required(),
            email: Joi.string().required(),
            contactNumber: Joi.string().required()
        }))
    });

    const result = Joi.validate(ctx.request.body, schema);

    if (result.error) {
        ctx.res.badRequest({
            data: result.error,
            message: 'Fail -  vendorCtrl >  addPerson'
        });

        return;
    }

    try {
        const vendor = await Vendor.addPerson(id, persons);

        ctx.res.ok({
            data: vendor,
            message: 'Success - vendorCtrl > addPerson'
        });
    } catch (e) {
        ctx.res.internalServerError({
            data: ctx.request.body,
            message: 'Error - vendorCtrl > addPerson'
        });
    }
};

/**
 * @author      minz-logger
 * @date        2019. 08. 04
 * @description 담당자 삭제
 */
export const deletePerson = async (ctx) => {
    let { id, personId } = ctx.params;

    if (!Types.ObjectId.isValid(personId)) {
        ctx.res.badRequest({
            data: { id, personId }
        });

        return;
    }

    try {
        const vendor = await Vendor.deletePerson(id, personId);

        ctx.res.ok({
            data: vendor,
            message: 'Success - vendorCtrl > deletePerson'
        });
    } catch (e) {
        ctx.res.internalServerError({
            data: id, personId,
            message: 'Error - vendorCtrl > deletePerson'
        });
    }
};