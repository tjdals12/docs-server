import { Schema, model } from 'mongoose';
import DEFINE from 'models/common';

/**
 * @author      minz-logger
 * @date        2019. 07. 21
 * @description 문서 보류 여부
 */
const HoldYnSchema = new Schema({
    yn: {
        type: String,
        default: DEFINE.COMMON.DEFAULT_NO
    },
    effStaDt: {
        type: Date,
        default: DEFINE.dateNow,
        get: DEFINE.dateConverter
    },
    effEndDt: {
        type: Date,
        default: new Date(DEFINE.COMMON.MAX_END_DT),
        get: DEFINE.dateConverter
    },
    reason: {
        type: String,
        default: DEFINE.COMMON.DEFAULT_REASON
    }
}, { _id: false, id: false });

HoldYnSchema.set('toJSON', { getters: true });

export default model('HoldYn', HoldYnSchema);