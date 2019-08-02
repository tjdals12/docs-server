import { Schema, model } from 'mongoose';
import DEFINE from 'models/common';

/**
 * @author      minz-logger
 * @date        2019. 07. 21
 * @description 공통 데이터 (Timestamp)
 */
const TimestampSchema = new Schema({
    regId: {
        type: String,
        default: DEFINE.COMMON.SYSTEM
    },
    regDt: {
        type: Date,
        default: DEFINE.dateNow,
        get: DEFINE.dateConverter
    },
    updId: {
        type: String,
        default: DEFINE.COMMON.SYSTEM
    },
    updDt: {
        type: Date,
        default: DEFINE.dateNow,
        get: DEFINE.dateConverter
    }
}, { _id: false, id: false });

TimestampSchema.set('toObject', { getters: true });
TimestampSchema.set('toJSON', { getters: true });

export default model('Timestamp', TimestampSchema);