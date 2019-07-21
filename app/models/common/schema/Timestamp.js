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
        default: DEFINE.SYSTEM
    },
    regDt: {
        type: Date,
        default: new Date()
    },
    updId: {
        type: String,
        default: DEFINE.SYSTEM
    },
    updDt: {
        type: String,
        default: new Date()
    }
});

export default TimestampSchema;