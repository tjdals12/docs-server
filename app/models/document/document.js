import { Schema, model } from 'mongoose';
import { Timestamp } from 'models/common/schema';
import DEFINE from 'models/common';
import InOut from './inOut';
import Status from './status';
import HoldYn from './holdYn';
import deleteYn from './deleteYn';

/**
 * @author      minz-logger
 * @date        2019. 07. 21
 * @description 문서
 */
const DocumentSchema = new Schema({
    vendor: Schema.Types.ObjectId,
    part: {
        type: String,
        default: DEFINE.PART.COMMON,
        get: DEFINE.partConverter
    },
    documentNumber: String,
    documentTitle: String,
    documentInOut: [InOut.schema],
    documentGb: String,
    documentStatus: {
        type: [Status.schema],
        default: Status
    },
    documentRev: String,
    level: {
        type: Number,
        default: 0
    },
    memo: String,
    holdYn: {
        type: [HoldYn.schema],
        default: HoldYn
    },
    deleteYn: {
        type: deleteYn.schema,
        default: deleteYn
    },
    delayGb: {
        type: String,
        default: DEFINE.DELAY_GB.LAZY,
        get: DEFINE.deleyGbConverter
    },
    chainingDocument: {
        type: [Schema.Types.ObjectId],
        default: []
    },
    timestamp: {
        type: Timestamp,
        default: Timestamp
    }
});

DocumentSchema.set('toObject', { getters: true });
DocumentSchema.set('toJSON', { getters: true });

export default model('Document', DocumentSchema);