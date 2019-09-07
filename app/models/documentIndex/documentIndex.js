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

    let documentInfos = await DocumentInfo.saveDocumentInfos(vendor, list);

    const documentIndex = new this({ vendor, list: documentInfos });
    await documentIndex.save();

    return this.findOne({ _id: documentIndex._id }).populate({ path: 'list', populate: { path: 'documentGb' } }).populate({ path: 'vendor' });
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

    let { vendor } = await this.findOne({ _id: id });

    let documentInfos = await DocumentInfo.saveDocumentInfos(vendor, list);

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
    ).populate({ path: 'vendor', populate: { path: 'part' } }).populate({ path: 'list', populate: { path: 'documentGb' } });
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

    let documentInfos = await DocumentInfo.updateDocumentInfos(vendor, list);
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
    ).populate({ path: 'vendor' }).populate({ path: 'list', populate: { path: 'documentGb trackingDocument' } });
};

/**
 * @author      minz-logger
 * @date        2019. 09. 05
 * @description 문서목록 삭제
 * @param       {String} id
 */
DocumentIndexSchema.statics.deleteDocumentIndex = async function (id) {
    let documentIndex = await this.findOne({ _id: id });

    await DocumentInfo.deleteMany(
        {
            _id: {
                $in: documentIndex.list
            }
        }
    );

    await this.findOneAndDelete({ _id: id });
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

    return this.findOne({ _id: id }).populate({ path: 'vendor' }).populate({ path: 'list', populate: { path: 'documentGb trackingDocument' } });
};

/**
 * @author      minz-logger
 * @date        2019. 08. 22
 * @description 문서정보 Overall
 */
DocumentIndexSchema.statics.documentIndexOverall = async function (id) {
    return this.aggregate([
        {
            $match: { _id: Types.ObjectId(id) }
        },
        {
            $unwind: '$list'
        },
        {
            $lookup: {
                from: 'documentinfos',
                localField: 'list',
                foreignField: '_id',
                as: 'list'
            }
        },
        {
            $unwind: '$list'
        },
        {
            $lookup: {
                from: 'documents',
                localField: 'list.trackingDocument',
                foreignField: '_id',
                as: 'list.trackingDocument'
            }
        },
        {
            $project: {
                list: 1,
                vendor: 1,
                timestamp: 1,
                eachCount: { $size: '$list.trackingDocument' },
                firstReceive: {
                    $size: {
                        $filter: {
                            input: '$list.trackingDocument',
                            as: 'document',
                            cond: { $eq: ['$$document.documentRev', 'A'] }
                        }
                    }
                },
                latestDocument: { $arrayElemAt: [{ $slice: ['$list.trackingDocument', -1] }, 0] }
            }
        },
        {
            $project: {
                list: 1,
                vendor: 1,
                timestamp: 1,
                eachCount: 1,
                firstReceive: 1,
                isDelete: {
                    $cond: {
                        if: { $eq: ['$latestDocument.deleteYn.yn', 'YES'] },
                        then: 1,
                        else: 0
                    }
                },
                isHold: {
                    $cond: {
                        if: { $eq: [{ $arrayElemAt: [{ $slice: ['$latestDocument.holdYn.yn', -1] }, 0] }, 'YES'] },
                        then: 1,
                        else: 0
                    }
                },
                isDelay: {
                    $cond: {
                        if: { $eq: ['$latestDocument.delayGb', '05'] },
                        then: 1,
                        else: 0
                    }
                }
            }
        },
        {
            $group: {
                _id: '$_id',
                Total: { $sum: 1 },
                Received: { $sum: '$eachCount' },
                RevA: { $sum: '$firstReceive' },
                Delete: { $sum: '$isDelete' },
                Hold: { $sum: '$isHold' },
                Delay: { $sum: '$isDelay' }
            }
        },

        {
            $project: {
                _id: 0,
                Total: 1,
                Received: 1,
                RevA: 1,
                Delete: 1,
                Hold: 1,
                Delay: 1,
            }
        }
    ]);
};

/**
 * @author      minz-logger
 * @date        2019. 08. 22
 * @description 문서정보 Status 통계
 */
