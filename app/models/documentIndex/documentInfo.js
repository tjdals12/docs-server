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
 * @date        2019. 08. 26
 * @description 문서정보 검색
 * @param       {Object} param
 * @param       {String} page
 */
DocumentInfoSchema.statics.searchDocumentInfos = async function (param, page) {
    let {
        vendor,
        documentNumber,
        documentTitle,
        documentGb
    } = param;

    return this.find(
        {
            $and: [
                { vendor: vendor === '' ? { $ne: DEFINE.COMMON.NONE_ID } : vendor },
                { documentNumber: { $regex: documentNumber + '.*', $options: 'i' } },
                { documentTitle: { $regex: documentTitle + '.*', $options: 'i' } },
                { documentGb: documentGb === '' ? { $ne: DEFINE.COMMON.NONE_ID } : documentGb }
            ]
        })
        .skip((page - 1) * 10)
        .limit(10)
        .sort({ 'timestamp.regDt': -1 })
        .populate({ path: 'vendor', populate: { path: 'part' } })
        .populate({ path: 'documentGb' });
};

/**
 * @author minz-logger
 * @date 2019. 08. 26
 * @description 문서정보 검색 카운트
 */
DocumentInfoSchema.statics.searchDocumentInfosCount = async function (param) {
    let {
        vendor,
        documentNumber,
        documentTitle,
        documentGb
    } = param;

    return this.countDocuments(
        {
            $and: [
                { vendor: vendor === '' ? { $ne: DEFINE.COMMON.NONE_ID } : vendor },
                { documentNumber: { $regex: documentNumber + '.*', $options: 'i' } },
                { documentTitle: { $regex: documentTitle + '.*', $options: 'i' } },
                { documentGb: documentGb === '' ? { $ne: DEFINE.COMMON.NONE_ID } : documentGb }
            ]
        }
    );
};

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
DocumentInfoSchema.statics.updateDocumentInfos = async function (id, param) {
    let ids = [];

    for (let i = 0; i < param.length; i++) {
        const { _id, documentNumber, documentTitle, documentGb, plan } = param[i];

        if (!_id) {
            const documentInfo = new this({ vendor: id, documentNumber, documentTitle, documentGb, plan });
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