import { Schema, model } from 'mongoose';
import { Timestamp } from 'models/common/schema';
import DocumentInfo from './documentInfo';

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

export default model('DocumentIndex', DocumentIndexSchema);