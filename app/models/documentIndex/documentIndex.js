import { Schema, model } from 'mongoose';
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
 * @date        2019. 08. 13
 * @description 문서목록 수정
 * @param       {String} id
 * @param       {String} vendor
 * @param       {Array} list
 */
DocumentIndexSchema.statics.editDocumentIndex = function (param) {
    let {
        id,
        vendor,
        list
    } = param;

    return this.findOneAndUpdate(
        { _id: id },
        {
            $set: {
                vendor: vendor,
                list: list,
                'timestamp.updDt': DEFINE.dateNow()
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