import { Schema, model } from 'mongoose';
import DEFINE from 'models/common';

/**
 * @author      minz-logger
 * @date        2019. 08. 25
 * @description 공식 문서 삭제 여부
 */
const CancelYnSchema = new Schema({
    yn: {
        type: String,
        default: DEFINE.COMMON.DEFAULT_NO
    },
    deleteDt: {
        type: Date,
        default: DEFINE.dateNow(),
        get: DEFINE.dateConverter
    },
    reason: {
        type: String,
        default: DEFINE.COMMON.DEFAULT_REASON
    }
}, { _id: false, id: false });

CancelYnSchema.set('toJSON', { getters: true });

export default model('CancelYn', CancelYnSchema);