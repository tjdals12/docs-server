import { Schema, model } from 'mongoose';
import { Timestamp } from 'models/common/schema';
import DEFINE from 'models/common';

/**
 * @author      minz-logger
 * @date        2019. 07. 21
 * @description 문서 상태
 */
const StatusSchema = new Schema({
    status: {
        type: String,
        default: DEFINE.STATUS_CD.CODE_01,
        get: DEFINE.statusConverter
    },
    resultCode: {
        type: String
    },
    replyCode: {
        type: String
    },
    timestamp: {
        type: Timestamp,
        default: Timestamp
    }
}, { _id: false, id: false });

StatusSchema.set('toJSON', { getters: true });

export default model('Status', StatusSchema);