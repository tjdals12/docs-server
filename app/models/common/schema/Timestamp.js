import { Schema } from 'mongoose';
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
        type: String,
        default: DEFINE.dateNow()
    },
    updId: {
        type: String,
        default: DEFINE.COMMON.SYSTEM
    },
    updDt: {
        type: String,
        default: DEFINE.dateNow()
    }
}, { _id: false, id: false });

export default TimestampSchema;