import { Schema, model } from 'mongoose';
import { Timestamp } from 'models/common/schema';
import DEFINE from 'models/common';
import removeYn from 'models/documentIndex/removeYn';

/**
 * @author      minz-logger
 * @date        2019. 08. 12
 * @description 문서 정보
 */
const DocumentInfoSchema = new Schema({
    vendor: {
        type: Schema.Types.ObjectId,
        ref: 'Vendor'
    },
    documentNumber: String,
    documentTitle: String,
    documentGb: {
        type: Schema.Types.ObjectId,
        ref: 'Cdminor'
    },
    plan: {
        type: Date,
        default: new Date(DEFINE.COMMON.MAX_END_DT),
        get: DEFINE.dateConverter
    },
    trackingDocument: [{
        type: Schema.Types.ObjectId,
        ref: 'Document'
    }],
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
DocumentInfoSchema.statics.saveDocumentInfos = async function (id, param) {
    let ids = [];

    for (let i = 0; i < param.length; i++) {

        const { documentNumber, documentTitle, documentGb, plan } = param[i];
        const documentInfo = new this({ vendor: id, documentNumber, documentTitle, documentGb, plan: new Date(plan) });
        await documentInfo.save();
        ids.push(documentInfo._id);
    }

    return ids;
};

/**
 * @author      minz-logger
 * @date        2019. 08. 16
 * @description 문서 정보 수정
 * @param       {Object} param
 */
DocumentInfoSchema.statics.updateDocumentInfos = async function (param) {
    let ids = [];

    for (let i = 0; i < param.length; i++) {
        const { _id, documentNumber, documentTitle, documentGb, plan } = param[i];

        if (!_id) {
            const documentInfo = new this({ documentNumber, documentTitle, documentGb, plan });
            await documentInfo.save();

            ids.push(documentInfo._id);
        } else {
            await this.findByIdAndUpdate(
                _id,
                {
                    $set: {
                        documentNumber,
                        documentTitle,
                        documentGb,
                        plan,
                        removeYn: {
                            yn: DEFINE.COMMON.DEFAULT_NO,
                            deleteDt: new Date(DEFINE.COMMON.MAX_END_DT),
                            reason: DEFINE.COMMON.DEFAULT_REASON
                        },
                        'timestamp.updDt': DEFINE.dateNow()
                    }
                }
            );
        }
    }

    return ids;
};

/**
 * @author      minz-logger
 * @date        2019. 08. 16
 * @description 문서 정보 삭제
 * @param       {Object} param
 */
DocumentInfoSchema.statics.deleteDocumentInfos = async function (param) {
    for (let i = 0; i < param.length; i++) {
        const { _id, reason = '인덱스 수정' } = param[i];

        await this.findOneAndUpdate(
            { _id: _id },
            {
                $set: {
                    removeYn: {
                        yn: DEFINE.COMMON.DEFAULT_YES,
                        deleteDt: DEFINE.dateNow(),
                        reason
                    }
                }
            }
        );
    }
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