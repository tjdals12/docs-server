import { Schema, model } from 'mongoose';
import { Timestamp, Status } from 'models/common/schema';
import Vendor from 'models/vendor/vendor';
import Document from 'models/document/document';
import DEFINE from 'models/common';

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

export default model('VendorLetter', VendorLetterSchema);