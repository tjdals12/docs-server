import { Schema, model, Types } from 'mongoose';
import { Timestamp, Status } from 'models/common/schema';
import Vendor from 'models/vendor/vendor';
import Document from 'models/document/document';
import InOut from 'models/document/inOut';
import DocumentInfo from 'models/documentIndex/documentInfo';
import DEFINE from 'models/common';
import cancelYn from './cancelYn';

/**
 * @author      minz-logger
 * @date        2019. 08. 23
 * @description 업체 공식 문서
 */
const VendorLetterSchema = new Schema({
    vendor: {
        type: Schema.Types.ObjectId,
        ref: 'Vendor'
    },
    senderGb: {
        type: String,
        get: DEFINE.senderReceiverGbConverter
    },
    sender: String,
    receiverGb: {
        type: String,
        get: DEFINE.senderReceiverGbConverter
    },
    receiver: String,
    officialNumber: String,
    documents: [{
        type: Schema.Types.ObjectId,
        ref: 'Document'
    }],
    receiveDate: {
        type: Date,
        default: DEFINE.dateNow,
        get: DEFINE.dateConverter
    },
    targetDate: {
        type: Date,
        default: DEFINE.dateNow,
        get: DEFINE.dateConverter
    },
    letterStatus: {
        type: [Status.schema],
        default: Status
    },
    cancelYn: {
        type: cancelYn.schema,
        default: cancelYn
    },
    timestamp: {
        type: Timestamp.schema,
        default: Timestamp
    }
});

VendorLetterSchema.set('toJSON', { getters: true });

VendorLetterSchema.virtual('isDelay').get(function () {
    return DEFINE.isDelay(this.targetDate, this.letterStatus.slice(-1)[0].status);
});

/**
 * @author      minz-logger
 * @date        2019. 09. 07
 * @description 업체 공식 문서 목록 조회 by Vendor
 * @param       {String} id
 */
VendorLetterSchema.statics.listByVendor = function (id) {
    return this.aggregate([
        {
            $match: { vendor: Types.ObjectId(id) }
        },
        {
            $project: {
                vendor: 1,
                senderGb: 1,
                sender: 1,
                receiverGb: 1,
                receiver: 1,
                officialNumber: 1,
                documents: 1,
                receiveDate: 1,
                targetDate: 1,
                letterStatus: {
                    $arrayElemAt: [{
                        $slice: ['$letterStatus', -1]
                    }, 0]
                },
                cancelYn: 1
            }
        }
    ]);
};

/**
 * @author      minz-logger
 * @date        2019. 09. 07
 * @description 업체 공식 문서 통계
 * @param       {String} id
 */
