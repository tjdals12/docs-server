import { Schema, model } from 'mongoose';
import { Timestamp, Status } from 'models/common/schema';
import Vendor from 'models/vendor/vendor';
import Document from 'models/document/document';
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
        type: [Status.Schema],
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
    );
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
VendorLetterSchema.statics.deleteVendorLetter = function (param) {
    let {
        id,
        reason
    } = param;

    return this.findOneAndUpdate(
        { _id: id },
        {
            $set: {
                cancelYn: {
                    yn: DEFINE.COMMON.DEFAULT_YES,
                    deleteDt: DEFINE.dateNow(),
                    reason
                }
            }
        },
        {
            new: true
        }
    ).populate({ path: 'vendor', populate: { path: 'part' } }).populate({ path: 'documents', populate: { path: 'part documentGb' } });
};

export default model('VendorLetter', VendorLetterSchema);