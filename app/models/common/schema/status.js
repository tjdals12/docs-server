import { Schema, model } from 'mongoose';
import Timestamp from './Timestamp';
import DEFINE from 'models/common';

/**
 * @author      minz-logger
 * @date        2019. 07. 21
 * @description 문서 상태
 */
const StatusSchema = new Schema({
    status: {
        type: String,
        default: DEFINE.STATUS_CD.CODE_01
    },
    statusName: {
        type: String,
        default: DEFINE.STATUS_CD.CODE_01,
        set: DEFINE.statusConverter
    },
    resultCode: {
        type: String,
        get: DEFINE.resultCodeConverter
    },
    replyCode: {
        type: String,
        get: DEFINE.replyCodeConverter
    },
    timestamp: {
        type: Timestamp.schema,
        default: Timestamp
    }
});

StatusSchema.set('toJSON', { getters: true });

export default model('Status', StatusSchema);