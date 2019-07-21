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
    documentInOut: {
        type: [InOut],
        default: InOut
    },
    documentGb: String,
    documentStatus: {
        type: [Status],
        default: Status
    },
    documentRev: String,
    level: {
        type: Number,
        default: 0
    },
    memo: String,
    holdYn: {
        type: [HoldYn],
        default: HoldYn
    },
    deleteYn: {
        type: deleteYn,
        default: deleteYn
    },
    delayGb: {
        type: String,
        default: DEFINE.DELAY_GB.LAZY,
        get: DEFINE.delayGbConverter
    },
    chaningDocument: [Schema.Types.ObjectId],
    timestamp: {
        type: Timestamp,
        default: Timestamp
    }
});

DocumentSchema.set('toJSON', { getters: true });

export default model('Document', DocumentSchema);