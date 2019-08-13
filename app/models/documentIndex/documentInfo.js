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
        const { number, title, plan } = param[i];
        const documentInfo = new this({ documentNumber: number, documentTitle: title, plan: new Date(plan) });
        await documentInfo.save();
        ids.push(documentInfo._id);
    }

    return ids;
};

export default model('DocumentInfo', DocumentInfoSchema);