import { Schema, model } from 'mongoose';
import { Timestamp } from 'models/common/schema';
import DEFINE from 'models/common';

/**
 * @author      minz-logger
 * @date        2019. 07. 21
 * @description 문서 In / Out 기록
 */
const InOutSchema = new Schema({
    inOutGb: {
        type: String,
        default: DEFINE.IN_OUT_GB.FROM_VENDOR,
        get: DEFINE.inOutGbConverter
    },
    officialNumber: String,
    timestamp: {
        type: Timestamp.schema,
        default: Timestamp
    }
});

InOutSchema.set('toOjbect', { getters: true });
InOutSchema.set('toJSON', { getters: true });

export default model('InOut', InOutSchema);