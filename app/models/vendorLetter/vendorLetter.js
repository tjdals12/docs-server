import { Schema, model } from 'mongoose';
import { Timestamp, Status } from 'models/common/schema';
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

export default model('VendorLetter', VendorLetterSchema);