DocumentIndexSchema.statics.statisticsByStatus = function (id) {
    return this.aggregate([
        {
            $match: { _id: Types.ObjectId(id) }
        },
        {
            $unwind: '$list'
        },
        {
            $lookup: {
                from: 'documentinfos',
                localField: 'list',
                foreignField: '_id',
                as: 'list'
            }
        },
        {
            $unwind: '$list'
        },
        {
            $lookup: {
                from: 'documents',
                localField: 'list.trackingDocument',
                foreignField: '_id',
                as: 'list.trackingDocument'
            }
        },
        {
            $project: {
                latestDocument: { $arrayElemAt: [{ $slice: ['$list.trackingDocument', -1] }, 0] }
            }
        },
        {
            $project: {
                latestStatus: { $arrayElemAt: [{ $slice: ['$latestDocument.documentStatus', -1] }, 0] }
            }
        },
        {
            $group: {
                _id: {
                    code: '$latestStatus.status',
                    statusName: '$latestStatus.statusName'
                },
                count: { $sum: 1 }
            }
        },
        {
            $sort: {
                '_id.code': 1
            }
        },
        {
            $project: {
                _id: 0,
                statusName: { $ifNull: ['$_id.statusName', '접수대기'] },
                Count: '$count'
            }
        }
    ]);
};

/**
 * @author      minz-logger
 * @date        2019. 08. 22
 * @description 문서정보 추적
 */
DocumentIndexSchema.statics.trackingDocument = function (id, page) {
    return this.aggregate([
        {
            $match: { _id: Types.ObjectId(id) }
        },
        {
            $unwind: '$list'
        },
        {
            $lookup: {
                from: 'documentinfos',
                localField: 'list',
                foreignField: '_id',
                as: 'list'
            }
        },
        {
            $unwind: '$list'
        },
        {
            $project: {
                list: {
                    _id: 1,
                    plan: 1,
                    documentNumber: 1,
                    documentTitle: 1,
                    trackingDocument: 1,
                    removeYn: 1,
                    timestamp: 1
                }
            }
        },
        {
            $lookup: {
                from: 'documents',
                localField: 'list.trackingDocument',
                foreignField: '_id',
                as: 'list.trackingDocument'
            }
        },
        {
            $skip: (page - 1) * 5
        },
        {
            $limit: 5
        },
        {
            $project: {
                _id: 0,
                documentInfo: '$list'
            }
        }
    ]);
};

/**
 * @autohr minz-logger
 * @date 2019. 09. 07
 * @description 문서정보 추적 카운트
 */
DocumentIndexSchema.statics.trackingDocumentCount = function (id) {
    return this.aggregate([
        {
            $match: { _id: Types.ObjectId(id) }
        },
        {
            $unwind: '$list'
        },
        {
            $lookup: {
                from: 'documentinfos',
                localField: 'list',
                foreignField: '_id',
                as: 'list'
            }
        },
        {
            $unwind: '$list'
        },
        {
            $project: {
                list: {
                    _id: 1,
                    plan: 1,
                    documentNumber: 1,
                    documentTitle: 1,
                    trackingDocument: 1,
                    removeYn: 1,
                    timestamp: 1
                }
            }
        },
        {
            $lookup: {
                from: 'documents',
                localField: 'list.trackingDocument',
                foreignField: '_id',
                as: 'list.trackingDocument'
            }
        },
        {
            $count: 'count'
        }
    ]);
};

/**
 * @author      minz-logger
 * @date        2019. 09. 06
 * @description 업체 공식문서 Receive/Reply 통계
 * @param       {String} id
 */
DocumentIndexSchema.statics.statisticsByTransmittal = function (id) {
    return this.aggregate([
        {
            $match: { _id: Types.ObjectId(id) },
        },
        {
            $project: {
                vendor: 1
            }
        },
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
            $unwind: '$vendor.trackingTransmittal'
        },
        {
            $project: {
                transmittal: '$vendor.trackingTransmittal'
            }
        },
        {
            $lookup: {
                from: 'vendorletters',
                localField: 'transmittal',
                foreignField: '_id',
                as: 'transmittal'
            }
        },
        {
            $unwind: '$transmittal'
        },
        {
            $project: {
                letterStatus: { $arrayElemAt: [{ $slice: ['$transmittal.letterStatus', -1] }, 0] },
                receiveDate: { $substr: ['$transmittal.receiveDate', 0, 7] }
            }
        },
        {
            $group: {
                _id: { $concat: ['$receiveDate', ' 월'] },
                letterStatus: { $push: '$letterStatus.status' }
            }
        },
        {
            $project: {
                _id: 0,
                receiveDate: '$_id',
                receive: { $size: '$letterStatus' },
                reply: {
                    $size: {
                        $filter: {
                            input: '$letterStatus',
                            as: 'status',
                            cond: { $in: ['$$status', ['90', '91', '92']] }
                        }
                    }
                }
            }
        },
        {
            $sort: {
                'receiveDate': 1
            }
        }
    ]);
};

export default model('DocumentIndex', DocumentIndexSchema);