VendorLetterSchema.statics.statisticsByTransmittal = function (id) {
    return this.aggregate([
        {
            $match: { vendor: Types.ObjectId(id) },
        },
        {
            $project: {
                letterStatus: { $arrayElemAt: [{ $slice: ['$letterStatus', -1] }, 0] },
                receiveDate: { $substr: ['$receiveDate', 0, 7] }
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

/**
 * @author      minz-logger
 * @date        2019. 08. 29
 * @description 업체 공식 문서 검색
 * @param       {Object} param
 * @param       {Integer} page
 */
VendorLetterSchema.statics.searchVendorLetter = function (param, page) {
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
    } = param;

    return this.aggregate([
        {
            $project: {
                vendor: 1,
                senderGb: 1,
                sender: 1,
                receiverGb: 1,
                receiver: 1,
                officialNumber: 1,
                documents: 1,
                receiveDate: 1,
                targetDate: 1,
                letterStatus: {
                    $slice: ['$letterStatus', -1]
                },
                cancelYn: 1
            }
        },
        {
            $match: {
                $and: [
                    { vendor: vendor === '' ? { $ne: DEFINE.COMMON.NONE_ID } : Types.ObjectId(vendor) },
                    { senderGb: { $regex: senderGb + '.*', $options: 'i' } },
                    { sender: { $regex: sender + '.*', $options: 'i' } },
                    { receiverGb: { $regex: receiverGb + '.*', $options: 'i' } },
                    { receiver: { $regex: receiver + '.*', $options: 'i' } },
                    { officialNumber: { $regex: officialNumber + '.*', $options: 'i' } },
                    { receiveDate: { $gte: new Date(receiveDate) } },
                    { targetDate: { $lte: new Date(targetDate) } },
                    {
                        letterStatus: {
                            $elemMatch: {
                                status: { $regex: letterStatus + '.*', $options: 'i' }
                            }
                        }
                    },
                    {
                        'cancelYn.yn': { $regex: cancelYn + '.*', $options: 'i' }
                    }
                ]
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
            $skip: (page - 1) * 10
        },
        {
            $limit: 10
        },
        {
            $sort: { receiveDate: -1 }
        }
    ]);
};

/**
 * @author      minz-logger
 * @date        2019. 08. 29
 * @description 업체 공식 문서 검색 카운트
 * @param       {Object} param
 */
VendorLetterSchema.statics.searchVendorLetterCount = function (param) {
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
    } = param;

    return this.aggregate([
        {
            $project: {
                vendor: 1,
                senderGb: 1,
                sender: 1,
                receiverGb: 1,
                receiver: 1,
                officialNumber: 1,
                receiveDate: 1,
                targetDate: 1,
                letterStatus: {
                    $slice: ['$letterStatus', -1]
                },
                cancelYn: 1
            }
        },
        {
            $match: {
                $and: [
                    { vendor: vendor === '' ? { $ne: DEFINE.COMMON.NONE_ID } : Types.ObjectId(vendor) },
                    { senderGb: { $regex: senderGb + '.*', $options: 'i' } },
                    { sender: { $regex: sender + '.*', $options: 'i' } },
                    { receiverGb: { $regex: receiverGb + '.*', $options: 'i' } },
                    { receiver: { $regex: receiver + '.*', $options: 'i' } },
                    { officialNumber: { $regex: officialNumber + '.*', $options: 'i' } },
                    { receiveDate: { gte: new Date(receiveDate) } },
                    { targetDate: { lte: new Date(targetDate) } },
                    {
                        letterStatus: {
                            $elemMatch: {
                                status: { $regex: letterStatus + '.*', $options: 'i' }
                            }
                        }
                    },
                    {
                        'cancelYn.yn': { $regex: cancelYn + '.*', $options: 'i' }
                    }
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
 * @date        2019. 08. 24
 * @description 업체 공식 문서 접수
 * @param       {Object} param
 */
VendorLetterSchema.statics.receiveVendorLetter = async function (param) {
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
    } = param;

    vendor = await Vendor.findOne({ _id: vendor });

    receiveDocuments = receiveDocuments.map(document => {
        return {
            vendor: vendor._id,
            part: vendor.part,
            ...document,
            officialNumber,
            memo: `${officialNumber}로 접수`
        };
    });

    const documents = await Document.saveDocuments(receiveDocuments);
    const vendorLetter = new this({ vendor, senderGb, sender, receiverGb, receiver, officialNumber, documents, receiveDate, targetDate });

    await Vendor.updateOne(
        { _id: vendor._id },
        {
            $push: {
                trackingTransmittal: vendorLetter._id
            }
        }
    );

    await vendorLetter.save();

    return this
        .findOne({ _id: vendorLetter._id })
        .populate({ path: 'vendor', populate: { path: 'part' } })
        .populate({ path: 'documents', populate: { path: 'part documentGb' } });
};

/**
 * @author      minz-logger
 * @date        2019. 08. 26
 * @description 업체 공식 문서 수정
 * @param       {Object} param
 */
VendorLetterSchema.statics.editVendorLetter = async function (param) {
    let {
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
    } = param;

    await Document.deleteMany({ _id: { $in: deleteDocuments } });
    for (let i = 0; i < deleteDocuments.length; i++) {
        await DocumentInfo.findOneAndUpdate(
            { trackingDocument: deleteDocuments[i] },
            {
                $pull: {
                    trackingDocument: deleteDocuments[i]
                }
            }
        );
    }

    return this.findOneAndUpdate(
        { _id: id },
        {
            $set: {
                vendor,
                senderGb,
                sender,
                receiverGb,
                receiver,
                officialNumber,
                receiveDate,
                targetDate
            },
            $pullAll: {
                documents: deleteDocuments
            }
        },
        {
            new: true
        }
    ).populate({ path: 'vendor', populate: { path: 'part' } }).populate({ path: 'documents', populate: { path: 'part documentGb' } });
};

/**
 * @author      minz-logger
 * @date        2019. 08. 25
 * @descriptipn 업체 공식 문서에 문서 추가
 */
VendorLetterSchema.statics.addDocumentInVendorLetter = async function (param) {
    let {
        id,
        receiveDocuments
    } = param;

    const vendorLetter = await this.findOne({ _id: id }, { vendor: 1, officialNumber: 1 }).populate({ path: 'vendor' });

    receiveDocuments = receiveDocuments.map(document => {
        return {
            vendor: vendorLetter.vendor._id,
            part: vendorLetter.vendor.part,
            ...document,
            officialNumber: vendorLetter.officialNumber,
            memo: `${vendorLetter.officialNumber}로 접수`
        };
    });

    const documents = await Document.saveDocuments(receiveDocuments);

    return this.findOneAndUpdate(
        { _id: id },
        {
            $push: {
                documents: documents
            }
        },
        {
            new: true
        }
    ).populate({ path: 'vendor', populate: { path: 'part' } }).populate({ path: 'documents', populate: { path: 'part documentGb' } });
};

/**
 * @author      minz-logger
 * @date        2019. 08. 26
 * @description 업체 공식 문서 삭제
 * @param       {Object} param
 */
VendorLetterSchema.statics.deleteVendorLetter = async function (param) {
    let {
        id,
        yn,
        reason
    } = param;

    const vendorLetter = await this.findOneAndUpdate(
        { _id: id },
        {
            $set: {
                cancelYn: {
                    yn,
                    deleteDt: DEFINE.dateNow(),
                    reason
                },
                'timestamp.updDt': DEFINE.dateNow()
            }
        },
        {
            new: true
        }
    );

    await Document.updateMany(
        { _id: { $in: vendorLetter.documents } },
        {
            deleteYn: {
                yn,
                deleteDt: DEFINE.dateNow(),
                reason
            }
        }
    );

    return this.findOne({ _id: id }).populate({ path: 'vendor', populate: { path: 'part' } }).populate({ path: 'documents', populate: { path: 'part documentGb' } });
};

/**
 * @author      minz-logger
 * @date        2019. 08. 29
 * @description 업체 공식 문서 상태 변경
 * @param       {String} id
 * @param       {String} inOutGb
 * @param       {String} officialNumber
 * @param       {String} status
 * @param       {String} resultCode
 * @param       {String} replyCode
 */
VendorLetterSchema.statics.inOutVendorLetter = async function (id, inOutGb, officialNumber, status, resultCode, replyCode, date) {
    const timestamp = new Timestamp({ regDt: date });
    const newInOut = new InOut({ inOutGb, officialNumber, timestamp });
    const newStatus = new Status({ _id: newInOut._id, status, statusName: status, resultCode, replyCode, timestamp });

    const vendorLetter = await this.findOne({ _id: id });

    await Document.updateMany(
        { _id: { $in: vendorLetter.documents } },
        {
            $push: {
                documentInOut: newInOut,
                documentStatus: newStatus
            },
            $set: {
                'timestamp.updDt': DEFINE.dateNow()
            }
        }
    );

    return this.findOneAndUpdate(
        { _id: id },
        {
            $push: {
                letterStatus: newStatus
            },
            $set: {
                'timestamp.updDt': DEFINE.dateNow()
            }
        },
        {
            new: true
        }
    ).populate({ path: 'vendor', populate: { path: 'part' } }).populate({ path: 'documents', populate: { path: 'part documentGb' } });
};

/**
 * @author      minz-logger
 * @date        2019. 08. 27
 * @description 업체 공식 문서 상태 삭제
 * @param       {String} id
 * @param       {String} targetId
 */
VendorLetterSchema.statics.deleteInOut = async function (id, targetId) {

    const vendorLetter = await this.findOne({ _id: id });

    /** '접수' 상태는 삭제할 수 없음. */
    if (vendorLetter.letterStatus[0]._id == targetId) {
        return this.findOne({ _id: id })
            .populate({ path: 'vendor', populate: { path: 'part' } })
            .populate({ path: 'documents', populate: { path: 'part documentGb' } });
    }

    await Document.updateMany(
        { _id: { $in: vendorLetter.documents } },
        {
            $pull: {
                documentInOut: {
                    _id: targetId
                },
                documentStatus: {
                    _id: targetId
                }
            },
            $set: {
                'timestamp.updDt': DEFINE.dateNow()
            }
        }
    );

    return this.findOneAndUpdate(
        { _id: id },
        {
            $pull: {
                letterStatus: {
                    _id: targetId
                }
            }
        },
        {
            new: true
        }
    ).populate({ path: 'vendor', populate: { path: 'part' } }).populate({ path: 'documents', populate: { path: 'part documentGb' } });
};

export default model('VendorLetter', VendorLetterSchema);