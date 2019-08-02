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
        type: String,
        default: DEFINE.dateNow,
        get: DEFINE.dateConverter
    },
    effEndDt: {
        type: String,
        default: DEFINE.COMMON.MAX_END_DT
    },
    reason: {
        type: String,
        default: DEFINE.COMMON.DEFAULT_REASON
    }
}, { _id: false, id: false });

export default model('HoldYn', HoldYnSchema);