import { Schema, model, Types } from 'mongoose';
import { Timestamp } from 'models/common/schema';
import DocumentInfo from './documentInfo';
import DEFINE from 'models/common';

/**
 * @author      minz-logger
 * @date        2019. 08. 12
 * @description 문서 목록
 */
const DocumentIndexSchema = new Schema({
    vendor: {
        type: Schema.Types.ObjectId,
        ref: 'Vendor'
    },
    list: [{
        type: Schema.Types.ObjectId,
        ref: 'DocumentInfo'
    }],
    timestamp: {
        type: Timestamp.schema,
        default: Timestamp
    }
});

/**
 * @author      minz-logger
 * @date        2019. 08. 17
 * @description 문서목록 검색
 * @param       {Object} param
 * @param       {Integer} page
 */
DocumentIndexSchema.statics.searchDocumentIndexes = async function (param, page) {
    const {
        part,
        partNumber,
        vendorName,
        officialName
    } = param;

    const documentIndexes = await this.aggregate([
        {
            $lookup: {
                from: 'vendors',
                localField: 'vendor',
                foreignField: '_id',
                as: 'vendor'
            }
        },
        {
            $unwind: '$vendor'
        },
        {
            $lookup: {
                from: 'cdminors',
                localField: 'vendor.part',
                foreignField: '_id',
                as: 'vendor.part',
            }
        },
        {
            $unwind: '$vendor.part'
        },
        {
            $match: {
                $and: [
                    { 'vendor.part._id': part === '' ? { $ne: DEFINE.COMMON.NONE_ID } : Types.ObjectId(part) },
                    { 'vendor.partNumber': { $regex: partNumber + '.*', $options: 'i' } },
                    { 'vendor.vendorName': { $regex: vendorName + '.*', $options: 'i' } },
                    { 'vendor.officialName': { $regex: officialName + '.*', $options: 'i' } }
                ]
            }
        },
        {
            $skip: (page - 1) * 10
        },
        {
            $limit: 10
        },
        {
            $sort: { 'timestamp.regDt': - 1 }
        }
    ]);

    return documentIndexes.map((documentIndex) => {
        return {
            ...documentIndex,
            vendor: {
                ...documentIndex.vendor,
                period: DEFINE.datePeriod(documentIndex.vendor.effStaDt, documentIndex.vendor.effEndDt)
            }
        };
    });
};

/**
 * @author      minz-logger
 * @date        2019. 08. 17
 * @description 문서목록 검색 카운트
 */
DocumentIndexSchema.statics.searchDocumentIndexesCount = function (param) {
    const {
        part,
        partNumber,
        officialName,
        vendorName
    } = param;

    return this.aggregate([
        {
            $lookup: {
                from: 'vendors',
                localField: 'vendor',
                foreignField: '_id',
                as: 'vendor'
            }
        },
        {
            $unwind: '$vendor'
        },
        {
            $lookup: {
                from: 'cdminors',
                localField: 'vendor.part',
                foreignField: '_id',
                as: 'vendor.part',
            }
        },
        {
            $match: {
                $and: [
                    { 'vendor.part._id': part === '' ? { $ne: DEFINE.COMMON.NONE_ID } : Types.ObjectId(part) },
                    { 'vendor.partNumber': { $regex: partNumber + '.*', $options: 'i' } },
                    { 'vendor.vendorName': { $regex: vendorName + '.*', $options: 'i' } },
                    { 'vendor.officialName': { $regex: officialName + '.*', $options: 'i' } }
                ]
            }
        },
        {
            $count: 'count'
        }
    ]);
};

/**
 * @author      minz-logger
 * @date        2019. 08. 12
 * @description 문서 목록 생성
 * @param       {Object]}
 */
DocumentIndexSchema.statics.saveDocumentIndex = async function (param) {
    let {
        vendor,
        list
    } = param;

    let documentInfos = await DocumentInfo.saveDocumentInfos(list);

    const documentIndex = new this({ vendor, list: documentInfos });
    await documentIndex.save();

    return this.findOne({ _id: documentIndex._id }).populate({ path: 'list vendor' });
};

/**
 * @author      minz-logger
 * @date        2019. 08. 15
 * @description 문서목록 개별 추가
 * @param       {Object} param
 */
DocumentIndexSchema.statics.addPartial = async function (param) {
    let {
        id,
        list
    } = param;

    let documentInfos = await DocumentInfo.saveDocumentInfos(list);

    return this.findOneAndUpdate(
        { _id: id },
        {
            $push: {
                list: documentInfos
            }
        },
        {
            new: true
        }
    ).populate({ path: 'vendor', populate: { path: 'part' } }).populate({ path: 'list' });
};

/**
 * @author      minz-logger
 * @date        2019. 08. 13
 * @description 문서목록 수정
 * @param       {String} id
 * @param       {String} vendor
 * @param       {Array} list
 */
DocumentIndexSchema.statics.editDocumentIndex = async function (param) {
    let {
        id,
        vendor,
        list,
        deleteList
    } = param;

    let documentInfos = await DocumentInfo.updateDocumentInfos(list);
    await DocumentInfo.deleteDocumentInfos(deleteList);

    return this.findOneAndUpdate(
        { _id: id },
        {
            $set: {
                vendor: vendor,
                'timestamp.updDt': DEFINE.dateNow()
            },
            $push: {
                list: documentInfos
            }
        },
        {
            new: true
        }
    ).populate({ path: 'vendor' }).populate({ path: 'list', populate: { path: 'trackingDocument' } });
};

/**
 * @author      minz-logger
 * @date        2019. 08. 13
 * @description 문서정보 삭제
 * @param       {String} id
 * @param       {String} targetId
 * @param       {String} reason
 */
DocumentIndexSchema.statics.deleteDocumentInfo = async function (id, targetId, reason) {
    await DocumentInfo.deleteDocumentInfo(targetId, reason);

    return this.findOne({ _id: id }).populate({ path: 'vendor' }).populate({ path: 'list', populate: { path: 'trackingDocument' } });
};

export default model('DocumentIndex', DocumentIndexSchema);