import { Schema, model } from 'mongoose';
import { Timestamp } from 'models/common/schema';
import DEFINE from 'models/common';
import removeYn from './removeYn';

/**
 * @author      minz-logger
 * @date        2019. 08. 12
 * @description 문서 정보
 */
const DocumentInfoSchema = new Schema({
    documentNumber: String,
    documentTitle: String,
    plan: {
        type: Date,
        default: new Date(DEFINE.COMMON.MAX_END_DT),
        get: DEFINE.dateConverter
    },
    trackingDocument: {
        type: Schema.Types.ObjectId,
        ref: 'Document'
    },
    removeYn: {
        type: removeYn.schema,
        default: removeYn
    },
    timestamp: {
        type: Timestamp.schema,
        default: Timestamp
    }
});

/**
 * @author      minz-logger
 * @date        2019. 08. 12
 * @description 문서 정보 추가
 * @param       {Array}
 */
DocumentInfoSchema.statics.saveDocumentInfos = async function (param) {
    let ids = [];

    for (let i = 0; i < param.length; i++) {
        const { documentNumber, documentTitle, plan } = param[i];
        const documentInfo = new this({ documentNumber, documentTitle, plan: new Date(plan) });
        await documentInfo.save();
        ids.push(documentInfo._id);
    }

    return ids;
};

/**
 * @author      minz-logger
 * @date        2019. 08. 13
 * @description 문서 정보 삭제
 * @param       {String} id
 * @param       {String} reason
 */
DocumentInfoSchema.statics.deleteDocumentInfo = function (id, reason) {
    return this.findOneAndUpdate(
        { _id: id },
        {
            $set: {
                removeYn: {
                    yn: DEFINE.COMMON.DEFAULT_YES,
                    deleteDt: DEFINE.dateNow(),
                    reason: reason
                },
            }
        },
        {
            new: true
        }
    ).populate({ path: 'trackingDocument' });
};

export default model('DocumentInfo', DocumentInfoSchema);